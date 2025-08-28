import React, { useEffect, useState } from "react";
import { Client, Databases, Query } from "appwrite";
import { useNavigate } from "react-router-dom"; // import useNavigate
import './CoursePage.css';

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("6894720600211b693b69");

const databases = new Databases(client);

const DATABASE_ID = "6894724e002dc704b552";
const MODULES_COLLECTION_ID = "modules";
const LESSONS_COLLECTION_ID = "lessons";

function CoursePage({ moduleId = "1" }) {
  const [module, setModule] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // hook to navigate to another page

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moduleRes = await databases.listDocuments(
          DATABASE_ID,
          MODULES_COLLECTION_ID,
          [Query.equal("module_d", moduleId)]
        );

        if (moduleRes.documents.length > 0) {
          const mod = moduleRes.documents[0];
          setModule(mod);

          const lessonsRes = await databases.listDocuments(
            DATABASE_ID,
            LESSONS_COLLECTION_ID,
            [Query.equal("module_d", moduleId), Query.orderAsc("id")]
          );
          setLessons(lessonsRes.documents);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [moduleId]);

  if (loading)
    return <p className="text-center text-lg text-gray-500 mt-10">Loading...</p>;
  if (!module) return <p className="text-center text-red-500">No module found</p>;

  return (
    <div className="max-w-5xl mx-auto p-8">
      {/* Banner / Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-xl p-10">
        <h1 className="text-4xl font-extrabold">{module.title}</h1>
        <p className="mt-4 text-lg opacity-90">{module.description}</p>
        {module.images && (
          <img
            src={module.images}
            alt={module.title}
            className="mt-6 w-full max-h-80 object-cover rounded-xl shadow-lg"
          />
        )}
      </div>

      {/* Lessons */}
      <div className="space-y-6">
        {lessons.map((lesson, index) => (
          <div
            key={lesson.$id}
            className="lesson-card p-6 rounded-xl bg-white"
          >
            <div className="flex items-center gap-3">
              <span className="lesson-badge flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 font-bold">
                {index + 1}
              </span>
              <h3 className="text-xl font-semibold text-gray-800">
                {lesson.title}
              </h3>
            </div>
            <p className="mt-3 text-gray-600">{lesson.content}</p>
          </div>
        ))}
      </div>

      {/* Go to Quiz Button */}
      <div className="mt-12 text-center">
        <button
  onClick={() => navigate(`/adaptive/${moduleId}`)} // ✅ now goes to adaptive quiz
  className="px-8 py-3 bg-indigo-600 text-white font-semibold text-lg rounded-xl shadow hover:bg-indigo-700 transition"
>
  Go to Adaptive Quiz 🚀
</button>

      </div>
    </div>
  );
}

export default CoursePage;
