// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Buffer to hold descriptive answers
let answerBuffer = [];

/**
 * Route 1: Save descriptive answers
 */
app.post("/save-answer", (req, res) => {
  const { question, correctAnswer, userAnswer, userId } = req.body;

  if (!question || !correctAnswer || !userAnswer) {
    return res
      .status(400)
      .json({ error: "question, correctAnswer, and userAnswer are required" });
  }

  answerBuffer.push({ userId, question, correctAnswer, userAnswer });
  res.json({
    message: "Answer saved successfully",
    bufferSize: answerBuffer.length,
  });
});

/**
 * Route 2: Process all answers with Gemini
 */
app.post("/process-answers", async (req, res) => {
  if (answerBuffer.length === 0) {
    return res.status(400).json({ error: "No answers to process" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
You are a grading assistant. For each question, compare the student's answer with the correct answer.
- Give a score: 1 if the answer is essentially correct, 0 if incorrect (no partials).
- Provide short feedback.

⚠️ IMPORTANT: Reply ONLY with a valid JSON array. Do not include markdown code fences or extra text.

Format:
[
  {
    "question": "string",
    "userAnswer": "string",
    "correctAnswer": "string",
    "score": 0 or 1,
    "feedback": "string"
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

    const result = await model.generateContent(prompt);
    let textResponse = result.response.text().trim();

    // 🔥 Clean up any markdown fences Gemini might add
    textResponse = textResponse.replace(/```json|```/g, "").trim();

    let evaluations;
    try {
      evaluations = JSON.parse(textResponse);
    } catch (err) {
      console.error("❌ JSON Parse Error, Gemini returned:", textResponse);

      // ✅ Fallback: return dummy results so frontend can display
      evaluations = answerBuffer.map((item) => ({
        question: item.question,
        userAnswer: item.userAnswer,
        correctAnswer: item.correctAnswer,
        score: 0,
        feedback: "Could not evaluate due to parsing error.",
      }));
    }

    // Clear buffer after grading
    answerBuffer = [];

    res.json({ evaluations });
  } catch (error) {
    console.error("Gemini Processing Error:", error);

    // ✅ Fallback: return all answers with "error" feedback
    const fallback = answerBuffer.map((item) => ({
      question: item.question,
      userAnswer: item.userAnswer,
      correctAnswer: item.correctAnswer,
      score: 0,
      feedback: "Evaluation failed due to Gemini error.",
    }));

    // clear buffer anyway
    answerBuffer = [];

    res.json({ evaluations: fallback });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
