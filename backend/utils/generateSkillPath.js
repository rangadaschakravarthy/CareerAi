async function generateSkillPathFromGemini(skill) {
  const prompt = `
Create a 7-module learning plan to master the skill: "${skill}".

Each module must include:
- A title
- A short snippet (1–2 sentence summary)
- A detailed content section with bullet points to explain the topic and each bullet should have 3-5 sentences to explain the topic in the Form of Markdown

If the skill is technical:
- Include code snippets (as plain text, e.g., JavaScript, Python)

If the skill is non-technical:
- Include 3–5 tips or exercises instead of code

After the 7 modules, create a final quiz (Module 8):
- Title: "Final Assessment"
- 15 multiple-choice questions derived only from the previous modules
- Each question should include:
  - The question
  - 4 options
  - The correct answer

Format the output as JSON:
{
  "modules": [
    {
      "title": "",
      "snippet": "",
      "content": "",
      "code": ""
    }
  ],
  "finalQuiz": {
    "title": "Final Assessment",
    "questions": [
      {
        "question": "",
        "options": ["", "", "", ""],
        "correctAnswer": ""
      }
    ]
  }
}
Only return valid JSON. No markdown, explanation, or formatting.
`;

  try {
    console.log("📤 Sending prompt to Gemini for skill:", skill);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ Gemini API responded with error:", result);
      throw new Error("Gemini API request failed");
    }

    const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    console.log("📩 Raw Gemini Response:", rawText);

    const cleanText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log("🧹 Cleaned Gemini JSON (first 300 chars):", cleanText);

    const parsed = JSON.parse(cleanText);

    console.log("✅ Parsed Gemini output. Modules:", parsed.modules?.length || 0);
    console.log("📘 Final quiz title:", parsed.finalQuiz?.title || "None");

    return {
      modules: parsed.modules || [],
      finalQuiz: parsed.finalQuiz || { title: "", questions: [] },
    };
  } catch (error) {
    console.error("❌ Error parsing Gemini response:", error.message);
    return { modules: [], finalQuiz: { title: "", questions: [] } };
  }
}

module.exports = { generateSkillPathFromGemini };
