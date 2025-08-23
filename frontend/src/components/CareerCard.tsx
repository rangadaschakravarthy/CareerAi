import React from "react";
import {
  BadgeCheck,
  TrendingUp,
  DollarSign,
  GraduationCap,
} from "lucide-react";
import { motion } from "framer-motion";
import type { Career } from "./CareerExplorer";

interface Props {
  career: Career;
  onLearnMore: () => void;
}

const CareerCard: React.FC<Props> = ({ career,onLearnMore }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className="bg-base-100 rounded-2xl shadow-lg overflow-hidden border border-base-content/5 transition-shadow hover:shadow-xl"
    >
      <div className="relative">
        <img
          src={career.image}
          alt={career.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 bg-base-100/90 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-lg">
          <BadgeCheck className="w-4 h-4 text-success" />
          {career.matchScore}% Match
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-xl font-bold mb-2">{career.title}</h2>
        <p className="text-base-content/70 text-sm mb-4">
          {career.description}
        </p>

        <div className="space-y-2 text-sm text-base-content/70">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            {career.salary}
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-success" />
            {career.growth} Growth
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-primary" />
            {career.education}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Key Skills:</p>
          <div className="flex flex-wrap gap-2">
            {career.skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <motion.button
          onClick={onLearnMore}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-6 w-full bg-gradient-to-r from-primary to-primary-focus text-white py-3 rounded-lg font-medium hover:opacity-90 transition-all shadow-md hover:shadow-lg"
        >
          Learn More
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CareerCard;
