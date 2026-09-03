"use client";

import * as React from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ChevronRight, X, Layers, Activity, Shield, Zap, Database, Key, Server, Folder, Lightbulb, Target, Rocket, Calendar, Code2, Briefcase, Wrench, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

const PROJECTS = [
  {
    id: "proj-1",
    title: "EduDiagnoX",
    shortDescription: "Exam Web Portal",
    category: "Internship | Full Stack | EdTech",
    duration: "January 2026 – June 2026",
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2000&auto=format&fit=crop",
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Socket.io", "Clerk", "PostgreSQL", "Prisma"],
    overview: "Develop a scalable online examination platform that enables secure exam management, real-time monitoring, student performance analytics, and role-based access for administrators, teachers, and students.",
    problem: "Traditional examination systems lack robust real-time monitoring, secure attempt validation, and scalable analytics required for large-scale online assessments.",
    solution: "A comprehensive web portal featuring role-based dashboards, secure exam execution with tab-switching detection, and a custom Socket.io server for live proctoring.",
    architecture: "Client-server model utilizing Next.js for SSR and static generation, paired with Next.js API routes and a dedicated Socket.io microservice for real-time bi-directional communication.",
    databaseDesign: "Highly normalized PostgreSQL schema managed via Prisma ORM, featuring robust relations between Users, Roles, Exams, Questions, and Attempts to ensure data integrity.",
    authentication: "Secure, stateless authentication utilizing Clerk for identity management and custom JWT tokens for strict role-based route protection across the application.",
    folderStructure: "Modular Next.js App Router structure separating presentation logic, server actions, API routes, and database models to ensure separation of concerns and maintainability.",
    apiIntegration: "RESTful endpoints utilizing Server Actions for data mutation and strict Zod validation to ensure secure communication between the client and database.",
    features: [
      "Secure Authentication & Role-Based Access",
      "Online Examination Module",
      "Student, Teacher, and Admin Dashboards",
      "Real-Time Tab Switching Detection",
      "Live Exam Monitoring & Attempt Locking",
      "Performance Analytics"
    ],
    contributions: [
      "Designed reusable UI components using Tailwind CSS.",
      "Developed responsive dashboards for students and administrators.",
      "Implemented secure authentication using Clerk and JWT.",
      "Built a custom Socket.io server to monitor and record tab-switching violations in real time.",
      "Engineered secure exam attempt validation using custom React hooks.",
      "Designed and optimized relational database schemas with Prisma ORM.",
      "Integrated backend APIs with frontend modules.",
      "Participated in debugging, testing, and feature enhancement."
    ],
    challenges: "Managing concurrent WebSocket connections and ensuring strict synchronization of exam states for thousands of simultaneous student sessions without data loss.",
    lessons: "Implemented robust WebSocket reconnection strategies and realized the critical importance of utilizing optimistic UI updates for real-time dashboards.",
    performance: "Utilized Prisma connection pooling and Next.js static rendering for exam metadata to significantly reduce initial page load times and database latency.",
    futureScope: "Integration with AI-driven visual proctoring, advanced predictive analytics for student performance, and offline progressive web app (PWA) support."
  },
  {
    id: "proj-2",
    title: "EduDiagno BI",
    shortDescription: "AI Analytics Platform",
    category: "Internship | Artificial Intelligence",
    duration: "January 2026 – June 2026",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop",
    techStack: ["Next.js", "FastAPI", "React", "PostgreSQL", "Prisma", "Docker", "Redis", "AI Integration"],
    overview: "Build an AI-powered Business Intelligence platform that enables organizations to upload structured datasets, interact with databases using AI, generate analytical dashboards, and visualize business insights.",
    problem: "Organizations face a steep learning curve in deriving actionable insights from complex databases, often requiring specialized data engineering skills.",
    solution: "An intuitive, chat-driven interface leveraging LLMs to translate natural language queries into complex SQL, instantly generating dynamic charts and dashboards.",
    architecture: "Microservices architecture decoupling the Next.js frontend from a computationally heavy FastAPI backend. Utilizes containerization for scalable deployment and Redis for fast data retrieval.",
    databaseDesign: "PostgreSQL schema optimized for OLAP workloads, strictly defining organizational tenants, uploaded datasets, and generated dashboard configurations.",
    authentication: "Stateless JWT-based authentication ensuring secure API access and strict data isolation between different organizational tenants.",
    folderStructure: "Monorepo approach isolating the Next.js UI from the Python FastAPI application, with dedicated modules for ML inference, database interactions, and API routing.",
    apiIntegration: "FastAPI REST endpoints optimized for high-throughput data processing and asynchronous LLM API calls, reducing bottlenecking during data ingestion.",
    features: [
      "AI Chat with Database",
      "Dynamic Dashboard Builder",
      "Dynamic Chart Generation",
      "Dataset Upload & Management",
      "Role-Based Access Control",
      "Interactive Analytics",
      "Containerized Deployment"
    ],
    contributions: [
      "Developed responsive dashboard interfaces.",
      "Integrated REST APIs using FastAPI.",
      "Implemented AI-powered database interaction.",
      "Designed scalable PostgreSQL database schemas.",
      "Integrated Docker-based deployment.",
      "Configured Redis caching.",
      "Improved dashboard performance.",
      "Collaborated on backend and frontend integration."
    ],
    challenges: "Effectively translating unpredictable natural language inputs into sanitized, safe, and highly performant database queries without exposing vulnerabilities.",
    lessons: "Gained deep expertise in prompt engineering, context window management, and the necessity of strict validation layers when bridging AI with production databases.",
    performance: "Integrated Redis caching for frequent analytical queries, significantly reducing database load and improving dashboard rendering speeds.",
    futureScope: "Support for real-time streaming data sources, predictive forecasting models, and automated anomaly detection alerts."
  },
  {
    id: "proj-3",
    title: "NGO Management System",
    shortDescription: "Comprehensive Operations Platform",
    category: "Personal Project | Full Stack",
    duration: "July 2026 – Present",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2000&auto=format&fit=crop",
    techStack: ["Next.js 15", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "Razorpay", "Cloudinary", "Socket.io"],
    overview: "Develop a role-based NGO Management System for managing volunteers, campaigns, donations, events, attendance, certificates, and communication from a centralized platform.",
    problem: "NGOs frequently rely on fragmented manual processes and disparate software to track volunteers and donations, leading to operational inefficiencies and data silos.",
    solution: "A unified, full-stack application featuring role-specific dashboards, automated certificate generation, real-time notifications, and seamless payment integrations.",
    architecture: "Serverless Next.js architecture leveraging React Server Components for performance, coupled with a PostgreSQL database and third-party SaaS integrations for media and payments.",
    databaseDesign: "Highly relational schema designed with Prisma ORM, strictly enforcing referential integrity between Users, Roles, Donations, Campaigns, and Event Attendance.",
    authentication: "Hybrid authentication system utilizing secure JWTs and Google OAuth, implementing granular role-based access control for Admins, Users, and Volunteers.",
    folderStructure: "Organized Next.js App Router structure grouped by domains (e.g., /admin, /volunteer, /campaigns), segregating UI components, server actions, and utility functions.",
    apiIntegration: "Seamless integration with Razorpay for secure donation processing and Cloudinary for efficient media asset management and optimization.",
    features: [
      "Admin, Volunteer, and User Dashboards",
      "Campaign & Event Management",
      "Donation Management (Razorpay)",
      "Volunteer Assignment & Attendance",
      "Automated Certificate Generation",
      "Real-Time Notifications (Socket.io)",
      "Dashboard Analytics"
    ],
    contributions: [
      "Designed the complete database schema using Prisma ORM.",
      "Developed secure JWT authentication & integrated Google OAuth.",
      "Built strictly role-based dashboards and UI components.",
      "Developed REST APIs and optimized Prisma queries.",
      "Integrated Razorpay payment gateway.",
      "Integrated Cloudinary for image uploads.",
      "Built fully responsive interfaces."
    ],
    challenges: "Architecting a dynamic UI that securely and efficiently adapts layout and features based on the authenticated user's specific role without causing layout shifts.",
    lessons: "Mastered the integration of complex third-party SDKs (Razorpay, Cloudinary) and realized the massive stability benefits of strict end-to-end typing with TypeScript.",
    performance: "Optimized Prisma queries using select and include projections to minimize over-fetching, heavily utilizing React Server Components to reduce client-side JavaScript.",
    futureScope: "Implementation of automated email marketing campaigns, advanced financial auditing tools, and a dedicated mobile application for field volunteers."
  },
  {
    id: "proj-4",
    title: "Employee Management",
    shortDescription: "Enterprise HR & Resource Planning",
    category: "Academic Project | Enterprise Application",
    duration: "January 2025 - May 2025",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2000&auto=format&fit=crop",
    techStack: ["ASP.NET Core", "C#", "Entity Framework", "SQL Server", "Bootstrap", "Razor Views"],
    overview: "Develop a role-based Employee Management System to manage employee records, departments, authentication, and organizational workflows using the MVC architecture.",
    problem: "Manual human resource processes lack strict audit trails, are prone to human error, and fail to meet standard enterprise compliance and security requirements.",
    solution: "A structured, centralized digital portal that automates HR workflows, department allocations, and employee record management utilizing a strict MVC paradigm.",
    architecture: "Classic N-Tier MVC architecture separating the application into Models (data logic), Views (presentation), and Controllers (business logic routing).",
    databaseDesign: "Fully normalized SQL Server relational database, utilizing Entity Framework Core to map complex organizational hierarchies and departmental relationships.",
    authentication: "Secure cookie-based authentication integrated with ASP.NET Core Identity, implementing robust password hashing and claims-based authorization.",
    folderStructure: "Strict adherence to ASP.NET Core MVC conventions, segregating Controllers, Models, Views, ViewModels, and Data Access logic into dedicated namespaces.",
    apiIntegration: "Utilizes strongly-typed controllers and action methods to handle HTTP requests, serving server-rendered Razor pages infused with dynamic model data.",
    features: [
      "Employee CRUD Operations",
      "Department Management",
      "Role-Based Access Control",
      "Interactive Dashboards",
      "Secure Authentication",
      "Entity Framework Core Integration"
    ],
    contributions: [
      "Designed and implemented the full MVC architecture.",
      "Developed Employee and Department CRUD modules.",
      "Implemented secure authentication pipelines.",
      "Integrated Entity Framework Core for data access.",
      "Designed the normalized SQL Server database schema.",
      "Built responsive user interfaces utilizing Bootstrap.",
      "Optimized complex database queries."
    ],
    challenges: "Ensuring strict data integrity and handling complex cascading deletes within Entity Framework when dealing with deeply nested departmental hierarchies.",
    lessons: "Gained a profound understanding of the Repository pattern, Unit of Work, and the importance of Dependency Injection in building testable and decoupled enterprise applications.",
    performance: "Implemented explicit loading and asynchronous database queries (async/await) in Entity Framework Core to prevent thread blocking and improve server throughput.",
    futureScope: "Transitioning the frontend to a modern SPA framework like React and exposing the core business logic via a robust RESTful API layer."
  }
];

