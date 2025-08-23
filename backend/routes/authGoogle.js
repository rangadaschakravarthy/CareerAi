const express = require("express");
const router = express.Router();
require("dotenv").config;
const User = require("../models/User");
const generateToken=require("../utils/generateToken")
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
router.post("/api/auth/google", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience:
        process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, name, email, picture } = payload;

    let user = await User.findOne({ email });
    if (user && user.authType === "manual") {
      return res.status(400).json({
        message: "Email registered with password. Please login manually.",
      });
    }
    if (!user) {
      user = await User.create({
        name,
        email,
        avatar: picture,
        authType: "google",
      });
    }
    const jwtToken = generateToken(user._id);
    res.status(200).json({
      message: "Google login successful",
      user,
      token: jwtToken,
    });
  } catch (error) {
    console.error("Token verification failed", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});
module.exports = router;