const express = require("express");
const router = express.Router();
require("dotenv").config();

const groupSkills = require("../utils/groupSkills");
const QuizResult = require("../models/QuizResult");
const CareerInfo = require("../models/CareerInfo");
const parseCareerData = require("../utils/parsedCareerData");

router.post("/api/quiz", async (req, res) => {
  try {
    const { name, education, skills, interests } = req.body;
    console.log("📥 Incoming request body:", req.body);

    // Normalize inputs
    const normalize = (data) => ({
      education: data.education.trim().toLowerCase(),
      skills: data.skills.map((s) => s.trim().toLowerCase()).sort(),
      interests: data.interests.map((i) => i.trim().toLowerCase()).sort(),
    });

    const norm = normalize({ education, skills, interests });
    console.log("🔍 Normalized input:", norm);

    const groupedSkills = groupSkills(norm.skills);
    console.log("🧠 Grouped skills:", groupedSkills);

    const key = `${norm.education}-${norm.skills.join("-")}-${norm.interests.join("-")}`;
    console.log("🔑 Cache key:", key);

    // Try to fetch cached result
    const cached = await QuizResult.findOne({ key });
    if (cached) {
      console.log("💾 Found cached result for key:", key);
      return res.status(200).json({
        source: "cache",
        recommendations: cached.recommendations,
      });
    }

    const prompt = `You are a career guidance assistant.

Given the following user information:
Name: ${name}
Education: ${education}
Skills: ${skills.join(", ")}
Interests: ${interests.join(", ")}

Suggest the top career path for this person. For each career, include:
1. A brief description
2. All Key skills required which are necessary to become what the career path and in array format without curve braces 
3. Tools to Master to become a professional in that career
4. Estimated salary range (in Indian Rupees)
5. 1–2 online course recommendations to get started.

Answer only one career path with high probability 

Format the answer in markdown as:
**Career:** [Career Name]  
**Description:** ...  
**Skills Needed:** ...  
**Tools:** ...  
**Salary Range:** ...  
**Courses:** ...
*[Course 1]
*[Course 2]
`;

    console.log("✉️ Sending prompt to Gemini API...");

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const result = await geminiResponse.json();

    if (!geminiResponse.ok) {
      console.error("❌ Gemini API Error:", result);
      return res.status(500).json({
        message: "Gemini API call failed",
        error: result,
      });
    }

    console.log("✅ Gemini API response received");

    const aiText =
      result?.candidates?.[0]?.content?.parts?.[0]?.text || "No suggestions received.";

    console.log("🧾 Gemini Response Text:", aiText);

    const parsed = parseCareerData(aiText);
    console.log("🧪 Parsed Career Data:", parsed);

    // Sanitize list values to strip unwanted asterisks, dashes, etc.
    const sanitizeList = (arr) =>
      Array.isArray(arr)
        ? arr.map((item) => item.replace(/^[-*•\s]+/, "").trim()).filter(Boolean)
        : [];

    // Save to CareerInfo
    if (parsed.career && name) {
      const updateData = {
        title: parsed.career,
        description: parsed.description,
        skillsRequired: sanitizeList(parsed.skills),
        tools: sanitizeList(parsed.tools),
        salaryRange: parsed.salaryRange,
        recommendedCourses: sanitizeList(parsed.courses),
      };

      console.log("💾 Upserting CareerInfo for:", name);
      await CareerInfo.findOneAndUpdate({ name }, updateData, {
        upsert: true,
        new: true,
      });
    }

    console.log("💾 Upserting QuizResult for:", name);
    await QuizResult.findOneAndUpdate(
      { name },
      {
        name,
        education: norm.education,
        skills: norm.skills,
        groupedSkills,
        interests: norm.interests,
        recommendations: aiText,
        key,
      },
      { upsert: true, new: true }
    );

    console.log("✅ Quiz processing complete. Returning response...");
    return res.status(200).json({
      source: "ai",
      recommendations: aiText,
    });

  } catch (error) {
    console.error("❌ Quiz error:", error);
    return res.status(500).json({
      message: "Failed to process quiz",
      error: error.message,
    });
  }
});

module.exports = router;