function ProjectCard({ project, onClick }: { project: typeof PROJECTS[0], onClick: () => void }) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

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
      className="group relative cursor-pointer w-full rounded-3xl p-1 bg-gradient-to-b from-border to-transparent hover:from-primary/50 transition-colors duration-500"
    >
      <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 rounded-3xl z-0" />
      
      <div className="relative z-10 w-full h-full bg-card rounded-[calc(1.5rem-4px)] overflow-hidden flex flex-col border border-border shadow-sm group-hover:shadow-xl group-hover:shadow-primary/5 transition-all duration-300">
        <motion.div layoutId={`image-${project.id}`} className="relative h-56 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
          <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-sm">
              {project.category.split('|')[0].trim()}
            </span>
          </div>
          <div className="absolute bottom-4 left-4 z-20">
             <motion.h3 layoutId={`title-${project.id}`} className="text-2xl font-black text-white mb-1">
              {project.title}
            </motion.h3>
            <p className="text-gray-300 text-sm font-medium">{project.shortDescription}</p>
          </div>
        </motion.div>

        <div className="p-6 flex flex-col flex-grow bg-card">
          <div className="flex flex-wrap gap-2 mb-6">
            {project.techStack.slice(0, 4).map((tech) => (
              <span key={tech} className="text-xs font-semibold px-2.5 py-1 rounded-md bg-section text-paragraph border border-border">
                {tech}
              </span>
            ))}
            {project.techStack.length > 4 && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-section text-paragraph border border-border">
                +{project.techStack.length - 4}
              </span>
            )}
          </div>

          <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
            <span className="text-sm font-bold text-primary flex items-center gap-2 group-hover:gap-3 transition-all">
              View Engineering Case Study <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = React.useState<typeof PROJECTS[0] | null>(null);

  React.useEffect(() => {
    if (selectedProject) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [selectedProject]);

  return (
    <section id="projects" className="py-16 sm:py-24 relative min-h-screen bg-background overflow-hidden">
      
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] bg-accent-purple/5 rounded-full blur-[100px] translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="container px-4 mx-auto relative z-10 w-full max-w-7xl">
        
        <div className="flex flex-col items-center mb-12 sm:mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary mb-4 sm:mb-6"
          >
            <Folder className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Case Studies</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-6xl font-black text-heading mb-4 sm:mb-6 tracking-tight"
          >
            Engineering Portfolio
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-paragraph max-w-3xl text-base sm:text-lg md:text-xl font-medium leading-relaxed"
          >
            A technical deep dive into my core software engineering projects, showcasing architecture, problem-solving, and implementation details.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 perspective-[2000px]">
          <AnimatePresence>
            {PROJECTS.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <ProjectCard project={project} onClick={() => setSelectedProject(project)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[200] flex justify-center p-0 sm:p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-xl"
            />
            
            <motion.div 
              layoutId={`project-${selectedProject.id}`}
              className="relative w-full max-w-7xl h-full sm:h-auto sm:max-h-[95vh] bg-card sm:border border-border sm:rounded-[2.5rem] overflow-hidden shadow-2xl z-10 flex flex-col"
            >
              {/* Modal Header actions */}
              <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50 flex items-center gap-3">
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all shadow-lg shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto overflow-x-hidden hide-scrollbar bg-background flex-grow">
                
                {/* Hero Section of Case Study */}
                <motion.div layoutId={`image-${selectedProject.id}`} className="relative w-full h-[32vh] min-h-[220px] sm:min-h-[300px] md:h-[50vh] flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-black/30 z-10" />
                  <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover" />
                  
                  <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6 md:p-12 z-20 container mx-auto">
                    <div className="max-w-4xl">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                        {selectedProject.category.split('|').map((cat, i) => (
                          <span key={i} className="px-2.5 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-primary/20 backdrop-blur-md text-primary border border-primary/30">
                            {cat.trim()}
                          </span>
                        ))}
                      </div>
                      <motion.h2 layoutId={`title-${selectedProject.id}`} className="text-2xl sm:text-4xl md:text-6xl font-black text-heading mb-2 sm:mb-4 leading-tight">
                        {selectedProject.title}
                      </motion.h2>
                      <p className="text-sm sm:text-xl md:text-2xl text-paragraph font-medium line-clamp-2 sm:line-clamp-none">
                        {selectedProject.shortDescription}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Content Grid */}
                <div className="container mx-auto px-4 sm:px-8 md:px-12 py-6 sm:py-12">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Main Content - Left Column (8 cols) */}
                    <div className="lg:col-span-8 space-y-16">
                      
                      {/* Overview & Problem -> Solution */}
                      <div className="space-y-10">
                        <section>
                          <h3 className="text-2xl font-bold text-heading mb-4 flex items-center gap-3">
                            <Activity className="w-6 h-6 text-primary" /> Project Overview
                          </h3>
                          <p className="text-lg text-paragraph leading-relaxed font-medium">
                            {selectedProject.overview}
                          </p>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="p-6 rounded-3xl bg-destructive/5 border border-destructive/10">
                            <h4 className="text-lg font-bold text-destructive mb-3 flex items-center gap-2">
                              <Target className="w-5 h-5" /> Problem Statement
                            </h4>
                            <p className="text-paragraph leading-relaxed text-sm">
                              {selectedProject.problem}
                            </p>
                          </div>
                          <div className="p-6 rounded-3xl bg-success/5 border border-success/10">
                            <h4 className="text-lg font-bold text-success mb-3 flex items-center gap-2">
                              <Lightbulb className="w-5 h-5" /> Solution
                            </h4>
                            <p className="text-paragraph leading-relaxed text-sm">
                              {selectedProject.solution}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Technical Implementation */}
                      <section>
                        <h3 className="text-2xl font-bold text-heading mb-8 flex items-center gap-3 border-b border-border pb-4">
                          <Layers className="w-6 h-6 text-primary" /> Technical Implementation
                        </h3>
                        
                        <div className="space-y-6 sm:space-y-8">
                          <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] md:grid-cols-[200px_1fr] gap-2 sm:gap-4 md:gap-8 items-start">
                            <div className="flex items-center gap-2 text-heading font-bold text-sm sm:text-base">
                              <Server className="w-4 sm:w-5 h-4 sm:h-5 text-primary shrink-0" /> System Architecture
                            </div>
                            <p className="text-paragraph text-sm sm:text-base leading-relaxed">{selectedProject.architecture}</p>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] md:grid-cols-[200px_1fr] gap-2 sm:gap-4 md:gap-8 items-start">
                            <div className="flex items-center gap-2 text-heading font-bold text-sm sm:text-base">
                              <Database className="w-4 sm:w-5 h-4 sm:h-5 text-primary shrink-0" /> Database Design
                            </div>
                            <p className="text-paragraph text-sm sm:text-base leading-relaxed">{selectedProject.databaseDesign}</p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] md:grid-cols-[200px_1fr] gap-2 sm:gap-4 md:gap-8 items-start">
                            <div className="flex items-center gap-2 text-heading font-bold text-sm sm:text-base">
                              <Key className="w-4 sm:w-5 h-4 sm:h-5 text-primary shrink-0" /> Authentication Flow
                            </div>
                            <p className="text-paragraph text-sm sm:text-base leading-relaxed">{selectedProject.authentication}</p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] md:grid-cols-[200px_1fr] gap-2 sm:gap-4 md:gap-8 items-start">
                            <div className="flex items-center gap-2 text-heading font-bold text-sm sm:text-base">
                              <Zap className="w-4 sm:w-5 h-4 sm:h-5 text-primary shrink-0" /> API Integration
                            </div>
                            <p className="text-paragraph text-sm sm:text-base leading-relaxed">{selectedProject.apiIntegration}</p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] md:grid-cols-[200px_1fr] gap-2 sm:gap-4 md:gap-8 items-start">
                            <div className="flex items-center gap-2 text-heading font-bold text-sm sm:text-base">
                              <Folder className="w-4 sm:w-5 h-4 sm:h-5 text-primary shrink-0" /> Folder Structure
                            </div>
                            <p className="text-paragraph text-sm sm:text-base leading-relaxed">{selectedProject.folderStructure}</p>
                          </div>
                        </div>
                      </section>

                      {/* Engineering Experience */}
                      <section>
                        <h3 className="text-2xl font-bold text-heading mb-8 flex items-center gap-3 border-b border-border pb-4">
                          <Cpu className="w-6 h-6 text-primary" /> Engineering Insights
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                          <div className="p-8 rounded-3xl bg-section border border-border">
                            <h4 className="text-lg font-bold text-heading mb-4 flex items-center gap-2">
                              <Shield className="w-5 h-5 text-warning" /> Challenges Faced
                            </h4>
                            <p className="text-paragraph leading-relaxed text-sm">
                              {selectedProject.challenges}
                            </p>
                          </div>
                          <div className="p-8 rounded-3xl bg-section border border-border">
                            <h4 className="text-lg font-bold text-heading mb-4 flex items-center gap-2">
                              <Lightbulb className="w-5 h-5 text-success" /> Lessons Learned
                            </h4>
                            <p className="text-paragraph leading-relaxed text-sm">
                              {selectedProject.lessons}
                            </p>
                          </div>
                        </div>

                        <div className="p-8 rounded-3xl bg-primary/5 border border-primary/20">
                          <h4 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
                            <Zap className="w-5 h-5" /> Performance Optimizations
                          </h4>
                          <p className="text-paragraph leading-relaxed text-sm font-medium">
                            {selectedProject.performance}
                          </p>
                        </div>
                      </section>
                      
                    </div>

                    {/* Metadata Sidebar - Right Column (4 cols) */}
                    <div className="lg:col-span-4 space-y-8">
                      
                      {/* Timeline */}
                      <div className="p-8 rounded-3xl bg-card border border-border shadow-sm">
                        <h4 className="text-sm font-bold text-paragraph uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" /> Timeline
                        </h4>
                        <p className="text-heading font-bold">
                          {selectedProject.duration}
                        </p>
                      </div>

                      {/* Tech Stack */}
                      <div className="p-8 rounded-3xl bg-card border border-border shadow-sm">
                        <h4 className="text-sm font-bold text-paragraph uppercase tracking-widest mb-6 flex items-center gap-2">
                          <Code2 className="w-4 h-4 text-primary" /> Technology Stack
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.techStack.map(tech => (
                            <span key={tech} className="px-3 py-1.5 bg-section border border-border rounded-lg text-xs font-bold text-heading">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Features */}
                      <div className="p-8 rounded-3xl bg-card border border-border shadow-sm">
                        <h4 className="text-sm font-bold text-paragraph uppercase tracking-widest mb-6 flex items-center gap-2">
                          <Activity className="w-4 h-4 text-primary" /> Core Features
                        </h4>
                        <ul className="space-y-4">
                          {selectedProject.features.map(feat => (
                            <li key={feat} className="flex items-start gap-3 text-sm text-heading font-medium">
                              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                              {feat}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Contributions */}
                      <div className="p-8 rounded-3xl bg-card border border-border shadow-sm">
                        <h4 className="text-sm font-bold text-paragraph uppercase tracking-widest mb-6 flex items-center gap-2">
                          <Wrench className="w-4 h-4 text-primary" /> My Contributions
                        </h4>
                        <ul className="space-y-4">
                          {selectedProject.contributions.map((contribution, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-heading font-medium">
                              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-info flex-shrink-0" />
                              {contribution}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Future Scope */}
                      <div className="p-8 rounded-3xl bg-section border border-border shadow-sm">
                        <h4 className="text-sm font-bold text-paragraph uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Rocket className="w-4 h-4 text-accent-purple" /> Future Scope
                        </h4>
                        <p className="text-sm text-paragraph leading-relaxed">
                          {selectedProject.futureScope}
                        </p>
                      </div>

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
