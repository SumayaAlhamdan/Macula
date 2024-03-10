#!/usr/bin/env python3
import os
import cv2
import sys
import dlib
import argparse
import numpy as np
import mediapipe as mp
import pandas as pd
import joblib

# Load YOLOv7 model and class names
yolo_net = cv2.dnn.readNet('yolov7-tiny.weights', 'yolov7.cfg')
with open('coco.names', 'r') as f:
    yolo_classes = [line.strip() for line in f.readlines()]

# Load pre-trained face detection model from MediaPipe
mp_face_detection = mp.solutions.face_detection
mp_hands = mp.solutions.hands
mp_face_mesh = mp.solutions.face_mesh

face_detection = mp_face_detection.FaceDetection(min_detection_confidence=0.2)


def extract_head_pose(face_landmarks):
    # Check if face landmarks are present
    if not face_landmarks:
        return 0.0, 0.0

    # Extract landmarks for the nose tip, left eye, and right eye
    nose_tip = face_landmarks[0].landmark[4]
    left_eye = face_landmarks[0].landmark[159]
    right_eye = face_landmarks[0].landmark[386]

    # Calculate the direction vectors for eyes and nose
    nose_direction = np.array([nose_tip.x - (left_eye.x + right_eye.x) / 2, nose_tip.y - (left_eye.y + right_eye.y) / 2])
    left_eye_direction = np.array([left_eye.x - nose_tip.x, left_eye.y - nose_tip.y])
    right_eye_direction = np.array([right_eye.x - nose_tip.x, right_eye.y - nose_tip.y])

    # Normalize the vectors
    nose_direction /= np.linalg.norm(nose_direction)
    left_eye_direction /= np.linalg.norm(left_eye_direction)
    right_eye_direction /= np.linalg.norm(right_eye_direction)

    # Calculate the angles between the vectors (in degrees)
    angle_x = np.degrees(np.arctan2(nose_direction[1], nose_direction[0]))
    angle_y = np.degrees(np.arctan2(left_eye_direction[1], left_eye_direction[0]))
    angle_z = np.degrees(np.arctan2(right_eye_direction[1], right_eye_direction[0]))

    return angle_x, angle_y, angle_z


def determine_head_pose(angle_x, angle_y, angle_z):
    # Determine head pose based on the angles
    if -30 <= angle_y <= 30 and -30 <= angle_z <= 30:
        pose = 'forward'
    elif angle_y < -30:
        pose = 'left'
    elif angle_y > 30:
        pose = 'right'
    else:
        pose = 'undetermined'

    return pose


