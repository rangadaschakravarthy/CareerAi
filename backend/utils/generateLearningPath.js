async function generateLearningPathFromGemini(career) {
  const prompt = `You are an AI tutor. Break down the learning journey to become a ${career}. 
Generate 7 modules. Each should have:
1. Title
2. A complete description/content with bullet points in explanation
3. Code snippets or Programs with a markdown language to make it look like a program instead of text

Respond in JSON array format like:
[
  {
    "title": "Introduction",
    "content": "...",
    "snippet":"..."
  },
  ...
]
Just output pure JSON, no explanations or markdown.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const result = await response.json();
    const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

    console.log("🔍 Raw Gemini output:");
    console.log(rawText);

    const cleanText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleanText);
    return parsed;
  } catch (error) {
    console.error("❌ Error generating learning path:", error.message);
    return [];
  }
}

module.exports = { generateLearningPathFromGemini };