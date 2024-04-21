import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaDesktop, FaArrowRight ,FaFileAlt} from 'react-icons/fa';
import "../educatorHome.css";
import { Link } from 'react-router-dom';



const EducatorHome = () => {
  
  const user = JSON.parse(localStorage.getItem('user'));
  const [fetchedClassrooms, setFetchedClassrooms] = useState([]);
  const [Ecourses, setEducatorCourses] = useState([]);
  const [fetchedCourses, setFetchedCourses] = useState([]);
  const currentDate=new Date();
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
        setFetchedCourses(response.data);
        const courseCodes = response.data.filter(course => course.status === "active").map(course => course.code) ;
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

//   const handleJoinClassroom = async (courseCode) => {
//     window.open('http://localhost:3000/react-rtc-demo', '_blank');
//     try {
//         const res = await axios.get(`/api/courses/sCourse/${courseCode}/students`);
//         console.log(res.data); // Handle the response data accordingly
//     } catch (error) {
//         console.error('Error retrieving students:', error);
//         // Handle the error
//     }
// };
const handleJoinClassroom = async (courseCode, classroomID) => {

  //window.location.href = `/realtime/${classroomID}`;
  try {
    // Fetch students enrolled in the class
    const studentResponse = await axios.get(`/api/courses/sCourse/${courseCode}/students`);
    const students = studentResponse.data.students;

    // Fetch attendance records for each student in the original window
    const attendanceRecords = [];
    for (const student of students) {
      const attendanceResponse = await axios.get(`/api/attendance/report?studentId=${student.ID}&classroomId=${classroomID}`);
      attendanceRecords.push({ student, attendance: attendanceResponse.data.data });
    }

    console.log(attendanceRecords);
    // Handle the attendance records accordingly
  } catch (error) {
    console.error('Error retrieving students or attendance records:', error);
    // Handle the error
  }
  
  // Open another window after fetching attendance records
  //window.open('http://localhost:3000/react-rtc-demo', '_blank');
};
const handleViewAttendance = (courseCode) => {
  // Redirect the user to the course page
  window.location.href = `http://localhost:3000/Eclassrooms/${courseCode}`;
};

  return (
    <div className="educator-home">
      <h2>Welcome, <span className='usernametitle'>{user.educator.name} </span> !</h2>
      <div className="upcoming-classes-container">
        <h3 className='h3'><FaDesktop className='desktop-icon' /> Upcoming Virtual Classes</h3>
        <div className="classroom-container">
          {Ecourses.length > 0 ? (
            fetchedClassrooms
            .filter(classroom => new Date(classroom.date).toISOString().split('T')[0] >= currentDate.toISOString().split('T')[0])
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((classroom, index) => {
              const matchingCourse = Ecourses.find(course => course === classroom.courseID);
              if (matchingCourse) {
                return (
                  <div key={classroom._id} className="classroom-box">
                    <p>
                      {classroom.courseID}: {classroom.title}
                      <div className="joindiv">
                        {/* Pass the classroom ID to the handleJoinClassroom function */}
                        <button onClick={async () => { handleJoinClassroom(classroom.courseID, classroom._id ) }} className="join-link">
                          Join <FaArrowRight className="arrow-icon" />
                        </button>
                      </div>
                      {/* <div className="joindiv">
                        <a href="http://localhost:3000/react-rtc-demo" target="_blank"  className="join-link">
                          Join<FaArrowRight className="arrow-icon" />
                        </a>
                      </div> */}
                      <div>{formatDate(classroom.date)}, {classroom.time}, {classroom.duration} minutes</div>
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
      <div className="big-attendance-container">
        <h3 className='h3'><FaFileAlt className='desktop-icon'/> Reports</h3>
        <div className="classroom-container">
          {fetchedCourses.length > 0 ? (
            fetchedCourses.map((course,index) => {
              return (
                <div key={course._id} className="classroom-box">
                  <p>
                    {course.code}: {course.title}
                    <div className="joindiv">
                        {/* Pass the classroom ID to the handleJoinClassroom function */}
                        <button onClick={()=>{handleViewAttendance(course.code)}} className="join-link">
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
    </div>
  );
};

export default EducatorHome;
