"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { 
  Rocket, MapPin, Calendar, Code2, Users, 
  Trophy, Lightbulb, Zap, ShieldCheck, Cpu, 
  Award, Terminal, ChevronRight, X
} from "lucide-react";
import { cn } from "@/lib/utils";

const HACKATHONS = [
  {
    id: "hack-1",
    name: "AI Hackathon 2025",
    organizer: "MIT Chhatrapati Sambhajinagar",
    date: "April 2025",
    achievement: "Finalist",
    category: "Artificial Intelligence",
    project: "AI Timeline Script Generator",
    featured: true,
    about: [
      "Participated as a finalist in the AI Hackathon 2025, where our team designed and developed an AI-powered chatbot capable of generating timeline-based video scripts from user prompts. The solution focused on simplifying creative content generation through natural language processing and intelligent automation.",
      "Working in a collaborative environment, we designed, developed, tested, and presented the solution within the hackathon timeline while demonstrating rapid prototyping, teamwork, and software engineering practices."
    ],
    problem: "Content creators often spend significant time planning and structuring video scripts. Our objective was to develop an AI-powered chatbot capable of generating structured timeline-based scripts automatically using natural language prompts.",
    contributions: [
      "Developed core application modules using Python.",
      "Integrated Natural Language Processing techniques.",
      "Worked on frontend interface implementation.",
      "Assisted in AI workflow integration.",
      "Participated in solution architecture and feature planning.",
      "Collaborated during testing and presentation."
    ],
    techStack: ["Python", "Artificial Intelligence", "NLP", "SpeechRecognition", "pyttsx3", "PyAutoGUI", "Grok API", "HTML5", "CSS3", "JavaScript"],
    features: [
      "AI Chat Interface",
      "Timeline-Based Script Generation",
      "Natural Language Processing",
      "Speech Recognition",
      "Voice Interaction",
      "Intelligent Prompt Processing",
      "Rapid Prototype"
    ],
    outcome: "Finalist. Successfully demonstrated the prototype and presented the solution before judges while collaborating effectively within a multidisciplinary team.",
    certificateUrl: "https://drive.google.com/file/d/1F8Ti4npSFpzJQ2fJQicv5xU-7RYLaXmL/view?usp=sharing"
  },
  {
    id: "hack-2",
    name: "SUPERNOVA – Stellar Hackathon",
    organizer: "School of Engineering & Technology, MGM University",
    date: "19–20 September 2025",
    achievement: "Participant",
    category: "Artificial Intelligence, Software Engineering",
    project: "DeskBot AI – Voice-Based Intelligent Personal Assistant",
    featured: false,
    about: [
      "Developed a Python-based intelligent voice assistant capable of automating everyday Windows tasks through natural voice commands. The project combined speech recognition, text-to-speech, desktop automation, and AI-powered responses to improve productivity and user interaction.",
      "The solution demonstrated practical applications of artificial intelligence by integrating voice interaction with desktop automation and web services."
    ],
    problem: "Users frequently perform repetitive desktop tasks manually. Our objective was to build an intelligent assistant capable of understanding voice commands and executing Windows automation tasks efficiently.",
    contributions: [
      "Developed the core Python application.",
      "Integrated SpeechRecognition.",
      "Implemented text-to-speech using pyttsx3.",
      "Automated Windows tasks using PyAutoGUI.",
      "Integrated Grok API for AI-powered responses.",
      "Designed frontend interface.",
      "Improved overall application workflow."
    ],
    techStack: ["Python", "Artificial Intelligence", "NLP", "SpeechRecognition", "pyttsx3", "PyAutoGUI", "Grok API", "HTML", "CSS", "JavaScript"],
    features: [
      "Voice-Based Assistant",
      "Desktop Automation",
      "Email Automation",
      "Application Control",
      "Web Search",
      "AI-Powered Responses",
      "Voice Commands",
      "Productivity Automation"
    ],
    outcome: "Successfully demonstrated a working prototype capable of automating multiple desktop operations using natural language voice commands while showcasing AI integration and software engineering principles.",
    certificateUrl: "https://drive.google.com/file/d/1Y_d8ceKyA5RMkkNgSp2sAwsnBvPMVwp1/view?usp=drive_link"
  }
];

