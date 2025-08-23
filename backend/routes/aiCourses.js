const express = require("express");
const router = express.Router();
const Course = require("../models/Course");

router.post("/", async (req, res) => {
  const { skills, username, title = "AI Skill Courses" } = req.body;

  console.log("📥 Received request with body:", req.body);

  if (!skills || !Array.isArray(skills)) {
    console.warn("⚠️ Invalid or missing 'skills' in request.");
    return res.status(400).json({ error: "Skills array is required." });
  }
  if (!username) {
    console.warn("⚠️ Missing 'username' in request.");
    return res.status(400).json({ error: "Username is required." });
  }

  const normalizedSkills = [...new Set(skills.map((s) => s.trim().toLowerCase()))].sort();
  console.log("🧹 Normalized skills:", normalizedSkills);

  try {
    const existing = await Course.findOne({ username });
    console.log("🔎 Existing user entry found:", !!existing);

    if (existing) {
      const existingSkills = existing.skills || [];
      const normalizedExisting = [
        ...new Set(existingSkills.map((s) => s.trim().toLowerCase())),
      ].sort();

      console.log("🧮 Normalized existing skills:", normalizedExisting);

      const isSameSkills =
        normalizedSkills.length === normalizedExisting.length &&
        normalizedSkills.every((val, index) => val === normalizedExisting[index]);

      console.log("🧪 Skill match with cache:", isSameSkills);

      if (isSameSkills) {
        console.log("✅ Returning cached skill courses.");
        return res.json({ skillCourses: existing.courses });
      }
    }

    const prompt = `
You are a career assistant AI. For each of the following skills: ${skills.join(", ")}, 
return a concise JSON array in the following format:
[
  {
    "skill": "Skill Name",
    "description": "One or two sentence summary of the skill.",
    "imageUrl": "a royalty-free relevant image URL",
    "courseUrl": "A link to official documentation or tutorial site (like MDN, freeCodeCamp, or W3Schools)"
  }
]
Only return raw JSON. Do not include explanations, markdown, or additional text.
`;

    console.log("✉️ Sending prompt to Gemini API...");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    const text = await response.text();
    console.log("📩 Raw Gemini API response:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      console.error("❌ Failed to parse outer JSON from Gemini:", parseErr);
      return res.status(500).json({ error: "Invalid JSON response", raw: text });
    }

    const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    console.log("🧾 Extracted AI text:", aiText);

    let parsedCourses;
    try {
      const cleanedText = aiText.replace(/```(?:json)?\s*([\s\S]*?)\s*```/, "$1").trim();
      parsedCourses = JSON.parse(cleanedText);
      console.log("✅ Parsed course data:", parsedCourses);
    } catch (parseErr) {
      console.error("❌ Failed to parse AI-generated JSON:", parseErr);
      return res.status(500).json({ error: "Failed to parse AI JSON", raw: aiText });
    }

    const updatedEntry = await Course.findOneAndUpdate(
      { username },
      { skills, title, courses: parsedCourses },
      { new: true, upsert: true }
    );

    console.log("💾 Course DB entry updated for user:", username);
    res.json({ skillCourses: updatedEntry.courses });

  } catch (err) {
    console.error("🚨 AI Skill Route Error:", err);
    res.status(500).json({ error: "AI processing failed" });
  }
});

module.exports = router;
