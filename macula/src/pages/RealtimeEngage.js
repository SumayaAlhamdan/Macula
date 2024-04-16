import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const RealtimeEngage = () => {
  const { classroomID: initialClassroomID } = useParams();
  const [classroomID, setClassroomID] = useState(initialClassroomID || ''); // Initialize with the classroomID from the URL
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (classroomID) {
      setLoading(true);
      // Step 1: Fetch all engagement records for the given classroomID
      axios.get(`/api/engagement/${classroomID}`)
        .then(async response => {
          console.log('Engagement Records:', response.data);
          const engagementRecords = response.data.engagementRecords;

          // Step 2: Extract studentIDs from the engagement records
          const studentIDs = engagementRecords.map(record => record.studentID);

          // Step 3: Fetch student data for each studentID
          const studentDataPromises = studentIDs.map(studentID =>
            axios.get(`/api/students/${studentID}`)
          );

          try {
            const studentResponses = await Promise.all(studentDataPromises);
            const students = studentResponses.map(response => response.data);

            // Log fetched student data
            console.log('Fetched Students:', students);

            // Step 4: Combine engagement records with fetched student data
            const updatedStudents = engagementRecords.map((record, index) => {
              const student = students[index]; // Assuming the order of students matches the order of engagement records
              return {
                ...record,
                studentID: student ? student.ID : '', // Add student ID
                studentName: student ? student.name : 'Unknown' // Assuming student has a "name" field
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
  }, [classroomID]);

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

  const handleClassroomIDChange = (event) => {
    setClassroomID(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Reload data based on the new classroomID
  };

  return (
    <div className="App">
      <div className="pages">
        <div className="home">
          <div className="student-list">
            <h2>Students and Engagement Status</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Classroom ID:
                <input type="text" value={classroomID} onChange={handleClassroomIDChange} />
              </label>
              <button type="submit">Load Data</button>
            </form>
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            <table>
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
    <td>{student._id}</td> {/* Use _id as studentID */}
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

