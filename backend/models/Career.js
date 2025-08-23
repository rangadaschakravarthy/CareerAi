const mongoose = require("mongoose");

const CareerSchema = new mongoose.Schema({
  id: Number,
  title: String,
  category: String,
  matchScore: Number,
  salary: String,
  growth: String,
  education: String,
  description: String,
  skills: [String],
  image: String
});

module.exports= mongoose.model("Career", CareerSchema);
