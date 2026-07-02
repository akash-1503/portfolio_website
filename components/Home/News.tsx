"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

// Updated data to perfectly match the text in the provided image
const news = [
  {
    id: 1,
    title: "Free Health Camp Organized in Rural Area",
    date: "01 May 2024",
    image: "/image.png", // Replace with your actual image path
    desc: "We organized a free health camp benefiting over 500 villagers."
  },
  {
    id: 2,
    title: "New Education Center Inaugurated",
    date: "20 Apr 2024",
    image: "/image.png",
    desc: "A new step towards providing quality education to every child."
  },
  {
    id: 3,
    title: "Clothing Distribution Drive",
    date: "10 Apr 2024",
    image: "/image.png",
    desc: "Distributed clothes to 300+ underprivileged families."
  }
];

export default function News() {
  return (
    <section id="media" className="relative py-24 bg-[#fafafa] overflow-hidden">
      
      {/* Background Decorative Faint Waves (Matches the faint background lines in image) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-40">
        <svg className="absolute top-20 left-0 w-1/3 h-64" viewBox="0 0 200 100" fill="none">
          <path d="M-50 50 Q 50 100 150 50 T 350 50" stroke="#e5e7eb" strokeWidth="1" />
          <path d="M-50 70 Q 50 120 150 70 T 350 70" stroke="#e5e7eb" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 max-w-7xl">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-green-600 font-extrabold tracking-widest uppercase text-[10px] mb-2 block"
            >
              LATEST STORIES
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-[2.5rem] font-extrabold text-gray-900"
            >
              News & Updates
            </motion.h2>
          </div>
          
          {/* View All News Button */}
          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="hidden md:flex items-center justify-center px-6 py-2.5 rounded-full border border-gray-200 text-green-700 font-semibold text-sm hover:bg-green-50 transition-colors shadow-sm"
          >
            View All News
          </motion.button>
        </div>

        {/* --- HORIZONTAL CARDS GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {news.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-white rounded-[1.5rem] p-3 flex flex-row items-stretch gap-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer h-[180px]"
            >
              
              {/* Left Side: Image */}
              <div className="relative w-[45%] h-full rounded-[1rem] overflow-hidden shrink-0">
                <Image 
                  src={item.image} 
                  alt={item.title} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              
              {/* Right Side: Content */}
              <div className="py-2 pr-2 flex flex-col flex-grow">
                {/* Date */}
                <span className="text-[11px] text-gray-500 font-medium mb-1.5 block">
                  {item.date}
                </span>
                
                {/* Title */}
                <h3 className="text-[14px] leading-tight font-extrabold text-gray-900 mb-2 line-clamp-3 group-hover:text-green-600 transition-colors">
                  {item.title}
                </h3>
                
                {/* Description */}
                <p className="text-[12px] text-gray-500 leading-snug line-clamp-3 mb-2">
                  {item.desc}
                </p>
                
                {/* Read More Link */}
                <button 
                  suppressHydrationWarning
                  className="mt-auto text-[13px] font-bold text-green-600 flex items-center gap-1 group-hover:gap-2 transition-all self-start"
                >
                  Read More 
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3px]" />
                </button>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Mobile View All News Button (Shows only on small screens) */}
        <motion.button 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:hidden mt-8 w-full flex items-center justify-center px-6 py-3 rounded-full border border-gray-200 text-green-700 font-semibold text-sm hover:bg-green-50 transition-colors shadow-sm"
        >
          View All News
        </motion.button>

      </div>
    </section>
  );
}