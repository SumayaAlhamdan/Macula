import React, { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [ID, setID] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("student");
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

    const loginSuccessful = await login(ID, password, userType);

    if (loginSuccessful) {
      console.log("Login successful. Navigating to /home...");
      navigate("/home");
    } else {
      console.log("Login failed.");
      console.error(error);
    }
  };

  return (
    <form className="login" onSubmit={handleSubmit}>
      <h3>Log In into your account</h3>

      <div className="user-option">
        <label></label>
        <button
          onClick={() => setUserType("student")}
          style={{
            background: userType === "student" ? "#109BA8" : "#fff",
            color: userType === "student" ? "#fff" : "#109BA8",
            margin: '5px',
            padding: '8px',
            border: '1px solid #109BA8',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Student
        </button>
        <button
          onClick={() => setUserType("educator")}
          style={{
            background: userType === "educator" ? "#109BA8" : "#fff",
            color: userType === "educator" ? "#fff" : "#109BA8",
            margin: '5px',
            padding: '8px',
            border: '1px solid #109BA8',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Educator
        </button>
      </div>

      <label>ID:</label>
      <input
        type="text"
        onChange={handleIDChange}
        value={ID}
        required
      />

      <label>Password:</label>
      <div className="password-input">
        <input
          type={showPassword ? "text" : "password"}
          onChange={handlePasswordChange}
          value={password}
          required
        />
        <button
          type="button"
          onClick={handleTogglePassword}
          className="view-password"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      <button disabled={isLoading}>Log in</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default Login;

