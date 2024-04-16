import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Import your existing navbar component

const Layout = ({ children }) => {
  const location = useLocation();

  // Function to check if the current route is the Onboarding page
  const isOnboardingPage = () => {
    return location.pathname === '/Onboarding';
  };
  const isLogin = () => {
    return location.pathname === '/adminLogin' || location.pathname === '/login' ;
  };
  const isAdmin = () => {
    return location.pathname === '/adminHome' ;
  };
  return (
    <div>
      {/* Render Navbar only if the current page is not the Onboarding page */}
      {!isOnboardingPage() && !isLogin() && !isAdmin() && <Navbar />}
      {children}
    </div>
  );
};

export default Layout;
