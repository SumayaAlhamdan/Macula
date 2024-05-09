
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from "../components/popup";
import OrangeButton from "../components/OrangeButton";
import WhiteButton from "../components/WhiteButton";
import "./AdminProfile.css"; // Import the CSS file


const AdminProfile = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [buttonPopup, setButtonPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showNewPasswordInput, setShowNewPasswordInput] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch admin data or perform any necessary initialization here
  }, []);

  const handleSendOTP = async () => {
    try {
      await axios.post('/api/send-otp', { email });
      setShowOtpInput(true);
      // setMessage('OTP has been sent to your email');
    } catch (error) {
      console.error('Error sending OTP:', error);
      setMessage('Failed to send OTP');
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post('/api/verify-otp', { email, otp });
      if (response.data.valid) {
        setShowNewPasswordInput(true);
        setMessage('');
      } else {
        setMessage('Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setMessage('Failed to verify OTP');
    }
  };

  const handleResetPassword = async () => {
    try {
      await axios.post('/api/admins/reset', { email: 'admin@admin.com', newPassword: newPassword });
      setMessage('Password reset successfully');
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage('Failed to reset password');
    }
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
        <textbutton className='reset-button' onClick={() => setButtonPopup(true)}>Reset Password</textbutton>
      </div>
      <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
        <div className="popup-content">
          {/* Step 1: Enter email */}
          {!showOtpInput && !showNewPasswordInput && (
            <>
              <h3>Enter email</h3>
              <p className="small-text">Please enter your email to receive OTP</p>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" />
              <div className="buttons-container">
                <WhiteButton text="Cancel" onClick={() => setButtonPopup(false)} />
                <OrangeButton onClick={handleSendOTP} text="Send OTP" />
              </div>
            </>
          )}
          {/* Step 2: Enter OTP */}
          {showOtpInput && !showNewPasswordInput && (
            <>
              <h3>Please check your email.</h3>
              <p className="small-text">We've sent a code to {email}</p>
              <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter OTP" />
              <div className="buttons-container">
                <WhiteButton text="Back" onClick={() => setShowOtpInput(false)} />
                <OrangeButton onClick={handleVerifyOTP} text="Verify OTP" />
              </div>
            </>
          )}
          {/* Step 3: Enter new password */}
          {showNewPasswordInput && (
            <>
              <h3>Reset Password</h3>
              <p className="small-text">Please enter your new password to reset.</p>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password" />
              <div className="buttons-container">
                <WhiteButton text="Back" onClick={() => setShowNewPasswordInput(false)} />
                <OrangeButton onClick={handleResetPassword} text="Reset Password" />
              </div>
            </>
          )}
          {message && <p>{message}</p>}
        </div>
      </Popup>
    </div>
  );
};

export default AdminProfile;
