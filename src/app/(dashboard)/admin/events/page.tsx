"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Plus, Calendar, MapPin, Clock, 
  Users, MoreVertical, Edit3, Trash2, 
  Image as ImageIcon, FolderPlus,
  X, AlertCircle, CheckCircle2
} from "lucide-react";

// --- PHASE 15: TypeScript Interface ---
interface Program {
  id: string;
  name: string;
}

interface EventRecord {
  id: string;
  type: "Event" | "Campaign";
  title: string;
  category: string;
  status: string;
  startDate: string;
  endDate: string;
  venue?: string;
  coverImage?: string;
  maxVolunteers?: number;
  _count?: {
    volunteers: number;
  };
  program?: Program;
}

export default function EventsManagementPage() {
  // --- PHASE 1 & 3 & 4: States ---
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // --- MODAL STATES ---
  const [selectedEvent, setSelectedEvent] = useState<EventRecord | null>(null);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Programs for the Dropdown
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState("");

  // --- PHASE 2: Fetch Events ---
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/events");
      const data = await res.json();
      if (data.success) {
        setEvents(data.records);
      } else {
        setError(data.message || "Failed to load records.");
      }
    } catch (err) {
      setError("An error occurred while fetching records.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // --- PHASE 5: Search / Filter ---
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (event.category && event.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
    event.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- PHASE 6: Formatting Helpers ---
  const getDay = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).getDate().toString().padStart(2, '0');
  };

  const getMonthYear = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  // --- PHASE 9: Status Color Mapping ---
  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "UPCOMING": return "bg-[#16a34a] text-white";
      case "ACTIVE": return "bg-blue-500 text-white";
      case "COMPLETED": return "bg-purple-500 text-white";
      case "CANCELLED": return "bg-red-500 text-white";
      case "DRAFT":
      default: return "bg-gray-800 text-white";
    }
  };

  // --- PHASE 11 & 12: Assign Program ---
  const handleOpenProgramModal = async (event: EventRecord) => {
    setSelectedEvent(event);
    setIsProgramModalOpen(true);
    setActiveDropdown(null);
    
    // Fetch programs dynamically
    try {
      const res = await fetch("/api/admin/events?action=CREATE_DATA");
      const json = await res.json();
      if (json.success && json.data?.programs) {
        setPrograms(json.data.programs);
        if (json.data.programs.length > 0) {
          setSelectedProgramId(json.data.programs[0].id);
        }
      }
    } catch (e) {
      console.error("Failed to load programs", e);
    }
  };

  const handleAssignSave = async () => {
    if (!selectedEvent || !selectedProgramId) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/events", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ASSIGN_PROGRAM",
          recordType: selectedEvent.type,
          id: selectedEvent.id,
          programId: selectedProgramId
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsProgramModalOpen(false);
        fetchEvents(); // PHASE 14: Refresh List
      } else {
        alert(data.message || "Failed to assign program");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  // --- PHASE 13: Delete Record ---
  const handleDeleteConfirm = async () => {
    if (!selectedEvent) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/events?id=${selectedEvent.id}&type=${selectedEvent.type}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        setIsDeleteModalOpen(false);
        fetchEvents(); // PHASE 14: Refresh List
      } else {
        alert(data.message || "Failed to delete record");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col gap-8 min-h-screen pb-10">
      
      {/* --- CORNER BACKGROUND MOTIFS --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        
        {/* Top-Right Motif: Dotted Arc & Orange Airplane */}
        <div className="absolute top-0 right-10 w-64 h-64 opacity-50 mix-blend-multiply">
          <svg className="absolute w-full h-full" viewBox="0 0 200 200" fill="none">
            <path d="M 0 200 C 50 100, 150 100, 200 0" stroke="#f97316" strokeWidth="2" strokeDasharray="6 6" strokeLinecap="round" opacity="0.4" />
          </svg>
          <motion.div
            animate={{ y: [-5, 5, -5], rotate: [-2, 2, -2] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 right-10"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-45">
              <path d="M21.5 2.5L2 10.5L9.5 13.5L21.5 2.5Z" fill="#fb923c" opacity="0.8" />
              <path d="M21.5 2.5L14.5 22L9.5 13.5L21.5 2.5Z" fill="#f97316" />
            </svg>
          </motion.div>
        </div>

        {/* Top-Left Motif: Dotted Arc & Green Airplane */}
        <div className="absolute top-10 left-10 w-48 h-48 opacity-40 mix-blend-multiply">
          <svg className="absolute w-full h-full" viewBox="0 0 200 200" fill="none">
            <path d="M 200 200 C 150 100, 50 100, 0 0" stroke="#16a34a" strokeWidth="2" strokeDasharray="4 6" strokeLinecap="round" opacity="0.4" />
          </svg>
          <motion.div
            animate={{ y: [-8, 8, -8], x: [-2, 2, -2] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-5 left-5"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform -rotate-[120deg]">
              <path d="M22 2L15 22L11 13L2 9L22 2Z" fill="#22c55e" stroke="#16a34a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </div>

      </div>

      {/* --- PAGE HEADER --- */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mt-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-extrabold text-gray-900 tracking-tight"
          >
            Events & Campaigns
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[13px] font-bold text-gray-400 mt-1"
          >
            Manage all organizational events, volunteer tasks, and registrations.
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Link href="/admin/events/create">
            <button className="flex items-center gap-2 px-6 py-3.5 bg-[#16A34A] rounded-full font-bold text-[13px] text-white shadow-[0_8px_20px_rgba(22,163,74,0.25)] hover:bg-[#15803d] hover:shadow-[0_8px_20px_rgba(22,163,74,0.4)] transition-all transform hover:-translate-y-0.5">
              <Plus className="w-4 h-4" />
              Create New Event & Campaign
            </button>
          </Link>
        </motion.div>
      </div>

      {/* --- EVENTS GRID --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {loading ? (
            // --- PHASE 3: Skeletons ---
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-gray-100 h-[380px] animate-pulse">
                <div className="h-40 w-full bg-gray-200 rounded-t-[2rem]"></div>
                <div className="p-6 flex flex-col gap-4">
                  <div className="h-4 w-1/3 bg-gray-200 rounded-full"></div>
                  <div className="h-6 w-3/4 bg-gray-200 rounded-full"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded-full mt-4"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))
          ) : error ? (
            // --- PHASE 4: Error State ---
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-red-400">
              <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-[13px] font-bold">{error}</p>
              <button onClick={fetchEvents} className="mt-4 px-6 py-2 bg-red-50 text-red-500 rounded-full font-bold text-[13px] hover:bg-red-100 transition-colors">
                Retry
              </button>
            </div>
          ) : filteredEvents.map((event, index) => {
            
            // Safe logic for Volunteers progress
            const currentVols = event._count?.volunteers || 0;
            const requiredVols = event.maxVolunteers || 1; // Prevent division by zero
            const volProgress = Math.min((currentVols / requiredVols) * 100, 100);

            return (
              <motion.div 
                key={event.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all group flex flex-col ${activeDropdown === event.id ? 'z-50' : 'z-10'}`}
              >
                {/* --- PHASE 7: Image / Banner --- */}
                <div className={`h-40 w-full relative flex items-center justify-center overflow-hidden ${event.type === 'Campaign' ? 'bg-orange-100' : 'bg-green-100'}`}>
                  {event.coverImage ? (
                    <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-black/10 mix-blend-overlay" />
                  )}
                  
                  {/* --- PHASE 6: Formatted Date Badge --- */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm flex flex-col items-center">
                    <span className="text-[10px] font-extrabold text-[#f97316] uppercase tracking-widest leading-none mb-1">{getMonthYear(event.startDate)}</span>
                    <span className="text-lg font-extrabold text-gray-900 leading-none">{getDay(event.startDate)}</span>
                  </div>

                  {/* --- PHASE 9: Enum Status Badge --- */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold tracking-widest shadow-sm ${getStatusColor(event.status)}`}>
                      {event.status || "DRAFT"}
                    </span>
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-widest ${
                      event.type === 'Campaign' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {event.type}
                    </span>
                    {event.category && (
                      <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">
                        • {event.category}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-extrabold text-gray-900 leading-tight mb-4 group-hover:text-[#16a34a] transition-colors">
                    {event.title}
                  </h3>
                  
                  <div className="flex flex-col gap-2.5 mb-6">
                    <div className="flex items-center gap-2.5 text-gray-500">
                      <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="text-[13px] font-bold truncate">
                        {formatTime(event.startDate)} - {formatTime(event.endDate)}
                      </span>
                    </div>
                    {event.venue && (
                      <div className="flex items-center gap-2.5 text-gray-500">
                        <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="text-[13px] font-bold truncate">{event.venue}</span>
                      </div>
                    )}
                  </div>

                  {/* --- PHASE 8: Volunteers Progress --- */}
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-end mb-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-[12px] font-bold text-gray-500">Volunteers</span>
                      </div>
                      <span className="text-[12px] font-extrabold text-gray-900">
                        {currentVols} / {event.maxVolunteers || "∞"}
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          volProgress >= 100 ? 'bg-[#16a34a]' : 'bg-[#f97316]'
                        }`}
                        style={{ width: `${volProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="px-6 py-4 bg-gray-50 flex items-center justify-end border-t border-gray-100">
                  <div className="relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === event.id ? null : event.id)}
                      className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {activeDropdown === event.id && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-[1.2rem] shadow-[0_10px_40px_rgb(0,0,0,0.1)] border border-gray-100 py-2 z-[60] overflow-hidden text-left"
                        >
                          {/* --- PHASE 10: Keep Edit as Link --- */}
                          <Link href={`/admin/events/edit?id=${event.id}`} className="w-full text-left px-4 py-2.5 text-[12px] font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                            <Edit3 className="w-4 h-4 text-blue-500" /> Edit Details
                          </Link>
                          
                          <button 
                            onClick={() => handleOpenProgramModal(event)}
                            className="w-full text-left px-4 py-2.5 text-[12px] font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                          >
                            <FolderPlus className="w-4 h-4 text-[#16a34a]" /> Add to Program
                          </button>
                          <div className="h-px bg-gray-100 my-1"></div>
                          
                          <button 
                            onClick={() => {
                              setSelectedEvent(event);
                              setIsDeleteModalOpen(true);
                              setActiveDropdown(null);
                            }}
                            className="w-full text-left px-4 py-2.5 text-[12px] font-bold text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" /> Delete 
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {(!loading && !error && filteredEvents.length === 0) && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400">
            <Calendar className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-[13px] font-bold">No events found.</p>
        
          </div>
        )}
      </motion.div>

      {/* ==================================================== */}
      {/* --- MODAL: ADD TO PROGRAM --- */}
      {/* ==================================================== */}
      <AnimatePresence>
        {isProgramModalOpen && selectedEvent && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setIsProgramModalOpen(false)} 
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col z-[121] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50 shrink-0">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Add to Program</h2>
                  <p className="text-[13px] font-bold text-gray-400 mt-1 truncate max-w-[280px]">
                    {selectedEvent.title}
                  </p>
                </div>
                <button onClick={() => setIsProgramModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 bg-white hover:bg-gray-50 rounded-full transition-colors border border-gray-200 shadow-sm">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Select Program</label>
                  <select 
                    value={selectedProgramId} 
                    onChange={(e) => setSelectedProgramId(e.target.value)} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none cursor-pointer appearance-none"
                  >
                    {programs.map(prog => (
                      <option key={prog.id} value={prog.id}>{prog.name}</option>
                    ))}
                    {programs.length === 0 && <option disabled value="">No Programs Available</option>}
                  </select>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50/50 shrink-0 flex justify-end gap-3">
                <button onClick={() => setIsProgramModalOpen(false)} className="px-8 py-3.5 rounded-full font-bold text-[13px] text-gray-600 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleAssignSave} disabled={actionLoading || !selectedProgramId} className="px-10 py-3.5 rounded-full font-bold text-[13px] text-white bg-[#16A34A] hover:bg-[#15803d] shadow-[0_8px_20px_rgba(22,163,74,0.25)] transition-all flex items-center gap-2 disabled:opacity-50">
                  {actionLoading ? "Saving..." : <><CheckCircle2 className="w-4 h-4" /> Save</>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* --- MODAL: DELETE CONFIRMATION --- */}
      {/* ==================================================== */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedEvent && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setIsDeleteModalOpen(false)} 
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[2rem] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col items-center text-center z-[121]"
            >
              <button onClick={() => setIsDeleteModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors">
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 bg-red-50 text-red-500">
                <AlertCircle className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-extrabold text-gray-900 mb-2">Delete {selectedEvent.type}?</h3>
              <p className="text-[13px] font-bold text-gray-500 mb-8 leading-relaxed">
                Are you sure you want to completely delete <strong className="text-gray-800">{selectedEvent.title}</strong>? This action cannot be undone.
              </p>

              <div className="w-full flex gap-3">
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3.5 rounded-full font-bold text-[13px] text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button onClick={handleDeleteConfirm} disabled={actionLoading} className="flex-1 py-3.5 rounded-full font-bold text-[13px] text-white bg-red-500 hover:bg-red-600 shadow-[0_8px_20px_rgba(239,68,68,0.3)] transition-all disabled:opacity-50">
                  {actionLoading ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}