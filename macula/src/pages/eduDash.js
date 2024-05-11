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
  const [classroom, setClassroom] = useState('');

  useEffect(() => {
    fetchData();
  }, []);
  


  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('courseCode');
      const id = params.get('classroomID');
      if (code && id) {
        setCourseCode(code);
        setClassroomID(id);
        await Promise.all([
          fetchAllStudents(code).then(() => {
            fetchAttendanceData(code, id);
            fetchEngagementData(id,attendanceData);
          }),
          fetchClassroomDetails(id)
        ]);
      } else {
        setError('Course code and classroom ID not provided');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchAllStudents = async (courseCode) => {
    try {
      const studentResponse = await axios.get(`/api/courses/sCourse/${courseCode}/students`);
      const students = studentResponse.data.students;
      setAttendanceData(students.map(student => ({ student, attendance: 'Absent' })));
      setEngagementData([]);
      setError('');
    } catch (error) {
      console.error('Error fetching student data:', error);
      setError('Error fetching student data. Please try again.');
    }
  };
  
  


  const fetchAttendanceData = async (courseCode, classroomID) => {
    try {
      const studentResponse = await axios.get(`/api/courses/sCourse/${courseCode}/students`);
      const students = studentResponse.data.students;
      console.log(students);
      const attendanceRecords = [];
      for (const student of students) {
        const attendanceResponse = await axios.get(`/api/attendance/dashboard?studentId=${student.ID}&classroomId=${classroomID}`);
        const { data } = attendanceResponse.data;
        console.log(data);
        if (data && data.length > 0) {
          console.log(data[0]);
          const classroomIdFromData = data[0].classroom_id;
          console.log(classroomIdFromData + "////////" + classroomID);
          if (classroomIdFromData === classroomID) {
            console.log("yayyy");
            attendanceRecords.push({ student, attendance: "Present" });
          } else {
            attendanceRecords.push({ student, attendance: "Absent" });
          }
        } else {
          attendanceRecords.push({ student, attendance: "Absent" });
        }
      }
      setAttendanceData(attendanceRecords);
      console.log(attendanceData);
      setError('');
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      setError('Error fetching attendance data. Please try again.');
    }
  };

  const fetchEngagementData = async (classroomID,attendanceData) => {
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
        const attendanceStatus = attendanceData.find(attendance => attendance.student.ID === student.ID);
        console.log(attendanceStatus);
        const attendance = attendanceStatus ? attendanceStatus.attendance : "Absent";
        return {
          ...record,
          studentID: student ? student.ID : '',
          studentName: student ? student.name : 'Unknown',
          attendance,
          focusDuration: (record['Focus Duration'] / 60).toFixed(1) || 'N/A',
          distractedDuration: (record['Distracted Duration'] / 60).toFixed(1) || 'N/A',
          longestFocusDuration: (record['Longest Focus Duration'] / 60).toFixed(1) || 'N/A'
        };
      });
      setEngagementData(updatedStudents);
      setError('');
    } catch (error) {
      console.error('Error fetching engagement data:', error);
      setError('Error fetching engagement data. Please try again.');
    }
  };

  const fetchClassroomDetails = async (id) => {
    try {
      const response = await axios.get(`/api/classrooms/${id}`);
      setClassroom(response.data.message);
    } catch (error) {
      console.error('Error fetching classroom details:', error);
      setError('Error fetching classroom details. Please try again.');
    }
  }

  return (
    <div className="educator-dashboard">
      <div className="classroom-details">
        <h2>Classroom Details</h2>
        {classroom ? (
          <div className="details-container">
            <div className="detail">
              <p><strong>Course ID:</strong> {classroom.courseID}</p>
              <p><strong>Date:</strong> {new Date(classroom.date).toLocaleDateString()}</p>
            </div>
            <div className="detail">
              <p><strong>Title:</strong> {classroom.title}</p>
              <p><strong>Time:</strong> {classroom.time}</p>
            </div>
          </div>
        ) : (
          <p>No classroom details available</p>
        )}
      </div>

      <div className="page-content">
      {currentPage === 'attendance' && (
  <div className="attendance-page">
    <h1>Reports</h1>
    {loading && <p>Loading...</p>}
    {error && <p className="error">{error}</p>}
    <table style={{ margin: '0 auto' }}>
      <thead>
        <tr>
          <th>Student ID</th>
          <th>Student name</th>
          <th>Attendance Status</th>
          <th>Focus Duration (mins)</th>
          <th>Distracted Duration (mins)</th>
          <th>Longest Focus Duration (mins)</th>
        </tr>
      </thead>
      <tbody>
        {attendanceData.map(student => {
          const engagementRecord = engagementData.find(record => record.studentID === student.student.ID);
          return (
            <tr key={student.student.ID}>
              <td>{student.student.ID}</td>
              <td>{student.student.name}</td>
              <td>{student.attendance}</td>
              <td>{engagementRecord ? engagementRecord.focusDuration : 'N/A'}</td>
              <td>{engagementRecord ? engagementRecord.distractedDuration : 'N/A'}</td>
              <td>{engagementRecord ? engagementRecord.longestFocusDuration : 'N/A'}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
)}

      </div>
    </div>
  );
}

export default EducatorDashboard;


