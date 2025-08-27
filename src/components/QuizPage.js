// src/components/QuizPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Client, Databases, Query } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("6894720600211b693b69"); // your project ID

const databases = new Databases(client);

function QuizPage() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [collectedData, setCollectedData] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await databases.listDocuments(
          "6894724e002dc704b552", // databaseId
          "6894726b00342801a141", // multiple-choice collection
          [Query.equal("module_id", moduleId)]
        );
        setQuestions(response.documents);
      } catch (error) {
        console.error("Error fetching quiz questions:", error);
      }
    };
    fetchQuestions();
  }, [moduleId]);

  const handleOptionSelect = (questionId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const moveToNext = () => {
    // Collect data: question + user answer + correct answer
    const data = questions.map((q) => ({
      question: q.question,
      userAnswer: answers[q.$id] || null,
      correctAnswer: q.answer, // from collection
    }));
    setCollectedData(data);
    console.log("Collected MCQ Data:", data);

    navigate(`/descriptive/${moduleId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-8">
      <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-8">
        Quiz for Module {moduleId}
      </h1>

      <div className="max-w-3xl mx-auto space-y-8">
        {questions.map((q, index) => (
          <div
            key={q.$id}
            className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-2xl transition"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {index + 1}. {q.question}
            </h2>

            <div className="space-y-3">
              {[q.option1, q.option2, q.option3, q.option4].map((opt, i) => (
                <label
                  key={i}
                  className={`flex items-center p-3 rounded-xl cursor-pointer border transition
                    ${
                      answers[q.$id] === opt
                        ? "bg-blue-100 border-blue-500"
                        : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                    }
                  `}
                >
                  <input
                    type="radio"
                    name={`question-${q.$id}`}
                    value={opt}
                    checked={answers[q.$id] === opt}
                    onChange={() => handleOptionSelect(q.$id, opt)}
                    className="hidden"
                  />
                  <span className="text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <button
          onClick={moveToNext}
          className="px-6 py-3 bg-blue-600 text-white rounded-2xl shadow-lg hover:bg-blue-700 transition text-lg font-semibold"
        >
          Move to Next
        </button>
      </div>
    </div>
  );
}

export default QuizPage;
