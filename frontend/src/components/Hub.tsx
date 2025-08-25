import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  ArrowLeft, 
  Target, 
  Award,
  Brain,
  Lightbulb,
  FileText,
  Trophy,
  Star,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Code,
  Play,
  Sparkles,
  GraduationCap,
  AlertCircle,
  Copy,
  Terminal
} from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Module {
  title: string;
  snippet: string;
  content: string;
  code?: string;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface Quiz {
  title: string;
  questions: Question[];
}

interface SkillPath {
  skill: string;
  modules: Module[];
  finalQuiz: Quiz;
}

const Hub: React.FC = () => {
  const { skill } = useParams<{ skill: string }>();
  const navigate = useNavigate();
  const [skillPath, setSkillPath] = useState<SkillPath | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [index: number]: string }>({});
  const [score, setScore] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);
  const [codeCopied, setCodeCopied] = useState<boolean>(false);
  const contentItems = skillPath ? [
    ...skillPath.modules.slice(0, 7).map((module, index) => ({ type: 'module' as const, data: module, index })),
    { type: 'quiz' as const, data: skillPath.finalQuiz, index: 0 }
  ] : [];

  useEffect(() => {
    const fetchSkillPath = async () => {
      if (!skill) return;
      try {
        setLoading(true);
        const res = await axios.post("https://careerai-885x.onrender.com/api/learning/generate-skill-path", { skill });
        setSkillPath(res.data.path);
      } catch (err) {
        console.error("Error fetching skill path", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkillPath();
  }, [skill]);

  const handleOptionSelect = (qIdx: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [qIdx]: answer }));
  };

  const calculateScore = () => {
    if (!skillPath || !skillPath.finalQuiz) return;

    const quiz = skillPath.finalQuiz;
    const correct = quiz.questions.reduce((acc, q, idx) => {
      return acc + (answers[idx] === q.correctAnswer ? 1 : 0);
    }, 0);

    setScore(correct);
    setIsQuizSubmitted(true);
  };

  const shuffleQuestions = () => {
    if (!skillPath || !skillPath.finalQuiz) return;

    const shuffled = [...skillPath.finalQuiz.questions].sort(() => Math.random() - 0.5);
    setSkillPath({
      ...skillPath,
      finalQuiz: { ...skillPath.finalQuiz, questions: shuffled },
    });
    setAnswers({});
    setScore(null);
    setIsQuizSubmitted(false);
  };

  const handleNext = () => {
    if (currentIndex < contentItems.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const canProceed = () => {
    const currentItem = contentItems[currentIndex];
    if (currentItem?.type === 'quiz') {
      return isQuizSubmitted && score !== null && score >= 11;
    }
    return true;
  };

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const renderModule = (module: Module, moduleIndex: number) => (
    <motion.div
      key={`module-${moduleIndex}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-base-100 rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 border-b border-base-content/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
              {moduleIndex + 1}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-base-content">{module.title}</h2>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2 text-base-content/60">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">~15 min read</span>
                </div>
                <div className="flex items-center gap-2 text-base-content/60">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm">Module {moduleIndex + 1} of 7</span>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-primary/10 p-3 rounded-full">
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-base-content/60 mb-2">
            <span>Module Progress</span>
            <span>{Math.round(((moduleIndex + 1) / 7) * 100)}%</span>
          </div>
          <div className="bg-base-200 rounded-full h-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((moduleIndex + 1) / 7) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-gradient-to-r from-primary to-secondary rounded-full h-2"
            />
          </div>
        </div>
      </div>

      {/* Split Screen Layout */}
      <div className="grid lg:grid-cols-2 gap-0 min-h-[700px]">
        {/* Left Half - Module Content */}
        <div className="p-8 border-r border-base-content/10">
          <div className="h-full flex flex-col">
            {/* Key Insights */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-secondary" />
                <h3 className="font-semibold text-base-content">Key Insights</h3>
              </div>
              <div className="bg-secondary/5 rounded-lg p-4 border border-secondary/20">
                <p className="text-base-content/80 text-sm leading-relaxed">
                  {module.snippet}
                </p>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-6">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold text-base-content">Module Content</h3>
              </div>

              <div className="prose prose-lg max-w-none">
                <div className="text-base-content leading-relaxed space-y-4">
                  {module.content.split('\n\n').map((paragraph, idx) => (
                    <motion.p
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="text-base-content/80 leading-relaxed"
                    >
                      <ReactMarkdown>{paragraph}</ReactMarkdown>
                    </motion.p>
                  ))}
                </div>
              </div>
            </div>

            {/* Course Structure Info */}
            <div className="mt-6 bg-accent/5 rounded-lg p-4 border border-accent/20">
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">Course Structure</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-xs text-base-content/60">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>7 Modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span>1 Assessment</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span>Pass: 11/15</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-base-200/30">
          <div className="h-full flex flex-col">
            {module.code ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-accent" />
                    <h3 className="text-xl font-semibold text-base-content">Code Example</h3>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyCode(module.code!)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors text-sm font-medium"
                  >
                    {codeCopied ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Code
                      </>
                    )}
                  </motion.button>
                </div>

                <div className="flex-1 bg-gray-900 rounded-xl overflow-hidden shadow-lg">
                  <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <span className="text-gray-400 text-sm ml-3">example.js</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                      <Terminal className="w-3 h-3" />
                      <span>Interactive Code</span>
                    </div>
                  </div>

                  {/* Code Content */}
                  <div className="p-6 overflow-auto h-full">
                    <pre className="text-green-400 text-sm leading-relaxed font-mono">
                      <code>{module.code}</code>
                    </pre>
                  </div>
                </div>

                {/* Code Tips */}
                <div className="mt-4 bg-primary/5 rounded-lg p-4 border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">Pro Tip</span>
                  </div>
                  <p className="text-xs text-base-content/70">
                    Try running this code in your local environment to see it in action. 
                    Experiment with different values and observe the behavior.
                  </p>
                </div>
              </>
            ) : (
              /* No Code Available */
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-base-200 rounded-full p-6 mb-4 mx-auto w-fit">
                    <Code className="w-12 h-12 text-base-content/40" />
                  </div>
                  <h3 className="text-lg font-semibold text-base-content/60 mb-2">
                    No Code Example
                  </h3>
                  <p className="text-sm text-base-content/50 max-w-xs">
                    This module focuses on theoretical concepts. 
                    Code examples will be available in upcoming modules.
                  </p>
                  
                  {/* Placeholder Interactive Element */}
                  <div className="mt-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-6 border border-primary/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium text-primary">Interactive Learning</span>
                    </div>
                    <p className="text-xs text-base-content/70 mb-4">
                      Focus on understanding the concepts presented in the content. 
                      Hands-on coding will come in later modules.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-base-100 rounded p-2 text-center">
                        <div className="font-medium text-primary">Theory</div>
                        <div className="text-base-content/60">Current</div>
                      </div>
                      <div className="bg-base-100 rounded p-2 text-center opacity-50">
                        <div className="font-medium text-secondary">Practice</div>
                        <div className="text-base-content/60">Coming Up</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderQuiz = (quiz: Quiz) => {
    const totalQuestions = quiz.questions.length;
    const percentage = score !== null ? Math.round((score / totalQuestions) * 100) : 0;
    const passed = score !== null && score >= 11;
    
    return (
      <motion.div 
        key="final-quiz"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-base-100 rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Quiz Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Brain className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Final Assessment</h3>
                <p className="text-white/80 mt-1">
                  Complete your learning journey • Passing score: 11/{totalQuestions}
                </p>
              </div>
            </div>
            {isQuizSubmitted && score !== null && (
              <div className="bg-white/20 px-6 py-3 rounded-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold">{score}/{totalQuestions}</div>
                  <div className="text-sm text-white/80">Final Score</div>
                </div>
              </div>
            )}
          </div>
          
          {/* Assessment Status */}
          {isQuizSubmitted && (
            <div className="mt-6 flex items-center gap-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                passed ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'
              }`}>
                {passed ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span className="font-medium">
                  {passed ? 'Assessment Passed!' : 'Retake Required'}
                </span>
              </div>
              <div className="text-white/80 text-sm">
                Score: {percentage}% • {passed ? 'Congratulations!' : 'Minimum 73% required'}
              </div>
            </div>
          )}
        </div>

        <div className="p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {quiz.questions.map((q, qIdx) => {
              const selected = answers[qIdx] || "";
              const isCorrect = selected === q.correctAnswer;

              return (
                <motion.div 
                  key={qIdx} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: qIdx * 0.1 }}
                  className="bg-base-200/50 rounded-xl p-6 border border-base-content/10"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                      {qIdx + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg text-base-content mb-2">{q.question}</h4>
                      {isQuizSubmitted && (
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                          isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {isCorrect ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Target className="w-4 h-4" />
                          )}
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {q.options.map((opt, oIdx) => {
                      const id = `question-${qIdx}-option-${oIdx}`;
                      const isSelected = selected === opt;
                      const isCorrectOption = opt === q.correctAnswer;

                      let optionStyle = "border-base-content/20 hover:bg-base-200 hover:border-primary/30";
                      if (isQuizSubmitted) {
                        if (isCorrectOption) {
                          optionStyle = "bg-green-50 border-green-500 text-green-700";
                        } else if (isSelected && !isCorrectOption) {
                          optionStyle = "bg-red-50 border-red-500 text-red-700";
                        }
                      } else if (isSelected) {
                        optionStyle = "bg-primary/10 border-primary text-primary";
                      }

                      return (
                        <motion.label
                          key={oIdx}
                          htmlFor={id}
                          whileHover={{ scale: isQuizSubmitted ? 1 : 1.02 }}
                          whileTap={{ scale: isQuizSubmitted ? 1 : 0.98 }}
                          className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${optionStyle} ${
                            isQuizSubmitted ? 'cursor-default' : 'cursor-pointer'
                          }`}
                        >
                          <input
                            type="radio"
                            id={id}
                            name={`question-${qIdx}`}
                            value={opt}
                            checked={isSelected}
                            disabled={isQuizSubmitted}
                            onChange={() => handleOptionSelect(qIdx, opt)}
                            className="w-5 h-5 text-primary"
                          />
                          <span className="font-medium flex-1">{opt}</span>
                          {isQuizSubmitted && isCorrectOption && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                        </motion.label>
                      );
                    })}
                  </div>

                  {isQuizSubmitted && !isCorrect && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <div className="flex items-center gap-2 text-blue-700">
                        <Lightbulb className="w-4 h-4" />
                        <span className="font-medium">Correct answer: {q.correctAnswer}</span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}

            {/* Quiz Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-base-content/10">
              {!isQuizSubmitted ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={calculateScore}
                  className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all font-medium text-lg"
                >
                  <Trophy className="w-6 h-6" />
                  Submit Assessment
                </motion.button>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <Award className="w-6 h-6 text-primary" />
                      <div>
                        <div className="font-bold text-lg text-base-content">
                          Final Score: {score}/{totalQuestions}
                        </div>
                        <div className="text-sm text-base-content/60">
                          {percentage}% • {passed ? 'Passed' : 'Failed'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Retake Button - Only show if score < 11 */}
                  {!passed && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={shuffleQuestions}
                      className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Retake Assessment
                    </motion.button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  if (!skill) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-xl font-semibold text-red-600">Invalid route. No skill provided.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-base-content mb-2">
            Loading {skill} Learning Path
          </h2>
          <p className="text-base-content/60">Preparing your personalized content...</p>
        </motion.div>
      </div>
    );
  }

  if (!skillPath || contentItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-base-100 rounded-2xl shadow-xl p-12"
        >
          <BookOpen className="w-20 h-20 text-base-content/40 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-base-content mb-4">
            No Learning Path Found
          </h2>
          <p className="text-base-content/70 mb-8">
            We couldn't find a learning path for "{skill}". Please try another skill.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-focus transition-colors font-medium"
          >
            Go Back
          </motion.button>
        </motion.div>
      </div>
    );
  }
  const isCompleted = currentIndex >= contentItems.length && isQuizSubmitted && score !== null && score >= 11;

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-base-100 rounded-2xl shadow-xl p-12 max-w-2xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
          </motion.div>
          <h1 className="text-4xl font-bold text-base-content mb-4">
            🎉 Course Completed!
          </h1>
          <p className="text-xl text-base-content/70 mb-6">
            Congratulations! You've successfully mastered <strong className="text-primary">{skill}</strong>
          </p>
          
          <div className="bg-base-200/50 rounded-xl p-6 mb-8">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">7</div>
                <div className="text-sm text-base-content/60">Modules Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">{score}/15</div>
                <div className="text-sm text-base-content/60">Final Score</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">100%</div>
                <div className="text-sm text-base-content/60">Course Progress</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/practice')}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-focus transition-colors font-medium"
            >
              <Play className="w-5 h-5" />
              Practice Skills
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/learn')}
              className="flex items-center gap-2 px-8 py-3 border border-base-content/20 rounded-lg hover:bg-base-200 transition-colors font-medium"
            >
              <Sparkles className="w-5 h-5" />
              Explore More
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentItem = contentItems[currentIndex];
  const progress = ((currentIndex + 1) / contentItems.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-100 rounded-2xl shadow-xl overflow-hidden mb-8"
        >
          <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate(-1)}
                  className="p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </motion.button>
                <div>
                  <h1 className="text-3xl font-bold capitalize">{skill} Learning Hub</h1>
                  <p className="text-white/80 mt-1">
                    7 Modules • Final Assessment • Passing Score: 11/15
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm">Progress</p>
                <p className="text-2xl font-bold">{currentIndex + 1} / {contentItems.length}</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-6 bg-white/20 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-white rounded-full h-3 shadow-sm"
              />
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {currentItem?.type === 'module' ? 
            renderModule(currentItem.data as Module, currentItem.index) :
            renderQuiz(currentItem.data as Quiz)
          }
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mt-8 bg-base-100 rounded-2xl shadow-xl p-6"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-6 py-3 border border-base-content/20 rounded-lg hover:bg-base-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </motion.button>

          <div className="flex items-center gap-3 text-base-content/60">
            <span className="font-medium">{currentIndex + 1} of {contentItems.length}</span>
            <span>•</span>
            <span className="capitalize">
              {currentItem?.type === 'module' ? 'Module' : 'Final Assessment'}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: canProceed() ? 1.02 : 1 }}
            whileTap={{ scale: canProceed() ? 0.98 : 1 }}
            onClick={handleNext}
            disabled={currentIndex >= contentItems.length - 1 || !canProceed()}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-focus transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {currentIndex < contentItems.length - 1 ? "Next" : "Complete Course"}
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};


export default Hub;
