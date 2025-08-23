const express = require("express");
const router = express.Router();
const LearningPath = require("../models/LearningPath");
const { generateLearningPathFromGemini } = require("../utils/generateLearningPath");

router.get("/learning-path/:career", async (req, res) => {
  const { career } = req.params;

  try {
    const existingPath = await LearningPath.findOne({ career });

    if (existingPath) {
      return res.json(existingPath.modules); 
    }
    const generatedModules = await generateLearningPathFromGemini(career);

    const newPath = new LearningPath({
      career,
      modules: generatedModules,
    });
    await newPath.save();
    res.json(generatedModules);
  } catch (err) {
    console.error("Error generating learning path:", err);
    res.status(500).json({ error: "Failed to generate learning path." });
  }
});

module.exports = router;
