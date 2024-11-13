// src/pages/Signup.js
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './Signup.css'; // Import the CSS file

function Signup({ setToken }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
      navigate("/login");
    } catch (error) {
      console.error("Signup failed", error);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Signup</h2>
      <form className="auth-form" onSubmit={handleSignup}>
        <input
          className="auth-input"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="auth-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="auth-button" type="submit">Signup</button>
      </form>
      <p className="auth-footer">
        Already have an account? <Link to="/login" className="auth-link">Login here</Link>
      </p>
    </div>
  );
}

export default Signup;
