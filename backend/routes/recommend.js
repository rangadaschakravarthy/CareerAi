const express = require("express");
const router = express.Router();
const { recommendCourses } = require("../services/recommendationModel");

// Example endpoint: GET /api/recommend?skill=python
router.get("/", (req, res) => {
  const { skill } = req.query;

  if (!skill) {
    return res.status(400).json({ error: "Skill is required" });
  }

  const recommendations = recommendCourses(skill.toLowerCase());
  res.json({ skill, recommendations });
});

module.exports = router;
