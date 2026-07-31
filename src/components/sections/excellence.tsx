"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  Trophy, Star, ShieldCheck, 
  CheckCircle2, FileBadge
} from "lucide-react";
import { cn } from "@/lib/utils";

const CERTIFICATIONS = [
  { provider: "Google", name: "Introduction to Generative AI" },
  { provider: "IBM", name: "Getting Started with AI" },
  { provider: "Udemy", name: "Complete Python from Scratch" },
  { provider: "Deloitte", name: "Technology Job Simulation" },
  { provider: "AWS", name: "Machine Learning Foundations" },
  { provider: "TCS iON", name: "Young Professional" }
];

const ACHIEVEMENTS = [
  "Developed multiple AI and Full Stack web applications.",
  "Built scalable REST APIs, web services, and database-driven applications.",
  "Hands-on experience with Docker, containerization, PostgreSQL, Prisma ORM, and modern web technologies.",
  "Strong understanding of Object-Oriented Programming, schema design, and software development best practices."
];

const STRENGTHS = [
  "Problem Solving",
  "Analytical Thinking",
  "Team Collaboration",
  "Communication",
  "Time Management",
  "Quick Learner",
  "Adaptability"
];

function ExcellenceCard({ children, delay, className }: { children: React.ReactNode, delay: number, className?: string }) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={cn("w-full h-full perspective-[2000px]", className)}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative h-full w-full rounded-[24px] p-[1px] bg-gradient-to-b from-glass-border to-transparent hover:from-primary/50 transition-colors duration-500 cursor-default"
      >
        <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-5 blur-2xl transition-opacity duration-500 rounded-[24px] z-0 pointer-events-none" />
        
        <div className="relative z-10 h-full w-full bg-card/60 backdrop-blur-xl rounded-[calc(24px-1px)] p-6 md:p-8 flex flex-col border border-glass-border shadow-sm group-hover:shadow-xl transition-all duration-300">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ExcellenceSection() {
  return (
    <section id="excellence" className="py-24 relative min-h-screen bg-background overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[150px] translate-x-1/4" />
        <div className="absolute bottom-1/4 left-0 w-[40vw] h-[40vw] bg-accent-purple/5 rounded-full blur-[120px] -translate-x-1/4" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="container px-4 mx-auto relative z-10 w-full max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary mb-6"
          >
            <Star className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Professional Profile</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-heading mb-6 tracking-tight"
          >
            Professional Excellence
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-paragraph max-w-3xl text-lg md:text-xl font-medium leading-relaxed"
          >
            A collection of certifications, technical achievements, and professional strengths that reflect my continuous learning and engineering mindset.
          </motion.p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card 1: Certifications */}
          <ExcellenceCard delay={0.1}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-inner">
                <FileBadge className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-heading">Professional Certifications</h3>
            </div>
            <p className="text-sm text-paragraph leading-relaxed mb-8 font-medium">
              Industry-recognized certifications completed to strengthen knowledge across Artificial Intelligence, Cloud Computing, Software Development, and Professional Skills.
            </p>
            <div className="flex flex-col gap-3">
              {CERTIFICATIONS.map((cert, i) => (
                <div key={i} className="flex flex-col p-3 rounded-xl bg-section border border-border shadow-sm hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group/cert relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 group-hover/cert:bg-primary transition-colors" />
                  <div className="pl-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-0.5 block">{cert.provider}</span>
                    <span className="text-sm font-bold text-heading group-hover/cert:text-primary transition-colors">{cert.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </ExcellenceCard>

          {/* Card 2: Achievements */}
          <ExcellenceCard delay={0.2} className="md:col-span-1 lg:col-span-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent-purple/10 flex items-center justify-center text-accent-purple shrink-0 shadow-inner">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-heading">Achievements</h3>
            </div>
            <p className="text-sm text-paragraph leading-relaxed mb-8 font-medium">
              Key technical accomplishments and engineering experience gained through practical software development.
            </p>
            <ul className="space-y-4">
              {ACHIEVEMENTS.map((ach, i) => (
                <li key={i} className="flex items-start gap-3 group/ach">
                  <div className="mt-1 flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-success group-hover/ach:scale-110 transition-transform" />
                  </div>
                  <span className="text-sm font-semibold text-heading leading-relaxed">
                    {ach}
                  </span>
                </li>
              ))}
            </ul>
          </ExcellenceCard>

          {/* Card 3: Professional Strengths */}
          <ExcellenceCard delay={0.3} className="md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center text-info shrink-0 shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-heading">Professional Strengths</h3>
            </div>
            <p className="text-sm text-paragraph leading-relaxed mb-8 font-medium">
              Core soft skills that support effective collaboration, problem-solving, and continuous learning.
            </p>
            <div className="flex flex-wrap gap-2">
              {STRENGTHS.map((strength, i) => (
                <span 
                  key={i} 
                  className="px-4 py-2 rounded-full text-xs font-bold text-heading bg-section border border-border shadow-sm hover:scale-105 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all duration-300"
                >
                  {strength}
                </span>
              ))}
            </div>
          </ExcellenceCard>

        </div>

      </div>
    </section>
  );
}
