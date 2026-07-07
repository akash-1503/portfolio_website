"use client";

import { motion } from "framer-motion";
import { HeartHandshake, HandHeart, Megaphone, Gift, ArrowRight } from "lucide-react";

const ways = [
  {
    id: 1,
    title: "Donate",
    desc: "Your donation helps us continue our mission and reach more lives.",
    icon: HeartHandshake,
    themeColor: "text-green-600",
    glowColor: "bg-green-500",
    btnColor: "bg-green-600 hover:bg-green-700"
  },
  {
    id: 2,
    title: "Volunteer",
    desc: "Join our team of volunteers and contribute your time and skills.",
    icon: HandHeart,
    themeColor: "text-[#f97316]", 
    glowColor: "bg-orange-500",
    btnColor: "bg-[#f97316] hover:bg-orange-600"
  },
  {
    id: 3,
    title: "Raise Awareness",
    desc: "Share our mission and help us spread the word in your community.",
    icon: Megaphone,
    themeColor: "text-green-600",
    glowColor: "bg-green-500",
    btnColor: "bg-green-600 hover:bg-green-700"
  },
  {
    id: 4,
    title: "Corporate Partnership",
    desc: "Partner with us to create a lasting impact through CSR initiatives.",
    icon: Gift,
    themeColor: "text-[#f97316]", 
    glowColor: "bg-orange-500",
    btnColor: "bg-[#f97316] hover:bg-orange-600"
  }
];

export default function GetInvolved() {
  return (
    <section id="involved" className="relative py-24 bg-[#fafafa] overflow-hidden">
      
      {/* --- ANIMATED CRAFT 1: Left Yellow Airplane & Loop --- */}
      <div className="absolute top-20 left-0 w-64 h-full pointer-events-none z-0 hidden lg:block">
        {/* Faint green scribbles (Top Left) */}
        <motion.svg 
          animate={{ rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-16 w-12 h-12 opacity-40 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M12 4.5C12 4.5 10 2 7 2C3 2 2 6 2 9C2 13 12 21 12 21C12 21 22 13 22 9C22 6 21 2 17 2C14 2 12 4.5 12 4.5Z" strokeDasharray="2 2"/>
        </motion.svg>

        {/* Yellow Dotted Trail */}
        <svg className="absolute top-28 -left-10 w-48 h-64 opacity-50" viewBox="0 0 100 150">
          <path 
            d="M 100 10 C 50 10, 10 50, 20 100 C 30 140, 80 140, 70 90 C 60 50, 10 50, 0 80" 
            fill="none" 
            stroke="#eab308" 
            strokeWidth="1.5" 
            strokeDasharray="4 4" 
          />
        </svg>

        {/* Flying Yellow Airplane */}
        <motion.div
          animate={{ y: [0, -10, 0], x: [0, 5, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-24 left-16"
        >
          <svg width="35" height="35" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md transform -rotate-12">
            <path d="M21.5 2.5L2 10.5L9.5 13.5L21.5 2.5Z" fill="#FDE047" stroke="#EAB308" strokeWidth="0.5"/>
            <path d="M21.5 2.5L14.5 22L9.5 13.5L21.5 2.5Z" fill="#FACC15" stroke="#EAB308" strokeWidth="0.5"/>
            <path d="M21.5 2.5L9.5 13.5L9.5 19L12 16Z" fill="#EAB308"/>
          </svg>
        </motion.div>
      </div>

      {/* --- ANIMATED CRAFT 2: Right White Airplane & Loop --- */}
      <div className="absolute top-10 right-0 w-64 h-full pointer-events-none z-0 hidden lg:block">
        
        {/* Gray Dotted Trail */}
        <svg className="absolute top-16 right-0 w-48 h-96 opacity-40" viewBox="0 0 100 200">
          <path 
            d="M 10 10 C 60 30, 90 80, 80 130 C 70 170, 20 170, 30 120 C 40 80, 90 80, 100 110" 
            fill="none" 
            stroke="#9ca3af" 
            strokeWidth="1.5" 
            strokeDasharray="4 4" 
          />
        </svg>

        {/* UPDATED: Flying White 3D Airplane (Same shape as the yellow one) */}
        <motion.div
          animate={{ y: [0, 10, 0], x: [0, -5, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 right-20"
        >
          <svg width="35" height="35" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md transform rotate-45">
            {/* Top pure white fold */}
            <path d="M21.5 2.5L2 10.5L9.5 13.5L21.5 2.5Z" fill="#ffffff" stroke="#d1d5db" strokeWidth="0.5"/>
            {/* Off-white main body */}
            <path d="M21.5 2.5L14.5 22L9.5 13.5L21.5 2.5Z" fill="#f9fafb" stroke="#d1d5db" strokeWidth="0.5"/>
            {/* Light gray bottom shadow fold */}
            <path d="M21.5 2.5L9.5 13.5L9.5 19L12 16Z" fill="#e5e7eb"/>
          </svg>
        </motion.div>

        {/* Small Yellow/Green block bottom right */}
        <div className="absolute bottom-40 right-10">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-12 opacity-80">
            <rect x="4" y="4" width="8" height="12" fill="#FACC15" />
            <rect x="12" y="8" width="8" height="12" fill="#22C55E" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 max-w-7xl">
        
        {/* --- SECTION HEADER --- */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-green-600 font-extrabold tracking-[0.2em] uppercase text-[10px] mb-2 block"
          >
            GET INVOLVED
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-[2.5rem] font-extrabold text-gray-900 flex flex-col items-center gap-1"
          >
            Be a Part of the Change
            {/* Small green wavy underline */}
            <svg width="40" height="8" viewBox="0 0 40 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-1">
              <path d="M2 6C6.5 6 9.5 2 14 2C18.5 2 21.5 6 26 6C30.5 6 33.5 2 38 2" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.h2>
        </div>

        {/* --- CARDS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ways.map((way, index) => (
            <motion.div
              key={way.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-[2rem] p-8 text-center group hover:-translate-y-2 transition-transform duration-300 shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col items-center h-full"
            >
              
              {/* Icon with Ground Glow Effect */}
              <div className="relative mb-6 mt-4">
                <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-3 blur-md opacity-40 rounded-full ${way.glowColor} group-hover:scale-110 transition-transform`}></div>
                <way.icon className={`w-12 h-12 relative z-10 ${way.themeColor} group-hover:scale-110 transition-transform duration-300`} strokeWidth={1.5} />
              </div>
              
              {/* Content */}
              <div className="flex flex-col flex-grow items-center">
                <h3 className="text-[1.15rem] font-bold text-gray-900 mb-3">{way.title}</h3>
                <p className="text-gray-500 text-[13px] leading-relaxed max-w-[200px] mx-auto mb-8 flex-grow">
                  {way.desc}
                </p>
                
                {/* Solid Circular Button with White Arrow */}
                <button className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors mt-auto ${way.btnColor}`}>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
                </button>
              </div>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}