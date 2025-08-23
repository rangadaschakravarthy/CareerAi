const express = require("express");
const router = express.Router();
require("dotenv").config();
router.post("/api/aiquery", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-04-17:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Respond in JSON format with two keys: "description" and "code". The description should explain the code, and the code should be a snippet that solves the following task:\n\n${prompt}`,
                },
              ],
            },
          ],
        }),
      }
    );
    const rawText = await response.text();
    console.log("Raw Gemini response:", rawText);
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      return res.status(500).json({ error: "Invalid JSON from Gemini", raw: rawText });
    }
    const contentText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const extractJsonFromCodeBlock = (text) => {
      const match = text.match(/```json\s*([\s\S]*?)\s*```/i);
      return match ? match[1] : null;
    };

    const jsonString = extractJsonFromCodeBlock(contentText);
    if (!jsonString) {
      return res.status(500).json({ error: "No valid JSON block found in Gemini response", raw: contentText });
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch (e) {
      return res.status(500).json({ error: "Failed to parse extracted JSON", raw: jsonString });
    }

    res.json({
      description: parsed.description || "No description",
      code: parsed.code || "No code",
    });
  } catch (err) {
    console.error("AI Query Error:", err);
    res.status(500).json({ error: "Failed to get response from Gemini API" });
  }
});

module.exports = router;
