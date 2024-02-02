import cv2
import dlib

# Load the pre-trained facial landmark predictor
predictor_path = "shape_predictor_68_face_landmarks.dat"  # Download from http://dlib.net/files/shape_predictor_68_face_landmarks.dat.bz2
predictor = dlib.shape_predictor(predictor_path)

# Initialize the face detector
detector = dlib.get_frontal_face_detector()

def analyze_face(frame):
    # Convert the frame to grayscale
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Detect faces in the grayscale image
    faces = detector(gray)

    if not faces:
        # No face detected, handle this case (e.g., set a default status)
        status_text = "Away"
        cv2.putText(frame, status_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
    else:
        for face in faces:
            # Draw a rectangle around the face
            x, y, w, h = face.left(), face.top(), face.width(), face.height()
            cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)

            # Use facial landmarks to determine gaze direction
            landmarks = predictor(gray, face)

            # Example: Calculate the average y-coordinate of the eyes
            eye_avg_y = (landmarks.part(37).y + landmarks.part(38).y + landmarks.part(43).y + landmarks.part(44).y) // 4

            # Set a threshold for focus
            focus_threshold = 13

            # Check if the eyes are within the threshold for focus
            focused = abs(eye_avg_y - landmarks.part(40).y) < focus_threshold

            # Display the focus status
            status_text = "Focused" if focused else "Distracted"
            cv2.putText(frame, status_text, (x, y + h + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)

    return frame

# Capture video from the webcam
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()

    if not ret:
        break

    # Analyze the face in the current frame
    frame = analyze_face(frame)

    # Display the frame
    cv2.imshow('Face Analysis', frame)

    # Break the loop if 'q' key is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the video capture object and close the window
cap.release()
cv2.destroyAllWindows()
