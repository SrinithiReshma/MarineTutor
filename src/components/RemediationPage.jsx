// src/components/RemediationPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./RemediationPage.css";

function RemediationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const remediation = (location && location.state) || {};
  const {
    moduleId,
    explanation,
    learningSteps,
    examples,
    practiceExercises,
    summary,

    // mnemonic remediation fields
    mnemonics,
    visualCues,
    flashcards,
    summaryPoints,

    // combined remediation fields
    easyExplanation,
    scenarioExamples,
    practiceMCQs,
  } = remediation;

  const cleanText = (text) => text?.replace(/\*\*/g, "").trim() || "";

  return (
    <div className="remediation-page">
      <div className="container">
        <h1 className="page-title">Detailed Module {moduleId || "?"}</h1>

        {/* --- Classic remediation --- */}
        {explanation && (
          <section className="card step-by-step">
            <h2>Step-by-step Explanation</h2>
            <p>{cleanText(explanation)}</p>
          </section>
        )}
        {learningSteps && learningSteps.length > 0 && (
          <section className="card">
            <h2>Learning Steps</h2>
            <ol>
              {learningSteps.map((s, i) => <li key={i}>{cleanText(s)}</li>)}
            </ol>
          </section>
        )}
        {examples && examples.length > 0 && (
          <section className="card">
            <h2>Examples</h2>
            <ul>
              {examples.map((ex, i) => (
                <li key={i}><strong>{cleanText(ex.title)}</strong>: {cleanText(ex.explain)}</li>
              ))}
            </ul>
          </section>
        )}
        {practiceExercises && practiceExercises.length > 0 && (
          <section className="card">
            <h2>Practice Exercises</h2>
            <ul>
              {practiceExercises.map((ex, i) => (
                <li key={i}><strong>{cleanText(ex.question)}</strong> → {cleanText(ex.answer)}</li>
              ))}
            </ul>
          </section>
        )}
        {summary && (
          <section className="card">
            <h2>Summary</h2>
            <p>{cleanText(summary)}</p>
          </section>
        )}

        {/* --- Mnemonic remediation --- */}
        {easyExplanation && (
          <section className="card mnemonic-card">
            <h2>Easy Explanation</h2>
            <p>{cleanText(easyExplanation)}</p>
          </section>
        )}
        {mnemonics && mnemonics.length > 0 && (
          <section className="mnemonic-section">
            <h2>Mnemonics</h2>
            {mnemonics.map((m, i) => (
              <div key={i} className="mnemonic-box">{cleanText(m)}</div>
            ))}
          </section>
        )}
        {visualCues && visualCues.length > 0 && (
          <section className="visual-section">
            <h2>Visual Cues</h2>
            <ul>
              {visualCues.map((v, i) => <li key={i}>{cleanText(v)}</li>)}
            </ul>
          </section>
        )}
        {flashcards && flashcards.length > 0 && (
          <section className="flashcards-section">
            <h2>Flashcards</h2>
            <div className="flashcards-grid">
              {flashcards.map((f, i) => (
                <div key={i} className="flashcard">
                  <p className="question"><strong>Q:</strong> {cleanText(f.question)}</p>
                  <p className="answer"><strong>A:</strong> {cleanText(f.answer)}</p>
                </div>
              ))}
            </div>
          </section>
        )}
        {summaryPoints && summaryPoints.length > 0 && (
          <section className="summary-points-section">
            <h2>Summary Points</h2>
            <ul>
              {summaryPoints.map((s, i) => <li key={i}>{cleanText(s)}</li>)}
            </ul>
          </section>
        )}

        {/* --- Combined remediation --- */}
        {scenarioExamples && scenarioExamples.length > 0 && (
          <section className="card">
            <h2>Scenario Examples</h2>
            <ul>
              {scenarioExamples.map((ex, i) => (
                <li key={i}><strong>{cleanText(ex.title)}</strong>: {cleanText(ex.explain)}</li>
              ))}
            </ul>
          </section>
        )}
        {practiceMCQs && practiceMCQs.length > 0 && (
          <section className="card">
            <h2>Practice MCQs</h2>
            <ul>
              {practiceMCQs.map((mcq, i) => (
                <li key={i}><strong>{cleanText(mcq.question)}</strong> → {cleanText(mcq.answer)}</li>
              ))}
            </ul>
          </section>
        )}

        {!explanation &&
         !learningSteps &&
         !examples &&
         !practiceExercises &&
         !summary &&
         !easyExplanation &&
         !mnemonics &&
         !visualCues &&
         !flashcards &&
         !summaryPoints &&
         !scenarioExamples &&
         !practiceMCQs && (
          <p className="fallback">No remediation content available.</p>
        )}

        {/* --- Done Button --- */}
        <div className="done-button-container" style={{ marginTop: "20px", textAlign: "center" }}>
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
              navigate(`/adaptive/${moduleId}`, { state: { fromRemediation: true } })
            }
          >
            ✅ Done
          </button>
        </div>

      </div>
    </div>
  );
}

export default RemediationPage;
