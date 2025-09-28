import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  const startCourse = () => {
    navigate("/course/1"); // Navigate to module 1
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1 className="hero-title">Marine Tutor</h1>
        <p className="hero-subtitle">
          Start your maritime learning journey and master the concepts at your own pace.
        </p>
        <button className="start-btn" onClick={startCourse}>
          Start Course
        </button>
      </div>
    </div>
  );
};

export default HomePage;
