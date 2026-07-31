"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { 
  BookOpen, Calendar, Clock, CheckCircle2, 
  Award, MessageSquare, MapPin, Play, 
  UploadCloud, UserCheck, ShieldCheck, AlertCircle
} from "lucide-react";

// --- TYPESCRIPT INTERFACES ---
interface DashboardData {
  volunteer: {
    id: string;
    volunteerCode: string;
    fullName: string;
    joinedDate: string;
    designation: string;
    currentProgram: string;
  };
  stats: {
    programsAssigned: number;
    eventsAssigned: number;
    campaignsAssigned: number;
    attendance: number;
    certificates: number;
    hoursWorked: number;
    completedTasks: number;
    pendingTasks: number;
    unreadMessages: number;
  };
  todaySchedule: {
    id: string;
    title: string;
    location: string;
    startTime: string;
    endTime: string;
    status: string;
  }[];
}

export default function VolunteerDashboard() {
  // --- STATE ---
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/volunteer/dashboard", {
  cache: "no-store",
});

if (!res.ok) {
  const text = await res.text();
  console.log(text);
  throw new Error(`HTTP ${res.status}`);
}

const json = await res.json();
        
        if (json.success) {
          setData(json.data);
        } else {
          setError(json.message || "Failed to load dashboard data.");
        }
      } catch (err) {
        console.error(err);
        setError("An unexpected error occurred while fetching dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // --- HELPERS ---
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getFirstName = (fullName: string) => {
    return fullName ? fullName.split(" ")[0] : "Volunteer";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Maps backend status to UI timeline status
  const normalizeStatus = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "completed") return "completed";
    if (s === "active" || s === "ongoing" || s === "current") return "current";
    return "pending"; // Default for upcoming/pending
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

  if (loading) {
    return (
      <div className="flex flex-col gap-8 min-h-screen pb-10 p-4 animate-pulse">
        <div className="h-24 bg-white/50 rounded-[2rem] w-full max-w-2xl"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white/50 rounded-[2rem]"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-white/50 rounded-[2.5rem]"></div>
          <div className="grid grid-cols-2 gap-4 h-48">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white/50 rounded-[2rem]"></div>)}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4 opacity-50" />
        <h2 className="text-xl font-extrabold text-gray-800">Oops! Something went wrong.</h2>
        <p className="text-gray-500 font-bold mt-2">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-6 px-6 py-2.5 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-8 min-h-screen pb-10">
      
      {/* --- BACKGROUND ANIMATIONS --- */}
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

      {/* --- PAGE HEADER --- */}
      <motion.div 
        variants={containerVariants} initial="hidden" animate="show"
        className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mt-4"
      >
        <div>
          <motion.h1 variants={itemVariants} className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            {getGreeting()}, {getFirstName(data.volunteer.fullName)} 👋
          </motion.h1>
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 mt-4">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-[11px] font-extrabold uppercase tracking-widest">
              <UserCheck className="w-3.5 h-3.5 text-gray-400" /> {data.volunteer.volunteerCode}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-[#16a34a] rounded-lg text-[11px] font-extrabold uppercase tracking-widest border border-green-100">
              <ShieldCheck className="w-3.5 h-3.5" /> {data.volunteer.designation}
            </span>
            <span className="text-[12px] font-bold text-gray-400">
              Joined: {formatDate(data.volunteer.joinedDate)} • Current: <strong className="text-gray-700">{data.volunteer.currentProgram}</strong>
            </span>
          </motion.div>
        </div>

        {/* Dynamic Check-in Button */}
        <motion.div variants={itemVariants}>
          <button 
            onClick={() => setIsCheckedIn(!isCheckedIn)}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-[13px] transition-all transform hover:-translate-y-0.5 ${
              isCheckedIn 
              ? "bg-white border-2 border-gray-200 text-gray-600 shadow-sm" 
              : "bg-[#16A34A] text-white shadow-[0_8px_20px_rgba(22,163,74,0.25)] hover:bg-[#15803d]"
            }`}
          >
            {isCheckedIn ? <><CheckCircle2 className="w-4 h-4 text-[#16a34a]" /> Checked In</> : <><MapPin className="w-4 h-4" /> Check In Today</>}
          </button>
        </motion.div>
      </motion.div>

      {/* --- PRIMARY STATS (ROW 1) --- */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Programs Assigned", value: data.stats.programsAssigned, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Events Assigned", value: data.stats.eventsAssigned, icon: Calendar, color: "text-[#f97316]", bg: "bg-orange-50" },
          { label: "Campaigns Assigned", value: data.stats.campaignsAssigned, icon: Clock, color: "text-purple-500", bg: "bg-purple-50" },
          { label: "Attendance", value: `${data.stats.attendance}%`, icon: CheckCircle2, color: "text-[#16a34a]", bg: "bg-green-50" },
        ].map((stat, i) => (
          <motion.div key={i} variants={itemVariants} className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-transform group">
            <div className={`w-12 h-12 rounded-[1.2rem] ${stat.bg} ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-extrabold text-gray-900">{stat.value}</h3>
            <p className="text-[11px] font-extrabold text-gray-400 mt-1 uppercase tracking-widest">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* --- MAIN DASHBOARD GRID --- */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Schedule & Quick Actions */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Today's Schedule (Dotted Line Vertical Timeline) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-extrabold text-gray-900">Today's Schedule</h2>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[11px] font-extrabold uppercase tracking-widest">
                {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>

            {data.todaySchedule.length === 0 ? (
               <div className="py-12 flex flex-col items-center justify-center text-center">
                 <Calendar className="w-12 h-12 text-gray-300 mb-3" />
                 <p className="text-gray-500 font-bold text-[14px]">No events scheduled for today.</p>
                 <p className="text-gray-400 font-medium text-[12px]">Enjoy your day off or review your pending tasks!</p>
               </div>
            ) : (
              <div className="relative pl-6 border-l-2 border-dashed border-gray-200 space-y-8">
                {data.todaySchedule.map((item) => {
                  const statusUI = normalizeStatus(item.status);
                  return (
                    <div key={item.id} className="relative">
                      {/* Timeline Dot */}
                      <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-4 border-white ${
                        statusUI === 'completed' ? 'bg-[#16a34a]' : 
                        statusUI === 'current' ? 'bg-[#f97316] shadow-[0_0_0_4px_rgba(249,115,22,0.2)]' : 'bg-gray-300'
                      }`} />
                      
                      <div className={`p-5 rounded-[1.5rem] transition-colors border ${
                        statusUI === 'current' ? 'bg-orange-50/50 border-orange-100' : 'bg-gray-50/50 border-transparent hover:border-gray-100'
                      }`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <span className="text-[12px] font-extrabold text-[#f97316] mb-1 block">{item.startTime}</span>
                            <h3 className={`text-[16px] font-extrabold ${statusUI === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                              {item.title}
                            </h3>
                            <p className="text-[12px] font-bold text-gray-500 flex items-center gap-1.5 mt-2">
                              <MapPin className="w-3.5 h-3.5" /> {item.location}
                            </p>
                          </div>
                          
                          {/* Contextual Action Button based on status */}
                          {statusUI === 'current' && (
                            <Link href="/volunteer/activities">
                              <button className="px-5 py-2.5 bg-[#f97316] text-white rounded-full text-[12px] font-bold flex items-center gap-2 shadow-md hover:bg-[#ea580c] transition-colors">
                                <Play className="w-3.5 h-3.5" /> Start Task
                              </button>
                            </Link>
                          )}
                          {statusUI === 'pending' && (
                            <Link href="/volunteer/activities">
                              <button className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-full text-[12px] font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors">
                                <UploadCloud className="w-3.5 h-3.5" /> Upload Proof
                              </button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

        </div>

        {/* RIGHT COLUMN: Secondary Stats  */}
        <div className="flex flex-col gap-8">
          
          {/* Secondary Stats Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
             <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center gap-2">
               <Award className="w-6 h-6 text-yellow-500 mb-1" />
               <h3 className="text-2xl font-extrabold text-gray-900">{data.stats.certificates}</h3>
               <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Certificates</p>
             </div>
             <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center gap-2">
               <Clock className="w-6 h-6 text-blue-500 mb-1" />
               <h3 className="text-2xl font-extrabold text-gray-900">{data.stats.hoursWorked}</h3>
               <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Hours Logged</p>
             </div>
             <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center gap-2">
               <CheckCircle2 className="w-6 h-6 text-[#16a34a] mb-1" />
               <h3 className="text-2xl font-extrabold text-gray-900">{data.stats.completedTasks}</h3>
               <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Tasks Done</p>
             </div>
             <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center gap-2 relative">
               {data.stats.unreadMessages > 0 && <div className="absolute top-4 right-4 w-2 h-2 bg-[#f97316] rounded-full" />}
               <MessageSquare className={`w-6 h-6 mb-1 ${data.stats.unreadMessages > 0 ? "text-[#f97316]" : "text-gray-400"}`} />
               <h3 className="text-2xl font-extrabold text-gray-900">{data.stats.unreadMessages}</h3>
               <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Unread Msgs</p>
             </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}