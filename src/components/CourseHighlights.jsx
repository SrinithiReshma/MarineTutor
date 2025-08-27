import React from 'react';

function CourseHighlights() {
  return (
    <section id="course" className="course-section">
      <div className="container">
        <h3>Course Highlights</h3>
        <div className="cards">
          <div className="card">
            <h4>Emergency Response</h4>
            <p>Learn how to act swiftly during marine emergencies.</p>
          </div>
          <div className="card">
            <h4>Fire & Flooding Control</h4>
            <p>Understand procedures to manage fire and water hazards.</p>
          </div>
          <div className="card">
            <h4>Man Overboard & Rescue</h4>
            <p>Master critical rescue techniques and survival strategies.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CourseHighlights;
