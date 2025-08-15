const axios = require("axios");
require("dotenv").config();
const DocumentModel2 = require("../models/Document");
const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const mammoth = require("mammoth");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const financialSummary = async (req, res) => {
  let doc; // define outside try so we can access in finally
  try {
    const { docId } = req.params;
    doc = await DocumentModel2.findById(docId);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    const buffer = fs.readFileSync(doc.path);
    let extractedText = "";

    if (doc.mimetype.includes("wordprocessingml.document")) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else if (doc.mimetype === "application/pdf") {
      extractedText = buffer.toString("base64"); // keep for Gemini inlineData
    } else {
      extractedText = buffer.toString("utf8");
    }

    const contents = [
      {
        role: "user",
        parts: [
          { text: "Please provide a concise summary of this document in under 200 words." },
          ...(doc.mimetype === "application/pdf"
            ? [{ inlineData: { mimeType: "application/pdf", data: extractedText } }]
            : [{ text: extractedText }])
        ]
      }
    ];

    const resp = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    const summary = resp?.candidates?.[0]?.content?.parts?.[0]?.text || "No summary found.";
    res.status(200).json({ summary });

  } catch (err) {
    console.error("Gemini API Error:", err?.response?.data || err.message || err);
    res.status(500).json({ error: err?.response?.data || err.message });
  } finally {
    if (doc?.path && fs.existsSync(doc.path)) {
      fs.unlinkSync(doc.path);
    }
  }
};

module.exports = { financialSummary };