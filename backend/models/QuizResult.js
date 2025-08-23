const mongoose = require("mongoose");

const QuizResultSchema = new mongoose.Schema({
  name: { type: String, required: true,unique: true },
  education: { type: String, required: true },
  skills: [{ type: String }],
  interests: [{ type: String }],
  recommendations: { type: String },
  key: { type: String, unique: true } 
});

module.exports = mongoose.model("QuizResult", QuizResultSchema);
