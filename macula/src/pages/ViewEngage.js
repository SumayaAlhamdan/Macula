import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EngagementRecords = () => {
  const [courseID, setCourseID] = useState('');
  const [engagementRecords, setEngagementRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (courseID.trim() !== '') { // Only fetch if courseID is not empty
      fetchEngagementRecords();
    }
  }, [courseID]);

  const fetchEngagementRecords = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/engagement/${courseID}`);
      setEngagementRecords(response.data.engagementRecords); // Access 'engagementRecords' array
      setLoading(false);
      setError('');
    } catch (error) {
      console.error('Error fetching engagement records:', error);
      setError('Error fetching engagement records');
      setLoading(false);
      setEngagementRecords([]); // Reset engagementRecords on error
    }
  };

  const handleChange = (e) => {
    setCourseID(e.target.value);
  };

  return (
    <div>
      <h2>Engagement Records</h2>
      <div>
        <label htmlFor="courseID">Enter Course ID:</label>
        <input
          type="text"
          id="courseID"
          value={courseID}
          onChange={handleChange}
          placeholder="Course ID"
        />
        <button onClick={fetchEngagementRecords}>Search</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {engagementRecords.map((record) => (
          <li key={record._id}>
            Student ID: {record.studentID}, Course ID: {record.courseID}, Timestamp: {record.timestamp}, Engagement Status: {record["Engagement Status"]}, Focus Duration: {record["Focus Duration"]}, Longest Focus Duration: {record["Longest Focus Duration"]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EngagementRecords;

