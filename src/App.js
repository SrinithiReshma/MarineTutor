// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import CoursePage from "./components/CoursePage";
import AdaptiveQuizPage from "./components/AdaptiveQuizPage";
import RemediationPage from "./components/RemediationPage";
import MnemonicRemediationPage from "./components/MnemonicRemediationPage";
import CombinedRemediationPage from "./components/CombinedRemediationPage";
import MindmapPage from "./components/MindmapPage"; // Import MindmapPage

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/course/:moduleId" element={<CoursePage />} />
          <Route path="/adaptive/:moduleId" element={<AdaptiveQuizPage />} />
          <Route path="/remediation" element={<RemediationPage />} />
          <Route path="/mnemonic-remediation" element={<MnemonicRemediationPage />} />
          <Route path="/combined-remediation" element={<CombinedRemediationPage />} />
  {/* Mindmaps route */}
  <Route path="/mindmaps/:moduleId" element={<MindmapPage />} />        </Routes>
      </div>
    </Router>
  );
};

export default App;
