
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Courses = () => {
  // Check if the user is a student or an educator
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userRole = storedUser ? (storedUser.student ? 'student' : 'educator') : null;
  const navigate = useNavigate();

  // Perform navigation based on user role when the component mounts
  useEffect(() => {
    if (userRole === 'student') {
      navigate('/sviewcourse');
    } else if (userRole === 'educator') {
      navigate('/eviewcourse');
    }
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  // Render nothing while navigation is in progress
  return null;
};

export default Courses;
