import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Profile.css';

function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [updateProfile, setUpdateProfile] = useState(false); // State to toggle between form and greeting
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(response.data.name);
        setEmail(response.data.email);
      } catch (error) {
        console.error("Error fetching profile data", error);
        navigate("/login");
      }
    };

    if (token) {
      fetchProfileData();
    } else {
      console.log("Failed");
      navigate("/login");
    }
  }, [token, navigate]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "http://localhost:5000/api/profile/update",
        { name, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Profile updated:", response.data);
      alert("Profile updated successfully!");
      setUpdateProfile(false); // After updating, show the greeting message
    } catch (error) {
      console.error("Error updating profile", error);
      alert("Failed to update profile.");
    }
  };

  const handleUpdateClick = () => {
    setUpdateProfile(true); // Show the form to update profile
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">Profile</h2>
      {updateProfile ? (
        // Show the profile update form
        <form className="profile-form" onSubmit={handleProfileUpdate}>
          <input
            className="profile-input"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="profile-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="profile-button" type="submit">Update Profile</button>
        </form>
      ) : (
        // Show the greeting message with the name
        <div className="greeting">
          <h1>Hello, {name}!</h1>
          <p>Email: {email}</p>
          <button onClick={handleUpdateClick} className="update-button">
            Update Profile
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;
