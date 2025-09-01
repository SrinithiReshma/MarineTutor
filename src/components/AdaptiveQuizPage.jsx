// src/components/AdaptiveQuizPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Client, Databases, Query } from "appwrite";
import axios from "axios";

// ----------- Appwrite Setup -----------
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("6894720600211b693b69");

const databases = new Databases(client);

function AdaptiveQuizPage() {
  const { moduleId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [evaluations, setEvaluations] = useState({});
  const [scoreSummary, setScoreSummary] = useState({
    totalScore: 0,
    totalQuestions: 0,
    maxScore: 0, // ✅ new: keep track of maximum possible score
  });

  // Utility: shuffle an array
  const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);
  const pickRandom = (arr, n) => shuffle(arr).slice(0, n);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // fetch MCQs
        const mcqRes = await databases.listDocuments(
          "6894724e002dc704b552",
          "6894726b00342801a141", // mcq collection
          [Query.equal("module_id", moduleId)]
        );

        // fetch Descriptive
        const descRes = await databases.listDocuments(
          "6894724e002dc704b552",
          "68947e47002a0169e04c", // descriptive collection
          [Query.equal("module_id", moduleId)]
        );

        const allQuestions = [
          ...mcqRes.documents.map((q) => ({ ...q, type: "mcq" })),
          ...descRes.documents.map((q) => ({ ...q, type: "descriptive" })),
        ];

        const easy = allQuestions.filter((q) => q.tag === "easy");
        const medium = allQuestions.filter((q) => q.tag === "medium");
        const hard = allQuestions.filter((q) => q.tag === "hard");

        const selected = [
          ...pickRandom(easy, 3),
          ...pickRandom(medium, 3),
          ...pickRandom(hard, 4),
        ];

        setQuestions(shuffle(selected));
      } catch (err) {
        console.error("Error fetching adaptive questions:", err);
      }
    };

    fetchQuestions();
  }, [moduleId]);

  const handleChange = (qid, value) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  // ✅ Helper: weight by difficulty
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

    try {
      // Save descriptive answers in buffer
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

      // Process descriptive answers with Gemini
      const res = await axios.post("http://localhost:5000/process-answers");
      const descriptiveResults = res.data.evaluations || [];

      // Map descriptive results back
      descriptiveResults.forEach((r, i) => {
        const qObj = questions.filter((q) => q.type === "descriptive")[i];
        const weight = getWeight(qObj.tag);
        const qId = qObj.$id;

        evalResults[qId] = {
          ...r,
          score: r.score * weight, // ✅ apply weight
        };

        totalScore += evalResults[qId].score;
      });

      // Evaluate MCQs locally
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
        }
      }

      // ✅ Calculate max possible score
      maxScore = questions.reduce((sum, q) => sum + getWeight(q.tag), 0);

      setEvaluations(evalResults);
      setSubmitted(true);

      setScoreSummary({
        totalScore,
        totalQuestions: questions.length,
        maxScore,
      });
    } catch (err) {
      console.error("Error submitting quiz:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-green-100 p-8">
      <h1 className="text-4xl font-extrabold text-center text-green-800 mb-8">
        Adaptive Quiz for Module {moduleId}
      </h1>

      {!submitted ? (
        <div className="max-w-3xl mx-auto space-y-8">
          {questions.map((q, index) => (
            <div
              key={q.$id}
              className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                {index + 1}. {q.question}{" "}
                <span className="text-sm text-gray-500">({q.tag})</span>
              </h2>

              {q.type === "mcq" ? (
                <div className="space-y-3">
                  {[q.option1, q.option2, q.option3, q.option4].map(
                    (opt, i) => (
                      <label
                        key={i}
                        className={`flex items-center p-3 rounded-xl cursor-pointer border transition
                          ${
                            answers[q.$id] === opt
                              ? "bg-green-100 border-green-500"
                              : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                          }`}
                      >
                        <input
                          type="radio"
                          name={`q-${q.$id}`}
                          value={opt}
                          checked={answers[q.$id] === opt}
                          onChange={() => handleChange(q.$id, opt)}
                          className="hidden"
                        />
                        <span className="text-gray-700">{opt}</span>
                      </label>
                    )
                  )}
                </div>
              ) : (
                <textarea
                  value={answers[q.$id] || ""}
                  onChange={(e) => handleChange(q.$id, e.target.value)}
                  placeholder="Write your answer here..."
                  className="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:ring focus:ring-green-200 focus:outline-none"
                  rows={4}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-8">
          {/* ✅ Total Score Display */}
          <div className="mb-8 p-6 bg-green-100 border border-green-400 rounded-2xl shadow-md text-center">
            <h2 className="text-2xl font-bold text-green-800">
              Your Total Score: {scoreSummary.totalScore} / {scoreSummary.maxScore}
            </h2>
          </div>

          {/* Per-question Results */}
          {questions.map((q, index) => (
            <div
              key={q.$id}
              className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200"
            >
              <h2 className="text-xl font-semibold mb-2 text-gray-800">
                {index + 1}. {q.question}{" "}
                <span className="text-sm text-gray-500">({q.tag})</span>
              </h2>
              <p className="text-gray-600 mb-2">
                <strong>Your Answer:</strong> {answers[q.$id] || "Not Answered"}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Correct Answer:</strong> {q.answer}
              </p>
              <div className="p-3 bg-green-50 border border-green-300 rounded-xl">
                <p>
                  <strong>Score:</strong>{" "}
                  {evaluations[q.$id]?.score ?? "N/A"}
                </p>
                <p>
                  <strong>Feedback:</strong>{" "}
                  {evaluations[q.$id]?.feedback ?? "No feedback"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!submitted && (
        <div className="flex justify-center mt-10">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow-lg hover:bg-green-700 transition text-lg font-semibold"
          >
            Submit Quiz
          </button>
        </div>
      )}
    </div>
  );
}

export default AdaptiveQuizPage;
