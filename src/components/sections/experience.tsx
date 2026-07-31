"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import {
  Briefcase, MapPin, Calendar, Globe, Code2,
  ChevronRight, ExternalLink, ShieldCheck,
  Terminal, Building2, Award, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const EXPERIENCES = [
  {
    id: "exp-1",
    role: "Software Developer Intern",
    company: "Edudiagno Pvt. Ltd.",
    location: "Bangalore, India",
    mode: "Remote",
    duration: "January 2026 – July 2026",
    type: "Internship",
    featured: true,
    about: [
      "During my internship as a Software Developer Intern at Edudiagno Pvt. Ltd., I gained hands-on experience in developing scalable full-stack web applications within a collaborative Agile development environment. I contributed to the design, development, testing, and optimization of enterprise-grade software solutions while working closely with experienced developers throughout the software development lifecycle.",
      "My responsibilities included developing responsive frontend interfaces, integrating RESTful APIs, designing relational database schemas using PostgreSQL and Prisma ORM, implementing secure authentication mechanisms, debugging applications, improving performance, and ensuring code quality through collaborative development practices.",
      "This internship strengthened my understanding of scalable software architecture, Git-based version control, Agile methodologies, teamwork, debugging, performance optimization, and building production-ready software applications."
    ],
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "FastAPI", "Python", "PostgreSQL", "Prisma ORM", "Socket.io", "Docker", "Redis", "REST APIs", "Git", "GitHub"],
    projects: [
      { name: "EduDiagnoX – Exam Web Portal", link: "#projects" },
      { name: "EduDiagno BI – AI Analytics Platform", link: "#projects" }
    ],
    responsibilities: [
      "Developed scalable full-stack web applications.",
      "Designed reusable frontend components.",
      "Integrated RESTful APIs.",
      "Implemented secure authentication.",
      "Optimized PostgreSQL database schemas.",
      "Worked with Prisma ORM.",
      "Improved application performance.",
      "Participated in debugging and testing.",
      "Collaborated in Agile development.",
      "Used Git for version control."
    ],
    certificateUrl: "https://drive.google.com/file/d/1Jc45z4aZebGXL8-1O2Xrwvw5b8oAXdXq/view?usp=drive_link"
  },
  {
    id: "exp-2",
    role: "Full Stack Developer Intern",
    company: "CoreXtech IT Services Pvt. Ltd.",
    location: "Maharashtra, India",
    mode: "Remote",
    duration: "January 2026 – June 2026",
    type: "Internship",
    featured: false,
    about: [
      "During my internship as a Full Stack Developer Intern at CoreXtech IT Services Pvt. Ltd., I worked on designing, developing, and maintaining responsive full-stack web applications using modern frontend and backend technologies. I collaborated with the development team to build scalable RESTful APIs, optimize database performance, implement secure authentication, and deliver maintainable software solutions.",
      "I contributed to frontend development using React.js and Next.js, while building backend services using Node.js and Express.js. I also worked with MongoDB and MySQL databases, implemented JWT and OAuth-based authentication, developed reusable UI components, and maintained project documentation.",
      "This internship enhanced my practical understanding of full-stack application architecture, API development, authentication, database design, software documentation, Git workflows, and collaborative software engineering."
    ],
    techStack: ["HTML5", "CSS3", "JavaScript", "React.js", "Next.js", "Node.js", "Express.js", "MongoDB", "MySQL", "JWT", "OAuth", "Git", "GitHub", "REST APIs"],
    projects: [],
    responsibilities: [
      "Developed responsive frontend interfaces.",
      "Built scalable backend APIs.",
      "Designed database schemas.",
      "Implemented JWT authentication.",
      "Integrated OAuth authentication.",
      "Created reusable UI components.",
      "Collaborated using Git & GitHub.",
      "Prepared API documentation.",
      "Improved application performance.",
      "Participated in Agile workflows."
    ],
    certificateUrl: "https://drive.google.com/file/d/1UyMN1RO7qPxZKRKCdq-IucTtdDe_xUGr/view?usp=drive_link"
  },
  {
    id: "exp-3",
    role: "Web Development Intern",
    company: "VilearnX Advanced Technologies",
    location: "Maharashtra, India",
    mode: "Remote",
    duration: "July 2024 – August 2024",
    type: "Internship",
    featured: false,
    about: [
      "During my internship at VilearnX Advanced Technologies, I developed a strong foundation in frontend web development by working on responsive web pages and learning industry-standard development practices. I gained practical experience in HTML, CSS, JavaScript, Git, GitHub, and local development using XAMPP while collaborating on web development tasks and improving my understanding of modern development workflows.",
      "This internship laid the foundation for my journey into full-stack software development and strengthened my understanding of responsive design, version control, and collaborative coding."
    ],
    techStack: ["HTML5", "CSS3", "JavaScript", "Git", "GitHub", "XAMPP"],
    projects: [],
    responsibilities: [
      "Developed responsive web pages.",
      "Improved frontend development skills.",
      "Practiced Git version control.",
      "Worked with GitHub repositories.",
      "Learned collaborative development.",
      "Built responsive layouts.",
      "Used XAMPP for local development."
    ],
    certificateUrl: "https://drive.google.com/file/d/1F6lDaZUfhu8invmEnZl7Ur_rVe18jJRO/view?usp=sharing"
  }
];

