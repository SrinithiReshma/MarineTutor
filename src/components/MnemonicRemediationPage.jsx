// src/pages/MnemonicRemediationPage.jsx 
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function MnemonicRemediationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { moduleId } = location.state || {};

  const [remediation, setRemediation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Helper function to strip markdown-like characters (*)
  const cleanText = (text) => {
    if (typeof text !== "string") return "";
    return text.replace(/\*/g, "").trim();
  };

  useEffect(() => {
    if (!moduleId) {
      setError("No moduleId provided");
      setLoading(false);
      return;
    }

    const fetchRemediation = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/generate-mnemonic-remediation",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ moduleId }),
          }
        );

        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        const data = await res.json();
        console.log("Fetched remediation:", data); // 👀 Debug log

        // Normalize the structure
        setRemediation({
          mnemonics: data.mnemonics || [],
          summaryPoints: data.summaryPoints || [],
          visualCues: data.visualCues || [],
          flashcards: data.flashcards || [],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRemediation();
  }, [moduleId]);

  if (loading) return <p className="p-4">Loading mnemonic remediation...</p>;
  if (error) return <p className="p-4 text-red-600">Error: {error}</p>;
  if (!remediation) return <p className="p-4">No remediation data available.</p>;

  return (
    <div className="remediation-page p-6">
      <div className="container mx-auto">
        <h1 className="page-title text-2xl font-bold mb-4">Memory Toolkit</h1>

        {/* Mnemonics */}
        <section className="mnemonic-section mb-6">
          <h2 className="text-xl font-semibold mb-2">Mnemonics</h2>
          {remediation.mnemonics.length > 0 ? (
            remediation.mnemonics.map((m, i) => (
              <div
                key={i}
                className="mnemonic-box p-4 border rounded mb-3 shadow bg-white"
              >
                <p className="font-bold text-lg">
                  Mnemonic: {cleanText(m.mnemonic)}
                </p>
                <p className="text-blue-700">
                  Full Form: {cleanText(m.full_form)}
                </p>
                <p className="text-gray-700">
                  Explanation: {cleanText(m.explanation)}
                </p>
              </div>
            ))
          ) : (
            <p>No mnemonics available</p>
          )}
        </section>

        {/* Visual Cues */}
        <section className="visual-section mb-6">
          <h2 className="text-xl font-semibold mb-2">Visual Cues</h2>
          <ul className="list-disc ml-6">
            {remediation.visualCues.length > 0 ? (
              remediation.visualCues.map((v, i) => (
                <li key={i}>{cleanText(v)}</li>
              ))
            ) : (
              <li>No visual cues available</li>
            )}
          </ul>
        </section>

        {/* Summary */}
        <section className="summary-points-section mb-6">
          <h2 className="text-xl font-semibold mb-2">Summary Points</h2>
          <ul className="list-disc ml-6">
            {remediation.summaryPoints.length > 0 ? (
              remediation.summaryPoints.map((s, i) => (
                <li key={i}>{cleanText(s)}</li>
              ))
            ) : (
              <li>No summary points available</li>
            )}
          </ul>
        </section>

        {/* Flashcards */}
        <section className="flashcards-section mb-6">
          <h2 className="text-xl font-semibold mb-2">Flashcards</h2>
          <div className="flashcards-grid grid grid-cols-1 md:grid-cols-2 gap-4">
            {remediation.flashcards.length > 0 ? (
              remediation.flashcards.map((fc, i) => (
                <div
                  key={i}
                  className="flashcard border p-4 rounded shadow bg-white"
                >
                  <p className="question font-medium">
                    Q: {cleanText(fc.question)}
                  </p>
                  <p className="answer text-gray-700">
                    A: {cleanText(fc.answer)}
                  </p>
                </div>
              ))
            ) : (
              <p>No flashcards available</p>
            )}
          </div>
        </section>

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

export default MnemonicRemediationPage;
