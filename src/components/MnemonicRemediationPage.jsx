// src/pages/MnemonicRemediationPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function MnemonicRemediationPage() {
  const location = useLocation();
  const { moduleId } = location.state || {};

  const [remediation, setRemediation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    <div className="min-h-screen bg-yellow-50 p-6">
      <h1 className="text-2xl font-bold mb-4">Mnemonic Remediation</h1>

      {/* Mnemonics */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Mnemonics</h2>
        <ul className="list-disc pl-6">
          {remediation.mnemonics?.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </section>

      {/* Visual Cues */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Visual Cues</h2>
        <ul className="list-disc pl-6">
          {remediation.visualCues?.map((v, i) => (
            <li key={i}>{v}</li>
          ))}
        </ul>
      </section>

      {/* Summary */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Summary Points</h2>
        <ul className="list-disc pl-6">
          {remediation.summaryPoints?.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </section>

      {/* Flashcards */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Flashcards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {remediation.flashcards?.map((fc, i) => (
            <div key={i} className="p-4 bg-white shadow rounded-xl">
              <p className="font-medium">Q: {fc.question}</p>
              <p className="text-gray-700 mt-2">A: {fc.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default MnemonicRemediationPage;
