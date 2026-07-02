"use client";

import { motion } from "framer-motion";
import { Heart, Users, BookOpen, Activity, Send, Leaf, Droplets, Sun } from "lucide-react";
import Link from "next/link";
import React from "react";

const stats = [
  { icon: Heart, label: "Lives Impacted", value: "25,000+" },
  { icon: Users, label: "Volunteers", value: "500+" },
  { icon: BookOpen, label: "Centers", value: "120+" },
  { icon: Activity, label: "Health Camps", value: "50+" },
];

export default function AuthLayout({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex p-4 md:p-6 lg:p-8 font-sans overflow-hidden">
      
      {/* LEFT SIDE - ILLUSTRATION & BRANDING (Hidden on small screens) */}
      <div className="hidden lg:flex w-1/2 rounded-[2rem] relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1e293b] to-[#0F172A] shadow-2xl items-center justify-center p-12 flex-col text-white">
        
        {/* Animated Gradient Blobs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-32 -left-32 w-[30rem] h-[30rem] bg-[#16A34A]/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-32 -right-32 w-[40rem] h-[40rem] bg-[#F97316]/10 rounded-full blur-3xl"
        />

        {/* Floating Motifs */}
        <motion.div 
          animate={{ y: [-15, 15, -15], rotate: [-10, 10, -10] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-24 right-24 text-[#16A34A]/60"
        >
          <Leaf className="w-12 h-12" />
        </motion.div>
        
        <motion.div 
          animate={{ y: [15, -15, 15], rotate: [10, -10, 10] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-48 left-20 text-[#F97316]/60"
        >
          <Sun className="w-16 h-16" />
        </motion.div>

        <motion.div 
          animate={{ x: [-200, 400], y: [100, -100], opacity: [0, 1, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-40 left-10 text-white/40"
        >
          <Send className="w-8 h-8 rotate-45" />
        </motion.div>

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-start gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full bg-[#16A34A] flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:rotate-12 transition-transform">
              E
            </div>
            <span className="font-extrabold text-3xl tracking-tight text-white drop-shadow-sm">
              Empower<span className="text-[#16A34A]">NGO</span>
            </span>
          </Link>

          <div className="space-y-4 mt-8">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-extrabold leading-tight"
            >
              Building a <span className="text-[#F97316]">Better</span><br/> Tomorrow, Together.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-slate-300 font-medium italic border-l-4 border-[#16A34A] pl-4"
            >
              "Our mission is to create lasting change through compassion."
            </motion.p>
          </div>

          {/* Animated Statistics */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="grid grid-cols-2 gap-4 mt-12 w-full"
          >
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-4 shadow-xl"
              >
                <div className={`p-3 rounded-full bg-gradient-to-br ${idx % 2 === 0 ? 'from-[#16A34A] to-green-600' : 'from-[#F97316] to-orange-500'}`}>
                  <stat.icon className="w-5 h-5 text-white fill-current" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">{stat.value}</h4>
                  <p className="text-xs text-slate-300 font-medium">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>

      {/* RIGHT SIDE - FORM CONTAINER */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12 relative">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.08)] border border-white p-8 sm:p-10 relative z-10"
        >
          {/* Mobile Logo */}
          <Link href="/" className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-[#16A34A] flex items-center justify-center text-white font-bold text-xl shadow-md">
              E
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900">
              Empower<span className="text-[#16A34A]">NGO</span>
            </span>
          </Link>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h2>
            <p className="text-slate-500 mt-2 font-medium">{subtitle}</p>
          </div>

          {children}

        </motion.div>
      </div>

    </div>
  );
}
