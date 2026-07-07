"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, Leaf, ArrowRight, Users } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-24 bg-white overflow-visible">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* --- LEFT: Image & Floating Badges (5 Columns) --- */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative flex justify-center lg:justify-start py-8"
          >
            {/* Organic Light Green Background Blob */}
            <div className="absolute top-4 left-0 md:left-8 w-[85%] h-[95%] bg-[#f0f8f1] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] -z-10 transform -rotate-6"></div>

            {/* Main Circular Image */}
            <div className="relative w-[320px] h-[320px] md:w-[380px] md:h-[380px] rounded-full overflow-hidden border-[6px] border-white shadow-xl z-10">
              <Image 
                src="/hands-family.png" // Replace with your actual image path
                alt="Compassionate hands holding paper family"
                fill
                className="object-cover"
              />
            </div>

            {/* Floating Top Left Badge (Green Heart) */}
            <motion.div 
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 -left-2 md:left-6 w-16 h-16 bg-green-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg z-20"
            >
              <Heart className="w-7 h-7 text-white fill-white" />
            </motion.div>

            {/* Floating Bottom Left Badge (Orange Leaf) */}
            <motion.div 
              animate={{ y: [5, -5, 5] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-16 -left-2 md:left-10 w-16 h-16 bg-gradient-to-tr from-orange-500 to-orange-400 rounded-full flex items-center justify-center border-4 border-white shadow-lg z-20"
            >
              <Leaf className="w-7 h-7 text-white fill-white" />
            </motion.div>

            {/* Decorative Dotted Arc (Bottom Right) */}
            <svg 
              className="absolute -bottom-2 right-10 md:right-16 w-24 h-24 text-green-600 z-0" 
              viewBox="0 0 100 100"
            >
              <path 
                d="M 10 90 A 80 80 0 0 0 90 10" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="4" 
                strokeDasharray="1 8" 
                strokeLinecap="round"
              />
            </svg>
          </motion.div>

          {/* --- MIDDLE: Text Content (4 Columns) --- */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4 flex flex-col gap-5 px-4 lg:px-0"
          >
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-[2.5rem] font-extrabold text-gray-900 leading-[1.2]">
                Driven by Compassion.<br />
                Committed to <span className="text-green-600 relative inline-block">
                  Change.
                  {/* Green Underline Element */}
                  <span className="absolute -bottom-1 left-0 w-full h-1.5 bg-green-600 rounded-full"></span>
                </span>
              </h2>
            </div>

            <p className="text-gray-500 text-sm md:text-base leading-relaxed mt-2">
              Nishkam Samarpan Foundation is a non-profit organization working towards the holistic development of society. We believe in selfless service (Nishkam Seva) and dedication (Samarpan) to create a more equitable and compassionate world.
            </p>

            <motion.a 
              whileHover={{ x: 5 }}
              href="#learn-more"
              className="flex items-center gap-2 text-green-600 font-bold hover:text-green-700 w-max mt-2 group"
            >
              Learn More About Us 
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </motion.a>
          </motion.div>

          {/* --- RIGHT: Mission Card (3 Columns) --- */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-3 mt-8 lg:mt-0"
          >
            <div className="bg-white rounded-[2rem] p-8 shadow-[0_15px_50px_-10px_rgba(0,0,0,0.08)] border border-gray-50 flex flex-col gap-5 h-full">
              
              {/* Card Icon Header */}
              <div className="w-14 h-14 relative mb-2">
                {/* Use an Image tag here if you have the exact custom SVG from the design.
                  <Image src="/your-mission-logo.svg" alt="Mission Logo" fill className="object-contain" /> 
                */}
                
                {/* Fallback Icon if you don't have the exact image */}
                <div className="w-full h-full bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                  <Users className="w-8 h-8" />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-extrabold text-gray-900">Our Mission</h3>
                <p className="text-gray-500 text-sm leading-loose">
                  To uplift underserved communities through sustainable initiatives in education, healthcare, and empowerment.
                </p>
              </div>

              {/* Decorative Progress Line */}
              <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-6">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "35%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                  className="h-full bg-orange-500 rounded-full"
                />
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}