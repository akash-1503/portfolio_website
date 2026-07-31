"use client";

import * as React from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Search, ExternalLink, ChevronRight, X, Layers, Activity, Shield, Zap, Database, Key, Server, Folder, Image, Lightbulb, Target, Rocket, Calendar } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Full Stack", "AI", ".NET"];

const PROJECTS = [
  {
    id: "proj-1",
    title: "EduDiagnoX",
    category: "Full Stack",
    shortDescription: "Exam Web Portal",
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2000&auto=format&fit=crop",
    techStack: ["Next.js", "React", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
    overview: "A comprehensive web portal designed to conduct, monitor, and evaluate online examinations securely and efficiently.",
    problem: "Educational institutions struggle with conducting fair, secure, and scalable online exams while maintaining an intuitive user experience for both students and instructors.",
    solution: "A robust, scalable platform that offers role-based access, real-time proctoring features, and automated evaluation pipelines for multiple-choice and subjective questions.",
    architecture: "Client-server architecture with a Next.js frontend, Node.js/Express backend, and MongoDB for flexible schema design. Implements WebSockets for live status tracking.",
    databaseDesign: "NoSQL document structure optimized for high read/write operations during exam time, utilizing MongoDB aggregation pipelines for instant result generation.",
    authentication: "JWT-based authentication with role-based access control (Admin, Instructor, Student) and active session management.",
    apiDesign: "RESTful API with rate limiting, input validation using Zod, and optimized endpoints for real-time exam state synchronization.",
    folderStructure: "Feature-driven structure grouping components, hooks, and services by domain (e.g., /auth, /exam, /results) for maintainability.",
    screenshots: ["https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=800&auto=format&fit=crop"],
    features: ["Role-based Dashboards", "Automated Evaluation", "Live Activity Monitoring", "Secure Exam Browser Support"],
    challenges: "Handling concurrent connections and real-time state synchronization for thousands of students during a single exam slot.",
    lessons: "Optimizing database indexing and utilizing caching strategies dramatically reduces latency during peak load.",
    futureScope: "Integration with AI proctoring, advanced analytics dashboard, and offline support via PWA.",
    demoLink: "#",
    githubLink: "#",
    developmentTimeline: "January 2024 - April 2024",
  },
  {
    id: "proj-2",
    title: "EduDiagno BI",
    category: "AI",
    shortDescription: "AI Analytics Platform",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop",
    techStack: ["Python", "FastAPI", "React", "PostgreSQL", "Pandas", "Scikit-Learn"],
    overview: "An AI-powered Business Intelligence platform providing actionable insights and predictive analytics for educational metrics.",
    problem: "Massive amounts of educational data are generated, but institutions lack the tools to derive meaningful insights and predict student performance trends.",
    solution: "An intuitive dashboard that leverages machine learning models to analyze historical data, predict outcomes, and generate customizable reports.",
    architecture: "Microservices architecture utilizing a FastAPI backend for heavy computational ML tasks and a highly interactive React frontend.",
    databaseDesign: "Relational database schema in PostgreSQL optimized for complex analytical queries (OLAP) with materialized views.",
    authentication: "OAuth2 with JWT tokens, ensuring secure API access and data isolation between different institutional tenants.",
    apiDesign: "GraphQL API for flexible data querying by the frontend, combined with REST endpoints for file uploads and model inference.",
    folderStructure: "Separation of concerns: /models for ML logic, /api for routing, /services for business logic, and a monorepo approach for frontend/backend.",
    screenshots: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop"],
    features: ["Predictive Analytics", "Customizable Dashboards", "Data Export (CSV/PDF)", "Automated Insights Generation"],
    challenges: "Processing large datasets in real-time without blocking the main thread or causing excessive memory consumption.",
    lessons: "Vectorized operations in Pandas and efficient database indexing are critical for analytical performance.",
    futureScope: "Implementing natural language query capabilities (Chat to Data) and integrating real-time streaming data pipelines.",
    demoLink: "#",
    githubLink: "#",
    developmentTimeline: "May 2024 - August 2024",
  },
  {
    id: "proj-3",
    title: "NGO Management System",
    category: "Full Stack",
    shortDescription: "Comprehensive platform for NGO operations",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2000&auto=format&fit=crop",
    techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS"],
    overview: "A centralized platform to manage volunteers, donations, campaigns, and events for Non-Governmental Organizations.",
    problem: "NGOs often use fragmented tools (spreadsheets, disparate software) which leads to data silos and inefficient resource management.",
    solution: "A unified, role-aware dashboard that streamlines operations, tracks impact metrics, and simplifies volunteer onboarding.",
    architecture: "Serverless architecture using Next.js App Router, with Server Actions for seamless data mutations and Prisma as the ORM.",
    databaseDesign: "Highly relational schema mapping Users, Roles, Donations, Campaigns, and Events with strict referential integrity.",
    authentication: "NextAuth.js integration providing secure sessions, social logins, and granular role-based access control.",
    apiDesign: "Utilizes Next.js Server Actions and Route Handlers for type-safe, end-to-end communication.",
    folderStructure: "Next.js App Router structure with collocated components, organized by domain (e.g., /admin, /volunteer).",
    screenshots: ["https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=800&auto=format&fit=crop"],
    features: ["Volunteer Tracking", "Donation Processing", "Campaign Management", "Impact Reporting"],
    challenges: "Designing a responsive, unified UI that adapts dynamically based on the authenticated user's role.",
    lessons: "Type safety across the entire stack (from DB to UI) drastically reduces runtime errors and improves development velocity.",
    futureScope: "Mobile app integration, automated email marketing for campaigns, and advanced financial auditing tools.",
    demoLink: "#",
    githubLink: "#",
    developmentTimeline: "September 2024 - December 2024",
  },
  {
    id: "proj-4",
    title: "Employee Management System",
    category: ".NET",
    shortDescription: "Enterprise HR & Resource Planning",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2000&auto=format&fit=crop",
    techStack: ["ASP.NET Core", "C#", "Entity Framework", "SQL Server", "Angular"],
    overview: "A robust enterprise application for managing employee lifecycles, payroll, attendance, and performance reviews.",
    problem: "Manual HR processes are error-prone, time-consuming, and lack the necessary audit trails required by enterprise compliance standards.",
    solution: "An automated, centralized portal that digitalizes HR workflows, integrates with biometric attendance systems, and generates compliance reports.",
    architecture: "N-Tier architecture utilizing ASP.NET Core Web API, a dedicated business logic layer, and an Angular Single Page Application.",
    databaseDesign: "Normalized SQL Server database ensuring ACID properties, with stored procedures for complex payroll calculations.",
    authentication: "ASP.NET Core Identity with JWT for stateless, secure API authentication and Claims-based authorization.",
    apiDesign: "RESTful architecture following strict standard conventions, utilizing Swagger/OpenAPI for documentation.",
    folderStructure: "Separated into Projects: API, Core (Interfaces/Entities), Infrastructure (EF/Data), and Web (Angular App).",
    screenshots: ["https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop"],
    features: ["Payroll Processing", "Attendance Tracking", "Leave Management", "Performance Appraisals"],
    challenges: "Implementing complex payroll algorithms that comply with varying regional tax laws and regulations.",
    lessons: "Applying the Repository and Unit of Work patterns creates a highly testable and decoupled architecture.",
    futureScope: "Integration with third-party recruitment platforms and implementation of an AI-driven resume parsing module.",
    demoLink: "#",
    githubLink: "#",
    developmentTimeline: "January 2025 - Present",
  }
];

function ProjectCard({ project, onClick }: { project: typeof PROJECTS[0], onClick: () => void }) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      layoutId={`project-${project.id}`}
      onClick={onClick}
      className="group relative cursor-pointer w-full rounded-3xl p-[1px] bg-border hover:bg-primary transition-colors duration-500"
    >
      <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 rounded-3xl z-0" />
      
      <div className="relative z-10 w-full h-full bg-card rounded-[calc(1.5rem-2px)] overflow-hidden flex flex-col border border-border shadow-sm group-hover:shadow-lg transition-all duration-300">
        <motion.div layoutId={`image-${project.id}`} className="relative h-48 md:h-64 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/50 backdrop-blur-md text-white border border-white/10">
              {project.category}
            </span>
          </div>
        </motion.div>

        <div className="p-6 flex flex-col flex-grow z-20 bg-card">
          <motion.h3 layoutId={`title-${project.id}`} className="text-2xl font-bold text-heading mb-2 group-hover:text-primary transition-colors">
            {project.title}
          </motion.h3>
          <motion.p layoutId={`desc-${project.id}`} className="text-paragraph text-sm line-clamp-2 mb-4">
            {project.shortDescription}
          </motion.p>
          
          <div className="flex flex-wrap gap-2 mb-6 mt-auto">
            {project.techStack.slice(0, 3).map((tech) => (
              <span key={tech} className="text-xs font-medium px-2 py-1 rounded-md bg-section text-paragraph border border-border">
                {tech}
              </span>
            ))}
            {project.techStack.length > 3 && (
              <span className="text-xs font-medium px-2 py-1 rounded-md bg-section text-paragraph border border-border">
                +{project.techStack.length - 3}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mt-2 pt-4 border-t border-border">
            <span className="text-sm font-semibold text-info flex items-center gap-1 group-hover:gap-2 transition-all">
              View Case Study <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectsSection() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState("All");
  const [selectedProject, setSelectedProject] = React.useState<typeof PROJECTS[0] | null>(null);

  const filteredProjects = PROJECTS.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          project.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === "All" || project.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  React.useEffect(() => {
    if (selectedProject) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [selectedProject]);

  return (
    <section id="projects" className="py-24 relative min-h-screen bg-background">
      <div className="container px-4 mx-auto relative z-10">
        
        <div className="flex flex-col items-center mb-16 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-heading mb-4"
          >
            Featured Work
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-paragraph max-w-2xl text-lg"
          >
            A selection of my professional software engineering projects.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12"
        >
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border shadow-sm",
                  activeCategory === cat 
                    ? "bg-primary text-white border-primary" 
                    : "bg-card text-paragraph border-border hover:bg-section hover:text-heading"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-paragraph" />
            <input 
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-heading placeholder-paragraph/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 perspective-[2000px]">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </AnimatePresence>
          {filteredProjects.length === 0 && (
            <div className="col-span-full py-20 text-center text-paragraph">
              No projects found matching your criteria.
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-heading/40 backdrop-blur-sm"
            />
            
            <motion.div 
              layoutId={`project-${selectedProject.id}`}
              className="relative w-full max-w-6xl max-h-[90vh] bg-card border border-border rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/80 text-heading backdrop-blur-md hover:bg-white transition-colors shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="overflow-y-auto overflow-x-hidden">
                <motion.div layoutId={`image-${selectedProject.id}`} className="relative w-full h-64 md:h-96">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                  <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover" />
                  
                  <div className="absolute bottom-0 left-0 p-6 md:p-10 z-20">
                    <motion.h2 layoutId={`title-${selectedProject.id}`} className="text-3xl md:text-5xl font-bold text-white mb-2">
                      {selectedProject.title}
                    </motion.h2>
                    <motion.p layoutId={`desc-${selectedProject.id}`} className="text-lg md:text-xl text-gray-200 max-w-2xl">
                      {selectedProject.shortDescription}
                    </motion.p>
                  </div>
                </motion.div>

                <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-10 bg-card">
                  
                  <div className="lg:col-span-2 space-y-10">
                    <section>
                      <h3 className="text-xl font-bold text-heading mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary" /> Overview
                      </h3>
                      <p className="text-paragraph leading-relaxed">{selectedProject.overview}</p>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <section>
                        <h3 className="text-xl font-bold text-heading mb-4 flex items-center gap-2">
                          <Target className="w-5 h-5 text-destructive" /> Problem Statement
                        </h3>
                        <p className="text-paragraph leading-relaxed">{selectedProject.problem}</p>
                      </section>
                      <section>
                        <h3 className="text-xl font-bold text-heading mb-4 flex items-center gap-2">
                          <Lightbulb className="w-5 h-5 text-success" /> Solution
                        </h3>
                        <p className="text-paragraph leading-relaxed">{selectedProject.solution}</p>
                      </section>
                    </div>

                    <section className="p-6 bg-section rounded-2xl border border-border">
                      <h3 className="text-xl font-bold text-heading mb-6 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-info" /> Technical Implementation
                      </h3>
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold text-heading flex items-center gap-2 mb-2"><Server className="w-4 h-4 text-primary" /> Architecture</h4>
                          <p className="text-paragraph text-sm">{selectedProject.architecture}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-heading flex items-center gap-2 mb-2"><Database className="w-4 h-4 text-primary" /> Database Design</h4>
                          <p className="text-paragraph text-sm">{selectedProject.databaseDesign}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-heading flex items-center gap-2 mb-2"><Key className="w-4 h-4 text-primary" /> Authentication</h4>
                          <p className="text-paragraph text-sm">{selectedProject.authentication}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-heading flex items-center gap-2 mb-2"><Activity className="w-4 h-4 text-primary" /> API Design</h4>
                          <p className="text-paragraph text-sm">{selectedProject.apiDesign}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-heading flex items-center gap-2 mb-2"><Folder className="w-4 h-4 text-primary" /> Folder Structure</h4>
                          <p className="text-paragraph text-sm">{selectedProject.folderStructure}</p>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-xl font-bold text-heading mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-warning" /> Challenges & Lessons
                      </h3>
                      <div className="space-y-4">
                        <p className="text-paragraph leading-relaxed"><strong className="text-heading">Challenge:</strong> {selectedProject.challenges}</p>
                        <p className="text-paragraph leading-relaxed"><strong className="text-heading">Lesson Learned:</strong> {selectedProject.lessons}</p>
                      </div>
                    </section>
                    
                    <section>
                      <h3 className="text-xl font-bold text-heading mb-4 flex items-center gap-2">
                        <Rocket className="w-5 h-5 text-info" /> Future Scope
                      </h3>
                      <p className="text-paragraph leading-relaxed">{selectedProject.futureScope}</p>
                    </section>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h4 className="text-sm font-semibold text-heading uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Timeline
                      </h4>
                      <p className="text-paragraph font-medium bg-section px-4 py-2 rounded-lg border border-border inline-block">
                        {selectedProject.developmentTimeline}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-heading uppercase tracking-wider mb-4">Technologies</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.techStack.map(tech => (
                          <span key={tech} className="px-3 py-1.5 bg-section border border-border rounded-lg text-sm font-medium text-heading">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-heading uppercase tracking-wider mb-4">Key Features</h4>
                      <ul className="space-y-3">
                        {selectedProject.features.map(feat => (
                          <li key={feat} className="flex items-start gap-2 text-sm text-paragraph">
                            <Zap className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-6 border-t border-border flex flex-col gap-3">
                      <a href={selectedProject.demoLink} className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover transition-colors shadow-md">
                        <ExternalLink className="w-5 h-5" /> Live Demo
                      </a>
                      <a href={selectedProject.githubLink} className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-card text-heading font-bold hover:bg-section transition-colors border border-border shadow-sm">
                        <GithubIcon className="w-5 h-5" /> View Source
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
