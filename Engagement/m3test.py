import cv2
import numpy as np
import joblib
import mediapipe as mp

class FeatureExtractor:
    def __init__(self, model_path):
        # Initialize face detector
        self.face_detection = mp.solutions.face_detection.FaceDetection(min_detection_confidence=0.5)
        # Initialize face mesh
        self.face_mesh = mp.solutions.face_mesh.FaceMesh(static_image_mode=False, min_detection_confidence=0.5, min_tracking_confidence=0.5)
        # Initialize hands detector
        self.hands = mp.solutions.hands.Hands(min_detection_confidence=0.5, min_tracking_confidence=0.5)
        # Load the trained model
        self.model = joblib.load(model_path)

    def detect_faces(self, image):
        # Detect faces in the image
        results = self.face_detection.process(image)
        faces = []

        if results.detections:
            for detection in results.detections:
                bboxC = detection.location_data.relative_bounding_box
                ih, iw, _ = image.shape
                bbox = int(bboxC.xmin * iw), int(bboxC.ymin * ih), \
                        int(bboxC.width * iw), int(bboxC.height * ih)
                faces.append({
                    'face_x': bbox[0],
                    'face_y': bbox[1],
                    'face_w': bbox[2],
                    'face_h': bbox[3],
                    'face_con': detection.score
                })

        return faces

    def detect_hands(self, image):
        # Detect hands in the image
        results = self.hands.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
        num_hands = 0

        if results.multi_hand_landmarks:
            num_hands = len(results.multi_hand_landmarks)

        return num_hands

    def detect_face_mesh(self, image):
        # Detect face mesh in the image
        results = self.face_mesh.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
        face_data = {}

        if results.multi_face_landmarks:
            for face_landmarks in results.multi_face_landmarks:
                pose_x = int(face_landmarks.landmark[1].x * image.shape[1])
                pose_y = int(face_landmarks.landmark[1].y * image.shape[0])

                # Determine pose based on pose_x and pose_y
                if pose_y > 15:
                    pose = 'Right'
                elif pose_y < -10:
                    pose = 'Left'
                elif pose_x < -10:
                    pose = 'Down'
                else:
                    pose = 'Forward'

                face_data['pose'] = pose
                face_data['pose_x'] = pose_x
                face_data['pose_y'] = pose_y
                break  # Considering only the first face detected

        return face_data

    def detect_phone(self, image):
        # Function for phone detection using YOLOv4 (to be implemented)
        pass

    def extract_features(self, image):
        # Extract all features from the image
        faces = self.detect_faces(image)
        num_hands = self.detect_hands(image)
        face_mesh_data = self.detect_face_mesh(image)
        phone_data = self.detect_phone(image)  # To be implemented

        # Combine all features into a single dictionary
        features = {
            'no_of_faces': len(faces),
            'faces': faces,
            'no_of_hands': num_hands,
            'face_mesh': face_mesh_data,
            'phone': {
        'phone_presence': 0,    # 1: Phone detected
        'phone_x': 0,         # Example x-coordinate
        'phone_y': 0,         # Example y-coordinate
        'phone_w': 0,          # Example width
        'phone_h': 0,         # Example height
        'phone_con': 0        # Example confidence score
            }  # Add phone data once implemented
        }

        return features

    def predict_attentiveness(self, features):
        # Extract necessary features for prediction
        no_of_faces = features['no_of_faces']
        no_of_hands = features['no_of_hands']
        pose_x = features['face_mesh']['pose_x']
        pose_y = features['face_mesh']['pose_y']
        phone_presence = features['phone']['phone_presence']
        phone_x = features['phone']['phone_x']
        phone_y = features['phone']['phone_y']
        phone_w = features['phone']['phone_w']
        phone_h = features['phone']['phone_h']
        phone_con = features['phone']['phone_con']
        
        # Extract face information
        faces = features['faces']
        face_x = [face['face_x'] for face in faces]
        face_y = [face['face_y'] for face in faces]
        face_w = [face['face_w'] for face in faces]
        face_h = [face['face_h'] for face in faces]
        face_con = [face['face_con'] for face in faces]

        # Flatten face-related features
        face_x_flat = np.array(face_x).flatten()
        face_y_flat = np.array(face_y).flatten()
        face_w_flat = np.array(face_w).flatten()
        face_h_flat = np.array(face_h).flatten()
        face_con_flat = np.array(face_con).flatten()

        # Convert features to numpy array for prediction
        features_array = np.array([[
            no_of_faces,
            *face_x_flat, *face_y_flat, *face_w_flat, *face_h_flat, *face_con_flat,
            no_of_hands, pose_x, pose_y,
            phone_presence, phone_x, phone_y, phone_w, phone_h, phone_con
        ]])

        # Predict attentiveness using the trained model
        attentiveness_prediction = self.model.predict(features_array)

        return attentiveness_prediction



if __name__ == "__main__":
    # Path to the trained model
    model_path = 'student_attention_model.joblib'

    # Initialize feature extractor
    extractor = FeatureExtractor(model_path)

    # Open webcam
    cap = cv2.VideoCapture(0)

    while True:
        # Read frame from webcam
        ret, frame = cap.read()

        if not ret:
            break

        # Extract features from the frame
        features = extractor.extract_features(frame)

        # Predict attentiveness
        attentiveness_prediction = extractor.predict_attentiveness(features)

        # Display attentiveness prediction (for demonstration)
        print("Attentiveness prediction:", attentiveness_prediction)

        # Display the frame
        cv2.imshow('Frame', frame)

        # Break the loop if 'q' key is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Release the video capture object and close the window
    cap.release()
    cv2.destroyAllWindows()
