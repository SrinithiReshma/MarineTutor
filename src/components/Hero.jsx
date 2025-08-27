import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

function Hero() {
  const navigate = useNavigate();

  const handleStartLearning = () => {
    navigate('/emergency');
  };

  return (
    <div className="hero">
      <h1>Welcome to Marine Tutor</h1>
      <p>Your best place to learn emergency procedures</p>
      <button onClick={handleStartLearning}>Start Learning</button>
    </div>
  );
}

export default Hero;
