import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RealtimeEngage() {
  const [classID, setClassID] = useState('');
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (classID) {
      setLoading(true);
      axios.get(`/api/classrooms/${classID}`)
        .then(response => {
          setStudents(response.data.students);
          setError('');
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching classroom data:', error);
          setError('Error fetching classroom data. Please try again.');
          setStudents([]);
          setLoading(false);
        });
    } else {
      setStudents([]);
      setError('');
    }
  }, [classID]);

  useEffect(() => {
    // Connect to WebSocket server
    const socket = new WebSocket('ws://localhost:8000'); // Replace with your WebSocket server URL

    // Listen for messages from WebSocket server
    socket.onmessage = event => {
      const updatedStudent = JSON.parse(event.data);
      setStudents(prevStudents =>
        prevStudents.map(student =>
          student._id === updatedStudent._id ? updatedStudent : student
        )
      );
    };

    // Cleanup function
    return () => {
      socket.close();
    };
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
      <header>
        <div className="container">
          <h1>Student Engagement Dashboard</h1>
          <nav>
            <input
              type="text"
              placeholder="Enter Class ID"
              value={classID}
              onChange={(e) => setClassID(e.target.value)}
            />
            <button onClick={() => setClassID('')}>Clear</button>
          </nav>
        </div>
      </header>

      <div className="pages">
        <div className="home">
          <div className="student-list">
            <h2>Students and Engagement Status</h2>
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            <ul>
              {students.map(student => (
                <li key={student._id} style={{ color: getStatusColor(student.engagementData?.['Engagement Status']) }}>
                  {`${student._id} - ${student.name} - ${student.engagementData?.['Engagement Status'] || 'Unknown'}`}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RealtimeEngage;
