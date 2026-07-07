"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, ArrowRight } from "lucide-react";

const stats = [
  {
    id: 1,
    number: "25,000+",
    label: "Lives Touched",
    colorStart: "#22c55e", 
    colorEnd: "#eab308",   
    glow: "rgba(34,197,94,0.4)"
  },
  {
    id: 2,
    number: "120+",
    label: "Education Centers",
    colorStart: "#22c55e",
    colorEnd: "#eab308",
    glow: "rgba(34,197,94,0.4)"
  },
  {
    id: 3,
    number: "50+",
    label: "Health Camps",
    colorStart: "#16a34a",
    colorEnd: "#22c55e",
    glow: "rgba(22,163,74,0.4)"
  },
  {
    id: 4,
    number: "500+",
    label: "Active Volunteers",
    colorStart: "#f97316", 
    colorEnd: "#eab308",   
    glow: "rgba(249,115,22,0.4)"
  }
];

export default function Impact() {
  return (
    // CHANGED: Removed min-h-[450px], changed py-20 to pt-12 pb-24
    <section className="relative pt-12 pb-24 bg-[#060906] overflow-hidden flex items-center">
      
      {/* Background Image with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/image.png" 
          alt="Impact Background"
          fill
          className="object-cover opacity-30 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060906] via-[#060906]/90 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* --- LEFT: Text Content --- */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 flex flex-col items-start"
          >
            <span className="text-gray-300 font-bold tracking-[0.2em] uppercase text-[10px] mb-3 block">
              OUR IMPACT
            </span>
            
            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4 flex flex-col items-start gap-1">
              Small Acts,
              <span className="text-green-500 relative">
                Big Change
                <svg width="40" height="8" viewBox="0 0 40 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -bottom-2 left-0">
                  <path d="M2 6C6.5 6 9.5 2 14 2C18.5 2 21.5 6 26 6C30.5 6 33.5 2 38 2" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </h2>
            
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-6 mt-2">
              Every contribution counts. Together, we are building stronger communities and transforming lives.
            </p>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all"
            >
              See Our Impact 
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>

          {/* --- RIGHT: Circular Stats --- */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 relative z-20">
            {stats.map((stat, index) => (
              <motion.div 
                key={stat.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative w-full aspect-square max-w-[150px] mx-auto flex flex-col items-center justify-center text-center"
              >
                {/* SVG Progress Ring */}
                <svg className="absolute inset-0 w-full h-full transform -rotate-90 drop-shadow-xl" style={{ filter: `drop-shadow(0 0 8px ${stat.glow})`}}>
                  <defs>
                    <linearGradient id={`grad-${stat.id}`} x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={stat.colorStart} />
                      <stop offset="100%" stopColor={stat.colorEnd} />
                    </linearGradient>
                  </defs>
                  
                  <circle 
                    cx="50%" cy="50%" r="46%" 
                    fill="none" 
                    stroke="rgba(255,255,255,0.05)" 
                    strokeWidth="2" 
                  />
                  
                  <motion.circle
                    cx="50%" cy="50%" r="46%"
                    fill="none"
                    stroke={`url(#grad-${stat.id})`}
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 0.75 }} 
                    viewport={{ once: true }}
                    transition={{ duration: 2, ease: "easeOut", delay: index * 0.2 }}
                  />
                </svg>

                {/* Inner Text */}
                <div className="relative z-10 px-2 mt-2">
                  <h4 className="text-xl md:text-2xl font-bold text-white mb-1">{stat.number}</h4>
                  <p className="text-[9px] md:text-[10px] text-gray-400 font-medium leading-tight">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>

      {/* --- BOTTOM: Glowing Wave & Heart Center --- */}
      <div className="absolute bottom-0 left-0 w-full flex justify-center items-end pointer-events-none z-10 overflow-hidden h-20">
        
        {/* Animated Sine Wave Left */}
        <motion.svg 
          animate={{ x: [-20, 0, -20] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-4 left-0 w-1/2 h-14 opacity-40" preserveAspectRatio="none" viewBox="0 0 100 20"
        >
          <path d="M0 10 Q 25 20 50 10 T 100 10" fill="none" stroke="#22c55e" strokeWidth="0.5" />
          <path d="M0 12 Q 25 22 50 12 T 100 12" fill="none" stroke="#eab308" strokeWidth="0.2" opacity="0.5" />
        </motion.svg>

        {/* Animated Sine Wave Right */}
        <motion.svg 
          animate={{ x: [20, 0, 20] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-4 right-0 w-1/2 h-14 opacity-40" preserveAspectRatio="none" viewBox="0 0 100 20"
        >
          <path d="M0 10 Q 25 0 50 10 T 100 10" fill="none" stroke="#22c55e" strokeWidth="0.5" />
          <path d="M0 8 Q 25 -2 50 8 T 100 8" fill="none" stroke="#eab308" strokeWidth="0.2" opacity="0.5" />
        </motion.svg>

        {/* Center Glowing Heart */}
        <div className="relative bottom-4 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-[#111c11] border border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.5)]">
          <Heart className="w-4 h-4 text-white fill-white" />
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-green-500/20"
          />
        </div>

      </div>
    </section>
  );
}