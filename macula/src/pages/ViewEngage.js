import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ViewEngage() {
  const [classID, setClassID] = useState('');
  const [engagementRecords, setEngagementRecords] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (classID) {
      setLoading(true);
      axios.get(`/api/engagement/${classID}`)
        .then(response => {
          // Check if response contains engagementRecords array
          if (Array.isArray(response.data.engagementRecords)) {
            setEngagementRecords(response.data.engagementRecords);
            setError('');
          } else {
            setError('No data available');
            setEngagementRecords([]);
          }
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching engagement data:', error);
          setError('Error fetching engagement data. Please try again.');
          setEngagementRecords([]);
          setLoading(false);
        });
    } else {
      setEngagementRecords([]);
      setError('');
    }
  }, [classID]);

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
            <h2>Students and Engagement Data</h2>
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            {Array.isArray(engagementRecords) && engagementRecords.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Focus Duration</th>
                    <th>Distracted Duration</th>
                    <th>Longest Focus Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {engagementRecords.map(record => (
                    <tr key={record._id}>
                      <td>{record.studentID}</td>
                      <td>{record['Focus Duration'] || 'N/A'}</td>
                      <td>{record['Total Distraction Duration'] || 'N/A'}</td>
                      <td>{record['Longest Focus Duration'] || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>{error || 'No data available'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewEngage;
