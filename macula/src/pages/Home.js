import React from 'react';
import { Navigate } from 'react-router-dom';  // Use Navigate instead of Redirect
import { useAuthContext } from '../hooks/useAuthContext';

const Home = () => {
  const { user } = useAuthContext();

  // Check if the user is authenticated
  if (!user) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If authenticated, display the home page
  return (
    <div className="home">
      <h2>Welcome to Macula</h2>
      <img src={require('../assets/maculaEYE.png')} alt="Macula eye" />
    </div>
  );
};

export default Home;

