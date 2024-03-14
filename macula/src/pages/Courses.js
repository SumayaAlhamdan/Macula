import React from 'react';

const Courses = () => {
  // Check if the user is a student or an educator
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userRole = storedUser ? (storedUser.student ? 'student' : 'educator') : null;

  // Add your logic for students or educators
  if (userRole === 'student') {
    // Logic for student
    return (
      <div className="courses">
        <h2>Student Courses</h2>
        {/* Add your content for students */}
      </div>
    );
  } else if (userRole === 'educator') {
    // Logic for educator
    return (
      <div className="courses">
        <h2>Educator Courses</h2>
        {/* Add your content for educators */}
      </div>
    );
  } else {
    // Logic for other roles or unauthenticated users
    return (
      <div className="courses">
        <h2>Unauthorized Access</h2>
        {/* You can render a message for users who don't have appropriate roles */}
      </div>
    );
  }
};

export default Courses;
