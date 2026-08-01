"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  Code, Layers, Monitor, Server, 
  Database, Cloud, Brain, Wrench,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const TOOLKIT_CATEGORIES = [
  {
    title: "Programming Languages",
    icon: Code,
    description: "Core programming languages used for full-stack development, backend engineering, automation, and problem-solving.",
    technologies: ["Python", "C#", "C", "JavaScript", "SQL"]
  },
  {
    title: ".NET Technologies",
    icon: Layers,
    description: "Enterprise application development using Microsoft's modern development ecosystem.",
    technologies: ["ASP.NET Core", "ASP.NET Core MVC", ".NET Framework", "Entity Framework Core", "REST APIs", "Web Services"]
  },
  {
    title: "Frontend Development",
    icon: Monitor,
    description: "Building responsive, accessible, and modern user interfaces with component-based architecture.",
    technologies: ["React.js", "Next.js", "HTML5", "CSS3", "JavaScript", "Bootstrap", "Tailwind CSS", "Responsive Design"]
  },
  {
    title: "Backend Development",
    icon: Server,
    description: "Designing scalable APIs, authentication systems, middleware, and backend services.",
    technologies: ["FastAPI", "Flask", "Node.js", "Express.js", "REST API Development", "Middleware & Routing", "JWT Authentication", "OAuth", "SAML"]
  },
  {
    title: "Database Engineering",
    icon: Database,
    description: "Designing optimized relational database schemas with efficient query performance.",
    technologies: ["PostgreSQL", "MySQL", "Redis", "Prisma ORM", "Database Schema Design", "Query Optimization"]
  },
  {
    title: "Cloud & DevOps",
    icon: Cloud,
    description: "Deploying and maintaining scalable applications using modern cloud platforms and containerization.",
    technologies: ["Docker", "Containerization", "Vercel", "Hostinger", "GitHub Actions"]
  },
  {
    title: "AI & Machine Learning",
    icon: Brain,
    description: "Developing AI-powered applications, automation workflows, and intelligent data-driven systems.",
    technologies: ["OpenAI API", "Pandas", "NumPy", "Scikit-learn", "Data Preprocessing", "Feature Engineering"]
  },
  {
    title: "Developer Tools",
    icon: Wrench,
    description: "Daily tools used for development, testing, collaboration, debugging, and version control.",
    technologies: ["Git", "GitHub", "Visual Studio", "Visual Studio Code", "Postman", "Prisma ORM"]
  }
];


const PARTICLES = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  width: (i % 3 === 0 ? 12 : i % 2 === 0 ? 8 : 15) + "px",
  left: (i * 17 + 13) % 100 + "%",
  top: (i * 23 + 7) % 100 + "%",
  duration: (i % 4) + 3,
  delay: (i % 5) * 0.5
}));

function ToolkitCard({ category, delay }: { category: typeof TOOLKIT_CATEGORIES[0], delay: number }) {
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

  const Icon = category.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className="w-full h-full perspective-[2000px]"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative h-full w-full rounded-[24px] p-[1px] bg-gradient-to-b from-white/60 to-white/10 hover:from-primary/50 hover:to-primary/10 transition-colors duration-500 cursor-default"
      >
        <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-5 blur-2xl transition-opacity duration-500 rounded-[24px] z-0 pointer-events-none" />
        
        {/* Glass reflection sweep */}
        <div className="absolute inset-0 rounded-[24px] overflow-hidden z-10 pointer-events-none">
          <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/40 opacity-0 group-hover:opacity-100 group-hover:animate-sweep" />
        </div>

        <div className="relative z-20 h-full w-full bg-white/50 backdrop-blur-xl rounded-[calc(24px-1px)] p-6 md:p-8 flex flex-col shadow-sm group-hover:shadow-[0_20px_40px_-15px_rgba(255,122,89,0.15)] group-hover:-translate-y-2 transition-all duration-300">
          
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFF5F2] to-[#FFE5DF] flex items-center justify-center text-primary shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500">
                 <Icon className="w-6 h-6 group-hover:rotate-12 transition-transform duration-500" />
               </div>
               <h3 className="text-xl font-bold text-[#2E3564] tracking-tight">{category.title}</h3>
             </div>
             {/* Small proficiency indicator */}
             <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(255,122,89,0.8)] group-hover:animate-pulse" />
          </div>

          <p className="text-sm text-paragraph leading-relaxed mb-6 font-medium flex-grow">
            {category.description}
          </p>

          <div className="flex flex-wrap gap-2 mt-auto">
            {category.technologies.map((tech, i) => (
              <span 
                key={i} 
                className="px-3 py-1.5 rounded-full text-xs font-semibold text-[#2E3564] bg-white/70 backdrop-blur-md shadow-sm border border-white hover:scale-105 hover:border-primary/40 hover:bg-primary/5 hover:text-primary hover:shadow-[0_0_15px_rgba(255,122,89,0.2)] transition-all duration-300"
              >
                {tech}
              </span>
            ))}
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}

export function ToolkitSection() {
  return (
    <section id="toolkit" className="py-24 relative min-h-screen bg-[#FFF8F5] overflow-hidden">
      
      <style>{`
        @keyframes sweep {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        .animate-sweep {
          animation: sweep 1.5s ease-in-out;
        }
      `}</style>

      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[150px] translate-x-1/4" />
        <div className="absolute bottom-1/4 left-0 w-[40vw] h-[40vw] bg-[#2E3564]/5 rounded-full blur-[120px] -translate-x-1/4" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        
        {/* Floating Particles */}
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-primary/20 backdrop-blur-sm"
            style={{
              width: p.width,
              height: p.width,
              left: p.left,
              top: p.top,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container px-4 mx-auto relative z-10 w-full max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary mb-6 backdrop-blur-md shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Engineering Toolkit</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-[#2E3564] mb-6 tracking-tight drop-shadow-sm"
          >
            Engineering Toolkit
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-paragraph max-w-3xl text-lg md:text-xl font-medium leading-relaxed"
          >
            A curated collection of technologies, frameworks, platforms, and tools I use to design, build, deploy, and scale modern software applications.
          </motion.p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {TOOLKIT_CATEGORIES.map((category, idx) => (
            <ToolkitCard key={category.title} category={category} delay={idx * 0.1} />
          ))}
        </div>

      </div>
    </section>
  );
}
