import React from 'react';

const Profile = () => {
  // Retrieve user information from local storage
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      <div className="profile-container">
        <h2>Personal Information</h2>
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
          {/* Add more profile information fields as needed */}
        </div>
      </div>
      {user.student && (
        <div className="rewards-container">
          <h2>Rewards</h2>
          {/* Add reward-related content for students */}
          <p>Student-specific reward information goes here.</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
