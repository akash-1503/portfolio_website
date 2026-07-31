"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Server, Cloud, Database, Cpu, ArrowRight, ServerCrash, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const ARCHITECTURES = [
  {
    id: "frontend",
    title: "Frontend Engineering",
    icon: Layers,
    description: "Component-driven UI using React and Next.js, orchestrated with Framer Motion.",
    details: [
      "Server Components for initial render speed",
      "Client Components for complex interactivity",
      "Tailwind CSS for zero-runtime styling",
      "Zod & React Hook Form for type-safe forms"
    ],
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-200"
  },
  {
    id: "backend",
    title: "Backend Services",
    icon: Server,
    description: "High-performance API layer built with robust statically-typed languages.",
    details: [
      "ASP.NET Core & FastAPI for diverse workloads",
      "Clean Architecture pattern (Domain, Application, Infrastructure)",
      "Dependency Injection for loose coupling",
      "CQRS pattern for complex domains"
    ],
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-200"
  },
  {
    id: "data",
    title: "Data Persistence",
    icon: Database,
    description: "Polyglot persistence strategy optimized for read/write workloads.",
    details: [
      "PostgreSQL as primary source of truth",
      "Redis for caching and distributed locks",
      "Entity Framework Core / Prisma ORM",
      "Automated migration pipelines"
    ],
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-200"
  },
  {
    id: "cloud",
    title: "Cloud Infrastructure",
    icon: Cloud,
    description: "Scalable, resilient, and secure deployment orchestration.",
    details: [
      "Containerization with Docker",
      "Kubernetes for orchestration",
      "Azure / AWS Cloud providers",
      "GitHub Actions CI/CD pipelines"
    ],
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-200"
  }
];

export function ArchitectureLab() {
  const [activeTab, setActiveTab] = React.useState(ARCHITECTURES[0]);

  return (
    <section id="architecture" className="py-24 bg-background relative overflow-hidden">
      <div className="container px-4 mx-auto max-w-6xl">
        
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
            <Cpu className="w-4 h-4" /> System Design
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Architecture Lab</h2>
          <p className="text-lg text-secondary-foreground max-w-2xl">
            Interactive exploration of the engineering patterns and infrastructure choices behind my applications.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Interactive Flow Diagram */}
          <div className="relative p-8 md:p-12 rounded-[2.5rem] bg-card border border-border shadow-2xl overflow-hidden group">
            {/* Soft grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#E5E7EB_1px,transparent_1px),linear-gradient(to_bottom,#E5E7EB_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-50" />
            
            <div className="relative z-10 flex flex-col gap-6">
              {ARCHITECTURES.map((arch, idx) => {
                const Icon = arch.icon;
                const isActive = activeTab.id === arch.id;
                return (
                  <div key={arch.id} className="relative">
                    <button
                      onClick={() => setActiveTab(arch)}
                      className={cn(
                        "w-full flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 relative z-10",
                        isActive 
                          ? `bg-card shadow-xl border-primary ring-1 ring-primary/20 scale-[1.02]`
                          : "bg-card/80 border-border hover:bg-card hover:border-border/80"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn("p-3 rounded-xl transition-colors", isActive ? arch.bg : "bg-secondary")}>
                          <Icon className={cn("w-6 h-6", isActive ? arch.color : "text-secondary-foreground")} />
                        </div>
                        <span className={cn("text-lg font-bold transition-colors", isActive ? "text-foreground" : "text-secondary-foreground")}>
                          {arch.title}
                        </span>
                      </div>
                      <ArrowRight className={cn("w-5 h-5 transition-transform", isActive ? "text-primary translate-x-1" : "text-border")} />
                    </button>
                    {/* Connecting line */}
                    {idx < ARCHITECTURES.length - 1 && (
                      <div className="absolute left-10 top-[100%] w-0.5 h-6 bg-border -z-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details Panel */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full"
              >
                <div className={cn("inline-flex w-fit p-3 rounded-2xl mb-6", activeTab.bg)}>
                  <activeTab.icon className={cn("w-8 h-8", activeTab.color)} />
                </div>
                
                <h3 className="text-3xl font-bold text-foreground mb-4">{activeTab.title}</h3>
                <p className="text-xl text-secondary-foreground mb-8 leading-relaxed">
                  {activeTab.description}
                </p>

                <div className="space-y-4 mb-10">
                  <h4 className="text-sm font-bold tracking-widest text-foreground uppercase">Key Implementation Details</h4>
                  <ul className="space-y-3">
                    {activeTab.details.map((detail, idx) => (
                      <motion.li 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + idx * 0.1 }}
                        key={idx} 
                        className="flex items-start gap-3"
                      >
                        <div className="mt-1">
                          <ShieldCheck className={cn("w-5 h-5", activeTab.color)} />
                        </div>
                        <span className="text-secondary-foreground">{detail}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-secondary-foreground">
                    <Zap className="w-4 h-4 text-amber-500" /> Highly Optimized
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-secondary-foreground">
                    <ServerCrash className="w-4 h-4 text-primary" /> Fault Tolerant
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
