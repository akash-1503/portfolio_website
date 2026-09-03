"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { 
  Code2, Trophy, 
  Activity, MapPin, Laptop, Award
} from "lucide-react";
import { GithubIcon } from "@/components/icons";

export function DashboardSection() {
  return (
    <section id="dashboard" className="py-16 sm:py-24 bg-section relative">
      <div className="container px-4 mx-auto w-full max-w-7xl">
        <div className="flex flex-col items-start mb-8 sm:mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary mb-4"
          >
            <Activity className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Command Center</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-heading mb-3 sm:mb-4"
          >
            Developer Dashboard
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-paragraph text-base sm:text-lg max-w-2xl"
          >
            Real-time insights into my current status, technical skills, professional experience, and ongoing engineering initiatives.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          
          {/* Status Card (Col 1 & 2) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-2 lg:col-span-1 bg-card rounded-3xl p-5 sm:p-6 border border-border shadow-sm flex flex-col justify-between"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-success/10 flex items-center justify-center text-success shrink-0">
                  <Laptop className="w-5 sm:w-6 h-5 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-heading text-sm sm:text-base">Current Status</h3>
                  <p className="text-xs sm:text-sm text-paragraph">Available for Software Engineer Roles</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-full border border-green-200 dark:border-green-800 text-xs font-semibold shrink-0">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Active
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-section p-4 rounded-2xl border border-border">
                <p className="text-xs font-semibold text-secondary-foreground uppercase tracking-wider mb-1">Current Focus</p>
                <p className="font-bold text-heading text-sm sm:text-base">Full-Stack & AI Engineering</p>
              </div>
              <div className="bg-section p-4 rounded-2xl border border-border">
                <p className="text-xs font-semibold text-secondary-foreground uppercase tracking-wider mb-1">Location</p>
                <p className="font-bold text-heading text-sm sm:text-base flex items-center gap-1"><MapPin className="w-4 h-4 text-primary shrink-0" /> Maharashtra, India</p>
              </div>
            </div>
          </motion.div>

          {/* GitHub Activity / Stats */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-1 lg:col-span-1 bg-card rounded-3xl p-5 sm:p-6 border border-border shadow-sm flex flex-col items-center justify-center text-center"
          >
            <GithubIcon className="w-10 h-10 text-heading mb-4" />
            <h3 className="font-bold text-heading mb-1 text-base sm:text-lg">GitHub Activity</h3>
            <p className="text-xs text-paragraph mb-4">Continuous Integration</p>
            <div className="text-3xl sm:text-4xl font-black text-heading mb-2">1,500+</div>
            <p className="text-xs font-semibold text-success uppercase tracking-wider">Contributions</p>
          </motion.div>

          {/* Professional Highlights */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-1 lg:col-span-1 bg-card rounded-3xl p-5 sm:p-6 border border-border shadow-sm flex flex-col justify-between"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 shrink-0">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-heading text-sm">2 Hackathons</h3>
                  <p className="text-xs text-paragraph">National Level Finalist</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 shrink-0">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-heading text-sm">4 Major Projects</h3>
                  <p className="text-xs text-paragraph">Production-Ready Systems</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-heading text-sm">3 Internships</h3>
                  <p className="text-xs text-paragraph">Professional Engineering</p>
                </div>
              </div>
            </div>
            
            <a href="#projects" className="w-full mt-4 py-2.5 bg-section text-primary font-semibold text-sm rounded-xl border border-border hover:bg-primary hover:text-white transition-colors flex items-center justify-center">
              Explore Portfolio
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
