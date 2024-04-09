import React from 'react';
import { useLocation } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';

const AdminLayout = ({ children }) => {
  const location = useLocation();

  // Function to check if the current route is the Onboarding page
  const isOnboardingPage = () => {
    return location.pathname === '/Onboarding';
  };
  const isAdmin = () => {
    return location.pathname === '/adminLogin' ;
  };
  return (
    <div>
      {/* Render Navbar only if the current page is not the Onboarding page */}
      {!isOnboardingPage() && !isAdmin() &&  <AdminNavbar />}
      {children}
    </div>
  );
};

export default AdminLayout;