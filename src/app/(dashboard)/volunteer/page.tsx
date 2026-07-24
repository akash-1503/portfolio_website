"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { 
  BookOpen, Calendar, Clock, CheckCircle2, 
  Award, MessageSquare, ArrowRight, MapPin, 
  Bell, Play, UploadCloud, UserCheck, CheckCircle, 
  AlertCircle, ShieldCheck, ChevronRight
} from "lucide-react";

// --- DUMMY DATA ---
const volunteerStats = {
  programsAssigned: 3,
  eventsAssigned: 5,
  pendingTasks: 7,
  attendance: "96%",
  certificates: 4,
  hoursWorked: 168,
  completedTasks: 52,
  unreadMessages: 3,
};

const todaySchedule = [
  { id: 1, time: "09:00 AM", title: "Education Drive", location: "City Central School", status: "completed" },
  { id: 2, time: "12:00 PM", title: "Food Distribution", location: "Community Hall, Sector 4", status: "current" },
  { id: 3, time: "03:00 PM", title: "Upload Attendance & Proof", location: "Volunteer Portal", status: "pending" },
];

const recentNotifications = [
  { id: 1, type: "task", message: "New Task Assigned: Logistics Planning", time: "10 mins ago", icon: AlertCircle, color: "text-blue-500", bg: "bg-blue-50" },
  { id: 2, type: "approval", message: "Attendance Approved for Tree Plantation", time: "2 hours ago", icon: CheckCircle, color: "text-[#16a34a]", bg: "bg-green-50" },
  { id: 3, type: "certificate", message: "Certificate Generated: Q3 Top Volunteer", time: "Yesterday", icon: Award, color: "text-purple-500", bg: "bg-purple-50" },
  { id: 4, type: "message", message: "New Message from Coordinator", time: "Yesterday", icon: MessageSquare, color: "text-[#f97316]", bg: "bg-orange-50" },
];

export default function VolunteerDashboard() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  // --- Animation Variants ---
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
        {/* Top-Right Dotted Arc & Paper Plane */}
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

        {/* Bottom-Left Wavy Line */}
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
            Good Morning, Akash 👋
          </motion.h1>
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 mt-4">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-[11px] font-extrabold uppercase tracking-widest">
              <UserCheck className="w-3.5 h-3.5 text-gray-400" /> VOL-00125
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-[#16a34a] rounded-lg text-[11px] font-extrabold uppercase tracking-widest border border-green-100">
              <ShieldCheck className="w-3.5 h-3.5" /> Community Volunteer
            </span>
            <span className="text-[12px] font-bold text-gray-400">
              Joined: 12 May 2026 • Current: <strong className="text-gray-700">Education Program</strong>
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
          { label: "Programs Assigned", value: volunteerStats.programsAssigned, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Events Assigned", value: volunteerStats.eventsAssigned, icon: Calendar, color: "text-[#f97316]", bg: "bg-orange-50" },
          { label: "Pending Tasks", value: volunteerStats.pendingTasks, icon: Clock, color: "text-purple-500", bg: "bg-purple-50" },
          { label: "Attendance", value: volunteerStats.attendance, icon: CheckCircle2, color: "text-[#16a34a]", bg: "bg-green-50" },
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

            <div className="relative pl-6 border-l-2 border-dashed border-gray-200 space-y-8">
              {todaySchedule.map((item, index) => (
                <div key={item.id} className="relative">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-4 border-white ${
                    item.status === 'completed' ? 'bg-[#16a34a]' : 
                    item.status === 'current' ? 'bg-[#f97316] shadow-[0_0_0_4px_rgba(249,115,22,0.2)]' : 'bg-gray-300'
                  }`} />
                  
                  <div className={`p-5 rounded-[1.5rem] transition-colors border ${
                    item.status === 'current' ? 'bg-orange-50/50 border-orange-100' : 'bg-gray-50/50 border-transparent hover:border-gray-100'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-[12px] font-extrabold text-[#f97316] mb-1 block">{item.time}</span>
                        <h3 className={`text-[16px] font-extrabold ${item.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          {item.title}
                        </h3>
                        <p className="text-[12px] font-bold text-gray-500 flex items-center gap-1.5 mt-2">
                          <MapPin className="w-3.5 h-3.5" /> {item.location}
                        </p>
                      </div>
                      
                      {/* Contextual Action Button based on status */}
                      {item.status === 'current' && (
                        <button className="px-5 py-2.5 bg-[#f97316] text-white rounded-full text-[12px] font-bold flex items-center gap-2 shadow-md hover:bg-[#ea580c] transition-colors">
                          <Play className="w-3.5 h-3.5" /> Start Task
                        </button>
                      )}
                      {item.status === 'pending' && (
                        <button className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-full text-[12px] font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors">
                          <UploadCloud className="w-3.5 h-3.5" /> Upload Proof
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
               <h3 className="text-2xl font-extrabold text-gray-900">{volunteerStats.certificates}</h3>
               <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Certificates</p>
             </div>
             <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center gap-2">
               <Clock className="w-6 h-6 text-blue-500 mb-1" />
               <h3 className="text-2xl font-extrabold text-gray-900">{volunteerStats.hoursWorked}</h3>
               <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Hours Logged</p>
             </div>
             <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center gap-2">
               <CheckCircle2 className="w-6 h-6 text-[#16a34a] mb-1" />
               <h3 className="text-2xl font-extrabold text-gray-900">{volunteerStats.completedTasks}</h3>
               <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Tasks Done</p>
             </div>
             <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center gap-2 relative">
               <div className="absolute top-4 right-4 w-2 h-2 bg-[#f97316] rounded-full" />
               <MessageSquare className="w-6 h-6 text-[#f97316] mb-1" />
               <h3 className="text-2xl font-extrabold text-gray-900">{volunteerStats.unreadMessages}</h3>
               <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Unread Msgs</p>
             </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}