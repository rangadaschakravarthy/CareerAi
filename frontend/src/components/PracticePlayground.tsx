import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { useAuth } from "../contexts/AuthContext";
import {
  Code2,
  Brain,
  PlayCircle,
  BookOpen,
  Terminal,
  Rocket,
  Zap,
  Globe,
  Database,
  Smartphone,
  Palette,
  Shield,
  TrendingUp,
} from "lucide-react";

const defaultCode: { [key: string]: string } = {
  html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      background-color: #f4f4f4;
      font-family: sans-serif;
    }
    h1 {
      color: #333;
      text-align: center;
    }
  </style>
</head>
<body>
  <h1>Hello, HTML + CSS!</h1>
</body>
</html>`,
  javascript: `// Hello World in JavaScript
console.log("Hello, World!");`,

  python: `# Hello World in Python
print("Hello, World!")`,

  c: `// Hello World in C
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,

  cpp: `// Hello World in C++
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,

  java: `// Hello World in Java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
};

const skillData: {
  [key: string]: {
    subtopics: string[];
    concepts: string[];
    projects: string[];
    icon: React.ComponentType<any>;
    color: string;
  };
} = {
  "Web Development": {
    subtopics: ["HTML5", "CSS3", "JavaScript ES6+", "Responsive Design"],
    concepts: [
      "DOM Manipulation",
      "Event Handling",
      "Flexbox & Grid",
      "Web APIs",
    ],
    projects: [
      "Portfolio Website",
      "E-commerce Site",
      "Blog Platform",
      "Weather App",
    ],
    icon: Globe,
    color: "text-blue-500",
  },
  "Frontend Frameworks": {
    subtopics: ["React", "Vue.js", "Angular", "Svelte"],
    concepts: [
      "Component Architecture",
      "State Management",
      "Virtual DOM",
      "Hooks",
    ],
    projects: [
      "Todo App",
      "Social Media Dashboard",
      "Real-time Chat",
      "E-learning Platform",
    ],
    icon: Zap,
    color: "text-purple-500",
  },
  "Backend Development": {
    subtopics: ["Node.js", "Express", "REST APIs", "GraphQL"],
    concepts: [
      "Server Architecture",
      "Authentication",
      "Middleware",
      "API Design",
    ],
    projects: [
      "REST API",
      "Authentication System",
      "File Upload Service",
      "Real-time Server",
    ],
    icon: Database,
    color: "text-green-500",
  },
  "Mobile Development": {
    subtopics: ["React Native", "Flutter", "iOS", "Android"],
    concepts: [
      "Cross-platform",
      "Native APIs",
      "App Store",
      "Push Notifications",
    ],
    projects: ["Weather App", "Task Manager", "Social App", "E-commerce App"],
    icon: Smartphone,
    color: "text-pink-500",
  },
  "Data Science": {
    subtopics: ["Python", "Pandas", "NumPy", "Machine Learning"],
    concepts: ["Data Analysis", "Visualization", "Statistics", "Algorithms"],
    projects: [
      "Data Dashboard",
      "Prediction Model",
      "Analysis Report",
      "ML Pipeline",
    ],
    icon: TrendingUp,
    color: "text-orange-500",
  },
  "UI/UX Design": {
    subtopics: ["Figma", "Adobe XD", "Prototyping", "User Research"],
    concepts: [
      "Design Systems",
      "Accessibility",
      "User Journey",
      "Wireframing",
    ],
    projects: ["App Redesign", "Design System", "User Research", "Prototype"],
    icon: Palette,
    color: "text-indigo-500",
  },
  Cybersecurity: {
    subtopics: [
      "Network Security",
      "Encryption",
      "Penetration Testing",
      "OWASP",
    ],
    concepts: [
      "Threat Analysis",
      "Risk Assessment",
      "Security Protocols",
      "Incident Response",
    ],
    projects: [
      "Security Audit",
      "Vulnerability Scanner",
      "Secure API",
      "Security Training",
    ],
    icon: Shield,
    color: "text-red-500",
  },
};

const languageExtensions: { [key: string]: any } = {
  html: javascript(),
  css: javascript(),
  javascript: javascript(),
  python: python(),
  c: cpp(),
  cpp: cpp(),
  java: java(),
};

