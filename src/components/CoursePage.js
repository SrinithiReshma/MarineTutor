import React, { useEffect, useState } from "react";   
import { Client, Databases, Query } from "appwrite";
import { useNavigate, useParams } from "react-router-dom";
import "./CoursePage.css";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("6894720600211b693b69");

const databases = new Databases(client);

const DATABASE_ID = "6894724e002dc704b552";
const MODULES_COLLECTION_ID = "modules";
const LESSONS_COLLECTION_ID = "lessons";

function CoursePage() {
  const { moduleId } = useParams(); // ✅ get moduleId from URL
  const [module, setModule] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    return <p className="loading-text">Loading...</p>;
  if (!module) return <p className="error-text">No module found</p>;

  const renderContent = (sections) => {
    if (!sections) return null;

    return sections.map((section, idx) => {
      switch (section.type) {
        case "heading":
          return <h2 key={idx} className="lesson-heading">{section.text}</h2>;
        case "subheading":
          return <h3 key={idx} className="lesson-subheading">{section.text}</h3>;
        case "paragraph":
          return <p key={idx} className="lesson-paragraph">{section.text}</p>;
        case "list":
          return (
            <ul key={idx} className="lesson-list">
              {section.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          );
        default:
          return null;
      }
    });
  };

  return (
    <div className="course-page">
      {/* Module Banner */}
      <div className="module-banner">
        <h1 className="module-title">{module.title}</h1>
        <p className="module-description">{module.description}</p>
      </div>

      {/* Lessons Section */}
      {lessons.map((lesson, index) => {
        let sections = [];
        try {
          if (typeof lesson.content === "string") {
            const parsed = JSON.parse(lesson.content);
            sections = parsed.sections || [];
          } else {
            sections = lesson.content?.sections || [];
          }
        } catch (err) {
          console.error("Error parsing lesson content:", err);
        }

        return (
          <div key={lesson.$id} className="lesson-card">
            <div className="lesson-header">
              <div className="lesson-badge">{index + 1}</div>
              <h3 className="lesson-title">{lesson.title}</h3>
            </div>
            <div className="lesson-content">
              {renderContent(sections)}
            </div>
          </div>
        );
      })}

      {/* Go to Quiz Button */}
      <div className="cta-container">
        <button
          onClick={() => navigate(`/adaptive/${moduleId}`)}
          className="cta-btn"
        >
          Take Quiz
        </button>
      </div>
    </div>
  );
}

export default CoursePage;
