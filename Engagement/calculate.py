import cv2
import dlib

# Load the pre-trained facial landmark predictor
predictor_path = "shape_predictor_68_face_landmarks.dat"  # Download from http://dlib.net/files/shape_predictor_68_face_landmarks.dat.bz2
predictor = dlib.shape_predictor(predictor_path)

# Initialize the face detector
detector = dlib.get_frontal_face_detector()

# Open the camera
cap = cv2.VideoCapture(0)

# Initialize a list to store vertical distances
vertical_distances = []

while True:
    ret, frame = cap.read()

    if not ret:
        break

    # Convert the frame to grayscale
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Detect faces in the grayscale image
    faces = detector(gray)

    for face in faces:
        # Use facial landmarks to determine gaze direction
        landmarks = predictor(gray, face)

        # Calculate the vertical distance between the left and right eyes
        eye_avg_y = (landmarks.part(37).y + landmarks.part(38).y + landmarks.part(43).y + landmarks.part(44).y) // 4
        vertical_distances.append(eye_avg_y)

        # Draw a rectangle around the face
        x, y, w, h = face.left(), face.top(), face.width(), face.height()
        cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)

    # Display the frame
    cv2.imshow('Face Analysis', frame)

    # Break the loop if 'q' key is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the video capture object and close the window
cap.release()
cv2.destroyAllWindows()

# Calculate average vertical distance
average_distance = sum(vertical_distances) / len(vertical_distances)

# Set a threshold multiplier (adjust as needed)
threshold_multiplier = 1.5

# Calculate dynamic threshold
dynamic_threshold = average_distance * threshold_multiplier

print(f"Average Vertical Distance: {average_distance}")
print(f"Dynamic Threshold: {dynamic_threshold}")
