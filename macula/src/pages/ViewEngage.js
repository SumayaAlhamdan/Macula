import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

const EngagementRecords = () => {
  const [courseID, setCourseID] = useState('');
  const [engagementRecords, setEngagementRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [studentsFocusStatus, setStudentsFocusStatus] = useState({});
  const chartRef = useRef(null);

  useEffect(() => {
    console.log('Fetching engagement records...');
    if (courseID.trim() !== '') { // Only fetch if courseID is not empty
      fetchEngagementRecords();
    }
  }, [courseID]);

  useEffect(() => {
    console.log('Updating students focus status...');
    updateStudentsFocusStatus();
  }, [engagementRecords]);

  useEffect(() => {
    console.log('Drawing chart...');
    drawChart(); // Call drawChart function once engagement records are fetched
  }, [engagementRecords]);

  const fetchEngagementRecords = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/engagement/${courseID}`);
      setEngagementRecords(response.data.engagementRecords); // Access 'engagementRecords' array
      console.log(response.data.engagementRecords);
      setLoading(false);
      setError('');
    } catch (error) {
      console.error('Error fetching engagement records:', error);
      setError('Error fetching engagement records');
      setLoading(false);
      setEngagementRecords([]); // Reset engagementRecords on error
    }
  };

  const updateStudentsFocusStatus = () => {
    console.log('Updating students focus status...');
    const focusStatus = {};
    engagementRecords.forEach(record => {
      focusStatus[record.studentID] = record['Engagement Status'];
    });
    setStudentsFocusStatus(focusStatus);
  };

  const handleChange = (e) => {
    console.log('Course ID changed:', e.target.value);
    setCourseID(e.target.value);
  };

  const drawChart = () => {
    console.log('Drawing chart...');
    if (chartRef.current) {
      chartRef.current.destroy(); // Destroy previous chart
    }

    const ctx = document.getElementById('engagementChart');
    if (!ctx) return;

    const labels = engagementRecords.map(record => record.studentID);
    const data = engagementRecords.map(record => record['Focus Duration']);

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Focus Duration (seconds)',
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
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
      <h3>Students Focus Status</h3>
      <ul>
        {Object.entries(studentsFocusStatus).map(([studentID, status]) => (
          <li key={studentID}>
            Student ID: {studentID}, Focus Status: {status}
          </li>
        ))}
      </ul>
      <canvas id="engagementChart" width="400" height="400"></canvas>
    </div>
  );
};

export default EngagementRecords;
