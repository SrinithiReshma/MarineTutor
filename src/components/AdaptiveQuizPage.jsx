// src/components/AdaptiveQuizPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Client, Databases, Query } from "appwrite";
import axios from "axios";
import "./AdaptiveQuizPage.css"; // your CSS file

// ----------- Appwrite Setup -----------
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("6894720600211b693b69");

const databases = new Databases(client);

const DATABASE_ID = "6894724e002dc704b552"; 
const REMEDIATION_THRESHOLD = 40;

function AdaptiveQuizPage() {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [evaluations, setEvaluations] = useState({});
  const [scoreSummary, setScoreSummary] = useState({
    totalScore: 0,
    totalQuestions: 0,
    maxScore: 0,
  });
  const [remediationRoute, setRemediationRoute] = useState(null); // NEW: store which remedial page

  const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);
  const pickRandom = (arr, n) => shuffle(arr).slice(0, n);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const mcqRes = await databases.listDocuments(
          DATABASE_ID,
          "6894726b00342801a141",
          [Query.equal("module_id", moduleId)]
        );
        const descRes = await databases.listDocuments(
          DATABASE_ID,
          "68947e47002a0169e04c",
          [Query.equal("module_id", moduleId)]
        );

        const mcqs = mcqRes.documents.map((q) => ({ ...q, type: "mcq" }));
        const descs = descRes.documents.map((q) => ({ ...q, type: "descriptive" }));

        // Helper: pick random n from an array
        const pickRandom = (arr, n) => {
          const shuffled = [...arr].sort(() => 0.5 - Math.random());
          return shuffled.slice(0, Math.min(n, arr.length));
        };

        // Function to pick 2 easy, 2 medium, 2 hard
        const pickByDifficulty = (arr) => {
          const easy = pickRandom(arr.filter((q) => q.tag === "easy"), 2);
          const medium = pickRandom(arr.filter((q) => q.tag === "medium"), 2);
          const hard = pickRandom(arr.filter((q) => q.tag === "hard"), 2);
          return [...easy, ...medium, ...hard];
        };

        const selectedMcqs = pickByDifficulty(mcqs);
        const selectedDescs = pickByDifficulty(descs);

        // Final ordered list (MCQs first then descriptive)
        const ordered = [...selectedMcqs, ...selectedDescs];

        setQuestions(ordered);
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    };

    fetchQuestions();
  }, [moduleId]);

  const handleChange = (qid, value) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const getWeight = (tag) => {
    if (tag === "easy") return 1;
    if (tag === "medium") return 2;
    if (tag === "hard") return 3;
    return 1;
  };

  const handleSubmit = async () => {
    let evalResults = {};
    let totalScore = 0;
    let maxScore = 0;
    let mcqScore = 0;
    let mcqcrt = 0;
    let desccrt = 0,
      mcqMax = 0;
    let descScore = 0,
      descMax = 0;

    try {
      // Save descriptive answers
      for (const q of questions) {
        if (q.type === "descriptive" && (answers[q.$id] || "").trim() !== "") {
          await axios.post("http://localhost:5000/save-answer", {
            userId: "student1",
            question: q.question,
            userAnswer: answers[q.$id],
            correctAnswer: q.answer,
          });
        }
      }

      // Process descriptive answers
      const res = await axios.post("http://localhost:5000/process-answers");
      const descriptiveResults = res.data.evaluations || [];

      // Map descriptive results
      descriptiveResults.forEach((r, i) => {
        const qObj = questions.filter((q) => q.type === "descriptive")[i];
        if (!qObj) return;
        const weight = getWeight(qObj.tag);
        const qId = qObj.$id;

        evalResults[qId] = { ...r, score: r.score * weight };
        totalScore += evalResults[qId].score;
        descScore += evalResults[qId].score;
        descMax += 1; // Max descriptive weight
        desccrt += evalResults[qId].score > 0 ? 1 : 0;
      });

      // Evaluate MCQs
      for (const q of questions) {
        if (q.type === "mcq") {
          const isCorrect = answers[q.$id] === q.answer;
          const weight = getWeight(q.tag);

          evalResults[q.$id] = {
            score: isCorrect ? weight : 0,
            feedback: isCorrect
              ? "Correct answer!"
              : `Incorrect. Correct answer: ${q.answer}`,
          };

          totalScore += evalResults[q.$id].score;
          mcqScore += evalResults[q.$id].score;
          mcqMax += 1;
          mcqcrt += isCorrect ? 1 : 0;
        }
      }

      maxScore = questions.reduce((sum, q) => sum + getWeight(q.tag), 0);

      setEvaluations(evalResults);
      setSubmitted(true);

      setScoreSummary({ totalScore, totalQuestions: questions.length, maxScore });

      const mcqPercent = mcqMax > 0 ? (mcqcrt / 6) * 100 : 0;
      const descPercent = descMax > 0 ? (desccrt / 6) * 100 : 0;

      // ---------- Decision logic: store remedial route ----------
      if (mcqPercent < 40 && descPercent < 60) {
        setRemediationRoute("/combined-remediation");
      } else if (mcqPercent < 40) {
        setRemediationRoute("/mnemonic-remediation");
      } else if (descPercent < REMEDIATION_THRESHOLD) {
        setRemediationRoute("/remediation");
      } else {
        setRemediationRoute(null); // No remediation needed
      }
    } catch (err) {
      console.error("Error submitting quiz:", err);
    }
  };

  const goToRemediation = async () => {
    if (!remediationRoute) return;

    try {
      let response;
      if (remediationRoute === "/combined-remediation") {
        response = await axios.post("http://localhost:5000/generate-combined-remediation", {
          moduleId,
        });
      } else if (remediationRoute === "/mnemonic-remediation") {
        response = await axios.post("http://localhost:5000/generate-mnemonic-remediation", {
          moduleId,
        });
      } else if (remediationRoute === "/remediation") {
        response = await axios.post("http://localhost:5000/generate-remediation", {
          moduleId,
        });
      }
      navigate(remediationRoute, { state: response.data });
    } catch (err) {
      console.error("Error navigating to remedial page:", err);
    }
  };

  return (
    <div className="quiz-page">
      <h1 className="quiz-title">Adaptive Quiz for Module {moduleId}</h1>

      {!submitted ? (
        <div className="questions-container">
          {questions.map((q, index) => (
            <div key={q.$id} className="question-card">
              <h2 className="question-title">
                {index + 1}. {q.question}{" "}
                <span className="question-tag">({q.tag})</span>
              </h2>

              {q.type === "mcq" ? (
                <div className="options-container">
                  {[q.option1, q.option2, q.option3, q.option4].map((opt, i) => (
                    <label
                      key={i}
                      className={`option-label ${
                        answers[q.$id] === opt ? "option-selected" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${q.$id}`}
                        value={opt}
                        checked={answers[q.$id] === opt}
                        onChange={() => handleChange(q.$id, opt)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <textarea
                  value={answers[q.$id] || ""}
                  onChange={(e) => handleChange(q.$id, e.target.value)}
                  placeholder="Write your answer here..."
                  className="descriptive-input"
                  rows={4}
                />
              )}
            </div>
          ))}
          <div className="submit-container">
            <button onClick={handleSubmit} className="submit-btn">
              Submit Quiz
            </button>
          </div>
        </div>
      ) : (
        <div className="questions-container">
          <div className="score-summary">
            Your Total Score: {scoreSummary.totalScore} / {scoreSummary.maxScore}
          </div>

          {questions.map((q, index) => (
            <div key={q.$id} className="question-card">
              <h2 className="question-title">
                {index + 1}. {q.question}{" "}
                <span className="question-tag">({q.tag})</span>
              </h2>
              <p>
                <strong>Your Answer:</strong> {answers[q.$id] || "Not Answered"}
              </p>
              <p>
                <strong>Correct Answer:</strong> {q.answer}
              </p>
              <div className="evaluation-card">
                <p>
                  <strong>Score:</strong> {evaluations[q.$id]?.score ?? "N/A"}
                </p>
                <p>
                  <strong>Feedback:</strong> {evaluations[q.$id]?.feedback ?? "No feedback"}
                </p>
              </div>
            </div>
          ))}

          {remediationRoute && (
            <div className="remediation-button-container">
              <button onClick={goToRemediation} className="remediation-btn">
                Go to Remedial Module
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdaptiveQuizPage;
