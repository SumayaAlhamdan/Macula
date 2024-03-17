import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../index.css";
import { FaDesktop, FaArrowRight } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import "../educatorHome.css"

const EducatorHome = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [fetchedClassrooms, setFetchedClassrooms] = useState([]);
  const [Ecourses, setEducatorCourses] = useState([]);

  useEffect(() => {
    // Fetch courses associated with the educator
    const fetchCourses = async () => {
      try {
        const response = await axios.get('/api/courses/eCourse', {
          params: {
            educatorID: user.educator.ID
          }
        });
        const courseCodes = response.data.map(course => course.code);
        setEducatorCourses(courseCodes);
      } catch (error) {
        console.error('Error fetching courses:', error.message);
      }
    };    
    fetchCourses();
  }, [user]);

  useEffect(() => {
    // Fetch classrooms
    const fetchClassrooms = async () => {
      try {
        const response = await axios.get('/api/classrooms');
        const classrooms = response.data.message;
        setFetchedClassrooms(classrooms);
      } catch (error) {
        console.error('Error fetching classrooms:', error.message);
      }
    };
    fetchClassrooms();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Returns only the date part
  };

  return (
    <div className="educator-home">
      <h2>Welcome, Educator!</h2>
      <h3 className='h3'><FaDesktop className='desktop-icon' /> Upcoming Virtual Classes</h3>
      <div className="classroom-container">
        {fetchedClassrooms.length > 0 ? (
          fetchedClassrooms
            .filter(classroom => Ecourses.includes(classroom.courseID)) // Filter classrooms based on course codes
            .map((classroom, index) => (
              <div key={classroom._id} className="classroom-box">
                <p>
                  {classroom.courseID}: {classroom.title}
                  <div><FaArrowRight className="arrow-icon" /></div>
                  <div>{formatDate(classroom.date)}, {classroom.time}, {classroom.duration}</div> 
                </p>
                {index !== fetchedClassrooms.length - 1 && <hr />}
              </div>
            ))
        ) : <p>No Upcoming classrooms</p>}
      </div>
    </div>
  );
};

export default EducatorHome;

