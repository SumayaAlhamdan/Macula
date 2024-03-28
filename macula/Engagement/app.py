from flask import Flask
import subprocess

app = Flask(__name__)

@app.route('/')
def index():
    # Specify the path to the Python script you want to run
    script_path = r"C:\Users\alham\OneDrive\Desktop\Macula\macula\Engagement\engage.py"

    # Run the Python script using subprocess
    try:
        subprocess.run(["python", script_path], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")

    return "Python script executed successfully"

if __name__ == '__main__':
    app.run(debug=True)
