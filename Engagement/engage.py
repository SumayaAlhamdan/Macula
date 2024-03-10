import cv2
import numpy as np
from tensorflow.keras.models import load_model
import dlib

# Load the trained facial analysis model
model = load_model('facial_analysis_model.h5')  # Replace with the actual path to your saved model

# Load the pre-trained facial landmark predictor (assuming you've already downloaded it)
predictor_path = "shape_predictor_68_face_landmarks.dat"
predictor = dlib.shape_predictor(predictor_path)

# Initialize the face detector
detector = dlib.get_frontal_face_detector()

# Function to analyze face using the trained model
def analyze_face(frame):
    # Convert the frame to the required size (64x64) and normalize pixel values
    frame = cv2.resize(frame, (64, 64))
    frame = frame / 255.0
    
    # Reshape the frame to match the input shape expected by the model
    frame = np.reshape(frame, (1, 64, 64, 3))
    
    # Predict the focus status (0 for distracted, 1 for focused)
    prediction = model.predict(frame)
    
    # Display the focus status on the frame
    status_text = "Focused" if prediction > 0.5 else "Distracted"
   # print(status_text)
    cv2.putText(frame, status_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
    
    return frame

# Capture video from the webcam
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()

    if not ret:
        break

    # Analyze the face in the current frame
    analyzed_frame = analyze_face(frame)

    # Display the analyzed frame
    cv2.imshow('Facial Analysis', analyzed_frame[0])
    cv2.resizeWindow('Facial Analysis', 400, 400)  # Adjust the size as needed


    # Break the loop if 'q' key is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the video capture object and close the window
cap.release()
cv2.destroyAllWindows()
