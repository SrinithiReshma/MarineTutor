import { Client, Databases, Query } from "node-appwrite";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

// ✅ Appwrite setup
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const LESSONS_COLLECTION_ID = process.env.APPWRITE_LESSONS_COLLECTION_ID;

console.log("DATABASE_ID:", DATABASE_ID);
console.log("LESSONS_COLLECTION_ID:", LESSONS_COLLECTION_ID);

// ✅ Express setup
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const genA = new GoogleGenerativeAI('AIzaSyA8TW55ydeFaoVJOCKg5MFzfEtjQyoDPrs');


// Buffer for answers
let answerBuffer = [];

/**
 * 🔹 Helper: Clean AI response to safe JSON
 */
const safeParse = (text, fallback) => {
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (err) {
    console.error("❌ JSON Parse Failed:", text);
    return fallback;
  }
};

/**
 * 🔹 Route 1: Combined Remediation (Conceptual + Memory)
 */
app.post("/generate-combined-remediation", async (req, res) => {
  const { moduleId } = req.body;
  if (!moduleId) return res.status(400).json({ error: "moduleId is required" });

  try {
    // Fetch lesson from DB
    const lessonsRes = await databases.listDocuments(
      DATABASE_ID,
      LESSONS_COLLECTION_ID,
      [Query.equal("module_d", moduleId)]
    );

    if (!lessonsRes.documents || lessonsRes.documents.length === 0) {
      return res.status(404).json({ error: "No lesson content found in DB" });
    }

    const doc = lessonsRes.documents[0];
    const moduleContent =
      doc.content || doc.body || doc.description || JSON.stringify(doc);

    // ✅ FIXED Remediation Prompt (Detailed tutoring content)
    const remediationPrompt = `
You are an expert tutor and instructional designer. 
A student has failed Module ${moduleId} and does not understand it.
Generate a comprehensive remediation package that thoroughly explains all concepts so the student can understand and pass.

Requirements:
1. **Explanation**: Explain every concept in clear, detailed language assuming the student knows very little.
2. **Examples**: Provide multiple real-life examples or scenarios for each concept.
3. **Practice Exercises**: Include practice exercises with answers (and hints if helpful).
4. **Summary**: Give a short summary at the end.
5. Return ONLY JSON.

{
  "moduleId": "${moduleId}",
  "explanation": "...",
  "examples": [
    {"title": "...", "explain": "..."}
  ],
  "practiceExercises": [
    {"question": "...", "answer": "...", "hint": "..."}
  ],
  "summary": "..."
}

Module content:
${moduleContent}
`;

    // ✅ Mnemonic Prompt (memory aids only)
    const mnemonicPrompt = `
You are an expert memory coach.
Generate a mnemonic package for Module ${moduleId} to help a student who failed.

Requirements:
1. Provide **mnemonics** with full form + explanation.
2. Provide **flashcards** (Q&A).
3. Add **summary points** (bullet form).
4. Make content fun, memorable, and easy to recall.
5. Return ONLY JSON.

{
  "moduleId": "${moduleId}",
  "mnemonics": [
    {"mnemonic":"...", "description":"...", "what it stands for":"..."}
  ],
  "flashcards": [
    {"question":"...", "answer":"..."}
  ],
  "summaryPoints": ["..."]
}

Module content:
${moduleContent}
`;

    const model = genA.getGenerativeModel({ model: "gemini-2.0-flash" });

    let remediationResult, mnemonicResult;
    try {
      [remediationResult, mnemonicResult] = await Promise.all([
        model.generateContent(remediationPrompt),
        model.generateContent(mnemonicPrompt),
      ]);
    } catch (err) {
      if (err.status === 429) {
        return res.status(429).json({
          moduleId,
          error: "Gemini quota exceeded. Try again later.",
        });
      }
      throw err;
    }

    const remediationJson = safeParse(
      await remediationResult.response.text(),
      { moduleId, explanation: "Failed to parse remediation JSON." }
    );

    const mnemonicJson = safeParse(
      await mnemonicResult.response.text(),
      { moduleId, mnemonics: [], summaryPoints: [], error: "Parsing failed" }
    );

    res.json({ moduleId, remediation: remediationJson, mnemonicRemediation: mnemonicJson });
  } catch (err) {
    console.error("Combined remediation error:", err);
    res.status(500).json({ moduleId, error: "Failed to generate combined remediation." });
  }
});

/**
 * 🔹 Route 2: Save Answers Temporarily
 */
app.post("/save-answer", (req, res) => {
  const { question, correctAnswer, userAnswer, userId } = req.body;

  if (!question || !correctAnswer || !userAnswer) {
    return res.status(400).json({ error: "question, correctAnswer, and userAnswer are required" });
  }

  answerBuffer.push({ userId, question, correctAnswer, userAnswer });
  res.json({ message: "Answer saved successfully", bufferSize: answerBuffer.length });
});

/**
 * 🔹 Route 3: Generate Conceptual Remediation
 */
