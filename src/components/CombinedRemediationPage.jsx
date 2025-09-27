// src/pages/CombinedRemediationPage.jsx
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Helper to clean unwanted characters like '**'
const cleanText = (text) =>
  typeof text === "string" ? text.replace(/\*\*/g, "").trim() : "";

function CombinedRemediationPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { moduleId, remediation, mnemonicRemediation } = location.state || {};

  useEffect(() => {
    console.log("📦 Retrieved Content:", {
      moduleId,
      remediation,
      mnemonicRemediation,
    });
  }, [moduleId, remediation, mnemonicRemediation]);

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
        <h1 className="page-title">Detailed module {moduleId}</h1>

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
                      <strong>{cleanText(ex.title)}:</strong>{" "}
                      {cleanText(ex.explain)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {remediation.practiceExercises?.length > 0 && (
              <div className="section-block">
                <h3>Practice Exercises:</h3>
                <div className="flashcards-grid">
                  {remediation.practiceExercises.map((ex, i) => (
                    <div key={i} className="flashcard">
                      <p className="question">Q: {cleanText(ex.question)}</p>
                      <p className="answer">A: {cleanText(ex.answer)}</p>
                      {ex.hint && (
                        <p className="hint">
                          <em>Hint:</em> {cleanText(ex.hint)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
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
                  <div key={i} className="mnemonic-box">
                    <p>
                      <strong>{cleanText(m.mnemonic || m)}</strong>
                    </p>
                    {m["what it stands for"] && (
                      <p>
                        <em>Stands for:</em>{" "}
                        {cleanText(m["what it stands for"])}
                      </p>
                    )}
                    {m.description && <p>{cleanText(m.description)}</p>}
                  </div>
                ))}
              </div>
            )}

            {mnemonicRemediation.flashcards?.length > 0 && (
              <div className="section-block">
                <h3>Flashcards:</h3>
                <div className="flashcards-grid">
                  {mnemonicRemediation.flashcards.map((f, i) => (
                    <div key={i} className="flashcard">
                      <p className="question">Q: {cleanText(f.question)}</p>
                      <p className="answer">A: {cleanText(f.answer)}</p>
                    </div>
                  ))}
                </div>
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

        {/* Done Button */}
        <div
          className="done-button-container"
          style={{ marginTop: "20px", textAlign: "center" }}
        >
          <button
            className="done-btn"
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() =>
              navigate(`/adaptive/${moduleId}`, {
                state: { fromRemediation: true },
              })
            }
          >
            ✅ Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default CombinedRemediationPage;
