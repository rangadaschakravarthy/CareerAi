const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  title: { type: String },
  skills: [String],
  courses: [
    {
      skill: String,
      description: String,
      imageUrl: String,
      courseUrl: String,
    },
  ],
});

module.exports = mongoose.model("Course", courseSchema);
