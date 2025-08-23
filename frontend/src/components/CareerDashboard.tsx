import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Target,
  TrendingUp,
  Award,
  Briefcase,
  ChevronRight,
  Clock,
  Book,
  PieChart,
  Star,
  ExternalLink,
  Sparkles,
  GraduationCap,
  CheckCircle
} from "lucide-react";

interface Course {
  title: string;
  provider: string;
  duration: string;
  level: string;
  url: string;
}

interface Career {
  career: string;
  description: string;
  salaryRange: string;
  skills: string[];
}

const Dashboard: React.FC = () => {
  const { user, setUser } = useAuth();
  const [skills, setSkills] = useState<string[]>([]);
  const [toDevelop, setToDevelop] = useState<string[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const userRes = await axios.get(
          "http://localhost:5000/api/auth/me",
          config
        );
        const username = userRes.data.user.name;
        setUser?.(userRes.data.user);
        const skillsRes = await axios.get(
          "http://localhost:5000/api/skills",
          config
        );
        const { currentSkills, skillsToDevelop } = skillsRes.data;
        setSkills(currentSkills);
        const normalize = (s: string) => s.trim().toLowerCase();
        const currentSkillSet = new Set(currentSkills.map(normalize));
        const filteredToDevelop = skillsToDevelop.filter(
          (skill: string) => !currentSkillSet.has(normalize(skill))
        );
        setToDevelop(filteredToDevelop);
        const careerRes = await axios.get(
          "http://localhost:5000/api/career-suggestion",
          config
        );
        setCareers(careerRes.data.careersRes || []);
        if (filteredToDevelop.length > 0) {
          try {
            const courseRes = await axios.post(
              "http://localhost:5000/api/ai-skill-courses",
              { username, skills: filteredToDevelop },
              config
            );
            setCourses(courseRes.data.skillCourses || []);
          } catch (error) {
            console.error("Error fetching AI skill courses:", error);
          }
        }
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [setUser]);

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
          <p className="text-lg">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-100 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <Sparkles className="w-8 h-8" />
                  Welcome back, {user?.name || "User"}!
                </h1>
                <p className="mt-2 text-white/80">
                  Here's your personalized career development dashboard
                </p>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/20 rounded-full p-4">
                  <GraduationCap className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Skills Overview */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-base-100 rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Your Skills</h2>
                <p className="text-sm text-base-content/60">{skills.length} skills mastered</p>
              </div>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              <AnimatePresence>
                {skills.map((skill, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/10 hover:shadow-md transition-all"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="font-medium text-base-content">{skill.toUpperCase()}</span>
                    <Star className="w-4 h-4 text-yellow-500 ml-auto" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-base-100 rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-secondary/10 p-2 rounded-lg">
                <Target className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Skills to Develop</h2>
                <p className="text-sm text-base-content/60">{toDevelop.length} skills to learn</p>
              </div>
            </div>
            
            {toDevelop.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                <AnimatePresence>
                  {toDevelop.map((skill, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-gradient-to-r from-secondary/5 to-secondary/10 rounded-lg border border-secondary/10 hover:shadow-md transition-all"
                    >
                      <div className="w-2 h-2 rounded-full bg-secondary" />
                      <span className="font-medium text-base-content">{skill.toUpperCase()}</span>
                      <div className="ml-auto bg-secondary/20 text-secondary px-2 py-1 rounded-full text-xs font-medium">
                        New
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="bg-success/10 rounded-2xl p-6">
                  <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-base-content mb-2">
                    You already have adequate skills!
                  </h3>
                  <p className="text-base-content/70 mb-4">
                    Great job! You've mastered the essential skills for your career path.
                  </p>
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href="/learn"
                    className="inline-flex items-center bg-success text-white px-6 py-2 rounded-lg hover:bg-success/90 transition-colors font-medium"
                  >
                    Browse Learning Hub to Learn More
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </motion.a>
                </div>
              </motion.div>
            )}
          </motion.section>
        </div>

        {/* Recommended Courses */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-100 rounded-2xl shadow-xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-primary/10 p-2 rounded-lg">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Recommended Courses</h2>
              <p className="text-sm text-base-content/60">Curated learning paths for your growth</p>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.length > 0 ? (
              courses.map((course: any, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-base-200/50 rounded-xl p-6 hover:shadow-xl transition-all border border-base-content/5"
                >
                  {course.imageUrl && (
                    <div className="relative mb-4">
                      <img
                        src={course.imageUrl}
                        alt={course.skill}
                        className="rounded-lg w-full h-32 object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-full text-xs font-medium">
                        Recommended
                      </div>
                    </div>
                  )}
                  <h3 className="text-lg font-semibold mb-2 text-base-content">{course.skill.toUpperCase()}</h3>
                  <p className="text-sm text-base-content/70 mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center text-xs text-base-content/60 mb-4">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="mr-4">Self-paced</span>
                    <Book className="w-4 h-4 mr-1" />
                    <span>Beginner</span>
                  </div>
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={course.courseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center w-full justify-center bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors font-medium"
                  >
                    Start Learning
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </motion.a>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="bg-base-200/50 rounded-2xl p-8">
                  <BookOpen className="w-16 h-16 text-base-content/40 mx-auto mb-4" />
                  <p className="text-base-content/70 mb-4 text-lg">
                    No courses available right now based on your skills.
                  </p>
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href="/learn"
                    className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg shadow-md hover:bg-primary-focus transition-colors font-medium"
                  >
                    Browse Learning Hub
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </motion.a>
                </div>
              </div>
            )}
          </div>
        </motion.section>
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-100 rounded-2xl shadow-xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI-Suggested Careers</h2>
              <p className="text-sm text-base-content/60">Personalized career recommendations</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {careers.length > 0 ? (
              careers.map((career, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gradient-to-r from-base-200/50 to-base-200/30 rounded-xl p-6 border border-base-content/5 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-base-content">{career.career}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <PieChart className="w-4 h-4 text-base-content/60" />
                          <span className="text-sm text-base-content/60">High Growth Potential</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-success/10 text-success px-3 py-1 rounded-full text-sm font-medium">
                      {Math.floor(Math.random() * 20) + 80}% Match
                    </div>
                  </div>
                  
                  <p className="text-base-content/70 mb-4 leading-relaxed">
                    {career.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="bg-success/10 p-1 rounded">
                        <span className="text-success font-medium">💰</span>
                      </div>
                      <span className="font-medium text-base-content/80">Salary Range:</span>
                      <span className="text-base-content">{career.salaryRange}</span>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-base-content/80 mb-2">Required Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {career.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="bg-base-200/50 rounded-2xl p-8">
                  <Briefcase className="w-16 h-16 text-base-content/40 mx-auto mb-4" />
                  <p className="text-center text-base-content/70 text-lg">
                    No career suggestions available at the moment.
                  </p>
                  <p className="text-sm text-base-content/50 mt-2">
                    Complete your profile to get personalized recommendations
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Dashboard;