import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';

const AdminNavbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleClick = () => {
    logout();
    navigate('/Onboarding');
  };

  return (
    <header>
      <div className="container">
        <Link to="/">
          <img src={require('../assets/unnamed.png')} alt="Macula Logo" style={{ width: '250px', height: 'auto' }} />
        </Link>
        <nav>
          {user && (
            <div className="user-info">
              <Link to="/home">Home</Link>
              <Link to="/adminProfile">
                <span>{user.admin ? user.admin.name : "error"}</span>
              </Link>
              <button onClick={handleClick}>Log out</button>
            </div>
          )}
          {!user && (
            <div>
              <Link to="/login">Login</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default AdminNavbar;
