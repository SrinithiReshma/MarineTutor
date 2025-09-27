import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CoursePage from "./components/CoursePage";
import AdaptiveQuizPage from "./components/AdaptiveQuizPage";
import RemediationPage from "./components/RemediationPage";
import MnemonicRemediationPage from "./components/MnemonicRemediationPage";
import CombinedRemediationPage from "./components/CombinedRemediationPage";
import HomePage from "./components/HomePage"; // ✅ import HomePage

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
        <Route path="/" element={<HomePage />} />
<Route path="/course/:moduleId" element={<CoursePage />} />
<Route path="/adaptive/:moduleId" element={<AdaptiveQuizPage />} />


          {/* Remediation routes */}
          <Route path="/remediation" element={<RemediationPage />} />
          <Route path="/mnemonic-remediation" element={<MnemonicRemediationPage />} />
          <Route path="/combined-remediation" element={<CombinedRemediationPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
