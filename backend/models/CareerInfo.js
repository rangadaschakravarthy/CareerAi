const mongoose = require("mongoose");

const CareerInfoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  skillsRequired: [String],
  tools:[String],
  salaryRange: String,
  recommendedCourses: [String],
});
CareerInfoSchema.index({ username: 1, title: 1 }, { unique: true });

module.exports = mongoose.model("CareerInfo", CareerInfoSchema);
