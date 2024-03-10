import os
import cv2
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.optimizers import Adam

class ImageClassifier:
    def __init__(self, data_dir, image_size=(64, 64), batch_size=32, epochs=10):
        self.data_dir = data_dir
        self.image_size = image_size
        self.batch_size = batch_size
        self.epochs = epochs

        self.model = self.build_model()
        self.train_generator, self.validation_generator = self.create_data_generators()

    def build_model(self):
        model = Sequential()
        model.add(Conv2D(32, (3, 3), activation='relu', input_shape=(self.image_size[0], self.image_size[1], 3)))
        model.add(MaxPooling2D(2, 2))
        model.add(Conv2D(64, (3, 3), activation='relu'))
        model.add(MaxPooling2D(2, 2))
        model.add(Flatten())
        model.add(Dense(128, activation='relu'))
        model.add(Dense(1, activation='sigmoid'))

        model.compile(optimizer=Adam(), loss='binary_crossentropy', metrics=['accuracy'])
        return model

    def create_data_generators(self):
        datagen = ImageDataGenerator(rescale=1./255, validation_split=0.2)

        train_generator = datagen.flow_from_directory(
            self.data_dir,
            target_size=self.image_size,
            batch_size=self.batch_size,
            class_mode='binary',
            subset='training'
        )

        validation_generator = datagen.flow_from_directory(
            self.data_dir,
            target_size=self.image_size,
            batch_size=self.batch_size,
            class_mode='binary',
            subset='validation'
        )

        return train_generator, validation_generator

    def train_model(self):
        history = self.model.fit(
            self.train_generator,
            epochs=self.epochs,
            validation_data=self.validation_generator
        )

    def classify_from_webcam(self):
        cap = cv2.VideoCapture(0)

        while True:
            ret, frame = cap.read()

            if not ret:
                break

            resized_frame = cv2.resize(frame, self.image_size)
            normalized_frame = resized_frame / 255.0
            input_data = np.expand_dims(normalized_frame, axis=0)

            prediction = self.model.predict(input_data)
            focus_status = "Focused" if prediction > 0.5 else "Distracted"

            cv2.putText(frame, focus_status, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            cv2.imshow('Focus Classification', frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    dataset_path = './dataset'
    classifier = ImageClassifier(data_dir=dataset_path)
    classifier.train_model()
    classifier.classify_from_webcam()
