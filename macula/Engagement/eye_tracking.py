import cv2
import dlib

def get_eye_position(shape):
    left_eye_indices = list(range(36, 42))
    right_eye_indices = list(range(42, 48))

    left_eye = [(shape.part(i).x, shape.part(i).y) for i in left_eye_indices]
    right_eye = [(shape.part(i).x, shape.part(i).y) for i in right_eye_indices]

    return left_eye, right_eye

def calculate_engagement(left_eye, right_eye):
    # Calculate the horizontal distance between the eyes
    eye_distance = abs(left_eye[3][0] - right_eye[0][0])

    # Define a threshold for engagement
    engagement_threshold = 48  # Adjust as needed

    # Check if the eyes are within the engagement threshold
    return eye_distance < engagement_threshold

def check_eye_movement():
    # Load the pre-trained facial landmark predictor
    predictor_path = "shape_predictor_68_face_landmarks.dat"
    predictor = dlib.shape_predictor(predictor_path)

    # Initialize the face detector
    detector = dlib.get_frontal_face_detector()

    # Open the webcam
    cap = cv2.VideoCapture(0)

    while True:
        # Read a frame from the webcam
        ret, frame = cap.read()

        # Convert the frame to grayscale
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Detect faces in the grayscale frame
        faces = detector(gray)

        for face in faces:
            # Detect facial landmarks
            shape = predictor(gray, face)

            # Get eye positions
            left_eye, right_eye = get_eye_position(shape)

            # Draw rectangles around the eyes
            cv2.rectangle(frame, (left_eye[0][0], left_eye[1][1]),
                          (left_eye[3][0], left_eye[4][1]), (0, 255, 0), 2)
            cv2.rectangle(frame, (right_eye[0][0], right_eye[1][1]),
                          (right_eye[3][0], right_eye[4][1]), (0, 255, 0), 2)

            # Check engagement
            engaged = calculate_engagement(left_eye, right_eye)

            # Display engagement status
            status_text = "Engaged" if engaged else "Disengaged"
            cv2.putText(frame, f"{status_text}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)


        # Display the frame
        cv2.imshow("Eye Tracking", frame)

        # Break the loop if 'q' key is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Release the webcam and close all windows
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    check_eye_movement()
