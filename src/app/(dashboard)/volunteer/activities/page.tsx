"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { 
  Calendar, MapPin, Clock, Users, ArrowRight, ArrowLeft, X, Play, 
  Target, ShieldCheck, CheckCircle2, AlertCircle, Image as ImageIcon, 
  UploadCloud, CheckSquare, Activity, Wallet, BookOpen
} from "lucide-react";

// --- STEP 2: CREATE INTERFACES (DTOs) ---
// Note: In a larger app, move these to "@/types/volunteer"
export interface EventDTO {
  id: string;
  title: string;
  status: string;
  date: string;
  time: string;
  venue: string;
  coordinator: string;
  description: string;
  bannerColor: string;
  mapUrl: string;
  volunteers: { current: number; required: number };
  checklist: { id: number | string; task: string; completed: boolean }[];
}

export interface CampaignDTO {
  id: string;
  title: string;
  status: string;
  deadline: string;
  role: string;
  goal: number;
  raised: number;
  bannerColor: string;
  description: string;
  volunteers: number;
  timeline: { date: string; event: string }[];
  tasks: string[];
  recentUpdates: string[];
}

export default function AssignedActivitiesPage() {
  // --- STEP 3: CREATE COMPONENT STATES ---
  const [activeTab, setActiveTab] = useState<"EVENTS" | "CAMPAIGNS">("EVENTS");
  const [events, setEvents] = useState<EventDTO[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Drawer/Modal States
  const [selectedEvent, setSelectedEvent] = useState<EventDTO | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignDTO | null>(null);

  // --- STEP 4 & 5: FETCH API & useEffect ---
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/volunteer/activities");
        const json = await res.json();
        
        if (json.success) {
          setEvents(json.data.events || []);
          setCampaigns(json.data.campaigns || []);
        } else {
          setError(json.message || "Unable to load assigned activities.");
        }
      } catch (err) {
        console.error(err);
        setError("An unexpected error occurred while fetching activities.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // --- ANIMATION VARIANTS ---
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  // Helper for dynamic colors
  const getStatusBadgeColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE": return "bg-[#16a34a] text-white";
      case "UPCOMING": return "bg-blue-500 text-white";
      case "COMPLETED": return "bg-purple-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="relative flex flex-col gap-8 min-h-screen pb-10">
      
      {/* --- BACKGROUND ANIMATIONS --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-10 w-[300px] h-[300px] opacity-60 mix-blend-multiply">
          <svg className="absolute w-full h-full" viewBox="0 0 200 200" fill="none">
            <path d="M 0 200 C 50 100, 150 100, 200 0" stroke="#f97316" strokeWidth="2" strokeDasharray="6 6" strokeLinecap="round" opacity="0.3" />
          </svg>
          <motion.div animate={{ y: [-5, 5, -5], x: [-5, 5, -5], rotate: [-2, 2, -2] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute top-12 right-12">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-45 drop-shadow-md">
              <path d="M21.5 2.5L2 10.5L9.5 13.5L21.5 2.5Z" fill="#fb923c" opacity="0.8" />
              <path d="M21.5 2.5L14.5 22L9.5 13.5L21.5 2.5Z" fill="#ea580c" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* --- HEADER & TABS --- */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="relative z-10 flex flex-col gap-6 mt-4">
        <div>
          <motion.h1 variants={itemVariants} className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Assigned Activities
          </motion.h1>
          <motion.p variants={itemVariants} className="text-[13px] font-bold text-gray-400 mt-2">
            Manage your assigned events, track campaign progress, and update your tasks.
          </motion.p>
        </div>

        {/* Animated Tabs */}
        <motion.div variants={itemVariants} className="flex p-1.5 bg-white/60 backdrop-blur-md rounded-full w-fit border border-gray-200/50 shadow-sm">
          {["EVENTS", "CAMPAIGNS"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`relative px-8 py-2.5 rounded-full text-[12px] font-extrabold uppercase tracking-widest transition-colors ${
                activeTab === tab ? "text-white" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTabBadge"
                  className="absolute inset-0 bg-[#16a34a] rounded-full shadow-md"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </motion.div>
      </motion.div>

      {/* --- GRID CONTENT --- */}
      <motion.div 
        variants={containerVariants} initial="hidden" animate="show" 
        key={activeTab} // Force re-animation on tab change
        className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {/* --- STEP 7: Loading State --- */}
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

        {/* --- STEP 6: Error State --- */}
        {(!loading && error) && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-red-400 bg-white/40 rounded-[2.5rem] border border-red-100">
            <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-[13px] font-bold">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-6 py-2 bg-red-50 text-red-600 rounded-full font-bold text-[12px] hover:bg-red-100 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* --- Loaded Data --- */}
        {(!loading && !error) && (
          <AnimatePresence mode="popLayout">

            {/* ================= STEP 8: EVENTS GRID ================= */}
            {activeTab === "EVENTS" && events.map((event) => (
              <motion.div 
                key={event.id} layout variants={itemVariants}
                className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all"
              >
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-sm ${getStatusBadgeColor(event.status)}`}>
                      {event.status}
                    </span>
                    <div className="flex flex-col items-end bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                      <span className="text-[10px] font-extrabold text-[#f97316] uppercase tracking-widest leading-none mb-1">
                        {event.date && event.date !== "TBA" ? `${event.date.split(" ")[0]} ${event.date.split(" ")[1]}` : "TBA"}
                      </span>
                      <span className="text-lg font-extrabold text-gray-900 leading-none">
                        {event.date && event.date !== "TBA" ? event.date.split(" ")[2] : ""}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-900 leading-tight group-hover:text-[#16a34a] transition-colors mb-4 truncate">
                    {event.title}
                  </h3>
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2.5 text-gray-500">
                      <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="text-[12px] font-bold truncate">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-gray-500">
                      <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="text-[12px] font-bold truncate">{event.venue}</span>
                    </div>
                  </div>
                </div>
                <div className="p-5 flex-1 bg-gray-50/50">
                  <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-[#16a34a]" /> Coordinator</p>
                  <p className="text-[13px] font-bold text-gray-900 truncate">{event.coordinator}</p>
                </div>
                <div className="p-4 border-t border-gray-100 flex gap-3 bg-white">
                  <button className="flex-1 py-3 bg-green-50 text-[#16a34a] rounded-full text-[12px] font-extrabold hover:bg-green-100 transition-colors flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Check In
                  </button>
                  <button 
                    onClick={() => setSelectedEvent(event)}
                    className="flex-1 py-3 bg-gray-50 text-gray-700 border border-gray-200 rounded-full text-[12px] font-extrabold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                  >
                    View Event <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}

            {activeTab === "EVENTS" && events.length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400 bg-white/40 rounded-[2.5rem] border border-dashed border-gray-200">
                <BookOpen className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-[13px] font-bold">No assigned events found.</p>
              </div>
            )}

            {/* ================= STEP 9: CAMPAIGNS GRID ================= */}
            {activeTab === "CAMPAIGNS" && campaigns.map((campaign) => {
              // --- STEP 14: Progress Mapping is direct from Number ---
              const progressPercent = Math.min((campaign.raised / (campaign.goal || 1)) * 100, 100);
              return (
                <motion.div 
                  key={campaign.id} layout variants={itemVariants}
                  className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all"
                >
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-sm ${getStatusBadgeColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                      <span className="px-2.5 py-1 bg-purple-50 text-purple-600 rounded-md text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 border border-purple-100">
                        <ShieldCheck className="w-3.5 h-3.5" /> {campaign.role}
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold text-gray-900 leading-tight group-hover:text-[#f97316] transition-colors mb-4 truncate">
                      {campaign.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[12px] font-bold text-gray-500">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" /> Deadline: <span className="text-gray-800">{campaign.deadline}</span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col gap-5 bg-gray-50/50">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Wallet className="w-3 h-3 text-[#16a34a]"/> Raised</p>
                        <p className="text-lg font-extrabold text-[#16a34a]">₹{(campaign.raised / 1000).toFixed(1)}k</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Target className="w-3 h-3 text-[#f97316]"/> Goal</p>
                        <p className="text-lg font-extrabold text-gray-900">₹{(campaign.goal / 1000).toFixed(1)}k</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Progress</span>
                        <span className="text-[12px] font-extrabold text-gray-900">{progressPercent.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-[#16a34a] to-[#4ade80]" style={{ width: `${progressPercent}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-gray-100 bg-white flex">
                    <button 
                      onClick={() => setSelectedCampaign(campaign)}
                      className="w-full py-3 bg-white border border-gray-200 rounded-full text-[12px] font-extrabold text-gray-700 hover:text-[#f97316] hover:border-[#f97316]/30 hover:bg-orange-50/50 shadow-sm flex items-center justify-center gap-2 transition-all"
                    >
                      View Details <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}

            {activeTab === "CAMPAIGNS" && campaigns.length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400 bg-white/40 rounded-[2.5rem] border border-dashed border-gray-200">
                <BookOpen className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-[13px] font-bold">No assigned campaigns found.</p>
              </div>
            )}

          </AnimatePresence>
        )}
      </motion.div>

      {/* ==================================================== */}
      {/* --- CENTERED DIALOG BOX: EVENT DETAILS & TASKS --- */}
      {/* ==================================================== */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedEvent(null)} 
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" 
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }} 
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
              className="relative w-full max-w-[650px] max-h-[90vh] bg-white shadow-2xl flex flex-col rounded-[2.5rem] overflow-hidden z-[100000]"
            >
              
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/80 shrink-0 backdrop-blur-md z-10">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedEvent(null)} 
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-[12px] font-extrabold text-gray-600 hover:text-gray-900 hover:bg-gray-50 shadow-sm transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <h2 className="text-lg font-extrabold text-gray-900 tracking-tight hidden sm:block">Event Details</h2>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#fafafa]">
                {/* Banner */}
                <div className={`h-40 w-full ${selectedEvent.bannerColor || 'bg-blue-100'} relative flex items-center justify-center overflow-hidden`}>
                  <ImageIcon className="w-16 h-16 text-black/10 mix-blend-overlay" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-8">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-sm mb-2 inline-block ${getStatusBadgeColor(selectedEvent.status)}`}>
                      {selectedEvent.status}
                    </span>
                    <h3 className="text-2xl font-extrabold text-white leading-tight drop-shadow-md">{selectedEvent.title}</h3>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  {/* Meta Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-sm flex flex-col gap-1">
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Calendar className="w-3 h-3 text-[#f97316]"/> Date</span>
                      <span className="text-[13px] font-bold text-gray-900">{selectedEvent.date}</span>
                    </div>
                    <div className="bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-sm flex flex-col gap-1">
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Clock className="w-3 h-3 text-purple-500"/> Time</span>
                      <span className="text-[13px] font-bold text-gray-900">{selectedEvent.time}</span>
                    </div>
                    <div className="bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-sm flex flex-col gap-1 col-span-2">
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><MapPin className="w-3 h-3 text-blue-500"/> Venue</span>
                      <div className="flex justify-between items-center">
                        <span className="text-[13px] font-bold text-gray-900">{selectedEvent.venue}</span>
                        <a href={selectedEvent.mapUrl} target="_blank" rel="noreferrer" className="text-[11px] font-extrabold text-blue-500 hover:underline">View Map</a>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-sm flex flex-col gap-1 col-span-2">
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Users className="w-3 h-3 text-[#16a34a]"/> Coordinator</span>
                      <span className="text-[13px] font-bold text-gray-900">{selectedEvent.coordinator}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Description</h4>
                    <p className="text-[13px] font-medium text-gray-600 leading-relaxed bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm">
                      {selectedEvent.description || "No description provided."}
                    </p>
                  </div>

                  {/* Volunteer Tasks / Checklist */}
                  {(selectedEvent.checklist && selectedEvent.checklist.length > 0) && (
                    <div>
                      <h4 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <CheckSquare className="w-3.5 h-3.5" /> Your Checklist
                      </h4>
                      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col divide-y divide-gray-50">
                        {selectedEvent.checklist.map((task, idx) => (
                          <label key={task.id || idx} className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors">
                            <input type="checkbox" defaultChecked={task.completed} className="w-5 h-5 rounded text-[#16a34a] border-gray-300 focus:ring-[#16a34a]" />
                            <span className={`text-[13px] font-bold ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{task.task}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload & Actions */}
                  <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100">
                    <h4 className="text-[11px] font-extrabold text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Play className="w-3.5 h-3.5" /> Event Actions
                    </h4>
                    <div className="flex flex-col gap-3">
                      <label className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 cursor-pointer shadow-sm hover:border-[#16a34a] transition-all">
                        <span className="text-[13px] font-bold text-gray-700">Mark Attendance (Check-in)</span>
                        <input type="checkbox" className="w-5 h-5 rounded text-[#16a34a] border-gray-300 focus:ring-[#16a34a]" />
                      </label>
                      <button className="flex items-center justify-center gap-2 w-full py-4 bg-white border border-gray-200 text-gray-700 rounded-xl text-[13px] font-extrabold hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all">
                        <UploadCloud className="w-4 h-4 text-blue-500" /> Upload Activity Images
                      </button>
                      <button className="w-full mt-2 py-4 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-full text-[13px] font-extrabold shadow-[0_8px_20px_rgba(22,163,74,0.25)] transition-all flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Complete Event Task
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* --- CENTERED DIALOG BOX: CAMPAIGN DETAILS --- */}
      {/* ==================================================== */}
      <AnimatePresence>
        {selectedCampaign && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedCampaign(null)} 
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" 
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }} 
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
              className="relative w-full max-w-[650px] max-h-[90vh] bg-white shadow-2xl flex flex-col rounded-[2.5rem] overflow-hidden z-[100000]"
            >
              
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/80 shrink-0 backdrop-blur-md z-10">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedCampaign(null)} 
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-[12px] font-extrabold text-gray-600 hover:text-gray-900 hover:bg-gray-50 shadow-sm transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <h2 className="text-lg font-extrabold text-gray-900 tracking-tight hidden sm:block">Campaign Details</h2>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#fafafa]">
                {/* Banner */}
                <div className={`h-40 w-full ${selectedCampaign.bannerColor || 'bg-blue-100'} relative flex items-center justify-center overflow-hidden`}>
                  <ImageIcon className="w-16 h-16 text-black/10 mix-blend-overlay" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-8">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-sm mb-2 inline-block ${getStatusBadgeColor(selectedCampaign.status)}`}>
                      {selectedCampaign.status}
                    </span>
                    <h3 className="text-2xl font-extrabold text-white leading-tight drop-shadow-md">{selectedCampaign.title}</h3>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  {/* Goal Progress Section */}
                  <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                    <h4 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Target className="w-3.5 h-3.5 text-[#f97316]" /> Funding Goal
                    </h4>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Raised</p>
                        <p className="text-2xl font-extrabold text-[#16a34a]">₹{(selectedCampaign.raised / 1000).toFixed(1)}k</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Target</p>
                        <p className="text-2xl font-extrabold text-gray-900">₹{(selectedCampaign.goal / 1000).toFixed(1)}k</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-[#16a34a] to-[#4ade80]" style={{ width: `${Math.min((selectedCampaign.raised / (selectedCampaign.goal || 1)) * 100, 100)}%` }}></div>
                    </div>
                    <p className="text-[11px] font-bold text-gray-500 mt-3 text-center border-t border-gray-50 pt-3">
                      Deadline: <strong className="text-gray-800">{selectedCampaign.deadline}</strong>
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Description</h4>
                    <p className="text-[13px] font-medium text-gray-600 leading-relaxed bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm">
                      {selectedCampaign.description || "No description provided."}
                    </p>
                  </div>

                  {/* Your Tasks */}
                  {(selectedCampaign.tasks && selectedCampaign.tasks.length > 0) && (
                    <div>
                      <h4 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> Your Assigned Tasks
                      </h4>
                      <ul className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm flex flex-col gap-3">
                        {selectedCampaign.tasks.map((task, i) => (
                          <li key={i} className="flex items-start gap-3 text-[13px] font-bold text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Timeline & Updates */}
                  {(selectedCampaign.timeline && selectedCampaign.timeline.length > 0) && (
                    <div>
                      <h4 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-purple-500" /> Recent Updates
                      </h4>
                      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                        <div className="relative pl-4 border-l-2 border-dashed border-gray-200 space-y-6 ml-2">
                          {selectedCampaign.timeline.map((item, i) => (
                            <div key={i} className="relative">
                              <div className="absolute -left-[23px] w-3 h-3 rounded-full bg-white border-[3px] border-purple-500" />
                              <div className="flex flex-col">
                                <span className="text-[10px] font-extrabold text-purple-500 uppercase tracking-widest mb-0.5">{item.date}</span>
                                <span className="text-[13px] font-bold text-gray-800">{item.event}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {(selectedCampaign.recentUpdates && selectedCampaign.recentUpdates.length > 0) && (
                          <div className="mt-6 pt-5 border-t border-gray-100">
                            <h5 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Coordinator Broadcasts</h5>
                            <ul className="flex flex-col gap-2 list-disc pl-4 marker:text-gray-300">
                              {selectedCampaign.recentUpdates.map((update, i) => (
                                <li key={i} className="text-[12px] font-bold text-gray-600 leading-relaxed">{update}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}