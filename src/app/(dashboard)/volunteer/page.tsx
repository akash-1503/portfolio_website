"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import { 
  Heart, Calendar, Users, Award, 
  CheckSquare, Activity, Star, Trophy,
  TrendingUp, TrendingDown, ArrowRight,
  Sun, MessageCircle, MapPin, Clock
} from "lucide-react";
import React from "react";

const kpiCards = [
  { title: "Hours Volunteered", value: 142, icon: Activity, color: "text-blue-500", bg: "bg-blue-500/10", trend: "+12% this month", up: true, progress: 75, suffix: "h" },
  { title: "Events Participated", value: 28, icon: Calendar, color: "text-[#16A34A]", bg: "bg-[#16A34A]/10", trend: "+3 new", up: true, progress: 60, suffix: "" },
  { title: "Beneficiaries Helped", value: 850, icon: Users, color: "text-[#F97316]", bg: "bg-[#F97316]/10", trend: "+150 this week", up: true, progress: 90, suffix: "+" },
  { title: "Certificates Earned", value: 4, icon: Award, color: "text-purple-500", bg: "bg-purple-500/10", trend: "1 pending", up: true, progress: 100, suffix: "" },
  { title: "Current Tasks", value: 3, icon: CheckSquare, color: "text-rose-500", bg: "bg-rose-500/10", trend: "2 due today", up: false, progress: 40, suffix: "" },
  { title: "Attendance", value: 94, icon: Clock, color: "text-teal-500", bg: "bg-teal-500/10", trend: "+2% average", up: true, progress: 94, suffix: "%" },
  { title: "Impact Score", value: 920, icon: Star, color: "text-amber-500", bg: "bg-amber-500/10", trend: "Top 5%", up: true, progress: 85, suffix: "" },
  { title: "Volunteer Rank", value: 2, icon: Trophy, color: "text-indigo-500", bg: "bg-indigo-500/10", trend: "Level 4 Hero", up: true, progress: 80, suffix: "" },
];

const impactSummary = [
  { label: "Lives Impacted", value: 1250, total: 2000, color: "#16A34A" },
  { label: "Meals Distributed", value: 8400, total: 10000, color: "#F97316" },
  { label: "Trees Planted", value: 320, total: 500, color: "#3B82F6" },
  { label: "Children Educated", value: 45, total: 50, color: "#8B5CF6" },
];

// Simple SVG sparkline component
const Sparkline = ({ color }: { color: string }) => (
  <svg width="60" height="20" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 15C5 15 10 10 15 12C20 14 25 5 30 8C35 11 40 2 45 5C50 8 55 18 60 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M0 15C5 15 10 10 15 12C20 14 25 5 30 8C35 11 40 2 45 5C50 8 55 18 60 18" stroke={color} strokeOpacity="0.3" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="blur-[2px]" />
  </svg>
);

const CircularProgress = ({ value, total, color, label }: { value: number, total: number, color: string, label: string }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / total) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl opacity-20 transition-transform group-hover:scale-150 duration-500" style={{ backgroundColor: color, transform: 'translate(30%, -30%)' }} />
      
      <div className="relative w-24 h-24 flex items-center justify-center mb-3">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-100"
          />
          {/* Progress Circle */}
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="48"
            cy="48"
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-[#0F172A]">
            <CountUp end={value} duration={2.5} separator="," />
          </span>
        </div>
      </div>
      <span className="text-sm font-semibold text-slate-600 text-center">{label}</span>
    </div>
  );
};

