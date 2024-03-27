import * as faceapi from 'face-api.js';
import React from 'react';
import axios from 'axios';
import './components/componentsStyles.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './index.css';
const FaceDetection = () => {

    const studentID = "65ed6df744d0dcc77de74db4";
    const [modelsLoaded, setModelsLoaded] = React.useState(false);
    const [captureVideo, setCaptureVideo] = React.useState(false);

    const videoRef = React.useRef();
    const videoHeight = 480;
    const videoWidth = 640;
    const canvasRef = React.useRef();

    React.useEffect(() => {
        const loadModels = async () => {


            await Promise.all([
                faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
                faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
                faceapi.nets.faceLandmark68Net.loadFromUri('/models')
            ]).then(setModelsLoaded(true));
        }
        loadModels();
    }, []);

    const startVideo = () => {
        setCaptureVideo(true);
        navigator.mediaDevices
            .getUserMedia({ video: { width: 300 } })
            .then(stream => {
                let video = videoRef.current;
                video.srcObject = stream;
                video.play();
            })
            .catch(err => {
                console.error("error:", err);
            });
    }

    const handleVideoOnPlay = async () => {
        if (!videoRef.current) return;
    
        // Wait for the video metadata to load
        await new Promise(resolve => {
            videoRef.current.addEventListener('loadedmetadata', resolve);
        });
    
        // Wait for the video to finish loading
        await new Promise(resolve => {
            videoRef.current.addEventListener('canplaythrough', resolve, { once: true });
        });
    
        try {
            const labeledFaceDescriptors = await getLabeledFaceDescriptions(studentID);
            const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);
    
            setInterval(async () => {
                if (canvasRef && canvasRef.current) {
                    const displaySize = {
                        width: videoWidth,
                        height: videoHeight
                    }
    
                    faceapi.matchDimensions(canvasRef.current, displaySize);
    
                    const detections = await faceapi.detectAllFaces(videoRef.current).withFaceLandmarks().withFaceDescriptors();
                    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    
                    const context = canvasRef.current?.getContext('2d');
                    if (!context) return; // Exit early if context is null
    
                    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
                    if (resizedDetections.length === 0) {
                        console.log('No face detected.');
                        // Handle the case where no face is detected
                        return;
                    }
    
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
                                // Handle error marking student present
                            }
                        } else {
                            console.log('Face does not match the student ID:', bestMatch._label);
                            // Handle the case where the detected face does not match the student ID
                        }
                    });
                }
            }, 100);
        } catch (error) {
            console.error('Error in face detection:', error);
            // Handle general error in face detection process
        }
    }
    
    
    
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


    const closeWebcam = () => {
        videoRef.current.pause();
        videoRef.current.srcObject.getTracks()[0].stop();
        setCaptureVideo(false);
    }


    return (
        <div>
            <div style={{ textAlign: 'center', padding: '10px' }}>
                {
                    (!(captureVideo && modelsLoaded) &&


                        <button onClick={startVideo} style={{ cursor: 'pointer', backgroundColor: 'green', color: 'white', padding: '15px', fontSize: '25px', border: 'none', borderRadius: '10px' }}>
                            Open Webcam
                        </button>
                    )
                }

            </div>
            {
                captureVideo ?
                    modelsLoaded ?
                        <div className="modal-overlay">
                            <div className="modal">
                                {/* <button onClick={closeWebcam} style={{ cursor: 'pointer', backgroundColor: 'green', color: 'white', padding: '15px', fontSize: '25px', border: 'none', borderRadius: '10px' }}>
                                    Close Webcam
                                </button> */}
                               
                                <div className='modal-header'>
                                <h2 className='modal-title'>Attendance Verification</h2>
                                <span className="close-icon" onClick={closeWebcam}>
                                    <i className="fas fa-times"></i>
                                </span>
                                </div>
                                <h4 className='modal-sub-title'>Please show your face clearly to verify your attendance</h4>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                                    {/* <i className="fas fa-user-check" style={{ fontSize: '48px', color: 'grey', position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)' }}></i> */}
                                        <video ref={videoRef} height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay} style={{ borderRadius: '10px' }} />
                                        <canvas ref={canvasRef} style={{ position: 'absolute' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div>loading...</div>
                    :
                    <>
                    </>
            }
        </div>
    );
};

export default FaceDetection;
