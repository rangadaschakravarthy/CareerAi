import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  BookOpen,
  FileText,
  ChevronRight,
  ChevronLeft,
  Trophy,
  Target,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import axios  from "axios";

interface LearningModule {
  title: string;
  content: string;
  snippet: string;
}

const CareerLearningPage: React.FC = () => {
  const { careerTitle } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [notes,setNotes] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const userRes = await axios.get(
          "https://careerai-885x.onrender.com/api/auth/me",
          config
        );
        const res = await fetch(
          `https://careerai-885x.onrender.com/api/learning-path/${encodeURIComponent(
            careerTitle!
          )}`
        );
        const data = await res.json();
        setModules(data);
        console.log("User Data:", userRes.data);
      } catch (err) {
        console.error("Error loading modules:", err);
      } finally {
        setLoading(false);
      }
      console.log(notes)
    };

    if (careerTitle) {
      fetchModules();
    }
  }, [careerTitle]);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!careerTitle || !modules[currentIndex] || !user?.name) return;

      try {
        const res = await fetch(
          `http://localhost:5000/api/progress/${user.name}/${careerTitle}`
        );
        const saved = await res.json();
        const match = saved.find(
          (item: any) => item.module === modules[currentIndex].title
        );
        setNotes(match?.notes || "");
      } catch (err) {
        console.error("Error fetching saved notes:", err);
      }
    };

    fetchNotes();
  }, [careerTitle, modules, currentIndex, user?.name]);

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-base-content/70"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-lg">Loading learning modules...</p>
        </motion.div>
      </div>
    );
  }

  if (!modules.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <BookOpen className="w-16 h-16 text-base-content/40 mx-auto mb-4" />
          <p className="text-lg text-base-content/70">
            No learning modules found for this career.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-focus transition-colors"
          >
            Go Back
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (currentIndex >= modules.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-base-100 rounded-2xl shadow-xl p-12"
        >
          <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-base-content mb-4">
            🎉 Congratulations!
          </h1>
          <p className="text-lg text-base-content/70 mb-8">
            You've completed the learning path for{" "}
            <strong>{careerTitle}</strong>
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-focus transition-colors"
          >
            Return to Dashboard
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const currentModule = modules[currentIndex];
  const progress = ((currentIndex + 1) / modules.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-100 rounded-2xl shadow-xl overflow-hidden mb-8"
        >
          <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate(-1)}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
                <div>
                  <h1 className="text-2xl font-bold">{careerTitle}</h1>
                  <p className="text-white/80">Learning Path</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm">Progress</p>
                <p className="text-xl font-bold">
                  {currentIndex + 1} / {modules.length}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 bg-white/20 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-full h-2"
              />
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Snippet */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-base-100 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="bg-base-200/50 p-6 border-b border-base-content/10">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Quick Snippet</h2>
              </div>
            </div>

            <div className="p-6">
              <div className="text-base-content/80 text-sm leading-relaxed whitespace-pre-wrap">
                <ReactMarkdown>{currentModule.snippet ||
                  "No snippet available for this module."}</ReactMarkdown>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-base-100 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="bg-base-200/50 p-6 border-b border-base-content/10">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">
                  Module {currentIndex + 1}
                </h2>
              </div>
              <h3 className="text-lg font-medium text-base-content/80 mt-1">
                {currentModule.title}
              </h3>
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="prose prose-lg max-w-none"
                >
                  <div className="prose prose-sm text-base-content leading-relaxed">
                    <ReactMarkdown>{currentModule.content}</ReactMarkdown>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-base-content/10">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-2 px-6 py-2 border border-base-content/20 rounded-lg hover:bg-base-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </motion.button>

                <div className="flex items-center gap-2 text-sm text-base-content/60">
                  <span>
                    {currentIndex + 1} of {modules.length} modules
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-focus transition-colors"
                >
                  {currentIndex < modules.length - 1
                    ? "Next Module"
                    : "Complete Course"}
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CareerLearningPage;