app.post("/generate-remediation", async (req, res) => {
  print('entered theory module');
  const { moduleId } = req.body;
  if (!moduleId) return res.status(400).json({ error: "moduleId is required" });

  try {
    const lessonsRes = await databases.listDocuments(
      DATABASE_ID,
      LESSONS_COLLECTION_ID,
      [Query.equal("module_d", moduleId)]
    );

    if (!lessonsRes.documents || lessonsRes.documents.length === 0) {
      return res.status(404).json({ error: "No lesson content found in DB" });
    }

    const doc = lessonsRes.documents[0];
    const moduleContent =
      doc.content || doc.body || doc.description || JSON.stringify(doc);

    // ✅ Prepare Gemini model & prompt inside try
    const model = genA.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `
You are an expert tutor. In explaination take each topic in a simple words and in example give many example and scenarios to explain them
in practice exerceises give application/scenario based questions and in summary give tips how to learn them
Return ONLY JSON with:
{
  "moduleId": "${moduleId}",
  "explanation": "...",
  "examples": [{"title":"...","explain":"..."}],
  "practiceExercises": [{"question":"...","answer":"..."}],
  "summary": "..."
}
Module content:
${moduleContent}
    `;

    let result;
    try {
      result = await model.generateContent(prompt);
    } catch (err) {
      if (err.status === 429) {
        return res
          .status(429)
          .json({ moduleId, error: "Gemini quota exceeded. Try again later." });
      }
      throw err;
    }

    const parsed = safeParse(await result.response.text(), {
      moduleId,
      explanation: "Parsing failed",
    });

    res.json(parsed);
  } catch (error) {
    console.error("Remediation generation error:", error);
    res.status(500).json({
      moduleId,
      explanation: "Failed to generate remediation.",
    });
  }
});

/**
 * 🔹 Route 4: Generate Mnemonic Remediation
 */
app.post("/generate-mnemonic-remediation", async (req, res) => {
  const { moduleId } = req.body;
  if (!moduleId) return res.status(400).json({ error: "moduleId is required" });

  try {
    const lessonsRes = await databases.listDocuments(
      DATABASE_ID,
      LESSONS_COLLECTION_ID,
      [Query.equal("module_d", moduleId)]
    );

    if (!lessonsRes.documents || lessonsRes.documents.length === 0) {
      return res.status(404).json({ error: "No lesson content found in DB" });
    }

    const doc = lessonsRes.documents[0];
    const moduleContent =
      doc.content || doc.body || doc.description || JSON.stringify(doc);

    const model = genA.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `
You are an expert memory coach. Give mnemonics with full form and explanation.
Return ONLY JSON with:
{
  "moduleId": "${moduleId}",
  "mnemonics": [
    {"mnemonic":"...","description":"...","what it stands for":"..."}
  ],
  "flashcards": [{"question":"...","answer":"..."}],
  "summaryPoints": ["..."]
}
Module content:
${moduleContent}
`;


    let result;
    try {
      result = await model.generateContent(prompt);
      console.log.print(result)
    } catch (err) {
      if (err.status === 429) {
        return res.status(429).json({ moduleId, error: "Gemini quota exceeded. Try again later." });
      }
      throw err;
    }

    const parsed = safeParse(await result.response.text(), { moduleId, mnemonics: [], summaryPoints: [], error: "Parsing failed" });
    res.json(parsed);
  } catch (error) {
    console.error("Mnemonic remediation generation error:", error);
    res.status(500).json({ moduleId, explanation: "Failed to generate mnemonic remediation." });
  }
});

/**
 * 🔹 Route 5: Process Student Answers (Grading)
 */
/**
 * 🔹 Route 5: Process Student Answers (Grading + Cosine Similarity)
 */
app.post("/process-answers", async (req, res) => {
  if (answerBuffer.length === 0) {
    return res.status(400).json({ error: "No answers to process" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
You are a grading assistant. 
For each student answer, do the following:
1. Compare it with the correct answer.
2. Give a score (1 if correct/mostly correct, 0 otherwise).
3. Provide short feedback.
4. Compute semantic similarity (cosine similarity %) between student answer and correct answer.

Return ONLY JSON array like this:
[
  {
    "question": "...",
    "userAnswer": "...",
    "correctAnswer": "...",
    "score": 0 or 1,
    "feedback": "...",
    "cosineSimilarity": 0-100
  }
]

Here are the student answers:
${answerBuffer
  .map(
    (item, idx) => `
Q${idx + 1}: ${item.question}
Correct Answer: ${item.correctAnswer}
Student Answer: ${item.userAnswer}`
  )
  .join("\n\n")}
`;

    let result;
    try {
      result = await model.generateContent(prompt);
    } catch (err) {
      if (err.status === 429) {
        const fallback = answerBuffer.map((item) => ({
          question: item.question,
          userAnswer: item.userAnswer,
          correctAnswer: item.correctAnswer,
          score: 0,
          feedback: "Evaluation failed: Gemini quota exceeded.",
          cosineSimilarity: 0,
        }));
        answerBuffer = [];
        return res.status(429).json({ evaluations: fallback });
      }
      throw err;
    }

    const evaluations = safeParse(
      await result.response.text(),
      answerBuffer.map((item) => ({
        question: item.question,
        userAnswer: item.userAnswer,
        correctAnswer: item.correctAnswer,
        score: 0,
        feedback: "Parsing failed.",
        cosineSimilarity: 0,
      }))
    );

    answerBuffer = [];
    res.json({ evaluations });
  } catch (error) {
    console.error("Gemini Processing Error:", error);
    const fallback = answerBuffer.map((item) => ({
      question: item.question,
      userAnswer: item.userAnswer,
      correctAnswer: item.correctAnswer,
      score: 0,
      feedback: "Evaluation failed.",
      cosineSimilarity: 0,
    }));
    answerBuffer = [];
    res.json({ evaluations: fallback });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
