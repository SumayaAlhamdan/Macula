import cv2
import time
from pymongo import MongoClient

# MongoDB connection details
mongo_uri = "mongodb+srv://nesreengdb:macula2024@macula.svwywkc.mongodb.net/macula?retryWrites=true&w=majority&appName=Macula"
collection_name = "engagement_data"  # Replace with your MongoDB collection name

# Connect to MongoDB
client = MongoClient(mongo_uri)
db = client.get_database()
collection = db[collection_name]

# Threshold for face movement (adjust as needed)
movement_threshold = 10

# Initialize variables
prev_face_location = None
start_time_focus = 0
end_time_focus = 0
longest_focus_duration = 0
SID = "1234"  # fix to send the actual student
CID = "4321"  # fix to the actual course

# Capture video from the webcam
cap = cv2.VideoCapture(0)

# Initialize face cascade outside the loop
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

while True:
    ret, frame = cap.read()

    if not ret:
        break

    # Convert the frame to grayscale for face detection
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Detect faces using Haarcascades
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5, minSize=(30, 30))

    # Assess engagement based on face movement
    if len(faces) > 0:
        x, y, w, h = faces[0]
        current_face_location = (x, y, w, h)

        if prev_face_location is not None:
            movement = sum([abs(curr - prev) for curr, prev in zip(current_face_location, prev_face_location)])
            if movement > movement_threshold:
                start_time_focus = time.time()
                print("Focused")
        else:
            start_time_focus = time.time()
            print("Focused")

        prev_face_location = current_face_location

    else:
        # No face detected
        if prev_face_location is not None:
            end_time_focus = time.time()
            focus_duration = end_time_focus - start_time_focus

            # Store engagement data in MongoDB
            collection.insert_one({
                'studentID': SID,
                'courseID': CID,
                'Timestamp': time.time(),
                'Engagement Status': 'Focused' if focus_duration > 1 else 'Distracted',
                'Focus Duration': focus_duration,
                'Longest Focus Duration': longest_focus_duration
            })

            # Update the longest focus duration if needed
            if focus_duration > longest_focus_duration:
                longest_focus_duration = focus_duration

            print(f"Distracted for {focus_duration} seconds")
            print(f"Longest Focus Duration: {longest_focus_duration} seconds")

            prev_face_location = None

    # Display the frame
    cv2.imshow('Engagement Analysis', frame)

    # Break the loop if 'q' key is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the video capture object, close the window, and disconnect from MongoDB
cap.release()
cv2.destroyAllWindows()
client.close()
