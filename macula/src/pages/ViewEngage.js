import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './view.css';


const ViewEngage = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const courseCode = urlParams.get('courseCode');
    const classroomID = urlParams.get('classroomID');

    if (courseCode && classroomID) {
      setLoading(true);
      axios.get(`/api/engagement/${classroomID}`)
        .then(async response => {
          console.log('Engagement Records:', response.data);
          const engagementRecords = response.data.engagementRecords;
          const studentIDs = engagementRecords.map(record => record.studentID);
          const studentDataPromises = studentIDs.map(studentID =>
            axios.get(`/api/students/${studentID}`)
          );

          try {
            const studentResponses = await Promise.all(studentDataPromises);
            const students = studentResponses.map(response => response.data);
            console.log('Fetched Students:', students);

            const updatedStudents = engagementRecords.map((record, index) => {
              const studentData = students[index];
              const student = studentData && studentData.student;
              return {
                ...record,
                studentID: student ? student.ID : '',
                studentName: student ? student.name : 'Unknown',
                focusDuration: (record['Focus Duration'] / 60).toFixed(1) || 'N/A', // Converted to minutes and rounded to 1 decimal place
                distractedDuration: (record['Distracted Duration'] / 60).toFixed(1) || 'N/A', // Converted to minutes and rounded to 1 decimal place
                longestFocusDuration: (record['Longest Focus Duration'] / 60).toFixed(1) || 'N/A' // Converted to minutes and rounded to 1 decimal place
              };
            });

            setStudents(updatedStudents);
            setLoading(false);
            setError('');
          } catch (error) {
            console.error('Error fetching student data:', error);
            setError('Error fetching student data. Please try again.');
            setLoading(false);
            setStudents([]);
          }
        })
        .catch(error => {
          console.error('Error fetching engagement records:', error);
          setError('Error fetching engagement records. Please try again.');
          setLoading(false);
          setStudents([]);
        });
    } else {
      setStudents([]);
      setError('');
    }
  }, []);

  return (
    <div className="App">
      <div className="pages">
        <div className="home">
          <div className="student-list">
            <h2>Students and Engagement Data</h2>
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
                {students.map(student => (
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
        </div>
      </div>
    </div>
  );
};

export default ViewEngage;

