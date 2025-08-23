const express = require("express");
const router = express.Router();
const QuizResult = require("../models/QuizResult");
const parseCareerData = require("../utils/parsedCareerData");
const authMiddleware = require("../utils/authMiddleware");
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.name) {
      return res.status(400).json({ error: "User data missing" });
    }
    const quizResult = await QuizResult.findOne({ name: user.name });
    if (!quizResult) {
      return res.status(404).json({ error: "Quiz results not found" });
    }
    const parsed = parseCareerData(quizResult.recommendations);
    if (!parsed || !parsed.career) {
      return res.status(500).json({ error: "Invalid career parsing" });
    }
    const careers = Array.isArray(parsed)
      ? parsed
      : [
          {
            career: parsed.career,
            description: parsed.description || "No description available",
            salaryRange: parsed.salaryRange || "Not specified",
            skills: parsed.skills || [],
          },
        ];

    res.status(200).json({ careersRes: careers });
  } catch (error) {
    console.error("Error fetching career suggestion:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});
module.exports = router;