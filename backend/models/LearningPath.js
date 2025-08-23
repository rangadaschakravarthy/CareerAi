const mongoose = require("mongoose");

const ModuleSchema = new mongoose.Schema({
  title: String,
  content: String,
  snippet: String,
});

const LearningPathSchema = new mongoose.Schema({
  career: { type: String, required: true, unique: true },
  modules: [ModuleSchema],
});

module.exports = mongoose.model("LearningPath", LearningPathSchema);
