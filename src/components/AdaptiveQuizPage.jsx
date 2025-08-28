// src/components/AdaptiveQuizPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Client, Databases, Query } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("6894720600211b693b69");

const databases = new Databases(client);

function AdaptiveQuizPage() {
  const { moduleId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Utility: shuffle an array
  const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

  // Utility: pick N random items
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

        // Combine & tag type
        const allQuestions = [
          ...mcqRes.documents.map((q) => ({ ...q, type: "mcq" })),
          ...descRes.documents.map((q) => ({ ...q, type: "descriptive" })),
        ];

        // Split by tag
        const easy = allQuestions.filter((q) => q.tag === "easy");
        const medium = allQuestions.filter((q) => q.tag === "medium");
        const hard = allQuestions.filter((q) => q.tag === "hard");

        // Adaptive selection: total 10 (3 easy, 3 medium, 4 hard)
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

  const handleSubmit = () => {
    const result = questions.map((q) => ({
      question: q.question,
      type: q.type,
      userAnswer: answers[q.$id] || "",
      correctAnswer: q.answer || "",
    }));
    console.log("Adaptive Quiz Data:", result);
    setSubmitted(true);
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
                {index + 1}. {q.question}
              </h2>

              {q.type === "mcq" ? (
                <div className="space-y-3">
                  {[q.option1, q.option2, q.option3, q.option4].map((opt, i) => (
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
                  ))}
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
        <div className="text-center text-green-700 text-xl">
          ✅ Answers Submitted! Check console for collected data.
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
