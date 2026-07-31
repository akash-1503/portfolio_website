"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, LayoutDashboard, FileText } from "lucide-react";
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
    <span className="inline-flex items-center justify-center min-w-[280px] md:min-w-[400px]">
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-purple font-semibold">
        {text}
      </span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="inline-block w-[3px] h-[1em] bg-primary ml-1"
      />
    </span>
  );
}

export function HeroSection() {
  const [introFinished, setIntroFinished] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIntroFinished(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-12 bg-transparent"
    >
      {/* Cinematic Intro Overlay */}
      <AnimatePresence>
        {!introFinished && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative flex flex-col items-center gap-6"
            >
              <div className="absolute inset-0 bg-primary blur-[100px] opacity-10" />
              <div className="w-20 h-20 rounded-3xl bg-card shadow-xl flex items-center justify-center border border-border relative z-10">
                <Code2 className="w-10 h-10 text-primary" />
              </div>
              <div className="flex flex-col items-center gap-2 relative z-10">
                <span className="text-xl font-bold tracking-widest text-heading uppercase">Workspace Initializing</span>
                <div className="w-48 h-1 bg-border rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container relative z-10 px-4 mx-auto w-full max-w-7xl">
        
        <div className="flex flex-col items-center text-center justify-center mt-4 relative w-full h-[600px] md:h-auto md:py-20">
          
          {/* Centered Hero Identity */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={introFinished ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center justify-center space-y-8 z-10 w-full max-w-4xl"
          >
            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-col items-center gap-4">

                <div className="flex flex-col items-center text-center">
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={introFinished ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-success/20 bg-success/10 mb-4 backdrop-blur-md"
                  >
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
                    </span>
                    <span className="text-xs font-semibold text-success uppercase tracking-wider">Available for Opportunities</span>
                  </motion.div>
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-heading tracking-tight leading-tight">
                    Akash Dandale
                  </h1>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4 h-[1.5em] flex items-center justify-center text-heading">
                  <TypeWriter start={introFinished} />
                </div>
                <p className="text-lg md:text-xl text-paragraph leading-relaxed max-w-2xl font-medium text-center">
                  Welcome to my Developer Ecosystem. I architect scalable applications, design premium user experiences, and build robust backend infrastructure.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link href="#dashboard" className="group relative inline-flex h-14 items-center justify-center rounded-2xl bg-primary px-8 font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/30 shadow-sm">
                <LayoutDashboard className="w-5 h-5 mr-2" /> Enter Ecosystem
              </Link>
              <Link href="#projects" className="group inline-flex h-14 items-center justify-center rounded-2xl border border-border bg-card px-8 font-bold text-heading backdrop-blur-md transition-all duration-300 hover:bg-section hover:border-primary/50 hover:scale-[1.02] shadow-sm">
                <Code2 className="w-5 h-5 mr-2 text-paragraph group-hover:text-primary transition-colors" /> Projects Hub
              </Link>
              <div className="flex items-center justify-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                <a href="/resume.pdf" className="w-14 h-14 flex items-center justify-center rounded-2xl bg-card border border-border text-heading hover:bg-section hover:border-primary/50 hover:text-primary transition-colors shadow-sm group relative">
                  <FileText className="w-5 h-5" />
                  <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-heading text-white text-xs py-1 px-3 rounded-lg">Resume</span>
                </a>
                <a href="https://github.com/akash-1503" target="_blank" className="w-14 h-14 flex items-center justify-center rounded-2xl bg-card border border-border text-heading hover:bg-section hover:border-primary/50 hover:text-primary transition-colors shadow-sm group relative">
                  <GithubIcon className="w-6 h-6" />
                  <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-heading text-white text-xs py-1 px-3 rounded-lg">GitHub</span>
                </a>
                <a href="https://www.linkedin.com/in/akash-dandale-309644263" target="_blank" className="w-14 h-14 flex items-center justify-center rounded-2xl bg-card border border-border text-heading hover:bg-section hover:border-primary/50 hover:text-primary transition-colors shadow-sm group relative">
                  <LinkedinIcon className="w-5 h-5" />
                  <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-heading text-white text-xs py-1 px-3 rounded-lg">LinkedIn</span>
                </a>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
