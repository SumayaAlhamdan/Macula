import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './view.css';


const RealtimeEngage = () => {
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
              const studentData = students[index]; // Access the object at index
              const student = studentData && studentData.student; // Access the student object within the object at index
              return {
                ...record,
                studentID: student ? student.ID : '', // Access student ID as student.ID
                studentName: student ? student.name : 'Unknown' // Access student name as student.name
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

  const getStatusColor = status => {
    switch (status) {
      case 'FOCUSED':
        return 'green';
      case 'DISTRACTED':
        return 'red';
      default:
        return 'black';
    }
  };

  return (
    <div className="App">
      <div className="pages">
        <div className="home">
          <div className="student-list">
            <h2>Students Engagement Status</h2>
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            <table style={{ margin: '0 auto' }}>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Student ID</th>
                  <th>Engagement Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student._id} style={{ color: getStatusColor(student['Engagement Status']) }}>
                    <td>{student.studentName}</td>
                    <td>{student._id}</td>
                    <td>{student['Engagement Status']}</td>
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

export default RealtimeEngage;