const PracticePlayground: React.FC = () => {
  const { user } = useAuth();
  const [selectedSkill, setSelectedSkill] = useState("Web Development");
  const [language, setLanguage] = useState("javascript");
  const [aiInput, setAiInput] = useState("");
  const [aiResponse, setAiResponse] = useState({ description: "", code: "" });
  const [code, setCode] = useState(defaultCode["javascript"]);
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(defaultCode[newLanguage]);
  };

  const handleAiQuery = async () => {
    if (!aiInput.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/aiquery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiInput }),
      });

      const data = await response.json();

      if (response.ok) {
        setAiResponse({
          description: data.description || "No description",
          code: data.code || "No code",
        });
      } else {
        setAiResponse({
          description: "Error",
          code: data.error || "Unknown error",
        });
      }
    } catch (error:any) {
      setAiResponse({ description: "Request failed", code: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const runCode = async () => {
    if (language === "html" || language === "css") {
      setOutput("");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      const data = await res.json();
      setOutput(data.output || "No output");
    } catch (err: any) {
      setOutput(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const skill = skillData[selectedSkill];

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-100 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Code2 className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Practice Playground</h1>
                <p className="mt-2 text-white/80">
                  Welcome back, {user?.name}! Ready to level up your skills?
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                {/* AI Tutor */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-base-200/50 rounded-xl p-6"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Brain className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold">
                      AI Coding Assistant
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <textarea
                      className="w-full px-4 py-3 bg-base-100 border border-base-content/20 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                      rows={4}
                      placeholder="Ask me anything about coding, debugging, or best practices..."
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                    />

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAiQuery}
                      disabled={isLoading || !aiInput.trim()}
                      className="flex items-center px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-focus transition-colors disabled:opacity-50 w-full justify-center"
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                      ) : (
                        <Brain className="w-5 h-5 mr-2" />
                      )}
                      {isLoading ? "Thinking..." : "Ask AI Assistant"}
                    </motion.button>

                    <AnimatePresence>
                      {aiResponse && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-base-100 rounded-lg p-4 border border-base-content/10"
                        >
                          <div className="text-sm text-base-content/80 whitespace-pre-wrap">
                            <h3>Description</h3>
                            <p>{aiResponse.description}</p>
                            <h3>Code</h3>
                            <pre>
                              <code>{aiResponse.code}</code>
                            </pre>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* Skill Selection */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-base-200/50 rounded-xl p-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold">Learning Path</h2>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-base-content/70 mb-3">
                      Choose Your Focus Area
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {Object.entries(skillData).map(
                        ([skillName, skillInfo]) => {
                          const IconComponent = skillInfo.icon;
                          return (
                            <motion.button
                              key={skillName}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setSelectedSkill(skillName)}
                              className={`flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                                selectedSkill === skillName
                                  ? "bg-primary text-white shadow-md"
                                  : "bg-base-100 hover:bg-base-200 border border-base-content/10"
                              }`}
                            >
                              <IconComponent
                                className={`w-5 h-5 ${
                                  selectedSkill === skillName
                                    ? "text-white"
                                    : skillInfo.color
                                }`}
                              />
                              <span className="font-medium">{skillName}</span>
                            </motion.button>
                          );
                        }
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Skill Breakdown */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-base-200/50 rounded-xl p-6"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Rocket className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold">{selectedSkill}</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-base-content/70 mb-2">
                        Key Technologies
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {skill.subtopics.map((topic) => (
                          <span
                            key={topic}
                            className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-base-content/70 mb-2">
                        Core Concepts
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {skill.concepts.map((concept) => (
                          <span
                            key={concept}
                            className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-base-content/70 mb-2">
                        Project Ideas
                      </h3>
                      <div className="space-y-2">
                        {skill.projects.map((project) => (
                          <div
                            key={project}
                            className="flex items-center gap-2 text-sm text-base-content/80"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                            {project}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Code Editor */}
              <div className="lg:col-span-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-base-200/50 rounded-xl p-6 h-full"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-primary" />
                      <h2 className="text-xl font-semibold">Code Editor</h2>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Language Selector */}
                      <div className="flex items-center gap-2">
                        <select
                          value={language}
                          onChange={(e) => handleLanguageChange(e.target.value)}
                          className="px-3 py-1.5 bg-base-100 border border-base-content/20 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                        >
                          <option value="html">HTML/CSS</option>
                          <option value="javascript">JavaScript</option>
                          <option value="python">Python</option>
                          <option value="c">C</option>
                          <option value="cpp">C++</option>
                          <option value="java">Java</option>
                        </select>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={runCode}
                        disabled={isLoading}
                        className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 shadow-md"
                      >
                        {isLoading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                          />
                        ) : (
                          <PlayCircle className="w-5 h-5 mr-2" />
                        )}
                        {isLoading ? "Running..." : "Run Code"}
                      </motion.button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="overflow-hidden rounded-lg border border-base-content/10 shadow-lg">
                      <CodeMirror
                        value={code}
                        height="400px"
                        theme="dark"
                        extensions={[
                          languageExtensions[language] || javascript(),
                        ]}
                        onChange={(value) => setCode(value)}
                        className="bg-[#1e1e1e]"
                      />
                    </div>

                    <AnimatePresence>
                      {(output ||
                        language === "html" ||
                        language === "css") && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-base-100 rounded-lg p-4 border border-base-content/10 shadow-sm"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <Terminal className="w-4 h-4 text-base-content/60" />
                            <h3 className="text-sm font-medium text-base-content/70">
                              {language === "html" || language === "css"
                                ? "Live Preview"
                                : "Output"}
                            </h3>
                          </div>

                          {language === "html" ? (
                            <div className="bg-white rounded-lg border border-base-content/10 overflow-hidden shadow-sm">
                              <iframe
                                className="w-full h-96 border-none"
                                sandbox="allow-scripts"
                                srcDoc={code}
                                title="HTML Preview"
                              />
                            </div>
                          ) : language === "css" ? (
                            <div className="bg-white rounded-lg border border-base-content/10 overflow-hidden shadow-sm">
                              <iframe
                                className="w-full h-96 border-none"
                                sandbox="allow-scripts"
                                srcDoc={`
                                  <!DOCTYPE html>
                                  <html>
                                  <head>
                                    <style>${code}</style>
                                  </head>
                                  <body>
                                    <h1>Hello, World!</h1>
                                    <p>This is a CSS preview. Add your styles above to see them applied here.</p>
                                  </body>
                                  </html>
                                `}
                                title="CSS Preview"
                              />
                            </div>
                          ) : (
                            <pre className="whitespace-pre-wrap font-mono bg-base-200/50 p-4 rounded-lg text-sm overflow-x-auto">
                              {output || "No output"}
                            </pre>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PracticePlayground;
