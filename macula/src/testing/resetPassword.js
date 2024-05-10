
import React, { Component } from 'react';

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      otp: '',
      newPassword: '',
      isLoading: false,
      error: null,
    };
  }


  // Email validation function
  isValidEmail = (email) => {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  handleSendOTP = async () => {
    const { email } = this.state;
    if (!email) {
      this.setState({ error: 'Email is required' });
      return;
    }
    // Email validation
    if (!this.isValidEmail(email)) {
      this.setState({ error: 'Invalid email format' });
      return;
    }
  
    try {
      this.setState({ isLoading: true, error: null });
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (response.status === 200) {
        // Set success state to true
        this.setState({ isLoading: false, success: true });
      } else {
        const json = await response.json();
        this.setState({ isLoading: false, error: json.message });
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      this.setState({ isLoading: false, error: 'An error occurred while sending OTP.' });
    }
  };
  

  handleVerifyOTP = async () => {
    const { email, otp } = this.state;

    // Validate OTP
    if (!otp) {
      this.setState({ error: 'OTP is required' });
      return;
    }

    try {
      this.setState({ isLoading: true, error: null });
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      if (response.status === 200) {
        this.setState({ isLoading: false });
        // Handle success
      } else {
        const json = await response.json();
        this.setState({ isLoading: false, error: json.message });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      this.setState({ isLoading: false, error: 'An error occurred while verifying OTP.' });
    }
  };

  
  handleResetPassword = async () => {
    const { email, newPassword } = this.state;
   
    try {
      this.setState({ isLoading: true, error: null });
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });
      if (response.status === 200) {
        // Set success state to true
        this.setState({ isLoading: false, success: true }); 
  
        // Handle success
      } else {
        const json = await response.json();
        this.setState({ isLoading: false, error: json.message });
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      this.setState({ isLoading: false, error: 'An error occurred while resetting password.' });
    }
  };
  
  
  render() {
    const { email, otp, newPassword, isLoading, error, success } = this.state;
  
    return (
      <div>
        {/* Render input fields and buttons for resetting password */}
        <input
          type="email"
          value={email}
          onChange={(e) => this.setState({ email: e.target.value })}
          placeholder="Enter your email"
        />
        {success && <p>OTP sent successfully</p>}
        <input
          type="text"
          value={otp}
          onChange={(e) => this.setState({ otp: e.target.value })}
          placeholder="Enter OTP"
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => this.setState({ newPassword: e.target.value })}
          placeholder="Enter new password"
        />
        <button onClick={this.handleSendOTP} disabled={isLoading}>
          Send OTP
        </button>
        <button onClick={this.handleVerifyOTP} disabled={isLoading}>
          Verify OTP
        </button>
        <button onClick={this.handleResetPassword} disabled={isLoading || !newPassword}>
          {isLoading ? "Resetting password..." : "Reset Password"}
        </button>
        {error && <p>{error}</p>}
        {success && <p>Password changed successfully</p>}
      </div>
    );
  }
  
}

export default ResetPassword;
