"use client";

import { motion } from "framer-motion";
import { Play, Heart, Users, Share2, BookOpen, Activity, Leaf } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative flex items-center pt-24 pb-20 bg-[#fafafa] overflow-visible">
      {/* Note: The watercolor background splashes (green/orange) should ideally 
        be part of the transparent hero image or absolute positioned background SVGs.
      */}

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center relative">
          
          {/* --- LEFT CONTENT --- */}
          <div className="flex flex-col items-start gap-6 z-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 text-green-700 font-bold text-lg"
            >
              Together, We Can <Leaf className="w-5 h-5 text-green-500" />
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-gray-900"
            >
              Serve Selflessly,<br />
              <span className="text-[#f97316]">
                Empower Lives
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base md:text-lg text-gray-600 max-w-md leading-relaxed"
            >
              Nishkam Samarpan Foundation is dedicated to uplifting communities through education, healthcare, and sustainable development. We serve selflessly for a better tomorrow.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 mt-2"
            >
              <button className="bg-[#f97316] text-white flex items-center gap-2 px-8 py-3.5 rounded-full font-bold shadow-lg shadow-orange-500/30 hover:-translate-y-1 transition-transform">
                Donate Now <Heart className="w-4 h-4 fill-current" />
              </button>
              
              <button className="flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-green-600 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
                Explore Our Work <Play className="w-4 h-4" />
              </button>
            </motion.div>
          </div>

        
          {/* --- RIGHT IMAGE & PLAY BUTTON --- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[450px] lg:h-[600px] w-full" 
          >
            {/* Update the src here to point to your new transparent image in the public folder */}
            <Image 
              src="/hero-collage.png" 
              alt="NGO Volunteers Helping Children" 
              fill
              className="object-contain object-right"
              priority
            />
            
            {/* Floating Play Button positioned over the image */}
            <motion.div 
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-24 right-[20%] flex flex-col items-center cursor-pointer group"
            >
              <div className="w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 ml-1 fill-current" />
              </div>
              <span className="text-white font-medium mt-3 drop-shadow-md">Watch Our Story</span>
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* --- FAR RIGHT VERTICAL FLOATING MENU (UPDATED) --- */}
      {/* Changed right-0 to right-6 and rounded-l-3xl to rounded-full for a floating bubble effect */}
      <div className="hidden lg:flex flex-col items-center gap-6 absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 py-8 px-4 z-30">
        <div className="flex flex-col items-center gap-1 cursor-pointer hover:scale-110 transition-transform text-orange-500">
          <div className="bg-orange-100 p-3 rounded-full"><Heart className="w-5 h-5 fill-current" /></div>
          <span className="text-[10px] font-semibold text-gray-600 mt-1">Donate</span>
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer hover:scale-110 transition-transform text-green-500">
          <div className="bg-green-100 p-3 rounded-full"><Users className="w-5 h-5 fill-current" /></div>
          <span className="text-[10px] font-semibold text-gray-600 mt-1">Volunteer</span>
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer hover:scale-110 transition-transform text-green-600">
          <div className="bg-green-100 p-3 rounded-full"><Share2 className="w-5 h-5" /></div>
          <span className="text-[10px] font-semibold text-gray-600 mt-1">Share</span>
        </div>
      </div>

      {/* --- BOTTOM STATS BANNER --- */}
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl bg-white rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] py-8 px-12 z-40">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
          
          <div className="flex items-center gap-4 px-4">
            <div className="bg-green-600 text-white p-4 rounded-full"><Users className="w-8 h-8 fill-current" /></div>
            <div>
              <h3 className="text-2xl font-extrabold text-gray-900">25,000+</h3>
              <p className="text-sm text-gray-500 font-medium">Lives Impacted</p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-4">
            <div className="bg-[#f97316] text-white p-4 rounded-full"><BookOpen className="w-8 h-8 fill-current" /></div>
            <div>
              <h3 className="text-2xl font-extrabold text-gray-900">120+</h3>
              <p className="text-sm text-gray-500 font-medium">Education Centers</p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-4">
            <div className="bg-green-600 text-white p-4 rounded-full"><Activity className="w-8 h-8" /></div>
            <div>
              <h3 className="text-2xl font-extrabold text-gray-900">50+</h3>
              <p className="text-sm text-gray-500 font-medium">Health Camps</p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-4">
            <div className="bg-[#f97316] text-white p-4 rounded-full"><Users className="w-8 h-8 fill-current" /></div>
            <div>
              <h3 className="text-2xl font-extrabold text-gray-900">500+</h3>
              <p className="text-sm text-gray-500 font-medium">Volunteers</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}