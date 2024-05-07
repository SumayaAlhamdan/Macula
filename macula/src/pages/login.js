import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import { TweenMax, Power2 } from "gsap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import TermsAndConditions from "./terms";


const Login = () => {
  const [ID, setID] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading, setError } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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
    console.log('handleSubmit called');

    if (ID === "" || password === "") {
      setError("All fields should be filled");
      return false;
    }
    
    // Check if the ID starts with numbers (assuming student IDs start with numbers)
    const firstChar = ID.charAt(0);
    const isStudent = !isNaN(firstChar);

    try {
      if (isStudent) {
        // Login as a student
        const loginSuccessful = await login(ID, password, "students");
        if (loginSuccessful) {
          navigate("/");
          return true;
        } else {
          setError("Invalid credentials.");
          return false;
        }
      } else {
        // Check if the ID belongs to an educator
        try {
          const response = await axios.get(`/api/educators/${ID}`);
          console.log('response:', response);
          if (response.status === 200) {
            // ID belongs to an educator, login as an educator
            const loginSuccessful = await login(ID, password, "educators");
            if (loginSuccessful) {
              navigate("/");
              return true;
            } else {
              setError("Invalid credentials.");
              return false; // Return after setting error
            }
          } else if (response.status === 404) {
            // Educator not found, proceed with admin login directly
            const adminLoginSuccessful = await login(ID, password, "admins");
            console.log('inside admin:', response);
            if (adminLoginSuccessful) {
              navigate("/");
              return true;
            } else {
              setError("Invalid credentials.");
              return false; // Return after setting error
            }
          }
        } catch (error) {
          console.error("Error fetching educator:", error);
          setError("An error occurred. Please try again.");
        }
    
        // If the request fails or an error occurs, proceed with admin login
        const adminLoginSuccessful = await login(ID, password, "admins");
        if (adminLoginSuccessful) {
          navigate("/adminHome");
          return true;
        } else {
          setError("Invalid credentials.");
          return false; // Return after setting error
        }
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error("Error:", error);
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
        <span className="Aboutus">About Us</span>
        <span className="Features">Features</span>
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
      <button className="Adminbutton"data-testid="Login">Login</button>
      <TermsAndConditions></TermsAndConditions>
    </form>
    </div>
  );
};

export default Login;
