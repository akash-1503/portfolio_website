"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { 
  BookOpen, Search, UserCheck, Calendar,
  ArrowRight, X, Briefcase, FileText, AlertCircle, Image as ImageIcon
} from "lucide-react";

// --- TYPESCRIPT INTERFACES ---
interface Campaign {
  id: string;
  title: string;
  status: string;
}

interface Event {
  id: string;
  title: string;
  status: string;
}

interface Program {
  id: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  category: string;
  coverImage: string | null;
  budget: number;
  startDate: string;
  endDate: string;
  assignedAt: string;
  campaigns: Campaign[];
  events: Event[];
  campaignsCount: number;
  eventsCount: number;
  coordinator: string;
  manager: string;
}

export default function AssignedProgramsPage() {
  // --- STATE ---
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/volunteer/programs");
        const json = await res.json();
        
        if (json.success) {
          setPrograms(json.data);
        } else {
          setError("Unable to load assigned programs.");
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load assigned programs.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  // --- FILTER LOGIC ---
  const filteredPrograms = programs.filter(prog => 
    prog.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prog.coordinator?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- HELPERS ---
  const formatDuration = (start: string, end: string) => {
    if (!start || !end) return "Ongoing";
    const sDate = new Date(start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const eDate = new Date(end).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    return `${sDate} - ${eDate}`;
  };

  const getBannerColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE": return "bg-green-100";
      case "UPCOMING": return "bg-blue-100";
      case "COMPLETED": return "bg-purple-100";
      default: return "bg-gray-100";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE": return "bg-[#16a34a] text-white";
      case "UPCOMING": return "bg-blue-500 text-white";
      case "COMPLETED": return "bg-purple-500 text-white";
      default: return "bg-gray-500 text-white";
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
    <div className="relative flex flex-col gap-8 min-h-screen pb-10">
      
      {/* --- BACKGROUND ANIMATIONS (Craft & Dotted Lines) --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-10 w-[300px] h-[300px] opacity-60 mix-blend-multiply">
          <svg className="absolute w-full h-full" viewBox="0 0 200 200" fill="none">
            <path d="M 0 200 C 50 100, 150 100, 200 0" stroke="#16a34a" strokeWidth="2" strokeDasharray="6 6" strokeLinecap="round" opacity="0.3" />
          </svg>
          <motion.div
            animate={{ y: [-5, 5, -5], x: [-5, 5, -5], rotate: [-2, 2, -2] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-12 right-12"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-45 drop-shadow-md">
              <path d="M21.5 2.5L2 10.5L9.5 13.5L21.5 2.5Z" fill="#4ade80" opacity="0.8" />
              <path d="M21.5 2.5L14.5 22L9.5 13.5L21.5 2.5Z" fill="#16a34a" />
            </svg>
          </motion.div>
        </div>

        <div className="absolute bottom-20 left-[-50px] w-[400px] h-[200px] opacity-40 mix-blend-multiply">
          <svg className="absolute w-full h-full" viewBox="0 0 400 200" fill="none">
            <path d="M 0 100 Q 100 0, 200 100 T 400 100" stroke="#f97316" strokeWidth="2" strokeDasharray="5 7" strokeLinecap="round" opacity="0.4" />
          </svg>
          <motion.div
            animate={{ x: [0, 400], y: [0, -100, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-[100px] left-0"
          >
            <div className="w-3 h-3 bg-[#f97316] rounded-full shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
          </motion.div>
        </div>
      </div>

      {/* --- PAGE HEADER & SEARCH --- */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mt-4">
        <div>
          <motion.h1 variants={itemVariants} className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            Assigned Programs
          </motion.h1>
          <motion.p variants={itemVariants} className="text-[13px] font-bold text-gray-400 mt-2">
            View details and progress of the programs you are currently assigned to.
          </motion.p>
        </div>
        
        <motion.div variants={itemVariants} className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search programs..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/80 backdrop-blur-md border border-gray-200 rounded-full text-[13px] font-bold focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 shadow-sm transition-all"
          />
        </motion.div>
      </motion.div>

      {/* --- PROGRAMS GRID --- */}
      <motion.div 
        variants={containerVariants} initial="hidden" animate="show" 
        className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {/* --- Loading Skeletons --- */}
        {loading && (
          Array.from({ length: 6 }).map((_, i) => (
            <motion.div key={i} variants={itemVariants} className="bg-white/80 rounded-[2.5rem] h-80 animate-pulse border border-gray-100 overflow-hidden shadow-sm">
               <div className="h-32 bg-gray-200/50 w-full"></div>
               <div className="p-6 space-y-4">
                  <div className="h-5 bg-gray-200/50 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200/50 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200/50 rounded w-full mt-6"></div>
               </div>
            </motion.div>
          ))
        )}

        {/* --- Error State --- */}
        {(!loading && error) && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-red-400 bg-white/40 rounded-[2.5rem] border border-red-100">
            <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-[13px] font-bold">{error}</p>
          </div>
        )}

        {/* --- Loaded Data --- */}
        {(!loading && !error) && (
          <AnimatePresence>
            {filteredPrograms.map((program) => (
              <motion.div 
                key={program.id}
                layout
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all"
              >
                {/* Program Header */}
                <div className={`h-24 w-full ${getBannerColor(program.status)} relative flex items-center justify-center overflow-hidden`}>
                  {program.coverImage ? (
                    <img src={program.coverImage} alt={program.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-black/5 mix-blend-overlay" />
                  )}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-sm ${getStatusBadgeColor(program.status)}`}>
                      {program.status}
                    </span>
                  </div>
                </div>

                <div className="p-6 pb-4 border-b border-gray-100 flex flex-col gap-3">
                  <h3 className="text-xl font-extrabold text-gray-900 leading-tight group-hover:text-[#16a34a] transition-colors truncate">
                    {program.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[12px] font-bold text-gray-500">
                    <UserCheck className="w-3.5 h-3.5 text-gray-400" /> Coordinator: <span className="text-gray-800">{program.coordinator}</span>
                  </div>
                </div>

                {/* Program Stats */}
                <div className="p-6 py-4 flex-1 flex flex-col gap-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-[1.2rem] flex flex-col items-center justify-center border border-gray-100">
                      <span className="text-xl font-extrabold text-[#f97316]">{program.campaignsCount}</span>
                      <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mt-1">Campaigns</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-[1.2rem] flex flex-col items-center justify-center border border-gray-100">
                      <span className="text-xl font-extrabold text-[#16a34a]">{program.eventsCount}</span>
                      <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mt-1">Events</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Progress</span>
                      <span className="text-[13px] font-extrabold text-gray-900">{program.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 bg-[#16a34a]`}
                        style={{ width: `${program.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex">
                  <button 
                    onClick={() => setSelectedProgram(program)}
                    className="w-full py-3 bg-white border border-gray-200 rounded-full text-[12px] font-extrabold text-gray-700 hover:text-[#16a34a] hover:border-[#16a34a]/30 hover:bg-green-50/50 shadow-sm flex items-center justify-center gap-2 transition-all"
                  >
                    View Details <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {(!loading && !error && filteredPrograms.length === 0) && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400 bg-white/40 rounded-[2.5rem] border border-dashed border-gray-200">
            <BookOpen className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-[13px] font-bold">No assigned programs found.</p>
          </div>
        )}
      </motion.div>

      {/* ==================================================== */}
      {/* --- SLIDE-OVER DRAWER (VIEW PROGRAM DETAILS) --- */}
      {/* ==================================================== */}
      <AnimatePresence>
        {selectedProgram && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setSelectedProgram(null)} 
              className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100]" 
            />
            <motion.div 
              initial={{ x: "100%", opacity: 0.5 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "100%", opacity: 0.5 }} 
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[550px] bg-white shadow-2xl z-[101] flex flex-col border-l border-gray-100 overflow-hidden"
            >
              
              {/* Drawer Header (Read-Only Indicator) */}
              <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-gray-50/80 shrink-0 backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">Program Details</h2>
                  <span className="px-2 py-1 bg-gray-200 text-gray-500 rounded-md text-[9px] font-extrabold uppercase tracking-widest">Read Only</span>
                </div>
                <button onClick={() => setSelectedProgram(null)} className="p-2 text-gray-400 hover:text-gray-900 bg-white border border-gray-200 rounded-full shadow-sm transition-all hover:bg-gray-50">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#fafafa]">
                
                {/* Program Banner */}
                <div className={`h-48 w-full ${getBannerColor(selectedProgram.status)} relative flex items-center justify-center overflow-hidden`}>
                  {selectedProgram.coverImage ? (
                    <img src={selectedProgram.coverImage} alt={selectedProgram.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-16 h-16 text-black/10 mix-blend-overlay" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-8 right-8">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-sm mb-3 inline-block ${getStatusBadgeColor(selectedProgram.status)}`}>
                      {selectedProgram.status}
                    </span>
                    <h3 className="text-2xl font-extrabold text-white leading-tight drop-shadow-md">
                      {selectedProgram.name}
                    </h3>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  
                  {/* Key Info Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-sm flex flex-col gap-1">
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><UserCheck className="w-3 h-3 text-[#16a34a]"/> Coordinator</span>
                      <span className="text-[13px] font-bold text-gray-900">{selectedProgram.coordinator || "Unassigned"}</span>
                    </div>
                    <div className="bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-sm flex flex-col gap-1">
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Briefcase className="w-3 h-3 text-[#f97316]"/> Manager</span>
                      <span className="text-[13px] font-bold text-gray-900">{selectedProgram.manager || "Unassigned"}</span>
                    </div>
                    <div className="bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-sm flex flex-col gap-1 col-span-2">
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Calendar className="w-3 h-3 text-purple-500"/> Duration</span>
                      <span className="text-[13px] font-bold text-gray-900">{formatDuration(selectedProgram.startDate, selectedProgram.endDate)}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5" /> Description
                    </h4>
                    <p className="text-[13px] font-medium text-gray-600 leading-relaxed bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm">
                      {selectedProgram.description || "No description provided."}
                    </p>
                  </div>

                  {/* Campaigns & Events */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Campaigns ({selectedProgram.campaignsCount})</h4>
                      <div className="flex flex-col gap-2">
                        {selectedProgram.campaigns.length > 0 ? (
                          selectedProgram.campaigns.map((camp, i) => (
                            <div key={i} className="bg-orange-50 text-orange-700 px-3 py-2 rounded-xl text-[12px] font-bold border border-orange-100 truncate">
                              {camp.title}
                            </div>
                          ))
                        ) : (
                          <span className="text-[11px] font-bold text-gray-400 italic">No campaigns</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Events ({selectedProgram.eventsCount})</h4>
                      <div className="flex flex-col gap-2">
                        {selectedProgram.events.length > 0 ? (
                          selectedProgram.events.map((ev, i) => (
                            <div key={i} className="bg-green-50 text-green-700 px-3 py-2 rounded-xl text-[12px] font-bold border border-green-100 truncate">
                              {ev.title}
                            </div>
                          ))
                        ) : (
                          <span className="text-[11px] font-bold text-gray-400 italic">No events</span>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}