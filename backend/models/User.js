const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Only for manual users
  avatar: { type: String },   // Optional: store Google profile pic or custom one
  authType: {
    type: String,
    enum: ["manual", "google"],
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
