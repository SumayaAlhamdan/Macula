import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaDesktop, FaArrowRight } from 'react-icons/fa';
import "../educatorHome.css";

const EducatorHome = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [fetchedClassrooms, setFetchedClassrooms] = useState([]);
  const [Ecourses, setEducatorCourses] = useState([]);
  useEffect(() => {
    fetchCourses();
    fetchClassrooms();
  }, []);

    const fetchCourses = async () => {
      try {
        if (Ecourses.length === 0) {
          const response = await axios.get('/api/courses/eCourse', {
            params: {
              educatorID: user.educator.ID
            }
          });
          const courseCodes = response.data.map(course => course.code);
          setEducatorCourses(courseCodes);
        }
      } catch (error) {
        console.error('Error fetching courses:', error.message);
      }
    };    

    const fetchClassrooms = async () => {
      try {
        const response = await axios.get('/api/classrooms');
        const classrooms = response.data.message;
        setFetchedClassrooms(classrooms);
      } catch (error) {
        console.error('Error fetching classrooms:', error.message);
      }
    };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="educator-home">
      <h2>Welcome, <span className='usernametitle'>{user.educator.name} </span> !</h2>
      <div className="upcoming-classes-container">
        <h3 className='h3'><FaDesktop className='desktop-icon' /> Upcoming Virtual Classes</h3>
        <div className="classroom-container">
          {Ecourses.length > 0 ? (
            fetchedClassrooms.map((classroom, index) => {
              const matchingCourse = Ecourses.find(course => course === classroom.courseID);
              if (matchingCourse) {
                return (
                  <div key={classroom._id} className="classroom-box">
                    <p>
                      {classroom.courseID}: {classroom.title}
                      <div className="joindiv">
                        <a href="http://localhost:3000/react-rtc-demo" target="_blank"  className="join-link">
                          Join<FaArrowRight className="arrow-icon" />
                        </a>
                      </div>
                      <div>{formatDate(classroom.date)}, {classroom.time}, {classroom.duration}</div> 
                    </p>
                    {index !== fetchedClassrooms.length - 1 && <hr />}
                  </div>
                );
              }
              return null;
            })
          ) : (
            <p className='classesEmptyState'>No Upcoming classrooms</p> // Changed the message here
          )}
        </div>
      </div>
    </div>
  );
};

export default EducatorHome;
