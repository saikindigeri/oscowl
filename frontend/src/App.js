// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Todos from "./pages/Todos";
import "./App.css";
import Profile from "./pages/Profile";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

 
  return (
    <Router>
      <div className="app">
        
        <Routes>
          <Route
            path="/"
            element={token ? <Todos /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/signup" element={<Signup setToken={setToken} />} />
          <Route path="/profile" element={<Profile  setToken={setToken} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
