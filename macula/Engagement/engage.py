import cv2
import time
from datetime import datetime
from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['macula']
collection = db['engagement_data']

# Variables for tracking time and status
start_time = None
focused_start_time = None
total_focused_time = 0
total_distracted_time = 0
max_focused_time = 0

# Function to update attendance log
def update_attendance_log(status):
    global start_time, focused_start_time, total_focused_time, total_distracted_time, max_focused_time
    current_time = time.time()
    if start_time is None:
        start_time = current_time
    else:
        time_diff = current_time - start_time
        if status == 'focused':
            total_focused_time += time_diff
            if focused_start_time is None:
                focused_start_time = current_time
            else:
                focused_time = current_time - focused_start_time
                if focused_time > max_focused_time:
                    max_focused_time = focused_time
        elif status == 'distracted':
            total_distracted_time += time_diff
        start_time = current_time

# Function to detect attentiveness based on face movement
def detect_attentiveness(student_id, classroom_id):
    global focused_start_time
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    cap = cv2.VideoCapture(0)

    prev_face_location = None
    movement_threshold = 8  # Adjust according to sensitivity of movement detection

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        if len(faces) > 0:
            x, y, w, h = faces[0]
            current_face_location = (x, y, w, h)

            if prev_face_location is not None:
                movement = sum([abs(curr - prev) for curr, prev in zip(current_face_location, prev_face_location)])
                if movement > movement_threshold:
                    status = 'focused'
                else:
                    status = 'distracted'
            else:
                status = 'focused'

            prev_face_location = current_face_location

        else:
            status = 'away'
            if prev_face_location is not None:
           #     update_attendance_log(status)

                # Update MongoDB collection
                engagement_data = {
                    "studentID": student_id,
                    "classroomID": classroom_id,
                    "Engagement Status": status,
                    "Focus Duration": total_focused_time,
                    "Distracted Duration": total_distracted_time,
                    "Longest Focus Duration": max_focused_time
                }
                collection.update_one({"studentID": student_id, "classroomID": classroom_id}, {"$set": engagement_data}, upsert=True)

                print(f"Total Focused Time: {total_focused_time} seconds")
                print(f"Total Distracted Time: {total_distracted_time} seconds")
                print(f"Longest Time Stayed Focused Continuously: {max_focused_time} seconds")

            prev_face_location = None

        # Display status on webcam
        cv2.putText(frame, f'Status: {status}', (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        cv2.imshow('Webcam', frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

        # time.sleep(15)  # Wait for 15 seconds before updating status

    cap.release()
    cv2.destroyAllWindows()

# Directly integrating the functionality into the script
student_id = '1'
classroom_id = '5678'
detect_attentiveness(student_id, classroom_id)

