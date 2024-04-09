import React, { useState  , useEffect }from "react";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import { TweenMax, Power2 } from "gsap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../css/admin.css"
import { Link } from "react-router-dom";
import BlackButton from "../components/BlackButton";
import WhiteButton from "../components/WhiteButton";

const AdminLogin = () => {
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

    const loginSuccessful = await login(ID, password, "admin");

    if (loginSuccessful) {
      console.log("Login successful. Navigating to /home...");
      navigate("/adminHome");
    } else {
      console.log("Login failed.");
      console.error(error);
    }
  };
  useEffect(() => {
    // Perform animations after component is mounted
    TweenMax.to(".circle-top", 20, { attr: { cx: 50, cy: -50 }, scale: 1, yoyo: true, repeat: -1, ease: Power2.ease });
    TweenMax.to(".circle-bottom", 20, { attr: { cx: 260, cy: 300 }, scale: 1.1, yoyo: true, repeat: -1, ease: Power2.ease });
  }, []); // Empty dependency array ensures the effect runs only once after mount


  return (
    <div className="admin-login-container">
        <div className="background-circles background-circles--blue background-circles--animated">
         <Link to="/Onboarding" className="Main">Main</Link> <span className="Aboutus">About Us</span> <span className="Features">Features</span> <Link to="/login" className="LoginOnboarding">Login</Link>
        <svg height="100%" width="100%" version="1.1" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <circle className="circle-top" cx="90px" cy="-50px" r="200" fill="#ffffff" />
          <circle className="circle-bottom" opacity="0.7" cx="250px" cy="300px" r="250" fill="#ffd51e" />
        
        </svg>
      </div>
        <h3 className="Admintitle">Log In into your account</h3>
    <form class="Admin-form" onSubmit={handleSubmit}>
        
      <label>ID</label>
      <input type="text"
       placeholder="ID"
       onChange={handleIDChange}/>
      <label>Password</label>
      <div className="password-input">
        <input
          type={showPassword ? "text" : "password"}
          onChange={handlePasswordChange}
          value={password}
          required
          placeholder="Password"
        />
      <button
          type="button"
          onClick={handleTogglePassword}
          className="view-password"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
        </div>
      <button className="Adminbutton"
      disabled={isLoading}>
        Login</button>
        {error && <div className="error">{error}</div>}
      <a href="#" class="resetPassword"><p >Reset password </p></a>
    </form>
    </div>
  );
};

export default AdminLogin;

