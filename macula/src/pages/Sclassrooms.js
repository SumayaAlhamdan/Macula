import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaDesktop, FaCalendarAlt, FaArrowRight,FaUserCheck } from 'react-icons/fa';
import BlackButton from "../components/BlackButton";
import "../css/classrooms.css";
import FaceDetection from '../FaceDetection';

const SClassrooms = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const { courseCode } = useParams();
  const [fetchedClassrooms, setFetchedClassrooms] = useState([]);
  const [selectedClassroomID, setSelectedClassroomID] = useState(null); // State to store the selected classroom ID
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const currentDate=new Date();
  useEffect(() => {
    fetchClassrooms();
    fetchAttendanceRecords();
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
  async function fetchAttendanceRecords() {
    try {
      const response = await axios.get(`/api/attendance/report?studentId=${user.student.ID}`);
      const records = response.data.data;
      setAttendanceRecords(records);
      console.log("Fetched attendance records:", records);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
    }
  }
  const getClassAttendanceStatus = (classroomID) => {
    const record = attendanceRecords.find(record => record.classroom_id === classroomID);

    return record ? 'Present' : 'Absent';
  };

  // Function to format date
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
    <div className="classroom-page">
      <div className="classroom-page-title">
        <h2><FaCalendarAlt className='course-icon' /> {courseCode}</h2>
      </div>
      <div className="upcoming-classes-container">
        <h3 className='h3'><FaDesktop className='desktop-icon' /> Upcoming Virtual Classes</h3>
        <div className="classroom-container">
          {fetchedClassrooms.length > 0 ? (
            fetchedClassrooms
            .filter(classroom => new Date(classroom.date).toISOString().split('T')[0] >= currentDate.toISOString().split('T')[0]) // Filter classes that have passed
        .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((classroom, index) => (
              classroom.courseID === courseCode ? (
                <div key={classroom._id} className="classroom-box">
                  <p>
                    {classroom.title}
                    <div className="joindiv">
                      {/* Pass the classroom ID to the handleJoinClassroom function */}
                      <button onClick={() => handleJoinClassroom(classroom._id)} className="join-link">
                        Join <FaArrowRight className="arrow-icon" />
                      </button>
                    </div>
                    {/* <div className='joindiv'> <a href="http://localhost:3000/react-rtc-demo" target="_blank"  className="join-link">
                          Join<FaArrowRight className="arrow-icon" />
                        </a>
                        </div> */}
                    <div>
                      {formatDate(classroom.date)}, {classroom.time}, {classroom.duration}</div>
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
      <div className="big-attendance-container">
  <h3 className='h3'><FaUserCheck className='desktop-icon'/> Attendance</h3>
  <div className="classroom-container">
    {fetchedClassrooms.length > 0 ? (
      fetchedClassrooms
        .filter(classroom => new Date(classroom.date) < currentDate) // Filter classes that have passed
        .filter(classroom => classroom.courseID === courseCode) // Filter classes for the specific course
        .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort classrooms from newest to oldest
        .map((classroom, index) => (
          <div key={classroom._id} className="classroom-box">
            <p>
              {classroom.title}
              <div className="attendance-status">
                <p>
                  Attendance Status: <label className='usernametitle' style={{ display: 'inline-block', marginLeft: '5px' }}>{getClassAttendanceStatus(classroom._id)}</label>
                </p>
              </div>
            </p>
            {index !== fetchedClassrooms.length - 1 && <hr />}
          </div>
        ))
    ) : (
      <p className='classesEmptyState'>No classes available</p>
    )}
  </div>
</div>

      {selectedClassroomID && <FaceDetection classroomID={selectedClassroomID} studentID={user.student.ID} onStartVideo={handleStartVideo} onCloseModal={handleCloseModal} />}

    </div>
  );
};

export default SClassrooms;