export default function VolunteerDashboard() {
  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full">
      
      {/* MAIN CONTENT (Left) */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Welcome Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-[#16A34A] rounded-3xl p-8 text-white shadow-lg shadow-[#16A34A]/20"
        >
          {/* Abstract leaf shapes / background */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-10 w-40 h-40 bg-black opacity-10 rounded-full blur-2xl"></div>
          
          <svg className="absolute right-0 bottom-0 opacity-20 w-64 h-64 transform translate-x-1/4 translate-y-1/4" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFFFFF" d="M47.7,-57.2C59.9,-46.3,67,-29.4,69.5,-12.3C72,4.8,70,22.2,60.8,36C51.6,49.8,35.2,59.9,16.5,65.3C-2.2,70.7,-23.1,71.4,-38.9,62.8C-54.7,54.2,-65.4,36.3,-70,17.2C-74.6,-1.9,-73.1,-22.2,-62.4,-37.2C-51.7,-52.2,-31.8,-61.9,-14.2,-64.9C3.4,-67.9,21,-64.1,47.7,-57.2Z" transform="translate(100 100)" />
          </svg>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold mb-4"
              >
                <Sun className="w-4 h-4 text-yellow-300" />
                Good Morning
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">Welcome back, Sarah 👋</h1>
              <p className="text-white/80 font-medium text-lg max-w-xl">
                Thank you for making a difference. "The best way to find yourself is to lose yourself in the service of others."
              </p>
            </div>
            
            <div className="flex flex-col items-center bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl min-w-[200px]">
              <span className="text-sm font-bold text-white/90 mb-2">Profile Completion</span>
              <div className="w-full bg-black/20 rounded-full h-2.5 mb-2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "85%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-white h-2.5 rounded-full"
                ></motion.div>
              </div>
              <span className="text-2xl font-black">85%</span>
            </div>
          </div>
        </motion.div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-50 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-2xl ${card.bg} ${card.color}`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <Sparkline color={card.up ? "#16A34A" : "#ef4444"} />
              </div>
              
              <div className="relative z-10">
                <h3 className="text-slate-500 font-semibold text-sm mb-1">{card.title}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-[#0F172A]">
                    <CountUp end={card.value} duration={2} separator="," />
                    {card.suffix}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between relative z-10">
                <div className={`flex items-center gap-1 text-xs font-bold ${card.up ? 'text-[#16A34A]' : 'text-rose-500'}`}>
                  {card.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {card.trend}
                </div>
                
                {/* Progress bar line */}
                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${card.progress}%` }}
                    className={`h-full rounded-full ${card.up ? 'bg-[#16A34A]' : 'bg-rose-500'}`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Impact Summary Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4 mt-2">
            <h2 className="text-xl font-bold text-[#0F172A]">Your Impact</h2>
            <button className="text-sm font-semibold text-[#16A34A] hover:text-[#16A34A]/80 flex items-center gap-1">
              View detailed report <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {impactSummary.map((item, index) => (
              <CircularProgress 
                key={index} 
                value={item.value} 
                total={item.total} 
                color={item.color} 
                label={item.label} 
              />
            ))}
          </div>
        </motion.div>

      </div>

      {/* RIGHT PANEL (Sidebar within Dashboard) */}
      <div className="w-full xl:w-80 flex flex-col gap-6">
        
        {/* Today's Schedule */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#F97316] to-[#16A34A]"></div>
          <h3 className="font-bold text-lg text-[#0F172A] mb-4">Today's Schedule</h3>
          
          <div className="space-y-4">
            <div className="flex gap-4 relative">
              <div className="absolute left-[11px] top-8 bottom-[-16px] w-[2px] bg-slate-100 border-l border-dashed border-slate-200"></div>
              <div className="flex flex-col items-center z-10">
                <div className="w-6 h-6 rounded-full bg-[#F97316]/20 border-2 border-white shadow-sm flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#F97316]"></div>
                </div>
              </div>
              <div className="flex-1 bg-slate-50 p-3 rounded-2xl border border-slate-100 hover:border-[#F97316]/30 transition-colors cursor-pointer">
                <p className="text-xs font-bold text-[#F97316] mb-1">10:00 AM - 12:00 PM</p>
                <h4 className="font-bold text-[#0F172A] text-sm">Food Distribution</h4>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Community Center</p>
              </div>
            </div>

            <div className="flex gap-4 relative">
              <div className="flex flex-col items-center z-10">
                <div className="w-6 h-6 rounded-full bg-[#16A34A]/20 border-2 border-white shadow-sm flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#16A34A]"></div>
                </div>
              </div>
              <div className="flex-1 bg-slate-50 p-3 rounded-2xl border border-slate-100 hover:border-[#16A34A]/30 transition-colors cursor-pointer">
                <p className="text-xs font-bold text-[#16A34A] mb-1">02:00 PM - 04:00 PM</p>
                <h4 className="font-bold text-[#0F172A] text-sm">Youth Mentoring</h4>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Online Room A</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Latest Announcement */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#0F172A] to-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-1 bg-rose-500/20 text-rose-300 text-[10px] font-bold rounded-lg uppercase tracking-wider">Announcement</span>
          </div>
          <h3 className="font-bold text-lg mb-2 leading-tight">Annual Charity Gala 2026</h3>
          <p className="text-slate-300 text-sm mb-4">Join us for our biggest fundraising event of the year. Volunteers needed for organization.</p>
          <button className="w-full py-2.5 bg-white text-[#0F172A] font-bold rounded-xl text-sm hover:bg-slate-100 transition-colors">
            Sign Up Now
          </button>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
        >
          <h3 className="font-bold text-lg text-[#0F172A] mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-50 hover:bg-[#16A34A]/5 hover:text-[#16A34A] border border-slate-100 hover:border-[#16A34A]/20 transition-all group">
              <CheckSquare className="w-6 h-6 text-slate-400 group-hover:text-[#16A34A] transition-colors" />
              <span className="text-xs font-bold text-slate-600 group-hover:text-[#16A34A]">Log Hours</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-50 hover:bg-[#F97316]/5 hover:text-[#F97316] border border-slate-100 hover:border-[#F97316]/20 transition-all group">
              <MessageCircle className="w-6 h-6 text-slate-400 group-hover:text-[#F97316] transition-colors" />
              <span className="text-xs font-bold text-slate-600 group-hover:text-[#F97316]">Get Help</span>
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
