import cv2
print(cv2.data.haarcascades)
import numpy as np

class AttentivenessDetector:
    def __init__(self):
        # Initialize head pose estimator
        self.head_pose_estimator = HeadPoseEstimator()
        # Load pre-trained eye detector
        self.eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')

    def detect_attentiveness(self, image):
        # Estimate head pose
        head_pose_angles = self.head_pose_estimator.estimate_head_pose(image)

        # Detect eyes
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        eyes = self.eye_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        # If head pose and eye detection successful
        if head_pose_angles is not None and len(eyes) > 0:
            # Extract yaw (Z-axis rotation) from head pose angles
            yaw_angle = head_pose_angles[1]

            # Check if yaw angle is within a certain range (indicating facing forward)
            if -15 < yaw_angle < 15:
                return "focused"
            else:
                return "distracted"
        else:
            return "away"  # If no face detected or eyes found, assume person is away

class HeadPoseEstimator:
    def __init__(self):
        # Load pre-trained face detector and facial landmark predictor
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        self.landmark_predictor = cv2.face.createFacemarkLBF()
        self.landmark_predictor.loadModel(cv2.data.haarcascades + 'lbfmodel.yaml')

    def estimate_head_pose(self, image):
        # Convert image to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Detect faces in the grayscale image
        faces = self.face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        for (x, y, w, h) in faces:
            # Detect facial landmarks
            _, landmarks = self.landmark_predictor.fit(gray, np.array([[(x, y), (x + w, y + h)]]))

            if len(landmarks) > 0:
                # Extract relevant facial landmarks (e.g., corners of the eyes)
                left_eye = landmarks[0][0][36:42]
                right_eye = landmarks[0][0][42:48]

                # Compute the head pose using the eye landmarks
                rotation_vector, _ = cv2.solvePnP(self.get_head_pose_points(left_eye, right_eye), 
                                                   np.array([[0, 0, 0], [0, 0, 1], [0, 1, 0]]), 
                                                   cameraMatrix=None, distCoeffs=None)

                # Convert rotation vector to Euler angles
                head_pose_angles = cv2.Rodrigues(rotation_vector)[0]

                return head_pose_angles

        # If no faces or landmarks detected, return None
        return None

    def get_head_pose_points(self, left_eye, right_eye):
        # Compute the midpoint between the eyes
        midpoint = (left_eye.mean(axis=0) + right_eye.mean(axis=0)) / 2

        # Compute the vertical distance between the eyes
        eye_distance = np.linalg.norm(left_eye[0] - right_eye[3])

        # Define 3D points representing the eyes and midpoint
        head_pose_points = np.array([
            [midpoint[0], midpoint[1] - 0.5 * eye_distance, 0],  # Nose tip
            [midpoint[0], midpoint[1], 0],  # Midpoint between eyes
            [midpoint[0] - 0.5 * eye_distance, midpoint[1], 0]  # Left eye corner
        ])

        return head_pose_points

# Initialize AttentivenessDetector
detector = AttentivenessDetector()

# Capture video from webcam
cap = cv2.VideoCapture(0)

while True:
    # Read a frame from the video capture
    ret, frame = cap.read()
    if not ret:
        break

    # Detect attentiveness
    attentiveness_status = detector.detect_attentiveness(frame)

    # Display the attentiveness status on the frame
    cv2.putText(frame, f'Attentiveness: {attentiveness_status}', (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    # Display the frame
    cv2.imshow('Webcam', frame)

    # Break the loop if 'q' key is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the video capture and close all windows
cap.release()
cv2.destroyAllWindows()
