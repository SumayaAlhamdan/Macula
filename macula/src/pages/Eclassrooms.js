import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaDesktop, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import BlackButton from "../components/BlackButton";
import OrangeButton from "../components/OrangeButton";
import WhiteButton from "../components/WhiteButton";
import Popup from "../components/popup";
import "../css/classrooms.css";
import "../components/popup.css";

const Classrooms = () => {
  const { courseCode } = useParams();
  const [fetchedClassrooms, setFetchedClassrooms] = useState([]);
  const [buttonPopup, setButtonPopup] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    courseID: courseCode,
    educatorID: user.educator.ID,
    title: '',
    date: '',
    time: '',
    duration: ''
  });

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const [message, setMessage] = useState('');

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

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Returns only the date part
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Form Data:', formData); // Log the form data before making the request
      const response = await axios.post('/api/classrooms', formData);
      console.log('Response:', response.data); // Log the response from the server
      setButtonPopup(false);
      // Clear form data upon successful submission
      setFormData({
        courseID: '',
        educatorID: '',
        title: '',
        date: '',
        time: '',
        duration: ''
      });
    } catch (error) {
      console.error('Error creating classroom:', error);
      if (error.response) {
        console.error('Server Error:', error.response.data); // Log the error response from the server
        setMessage(error.response.data.message); // Display server error message to user
      } else {
        setMessage('Error creating classroom'); // Display generic error message if no server response
      }
    }
  };

  return (
    <div className="classroom-page">
      <div className="classroom-page-title">
        <h2><FaCalendarAlt className='course-icon' /> {courseCode}</h2>
      </div>
      <h3 className='h3'><FaDesktop className='desktop-icon' /> Upcoming Virtual Classes</h3>
      <div className="classroom-container">
        {fetchedClassrooms.length > 0 ? (
          fetchedClassrooms.map((classroom, index) => (
            classroom.courseID === courseCode ? (
              <div key={classroom._id} className="classroom-box">
                <p>
                  {classroom.title}
                  <div className='joindiv'> Join<FaArrowRight className="arrow-icon" /></div>
                  <div>{formatDate(classroom.date)}, {classroom.time}, {classroom.duration}</div> 
                </p>
                {index !== fetchedClassrooms.length - 1 && <hr />}
              </div>
            ) : null
          ))
        ) : (
          <p>No Upcoming classrooms for this course</p>
        )}
      </div>
      <div className="button-container">
        <BlackButton className="create-classroom" onClick={() => setButtonPopup(true)} text="Create classroom"/>
      </div>
      <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
        <div className="classroom">
          <h2>New Classroom</h2>
          <label>Title:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Enter Classroom title" required />
          <div className="horizontal-container">
            <div className="horizontal-date">
              <label>Date:</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required />
            </div>
            <div className="horizontal-time">
              <label>Time:</label>
              <input type="time" name="time" value={formData.time} onChange={handleChange} required />
            </div>
            <div className="horizontal-duration">
              <label>Duration:</label>
              <input type="text" name="duration" value={formData.duration} onChange={handleChange} placeholder="Enter duration in minutes" required />
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
          <div className='buttons-container'>
            <WhiteButton text="Cancel" onClick={() => setButtonPopup(false)}/>
            <OrangeButton text="Create" onClick={handleSubmit} />
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default Classrooms;
