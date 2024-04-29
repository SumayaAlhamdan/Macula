import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaDesktop, FaCalendarAlt, FaArrowRight, FaFileAlt } from 'react-icons/fa';
import BlackButton from "../components/BlackButton";
import OrangeButton from "../components/OrangeButton";
import WhiteButton from "../components/WhiteButton";
import Popup from "../components/popup";
import "../css/classrooms.css";
import "../components/popup.css";
import Success from '../components/Success';
import "../components/Success.css";

const Classrooms = () => {
    const { courseCode } = useParams();
    const [fetchedClassrooms, setFetchedClassrooms] = useState([]);
    const [buttonPopup, setButtonPopup] = useState(false);
    const [successPopup, setSuccessPopup] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const [errorMessage, setErrorMessage] = useState('');
    const [classroomsForCourse, setCourseClasses] = useState([]);
    const [selectedClassroomID, setSelectedClassroomID] = useState(null);
    const [formData, setFormData] = useState({
        courseID: courseCode,
        educatorID: user.educator.ID,
        title: '',
        date: '',
        time: '',
        duration: ''
    });
    const currentDate = new Date();

    useEffect(() => {
        fetchClassrooms();
    }, []);

    async function fetchClassrooms() {
        try {
            const response = await axios.get('/api/classrooms');
            const classrooms = response.data.message;
            setFetchedClassrooms(classrooms);
            console.log("Fetched classrooms:", classrooms);
        } catch (error) {
            console.error('Error fetching classrooms:', error);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Validate duration input to ensure it falls within the range of 1 to 300
        if (name === 'duration') {
            const intValue = parseInt(value); // Convert input value to integer
            if (intValue < 1 || intValue > 300) {
                // If input value is outside of the range, set it to the nearest boundary
                setFormData({ ...formData, [name]: intValue < 1 ? '1' : '300' });
            } else {
                // If input value is within the range, update the state normally
                setFormData({ ...formData, [name]: intValue.toString() });
            }
        } else {
            // Regular expression to allow only alphanumeric characters and spaces
            const regex = /^[a-zA-Z0-9\s]*$/;

            // Check if the input value matches the regular expression
            if (name === 'title' && !regex.test(value)) {
                setErrorMessage('Title should not contain special characters');
            } else {
                // For other input fields, update the state normally
                setFormData({ ...formData, [name]: value });
                setErrorMessage(''); // Clear error message if input is valid
            }
        }
    };



    const resetForm = () => {
        setErrorMessage('');
        console.log(errorMessage);
        setFormData({
            courseID: courseCode,
            educatorID: user.educator.ID,
            title: '',
            date: '',
            time: '',
            duration: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Validate form fields
            if (!formData.title || !formData.date || !formData.time || !formData.duration) {
                setErrorMessage('Please fill in all required fields.');
                return;
            }

            console.log('Form Data:', formData); // Log the form data before making the request
            const response = await axios.post('/api/classrooms', formData);
            console.log('Response:', response.data); // Log the response from the server
            setButtonPopup(false);
            setSuccessPopup(true);
            resetForm();
        } catch (error) {
            console.error('Error creating classroom:', error);
            if (error.response) {
                console.error('Server Error:', error.response.data); // Log the error response from the server
                setErrorMessage(error.response.data.message); // Display server error message to user
            } else {
                setErrorMessage('Error creating classroom'); // Display generic error message if no server response
            }
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Returns only the date part
    };

    const handleJoinClassroom = async (courseCode, classroomID) => {
        // Redirect to the first page
      //  window.open(`/realtime?courseCode=${courseCode}&classroomID=${classroomID}`, '_blank');
      //  window.open('http://localhost:3001/react-rtc-demo');
      };
      
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Get current time in HH:MM format
    const now = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
    return (
        <div className="classroom-page">
            <div className="classroom-page-title">
                <h2><FaCalendarAlt className='course-icon' /> {courseCode}</h2>
            </div>
            <div className="upcoming-classes-container">
                <h3 className='h3'><FaDesktop className='desktop-icon' /> Upcoming Virtual Classes</h3>

                <div className="classroom-container">
                    {fetchedClassrooms.length > 0 ? (
                        fetchedClassrooms
                            .filter(classroom => new Date(classroom.date).toISOString().split('T')[0] >= currentDate.toISOString().split('T')[0]) // Filter classes that have passed
                            .sort((a, b) => new Date(a.date) - new Date(b.date))
                            .map((classroom, index) => (
                                classroom.courseID === courseCode ? (
                                    <div key={classroom._id} className="classroom-box">
                                        <p>
                                            {classroom.title}
                                            <div className="joindiv">
                                                {handleJoinClassroom(courseCode, classroom._id)}
                                                <button className="join-link">
                                                    Join <FaArrowRight className="arrow-icon" />
                                                </button>
                                            </div>
                                            {/* <div className='joindiv'> <a href="http://localhost:3000/react-rtc-demo" target="_blank"  className="join-link">
                          Join<FaArrowRight className="arrow-icon" />
                        </a>
                        </div> */}
                                            <div>
                                                {formatDate(classroom.date)}, {classroom.time}, {classroom.duration}</div>
                                        </p>
                                        {index !== fetchedClassrooms.length - 1 && <hr />}
                                    </div>
                                ) : null
                            ))
                    ) : (
                        <p className='classesEmptyState'>No Upcoming classes for this cours</p>
                    )}
                </div>

                <div className="button-container">
                    <BlackButton className="create-classroom" onClick={() => setButtonPopup(true)} text="Create classroom" />
                </div>

            </div>
            <div className="big-attendance-container">
                <h3 className='h3'><FaFileAlt className='desktop-icon' /> Reports</h3>
                <div className="classroom-container">
                    {fetchedClassrooms.length > 0 ? (
                        fetchedClassrooms
                            .filter(classroom => new Date(classroom.date) < currentDate) // Filter classes that have passed
                            .filter(classroom => classroom.courseID === courseCode) // Filter classes for the specific course
                            .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort classrooms from newest to oldest
                            .map((classroom, index) => (
                                <div key={classroom._id} className="classroom-box">
                                    <p>
                                        {classroom.title}
                                        <div className="joindiv">
                                            {/* Pass the classroom ID to the handleJoinClassroom function */}
                                            <button onClick={() => {
                                                window.location.href = `/EducatorDashboard?courseCode=${courseCode}&classroomID=${classroom._id}`
                                            }} className="join-link">
                                                View <FaArrowRight className="arrow-icon" />
                                            </button>

                                        </div>
                                        <div>
                                            {formatDate(classroom.date)}, {classroom.time}, {classroom.duration} minutes</div>

                                        <div className="attendance-status">
                                            {/* <p>
                                                Attendance Status: <label className='usernametitle' style={{ display: 'inline-block', marginLeft: '5px' }}>{getClassAttendanceStatus(classroom._id)}</label>
                                            </p> */}
                                        </div>
                                    </p>
                                    {index !== fetchedClassrooms.length - 1 && <hr />}
                                </div>
                            ))
                    ) : (
                        <p className='classesEmptyState'>No classes available</p>
                    )}
                </div>
            </div>

            <Popup trigger={buttonPopup} setTrigger={setButtonPopup} onClose={resetForm}>
                <div className="classroom">
                    <h2>New Classroom</h2>
                    <label>Title:</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Enter Classroom title" required maxLength="50" // Restriction of 50 characters
                    />
                    <div className="horizontal-container">
                        <div className="horizontal-date">
                            <label>Date:</label>
                            <input type="date" name="date" value={formData.date} onChange={handleChange} min={today} required />
                        </div>
                        <div className="horizontal-time">
                            <label>Time:</label>
                            <input type="time" name="time" value={formData.time} onChange={handleChange} min={now} required />
                        </div>
                        <div className="horizontal-duration">
                            <label>Duration:</label>
                            <input type="number" name="duration" value={formData.duration} onChange={handleChange} min="1" max="300" placeholder="Enter duration in minutes" required />
                        </div>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                    </div>
                    <div className='buttons-container'>
                        <WhiteButton text="Cancel" onClick={() => { setButtonPopup(false); resetForm() }} />
                        <OrangeButton text="Create" onClick={handleSubmit} />
                    </div>
                </div>
            </Popup>
            <Success trigger={successPopup} setTrigger={setSuccessPopup} text="Your Classroom has been created successfully" />

        </div>
    );
};

export default Classrooms;
