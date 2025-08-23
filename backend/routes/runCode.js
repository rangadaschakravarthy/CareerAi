const express = require("express");
const router = express.Router();
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

router.post("/api/run-code", async (req, res) => {
  const { code, language } = req.body;
  const id = uuidv4();
  const tempDir = "temp";
  let filePath = "";
  let command = "";
  let className = "";

  try {
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    switch (language) {
      case "javascript":
        filePath = path.join(tempDir, `${id}.js`);
        fs.writeFileSync(filePath, code);
        command = `node "${filePath}"`;
        break;

      case "python":
        filePath = path.join(tempDir, `${id}.py`);
        fs.writeFileSync(filePath, code);
        command = `python "${filePath}"`;
        break;

      case "c":
        filePath = path.join(tempDir, `${id}.c`);
        fs.writeFileSync(filePath, code);
        command = `gcc "${filePath}" -o "${tempDir}/${id}.exe" && "${tempDir}/${id}.exe"`;
        break;

      case "cpp":
        filePath = path.join(tempDir, `${id}.cpp`);
        fs.writeFileSync(filePath, code);
        command = `g++ "${filePath}" -o "${tempDir}/${id}.exe" && "${tempDir}/${id}.exe"`;
        break;

      case "java":
        const match = code.match(/public\s+class\s+(\w+)/);
        if (!match) {
          return res.status(400).json({ output: "No public class found in Java code." });
        }

        className = match[1];
        filePath = path.join(tempDir, `${className}.java`);
        fs.writeFileSync(filePath, code);
        command = `javac "${filePath}" && java -cp "${tempDir}" ${className}`;
        break;

      case "html":
        return res.json({ output: code });

      default:
        return res.status(400).json({ output: "Unsupported language" });
    }
    exec(command, { timeout: 8000 }, (err, stdout, stderr) => {
      try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        if (["c", "cpp"].includes(language)) {
          fs.unlinkSync(`${tempDir}/${id}.exe`);
        }
        if (language === "java") {
          fs.unlinkSync(path.join(tempDir, `${className}.class`));
        }
      } catch (cleanupErr) {
        console.log("Cleanup error:", cleanupErr.message);
      }

      if (err) {
        return res.status(400).json({ output: stderr || err.message });
      }

      res.json({ output: stdout });
    });
  } catch (error) {
    res.status(500).json({ output: "Execution error: " + error.message });
  }
});
module.exports = router;
