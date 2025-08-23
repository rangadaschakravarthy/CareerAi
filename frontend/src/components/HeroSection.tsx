import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className='bg-base-100 text-base-content'>
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-primary-100/30 to-transparent dark:from-primary-900/20" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-base-100 text-base-content rounded-full filter blur-3xl opacity-50" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-base-100 text-base-content rounded-full filter blur-3xl opacity-50" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-base-100 text-base-content text-sm font-medium mb-6">
              <Sparkles size={18} className="mr-2" />
              AI-Powered Career Guidance
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-base-100 text-base-content leading-tight mb-6">
              Discover Your
              <span className="text-primary-600 dark:text-primary-400"> Perfect Career</span> Path
            </h1>

            <p className="text-lg sm:text-xl text-base-content mb-8 max-w-xl mx-auto md:mx-0">
              Personalized insights using advanced AI to match your strengths and ambitions with ideal careers. Navigate your journey with confidence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/quiz" className="px-6 py-3 bg-base-100 text-base-content rounded-lg hover:bg-primary-700 transition text-base font-medium inline-flex items-center justify-center shadow-lg">
                Take Career Quiz
                <ArrowRight size={18} className="ml-2" />
              </Link>
              <Link to="/careers" className="px-6 py-3 border border-gray-300 bg-base-100 text-base-content rounded-lg hover:bg-gray-100 transition text-base font-medium inline-flex items-center justify-center">
                Explore Careers
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center md:justify-start space-x-4">
              <div className="flex -space-x-2">
                {[
                  "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=40",
                  "https://images.pexels.com/photos/2726111/pexels-photo-2726111.jpeg?auto=compress&cs=tinysrgb&w=40",
                  "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=40",
                  "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=40"
                ].map((img, i) => (
                  <img key={i} src={img} alt={`User ${i + 1}`} className="w-9 h-9 rounded-full border-2 border-white dark:border-gray-800 object-cover" />
                ))}
                <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-medium text-blue-700 dark:text-blue-300">
                  +2k
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <strong>2,000+</strong> career paths discovered
              </div>
            </div>
          </motion.div>

          {/* Hero image and cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-xl overflow-hidden shadow-xl">
              <img
                src="https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg?auto=compress&cs=tinysrgb&w=1000"
                alt="Career consultation"
                className="w-full h-auto object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/10 to-transparent" />
            </div>

            {/* Floating cards */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md max-w-[160px]">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center font-bold text-blue-700 dark:text-blue-300">
                    95%
                  </div>
                  <div className="text-xs">
                    <p className="font-medium text-gray-900 dark:text-white">Match Score</p>
                    <p className="text-gray-500 dark:text-gray-400">Data Science</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md max-w-[160px]">
                <p className="text-xs font-medium text-gray-900 dark:text-white">AI Pick</p>
                <div className="flex items-center mt-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  <span className="text-green-700 dark:text-green-400 text-xs">High Growth</span>
                </div>
              </div>
            </div>

            {/* Stats badge */}
            <div className="absolute -bottom-6 md:-right-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Career Paths</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">2,000+</p>
                </div>
                <div className="h-10 border-l border-gray-300 dark:border-gray-600"></div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Success Rate</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">94%</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default HeroSection;
