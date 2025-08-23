import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";

interface Career {
  career: string;
  description: string;
  salaryRange: string;
  skills: string[];
}

interface Course {
  skill: string;
  description: string;
  imageUrl: string;
  courseUrl: string;
}

const LearningHub = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<string[]>([]);
  const [career, setCareer] = useState<Career[]>([]);
  const [recommendedSkills, setRecommendedSkills] = useState<string[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Fetch user
        const userRes = await axios.get(
          "http://localhost:5000/api/auth/me",
          config
        );
        const username = userRes.data.user.name;
        setUser?.(userRes.data.user);

        // Fetch skills
        const skillsRes = await axios.get(
          "http://localhost:5000/api/skills",
          config
        );
        const { currentSkills } = skillsRes.data;
        setSkills(currentSkills);

        // Fetch career suggestion
        const careerRes = await axios.get(
          "http://localhost:5000/api/career-suggestion",
          config
        );
        const careersData = careerRes.data.careersRes || [];
        setCareer(careersData);

        // Recommended skills = career-required skills - current skills
        if (careersData.length > 0) {
          const normalize = (s: string) => s.trim().toLowerCase();
          const known = new Set(currentSkills.map(normalize));
          const careerSkills = careersData[0].skills || [];
          const filtered = careerSkills.filter(
            (skill: string) => !known.has(normalize(skill))
          );
          setRecommendedSkills(filtered);

          // Fetch recommended courses for missing skills
          if (filtered.length > 0) {
            const courseRes = await axios.post(
              "http://localhost:5000/api/ai-skill-courses",
              { username, skills: filtered },
              config
            );
            setCourses(courseRes.data.skillCourses || []);
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

  if (loading)
    return (
      <div className="p-6 text-center text-lg">
        Loading your learning hub...
      </div>
    );

  return (
    <div className="p-6 space-y-12">
      <h1 className="text-2xl font-bold">
        Hi {user?.name || "there"}, ready to grow as a{" "}
        {career[0]?.career || "professional"}?
      </h1>

      {/* Recommended Courses */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-base-100 rounded-2xl shadow p-6"
      >
        <h2 className="text-xl font-bold mb-4">Recommended Courses</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.length > 0 ? (
            courses.map((course, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-base-200 p-4 rounded-lg shadow"
              >
                <h3 className="text-lg font-semibold mb-2">
                  {course.skill.toUpperCase()}
                </h3>
                <a
                  href={`/course/${course.skill.toLowerCase()}`}
                  className="inline-block mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-focus"
                >
                  Start Learning
                </a>
              </motion.div>
            ))
          ) : (
            <p className="text-base-content/70 col-span-full">
              No recommended courses at the moment.
            </p>
          )}
        </div>
      </motion.section>

      {/* Current Skills */}
      {/* <section>
        <h2 className="text-xl font-bold mb-4">Your Current Skills</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {skills.map((skill) => (
            <div
              key={skill}
              className="bg-base-100 rounded-xl p-4 shadow border border-base-content/10"
            >
              <h3 className="text-lg font-semibold mb-2">
                {skill.toUpperCase()}
              </h3>
              <input
                type="range"
                min="0"
                max="100"
                value={progress[skill] || 0}
                onChange={(e) =>
                  handleProgressChange(skill, Number(e.target.value))
                }
                className="w-full"
              />
              <div className="text-right text-sm text-gray-500">
                {progress[skill] || 0}%
              </div>
            </div>
          ))}
        </div>
      </section> */}

      {/* Recommended Skills from Career */}
    </div>
  );
};

export default LearningHub;
