const express = require("express");
const router = express.Router();
const SkillLearningPath = require("../models/SkillLearningPath");
const { generateSkillPathFromGemini } = require("../utils/generateSkillPath");

router.post("/generate-skill-path", async (req, res) => {
  const { skill } = req.body;

  if (!skill) {
    return res.status(400).json({ error: "Skill is required" });
  }

  try {
    const normalizedSkill = skill.toLowerCase();

    const existing = await SkillLearningPath.findOne({
      skill: normalizedSkill,
    });
    if (existing) {
      return res
        .status(200)
        .json({ message: "Already exists", path: existing });
    }

    const { modules, finalQuiz } = await generateSkillPathFromGemini(skill);

    const newPath = new SkillLearningPath({
      skill: normalizedSkill,
      modules,
      finalQuiz,
    });

    await newPath.save();

    res.status(201).json({ message: "Skill path created", path: newPath });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
