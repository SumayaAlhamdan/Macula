import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib

class StudentAttentionClassifier:
    def __init__(self, dataset_path):
        self.dataset_path = dataset_path
        self.data = None
        self.features = None
        self.labels = None
        self.model = None

    def load_dataset(self):
        # Load dataset from CSV
        self.data = pd.read_csv(self.dataset_path)

        # Separate features and labels
        self.features = self.data.drop(columns=['label'])
        self.labels = self.data['label']

    def preprocess_data(self):
        # Perform any necessary preprocessing steps
        # For simplicity, no preprocessing is applied in this example

        # Split the dataset into training and testing sets
        self.features_train, self.features_test, self.labels_train, self.labels_test = \
            train_test_split(self.features, self.labels, test_size=0.2, random_state=42)

    def train_model(self):
        # Initialize and train a machine learning model (Random Forest Classifier in this example)
        categorical_cols = ['pose']
        numerical_cols = [col for col in self.features.columns if col not in categorical_cols]

        # Use a ColumnTransformer to apply one-hot encoding to the 'pose' column
        preprocessor = ColumnTransformer(
            transformers=[
                ('num', 'passthrough', numerical_cols),
                ('cat', OneHotEncoder(), categorical_cols)
            ])

        # Combine preprocessor with the classifier in a pipeline
        self.model = Pipeline([
            ('preprocessor', preprocessor),
            ('classifier', RandomForestClassifier(random_state=42))
        ])

        self.model.fit(self.features_train, self.labels_train)

    def evaluate_model(self):
        # Make predictions on the test set
        predictions = self.model.predict(self.features_test)

        # Evaluate the model performance
        accuracy = accuracy_score(self.labels_test, predictions)
        print(f'Model Accuracy: {accuracy}')

    def save_model(self, model_filename='student_attention_model.joblib'):
        # Save the trained model to a file
        joblib.dump(self.model, model_filename)
        print(f'Model saved as {model_filename}')

    def predict(self, input_data):
        # Make predictions on new input data
        # You can pass a dictionary with feature values for prediction
        return self.model.predict(input_data)

# Example usage
if __name__ == "__main__":
    # Instantiate the class
    classifier = StudentAttentionClassifier('./attention_detection_dataset_v1.csv')

    # Load and preprocess the dataset
    classifier.load_dataset()
    classifier.preprocess_data()

    # Train the model
    classifier.train_model()

    # Evaluate the model
    classifier.evaluate_model()

    # Save the trained model
    classifier.save_model()

    

