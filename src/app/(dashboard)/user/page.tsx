"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { 
  Heart, Calendar, Target, Award, 
  ArrowRight, MapPin, Clock, 
  CreditCard, Image as ImageIcon, ShieldCheck, 
  AlertCircle, ChevronRight
} from "lucide-react";
import Link from "next/link";

// --- TYPESCRIPT INTERFACES (Matching Backend Payload) ---
interface Donation {
  id: string;
  amount: number;
  campaignTitle: string;
  date: string;
  status: string;
}

interface RegisteredEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  status: string;
}

interface UserDashboardData {
  user: {
    fullName: string;
    memberSince: string;
    totalDonated: number;
    impactScore: number;
  };
  stats: {
    activePrograms: number;
    upcomingEvents: number;
    liveCampaigns: number;
    certificatesEarned: number;
  };
  recentDonations: Donation[];
  registeredEvents: RegisteredEvent[];
}

export default function UserDashboardPage() {
  // --- STATE ---
  const [data, setData] = useState<UserDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- FETCH DATA (Workflow: JWT -> Route -> Service -> JSON) ---
  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);

      // Temporary frontend data
      const mockData: UserDashboardData = {
        user: {
          fullName: "User",
          memberSince: "Jan 2024",
          totalDonated: 1500,
          impactScore: 82,
        },

        stats: {
          activePrograms: 3,
          upcomingEvents: 5,
          liveCampaigns: 4,
          certificatesEarned: 2,
        },

        recentDonations: [
          {
            id: "1",
            amount: 1000,
            campaignTitle: "Education Support",
            date: "10 Aug 2026",
            status: "Completed",
          },
          {
            id: "2",
            amount: 500,
            campaignTitle: "Food Distribution",
            date: "05 Aug 2026",
            status: "Completed",
          },
        ],

        registeredEvents: [
          {
            id: "1",
            title: "Community Education Drive",
            date: "15 Aug 2026",
            time: "10:00 AM",
            location: "Community Hall",
            status: "Upcoming",
          },
          {
            id: "2",
            title: "Tree Plantation Campaign",
            date: "20 Aug 2026",
            time: "08:30 AM",
            location: "City Garden",
            status: "Upcoming",
          },
        ],
      };

      // Simulate loading
      await new Promise((resolve) => setTimeout(resolve, 500));

      setData(mockData);
      setLoading(false);
    };

    loadDashboard();
  }, []);

  // --- HELPERS ---
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getFirstName = (fullName: string) => {
    return fullName ? fullName.split(" ")[0] : "Supporter";
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

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="flex flex-col gap-8 min-h-screen pb-10 p-4 animate-pulse">
        <div className="h-24 bg-white/50 rounded-[2rem] w-full max-w-2xl"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white/50 rounded-[2rem]"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-white/50 rounded-[2.5rem]"></div>
          <div className="h-96 bg-white/50 rounded-[2.5rem]"></div>
        </div>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4 opacity-50" />
        <h2 className="text-xl font-extrabold text-gray-800">Unable to load dashboard</h2>
        <p className="text-gray-500 font-bold mt-2">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-6 px-6 py-2.5 bg-[#f97316] text-white rounded-full font-bold hover:bg-[#ea580c] shadow-md transition-colors"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-8 min-h-screen pb-10 overflow-x-hidden">
      
      {/* ==================================================== */}
      {/* --- CRAFT & DOTTED LINE BACKGROUND ANIMATIONS --- */}
      {/* ==================================================== */}
      <div className="absolute inset-0 pointer-events-none z-0">
        
        {/* Top Right: Dotted Loop & Floating Star */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] opacity-50 mix-blend-multiply">
          <svg className="absolute w-full h-full" viewBox="0 0 200 200" fill="none">
            <path d="M 150 0 C 150 100, 50 100, 0 200" stroke="#f97316" strokeWidth="1.5" strokeDasharray="4 6" strokeLinecap="round" opacity="0.5" />
            <path d="M 200 50 C 100 50, 100 150, 0 150" stroke="#16a34a" strokeWidth="1.5" strokeDasharray="4 6" strokeLinecap="round" opacity="0.5" />
          </svg>
          <motion.div
            animate={{ y: [-10, 10, -10], rotate: [0, 15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-20"
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
              <path d="M12 2L15 9L22 10L17 15L18.5 22L12 18L5.5 22L7 15L2 10L9 9L12 2Z" fill="#fb923c" fillOpacity="0.8" stroke="#ea580c" strokeWidth="1"/>
            </svg>
          </motion.div>
        </div>

        {/* Bottom Left: Wavy Dotted Path & Paper Plane */}
        <div className="absolute top-[40%] -left-20 w-[500px] h-[300px] opacity-40 mix-blend-multiply">
          <svg className="absolute w-full h-full overflow-visible" viewBox="0 0 500 300" fill="none">
            <path d="M 0 150 Q 125 0, 250 150 T 500 150" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6 8" strokeLinecap="round" opacity="0.4" />
          </svg>
          <motion.div
            animate={{ x: [-20, 20, -20], y: [-10, 10, -10], rotate: [-5, 5, -5] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[45%] left-[30%]"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-12 drop-shadow-md">
              <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </div>

      </div>

      {/* ==================================================== */}
      {/* --- PAGE HEADER --- */}
      {/* ==================================================== */}
      <motion.div 
        variants={containerVariants} initial="hidden" animate="show"
        className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mt-4"
      >
        <div>
          <motion.h1 variants={itemVariants} className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            {getGreeting()}, {getFirstName(data.user.fullName)} ✨
          </motion.h1>
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 mt-4">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[11px] font-extrabold uppercase tracking-widest border border-blue-100">
              <ShieldCheck className="w-3.5 h-3.5" /> Community Supporter
            </span>
            <span className="text-[12px] font-bold text-gray-400">
              Member Since: <strong className="text-gray-700">{data.user.memberSince}</strong>
            </span>
          </motion.div>
        </div>

        <motion.div variants={itemVariants}>
          <Link href="/user/donate">
            <button className="flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-[13px] transition-all transform hover:-translate-y-0.5 bg-[#f97316] text-white shadow-[0_8px_20px_rgba(249,115,22,0.25)] hover:bg-[#ea580c]">
              <Heart className="w-4 h-4 fill-white" /> Make a Donation
            </button>
          </Link>
        </motion.div>
      </motion.div>

      {/* ==================================================== */}
      {/* --- STATS OVERVIEW (ROW 1) --- */}
      {/* ==================================================== */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Impact", value: `₹${(data.user.totalDonated / 1000).toFixed(1)}k`, icon: Heart, color: "text-[#f97316]", bg: "bg-orange-50" },
          { label: "Active Programs", value: data.stats.activePrograms, icon: Target, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Upcoming Events", value: data.stats.upcomingEvents, icon: Calendar, color: "text-[#16a34a]", bg: "bg-green-50" },
          { label: "Certificates", value: data.stats.certificatesEarned, icon: Award, color: "text-purple-500", bg: "bg-purple-50" },
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

      {/* ==================================================== */}
      {/* --- MAIN DASHBOARD GRID --- */}
      {/* ==================================================== */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN (Span 2) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Registered Events (Dotted Line Vertical Timeline Design) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#16a34a]" /> Registered Events
              </h2>
              <Link href="/user/events">
                <button className="text-[11px] font-extrabold text-[#16a34a] hover:text-[#15803d] flex items-center gap-1 uppercase tracking-widest">
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>

            {data.registeredEvents.length === 0 ? (
               <div className="py-10 flex flex-col items-center justify-center text-center">
                 <Calendar className="w-12 h-12 text-gray-300 mb-3" />
                 <p className="text-gray-500 font-bold text-[14px]">No upcoming events.</p>
                 <Link href="/user/events" className="mt-3 px-5 py-2 bg-green-50 text-[#16a34a] rounded-full text-[12px] font-extrabold transition-colors hover:bg-green-100">
                   Explore Events
                 </Link>
               </div>
            ) : (
              <div className="relative pl-6 border-l-2 border-dashed border-gray-200 space-y-8">
                {data.registeredEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="relative">
                    {/* Timeline Dot */}
                    <div className="absolute -left-[31px] w-4 h-4 rounded-full border-4 border-white bg-[#16a34a] shadow-[0_0_0_4px_rgba(22,163,74,0.1)]" />
                    
                    <div className="p-5 rounded-[1.5rem] bg-gray-50/50 border border-gray-100 hover:border-green-200 transition-colors group">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <span className="text-[12px] font-extrabold text-[#16a34a] mb-1 block">{event.date} • {event.time}</span>
                          <h3 className="text-[16px] font-extrabold text-gray-900 group-hover:text-[#16a34a] transition-colors">
                            {event.title}
                          </h3>
                          <p className="text-[12px] font-bold text-gray-500 flex items-center gap-1.5 mt-2">
                            <MapPin className="w-3.5 h-3.5" /> {event.location}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-gray-500 shadow-sm whitespace-nowrap">
                          {event.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* RIGHT COLUMN (Span 1) */}
        <div className="flex flex-col gap-8">
          
          {/* UPDATED: NGO Gallery Teaser (Attractive New Design) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-[2.5rem] p-8 shadow-[0_12px_40px_rgba(79,70,229,0.25)] text-white relative overflow-hidden group hover:-translate-y-1 transition-all duration-300"
          >
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-fuchsia-500 opacity-20 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>

            {/* Custom SVG Craft (Polaroid/Photo motif) */}
            <svg className="absolute top-2 -right-4 w-40 h-40 opacity-20 group-hover:rotate-6 group-hover:scale-110 transition-transform duration-500 pointer-events-none" viewBox="0 0 100 100" fill="none">
              <rect x="15" y="20" width="45" height="55" rx="4" stroke="white" strokeWidth="2.5" strokeDasharray="4 4" transform="rotate(-15 35 45)" />
              <rect x="35" y="15" width="45" height="55" rx="4" stroke="white" strokeWidth="2.5" transform="rotate(10 55 40)" />
              <circle cx="58" cy="38" r="8" stroke="white" strokeWidth="2" />
              <path d="M 35 60 Q 45 45, 55 55 T 80 50" stroke="white" strokeWidth="2" strokeLinecap="round" transform="rotate(10 55 40)"/>
            </svg>
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                {/* Glassmorphic Icon Wrapper */}
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-white/20 group-hover:scale-110 transition-transform duration-300">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-2xl font-extrabold leading-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-100">
                  Impact Gallery
                </h3>
                
                <p className="text-[13px] font-bold text-indigo-100 mb-8 leading-relaxed opacity-90 max-w-[95%]">
                  Witness the smiles and milestones. See how your contributions translate into real-world magic.
                </p>
              </div>
              
              <Link href="/user/gallery" className="mt-auto inline-block">
                <button className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white text-white hover:text-indigo-700 backdrop-blur-md border border-white/30 rounded-full text-[12px] font-extrabold shadow-lg transition-all flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  Explore Gallery <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}