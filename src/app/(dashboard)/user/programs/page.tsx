"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { 
  Search, MapPin, Target, Calendar, ArrowRight, 
  X, BookOpen, Users, Heart, Leaf, Lightbulb, 
  ArrowLeft, Image as ImageIcon, AlertCircle, Clock
} from "lucide-react";
import Link from "next/link";

// --- TYPESCRIPT INTERFACES ---
interface Campaign {
  id: string;
  title: string;
  raised: number;
  goal: number;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
}

interface Program {
  id: string;
  title: string;
  category: string;
  description: string;
  objective: string;
  location: string;
  status: "ACTIVE" | "UPCOMING" | "COMPLETED";
  coverImage: string | null;
  startDate: string;
  endDate: string | null;
  stats: {
    beneficiaries: number;
    eventsConducted: number;
    activeVolunteers: number;
  };
  campaigns: Campaign[];
  events: Event[];
}

// --- UTILITY HELPERS ---
const formatDate = (date: string | null) => {
  if (!date) return "Not specified";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const formatTime = (date: string) => {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-IN").format(value);
};

export default function UserProgramsPage() {
  // --- STATE ---
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Programs");
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  
  // Hydration state for React Portal (Dialog)
  const [mounted, setMounted] = useState(false);

  // --- FETCH DATA ---
  useEffect(() => {
    setMounted(true);
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/user/programs", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const responseText = await response.text();
        let result;

        try {
          result = JSON.parse(responseText);
        } catch {
          console.error("Invalid API response:", responseText);
          throw new Error("The server returned an invalid response.");
        }

        if (!response.ok) {
          throw new Error(result?.message || "Failed to load programs.");
        }

        if (!result?.success) {
          throw new Error(result?.message || "Failed to load programs.");
        }

        setPrograms(result.data ?? []);

      } catch (err) {
        console.error("User Programs API Error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "We couldn't load the programs right now. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  // --- FILTER LOGIC ---
  const filteredPrograms = programs.filter(prog => {
    const matchesSearch = 
      prog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All Programs" || prog.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // --- UI HELPERS ---
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "text-[#16a34a] bg-green-50 border-green-100";
      case "UPCOMING": return "text-blue-600 bg-blue-50 border-blue-100";
      case "COMPLETED": return "text-purple-600 bg-purple-50 border-purple-100";
      default: return "text-gray-600 bg-gray-50 border-gray-100";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Education": return <BookOpen className="w-3.5 h-3.5" />;
      case "Healthcare": return <Heart className="w-3.5 h-3.5" />;
      case "Environment": return <Leaf className="w-3.5 h-3.5" />;
      case "Women Empowerment": return <Users className="w-3.5 h-3.5" />;
      default: return <Lightbulb className="w-3.5 h-3.5" />;
    }
  };

  // --- ANIMATION VARIANTS ---
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="relative flex flex-col gap-6 md:gap-8 min-h-screen pb-10 overflow-x-hidden w-full">
      
      {/* ==================================================== */}
      {/* --- BACKGROUND ANIMATIONS --- */}
      {/* ==================================================== */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] bg-green-400/10 rounded-full blur-[100px]" />
        
        {/* Top Right Dotted Path */}
        <div className="absolute top-0 right-[-50px] w-[300px] md:w-[400px] h-[300px] md:h-[400px] opacity-40 mix-blend-multiply">
          <svg className="absolute w-full h-full" viewBox="0 0 200 200" fill="none">
            <path d="M 150 0 C 150 100, 50 100, 0 200" stroke="#16a34a" strokeWidth="1.5" strokeDasharray="4 6" strokeLinecap="round" opacity="0.6" />
          </svg>
        </div>
      </div>

      {/* ==================================================== */}
      {/* --- PAGE HEADER --- */}
      {/* ==================================================== */}
      <motion.div 
        variants={containerVariants} initial="hidden" animate="show"
        className="relative z-10 flex flex-col gap-2 mt-2 md:mt-4 px-2"
      >
        <motion.h1 variants={itemVariants} className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          Our Programs
        </motion.h1>
        <motion.p variants={itemVariants} className="text-[13px] md:text-[14px] font-bold text-gray-500 max-w-2xl">
          Explore our ongoing programs and discover how you can be part of the change.
        </motion.p>
      </motion.div>

        
      {/* ==================================================== */}
      {/* --- PROGRAMS GRID --- */}
      {/* ==================================================== */}
      <div className="relative z-10 px-2">
        
        {/* Active Programs Count */}
        {!loading && !error && (
          <div className="mb-6 flex items-center gap-2">
            <h2 className="text-[14px] font-extrabold text-gray-900">{filteredPrograms.length} Active Programs</h2>
            <div className="h-px flex-1 bg-gray-200/60"></div>
          </div>
        )}

        <motion.div 
          variants={containerVariants} initial="hidden" animate="show" 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {/* --- Loading Skeletons --- */}
          {loading && (
            Array.from({ length: 6 }).map((_, i) => (
              <motion.div key={i} variants={itemVariants} className="bg-white/80 rounded-[2.5rem] animate-pulse border border-gray-100 shadow-sm flex flex-col h-[420px]">
                <div className="h-48 bg-gray-200/50 w-full rounded-t-[2.5rem]"></div>
                <div className="p-6 flex-1 flex flex-col gap-4">
                  <div className="h-4 bg-gray-200/50 rounded w-1/3"></div>
                  <div className="h-6 bg-gray-200/50 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200/50 rounded w-full mt-2"></div>
                  <div className="h-4 bg-gray-200/50 rounded w-5/6"></div>
                  <div className="mt-auto h-12 bg-gray-200/50 rounded-full w-full"></div>
                </div>
              </motion.div>
            ))
          )}

          {/* --- Error State --- */}
          {(!loading && error) && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white/40 rounded-[2.5rem] border border-red-100 backdrop-blur-xl">
              <AlertCircle className="w-12 h-12 text-red-400 mb-4 opacity-50" />
              <h3 className="text-[16px] font-extrabold text-gray-900 mb-2">Unable to Load Programs</h3>
              <p className="text-[13px] font-bold text-gray-500 max-w-sm mb-6">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-8 py-3 bg-gray-900 text-white rounded-full text-[12px] font-extrabold hover:bg-gray-800 transition-colors shadow-md"
              >
                Retry
              </button>
            </div>
          )}

          {/* --- Empty State --- */}
          {(!loading && !error && filteredPrograms.length === 0) && (
            <div className="col-span-full py-24 flex flex-col items-center justify-center text-center bg-white/40 rounded-[2.5rem] border border-dashed border-gray-200 backdrop-blur-xl">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-[16px] font-extrabold text-gray-900 mb-2">No Programs Available</h3>
              <p className="text-[13px] font-bold text-gray-500 max-w-sm mb-6 leading-relaxed">
                We're currently preparing new initiatives. Please check back soon to discover our upcoming programs.
              </p>
              <Link href="/user/events">
                <button className="px-8 py-3 bg-white border border-gray-200 text-[#16a34a] rounded-full text-[12px] font-extrabold hover:border-[#16a34a] hover:bg-green-50 transition-all shadow-sm">
                  Explore Events Instead
                </button>
              </Link>
            </div>
          )}

          {/* --- Loaded Program Cards --- */}
          {(!loading && !error) && (
            <AnimatePresence>
              {filteredPrograms.map((program) => (
                <motion.div 
                  key={program.id}
                  variants={itemVariants}
                  className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all flex flex-col overflow-hidden group"
                >
                  {/* Image Placeholder */}
                  <div className="h-48 w-full bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden flex items-center justify-center">
                    {program.coverImage ? (
                      <img src={program.coverImage} alt={program.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-gray-300 group-hover:scale-110 transition-transform duration-700" />
                    )}
                    {/* Category Badge overlaying image */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-extrabold uppercase tracking-widest text-gray-700 shadow-sm flex items-center gap-1.5">
                        {getCategoryIcon(program.category)} {program.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-[18px] font-extrabold text-gray-900 leading-tight mb-2 group-hover:text-[#16a34a] transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-[13px] font-medium text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                      {program.description}
                    </p>
                    
                    <div className="mt-auto flex flex-col gap-3">
                      <div className="flex items-center justify-between text-[11px] font-bold text-gray-400">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-400"/> {program.location}</span>
                        <span className={`px-2 py-0.5 rounded border uppercase tracking-widest text-[9px] flex items-center gap-1 ${getStatusColor(program.status)}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span> {program.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[12px] font-bold text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-[#f97316]" /> {program.campaigns.length} Campaigns</span>
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#16a34a]" /> {program.events.length} Events</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-gray-50 bg-white flex">
                    <button 
                      onClick={() => setSelectedProgram(program)}
                      className="w-full py-3.5 bg-white border border-gray-200 rounded-full text-[12px] font-extrabold text-gray-700 hover:text-[#16a34a] hover:border-[#16a34a]/30 hover:bg-green-50 shadow-sm flex items-center justify-center gap-2 transition-all"
                    >
                      View Details <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>
      </div>

      {/* ==================================================== */}
      {/* --- PROGRAM DETAILS DIALOG (REACT PORTAL) --- */}
      {/* ==================================================== */}
      {mounted && typeof document !== "undefined" ? createPortal(
        <AnimatePresence>
          {selectedProgram && (
            <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 md:p-8" style={{ zIndex: 999999 }}>
              
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                onClick={() => setSelectedProgram(null)} 
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" 
              />
              
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }} 
                exit={{ scale: 0.95, opacity: 0, y: 20 }} 
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="relative z-10 w-full max-w-4xl max-h-[90vh] md:max-h-[85vh] bg-[#fafafa] shadow-2xl flex flex-col rounded-[2rem] md:rounded-[2.5rem] overflow-hidden"
              >
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 md:py-5 border-b border-gray-200 bg-white shrink-0 z-10 sticky top-0">
                  <button 
                    onClick={() => setSelectedProgram(null)} 
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-[12px] font-extrabold text-gray-600 hover:text-gray-900 hover:bg-gray-50 shadow-sm transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  
                  <span className="hidden sm:block text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Program Details</span>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  
                  <div className="bg-white border-b border-gray-100">
                    <div className="h-48 md:h-64 w-full bg-gradient-to-br from-green-50 to-emerald-100 relative flex items-center justify-center overflow-hidden">
                      {selectedProgram.coverImage ? (
                        <img src={selectedProgram.coverImage} alt={selectedProgram.title} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-20 h-20 text-[#16a34a] opacity-20" />
                      )}
                    </div>
                    
                    {/* FIXED: The Category badge is now inline-flex, pushing the title down naturally. No overlap possible. */}
                    <div className="px-6 md:px-10 pb-8 relative">
                      
                      <div className="inline-flex px-4 py-2 bg-gray-900 text-white rounded-xl text-[11px] font-extrabold uppercase tracking-widest shadow-md items-center gap-2 border border-gray-700 -mt-5 mb-4 relative z-10">
                        {getCategoryIcon(selectedProgram.category)} {selectedProgram.category}
                      </div>

                      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-4">
                        {selectedProgram.title}
                      </h2>
                      
                      <div className="flex flex-wrap items-center gap-4 text-[12px] md:text-[13px] font-bold text-gray-500">
                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-blue-500"/> {selectedProgram.location}</span>
                        <span className={`px-2.5 py-1 rounded-md border uppercase tracking-widest text-[10px] flex items-center gap-1.5 ${getStatusColor(selectedProgram.status)}`}>
                          <span className="w-2 h-2 rounded-full bg-current"></span> {selectedProgram.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 md:p-10 space-y-10">
                    
                    {/* About & Objective */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-[12px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-[#16a34a]" /> About This Program
                        </h4>
                        <p className="text-[14px] font-medium text-gray-600 leading-relaxed">
                          {selectedProgram.description}
                        </p>
                      </div>
                      
                    </div>

                    {/* Program Impact Stats */}
                    <div>
                      <h4 className="text-[12px] font-extrabold text-gray-400 uppercase tracking-widest mb-4">Program Impact</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-5 rounded-2xl border border-gray-200 text-center shadow-sm">
                          <p className="text-3xl font-extrabold text-gray-900">{formatNumber(selectedProgram.stats.beneficiaries)}</p>
                          <p className="text-[10px] font-extrabold text-gray-400 mt-1 uppercase tracking-widest">Beneficiaries</p>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-gray-200 text-center shadow-sm">
                          <p className="text-3xl font-extrabold text-gray-900">{selectedProgram.stats.eventsConducted}</p>
                          <p className="text-[10px] font-extrabold text-gray-400 mt-1 uppercase tracking-widest">Events Conducted</p>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-gray-200 text-center shadow-sm">
                          <p className="text-3xl font-extrabold text-gray-900">{selectedProgram.stats.activeVolunteers}</p>
                          <p className="text-[10px] font-extrabold text-gray-400 mt-1 uppercase tracking-widest">Active Volunteers</p>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-gray-200 text-center shadow-sm">
                          <p className="text-3xl font-extrabold text-gray-900">{selectedProgram.campaigns.length}</p>
                          <p className="text-[10px] font-extrabold text-gray-400 mt-1 uppercase tracking-widest">Campaigns</p>
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div>
                      <h4 className="text-[12px] font-extrabold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Program Timeline
                      </h4>
                      <div className="flex flex-wrap gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex-1 min-w-[120px]">
                          <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Started</p>
                          <p className="text-[14px] font-bold text-gray-900">{formatDate(selectedProgram.startDate)}</p>
                        </div>
                        <div className="w-px bg-gray-100 hidden sm:block"></div>
                        <div className="flex-1 min-w-[120px]">
                          <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Current State</p>
                          <p className={`text-[14px] font-bold ${selectedProgram.status === 'ACTIVE' ? 'text-[#16a34a]' : 'text-gray-900'}`}>{selectedProgram.status}</p>
                        </div>
                        <div className="w-px bg-gray-100 hidden sm:block"></div>
                        <div className="flex-1 min-w-[120px]">
                          <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Expected Completion</p>
                          <p className="text-[14px] font-bold text-gray-900">{formatDate(selectedProgram.endDate)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Related Campaigns */}
                    {selectedProgram.campaigns.length > 0 && (
                      <div>
                        <h4 className="text-[12px] font-extrabold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Heart className="w-4 h-4 text-[#f97316]" /> Related Campaigns
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {selectedProgram.campaigns.map(camp => (
                            <div key={camp.id} className="bg-white border border-orange-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                              <h5 className="text-[15px] font-extrabold text-gray-900 mb-2">{camp.title}</h5>
                              <p className="text-[12px] font-medium text-gray-500 mb-4">Support this program by contributing to its dedicated campaign.</p>
                              
                              <div className="mt-auto">
                                <div className="flex justify-between items-end mb-2 text-[11px] font-bold">
                                  <span className="text-[#16a34a]">₹{(camp.raised/1000).toFixed(1)}k raised</span>
                                  <span className="text-gray-400">Goal: ₹{(camp.goal/1000).toFixed(1)}k</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4 overflow-hidden">
                                  <div className="bg-[#16a34a] h-1.5 rounded-full" style={{ width: `${Math.min((camp.raised/camp.goal)*100, 100)}%` }}></div>
                                </div>
                                <Link href={`/user/donate`} onClick={() => setSelectedProgram(null)}>
                                  <button className="w-full py-2.5 bg-[#f97316] text-white rounded-xl text-[12px] font-extrabold hover:bg-[#ea580c] transition-colors">
                                    Support Campaign
                                  </button>
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Upcoming Events */}
                    {selectedProgram.events.length > 0 && (
                      <div>
                        <h4 className="text-[12px] font-extrabold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-500" /> Upcoming Events
                        </h4>
                        <div className="flex flex-col gap-3">
                          {selectedProgram.events.map(ev => (
                            <div key={ev.id} className="bg-white border border-gray-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-300 transition-colors shadow-sm">
                              <div>
                                <h5 className="text-[14px] font-extrabold text-gray-900 mb-1">{ev.title}</h5>
                                <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-gray-500">
                                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-blue-400"/> {formatDate(ev.date)}</span>
                                  <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-blue-400"/> {formatTime(ev.time)}</span>
                                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-blue-400"/> {ev.location}</span>
                                </div>
                              </div>
                              <Link href={`/user/eventcamp`} onClick={() => setSelectedProgram(null)}>
                                <button className="w-full sm:w-auto px-6 py-2.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl text-[12px] font-extrabold hover:bg-blue-600 hover:text-white transition-all whitespace-nowrap">
                                  View Event
                                </button>
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      ) : null}

    </div>
  );
}