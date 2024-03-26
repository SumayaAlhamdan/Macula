import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaDesktop, FaArrowRight } from 'react-icons/fa';
import "../educatorHome.css";

const StudentHome = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [fetchedClassrooms, setFetchedClassrooms] = useState([]);
  const [fetchedCourses, setFetchedCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('/api/courses/sCourse/', {
          params: {
            studentID: user.student.ID
          }
        });
        console.log('courses', response.data);
        setFetchedCourses(response.data.message); // Updated to set the courses correctly
      } catch (error) {
        console.error('Error fetching courses:', error.message);
      }
    };
    
    fetchCourses();
  }, [user.student.ID]);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Returns only the date part
  };

  return (
    <div className="educator-home">
      <h2>Welcome, Student!</h2>
      <h3 className='h3'><FaDesktop className='desktop-icon' /> Upcoming Virtual Classes</h3>
      <div className="classroom-container">
        {fetchedClassrooms.length > 0 && fetchedCourses.length > 0 ? (
          fetchedClassrooms.map((classroom, index) => {
            const matchingCourse = fetchedCourses.find(course => course.code === classroom.courseID);
            if (matchingCourse) {
              return (
                <div key={classroom._id} className="classroom-box">
                  <p>
                    {classroom.courseID}: {classroom.title}
                    <div className="joindiv"> 
                    <a href="http://localhost:3000/react-rtc-demo" target="_blank" className="join-link">
                    Join <FaArrowRight className="arrow-icon" />
                    </a>
                    </div>
                    <div>{formatDate(classroom.date)}, {classroom.time}, {classroom.duration}</div> 
                  </p>
                  {index !== fetchedClassrooms.length - 1 && <hr />}
                </div>
              );
            } else {
              return null;
            }
          })
        ) : (
          <p>No Upcoming classes</p>
        )}
      </div>
    </div>
  );
};

export default StudentHome;
