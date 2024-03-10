import cv2
import dlib
import time
import numpy as np
from pymongo import MongoClient
from tensorflow.keras.models import load_model

# Load the pre-trained facial landmark predictor
predictor_path = "shape_predictor_68_face_landmarks.dat"
predictor = dlib.shape_predictor(predictor_path)

# Initialize the face detector
detector = dlib.get_frontal_face_detector()

# Global variables for focus analysis
start_time_focus = 0
end_time_focus = 0

# List to store focus statuses
focus_status_list = []

# Load the pre-trained model
model = load_model('facial_analysis_model.h5')  # Replace with the path to your model file

# MongoDB connection details
mongo_uri = "mongodb+srv://nesreengdb:macula2024@macula.svwywkc.mongodb.net/?retryWrites=true&w=majority&appName=Macula"  # Replace with your MongoDB connection URI
database_name = "macula"  # Replace with your MongoDB database name
collection_name = "macula.engage"  # Replace with your MongoDB collection name

# Connect to MongoDB
client = MongoClient(mongo_uri)
db = client[database_name]
collection = db[collection_name]

def analyze_face(frame):
    global start_time_focus, end_time_focus

    # Resize the frame to match the input shape expected by the model
    resized_frame = cv2.resize(frame, (64, 64))

    # Convert the resized frame to RGB (assuming your webcam captures grayscale)
    rgb_frame = cv2.cvtColor(resized_frame, cv2.COLOR_GRAY2RGB)

    # Convert the RGB frame to grayscale for facial analysis
    gray = cv2.cvtColor(resized_frame, cv2.COLOR_BGR2GRAY)

    # Normalize the pixel values to be between 0 and 1
    normalized_frame = gray / 255.0

    # Expand dimensions to match the input shape expected by the model
    input_data = np.expand_dims(normalized_frame, axis=0)
    input_data = np.expand_dims(input_data, axis=-1)

    # Make a prediction using the model
    prediction = model.predict(input_data)

    # Use the prediction to determine focus status (you might need to adjust this based on your model output)
    focused = prediction[0][0] > 0.5

    # Display the focus status
    status_text = "Focused" if focused else "Distracted"
    print(status_text)
    cv2.putText(frame, status_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)

    return frame

# Capture video from the webcam
cap = cv2.VideoCapture(0)

# Set the interval for measuring focus status (30 seconds)
interval_duration = 30  # seconds
start_time = time.time()
end_time = start_time + interval_duration

while True:
    ret, frame = cap.read()

    if not ret:
        break

    # Analyze the face in the current frame
    frame = analyze_face(frame)

    # Display the frame
    cv2.imshow('Face Analysis', frame)

    # Check if the interval has elapsed
    current_time = time.time()
    if current_time >= end_time:
        # Calculate and save average focus status to MongoDB
        most_common_status = max(set(focus_status_list), key=focus_status_list.count) if focus_status_list else "Unknown"
        collection.insert_one({
            'Timestamp': end_time,
            'Average Focus Status': most_common_status,
            'Time Stayed Focused': end_time_focus - start_time_focus
        })

        print(f"Average Focus Status ({interval_duration} seconds): {most_common_status}")
        print(f"Time Stayed Focused: {end_time_focus - start_time_focus} seconds")

        # Reset variables for the next measurement
        start_time = current_time
        end_time = start_time + interval_duration
        focus_status_list = []
        start_time_focus = 0
        end_time_focus = 0

    # Break the loop if 'q' key is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the video capture object, close the window, and disconnect from MongoDB
cap.release()
cv2.destroyAllWindows()
client.close()
