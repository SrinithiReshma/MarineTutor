// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CoursePage from "./components/CoursePage";
import QuizPage from "./components/QuizPage"; // <-- create this file
import DescriptiveQuizPage from "./components/DescriptiveQuizPage";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Default route (course page) */}
          <Route path="/" element={<CoursePage />} />

          {/* Quiz route with moduleId */}
          <Route path="/quiz/:moduleId" element={<QuizPage />} />
          <Route path="/descriptive/:moduleId" element={<DescriptiveQuizPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
