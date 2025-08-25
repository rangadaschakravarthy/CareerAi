import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CareerCard from "./CareerCard";
import CareerSearchBar from "./CareerSearchBar";
import CategoryFilter from "./CategoryFilter";

export interface Career {
  id: number;
  title: string;
  category: string;
  matchScore: number;
  salary: string;
  growth: string;
  education: string;
  description: string;
  skills: string[];
  image: string;
}

const CareerExplorer: React.FC = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const res = await fetch("https://careerai-885x.onrender.com/api/careers");
        const data = await res.json();
        setCareers(data);
      } catch (error) {
        console.error("Failed to load careers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCareers();
  }, []);

  const filteredCareers = careers.filter((career) => {
    const matchesSearch =
      career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      career.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || career.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...Array.from(new Set(careers.map((c) => c.category)))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
          <p className="text-lg">Discovering Career Opportunities...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-base-100 to-base-200">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">Explore Your Future Career</h1>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto mb-12">
            Discover opportunities that match your skills and aspirations
          </p>

          <CareerSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            setSelected={setSelectedCategory}
          />
        </motion.div>

        <AnimatePresence>
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCareers.map((career) => (
              <CareerCard
                key={career.id}
                career={career}
                onLearnMore={() => navigate(`/learn/${encodeURIComponent(career.title)}`)}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredCareers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-lg text-base-content/70">
              No careers found matching your search criteria.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CareerExplorer;

