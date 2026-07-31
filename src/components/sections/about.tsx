"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { User, Activity, Code, Trophy, FileBadge, Calendar, Briefcase, Rocket } from "lucide-react";

const STATS = [
  { label: "Projects Built", value: "12", icon: Code, color: "text-accent-blue" },
  { label: "Technologies", value: "35+", icon: Activity, color: "text-accent-purple" },
  { label: "GitHub Commits", value: "1500+", icon: Briefcase, color: "text-accent-cyan" },
  { label: "Hackathons", value: "5", icon: Rocket, color: "text-accent-orange" },
  { label: "Certificates", value: "15", icon: FileBadge, color: "text-accent-green" },
  { label: "Years Coding", value: "4+", icon: Calendar, color: "text-white" },
];

const TIMELINE = [
  {
    year: "2023",
    title: "Started Software Engineering",
    description: "Began my formal journey into computer science and software development.",
  },
  {
    year: "2024",
    title: "Full-Stack Development",
    description: "Deep dive into full-stack development, mastering React, Next.js, and backend technologies. Built the EduDiagnoX platform.",
  },
  {
    year: "2025",
    title: "AI & Enterprise Systems",
    description: "Expanded expertise into AI analytics, building platforms like EduDiagno BI and developing robust .NET enterprise solutions.",
  },
  {
    year: "Jan 2026 – July 2026",
    title: "Software Developer Intern",
    description: "Internship at Edudiagno Pvt Ltd. Contributed to core infrastructure, optimized application performance, and gained professional industry experience in agile environments.",
    isCurrent: true,
  },
];

export function AboutSection() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [expandedNode, setExpandedNode] = React.useState<number | null>(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section id="about" className="py-24 relative overflow-hidden" ref={containerRef}>
      <div className="container px-4 mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-16 h-16 rounded-full bg-card border border-border shadow-sm flex items-center justify-center mb-6"
          >
            <User className="w-8 h-8 text-primary" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-6"
          >
            Interactive Story
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-secondary-foreground max-w-3xl text-lg md:text-xl leading-relaxed"
          >
            My journey through the tech landscape. Click each node to explore the chapters of my engineering career.
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-4 bottom-4 w-px bg-gradient-to-b from-border/0 via-border to-border/0 md:left-8" />

            <div className="space-y-6">
              {TIMELINE.map((item, index) => {
                const isExpanded = expandedNode === index;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-16 md:pl-24 cursor-pointer"
                    onClick={() => setExpandedNode(isExpanded ? null : index)}
                  >
                    {/* Timeline Dot */}
                    <div className={`absolute left-[21px] md:left-[29px] top-4 w-3 h-3 rounded-full border-2 z-10 transition-colors duration-300 ${isExpanded ? 'bg-primary border-primary shadow-[0_0_10px_rgba(255,122,89,0.8)]' : 'bg-card border-border'}`} />
                    
                    {/* Content */}
                    <div className={`p-6 rounded-3xl border transition-all duration-300 ${isExpanded ? 'border-primary/50 bg-primary/5 shadow-[0_0_30px_rgba(255,122,89,0.1)]' : 'border-border bg-card hover:bg-secondary/50 shadow-sm'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-4">
                          <span className={`text-sm font-bold tracking-wider ${item.isCurrent ? 'text-primary' : 'text-secondary-foreground'}`}>
                            {item.year}
                          </span>
                          {item.isCurrent && (
                            <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-semibold animate-pulse">
                              Active
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <h4 className={`text-xl font-bold transition-colors ${isExpanded ? 'text-foreground' : 'text-secondary-foreground'}`}>
                        {item.title}
                      </h4>
                      
                      {/* Expandable Description */}
                      <motion.div
                        initial={false}
                        animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0, marginTop: isExpanded ? 12 : 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-secondary-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
