import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleClick = () => {
    logout();
    navigate('/login');
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
              <Link to="/courses">Courses</Link>
              <Link to="/profile">
                <span>{user.student ? user.student.name : user.educator.name}</span>
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

export default Navbar;
