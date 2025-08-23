import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Briefcase, Brain, Heart } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface QuizForm {
  name: string;
  education: string;
  skills: string[];
  interests: string[];
}

const groupedSkills = {
  "Programming & Data": [
    "Python",
    "SQL",
    "Machine Learning",
    "Statistics",
    "Data Visualization",
    "TensorFlow",
    "Deep Learning",
    "Data Structures",
    "Algorithms",
  ],
  "Web & Design": [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Photoshop",
    "Illustrator",
    "Typography",
    "Layout Design",
    "AutoCAD",
    "SketchUp",
  ],
  "Medical & Health": [
    "Biology",
    "Anatomy",
    "Medical Knowledge",
    "Pharmacology",
    "Diagnosis",
    "Surgery",
    "Exercise Techniques",
    "Nutrition",
  ],
  "Communication & Writing": [
    "Writing",
    "Editing",
    "Public Speaking",
    "Empathy",
    "Active Listening",
    "Counseling",
    "Argumentation",
  ],
  "Business & Marketing": [
    "SEO",
    "Content Strategy",
    "Sales",
    "Negotiation",
    "Market Research",
    "Finance",
    "Marketing",
  ],
  "Education & Social Work": [
    "Teaching",
    "Curriculum Design",
    "Community Outreach",
    "Event Planning",
    "Fundraising",
  ],
  "Security & Infrastructure": [
    "Networking",
    "Security Protocols",
    "Ethical Hacking",
    "Firewalls",
    "Monitoring Tools",
  ],
  Other: [
    "Leadership",
    "Critical Thinking",
    "Creativity",
    "Problem Solving",
    "Time Management",
    "Teamwork",
    "Cleanliness",
  ],
};

const groupedInterests = {
  "Technology & Innovation": ["Technology", "Science", "Design"],
  "Creative Fields": ["Art", "Writing", "Marketing"],
  "People & Society": ["Social Work", "Education", "Teaching"],
  "Business & Law": ["Business", "Finance", "Law"],
  "Health & Care": ["Healthcare", "Fitness", "Animals"],
  Environment: ["Environment"],
};

const CareerQuiz: React.FC = () => {
  const { register, handleSubmit, setValue } = useForm<QuizForm>();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [recommendations, setRecommendations] = React.useState<string | null>(
    null
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
    if (user?.name) {
      setValue("name", user.name);
    }
  }, [isAuthenticated, isLoading, navigate, setValue, user]);

  const onSubmit = async (data: QuizForm) => {
    setLoading(true);
    setRecommendations(null);

    // Normalize data before sending
    const normalizedData = {
      ...data,
      skills: (data.skills || []).map((s) => s.trim()).filter(Boolean),
      interests: (data.interests || []).map((i) => i.trim()).filter(Boolean),
      education: data.education.trim(),
      name: data.name.trim(),
    };

    try {
      const res = await fetch("http://localhost:5000/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalizedData),
      });

      const result = await res.json();
      setRecommendations(result.recommendations);
      localStorage.setItem("career_recommendations", result.recommendations);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setRecommendations("Error fetching recommendations.");
    }

    setLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center text-base-content/70">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"
          />
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-base-100 rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white">
            <h2 className="text-3xl font-bold">Career Discovery Quiz</h2>
            <p className="mt-2 text-white/80">
              Let's find the perfect career path for you
            </p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-base-content/70 mb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Name
                  </div>
                </label>
                <motion.input
                  whileFocus={{ scale: 1.005 }}
                  type="text"
                  {...register("name")}
                  readOnly
                  className="w-full px-4 py-2.5 bg-base-100 border border-base-content/20 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                />
              </div>

              {/* Education */}
              <div>
                <label className="block text-sm font-medium text-base-content/70 mb-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Education Level
                  </div>
                </label>
                <motion.select
                  whileFocus={{ scale: 1.005 }}
                  {...register("education", { required: true })}
                  className="w-full px-4 py-2.5 bg-base-100 border border-base-content/20 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                >
                  <option value="">Select your education level</option>
                  <option value="High School">High School</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Self-taught">Self-taught</option>
                </motion.select>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-base-content/70 mb-2">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Select Your Skills
                  </div>
                </label>
                {Object.entries(groupedSkills).map(([category, skills]) => (
                  <div key={category} className="mb-4">
                    <p className="font-semibold text-base-content/80 mb-1">
                      {category}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {skills.map((skill) => (
                        <label
                          key={skill}
                          className="relative flex items-center gap-2 p-3 rounded-lg border border-base-content/20 hover:bg-base-200 transition-colors cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            value={skill}
                            {...register("skills")}
                            className="w-4 h-4 rounded border-base-content/20 text-primary focus:ring-primary/20"
                          />
                          <span className="text-base-content">{skill}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-medium text-base-content/70 mb-2">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Select Your Interests
                  </div>
                </label>
                {Object.entries(groupedInterests).map(
                  ([category, interests]) => (
                    <div key={category} className="mb-4">
                      <p className="font-semibold text-base-content/80 mb-1">
                        {category}
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {interests.map((interest) => (
                          <label
                            key={interest}
                            className="relative flex items-center gap-2 p-3 rounded-lg border border-base-content/20 hover:bg-base-200 transition-colors cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              value={interest}
                              {...register("interests")}
                              className="w-4 h-4 rounded border-base-content/20 text-primary focus:ring-primary/20"
                            />
                            <span className="text-base-content">
                              {interest}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white font-medium py-3 rounded-lg shadow-md transition disabled:opacity-50 mt-8"
              >
                {loading ? (
                  <span className="inline-flex items-center justify-center">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Analyzing Your Profile...
                  </span>
                ) : (
                  "Get Career Suggestions"
                )}
              </motion.button>
            </form>

            <AnimatePresence>
              {recommendations && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-8 bg-base-200 rounded-xl p-6"
                >
                  <h3 className="text-xl font-bold text-base-content mb-4">
                    Your Career Recommendations
                  </h3>
                  <div className="prose prose-sm max-w-none text-base-content/80 whitespace-pre-wrap">
                    <ReactMarkdown>{recommendations}</ReactMarkdown>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CareerQuiz;