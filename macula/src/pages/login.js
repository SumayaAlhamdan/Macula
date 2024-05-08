import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TweenMax, Power2 } from "gsap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import TermsAndConditions from "./terms";
import { useAuthContext } from '../hooks/useAuthContext';

const Login = () => {
  const [ID, setID] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();

  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleIDChange = (e) => {
    setID(e.target.value.trim());
    setError(null); // Clear the error when the user starts typing
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value.trim());
    setError(null); // Clear the error when the user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(`handleSubmit has been called with '${ID}' + '${password}'`);

    if (ID === "" || password === "") {
      setError("All fields should be filled");
      return false;
    }
    
    const firstChar = ID.charAt(0);
    const isStudent = !isNaN(firstChar);
  
    try {
      let loginSuccessful = false;
      if (isStudent) {
        loginSuccessful = await login(ID, password, "students");
      } else {
        try {
          const response = await axios.get(`/api/educators/${ID}`);
          if (response.status === 200) {
            loginSuccessful = await login(ID, password, "educators");
          } else if (response.status === 404) {
            loginSuccessful = await login(ID, password, "admins");
          }
        } catch (error) {
          console.error("Error fetching educator:", error);
          setError("An error occurred. Please try again.");
          return false;
        }
      }
  
      if (loginSuccessful) {
        navigate("/");
        return true;
      } else {
        setError("Invalid credentials.");
        return false;
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again.");
      return false;
    }
  };

  const login = async (ID, password, userType) => {
    setIsLoading(true);
    setError(null); // Clear the error state before making the request
  
    try {
      const response = await axios.post(`/api/${userType}/login`, { ID, password });
  
      if (response.status !== 200) {
        setError(response.data.message);
        return false; // Return false for a failed login
      } else {
        localStorage.setItem('user', JSON.stringify(response.data));
        dispatch({ type: 'LOGIN', payload: response.data });
        return true; // Return true for a successful login
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred during login.');
      return false; // Return false for any error during login
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    // Perform animations after component is mounted
    TweenMax.to(".circle-top", 20, { attr: { cx: 50, cy: -50 }, scale: 1, yoyo: true, repeat: -1, ease: Power2.ease });
    TweenMax.to(".circle-bottom", 20, { attr: { cx: 260, cy: 300 }, scale: 1.1, yoyo: true, repeat: -1, ease: Power2.ease });
  }, []);

  return (
    <div className="admin-login-container">
      <div className="background-circles background-circles--blue background-circles--animated">
        <Link to="/Onboarding" className="Main">Main</Link>
        <Link to="/Aboutus" className="Aboutus">About Us</Link>
        <Link to="/Features" className="Features">Features </Link>
        <Link to="/login" className="LoginOnboarding">Login</Link>
        <svg height="100%" width="100%" version="1.1" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <circle className="circle-top" cx="90px" cy="-50px" r="200" fill="#ffffff" />
          <circle className="circle-bottom" opacity="0.7" cx="250px" cy="300px" r="250" fill="#ffd51e" />
        </svg>
      </div>
      <h3 className="Admintitle">Log In into your account</h3>
      <form className="Admin-form" onSubmit={handleSubmit} noValidate data-testid="LoginForm">
        <label>ID</label>
        <input
          type="text"
          value={ID}
          placeholder="ID"
          data-testid="ID"
          onChange={handleIDChange}
        />
        <label>Password</label>
        <div className="password-input">
          <input
            type={showPassword ? "text" : "password"}
            onChange={handlePasswordChange}
            value={password}
            required
            placeholder="Password"
            data-testid="password"
          />
          <button
            type="button"
            onClick={handleTogglePassword}
            data-testid="toggle-password-button"
            className="view-password"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
        <button className="Adminbutton" data-testid="Login">Login</button>
        <TermsAndConditions />
      </form>
    </div>
  );
};

export default Login;
