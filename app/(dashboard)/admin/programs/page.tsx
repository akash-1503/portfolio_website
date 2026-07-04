"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Filter, Plus, BookOpen, Target, Calendar, Users, 
  Activity, Eye, Edit3, Trash2, X, ChevronDown, 
  MoreVertical, Heart, UploadCloud, CheckCircle2, TrendingUp
} from "lucide-react";

// --- DUMMY DATA ---
const kpiData = [
  { title: "Total Programs", value: "12", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50" },
  { title: "Active Programs", value: "8", icon: Activity, color: "text-[#16a34a]", bg: "bg-green-50" },
  { title: "Running Events", value: "24", icon: Calendar, color: "text-[#f97316]", bg: "bg-orange-50" },
  { title: "Active Campaigns", value: "18", icon: Target, color: "text-purple-500", bg: "bg-purple-50" },
  { title: "Volunteers Assigned", value: "325", icon: Users, color: "text-rose-500", bg: "bg-rose-50" },
  { title: "Beneficiaries", value: "5,250", icon: Heart, color: "text-yellow-600", bg: "bg-yellow-50" },
];

const programCategories = [
  "Education", "Healthcare", "Environment", "Food Distribution", 
  "Women Empowerment", "Child Welfare", "Blood Donation", "Rural Development", 
  "Disability Support", "Animal Welfare", "Sustainability", "Disaster Relief"
];

const initialPrograms = [
  {
    id: "PRG-001", name: "Education for All", category: "Education", coordinator: "Rahul Sharma", manager: "Anita Desai",
    budget: "₹15,00,000", usedBudget: "₹10,50,000", campaigns: 5, events: 8, volunteers: 85, beneficiaries: 450, 
    progress: 72, status: "Active", startDate: "01 Jan 2026", endDate: "31 Dec 2026", location: "Maharashtra, India",
    description: "Providing quality education and digital literacy to underprivileged children in rural areas.",
    color: "bg-blue-100", textColor: "text-blue-600", icon: BookOpen,
    linkedCampaigns: ["Sponsor a Child", "School Kit Donation", "Digital Education"],
    linkedEvents: ["School Kit Distribution", "Career Guidance Workshop", "Teacher Training"],
    timeline: [
      { step: "Monthly Report Generated", date: "01 Nov 2026", status: "completed" },
      { step: "Event Conducted", date: "10 Oct 2026", status: "completed" },
      { step: "Program Created", date: "01 Jan 2026", status: "completed" }
    ]
  },
  {
    id: "PRG-002", name: "Green Earth Initiative", category: "Environment", coordinator: "Priya Patel", manager: "Vikram Singh",
    budget: "₹5,00,000", usedBudget: "₹2,00,000", campaigns: 2, events: 4, volunteers: 120, beneficiaries: 1200, 
    progress: 40, status: "Active", startDate: "15 Mar 2026", endDate: "15 Mar 2027", location: "Pan India",
    description: "Massive tree plantation and environmental sustainability awareness drives.",
    color: "bg-green-100", textColor: "text-[#16a34a]", icon: Target,
    linkedCampaigns: ["Adopt a Tree", "Plastic Free City"],
    linkedEvents: ["Tree Plantation Drive", "Park Clean-up"],
    timeline: [
      { step: "Event Conducted", date: "20 Apr 2026", status: "completed" },
      { step: "Program Created", date: "15 Mar 2026", status: "completed" }
    ]
  }
];

export default function ProgramsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<typeof initialPrograms[0] | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredPrograms = initialPrograms.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.coordinator.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative flex flex-col gap-8 overflow-x-hidden">
      
      {/* ========================================================= */}
      {/* --- UNIQUE BACKGROUND MOTIFS --- */}
      {/* ========================================================= */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-10 right-10 w-72 h-72 opacity-60 mix-blend-multiply">
          <svg className="absolute w-full h-full overflow-visible" viewBox="0 0 200 200" fill="none">
            <path d="M -50 250 C 50 150, 250 250, 150 50 C 100 -50, -50 50, 50 150" stroke="#f97316" strokeWidth="2" strokeDasharray="6 8" strokeLinecap="round" opacity="0.4" />
          </svg>
          <motion.div animate={{ y: [-5, 5, -5], rotate: [-2, 2, -2] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[20%] right-[20%]">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-12 drop-shadow-md">
              <path d="M21.5 2.5L2 10.5L9.5 13.5L21.5 2.5Z" fill="#fb923c" opacity="0.8" />
              <path d="M21.5 2.5L14.5 22L9.5 13.5L21.5 2.5Z" fill="#f97316" />
            </svg>
          </motion.div>
        </div>
        <div className="absolute top-[40%] -left-10 w-96 h-48 opacity-50 mix-blend-multiply">
          <svg className="absolute w-full h-full overflow-visible" viewBox="0 0 300 100" fill="none">
            <path d="M 0 50 Q 75 100, 150 50 T 300 50" stroke="#16a34a" strokeWidth="2" strokeDasharray="5 7" strokeLinecap="round" opacity="0.4" />
          </svg>
          <motion.div animate={{ x: [-10, 10, -10], y: [-3, 3, -3] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[30%] left-[60%]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform -rotate-[15deg] drop-shadow-md">
              <path d="M22 2L15 22L11 13L2 9L22 2Z" fill="#22c55e" stroke="#16a34a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </div>
      </div>

      {/* --- PAGE HEADER --- */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mt-4">
        <div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            📚 Program Management
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-[13px] font-bold text-gray-400 mt-1">
            Oversee foundational programs, link campaigns, and track holistic progress.
          </motion.p>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="flex gap-3">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3.5 bg-[#16A34A] rounded-full font-bold text-[13px] text-white shadow-[0_8px_20px_rgba(22,163,74,0.25)] hover:bg-[#15803d] hover:-translate-y-0.5 transition-all"
          >
            <Plus className="w-4 h-4" /> Create Program
          </button>
        </motion.div>
      </div>

      {/* --- PROGRAM CARDS (GRID VIEW) --- */}
      <div className="relative z-10 flex flex-col gap-4">
        <h3 className="text-lg font-extrabold text-gray-900">Program Dashboard</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredPrograms.map((prog, i) => (
              <motion.div 
                key={prog.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + (i * 0.1) }}
                className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all group flex flex-col overflow-hidden"
              >
                <div className={`h-32 w-full ${prog.color} relative p-6 flex flex-col justify-end overflow-hidden`}>
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-white shadow-sm ${prog.textColor}`}>{prog.status}</span>
                  </div>
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <prog.icon className={`w-6 h-6 ${prog.textColor}`} />
                    </div>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <span className={`text-[11px] font-extrabold uppercase tracking-widest mb-1 ${prog.textColor}`}>{prog.category}</span>
                  <h3 className="text-xl font-extrabold text-gray-900 leading-tight mb-2 group-hover:text-[#16a34a] transition-colors">{prog.name}</h3>
                  <p className="text-[12px] font-bold text-gray-500 mb-6 line-clamp-2">{prog.description}</p>
                  
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-6">
                    <div>
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase">Coordinator</span>
                      <p className="text-[13px] font-bold text-gray-900">{prog.coordinator}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase">Budget</span>
                      <p className="text-[13px] font-bold text-gray-900">{prog.budget}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-gray-50 rounded-[1.2rem] p-3 mb-6">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-extrabold text-gray-900">{prog.campaigns}</span>
                      <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-wide">Campaigns</span>
                    </div>
                    <div className="w-px h-8 bg-gray-200"></div>
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-extrabold text-gray-900">{prog.events}</span>
                      <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-wide">Events</span>
                    </div>
                    <div className="w-px h-8 bg-gray-200"></div>
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-extrabold text-gray-900">{prog.volunteers}</span>
                      <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-wide">Vols</span>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex justify-between text-[11px] font-extrabold mb-2">
                      <span className="text-gray-500">Program Progress</span>
                      <span className={prog.textColor}>{prog.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden mb-6">
                      <div className={`h-full rounded-full ${prog.color.replace('100', '500')}`} style={{ width: `${prog.progress}%` }}></div>
                    </div>
                    <button onClick={() => setSelectedProgram(prog)} className="w-full py-3.5 bg-gray-50 text-gray-700 rounded-full text-[12px] font-extrabold hover:bg-[#16a34a] hover:text-white transition-all shadow-sm">
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* --- PROGRAMS TABLE VIEW --- */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="relative z-10 bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden mt-4">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="py-5 px-6 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Program</th>
                <th className="py-5 px-6 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Coordinator</th>
                <th className="py-5 px-6 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Budget</th>
                <th className="py-5 px-6 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Metrics</th>
                <th className="py-5 px-6 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="py-5 px-6 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence>
                {filteredPrograms.map((prog) => (
                  <motion.tr key={prog.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-white/60 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-gray-900 text-[14px] cursor-pointer hover:text-[#16a34a] transition-colors" onClick={() => setSelectedProgram(prog)}>{prog.name}</span>
                        <span className="font-bold text-gray-400 text-[11px]">{prog.category}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[13px] font-bold text-gray-700">{prog.coordinator}</td>
                    <td className="py-4 px-6 text-[13px] font-extrabold text-gray-900">{prog.budget}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-md">{prog.campaigns} Camp.</span>
                        <span className="text-[11px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-md">{prog.events} Events</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${prog.status === 'Active' ? 'bg-green-50 text-[#16a34a]' : 'bg-orange-50 text-[#f97316]'}`}>{prog.status}</span>
                    </td>
                    <td className="py-4 px-6 text-right relative">
                      <button onClick={() => setActiveDropdown(activeDropdown === prog.id ? null : prog.id)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      <AnimatePresence>
                        {activeDropdown === prog.id && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.15 }}
                            className="absolute right-10 top-10 w-48 bg-white rounded-[1.2rem] shadow-[0_10px_40px_rgb(0,0,0,0.1)] border border-gray-100 py-2 z-50 text-left"
                          >
                            <button onClick={() => setSelectedProgram(prog)} className="w-full text-left px-4 py-2 text-[12px] font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Eye className="w-3.5 h-3.5" /> View Program</button>
                            <button className="w-full text-left px-4 py-2 text-[12px] font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Edit3 className="w-3.5 h-3.5" /> Edit Details</button>
                            <div className="h-px bg-gray-100 my-1"></div>
                            <button className="w-full text-left px-4 py-2 text-[12px] font-bold text-[#16a34a] hover:bg-green-50 flex items-center gap-2"><Target className="w-3.5 h-3.5" /> Link Campaign</button>
                            <button className="w-full text-left px-4 py-2 text-[12px] font-bold text-[#f97316] hover:bg-orange-50 flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Assign Event</button>
                            <button className="w-full text-left px-4 py-2 text-[12px] font-bold text-purple-600 hover:bg-purple-50 flex items-center gap-2"><Users className="w-3.5 h-3.5" /> Assign Volunteers</button>
                            <div className="h-px bg-gray-100 my-1"></div>
                            <button className="w-full text-left px-4 py-2 text-[12px] font-bold text-red-500 hover:bg-red-50 flex items-center gap-2"><Trash2 className="w-3.5 h-3.5" /> Delete Program</button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ==================================================== */}
      {/* --- CENTERED MODAL (VIEW PROGRAM PROFILE) --- */}
      {/* ==================================================== */}
      <AnimatePresence>
        {selectedProgram && (
          <div className="fixed top-[73px] inset-x-0 bottom-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProgram(null)} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-[800px] max-h-[90vh] bg-[#fafafa] rounded-[2.5rem] shadow-2xl z-[101] flex flex-col overflow-hidden"
            >
              {/* Modal Header / Banner */}
              <div className={`relative h-40 w-full ${selectedProgram.color} shrink-0 p-8 flex flex-col justify-end`}>
                <button onClick={() => setSelectedProgram(null)} className="absolute top-6 right-6 p-2 bg-white/50 hover:bg-white text-gray-800 rounded-full shadow-sm transition-all backdrop-blur-md"><X className="w-4 h-4" /></button>
                <div className="absolute top-6 left-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-white shadow-sm ${selectedProgram.textColor}`}>{selectedProgram.status}</span>
                </div>
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md">
                    <selectedProgram.icon className={`w-7 h-7 ${selectedProgram.textColor}`} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">{selectedProgram.name}</h2>
                    <p className={`text-[12px] font-extrabold uppercase tracking-widest ${selectedProgram.textColor}`}>{selectedProgram.category}</p>
                  </div>
                </div>
              </div>

              {/* Modal Scrollable Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                
                {/* 1. Overview */}
                <p className="text-[13px] font-bold text-gray-600 mb-6 leading-relaxed">{selectedProgram.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-gray-100">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Coordinator</span>
                    <p className="text-[13px] font-bold text-gray-900">{selectedProgram.coordinator}</p>
                  </div>
                  <div className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-gray-100">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Budget</span>
                    <p className="text-[13px] font-bold text-gray-900">{selectedProgram.budget}</p>
                  </div>
                  <div className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-gray-100 col-span-2">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Duration</span>
                    <p className="text-[13px] font-bold text-gray-900">{selectedProgram.startDate} — {selectedProgram.endDate}</p>
                  </div>
                </div>

                {/* 2. Statistics Widget */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 mb-8">
                  <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-4">Program Statistics</h4>
                  <div className="grid grid-cols-4 gap-2 mb-6">
                    <div className="flex flex-col items-center p-3 bg-purple-50 rounded-2xl">
                      <span className="text-xl font-extrabold text-purple-600">{selectedProgram.campaigns}</span>
                      <span className="text-[9px] font-extrabold text-gray-500 uppercase">Campaigns</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-orange-50 rounded-2xl">
                      <span className="text-xl font-extrabold text-[#f97316]">{selectedProgram.events}</span>
                      <span className="text-[9px] font-extrabold text-gray-500 uppercase">Events</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-green-50 rounded-2xl">
                      <span className="text-xl font-extrabold text-[#16a34a]">{selectedProgram.volunteers}</span>
                      <span className="text-[9px] font-extrabold text-gray-500 uppercase">Vols</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-blue-50 rounded-2xl">
                      <span className="text-xl font-extrabold text-blue-600">{selectedProgram.beneficiaries}</span>
                      <span className="text-[9px] font-extrabold text-gray-500 uppercase">Beneficiaries</span>
                    </div>
                  </div>

                  {/* Progress & Budget Tracking */}
                  <div className="flex justify-between text-[11px] font-extrabold mb-2">
                    <span className="text-gray-500">Overall Progress</span>
                    <span className={selectedProgram.textColor}>{selectedProgram.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden mb-4">
                    <div className={`h-full rounded-full ${selectedProgram.color.replace('100', '500')}`} style={{ width: `${selectedProgram.progress}%` }}></div>
                  </div>
                  <p className="text-[11px] font-bold text-gray-500 text-center">Used <span className="font-extrabold text-gray-900">{selectedProgram.usedBudget}</span> out of {selectedProgram.budget}</p>
                </div>

                {/* 3. Linked Assets */}
                <div className="mb-8 flex flex-col gap-4">
                  <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm">
                    <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Target className="w-3.5 h-3.5" /> Linked Campaigns</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProgram.linkedCampaigns.map(c => <span key={c} className="px-3 py-1.5 bg-gray-50 text-[11px] font-bold text-gray-700 rounded-lg border border-gray-100">{c}</span>)}
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm">
                    <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Linked Events</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProgram.linkedEvents.map(e => <span key={e} className="px-3 py-1.5 bg-gray-50 text-[11px] font-bold text-gray-700 rounded-lg border border-gray-100">{e}</span>)}
                    </div>
                  </div>
                </div>

                {/* 4. Timeline */}
                <div className="mb-6 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                  <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-5">Program Timeline</h4>
                  <div className="relative border-l-2 border-gray-100 ml-2 flex flex-col gap-6">
                    {selectedProgram.timeline.map((step, i) => (
                      <div key={i} className="relative pl-6">
                        <div className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full border-4 border-white shadow-sm ${step.status === 'completed' ? 'bg-[#16a34a]' : 'bg-orange-400'}`}></div>
                        <p className={`text-[12px] font-extrabold ${step.status === 'completed' ? 'text-gray-900' : 'text-gray-500'}`}>{step.step}</p>
                        <span className="text-[10px] font-bold text-gray-400 block mt-0.5">{step.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Modal Footer Actions */}
              <div className="p-4 border-t border-gray-100 bg-white shrink-0 grid grid-cols-2 gap-3">
                <button className="py-3.5 bg-gray-50 border border-gray-200 rounded-full text-[12px] font-extrabold text-gray-600 hover:bg-gray-100 flex items-center justify-center gap-2"><Edit3 className="w-4 h-4" /> Edit Program</button>
                <button className="py-3.5 bg-[#16A34A] text-white rounded-full text-[12px] font-extrabold shadow-[0_8px_20px_rgba(22,163,74,0.25)] hover:bg-[#15803d] flex items-center justify-center gap-2"><TrendingUp className="w-4 h-4" /> View Report</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* --- MODAL (CREATE PROGRAM) --- */}
      {/* ==================================================== */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed top-[73px] inset-x-0 bottom-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCreateModalOpen(false)} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col z-[121] overflow-hidden max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50 shrink-0">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Create New Program</h2>
                  <p className="text-[12px] font-bold text-gray-400 mt-1">Set up a foundational program framework.</p>
                </div>
                <button onClick={() => setIsCreateModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 bg-white hover:bg-gray-50 rounded-full transition-colors border border-gray-200 shadow-sm"><X className="w-5 h-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Banner Upload */}
                  <div className="col-span-1 md:col-span-2 border-2 border-dashed border-gray-200 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-green-50/50 transition-colors cursor-pointer">
                    <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                      <UploadCloud className="w-6 h-6 text-[#16a34a]" />
                    </div>
                    <h4 className="text-[13px] font-extrabold text-gray-900">Upload Program Banner</h4>
                    <p className="text-[11px] font-bold text-gray-400">1920x1080px recommended</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Program Name *</label>
                    <input type="text" placeholder="e.g. Health for All" className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Category *</label>
                    <select className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none appearance-none">
                      {programCategories.map(cat => <option key={cat}>{cat}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1.5 col-span-1 md:col-span-2">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Description *</label>
                    <textarea rows={3} placeholder="Program objectives and overview..." className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none resize-none custom-scrollbar" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Program Coordinator</label>
                    <input type="text" placeholder="Coordinator Name" className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Target Beneficiaries</label>
                    <input type="text" placeholder="e.g. Rural Students" className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Estimated Budget (₹)</label>
                    <input type="number" placeholder="500000" className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Location Coverage</label>
                    <input type="text" placeholder="e.g. Pan India" className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Start Date</label>
                    <input type="date" className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">End Date</label>
                    <input type="date" className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none" />
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50/50 shrink-0 flex justify-end gap-3">
                <button onClick={() => setIsCreateModalOpen(false)} className="px-8 py-3.5 rounded-full font-bold text-[13px] text-gray-600 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">Cancel</button>
                <button className="px-10 py-3.5 rounded-full font-bold text-[13px] text-white bg-[#16A34A] hover:bg-[#15803d] shadow-[0_8px_20px_rgba(22,163,74,0.25)] transition-all flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Save Program
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}