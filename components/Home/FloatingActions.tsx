"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart, Users, Share2, ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";

export default function FloatingActions() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          className="fixed right-6 bottom-6 flex flex-col gap-3 z-50"
        >
          <motion.button 
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-full glass-effect bg-white/80 flex items-center justify-center text-primary shadow-lg hover:bg-primary hover:text-white transition-colors group relative"
          >
            <Share2 className="w-5 h-5" />
            <span className="absolute right-full mr-4 bg-white px-3 py-1 rounded-md text-sm font-bold text-gray-700 shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Share
            </span>
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-full glass-effect bg-white/80 flex items-center justify-center text-orange shadow-lg hover:bg-orange hover:text-white transition-colors group relative"
          >
            <Users className="w-5 h-5" />
            <span className="absolute right-full mr-4 bg-white px-3 py-1 rounded-md text-sm font-bold text-gray-700 shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Volunteer
            </span>
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center text-white shadow-xl shadow-orange/30 group relative"
          >
            <Heart className="w-6 h-6 animate-pulse" />
            <span className="absolute right-full mr-4 bg-white px-3 py-1 rounded-md text-sm font-bold text-gray-700 shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Donate
            </span>
          </motion.button>
          
          <div className="h-[1px] w-8 bg-gray-200 mx-auto my-1"></div>

          <motion.button 
            onClick={scrollToTop}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-full bg-footer flex items-center justify-center text-white shadow-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
