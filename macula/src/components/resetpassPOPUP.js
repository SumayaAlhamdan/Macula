import React, { useState } from 'react';
import axios from 'axios';

const ResetPasswordPopup = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showNewPasswordInput, setShowNewPasswordInput] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendOTP = async () => {
    try {
      await axios.post('/api/send-otp', { email });
      setShowOtpInput(true);
      setMessage('OTP has been sent to your email');
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
      await axios.post('/api/admins/reset', { email: 'admin@admin.com', password: newPassword });
      setMessage('Password reset successfully');
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage('Failed to reset password');
    }
  };
  
  return (
    <div>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" />
      <button onClick={handleSendOTP}>Send OTP</button>

      {showOtpInput && (
        <>
          <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter OTP" />
          <button onClick={handleVerifyOTP}>Verify OTP</button>
        </>
      )}

      {showNewPasswordInput && (
        <>
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password" />
          <button onClick={handleResetPassword}>Reset Password</button>
        </>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPasswordPopup;
