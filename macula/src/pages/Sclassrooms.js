import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaDesktop, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import BlackButton from "../components/BlackButton";
import "../css/classrooms.css";

const SClassrooms = () => {
  const { courseCode } = useParams();
  const [fetchedClassrooms, setFetchedClassrooms] = useState([]);

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

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Returns only the date part
  };

  return (
    <div className="classroom-page">
      <div className="classroom-page-title">
        <h2><FaCalendarAlt className='course-icon' /> {courseCode}</h2>
      </div>
      <div className="upcoming-classes-container">
      <h3 className='h3'><FaDesktop className='desktop-icon' /> Upcoming Virtual Classes</h3>
      <div className="classroom-container">
        {fetchedClassrooms.length > 0 ? (
          fetchedClassrooms.map((classroom, index) => (
            classroom.courseID === courseCode ? (
              <div key={classroom._id} className="classroom-box">
                <p>
                  {classroom.title}
                  <div className='joindiv'> <a href="http://localhost:3000/react-rtc-demo" target="_blank"  className="join-link">
                          Join<FaArrowRight className="arrow-icon" />
                        </a></div>
                  <div>{formatDate(classroom.date)}, {classroom.time}, {classroom.duration}</div> 
                </p>
                {index !== fetchedClassrooms.length - 1 && <hr />}
              </div>
            ) : null
          ))
        ) : (
          <p>No Upcoming classes for this course</p>
        )}
      </div>
      </div>
    </div>
  );
};

export default SClassrooms;
