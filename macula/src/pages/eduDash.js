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
  }, [currentPage]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('courseCode');
      const id = params.get('classroomID');
      if (code && id) {
        setCourseCode(code);
        setClassroomID(id);
        fetchClassroomDetails(id);
        fetchAttendanceData(code, id);
        fetchEngagementData(id);
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

  const fetchAttendanceData = async (courseCode, classroomID) => {
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
      setError('');
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      setError('Error fetching attendance data. Please try again.');
    }
  };

  const fetchEngagementData = async (classroomID) => {
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
                  <th>Attendance Status</th>
                  <th>Focus Duration (mins)</th>
                  <th>Distracted Duration (mins)</th>
                  <th>Longest Focus Duration (mins)</th>
                </tr>
              </thead>
              <tbody>
                {engagementData.map(student => (
                  <tr key={student.studentID}>
                    <td>{student.studentID}</td>
                    <td>{student.attendance}</td>
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


