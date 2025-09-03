import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function CombinedRemediationPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { moduleId, remediation, mnemonicRemediation } = location.state || {};

  if (!moduleId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-600">
        <p>❌ No moduleId provided.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        📘 Combined Remediation for Module {moduleId}
      </h1>

      {/* Remediation Section */}
      {remediation && (
        <div className="bg-white shadow-md rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Remediation</h2>
          <p className="mb-4">{remediation.explanation || "No explanation available."}</p>

          {remediation.learningSteps?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-bold">Learning Steps:</h3>
              <ul className="list-disc pl-6">
                {remediation.learningSteps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </div>
          )}

          {remediation.examples?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-bold">Examples:</h3>
              <ul className="list-disc pl-6">
                {remediation.examples.map((ex, i) => (
                  <li key={i}>
                    <strong>{ex.title}:</strong> {ex.explain}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {remediation.practiceExercises?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-bold">Practice Exercises:</h3>
              <ul className="list-disc pl-6">
                {remediation.practiceExercises.map((ex, i) => (
                  <li key={i}>
                    <strong>Q:</strong> {ex.question} <br />
                    <strong>A:</strong> {ex.answer}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {remediation.summary && (
            <div className="mb-4">
              <h3 className="font-bold">Summary:</h3>
              <p>{remediation.summary}</p>
            </div>
          )}
        </div>
      )}

      {/* Mnemonic Remediation Section */}
      {mnemonicRemediation && (
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Mnemonic Remediation</h2>

          {mnemonicRemediation.mnemonics?.length > 0 ? (
            <ul className="list-disc pl-6 mb-4">
              {mnemonicRemediation.mnemonics.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          ) : (
            <p>No mnemonics generated.</p>
          )}

          {mnemonicRemediation.summaryPoints?.length > 0 && (
            <div>
              <h3 className="font-bold">Summary Points:</h3>
              <ul className="list-disc pl-6">
                {mnemonicRemediation.summaryPoints.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {mnemonicRemediation.error && (
            <p className="text-red-500 mt-4">⚠️ {mnemonicRemediation.error}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default CombinedRemediationPage;
