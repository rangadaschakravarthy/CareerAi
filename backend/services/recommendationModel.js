const express = require("express");
const { TfIdf } = require("natural");
const _ = require("lodash");

const router = express.Router();

/**
 * ==============================
 * Course Catalog (Data Analyst)
 * ==============================
 * Each course has:
 *  - skill: Title / Topic
 *  - description: Summary
 *  - tags: Keywords (used for similarity)
 *  - imageUrl: Thumbnail image
 *  - courseUrl: Deep link
 */
const COURSE_CATALOG = [
  {
    skill: "Data Cleaning",
    description: "Handle missing values, outliers, and data quality checks using Pandas.",
    tags: ["python", "pandas", "data cleaning", "wrangling", "preprocessing", "eda"],
    imageUrl: "/images/courses/data-cleaning.png",
    courseUrl: "/course/data-cleaning"
  },
  {
    skill: "Data Manipulation",
    description: "Transform, aggregate, and reshape datasets with Pandas and SQL.",
    tags: ["python", "pandas", "groupby", "joins", "merge", "sql", "etl"],
    imageUrl: "/images/courses/data-manipulation.png",
    courseUrl: "/course/data-manipulation"
  },
  {
    skill: "Data Visualization",
    description: "Tell stories with data using Tableau/Power BI and Matplotlib.",
    tags: ["tableau", "power bi", "matplotlib", "visualization", "dashboards", "storytelling"],
    imageUrl: "/images/courses/data-visualization.png",
    courseUrl: "/course/data-visualization"
  },
  {
    skill: "SQL for Analytics",
    description: "Write analytical SQL: joins, window functions, CTEs, subqueries.",
    tags: ["sql", "joins", "window functions", "cte", "subqueries", "analytics"],
    imageUrl: "/images/courses/sql-analytics.png",
    courseUrl: "/course/sql-analytics"
  },
  {
    skill: "Advanced SQL",
    description: "Performance, indexing, query plans, and complex aggregations.",
    tags: ["sql", "indexing", "query optimization", "explain", "materialized views"],
    imageUrl: "/images/courses/advanced-sql.png",
    courseUrl: "/course/advanced-sql"
  },
  {
    skill: "Statistics for Data Analysis",
    description: "Descriptive stats, probability, inference, confidence intervals.",
    tags: ["statistics", "probability", "inference", "confidence intervals", "sampling"],
    imageUrl: "/images/courses/statistics.png",
    courseUrl: "/course/statistics"
  },
  {
    skill: "Hypothesis Testing & A/B Testing",
    description: "p-values, tests, power, and experiment design for analysts.",
    tags: ["hypothesis testing", "a/b testing", "experiments", "power", "p-value"],
    imageUrl: "/images/courses/ab-testing.png",
    courseUrl: "/course/ab-testing"
  },
  {
    skill: "Excel for Analysts",
    description: "Advanced Excel: pivot tables, lookups, what-if analysis.",
    tags: ["excel", "pivot tables", "vlookup", "xlookup", "what-if", "dashboards"],
    imageUrl: "/images/courses/excel-analyst.png",
    courseUrl: "/course/excel-analyst"
  },
  {
    skill: "BI Dashboards",
    description: "Build interactive dashboards and KPI reports in Power BI/Tableau.",
    tags: ["power bi", "tableau", "dashboards", "kpi", "reporting", "dax"],
    imageUrl: "/images/courses/bi-dashboards.png",
    courseUrl: "/course/bi-dashboards"
  },
  {
    skill: "Communication for Analysts",
    description: "Executive summaries, stakeholder comms, and data storytelling.",
    tags: ["communication", "storytelling", "stakeholders", "presentation", "insights"],
    imageUrl: "/images/courses/communication.png",
    courseUrl: "/course/communication"
  },
  {
    skill: "Problem Solving for Analytics",
    description: "Structured thinking, MECE, and framing data problems.",
    tags: ["problem solving", "mece", "framing", "root cause", "analytical thinking"],
    imageUrl: "/images/courses/problem-solving.png",
    courseUrl: "/course/problem-solving"
  }
];

/**
 * Role → target skills map
 */
const ROLE_SKILLS = {
  "Data Analyst": [
    "sql", "excel", "tableau", "power bi", "statistics",
    "data cleaning", "data manipulation", "visualization",
    "communication", "problem solving", "pandas", "matplotlib",
    "hypothesis testing", "a/b testing"
  ]
};

/** Utility: normalize string */
const norm = s => String(s || "").trim().toLowerCase();

/** Build TF-IDF index */
function buildTfIdf(catalog) {
  const tfidf = new TfIdf();
  catalog.forEach(c => tfidf.addDocument(c.tags.map(norm).join(" ")));
  return tfidf;
}

/** Cosine similarity */
function cosine(a, b) {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magA = Math.sqrt(a.reduce((s, ai) => s + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((s, bi) => s + bi * bi, 0));
  return magA && magB ? dot / (magA * magB) : 0;
}

/** Convert sparse TF-IDF weights → dense vector */
function toDense(tfidf, terms) {
  const vocab = new Set();
  tfidf.documents.forEach(d => Object.keys(d.__keyCount).forEach(k => vocab.add(k)));

  const vocabArr = Array.from(vocab);
  const vec = new Array(vocabArr.length).fill(0);
  const termIndex = Object.fromEntries(vocabArr.map((t, i) => [t, i]));

  terms.forEach(({ term, tfidf: weight }) => {
    const i = termIndex[term];
    if (i >= 0) vec[i] = weight;
  });

  return { vec, vocabArr };
}

/**
 * Core Recommendation Engine
 */
function recommendCourses({ userSkills, career = "Data Analyst", topN = 6 }) {
  const tfidf = buildTfIdf(COURSE_CATALOG);

  const knownSkills = new Set(userSkills.map(norm));
  const roleSkills = (ROLE_SKILLS[career] || []).map(norm);

  // Weight: known skills (1), missing role skills (2)
  const missing = roleSkills.filter(s => !knownSkills.has(s));
  const queryTokens = [
    ...userSkills.map(norm),
    ...missing.flatMap(s => [s, s])
  ];

  // Build query vector
  const queryText = queryTokens.join(" ");
  const queryTerms = [];
  tfidf.tfidfs(queryText, (i, measure, key) => {
    queryTerms.push({ term: key, tfidf: measure });
  });
  const { vec: qVec, vocabArr } = toDense(tfidf, queryTerms);

  // Score each course
  const scored = COURSE_CATALOG.map((course, idx) => {
    const docTerms = tfidf.listTerms(idx);
    const docVec = vocabArr.map(t => {
      const found = docTerms.find(x => x.term === t);
      return found ? found.tfidf : 0;
    });

    const score = cosine(qVec, docVec);
    const allKnown = course.tags.every(t => knownSkills.has(norm(t)));
    const adjustedScore = allKnown ? score * 0.85 : score; // slight penalty if redundant

    return { course, score: adjustedScore };
  });

  return _.orderBy(scored, "score", "desc").slice(0, topN).map(s => s.course);
}

/**
 * POST /recommend
 * Body: { username, skills: string[], career?: string }
 */
router.post("/", async (req, res) => {
  try {
    const { username, skills = [], career } = req.body || {};
    const role = career || "Data Analyst";

    const courses = recommendCourses({
      userSkills: skills,
      career: role,
      topN: 6
    });

    res.json({ skillCourses: courses });
  } catch (err) {
    console.error("recommend error:", err);
    res.status(500).json({ message: "Failed to recommend courses" });
  }
});

module.exports = router;
