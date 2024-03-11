import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

const Home = () => {
  const { user } = useAuthContext();

  // Check if the user is authenticated
  if (!user) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" />;
  }

  // Retrieve the user's role from local storage
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userRole = storedUser ? storedUser.student ? 'student' : 'educator' : null;

  // Redirect based on the user's role
  if (userRole === 'student') {
    return <Navigate to="/student-home" />;
  } else if (userRole === 'educator') {
    return <Navigate to="/educator-home" />;
  } else {
    // Handle other roles or unexpected scenarios
    return (
      <div className="home">
        <h2>Welcome to Macula</h2>
        <p>Role not recognized. Please contact support.</p>
      </div>
    );
  }
};

export default Home;
