const mongoose = require("mongoose");

const ModuleSchema = new mongoose.Schema({
  title: String,
  content: String,
  snippet: String,
  code: String, 
});

const QuizSchema = new mongoose.Schema({
  title: String,
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: String,
    },
  ],
});

const SkillLearningPathSchema = new mongoose.Schema({
  skill: { type: String, required: true, unique: true },
  modules: [ModuleSchema],
  finalQuiz: QuizSchema,
});

module.exports = mongoose.model("SkillLearningPath", SkillLearningPathSchema);
