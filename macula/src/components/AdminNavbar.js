import React from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import './Navbar.css'; // Import the CSS file

const AdminNavbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/Onboarding');
  };

  return (
    <header className="header">
      <div className="container">
        <div>
          <Link to="/">
            <img src={require('../assets/unnamed.png')} alt="Macula Logo" className="logo" />
          </Link>
        </div>
        <nav>
          <ul className="nav-links">
            <li>
              <NavLink to="/home" className="nav-link">Home</NavLink>
            </li>
            {user && (
              <>
                <li>
                  <NavLink to="/adminProfile" className="nav-link">Profile</NavLink>
                </li>
                <li>
                  <button onClick={handleLogout} className="logout-btn">Logout</button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default AdminNavbar;
