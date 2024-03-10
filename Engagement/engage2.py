import cv2
import numpy as np
from tensorflow.keras.models import load_model

class DistractedClassifier:
    def __init__(self, model_path='distracted_classification_model.h5'):
        # Load the pre-trained distracted classification model
        self.model = load_model(model_path)

    def classify_frame(self, frame):
        # Preprocess the frame for prediction
        resized_frame = cv2.resize(frame, (64, 64))
        normalized_frame = resized_frame / 255.0
        input_data = np.expand_dims(normalized_frame, axis=0)
        input_data = np.expand_dims(input_data, axis=-1)

        # Make a prediction using the model
        prediction = self.model.predict(input_data)

        # Use the prediction to determine focus status
        focused = prediction > 0.5

        # Display the focus status on the frame
        status_text = "Focused" if focused else "Distracted"
        cv2.putText(frame, status_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)

        return frame, focused

    def classify_from_webcam(self):
        # Capture video from the webcam
        cap = cv2.VideoCapture(0)

        while True:
            ret, frame = cap.read()

            if not ret:
                break

            # Classify the frame
            frame, focused = self.classify_frame(frame)

            # Display the frame
            cv2.imshow('Distracted Classification', frame)

            # Break the loop if 'q' key is pressed
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        # Release the video capture object and close the window
        cap.release()
        cv2.destroyAllWindows()

        return focused

# Example Usage
if __name__ == "__main__":
    classifier = DistractedClassifier()
    focused_status = classifier.classify_from_webcam()

    if focused_status:
        print("Person is Focused")
    else:
        print("Person is Distracted")
