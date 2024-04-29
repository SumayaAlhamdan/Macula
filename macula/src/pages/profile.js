import React, { useState, useEffect } from 'react';
import { FaMedal, FaRegUserCircle, FaRegUser,} from 'react-icons/fa';
import axios from 'axios';
import "./profile.css"; // Import the CSS file
import { RiMedalLine } from "react-icons/ri";


const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [engagementRecords, setEngagementRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [medalsEarned, setMedalsEarned] = useState(
    parseInt(localStorage.getItem('medalsEarned')) || 0
  );
  const [medalsEarnedFocus, setMedalsEarnedFocus] = useState(0);
  const [_10minClassroomIDs, set10minClassroomIDs] = useState([]);
  const [_5minClassroomIDs, set5minClassroomIDs] = useState([]);
  const [fetchedClassrooms, setFetchedClassrooms] = useState([]);

  const fetchClassrooms = async () => {
    try {
      const response = await axios.get('/api/classrooms');
      const classrooms = response.data.message;
      setFetchedClassrooms(classrooms);
      console.log("Fetched classrooms:", classrooms);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
    }
  }

  const fetchEngagementRecords = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/engagement/student/${user.student.ID}`);
      setLoading(false);
      
      // Limit the number of records to 150
      const engagementRecords = response.data.engagementRecords.slice(0, 150);
      
      setEngagementRecords(engagementRecords);
      setError('');
  
      // Filter engagement records for focus duration >= 600
      const records10mins = engagementRecords.filter(record => record["Longest Focus Duration"] >= 600);
      setMedalsEarned(records10mins.length);
  
      // Filter engagement records for focus duration >= 300 and < 600
      const records5mins = engagementRecords.filter(record => record["Longest Focus Duration"] >= 300 && record["Longest Focus Duration"] < 600);
      setMedalsEarnedFocus(records5mins.length);
  
      // Retrieve classroomID and store them in separate arrays
      const classroomIDs10mins = records10mins.map(record => record.classroomID);
      const classroomIDs5mins = records5mins.map(record => record.classroomID);
      set10minClassroomIDs(classroomIDs10mins);
      set5minClassroomIDs(classroomIDs5mins);
    } catch (error) {
      console.error('Error fetching engagement records:', error);
      setError('Error fetching engagement records');
      setLoading(false);
      setEngagementRecords([]);
    }
  };

  const fetchRewardsInfo = async () => {
    try {
      const rewardsInfo = [];
      // Check if _10minClassroomIDs is defined and not empty
      if (_10minClassroomIDs && _10minClassroomIDs.length > 0) {
        for (const classroomID of _10minClassroomIDs) {
          // Find the classroom with the matching ID
          const classroom = fetchedClassrooms.find(classroom => classroom._id === classroomID);
          if (classroom) {
            // If found, store the classroom information
            rewardsInfo.push(classroom);
            
            // Print the content of the classroom
            console.log('Classroom:', classroom);
          }
        }
      } else {
        console.log('_10minClassroomIDs is empty or undefined');
      }
      // Do whatever you want with the rewardsInfo array
      console.log('Rewards information:', rewardsInfo);
    } catch (error) {
      console.error('Error fetching rewards records:', error);
    }
  };

  // Inside fetchRewardsInfo5
  const fetchRewardsInfo5 = async () => {
    try {
      const rewardsInfo = [];
      // Check if _5minClassroomIDs is defined and not empty
      if (_5minClassroomIDs && _5minClassroomIDs.length > 0) {
        for (const classroomID of _5minClassroomIDs) {
          // Find the classroom with the matching ID
          const classroom = fetchedClassrooms.find(classroom => classroom._id === classroomID);
          if (classroom) {
            // If found, store the classroom information
            rewardsInfo.push(classroom);
            
            // Print the content of the classroom
            console.log('Classroom:', classroom);
          }
        }
      } else {
        console.log('_5minClassroomIDs is empty or undefined');
      }
      // Do whatever you want with the rewardsInfo array
      console.log('5 min Rewards information:', rewardsInfo);
    } catch (error) {
      console.error('Error fetching 5 min rewards records:', error);
    }
  };

  // Call the functions
  useEffect(() => {
    fetchEngagementRecords();
    fetchClassrooms();
    fetchRewardsInfo();
    fetchRewardsInfo5();
  }, [user]);

  useEffect(() => {
    localStorage.setItem('medalsEarned', medalsEarned);
  }, [medalsEarned]);

  useEffect(() => {
    localStorage.setItem('medalsEarnedFocus', medalsEarnedFocus);
  }, [medalsEarnedFocus]);

  return (
    <div className="profile-page">
      <h1 ><FaRegUser className='desktop-icon' />Profile</h1>
      <h3 className='profile-heading'><FaRegUserCircle className='desktop-icon'/>  Personal Information</h3>
      <div className="profile-container">
        <div className="profile-data">
          <div className="profile-field">
            <label>ID:</label>
            <span>{user.student ? user.student.ID : user.educator.ID}</span>
          </div>
          <div className="profile-field">
            <label>Name:</label>
            <span>{user.student ? user.student.name : user.educator.name}</span>
          </div>
          <div className="profile-field">
            <label>Email:</label>
            <span>{user.student ? user.student.email : user.educator.email}</span>
          </div>
        </div>
      </div>
      <h3 className='profile-heading2'><RiMedalLine className='desktop-icon'/>  Rewards</h3>

      {user.student && (
        
        <div className="rewards-container">
          
  <div className="medal-container">
  {/* Render the earned medals for 10 minutes focus streaks */}
  {_10minClassroomIDs.length > 0 ? (
    <div>
      <h3>10 minutes focus streaks</h3>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {_10minClassroomIDs.map((classroomID, index) => {
          const classroom = fetchedClassrooms.find(c => c._id === classroomID);
          return (
            <div key={index} style={{ margin: '0 10px' }}>
              <RiMedalLine color="#EF5423" size={80} />
              {classroom && (
  <div style={{ fontSize: '14px', textAlign: 'center' }}>
    <p style={{ fontSize: '12px', marginBottom: '5px' }}>{classroom.courseID}</p>
    <p style={{ fontSize: '12px', padding: '0', margin: '0' }}>{classroom.title}</p>
  </div>
)}

            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <div>
      <h3>10 minutes focus streaks</h3>
      <p>No rewards earned</p>
    </div>
  )}

  {/* Render the earned medals for 5 minutes focus streaks */}
  {_5minClassroomIDs.length > 0 ? (
    <div>
      <h3>5 minutes focus streaks</h3>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {_5minClassroomIDs.map((classroomID, index) => {
          const classroom = fetchedClassrooms.find(c => c._id === classroomID);
          return (
            <div key={index} style={{ margin: '0 10px' }}>
              <RiMedalLine color="#109BA8" size={80} />
              {classroom && (
  <div style={{ fontSize: '14px', textAlign: 'center' }}>
    <p style={{ fontSize: '12px', marginBottom: '5px' }}>{classroom.courseID}</p>
    <p style={{ fontSize: '12px', padding: '0', margin: '0' }}>{classroom.title}</p>
  </div>
)}

            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <div>
      <h3>5 minutes focus streaks</h3>
      <p>No rewards earned</p>
    </div>
  )}
</div>

</div>

      )}
    </div>
  );
};

export default Profile;

