// src/pages/MnemonicRemediationPage.jsx 
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function MnemonicRemediationPage() {
  const location = useLocation();
  const { moduleId } = location.state || {};

  const [remediation, setRemediation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Helper function to strip markdown-like characters (*)
  const cleanText = (text) => text?.replace(/\*/g, "");

  useEffect(() => {
    if (!moduleId) {
      setError("No moduleId provided");
      setLoading(false);
      return;
    }

    const fetchRemediation = async () => {
      try {
        const res = await fetch("http://localhost:5000/generate-mnemonic-remediation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ moduleId }),
        });

        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        const data = await res.json();
        setRemediation(data);
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
    <div className="remediation-page">
      <div className="container">
        <h1 className="page-title">Memory Toolkit</h1>

        {/* Mnemonics */}
        <section className="mnemonic-section">
          <h2>Mnemonics</h2>
          {remediation.mnemonics?.map((m, i) => (
            <div key={i} className="mnemonic-box">
              {cleanText(m)}
            </div>
          ))}
        </section>

        {/* Visual Cues */}
        <section className="visual-section">
          <h2>Visual Cues</h2>
          <ul>
            {remediation.visualCues?.map((v, i) => (
              <li key={i}>{cleanText(v)}</li>
            ))}
          </ul>
        </section>

        {/* Summary */}
        <section className="summary-points-section">
          <h2>Summary Points</h2>
          <ul>
            {remediation.summaryPoints?.map((s, i) => (
              <li key={i}>{cleanText(s)}</li>
            ))}
          </ul>
        </section>

        {/* Flashcards */}
        <section className="flashcards-section">
          <h2>Flashcards</h2>
          <div className="flashcards-grid">
            {remediation.flashcards?.map((fc, i) => (
              <div key={i} className="flashcard">
                <p className="question">Q: {cleanText(fc.question)}</p>
                <p className="answer">A: {cleanText(fc.answer)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default MnemonicRemediationPage;
