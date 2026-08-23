"use client";

import { motion } from "framer-motion";
import { Play, Heart, Users, Share2, BookOpen, Activity, Leaf } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative flex items-center min-h-[100vh] -mt-24 pt-36 pb-32 overflow-visible">
      {/* Background Image with Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="w-full h-full relative"
        >
          <Image
            src="/ngo_image.png"
            alt="NGO Background"
            fill
            className="object-cover object-center"
            priority
          />
        </motion.div>
        {/* Subtle Dark Gradient Overlay for text readability on left, image fully visible on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 w-full max-w-7xl">
        <div className="max-w-3xl">

          {/* --- LEFT CONTENT --- */}
          <div className="flex flex-col items-start gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 text-green-400 font-bold text-lg tracking-wide"
            >
              Together, We Can <Leaf className="w-5 h-5 text-green-400" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-white drop-shadow-lg"
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
              className="text-lg md:text-xl text-gray-200 max-w-xl leading-relaxed drop-shadow-md"
            >
              Nishkam Samarpan Foundation is dedicated to uplifting communities through education, healthcare, and sustainable development. We serve selflessly for a better tomorrow.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 mt-4"
            >
              <button className="bg-[#f97316] text-white flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-orange-500/40 hover:-translate-y-1 transition-transform">
                Donate Now <Heart className="w-5 h-5 fill-current" />
              </button>

              <button className="flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-white bg-white/10 backdrop-blur-md border border-white/20 shadow-sm hover:bg-white/20 transition-all">
                <div className="bg-white text-green-700 p-2 rounded-full flex items-center justify-center">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
                Watch Our Story
              </button>
            </motion.div>
          </div>
        </div>
      </div>


      {/* --- BOTTOM STATS BANNER --- */}
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 py-8 px-12 z-40">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-200/80">

          <div className="flex items-center gap-4 px-4">
            <div className="bg-green-100 text-green-600 p-4 rounded-full"><Users className="w-8 h-8 fill-current" /></div>
            <div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">25,000+</h3>
              <p className="text-sm text-gray-600 font-medium">Lives Impacted</p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-4">
            <div className="bg-orange-100 text-[#f97316] p-4 rounded-full"><BookOpen className="w-8 h-8 fill-current" /></div>
            <div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">120+</h3>
              <p className="text-sm text-gray-600 font-medium">Education Centers</p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-4">
            <div className="bg-green-100 text-green-600 p-4 rounded-full"><Activity className="w-8 h-8" /></div>
            <div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">50+</h3>
              <p className="text-sm text-gray-600 font-medium">Health Camps</p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-4">
            <div className="bg-orange-100 text-[#f97316] p-4 rounded-full"><Users className="w-8 h-8 fill-current" /></div>
            <div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">500+</h3>
              <p className="text-sm text-gray-600 font-medium">Volunteers</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}