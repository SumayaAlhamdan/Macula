from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

@app.route('/', methods=['GET', 'POST'])
def index():

    if request.method == 'POST':
        # Get the student and class IDs from the request parameters
        data = request.get_json()
        student_id = request.json.get('studentID')
        class_id = request.json.get('classroomID')
        print(class_id)
        print(student_id)

        if student_id is not None and class_id is not None:
            # Print the received student and class IDs
            print("Received Student ID:", student_id)
            print("Received Class ID:", class_id)
            
            # Specify the path to the Python script you want to run
            print("Executing detect.py script...")
            script_path = r"detect.py"

            # Run the Python script using subprocess
            try:
                subprocess.run(["python", script_path, student_id, class_id], check=True)
            except subprocess.CalledProcessError as e:
                print(f"Error: {e}")
            
            return jsonify({"message": "Python script executed successfully"})
        else:
            return jsonify({"message": "Waiting for data..."})
    else:
        return "Flask server is running."

if __name__ == '__main__':
    app.run(debug=True)