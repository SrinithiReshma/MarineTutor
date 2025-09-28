import React, { useEffect, useState } from "react";
import { Client, Databases, Query } from "node-appwrite";
import { useParams } from "react-router-dom";
import "./MindmapPage.css";

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("6894720600211b693b69");

const databases = new Databases(client);
const databaseId = "6894724e002dc704b552";
const collectionId = "mindmap";

function MindmapPage() {
  const { moduleId } = useParams(); // Get moduleId from URL
  const [mindmaps, setMindmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMindmaps = async () => {
      if (!moduleId) return;
      setLoading(true);
      try {
        const response = await databases.listDocuments(databaseId, collectionId, [
          Query.equal("module_id", moduleId),
        ]);
        setMindmaps(response.documents);
      } catch (error) {
        console.error("Error fetching mindmaps:", error);
        setMindmaps([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMindmaps();
  }, [moduleId]);

  return (
    <div className="mindmap-container">
      <h1>Mindmaps for Module {moduleId}</h1>

      {loading && <p>Loading mindmaps...</p>}

      {mindmaps.length > 0 ? (
        <table className="mindmap-table">
          <thead>
            <tr>
              <th>Module ID</th>
              <th>Section ID</th>
              <th>Title</th>
              <th>Mindmap</th>
            </tr>
          </thead>
          <tbody>
            {mindmaps.map((doc) => (
              <tr key={doc.$id}>
                <td>{doc.module_id}</td>
                <td>{doc.section_id}</td>
                <td>{doc.title}</td>
                <td>
                  <a href={doc.sections} target="_blank" rel="noreferrer">
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>No mindmaps found for Module {moduleId}</p>
      )}
    </div>
  );
}

export default MindmapPage;
