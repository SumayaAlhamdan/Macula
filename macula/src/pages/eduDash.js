import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './view.css';

function EducatorDashboard() {
  const [currentPage, setCurrentPage] = useState('attendance');
  const [attendanceData, setAttendanceData] = useState([]);
  const [engagementData, setEngagementData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [courseCode, setCourseCode] = useState('');
  const [classroomID, setClassroomID] = useState('');
  const [classroom, setClassroom] = useState([]);


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('courseCode');
    const id = params.get('classroomID');
    if (code && id) {
      setCourseCode(code);
      setClassroomID(id);
      console.log('classroomID and CourseCode',classroomID, courseCode)
      fetchClassroomDetails(id);
      if (currentPage === 'attendance') {
        fetchAttendanceData(code, id);
      } else if (currentPage === 'engage') {
        fetchEngagementData(id);
      }
    } else {
      setError('Course code and classroom ID not provided');
    }
  }, [currentPage]);

  const fetchAttendanceData = async (courseCode, classroomID) => {
    setLoading(true);
    try {
      const studentResponse = await axios.get(`/api/courses/sCourse/${courseCode}/students`);
      const students = studentResponse.data.students;
      const attendanceRecords = [];
      for (const student of students) {
        const attendanceResponse = await axios.get(`/api/attendance/report?studentId=${student.ID}&classroomId=${classroomID}`);
        const { data } = attendanceResponse.data;
        if (data && data.length > 0) {
          const classroomIdFromData = data[0].classroom_id;
          if (classroomIdFromData === classroomID) {
            attendanceRecords.push({ student, attendance: "Present" });
          } else {
            attendanceRecords.push({ student, attendance: "Absent" });
          }
        } else {
          attendanceRecords.push({ student, attendance: "Absent" });
        }
      }
      setAttendanceData(attendanceRecords);
      setLoading(false);
      setError('');
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      setError('Error fetching attendance data. Please try again.');
      setLoading(false);
    }
    console.log('classroomID and CourseCode',classroomID, courseCode)

  };

  const fetchEngagementData = async (classroomID) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/engagement/${classroomID}`);
      const engagementRecords = response.data.engagementRecords;
      const studentIDs = engagementRecords.map(record => record.studentID);
      const studentDataPromises = studentIDs.map(studentID => axios.get(`/api/students/${studentID}`));
      const studentResponses = await Promise.all(studentDataPromises);
      const students = studentResponses.map(response => response.data);
      const updatedStudents = engagementRecords.map((record, index) => {
        const studentData = students[index];
        const student = studentData && studentData.student;
        return {
          ...record,
          studentID: student ? student.ID : '',
          studentName: student ? student.name : 'Unknown',
          focusDuration: (record['Focus Duration'] / 60).toFixed(1) || 'N/A',
          distractedDuration: (record['Distracted Duration'] / 60).toFixed(1) || 'N/A',
          longestFocusDuration: (record['Longest Focus Duration'] / 60).toFixed(1) || 'N/A'
        };
      });
      setEngagementData(updatedStudents);
      setLoading(false);
      setError('');
    } catch (error) {
      console.error('Error fetching engagement data:', error);
      setError('Error fetching engagement data. Please try again.');
      setLoading(false);
    }
  };

  const fetchClassroomDetails = async (id) => {
    try {
      const response = await axios.get(`/api/classrooms/${id}`);
      setClassroom(response.data.message);
      setLoading(false);
      console.log('responds',response.data.message)
      console.log('classroom',classroom) 

    } catch (error) {
      console.error('Error fetching classroom details:', error);
      setError('Error fetching classroom details. Please try again.');
      setLoading(false);
    }
  }

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  return (
    <div className="educator-dashboard">
      <div className="classroom-details">
      <h2>Classroom Details</h2>
      {classroom.length > 0 ? (
        <div>
          <p><strong>Course ID:</strong> {classroom.courseID}</p>
          <p><strong>Title:</strong> {classroom.title}</p>
          <p><strong>Date:</strong> {new Date(classroom.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {classroom.time}</p>
        </div>
      ) : (
        <p>No classroom details available</p>
      )}
    </div>
      <div className="navigation">
        <button onClick={() => handlePageChange('attendance')}>Attendance</button>
        <button onClick={() => handlePageChange('engage')}>Engagement</button>
      </div>
      <div className="page-content">
        {currentPage === 'attendance' && (
          <div className="attendance-page">
            <h1>Attendance Report</h1>
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            <table style={{ margin: '0 auto' }}>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Attendance Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map(record => (
                  <tr key={record.student.ID}>
                    <td>{record.student.ID}</td>
                    <td>{record.attendance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {currentPage === 'engage' && (
          <div className="student-list">
            <h1>Engagement Report</h1>
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Student ID</th>
                  <th>Focus Duration (mins)</th>
                  <th>Distracted Duration (mins)</th>
                  <th>Longest Focus Duration (mins)</th>
                </tr>
              </thead>
              <tbody>
                {engagementData.map(student => (
                  <tr key={student._id}>
                    <td>{student.studentName}</td>
                    <td>{student.studentID}</td>
                    <td>{student.focusDuration}</td>
                    <td>{student.distractedDuration}</td>
                    <td>{student.longestFocusDuration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default EducatorDashboard;
