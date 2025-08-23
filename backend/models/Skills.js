const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  current: [String],
  toDevelop: [String],
});

module.exports = mongoose.model("Skill", skillSchema);