function HackathonCard({ hack, onClick, idx }: { hack: typeof HACKATHONS[0], onClick: () => void, idx: number }) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["2deg", "-2deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-2deg", "2deg"]);

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
      transition={{ duration: 0.5, delay: idx * 0.1 }}
      className="relative w-full h-full z-10 cursor-pointer"
      onClick={onClick}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={cn(
          "group relative w-full h-full rounded-[28px] p-[1.5px] transition-all duration-500",
          hack.featured ? "bg-gradient-to-r from-accent-orange via-primary to-accent-orange" : "bg-gradient-to-b from-glass-border to-transparent hover:from-primary/30"
        )}
      >
        {hack.featured && (
          <div className="absolute inset-0 bg-accent-orange opacity-20 blur-2xl rounded-[28px] z-0 animate-pulse pointer-events-none" />
        )}
        
        <div className="relative z-10 bg-card/80 backdrop-blur-xl rounded-[calc(28px-1.5px)] overflow-hidden shadow-sm transition-all duration-300 group-hover:shadow-xl flex flex-col h-full pointer-events-auto">
          
          <div className="relative h-40 md:h-48 w-full bg-section border-b border-border flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
            <Rocket className="w-16 h-16 text-primary opacity-20 group-hover:scale-110 transition-transform duration-700" />
            
            {hack.achievement === "Finalist" && (
              <div className="absolute top-4 right-4 px-4 py-1.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-2">
                <Trophy className="w-4 h-4" /> Finalist
              </div>
            )}
          </div>

          <div className="p-6 md:p-8 flex-1 flex flex-col">
            <div className="flex flex-col items-start justify-between gap-6 mb-6">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-primary mb-2">
                  <Cpu className="w-4 h-4" /> <span>{hack.project}</span>
                </div>
                <h3 className="text-2xl font-black text-heading leading-tight mb-4 group-hover:text-primary transition-colors duration-300">
                  {hack.name}
                </h3>
                
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-paragraph">
                  <span className="flex items-center gap-1.5 bg-section px-2.5 py-1 rounded-md border border-border shadow-sm">
                    <MapPin className="w-3 h-3 text-info" /> {hack.organizer}
                  </span>
                  <span className="flex items-center gap-1.5 bg-section px-2.5 py-1 rounded-md border border-border shadow-sm">
                    <Calendar className="w-3 h-3 text-success" /> {hack.date}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {hack.techStack.slice(0, 5).map(tech => (
                  <span key={tech} className="px-2.5 py-1 rounded-md text-[11px] font-bold text-heading bg-section border border-border shadow-sm">
                    {tech}
                  </span>
                ))}
                {hack.techStack.length > 5 && (
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold text-heading bg-section border border-border shadow-sm">
                    +{hack.techStack.length - 5}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-auto pt-6 flex items-center justify-between border-t border-border/50">
               <span className="text-sm font-bold text-primary flex items-center gap-2 group-hover:gap-3 transition-all">
                View Details <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function HackathonsSection() {
  const [selectedHackathon, setSelectedHackathon] = React.useState<typeof HACKATHONS[0] | null>(null);

  // Handle body scroll locking
  React.useEffect(() => {
    if (selectedHackathon) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedHackathon]);

  return (
    <section id="hackathons" className="py-24 relative min-h-screen bg-background overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[150px] translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-1/4 left-0 w-[60vw] h-[60vw] bg-accent-orange/5 rounded-full blur-[150px] -translate-x-1/4 translate-y-1/4" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="container px-4 mx-auto relative z-10 w-full max-w-5xl">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-12 sm:mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary mb-4 sm:mb-6"
          >
            <Rocket className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Innovation Engine</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-heading mb-4 sm:mb-6 tracking-tight"
          >
            Innovation & Hackathons
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-paragraph max-w-3xl text-base sm:text-lg md:text-xl font-medium leading-relaxed"
          >
            Building innovative solutions under time constraints through collaboration, rapid prototyping, and modern software engineering.
          </motion.p>
        </div>

        {/* Hackathons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 perspective-[2000px]">
          {HACKATHONS.map((hack, idx) => (
            <HackathonCard 
              key={hack.id} 
              hack={hack} 
              idx={idx} 
              onClick={() => setSelectedHackathon(hack)}
            />
          ))}
        </div>

      </div>

      {/* Modal Popup */}
      <AnimatePresence>
        {selectedHackathon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 md:p-8"
          >
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedHackathon(null)}
              className="absolute inset-0 bg-background/95 backdrop-blur-xl"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-card rounded-2xl sm:rounded-[32px] border border-border shadow-2xl z-10 hide-scrollbar"
            >
              {/* Sticky Header with Close Button */}
              <div className="sticky top-0 right-0 left-0 z-50 flex justify-between items-center p-4 sm:p-6 bg-card/80 backdrop-blur-xl border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-heading text-base sm:text-lg">Hackathon Details</h3>
                </div>
                <button
                  onClick={() => setSelectedHackathon(null)}
                  className="w-10 h-10 rounded-full bg-section flex items-center justify-center text-paragraph hover:text-primary hover:bg-primary/10 transition-colors border border-border shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 md:p-12 space-y-16">
                
                {/* Hero Header */}
                <div>
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    {selectedHackathon.achievement === "Finalist" && (
                      <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg flex items-center gap-2">
                        <Trophy className="w-4 h-4" /> Finalist
                      </span>
                    )}
                    <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-section text-paragraph border border-border flex items-center gap-2">
                      <Users className="w-4 h-4 text-accent-purple" /> Team Participation
                    </span>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-black text-heading mb-4 leading-tight">
                    {selectedHackathon.name}
                  </h2>
                  <div className="flex items-center gap-3 text-xl font-bold text-primary mb-6">
                    <Cpu className="w-6 h-6" /> <span>Project: {selectedHackathon.project}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm font-semibold text-paragraph">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-section rounded-lg border border-border">
                      <MapPin className="w-4 h-4 text-info" /> {selectedHackathon.organizer}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-section rounded-lg border border-border">
                      <Calendar className="w-4 h-4 text-success" /> {selectedHackathon.date}
                    </span>
                  </div>
                </div>

                {/* Tech Stack */}
                <section>
                  <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                    <Code2 className="w-4 h-4" /> Technologies Used
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedHackathon.techStack.map(tech => (
                      <span key={tech} className="px-3 py-1.5 rounded-lg text-sm font-bold text-heading bg-section border border-border shadow-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <section>
                    <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                      <Terminal className="w-4 h-4" /> About The Project
                    </h4>
                    <div className="space-y-4">
                      {selectedHackathon.about.map((para, i) => (
                        <p key={i} className="text-paragraph leading-relaxed font-medium">
                          {para}
                        </p>
                      ))}
                    </div>
                  </section>

                  <section className="bg-section p-8 rounded-3xl border border-border">
                    <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" /> Problem Statement
                    </h4>
                    <p className="text-heading leading-relaxed font-semibold">
                      {selectedHackathon.problem}
                    </p>
                  </section>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <section>
                    <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> My Contributions
                    </h4>
                    <ul className="space-y-4">
                      {selectedHackathon.contributions.map((cont, i) => (
                        <li key={i} className="flex items-start gap-3 text-heading font-semibold">
                          <div className="mt-1.5 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                          <span className="leading-relaxed">{cont}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                      <Zap className="w-4 h-4" /> Key Features
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedHackathon.features.map((feat, i) => (
                        <span key={i} className="px-4 py-2 bg-card border border-border rounded-xl text-sm font-bold text-secondary-foreground shadow-sm">
                          {feat}
                        </span>
                      ))}
                    </div>
                  </section>
                </div>

                <section className="bg-primary/5 p-8 rounded-3xl border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                      <Award className="w-4 h-4" /> Outcome
                    </h4>
                    <p className="text-heading leading-relaxed font-bold max-w-2xl">
                      {selectedHackathon.outcome}
                    </p>
                  </div>
                  {selectedHackathon.certificateUrl && (
                    <a 
                      href={selectedHackathon.certificateUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold hover:scale-105 transition-all shadow-lg hover:shadow-primary/30"
                    >
                      <Award className="w-5 h-5" /> View Certificate
                    </a>
                  )}
                </section>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