function ExperienceCard({ exp, idx, onClick }: { exp: typeof EXPERIENCES[0], idx: number, onClick: () => void }) {
  const cardRef = React.useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["3deg", "-3deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-3deg", "3deg"]);

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
      className="relative w-full z-10 cursor-pointer"
      onClick={onClick}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={cn(
          "group relative w-full rounded-[28px] p-[1.5px] transition-all duration-500",
          exp.featured ? "bg-gradient-to-r from-primary via-accent-purple to-primary" : "bg-gradient-to-b from-glass-border to-transparent hover:from-primary/30"
        )}
      >
        {exp.featured && (
          <div className="absolute inset-0 bg-primary opacity-20 blur-2xl rounded-[28px] z-0 animate-pulse pointer-events-none" />
        )}

        <div className="relative z-10 bg-card/80 backdrop-blur-xl rounded-[calc(28px-1.5px)] p-6 md:p-10 shadow-sm transition-all duration-300 group-hover:shadow-xl pointer-events-auto">

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-2xl bg-section flex items-center justify-center border border-border shrink-0 shadow-inner overflow-hidden">
                <Building2 className="w-8 h-8 text-primary opacity-80" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="text-2xl md:text-3xl font-black text-heading leading-tight group-hover:text-primary transition-colors">
                    {exp.role}
                  </h3>
                  {exp.featured && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/20 text-primary border border-primary/30">
                      Featured
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-lg font-bold text-paragraph mb-4">
                  <span className="text-heading">{exp.company}</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-paragraph">
                  <span className="flex items-center gap-1.5 bg-section px-3 py-1.5 rounded-lg border border-border shadow-sm">
                    <Calendar className="w-4 h-4 text-primary" /> {exp.duration}
                  </span>
                  <span className="flex items-center gap-1.5 bg-section px-3 py-1.5 rounded-lg border border-border shadow-sm">
                    <MapPin className="w-4 h-4 text-info" /> {exp.location}
                  </span>
                  <span className="flex items-center gap-1.5 bg-section px-3 py-1.5 rounded-lg border border-border shadow-sm">
                    <Globe className="w-4 h-4 text-success" /> {exp.mode}
                  </span>
                  <span className="flex items-center gap-1.5 bg-section px-3 py-1.5 rounded-lg border border-border shadow-sm">
                    <Briefcase className="w-4 h-4 text-accent-purple" /> {exp.type}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {exp.techStack.slice(0, 6).map(tech => (
                <span key={tech} className="px-3 py-1 rounded-lg text-xs font-bold text-heading bg-section border border-border shadow-sm">
                  {tech}
                </span>
              ))}
              {exp.techStack.length > 6 && (
                <span className="px-3 py-1 rounded-lg text-xs font-bold text-heading bg-section border border-border shadow-sm">
                  +{exp.techStack.length - 6}
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 pt-6 flex items-center justify-between border-t border-border/50">
             <span className="text-sm font-bold text-primary flex items-center gap-2 group-hover:gap-3 transition-all">
              View Experience Details <ChevronRight className="w-4 h-4" />
            </span>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}

export function ExperienceSection() {
  const [selectedExperience, setSelectedExperience] = React.useState<typeof EXPERIENCES[0] | null>(null);

  React.useEffect(() => {
    if (selectedExperience) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedExperience]);

  return (
    <section id="experience" className="py-24 relative min-h-screen bg-background overflow-hidden">

      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[60vw] h-[60vw] bg-primary/5 rounded-full blur-[150px] -translate-x-1/2" />
        <div className="absolute bottom-1/4 right-0 w-[50vw] h-[50vw] bg-accent-purple/5 rounded-full blur-[120px] translate-x-1/4" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="container px-4 mx-auto relative z-10 w-full max-w-5xl">

        {/* Header */}
        <div className="flex flex-col items-center mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary mb-6"
          >
            <Briefcase className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Career Timeline</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-heading mb-6 tracking-tight"
          >
            Professional Experience
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-paragraph max-w-3xl text-lg md:text-xl font-medium leading-relaxed"
          >
            A journey of continuous learning, collaboration, and building production-ready software through internships and real-world engineering projects.
          </motion.p>
        </div>

        {/* Timeline Line */}
        <div className="relative">
          <div className="absolute left-8 md:left-12 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-border to-transparent hidden md:block" />

          <div className="space-y-12">
            {EXPERIENCES.map((exp, idx) => (
              <div key={exp.id} className="relative flex flex-col md:flex-row gap-6 md:gap-10">
                <div className="hidden md:flex flex-col items-center pt-8 relative z-20">
                  <div className={cn(
                    "w-6 h-6 rounded-full border-4 flex items-center justify-center shrink-0",
                    exp.featured ? "bg-primary border-background shadow-[0_0_15px_rgba(255,122,89,0.8)]" : "bg-card border-border"
                  )}>
                    {exp.featured && <div className="w-2 h-2 rounded-full bg-background" />}
                  </div>
                </div>
                <div className="flex-1">
                  <ExperienceCard 
                    exp={exp} 
                    idx={idx} 
                    onClick={() => setSelectedExperience(exp)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      <AnimatePresence>
        {selectedExperience && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
          >
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedExperience(null)}
              className="absolute inset-0 bg-background/95 backdrop-blur-xl"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-card rounded-[32px] border border-border shadow-2xl z-10 hide-scrollbar"
            >
              {/* Sticky Header with Close Button */}
              <div className="sticky top-0 right-0 left-0 z-50 flex justify-between items-center p-6 bg-card/80 backdrop-blur-xl border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-heading text-lg">Experience Details</h3>
                </div>
                <button
                  onClick={() => setSelectedExperience(null)}
                  className="w-10 h-10 rounded-full bg-section flex items-center justify-center text-paragraph hover:text-primary hover:bg-primary/10 transition-colors border border-border"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 md:p-12 space-y-16">
                
                {/* Hero Header */}
                <div>
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    {selectedExperience.featured && (
                      <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-primary/20 text-primary border border-primary/30 flex items-center gap-2">
                        <Award className="w-4 h-4" /> Featured Role
                      </span>
                    )}
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-black text-heading mb-4 leading-tight">
                    {selectedExperience.role}
                  </h2>
                  <div className="flex items-center gap-3 text-2xl font-bold text-primary mb-6">
                    <Building2 className="w-6 h-6" /> <span>{selectedExperience.company}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm font-semibold text-paragraph">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-section rounded-lg border border-border">
                      <Calendar className="w-4 h-4 text-primary" /> {selectedExperience.duration}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-section rounded-lg border border-border">
                      <MapPin className="w-4 h-4 text-info" /> {selectedExperience.location}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-section rounded-lg border border-border">
                      <Globe className="w-4 h-4 text-success" /> {selectedExperience.mode}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-section rounded-lg border border-border">
                      <Briefcase className="w-4 h-4 text-accent-purple" /> {selectedExperience.type}
                    </span>
                  </div>
                </div>

                {/* Tech Stack */}
                <section>
                  <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                    <Code2 className="w-4 h-4" /> Technologies Used
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedExperience.techStack.map(tech => (
                      <span key={tech} className="px-3 py-1.5 rounded-lg text-sm font-bold text-heading bg-section border border-border shadow-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <section className="flex flex-col gap-12">
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                        <Terminal className="w-4 h-4" /> About Internship
                      </h4>
                      <div className="space-y-4">
                        {selectedExperience.about.map((para, i) => (
                          <p key={i} className="text-paragraph leading-relaxed font-medium">
                            {para}
                          </p>
                        ))}
                      </div>
                    </div>
                  </section>

                  <section className="flex flex-col gap-12">
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" /> Responsibilities
                      </h4>
                      <ul className="space-y-4">
                        {selectedExperience.responsibilities.map((resp, i) => (
                          <li key={i} className="flex items-start gap-3 text-heading font-semibold">
                            <div className="mt-1.5 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                            <span className="leading-relaxed">{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {selectedExperience.projects.length > 0 && (
                      <div className="bg-section p-8 rounded-3xl border border-border">
                        <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                          <Code2 className="w-4 h-4" /> Projects Delivered
                        </h4>
                        <div className="flex flex-col gap-3">
                          {selectedExperience.projects.map((proj, i) => (
                            <Link
                              key={i}
                              href={proj.link}
                              onClick={() => setSelectedExperience(null)}
                              className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors group/link"
                            >
                              <span className="font-bold text-heading text-sm group-hover/link:text-primary transition-colors">
                                {proj.name}
                              </span>
                              <ExternalLink className="w-4 h-4 text-paragraph group-hover/link:text-primary transition-colors" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>
                </div>

                <section className="bg-primary/5 p-8 rounded-3xl border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                      <Award className="w-4 h-4" /> Validation
                    </h4>
                    <p className="text-heading leading-relaxed font-bold max-w-2xl">
                      Successfully completed internship deliverables and requirements.
                    </p>
                  </div>
                  {selectedExperience.certificateUrl && (
                    <a 
                      href={selectedExperience.certificateUrl} 
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
