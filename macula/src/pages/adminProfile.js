import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResetPasswordPopup from '../components/resetpassPOPUP';

const AdminProfile = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResetPasswordPopup, setShowResetPasswordPopup] = useState(false);

  useEffect(() => {
    // Fetch admin data or perform any necessary initialization here
  }, []);

  const handleResetPasswordClick = () => {
    setShowResetPasswordPopup(true);
  };

  return (
    <div className="profile-page">
      <h1>Admin Profile</h1>
      <div className="profile-container">
        <h2>Personal Information</h2>
        <div className="profile-data">
          <div className="profile-field">
            <label>ID:</label>
            <span>{user.admin?.ID}</span>
          </div>
          <div className="profile-field">
            <label>Name:</label>
            <span>{user.admin?.name}</span>
          </div>
          <div className="profile-field">
            <label>Email:</label>
            <span>{user.admin?.email}</span>
          </div>
        </div>
      </div>
      <button onClick={handleResetPasswordClick}>Reset Password</button>
      {showResetPasswordPopup && <ResetPasswordPopup />}
    </div>
  );
};

export default AdminProfile;
