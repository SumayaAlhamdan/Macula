
//Sviewcourse;

import React, { useState, useEffect } from "react";
import axios from 'axios';
import BlackButton from "./components/BlackButton";
import OrangeButton from "./components/OrangeButton";
import WhiteButton from "./components/WhiteButton";
import Popup from "./components/popup";
import "./Eviewcourse.css"; // Import CSS stylesheet
import { FaCalendarAlt , FaArrowRight } from 'react-icons/fa'; // Import the calendar icon from Font Awesome
import { useNavigate } from 'react-router-dom';

const Sviewcourse = () => {
  const [buttonPopup, setButtonPopup] = useState(false);
  const [courseCode, setCourseCode] = useState('');
  const [fetchedCourses, setFetchedCourses] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();


  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
        const response = await axios.get('http://localhost:4000/api/courses');
        const courses = response.data.message;
        setFetchedCourses(courses);
        console.log("Fetched courses:", courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
  }

  const handleRegisterCourse = async () => {
    try {
      if (!courseCode) {
        setErrorMessage('Please fill in course code.');
        return;
      }

      const isCourseExists = fetchedCourses.some(course => course.code === courseCode);
    
      if (!isCourseExists) {
        setErrorMessage('Course does not exist.');
        return;
      }
      const response = await axios.post('http://localhost:4000/api/courses/register', {
        code: courseCode, // Sending the course code
        student: user.student.ID // Sending the student name
      });
  
      console.log('Course registered successfully:', response.data);
      await fetchCourses();
      setCourseCode('');
      setErrorMessage('');
      setButtonPopup(false);
    } catch (error) {
      console.error('Error registering course:', error);
    }
  };
  
  
  

  const handleInputChange = (e) => {
    setCourseCode(e.target.value);
  };
  const handleNavigateToClassrooms = (courseCode) => {
    // Navigate to the classrooms page and send the course code as a parameter
    navigate(`/Sclassrooms/${courseCode}`);
  };
  
return (
  <div>
    <div className="Eviewcourse">
      <header className="Eviewcourse-header">
        
        <h2 className="courses-title">    <FaCalendarAlt className="calendar-icon" /> Courses
        </h2>
        <div className="courses-container">
          {/* Apply courses-container class */}
          {fetchedCourses.map((course, index) => {
            // Check if "me" is included in the students array
            if (course.students.includes(user.student.ID)) {
              return (
                <div key={course._id} className="course-box">
                  {/* Apply course-box class */}
                  <p>{course.code} : {course.title}
                  <FaArrowRight
                      className="arrow-icon"
                      onClick={() => handleNavigateToClassrooms(course.code)}
                    /></p>
                  {index !== fetchedCourses.length - 1 && <hr />}
                  {/* Render horizontal line only if it's not the last course */}
                </div>
              );
            } else {
              return null; // Don't render the course if "me" is not in the students array
            }
          })}
        </div>

        <BlackButton onClick={() => setButtonPopup(true)} text="Register for course" />

        {/* create course pop up */}
        <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
          <h3>Create course</h3>
          <p>Please enter course code to register</p>
          <input
            id="cname"
            type="text"
            value={courseCode}
            onChange={handleInputChange}
            placeholder="Enter course code"
            required
          />
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <div className='buttons-container'>
            <WhiteButton text="Cancel" onClick={() => setButtonPopup(false)} />
            <OrangeButton text="Register" onClick={handleRegisterCourse} />
          </div>
        </Popup>
      </header>
    </div>
  </div>
);

};

export default Sviewcourse;
