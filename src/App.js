// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CoursePage from "./components/CoursePage";

import AdaptiveQuizPage from "./components/AdaptiveQuizPage"; // ✅ import new page

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Default route (course page) */}
          <Route path="/" element={<CoursePage />} />

         

          {/* ✅ New adaptive quiz route */}
          <Route path="/adaptive/:moduleId" element={<AdaptiveQuizPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
