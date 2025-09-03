// src/components/RemediationPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

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

  return (
    <div className="min-h-screen bg-yellow-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-4">
          Remediation — Module {moduleId || "?"}
        </h1>

        {/* --- Classic remediation --- */}
        {explanation && (
          <div className="bg-white p-6 rounded-2xl shadow-md prose">
            <h2 className="text-xl font-semibold mb-2">Step-by-step Explanation</h2>
            <div style={{ whiteSpace: "pre-wrap" }}>{explanation}</div>
          </div>
        )}
        {learningSteps && learningSteps.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-2">Learning Steps</h2>
            <ol className="list-decimal ml-6 space-y-1">
              {learningSteps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </div>
        )}
        {examples && examples.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-2">Examples</h2>
            <ul className="list-disc ml-6 space-y-3">
              {examples.map((ex, i) => (
                <li key={i}><strong>{ex.title}</strong>: {ex.explain}</li>
              ))}
            </ul>
          </div>
        )}
        {practiceExercises && practiceExercises.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-2">Practice Exercises</h2>
            <ul className="list-disc ml-6 space-y-2">
              {practiceExercises.map((ex, i) => (
                <li key={i}><strong>{ex.question}</strong> → {ex.answer}</li>
              ))}
            </ul>
          </div>
        )}
        {summary && (
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-2">Summary</h2>
            <p>{summary}</p>
          </div>
        )}

        {/* --- Mnemonic remediation --- */}
        {easyExplanation && (
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-2">Easy Explanation</h2>
            <p>{easyExplanation}</p>
          </div>
        )}
        {mnemonics && mnemonics.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-2">Mnemonics</h2>
            <ul className="list-disc ml-6">{mnemonics.map((m, i) => <li key={i}>{m}</li>)}</ul>
          </div>
        )}
        {visualCues && visualCues.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-2">Visual Cues</h2>
            <ul className="list-disc ml-6">{visualCues.map((v, i) => <li key={i}>{v}</li>)}</ul>
          </div>
        )}
        {flashcards && flashcards.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-2">Flashcards</h2>
            <ul className="list-disc ml-6">
              {flashcards.map((f, i) => (
                <li key={i}><strong>Q:</strong> {f.question} <br /><strong>A:</strong> {f.answer}</li>
              ))}
            </ul>
          </div>
        )}
        {summaryPoints && summaryPoints.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-2">Summary Points</h2>
            <ul className="list-disc ml-6">{summaryPoints.map((s, i) => <li key={i}>{s}</li>)}</ul>
          </div>
        )}

        {/* --- Combined remediation --- */}
        {scenarioExamples && scenarioExamples.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-2">Scenario Examples</h2>
            <ul className="list-disc ml-6">
              {scenarioExamples.map((ex, i) => (
                <li key={i}><strong>{ex.title}</strong>: {ex.explain}</li>
              ))}
            </ul>
          </div>
        )}
        {practiceMCQs && practiceMCQs.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-2">Practice MCQs</h2>
            <ul className="list-disc ml-6">
              {practiceMCQs.map((mcq, i) => (
                <li key={i}><strong>{mcq.question}</strong> → {mcq.answer}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Fallback */}
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
          <p className="text-gray-600 italic">No remediation content available.</p>
        )}
      </div>
    </div>
  );
}

export default RemediationPage;
