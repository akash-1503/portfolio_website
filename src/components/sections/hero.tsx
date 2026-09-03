"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { GithubIcon, LinkedinIcon } from "@/components/icons";

const ROLES = [
  "Software Engineer",
  "Full Stack Developer",
  "AI Engineer",
  ".NET Developer",
  "Cloud Enthusiast",
];

function TypeWriter({ start }: { start: boolean }) {
  const [text, setText] = React.useState("");
  const [roleIndex, setRoleIndex] = React.useState(0);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    if (!start) return;
    
    const currentRole = ROLES[roleIndex];
    const typingSpeed = isDeleting ? 30 : 60;
    const delay = text === currentRole && !isDeleting ? 2500 : text === "" && isDeleting ? 500 : typingSpeed;

    const timeout = setTimeout(() => {
      if (!isDeleting && text === currentRole) {
        setIsDeleting(true);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % ROLES.length);
      } else {
        setText(isDeleting ? currentRole.substring(0, text.length - 1) : currentRole.substring(0, text.length + 1));
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, roleIndex, start]);

  return (
    <span className="inline-flex items-center justify-center min-w-[200px] sm:min-w-[280px] md:min-w-[400px] max-w-full">
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-purple font-semibold truncate">
        {text}
      </span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="inline-block w-[3px] h-[1em] bg-primary ml-1 shrink-0"
      />
    </span>
  );
}

export function HeroSection() {
const [introFinished, setIntroFinished] = React.useState(true);

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-24 pb-12 bg-transparent"
    >
      <div className="container relative z-10 px-4 mx-auto w-full max-w-7xl">
        
        <div className="flex flex-col items-center text-center justify-center relative w-full min-h-[480px] h-auto py-8 sm:py-16 md:py-20">
          
          {/* Centered Hero Identity */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={introFinished ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center justify-center space-y-6 sm:space-y-8 z-10 w-full max-w-4xl"
          >
            <div className="flex flex-col items-center gap-4 sm:gap-6 w-full">
              <div className="flex flex-col items-center gap-3 sm:gap-4 w-full">

                <div className="flex flex-col items-center text-center w-full">
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={introFinished ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-success/20 bg-success/10 mb-3 sm:mb-4 backdrop-blur-md max-w-full"
                  >
                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
                    </span>
                    <span className="text-[11px] sm:text-xs font-semibold text-success uppercase tracking-wider truncate">Available for Opportunities</span>
                  </motion.div>
                  <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold text-heading tracking-tight leading-tight break-words max-w-full">
                    Akash Dandale
                  </h1>
                </div>
              </div>

              <div className="flex flex-col items-center w-full">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-3 sm:mb-4 min-h-[1.5em] flex items-center justify-center text-heading max-w-full">
                  <TypeWriter start={introFinished} />
                </div>
                <p className="text-base sm:text-lg md:text-xl text-paragraph leading-relaxed max-w-2xl font-medium text-center px-2">
                  Welcome to my Developer Ecosystem. I architect scalable applications, design premium user experiences, and build robust backend infrastructure.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4 w-full max-w-lg sm:max-w-none">
              <Link href="#dashboard" className="w-full sm:w-auto group relative inline-flex h-12 sm:h-14 items-center justify-center rounded-2xl bg-primary px-6 sm:px-8 font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/30 shadow-sm text-sm sm:text-base">
                <LayoutDashboard className="w-5 h-5 mr-2 shrink-0" /> Enter Ecosystem
              </Link>
              <Link href="#projects" className="w-full sm:w-auto group inline-flex h-12 sm:h-14 items-center justify-center rounded-2xl border border-border bg-card px-6 sm:px-8 font-bold text-heading backdrop-blur-md transition-all duration-300 hover:bg-section hover:border-primary/50 hover:scale-[1.02] shadow-sm text-sm sm:text-base">
                <Code2 className="w-5 h-5 mr-2 text-paragraph group-hover:text-primary transition-colors shrink-0" /> Projects Hub
              </Link>
              <div className="flex items-center justify-center gap-3 w-full sm:w-auto mt-1 sm:mt-0">
                <a href="https://github.com/akash-1503" target="_blank" rel="noopener noreferrer" className="w-12 sm:w-14 h-12 sm:h-14 flex items-center justify-center rounded-2xl bg-card border border-border text-heading hover:bg-section hover:border-primary/50 hover:text-primary transition-colors shadow-sm group relative">
                  <GithubIcon className="w-5 sm:w-6 h-5 sm:h-6" />
                  <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-heading text-white text-xs py-1 px-3 rounded-lg pointer-events-none">GitHub</span>
                </a>
                <a href="https://www.linkedin.com/in/akash-dandale-309644263" target="_blank" rel="noopener noreferrer" className="w-12 sm:w-14 h-12 sm:h-14 flex items-center justify-center rounded-2xl bg-card border border-border text-heading hover:bg-section hover:border-primary/50 hover:text-primary transition-colors shadow-sm group relative">
                  <LinkedinIcon className="w-5 h-5" />
                  <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-heading text-white text-xs py-1 px-3 rounded-lg pointer-events-none">LinkedIn</span>
                </a>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
