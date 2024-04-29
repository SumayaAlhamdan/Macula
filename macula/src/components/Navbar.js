import React from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FiLogOut, FiUser } from 'react-icons/fi'; // Import logout and profile icons
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import './Navbar.css'; // Import the CSS file

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

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
              <NavLink to="/home" activeClassName="active-link" isActive={() => location.pathname === "/home"} className="nav-link">Home</NavLink>
            </li>
            <li>
              <NavLink to="/courses" activeClassName="active-link" isActive={() => location.pathname === "/courses"} className="nav-link">Courses</NavLink>
            </li>
            {user && (
              <>
                <li>
                  <NavLink to="/profile" activeClassName="active-link" isActive={() => location.pathname === "/profile"} className="nav-link">
                    <FiUser className="icon" />
                  </NavLink>
                </li>
                <li>
                  <button onClick={handleLogout} className="logout-btn">
                    <FiLogOut className="icon" />
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
