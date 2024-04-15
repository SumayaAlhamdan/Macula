import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RealtimeEngage() {
  const [classID, setClassID] = useState('');
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('Class ID:', classID); // Log class ID
    if (classID) {
      setLoading(true);
      axios.get(`/api/engagement/${classID}`)
        .then(response => {
          console.log('Response:', response.data); // Log response data
          // Fix typo in "Engagement Status"
          const updatedStudents = response.data.engagementRecords.map(record => {
            return {
              ...record,
              'Engagement Status': record['Engagement Status'] === 'FOUCESED' ? 'FOCUSED' : record['Engagement Status']
            };
          });
          setStudents(updatedStudents);
          setError('');
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching classroom data:', error);
          setError('Error fetching classroom data. Please try again.');
          setStudents([]); // Set to empty array in case of error
          setLoading(false);
        });
    } else {
      setStudents([]); // Set to empty array when classID is cleared
      setError('');
    }
  }, [classID]);

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

  const handleClassIDChange = event => {
    setClassID(event.target.value);
  };

  return (
    <div className="App">
      {/* Header and input elements */}
      <div className="pages">
        <div className="home">
          <div className="student-list">
            <h2>Students and Engagement Status</h2>
            <div>
              <label htmlFor="classIDInput">Enter Class ID:</label>
              <input
                id="classIDInput"
                type="text"
                value={classID}
                onChange={handleClassIDChange}
              />
            </div>
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            <ul>
              {students && students.map(student => (
                <li key={student._id} style={{ color: getStatusColor(student['Engagement Status']) }}>
                  {`${student.studentID} - ${student['Engagement Status']} - ${student['Distracted Duration'] || 0} s`}
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
