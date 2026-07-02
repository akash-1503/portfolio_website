"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import { 
  Heart, Target, Users, TreeDeciduous, 
  Stethoscope, Award, Flame, Star, 
  ArrowRight, BookOpen, HandHeart, 
  Calendar, Newspaper, MapPin, ChevronRight
} from "lucide-react";
import React from "react";

const kpiCards = [
  { title: "Total Donated", value: 125000, prefix: "₹", icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10", trend: "+12% this year", up: true },
  { title: "Campaigns", value: 15, prefix: "", icon: Target, color: "text-[#16A34A]", bg: "bg-[#16A34A]/10", trend: "3 active", up: true },
  { title: "Children Helped", value: 420, prefix: "", icon: Users, color: "text-[#F97316]", bg: "bg-[#F97316]/10", trend: "+45 this month", up: true },
  { title: "Meals Sponsored", value: 1200, prefix: "", icon: HandHeart, color: "text-amber-500", bg: "bg-amber-500/10", trend: "+200 this week", up: true },
  { title: "Trees Planted", value: 85, prefix: "", icon: TreeDeciduous, color: "text-emerald-500", bg: "bg-emerald-500/10", trend: "Goal: 100", up: true },
  { title: "Medical Camps", value: 4, prefix: "", icon: Stethoscope, color: "text-blue-500", bg: "bg-blue-500/10", trend: "1 upcoming", up: true },
  { title: "Certificates", value: 12, prefix: "", icon: Award, color: "text-purple-500", bg: "bg-purple-500/10", trend: "2 new", up: true },
  { title: "Reward Points", value: 8500, prefix: "", icon: Star, color: "text-indigo-500", bg: "bg-indigo-500/10", trend: "Platinum Tier", up: true },
];

const impactStats = [
  { label: "Children Educated", value: 25, total: 30, color: "#8B5CF6" },
  { label: "Families Supported", value: 12, total: 15, color: "#3B82F6" },
  { label: "Books Distributed", value: 150, total: 200, color: "#F59E0B" },
  { label: "Scholarships", value: 3, total: 5, color: "#10B981" },
];

// Simple SVG mini line graph
const MiniGraph = ({ color }: { color: string }) => (
  <svg width="40" height="16" viewBox="0 0 40 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 12C4 12 8 8 12 10C16 12 20 4 24 6C28 8 32 2 36 4C38 5 39 8 40 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CircularProgressSmall = ({ value, total, color }: { value: number, total: number, color: string }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / total) * circumference;

  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="24" cy="24" r={radius} stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          cx="24" cy="24" r={radius} stroke={color} strokeWidth="4" fill="transparent"
          strokeDasharray={circumference} strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default function UserDashboard() {
  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full">
      
      {/* MAIN CONTENT (Left) */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Top Hero Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] to-slate-900 rounded-3xl p-8 lg:p-10 text-white shadow-2xl"
        >
          {/* Abstract leaf shapes / background */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#16A34A] opacity-20 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-0 right-10 w-64 h-64 bg-[#F97316] opacity-10 rounded-full blur-[60px]"></div>
          
          <svg className="absolute right-0 bottom-0 opacity-10 w-80 h-80 transform translate-x-1/4 translate-y-1/4" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFFFFF" d="M47.7,-57.2C59.9,-46.3,67,-29.4,69.5,-12.3C72,4.8,70,22.2,60.8,36C51.6,49.8,35.2,59.9,16.5,65.3C-2.2,70.7,-23.1,71.4,-38.9,62.8C-54.7,54.2,-65.4,36.3,-70,17.2C-74.6,-1.9,-73.1,-22.2,-62.4,-37.2C-51.7,-52.2,-31.8,-61.9,-14.2,-64.9C3.4,-67.9,21,-64.1,47.7,-57.2Z" transform="translate(100 100)" />
          </svg>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-sm font-bold mb-6 border border-white/10">
                  <Flame className="w-4 h-4 text-[#F97316]" />
                  <span className="text-white">12 Month Donation Streak</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight">Thank you for making a difference ❤️</h1>
                <p className="text-slate-300 font-medium text-lg max-w-xl leading-relaxed">
                  Michael, your consistent support has transformed lives. Every contribution you make ripples through our community, bringing hope and tangible change.
                </p>
              </div>

              {/* Badges / Quick Stats */}
              <div className="grid grid-cols-2 gap-4 min-w-[240px]">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-white/15 transition-colors">
                  <Award className="w-8 h-8 text-amber-400 mb-2" />
                  <span className="text-xl font-bold text-white">Platinum</span>
                  <span className="text-xs text-slate-300 font-medium">Membership Level</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-white/15 transition-colors">
                  <Star className="w-8 h-8 text-[#16A34A] mb-2" />
                  <span className="text-xl font-bold text-white">98.5</span>
                  <span className="text-xs text-slate-300 font-medium">Impact Score</span>
                </div>
              </div>
            </div>
            
            {/* Horizontal Stats Bar */}
            <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Total Donations</p>
                <p className="text-2xl font-bold text-white">₹<CountUp end={125000} duration={2} separator="," /></p>
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Lives Impacted</p>
                <p className="text-2xl font-bold text-white"><CountUp end={842} duration={2} separator="," />+</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Campaigns Supported</p>
                <p className="text-2xl font-bold text-white"><CountUp end={15} duration={2} /></p>
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">Volunteer Hours</p>
                <p className="text-2xl font-bold text-white"><CountUp end={42} duration={2} /> hrs</p>
              </div>
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
              className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-50 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-2xl ${card.bg} ${card.color}`}>
                  <card.icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col items-end">
                  <MiniGraph color={card.up ? "#16A34A" : "#ef4444"} />
                  <span className="text-[10px] font-bold text-slate-400 mt-1">{card.trend}</span>
                </div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-slate-500 font-semibold text-sm mb-1">{card.title}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-[#0F172A]">
                    {card.prefix}<CountUp end={card.value} duration={2} separator="," />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Specific Impact Dashboards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">Your Direct Impact</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Milestones you've helped us achieve this year.</p>
            </div>
            <button className="hidden sm:flex text-sm font-bold text-[#16A34A] hover:text-[#16A34A]/80 items-center gap-1 group">
              View Detailed Report <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {impactStats.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-slate-200 transition-colors">
                <CircularProgressSmall value={item.value} total={item.total} color={item.color} />
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-[#0F172A]"><CountUp end={item.value} duration={2} /></span>
                  <span className="text-xs font-semibold text-slate-500">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* RIGHT PANEL */}
      <div className="w-full xl:w-[340px] flex flex-col gap-6">
        
        {/* Recommended Campaigns */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-[#0F172A]">Recommended</h3>
            <button className="text-slate-400 hover:text-[#16A34A] transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Campaign Item */}
            <div className="group cursor-pointer">
              <div className="w-full h-32 rounded-2xl bg-slate-200 mb-3 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600&auto=format&fit=crop" alt="Campaign" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-white border border-white/20">
                  Ending in 3 days
                </div>
              </div>
              <h4 className="font-bold text-[#0F172A] text-sm group-hover:text-[#16A34A] transition-colors leading-tight">Emergency Food Relief for Flood Victims</h4>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1 overflow-hidden">
                    <div className="bg-[#16A34A] h-1.5 rounded-full w-[75%]"></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">75% Funded</span>
                </div>
                <button className="px-3 py-1 bg-[#16A34A]/10 text-[#16A34A] rounded-lg text-xs font-bold hover:bg-[#16A34A] hover:text-white transition-colors">
                  Donate
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Impact Story */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#16A34A] to-emerald-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl translate-y-1/3 -translate-x-1/3"></div>
          
          <BookOpen className="w-6 h-6 text-white/80 mb-3" />
          <h3 className="font-bold text-lg mb-2 leading-tight">Your Impact in Action</h3>
          <p className="text-white/80 text-sm mb-4 leading-relaxed">
            "Because of your recent contribution to the Education Drive, 15 young girls in rural Rajasthan received full-year scholarships."
          </p>
          <button className="flex items-center gap-2 text-sm font-bold text-white hover:text-emerald-100 transition-colors group">
            Read Full Story <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-[#0F172A]">Upcoming Events</h3>
          </div>
          <div className="space-y-4">
            <div className="flex gap-3 group cursor-pointer">
              <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 group-hover:border-[#F97316]/30 group-hover:bg-[#F97316]/5 transition-colors">
                <span className="text-[10px] font-bold text-[#F97316] uppercase">Oct</span>
                <span className="text-lg font-black text-[#0F172A]">12</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-[#0F172A] text-sm group-hover:text-[#F97316] transition-colors">Annual Gala Dinner</h4>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" /> City Convention Center</p>
              </div>
            </div>
            
            <div className="flex gap-3 group cursor-pointer">
              <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 group-hover:border-[#16A34A]/30 group-hover:bg-[#16A34A]/5 transition-colors">
                <span className="text-[10px] font-bold text-[#16A34A] uppercase">Oct</span>
                <span className="text-lg font-black text-[#0F172A]">24</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-[#0F172A] text-sm group-hover:text-[#16A34A] transition-colors">Mega Health Camp</h4>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" /> Greenfield Village</p>
              </div>
            </div>
          </div>
          <button className="w-full mt-5 py-2.5 bg-slate-50 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-100 hover:text-[#0F172A] transition-colors">
            View All Events
          </button>
        </motion.div>

      </div>
    </div>
  );
}
