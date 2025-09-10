import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Helper to clean unwanted characters like '**'
const cleanText = (text) => text?.replace(/\*\*/g, "").trim();

function CombinedRemediationPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { moduleId, remediation, mnemonicRemediation } = location.state || {};

  if (!moduleId) {
    return (
      <div className="fallback-container">
        <p>❌ No moduleId provided.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="combined-page">
      <div className="container">
        <h1 className="page-title">
          Detailed module {moduleId}
        </h1>

        {/* Remediation Section */}
        {remediation && (
          <div className="card">
            <h2 className="section-title">Detailed Remediation</h2>
            <p>{cleanText(remediation.explanation)}</p>

            {remediation.examples?.length > 0 && (
              <div className="section-block">
                <h3>Examples:</h3>
                <ul>
                  {remediation.examples.map((ex, i) => (
                    <li key={i}>
                      <strong>{cleanText(ex.title)}:</strong> {cleanText(ex.explain)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {remediation.practiceExercises?.length > 0 && (
              <div className="section-block">
                <h3>Practice Exercises:</h3>
                <ul>
                  {remediation.practiceExercises.map((ex, i) => (
                    <li key={i}>
                      <strong>Q:</strong> {cleanText(ex.question)} <br />
                      <strong>A:</strong> {cleanText(ex.answer)}
                      {ex.hint && <p><em>Hint:</em> {cleanText(ex.hint)}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {remediation.summary && (
              <div className="section-block">
                <h3>Summary:</h3>
                <p>{cleanText(remediation.summary)}</p>
              </div>
            )}
          </div>
        )}

        {/* Mnemonics Section */}
        {mnemonicRemediation && (
          <div className="mnemonic-card">
            <h2 className="section-title">Mnemonic Aids</h2>

            {mnemonicRemediation.mnemonics?.length > 0 && (
              <div className="mnemonics">
                {mnemonicRemediation.mnemonics.map((m, i) => (
                  <div key={i} className="mnemonic-box">{cleanText(m.mnemonic || m)}</div>
                ))}
              </div>
            )}

            {mnemonicRemediation.flashcards?.length > 0 && (
              <div className="section-block">
                <h3>Flashcards:</h3>
                <ul>
                  {mnemonicRemediation.flashcards.map((f, i) => (
                    <li key={i}>
                      <strong>Q:</strong> {cleanText(f.question)} <br />
                      <strong>A:</strong> {cleanText(f.answer)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {mnemonicRemediation.summaryPoints?.length > 0 && (
              <div className="section-block">
                <h3>Summary Points:</h3>
                <ul>
                  {mnemonicRemediation.summaryPoints.map((s, i) => (
                    <li key={i}>{cleanText(s)}</li>
                  ))}
                </ul>
              </div>
            )}

            {mnemonicRemediation.error && (
              <p className="error">⚠ {mnemonicRemediation.error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CombinedRemediationPage;
