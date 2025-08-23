const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { OAuth2Client } = require("google-auth-library");
const crypto = require("crypto");
const User = require("./models/User");
const Career = require("./models/Career");
const QuizResult = require("./models/QuizResult");
const CareerInfo = require("./models/CareerInfo");
const LearningProgress = require('./models/LearningPath');
const Course = require("./models/Course");
const getSkillGap = require("./utils/getSkillGap");
const parseCareerData = require("./utils/parsedCareerData");
const generateToken = require("./utils/generateToken");
const runCodeRouter = require("./routes/runCode");
const aiQuery = require("./routes/aiQuery");
const aiQuiz = require("./routes/aiQuiz");
const authGoogle = require("./routes/authGoogle");
const aiCourses = require("./routes/aiCourses");
const learningPath = require("./routes/learningPath");
const skillLearningPathRoutes = require("./routes/skillLearningPath");
const recommendRoutes = require("./routes/recommend");


require("dotenv").config();
const app = express();
const PORT = 5000;
const MONGO_URI = process.env.MONGO_URI;

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));
app.use(bodyParser.json());

app.use("/api/recommend", recommendRoutes);
app.use("/admin", require("./routes/admin"));

function cleanJSONResponse(text) {
  return text
    .trim()
    .replace(/^```json\s*/, "") // Remove starting ```json
    .replace(/^```[\s\S]*?\n/, "") // Remove other ``` + language tags if any
    .replace(/```$/, "") // Remove ending ```
    .trim();
}

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const normalizeData = (data) => ({
  education: data.education.trim().toLowerCase(),
  skills: [...data.skills].sort().map((s) => s.trim().toLowerCase()),
  interests: [...data.interests].sort().map((i) => i.trim().toLowerCase()),
});

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

function sendEmail({ recipient_email, OTP }) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });
    transporter.verify((err, success) => {
      if (err) {
        console.error("Connection error:", err);
      } else {
        console.log("Server is ready to take messages");
      }
    });

    const mail_configs = {
      from: `"Career AI" <${process.env.MY_EMAIL}>`,
      to: recipient_email,
      subject: "Password Recovery OTP",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Career AI - OTP</h2>
          <p>Hi there,</p>
          <p>Use the following OTP to reset your password. It is valid for 5 minutes:</p>
          <h3 style="background: #00466a; color: white; padding: 10px; width: max-content;">${OTP}</h3>
          <p>If you didn’t request this, you can ignore this email.</p>
          <br>
          <small>Career AI</small>
        </div>
      `,
    };

    transporter.sendMail(mail_configs, (error, info) => {
      if (error) {
        console.error("Email error:", error);
        return reject(new Error("Failed to send email"));
      }
      return resolve({ message: "Email sent successfully" });
    });
  });
}

app.use("/api", learningPath);

app.post('/api/save-progress', async (req, res) => {
  const { username, career, module, notes } = req.body;
  console.log(`[POST] /api/save-progress | User: ${username}, Career: ${career}, Module: ${module}`);

  try {
    const existing = await LearningProgress.findOne({ username, career, module });
    if (existing) {
      console.log("Existing progress found. Updating notes.");
      existing.notes = notes;
      await existing.save();
    } else {
      console.log("No existing progress. Creating new entry.");
      await LearningProgress.create({ username, career, module, notes });
    }

    res.json({ message: 'Progress saved successfully.' });
  } catch (err) {
    console.error("Progress save error:", err);
    res.status(500).json({ error: "Failed to save progress." });
  }
});

app.get('/api/progress/:username/:career', async (req, res) => {
  const { username, career } = req.params;
  console.log(`[GET] /api/progress/${username}/${career}`);

  try {
    const progress = await LearningProgress.find({ username, career });
    console.log("Fetched saved progress:", progress);
    res.json(progress);
  } catch (err) {
    console.error("Fetch notes error:", err);
    res.status(500).json({ error: "Failed to fetch notes." });
  }
});


app.post("/send_recovery_email", (req, res) => {
  sendEmail(req.body)
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      authType: "manual",
    });
    const token = generateToken(user._id);
    res.status(201).json({ message: "User registered", user, token });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.authType !== "manual")
      return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Incorrect password" });
    const token = generateToken(user._id);
    res.status(200).json({ message: "Login successful", user, token });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

app.get("/api/auth/me", authMiddleware, (req, res) => {
  res.status(200).json({ user: req.user });
});


app.post("/api/quiz",aiQuiz);

app.put("/api/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ email }, { password: hashedPassword });
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating password" });
  }
});

app.post("/api/auth/google",authGoogle);

app.get("/api/careers", async (req, res) => {
  try {
    const careers = await Career.find().sort({ matchScore: -1 });
    res.json(careers);
  } catch (err) {
    console.error("Error fetching careers:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/skills", authMiddleware, async (req, res) => {
  const user = req.user;
  const quizResult = await QuizResult.findOne({ name: user.name });
  const parsed = parseCareerData(quizResult.recommendations);
  const skillsToDevelop = getSkillGap(quizResult.skills, parsed.skills || []);
  res.status(200).json({
    currentSkills: quizResult.skills,
    skillsToDevelop,
  });
});

app.use("/api/learning",skillLearningPathRoutes);


app.use("/api/ai-skill-courses", aiCourses);

app.get("/api/career-suggestion", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.name) {
      return res.status(400).json({ error: "User data missing" });
    }

    const quizResult = await QuizResult.findOne({ name: user.name });
    if (!quizResult) {
      return res.status(404).json({ error: "Quiz results not found" });
    }

    const parsed = parseCareerData(quizResult.recommendations);
    if (!parsed || !parsed.career) {
      return res.status(500).json({ error: "Invalid career parsing" });
    }

    const careers = Array.isArray(parsed)
      ? parsed
      : [
          {
            career: parsed.career,
            description: parsed.description || "No description available",
            salaryRange: parsed.salaryRange || "Not specified",
            skills: parsed.skills || [],
          },
        ];

    res.status(200).json({ careersRes: careers });
  } catch (error) {
    console.error("Error fetching career suggestion:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

app.post("/api/run-code",runCodeRouter);

app.post("/api/aiquery",aiQuery);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
