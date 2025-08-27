import React from 'react';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="container">
        <h1 className="logo">Marine Tutor</h1>
        <ul className="nav-links">
          <li><a href="#course">Course</a></li>
          <li><a href="#instructor">Instructor</a></li>
          <li><a href="#enroll">Enroll</a></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
