import React, { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios'; // Import axios for making HTTP requests

const FaceDetectionComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  let detectionInterval;

  useEffect(() => {
    const cleanup = () => {
      clearInterval(detectionInterval);
      console.log("hrererer");
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        console.log("hrererer22222222222");
        tracks.forEach(track => {
          track.stop();
        });
      }
    };
    const loadModelsAndStartDetection = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models')
        ]);

        // Models loaded successfully, start webcam and face detection
        startWebcam();
        detectFaces("65ed6df744d0dcc77de74db4");
      } catch (error) {
        console.error('Error loading face detection models:', error);
      }
    };

    const startWebcam = () => {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.addEventListener('loadedmetadata', handleVideoLoaded);
          }
        })
        .catch(error => {
          console.error('Error accessing webcam:', error);
        });
    };
  
    const handleVideoLoaded = () => {
      // Video metadata has loaded, resize the results
      const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };
      faceapi.matchDimensions(canvasRef.current, displaySize);
    };
    const getLabeledFaceDescriptions = async (studentId) => {
      try {
        const response = await axios.get('http://localhost:4000/api/attendance');
        const students = response.data.message;
        const descriptions = [];

        for (const student of students) {
          if (student._id === studentId) { // Filter by student ID
            const img = await faceapi.fetchImage(student.image);
            const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

            if (detections) {
              descriptions.push(new faceapi.LabeledFaceDescriptors(student._id, [detections.descriptor]));
              console.log(descriptions);
            } else {
              console.warn('No face detected for student:', student._id);
            }

            // Break out of the loop once the matching student is found
            break;
          }
        }

        if (descriptions.length === 0) {
          console.warn('No valid face descriptors found for student ID:', studentId);
        } else {
          console.log('Labeled face descriptors:', descriptions);
        }

        return descriptions;
      } catch (error) {
        console.error('Error fetching labeled face descriptions:', error);
        return [];
      }
    };

    const detectFaces = async (studentID) => {
      const labeledFaceDescriptors = await getLabeledFaceDescriptions(studentID);
      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

      const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };
      faceapi.matchDimensions(canvasRef.current, displaySize);

      detectionInterval = setInterval(async () => {
        const detections = await faceapi.detectAllFaces(videoRef.current).withFaceLandmarks().withFaceDescriptors();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        const context = canvasRef.current?.getContext('2d');
        if (!context) return; // Exit early if context is null

        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        resizedDetections.forEach(async (detection) => {
          const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
          if (bestMatch._label === studentID) { // Check if the label matches the student ID
            const box = detection.detection.box;
            const drawBox = new faceapi.draw.DrawBox(box, { label: bestMatch.toString() });
            drawBox.draw(canvasRef.current);

            // Make an HTTP request to mark the student present in the database
            try {
              await axios.post('http://localhost:4000/api/attendance', { studentID });
              console.log('Student marked present:', studentID);
            } catch (error) {
              console.error('Error marking student present:', error);
            }
          }
        });
      }, 100);
    };

    loadModelsAndStartDetection();
    return cleanup;
  }, []);

  return (
    <div>
      <video id="video" ref={videoRef} width="600" height="450" autoPlay></video>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default FaceDetectionComponent;