class WebcamAttentionClassifier:
    def __init__(self, model_path='./student_attention_model.joblib'):
        self.model_path = model_path
        self.model = None
        self.video_capture = None

    def load_model(self):
        # Load the pre-trained model
        self.model = joblib.load(self.model_path)

    def start_webcam(self):
        # Start capturing video from the webcam
        self.video_capture = cv2.VideoCapture(0)

    def stop_webcam(self):
        # Release the webcam
        if self.video_capture:
            self.video_capture.release()
            cv2.destroyAllWindows()

    def mobile_phone_detection(self, frame):
        height, width, _ = frame.shape
        blob = cv2.dnn.blobFromImage(frame, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
        yolo_net.setInput(blob)
        outs = yolo_net.forward(self.get_output_layers(yolo_net))

        class_ids = []
        confidences = []
        boxes = []

        for out in outs:
            for detection in out:
                scores = detection[5:]
                class_id = np.argmax(scores)
                confidence = scores[class_id]
                if confidence > 0.6 and class_id in [67, 68]:  # Assuming 67 is 'cell phone' and 68 is 'remote'
                    center_x, center_y, w, h = (detection[0:4] * np.array([width, height, width, height])).astype('int')
                    x, y = int(center_x - w / 2), int(center_y - h / 2)
                    class_ids.append(class_id)
                    confidences.append(float(confidence))
                    boxes.append([x, y, w, h])

        indexes = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.4)

        phone_detected = 0
        phone_x, phone_y, phone_w, phone_h, phone_con = 0, 0, 0, 0, 0.0

        for i in range(len(boxes)):
            if i in indexes:
                phone_detected = 1
                x, y, w, h = boxes[i]
                phone_x, phone_y, phone_w, phone_h, phone_con = x, y, w, h, confidences[i]

        return phone_detected, phone_x, phone_y, phone_w, phone_h, phone_con

    def get_output_layers(self, net):
        layer_names = net.getUnconnectedOutLayersNames()
        return [layer_names[i[0] - 1] for i in net.getUnconnectedOutLayers()]

    def extract_features(self, frame):
        # Face Detection
        with face_detection:
            results = face_detection.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            if results.detections:
                faces = [(int(detection.location_data.relative_bounding_box.xmin * frame.shape[1]),
                          int(detection.location_data.relative_bounding_box.ymin * frame.shape[0]),
                          int(detection.location_data.relative_bounding_box.width * frame.shape[1]),
                          int(detection.location_data.relative_bounding_box.height * frame.shape[0]))
                         for detection in results.detections]
            else:
                faces = []

        # Hand Tracking
        with mp_hands.Hands(min_detection_confidence=0.2, min_tracking_confidence=0.2) as hands:
            results = hands.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            if results.multi_hand_landmarks:
                no_of_hands = len(results.multi_hand_landmarks)
            else:
                no_of_hands = 0

        # Head Pose Estimation
        with mp_face_mesh.FaceMesh(min_detection_confidence=0.2, min_tracking_confidence=0.2) as face_mesh:
            results = face_mesh.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            if results.multi_face_landmarks:
                # Extract head pose features
                pose_x, pose_y = extract_head_pose(results.multi_face_landmarks[0])
                pose = determine_head_pose(pose_x, pose_y)
            else:
                pose_x, pose_y, pose = 0.0, 0.0, 'forward'

        # Mobile Phone Detection
        phone, phone_x, phone_y, phone_w, phone_h, phone_con = self.mobile_phone_detection(frame)

        # Compile features
        features_list = [{
            'no_of_face': len(faces),
            'face_x': faces[0][0], 'face_y': faces[0][1], 'face_w': faces[0][2], 'face_h': faces[0][3],
            'no_of_hand': no_of_hands,
            'pose': pose, 'pose_x': pose_x, 'pose_y': pose_y,
            'phone': phone, 'phone_x': phone_x, 'phone_y': phone_y, 'phone_w': phone_w,
            'phone_h': phone_h, 'phone_con': phone_con
        }]

        return features_list

    def classify_attentiveness(self, features):
        # Convert features to DataFrame for prediction
        input_data = pd.DataFrame(features)

        # Make prediction using the pre-trained model
        predictions = self.model.predict(input_data)

        return predictions

    def classify_webcam_feed(self):
        while True:
            # Capture video frame-by-frame
            ret, frame = self.video_capture.read()

            # Extract features from detected faces, hands, head pose, and mobile phone
            features_list = self.extract_features(frame)

            # Check if features_list is not empty before making predictions
            if not features_list:
                # If no faces detected, display a message or perform some action
                cv2.putText(frame, "No face detected", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)
            else:
                # Classify attentiveness based on the extracted features
                predictions = self.classify_attentiveness(features_list)

                # Display the result on the frame
                for i, face in enumerate(features_list):
                    x, y, w, h = face['face_x'], face['face_y'], face['face_w'], face['face_h']
                    label = "Attentive" if predictions[i] == 0 else "Inattentive"
                    cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
                    cv2.putText(frame, label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

            # Display the resulting frame
            cv2.imshow('Webcam Feed', frame)

            # Break the loop if 'q' key is pressed
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

    def run_classification(self):
        try:
            self.load_model()
            self.start_webcam()
            self.classify_webcam_feed()
        finally:
            self.stop_webcam()

# Example usage
if __name__ == "__main__":
    webcam_classifier = WebcamAttentionClassifier()
    webcam_classifier.run_classification()

