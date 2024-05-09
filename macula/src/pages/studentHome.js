import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaDesktop, FaArrowRight, FaUserCheck } from 'react-icons/fa';
import "../educatorHome.css";
import FaceDetection from '../FaceDetection';

const StudentHome = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [fetchedClassrooms, setFetchedClassrooms] = useState([]);
  const [fetchedCourses, setFetchedCourses] = useState([]);
  const [selectedClassroomID, setSelectedClassroomID] = useState(null); // State to store the selected classroom ID
  const currentDate = new Date();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('/api/courses/sCourse/', {
          params: {
            studentID: user.student.ID
          }
        });
        setFetchedCourses(response.data.message);
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
    } catch (error) {
      console.error('Error fetching classrooms:', error);
    }
  }

  const handleViewAttendance = (courseCode) => {
    window.location.href = `http://localhost:3000/Sclassrooms/${courseCode}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Returns only the date part
  };

  const handleJoinClassroom = (classroomID, date, time) => {
    const classStartTime = new Date(`${date} ${time}`).getTime();
    const currentTime = new Date().getTime();
    if (classStartTime - currentTime <= 30 * 60 * 1000) { // Check if less than 30 minutes remaining
      setSelectedClassroomID(classroomID);
    } else {
      alert("You can join the classroom 30 minutes before the start time.");
    }
  };

  const handleCloseModal = () => {
    setSelectedClassroomID(null);
  };

  const handleStartVideo = (startVideo) => {
    startVideo();
  };

  return (
    <div className="educator-home">
      <h2>Welcome, <span className='usernametitle'>{user.student.name}</span></h2>
      <div className="upcoming-classes-container">
        <h3 className='h3'><FaDesktop className='desktop-icon' /> Upcoming Virtual Classes</h3>
        <div className="classroom-container">
          {fetchedClassrooms.length > 0 && fetchedCourses.length > 0 ? (
            fetchedClassrooms
            .filter(classroom => new Date(classroom.date).toISOString().split('T')[0] >= currentDate.toISOString().split('T')[0])
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((classroom, index) => {
              const matchingCourse = fetchedCourses.find(course => course.code === classroom.courseID);
              if (matchingCourse) {
                return (
                  <div key={classroom._id} className="classroom-box">
                    <p>
                      {classroom.courseID}: {classroom.title}
                      <div className="joindiv">
                        <button onClick={() => handleJoinClassroom(classroom._id, classroom.date, classroom.time)} className="join-link">
                          Join <FaArrowRight className="arrow-icon" />
                        </button>
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
            <p className='classesEmptyState'>No Upcoming classes</p>
          )}
        </div>
      </div>
      <div className="big-attendance-container">
        <h3 className='h3'><FaUserCheck className='desktop-icon'/> Attendance</h3>
        <div className="classroom-container">
          {fetchedCourses.length > 0 ? (
            fetchedCourses.map((course,index) => {
              return (
                <div key={course._id} className="classroom-box">
                  <p>
                    {course.code}: {course.title}
                    <div className="joindiv">
                      <button onClick={() => handleViewAttendance(course.code)} className="join-link">
                        View <FaArrowRight className="arrow-icon" />
                      </button>
                    </div>
                  </p>
                  {index !== fetchedCourses.length - 1 && <hr />}
                </div>
              );
            })
          ) : (
            <p className='classesEmptyState'>No courses registered</p>
          )}
        </div>
      </div>
      {selectedClassroomID && <FaceDetection classroomID={selectedClassroomID} studentID={user.student.ID} onStartVideo={handleStartVideo} onCloseModal={handleCloseModal} />}
    </div>
  );
};

export default StudentHome;
