import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AttendancePage() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const courseCode = params.get('courseCode');
    const classroomID = params.get('classroomID');
    if (courseCode && classroomID) {
      fetchAttendanceData(courseCode, classroomID);
    } else {
      setError('Course code and classroom ID not provided');
    }
  }, []);

  const fetchAttendanceData = async (courseCode, classroomID) => {
    setLoading(true);
    try {
      const studentResponse = await axios.get(`/api/courses/sCourse/${courseCode}/students`);
      const students = studentResponse.data.students;
  
      // Fetch attendance records for each student in the original window
      const attendanceRecords = [];
      for (const student of students) {
        const attendanceResponse = await axios.get(`/api/attendance/report?studentId=${student.ID}&classroomId=${classroomID}`);
        console.log('Attendance Response:', attendanceResponse.data); // Log the entire response data
        const { data } = attendanceResponse.data;
        console.log('Data:', data); // Log the extracted data object
        if (data && data.length > 0) { // Check if data array is not empty
          const classroomIdFromData = data[0].classroom_id;
          if (classroomIdFromData === classroomID) {
            attendanceRecords.push({ student, attendance: "Present" });
          } else {
            attendanceRecords.push({ student, attendance: "Absent" });
          }
        } else {
          attendanceRecords.push({ student, attendance: "Absent" }); // Assuming absence if data is empty
        }
      }
      setAttendanceData(attendanceRecords);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      setError('Error fetching attendance data. Please try again.');
    }
    setLoading(false);
  };
  
  
  

  return (
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
  );
}

export default AttendancePage;
