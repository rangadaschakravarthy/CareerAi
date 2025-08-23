const express = require("express");
const router = express.Router();

// Import all models
const Career = require("../models/Career");
const CareerInfo = require("../models/CareerInfo");
const Course = require("../models/Course");
const LearningPath = require("../models/LearningPath");
const QuizResult = require("../models/QuizResult");
const SkillLearningPath = require("../models/SkillLearningPath");
const Skill = require("../models/Skills");
const User = require("../models/User");

// Utility function for CRUD
function crudRoutes(model, routeName) {
  // CREATE
  router.post(`/${routeName}`, async (req, res) => {
    try {
      const item = new model(req.body);
      await item.save();
      res.status(201).json(item);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // READ (all)
  router.get(`/${routeName}`, async (req, res) => {
    try {
      const items = await model.find();
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // READ (one)
  router.get(`/${routeName}/:id`, async (req, res) => {
    try {
      const item = await model.findById(req.params.id);
      if (!item) return res.status(404).json({ error: "Not found" });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // UPDATE
  router.put(`/${routeName}/:id`, async (req, res) => {
    try {
      const item = await model.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!item) return res.status(404).json({ error: "Not found" });
      res.json(item);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // DELETE
  router.delete(`/${routeName}/:id`, async (req, res) => {
    try {
      const item = await model.findByIdAndDelete(req.params.id);
      if (!item) return res.status(404).json({ error: "Not found" });
      res.json({ message: `${routeName} deleted` });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
}

// Register CRUD for all models
crudRoutes(Career, "careers");
crudRoutes(CareerInfo, "careerInfos");
crudRoutes(Course, "courses");
crudRoutes(LearningPath, "learningPaths");
crudRoutes(QuizResult, "quizResults");
crudRoutes(SkillLearningPath, "skillLearningPaths");
crudRoutes(Skill, "skills");
crudRoutes(User, "users");

module.exports = router;
