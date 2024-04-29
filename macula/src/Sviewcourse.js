
import React, { useState, useEffect } from "react";
import axios from 'axios';
import BlackButton from "./components/BlackButton";
import OrangeButton from "./components/OrangeButton";
import WhiteButton from "./components/WhiteButton";
import Popup from "./components/popup";
import "./educatorHome.css"; // Import CSS stylesheet
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

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/courses');
      const courses = response.data.message.filter(course => course.status === "active");
      setFetchedCourses(courses);
      console.log("Fetched courses:", courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }

  const handleRegisterCourse = async () => {
    try {

      // Clear all errors when creating a course
        setErrorMessage('');
      if (!courseCode) {
        setErrorMessage('Please fill in course code.');
        return;
      }
      const trimmedcode = courseCode.replace(/\s/g, '');

          
      if (!/^[a-zA-Z0-9]{5,8}$/.test(trimmedcode)) {
        setErrorMessage(
            <div>
                Course code must be:<br />
                - 5 to 8 characters long<br />
                - Only letters and numbers
            </div>
        );
        return;
    }
  
      const isCourseExists = fetchedCourses.some(course => course.code === courseCode);
    
      if (!isCourseExists) {
        setErrorMessage('Course does not exist.');
        return;
      }
  
      // Check if the user is already registered in the course
      const isUserRegistered = fetchedCourses.some(course => course.code === courseCode && course.students.includes(user.student.ID));
      if (isUserRegistered) {
        setErrorMessage('You are already registered in this course.');
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
    <div className="educator-home">
      <div className="big-courses-container">
        <h3 className='h3'><FaCalendarAlt className='desktop-icon' /> Courses</h3>
        <div className="courses-container">
          {fetchedCourses.map((course, index) => {
            // Check if the course is registered for the student
            if (course.students.includes(user.student.ID)) {
              return (
                <div key={course._id} className="classroom-box">
                  <p>
                    {course.code} : {course.title}
                    <FaArrowRight
                      className="arrow-icon"
                      onClick={() => handleNavigateToClassrooms(course.code)}
                    />
                  </p>
                  {index !== fetchedCourses.length - 1 && <hr />}
                </div>
              );
            } else {
              return null; // Don't render the course if not registered
            }
          })}
        </div>
        <div style={{ marginLeft: '342px', marginTop: '14px' }}>
        <BlackButton className="register" onClick={() => setButtonPopup(true)} text="Register for course" />
</div>
        {/* Register course pop up */}
        <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
          <h3>Register for a Course</h3>
          <p>Please enter the course code to register</p>
          <input
            id="course-code"
            type="text"
            value={courseCode}
            onChange={handleInputChange}
            placeholder="Enter course code"
            required
          />
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <div className="buttons-container">
          {/* <WhiteButton text="Cancel" onClick={() => setButtonPopup(false)} /> */}

            <OrangeButton text="Register" onClick={handleRegisterCourse} />
          </div>
        </Popup>
      </div>
    </div>
  );
};

export default Sviewcourse;
