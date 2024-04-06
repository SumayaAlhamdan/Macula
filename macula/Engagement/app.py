from flask import Flask, request
import subprocess

app = Flask(__name__)

@app.route('/')
def index():
    # Get the student and class IDs from the request parameters
    # student_id = request.args.get('student_id', default=None)
    # class_id = request.args.get('class_id', default=None)
    student_id = "1"
    class_id = "1" 
    # Specify the path to the Python script you want to run
    script_path = r"C:\Users\alham\OneDrive\Desktop\Macula\macula\Engagement\engage.py"

    # Run the Python script using subprocess
    try:
        subprocess.run(["python", script_path, "--student_id", student_id, "--class_id", class_id], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")

    return "Python script executed successfully"

if __name__ == '__main__':
    app.run(debug=True)

