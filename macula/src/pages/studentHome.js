import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaDesktop, FaArrowRight,FaUserCheck } from 'react-icons/fa';
import "../educatorHome.css";
import FaceDetection from '../FaceDetection';
//import { useHistory } from 'react-router-dom';

const StudentHome = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [fetchedClassrooms, setFetchedClassrooms] = useState([]);
  const [fetchedCourses, setFetchedCourses] = useState([]);
  const [selectedClassroomID, setSelectedClassroomID] = useState(null); // State to store the selected classroom ID
  //const history = useHistory();
  const currentDate=new Date();

 
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

  const handleViewAttendance = (courseCode) => {
    // Redirect the user to the course page
    window.location.href = `http://localhost:3000/Sclassrooms/${courseCode}`;
};

  const openLinks = () => {
    window.open('http://localhost:3000/react-rtc-demo', '_blank');
    window.open('http://127.0.0.1:5000', '_blank');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Returns only the date part
  };
  const handleJoinClassroom = (classroomID) => {
    setSelectedClassroomID(classroomID); // Set the selected classroom ID to trigger the FaceDetection popup
  };
  const handleCloseModal = () => {
    setSelectedClassroomID(null); // Reset selectedClassroomID when the modal is closed
  };
  const handleStartVideo = (startVideo) => {
    startVideo(); // Call the startVideo function when available
  };

  
  
  return (
    <div className="educator-home">
      <h2>Welcome, <span className='usernametitle'>{user.student.name} </span></h2>
      <div className="upcoming-classes-container">
        <h3 className='h3'><FaDesktop className='desktop-icon' /> Upcoming Virtual Classes</h3>
        <div className="classroom-container">
          {fetchedClassrooms.length > 0 && fetchedCourses.length > 0 ? (
            fetchedClassrooms
            .filter(classroom => new Date(classroom.date).toISOString().split('T')[0] >= currentDate.toISOString().split('T')[0]) // Filter classes that have passed
        .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((classroom, index) => {
              const matchingCourse = fetchedCourses.find(course => course.code === classroom.courseID);
              if (matchingCourse) {
                return (
                  <div key={classroom._id} className="classroom-box">
                    <p>
                      {classroom.courseID}: {classroom.title}
                      <div className="joindiv">
                        {/* Pass the classroom ID to the handleJoinClassroom function */}
                        <button onClick={() => handleJoinClassroom(classroom._id)} className="join-link">
                          Join <FaArrowRight className="arrow-icon" />
                        </button>
                      </div>
                      {/* <div className="joindiv"> 
                    <a href="http://localhost:3000/react-rtc-demo" target="_blank" className="join-link">
                    Join <FaArrowRight className="arrow-icon" />
                    </a>
                    </div> */}
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
                        {/* Pass the classroom ID to the handleJoinClassroom function */}
                        <button  onClick={() => handleViewAttendance(course.code)} className="join-link">
                          View <FaArrowRight className="arrow-icon" />
                        </button>
                      </div>
                  </p>
                  {index !== fetchedCourses.length - 1 && <hr />}
                  {/* <div className="attendance">
                    <span>Attendance: {formatAttendance(course.attendance)}</span>
                  </div> */}
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
