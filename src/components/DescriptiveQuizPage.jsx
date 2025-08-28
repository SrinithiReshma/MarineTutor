// src/components/DescriptiveQuizPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Client, Databases, Query, Account } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("6894720600211b693b69");

const databases = new Databases(client);
const account = new Account(client);

function DescriptiveQuizPage() {
  const { moduleId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [collectedData, setCollectedData] = useState([]);

  useEffect(() => {
  const init = async () => {
    try {
      // Try to get current session
      await account.getSession("current");
      console.log("Reusing existing session");
    } catch (error) {
      if (error.code === 401) {
        // No session exists → create anonymous session
        try {
          await account.createAnonymousSession();
          console.log("Anonymous session created");
        } catch (err) {
          console.error("Failed to create anonymous session:", err);
        }
      } else {
        console.error("Unexpected error fetching session:", error);
      }
    }

    // Now safely fetch descriptive questions
    try {
      const response = await databases.listDocuments(
        "6894724e002dc704b552", // databaseId
        "68947e47002a0169e04c", // descriptive collection
        [Query.equal("module_id", moduleId)]
      );
      setQuestions(response.documents);
    } catch (err) {
      console.error("Error fetching descriptive questions:", err);
    }
  };

  init();
}, [moduleId]);


  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = () => {
    const data = questions.map((q) => ({
      question: q.question,
      userAnswer: answers[q.$id] || "",
      correctAnswer: q.answer || "", // if available
    }));
    setCollectedData(data);
    console.log("Collected Descriptive Data:", data);
    alert("Answers collected! Check console for data.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-50 to-yellow-100 p-8">
      <h1 className="text-4xl font-extrabold text-center text-yellow-800 mb-8">
        Descriptive Quiz for Module {moduleId}
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

            <textarea
              value={answers[q.$id] || ""}
              onChange={(e) => handleChange(q.$id, e.target.value)}
              placeholder="Write your answer here..."
              className="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:ring focus:ring-yellow-200 focus:outline-none"
              rows={4}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-yellow-600 text-white rounded-2xl shadow-lg hover:bg-yellow-700 transition text-lg font-semibold"
        >
          Submit Answers
        </button>
      </div>
    </div>
  );
}

export default DescriptiveQuizPage;
