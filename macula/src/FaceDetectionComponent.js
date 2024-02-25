import React, { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios'; // Import axios for making HTTP requests

const FaceDetectionComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadModelsAndStartDetection = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models')
        ]);

        // Models loaded successfully, start webcam and face detection
        startWebcam();
        detectFaces();
      } catch (error) {
        console.error('Error loading face detection models:', error);
      }
    };

    const startWebcam = () => {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          videoRef.current.srcObject = stream;
        })
        .catch(error => {
          console.error('Error accessing webcam:', error);
        });
    };
    async function getLabeledFaceDescriptions() {
      try {
        const response = await axios.get('http://localhost:4000/api/attendance');
        const students = response.data.message;
        console.log(students + '99');
        const descriptions = [];

        for (const student of students) {
          const img = await faceapi.fetchImage(student.image); // Use fetchImage directly for URL
          const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

          if (detections) {
            descriptions.push(new faceapi.LabeledFaceDescriptors(student._id, [detections.descriptor]));
          } else {
            console.warn('No face detected for student:', student._id);
          }
        }

        if (descriptions.length === 0) {
          console.warn('No valid face descriptors found.');
        } else {
          console.log('Labeled face descriptors:', descriptions);
        }

        return descriptions;
      } catch (error) {
        console.error('Error fetching labeled face descriptions:', error);
        return [];
      }
    }




    const detectFaces = async () => {
      const labeledFaceDescriptors = await getLabeledFaceDescriptions();
      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

      const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };
      faceapi.matchDimensions(canvasRef.current, displaySize);

      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(videoRef.current).withFaceLandmarks().withFaceDescriptors();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        const context = canvasRef.current.getContext('2d');
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        const results = resizedDetections.map((d) => {
          return faceMatcher.findBestMatch(d.descriptor);
        });
        results.forEach((result, i) => {
          const box = resizedDetections[i].detection.box;
          const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() });
          drawBox.draw(canvasRef.current);
        });
      }, 100);
    };

    loadModelsAndStartDetection();
    detectFaces();

    return () => {
      // Cleanup code here if needed
    };
  }, []);

  return (
    <div>
      <video id="video" ref={videoRef} width="600" height="450" autoPlay></video>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default FaceDetectionComponent;
