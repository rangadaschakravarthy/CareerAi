import React from "react";
import { motion } from "framer-motion";

interface Props {
  categories: string[];
  selected: string;
  setSelected: (val: string) => void;
}

const CategoryFilter: React.FC<Props> = ({ categories, selected, setSelected }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-wrap justify-center gap-2 mt-6"
    >
      {categories.map((category) => (
        <motion.button
          key={category}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelected(category)}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
            selected === category
              ? "bg-primary text-white shadow-md"
              : "bg-base-100 text-base-content/70 hover:bg-base-200 hover:shadow"
          }`}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </motion.button>
      ))}
    </motion.div>
  );
};

export default CategoryFilter;
