"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { 
  Search, Calendar, Users, MapPin, Clock, 
  Download, LayoutGrid, Ticket, Mail
} from "lucide-react";

// ============================================================================
// INTERFACES
// ============================================================================

interface Registration {
  id: string;
  userName: string;
  userEmail: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  registeredAt: string;
}

// ============================================================================
// UTILITY FORMATTERS
// ============================================================================

const formatDate = (date: string) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date: string) => {
  if (!date) return "-";
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function AdminRegistrationsPage() {
  const [mounted, setMounted] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    upcomingEvents: 0,
    latestRegistration: null as string | null,
  });
  
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);

    const fetchRegistrations = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/admin/registrations", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load registrations.");
        }

        if (!result.success) {
          throw new Error(result.message || "Failed to load registrations.");
        }

        setRegistrations(result.data.registrations);
        setStats(result.data.stats);

      } catch (error) {
        console.error("Failed to load registrations:", error);
        setRegistrations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  // --- FILTERING ---
  const filteredRegistrations = registrations.filter(reg => 
    reg.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reg.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reg.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- HELPERS ---
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // --- ANIMATIONS ---
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="relative flex flex-col gap-8 min-h-screen pb-24 overflow-x-hidden w-full bg-[#fafafa]">
      
      {/* ==================================================== */}
      {/* --- BACKGROUND ELEMENTS (CLEAN/WHITE THEME) --- */}
      {/* ==================================================== */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] right-[5%] w-[300px] h-[300px] opacity-10 mix-blend-multiply">
          <svg className="absolute w-full h-full" viewBox="0 0 200 200" fill="none">
            <path d="M 50 150 C 50 50, 150 50, 200 150" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6 8" strokeLinecap="round" opacity="0.4" />
          </svg>
          <motion.div animate={{ y: [-15, 15, -15], rotate: [0, -10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-10 left-10">
            <LayoutGrid className="w-10 h-10 text-blue-400 opacity-60 drop-shadow-md" />
          </motion.div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* --- 1. HEADER SECTION --- */}
      {/* ==================================================== */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="relative z-10 px-4 md:px-8 mt-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.h1 variants={itemVariants} className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
              Event Registrations
            </motion.h1>
            <motion.p variants={itemVariants} className="text-[14px] font-bold text-gray-500 max-w-2xl">
              Track who is attending your upcoming events and activities.
            </motion.p>
          </div>
          <motion.div variants={itemVariants}>
            <button className="px-6 py-3.5 bg-white text-gray-900 border border-gray-300 rounded-full text-[13px] font-extrabold shadow-sm hover:bg-gray-50 hover:shadow transition-all flex items-center gap-2">
              <Download className="w-4 h-4 text-gray-600" /> Export CSV
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* ==================================================== */}
      {/* --- 2. QUICK STATISTICS --- */}
      {/* ==================================================== */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-8">
        <motion.div variants={itemVariants} className="bg-white rounded-[1.5rem] p-6 border border-gray-200 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
            <Users className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-1">Total Registrations</p>
            <h3 className="text-3xl font-extrabold text-gray-900">{stats.totalRegistrations}</h3>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-[1.5rem] p-6 border border-gray-200 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center">
            <Calendar className="w-7 h-7 text-green-600" />
          </div>
          <div>
            <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-1">Upcoming Events</p>
            <h3 className="text-3xl font-extrabold text-gray-900">
               {stats.upcomingEvents}
            </h3>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-white rounded-[1.5rem] p-6 border border-gray-200 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
            <Ticket className="w-7 h-7 text-orange-600" />
          </div>
          <div>
            <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-1">Latest Registration</p>
            <h3 className="text-[15px] font-extrabold text-gray-900 leading-tight mt-1">
               {stats.latestRegistration ? formatDateTime(stats.latestRegistration) : "-"}
            </h3>
          </div>
        </motion.div>
      </motion.div>

      {/* ==================================================== */}
      {/* --- 3. SEARCH CONTROLS --- */}
      {/* ==================================================== */}
      <div className="relative z-10 px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by user or event name..."
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-300 rounded-full text-[13px] font-bold text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 outline-none shadow-sm transition-all"
          />
        </div>
      </div>

      {/* ==================================================== */}
      {/* --- 4. REGISTRATIONS DATA TABLE --- */}
      {/* ==================================================== */}
      <div className="relative z-10 px-4 md:px-8">
        
        {loading ? (
           // LOADING STATE SKELETON
           <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm p-6 overflow-hidden">
             <div className="flex gap-4 mb-6">
               <div className="w-full h-12 bg-gray-100 animate-pulse rounded-xl"></div>
             </div>
             {[1, 2, 3, 4, 5].map(i => (
               <div key={i} className="flex items-center gap-6 py-4 border-t border-gray-50">
                 <div className="w-12 h-12 rounded-full bg-gray-100 animate-pulse"></div>
                 <div className="flex-1 space-y-2">
                   <div className="h-4 bg-gray-100 rounded-full w-1/4 animate-pulse"></div>
                   <div className="h-3 bg-gray-100 rounded-full w-1/3 animate-pulse"></div>
                 </div>
                 <div className="w-32 h-4 bg-gray-100 rounded-full animate-pulse"></div>
                 <div className="w-24 h-4 bg-gray-100 rounded-full animate-pulse"></div>
               </div>
             ))}
           </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden">
            
            <div className="overflow-x-auto custom-scrollbar w-full">
              <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-4 px-6 text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">User Details</th>
                    <th className="py-4 px-6 text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">Event Name</th>
                    <th className="py-4 px-6 text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">Event Date</th>
                    <th className="py-4 px-6 text-[10px] font-extrabold text-gray-500 uppercase tracking-widest text-right">Registered At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <AnimatePresence>
                    {filteredRegistrations.map((reg) => (
                      <motion.tr 
                        key={reg.id} 
                        layout 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="hover:bg-gray-50 transition-colors group"
                      >
                        {/* COLUMN 1: User */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-[13px] border border-blue-200 shrink-0">
                              {getInitials(reg.userName)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-extrabold text-gray-900 text-[14px]">{reg.userName}</span>
                              <span className="font-bold text-gray-500 text-[11px] flex items-center gap-1.5 mt-0.5">
                                <Mail className="w-3 h-3"/> {reg.userEmail}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* COLUMN 2: Event Name */}
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="font-extrabold text-gray-900 text-[14px]">{reg.eventName}</span>
                            <span className="font-bold text-gray-500 text-[11px] flex items-center gap-1.5 mt-0.5">
                              <MapPin className="w-3 h-3" /> {reg.eventLocation}
                            </span>
                          </div>
                        </td>

                        {/* COLUMN 3: Event Date */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span className="font-bold text-gray-700 text-[13px]">{formatDate(reg.eventDate)}</span>
                          </div>
                        </td>

                        {/* COLUMN 4: Registered At */}
                        <td className="py-4 px-6 text-right">
                          <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
                            <Clock className="w-3.5 h-3.5 text-gray-500" />
                            <span className="font-extrabold text-gray-700 text-[12px]">{formatDateTime(reg.registeredAt)}</span>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
              
              {filteredRegistrations.length === 0 && (
                <div className="py-24 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-[16px] font-extrabold text-gray-900 mb-2">No Registrations Found</h3>
                  <p className="text-[13px] font-bold text-gray-500 max-w-sm">
                    {searchQuery ? "No users or events match your current search query." : "No one has registered for any events yet."}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

    </div>
  );
}