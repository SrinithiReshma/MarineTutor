import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CoursePage from "./components/CoursePage";
import AdaptiveQuizPage from "./components/AdaptiveQuizPage";
import RemediationPage from "./components/RemediationPage"; // ✅ import
import MnemonicRemediationPage from "./components/MnemonicRemediationPage";
import CombinedRemediationPage from "./components/CombinedRemediationPage";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Default route (course page) */}
          <Route path="/" element={<CoursePage />} />

          {/* Adaptive quiz route */}
          <Route path="/adaptive/:moduleId" element={<AdaptiveQuizPage />} />

          {/* ✅ Remediation route */}
          <Route path="/remediation" element={<RemediationPage />} />
           {/* ✅ Remediation route */}
          <Route path="/mnemonic-remediation" element={<MnemonicRemediationPage />} />
           {/* ✅ Remediation route */}
          <Route path="/combined-remediation" element={<CombinedRemediationPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
