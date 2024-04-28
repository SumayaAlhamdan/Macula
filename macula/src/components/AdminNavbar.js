import React from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { FiLogOut, FiUser } from 'react-icons/fi'; // Import logout and profile icons

const AdminNavbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/Onboarding');
  };

  return (
    <header>
      <div className="container">
      <Link to="/">
            <img src={require('../assets/unnamed.png')} alt="Macula Logo" className="logo" />
          </Link>
          <nav>
          <ul className="nav-links">
            <li>
              <NavLink to="/home" activeClassName="active-link" className="nav-link">Home</NavLink>
            </li>
            {user && (
              <>
                <li>
                  <NavLink to="/adminProfile" activeClassName="active-link" className="nav-link">
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

export default AdminNavbar;
