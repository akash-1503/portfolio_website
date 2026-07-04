"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Filter, Plus, Users, UserCheck, Calendar, BookOpen, 
  Hourglass, Trophy, Eye, Mail, Trash2, X, FileBadge, CheckCircle, 
  Clock, MapPin, ChevronDown, MoreVertical, Award, Phone, 
  Star, Download, Target
} from "lucide-react";

// --- DUMMY DATA ---
const kpiData = [
  { title: "Total Volunteers", value: "325", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
  { title: "Active Volunteers", value: "280", icon: UserCheck, color: "text-[#16a34a]", bg: "bg-green-50" },
  { title: "Assigned to Events", value: "85", icon: Calendar, color: "text-[#f97316]", bg: "bg-orange-50" },
  { title: "Assigned to Programs", value: "125", icon: BookOpen, color: "text-purple-500", bg: "bg-purple-50" },
  { title: "Pending Assignments", value: "18", icon: Hourglass, color: "text-rose-500", bg: "bg-rose-50" },
  { title: "Top Volunteer", value: "Rahul Sharma", icon: Trophy, color: "text-yellow-600", bg: "bg-yellow-50" },
];

const initialVolunteers = [
  { 
    id: "VOL-001", name: "Rahul Sharma", email: "rahul@example.com", phone: "+91 9876543210", 
    address: "123 Green Ave, New Delhi, India", joinedDate: "15 Jan 2025",
    skills: ["Teaching", "Photography", "Medical Support", "Event Management", "Fundraising"], 
    program: "Education Program", event: "Blood Donation Camp", hours: 125, attendance: "95%", status: "Active", availability: "Weekends", image: "R",
    attendanceBreakdown: { present: 95, absent: 3, late: 2 },
    assignedPrograms: ["Education Program", "Women's Empowerment"],
    assignedEvents: ["Blood Donation Camp", "Tree Plantation Drive", "Food Distribution"],
    certificates: ["Participation Certificate", "Volunteer Appreciation", "Best Volunteer Award"],
    performance: { tasksCompleted: 45, eventsParticipated: 12, programsSupported: 3, avgAttendance: "95%", rating: 4.9 },
    notes: ["Excellent volunteer.", "Very punctual.", "Good communication skills."],
    timeline: [
      { event: "Received Best Volunteer Award", date: "05 Dec 2025" },
      { event: "Completed Tree Plantation", date: "12 Aug 2025" },
      { event: "Completed Blood Donation Camp", date: "10 Mar 2025" },
      { event: "Assigned Education Program", date: "20 Feb 2025" },
      { event: "Joined NGO", date: "15 Jan 2025" }
    ]
  },
  { 
    id: "VOL-002", name: "Priya Patel", email: "priya@example.com", phone: "+91 9876543211", 
    address: "45 River Rd, Mumbai, India", joinedDate: "10 Mar 2025",
    skills: ["Teaching", "Art"], program: "Education First", event: "None", hours: 45, attendance: "85%", status: "Active", availability: "Weekdays", image: "P",
    attendanceBreakdown: { present: 85, absent: 10, late: 5 },
    assignedPrograms: ["Education First"],
    assignedEvents: [],
    certificates: ["Participation Certificate"],
    performance: { tasksCompleted: 15, eventsParticipated: 2, programsSupported: 1, avgAttendance: "85%", rating: 4.2 },
    notes: ["Great with children.", "Needs to improve punctuality."],
    timeline: [
      { event: "Assigned Education First", date: "15 Mar 2025" },
      { event: "Joined NGO", date: "10 Mar 2025" }
    ]
  }
];

export default function VolunteersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVolunteer, setSelectedVolunteer] = useState<typeof initialVolunteers[0] | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const [modalType, setModalType] = useState<"PROGRAM" | "EVENT" | null>(null);

  const openDrawer = (volunteer: typeof initialVolunteers[0]) => {
    setSelectedVolunteer(volunteer);
    setActiveDropdown(null);
  };

  const closeDrawer = () => setSelectedVolunteer(null);

  const filteredVolunteers = initialVolunteers.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.phone.includes(searchQuery)
  );

  return (
    <div className="relative min-h-screen flex flex-col gap-8 pb-10 overflow-x-hidden">
      
      {/* --- UNIQUE BACKGROUND MOTIFS --- */}
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
        <div className="absolute bottom-20 right-20 w-64 h-64 opacity-50 mix-blend-multiply">
          <svg className="absolute w-full h-full overflow-visible" viewBox="0 0 200 200" fill="none">
            <path d="M 0 200 Q 100 200, 200 0" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 8" strokeLinecap="round" opacity="0.4" />
          </svg>
          <motion.div animate={{ y: [-8, 8, -8], rotate: [-10, -5, -10] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-[10%] right-[10%]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform -rotate-45 drop-shadow-md">
              <path d="M21.5 2.5L2 10.5L9.5 13.5L21.5 2.5Z" fill="#60a5fa" opacity="0.8" />
              <path d="M21.5 2.5L14.5 22L9.5 13.5L21.5 2.5Z" fill="#3b82f6" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* --- PAGE HEADER --- */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mt-4">
        <div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            🙋 Volunteer Management
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-[13px] font-bold text-gray-400 mt-1">
            Recruit, assign, and track your volunteer workforce.
          </motion.p>
        </div>
      </div>

      {/* --- VOLUNTEER MAIN TABLE --- */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="relative z-10 bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden mt-4">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="py-5 px-6 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Avatar & Name</th>
                <th className="py-5 px-6 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Skills</th>
                <th className="py-5 px-6 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Assigned Program & Event</th>
                <th className="py-5 px-6 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Hours / Attd.</th>
                <th className="py-5 px-6 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="py-5 px-6 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence>
                {filteredVolunteers.map((vol) => (
                  <motion.tr key={vol.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-white/60 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center font-extrabold text-sm text-[#16a34a] border border-green-100 shrink-0">
                          {vol.image}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-extrabold text-gray-900 text-[14px] cursor-pointer hover:text-[#16a34a] transition-colors" onClick={() => openDrawer(vol)}>{vol.name}</span>
                          <span className="font-bold text-gray-400 text-[11px]">{vol.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-1.5 flex-wrap max-w-[150px]">
                        {vol.skills.slice(0, 2).map((skill, i) => (
                          <span key={i} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-[10px] font-extrabold tracking-wide">{skill}</span>
                        ))}
                        {vol.skills.length > 2 && <span className="bg-gray-50 text-gray-400 px-2 py-1 rounded-md text-[10px] font-extrabold">+{vol.skills.length - 2}</span>}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[12px] font-bold text-gray-700 flex items-center gap-1.5"><BookOpen className="w-3 h-3 text-[#16a34a]" /> {vol.program}</span>
                        <span className="text-[12px] font-bold text-gray-700 flex items-center gap-1.5"><Calendar className="w-3 h-3 text-[#f97316]" /> {vol.event}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-extrabold text-gray-900">{vol.hours} Hours</span>
                        <span className="text-[11px] font-bold text-gray-500">{vol.attendance} Attd.</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${vol.status === 'Active' ? 'bg-green-50 text-[#16a34a]' : 'bg-orange-50 text-[#f97316]'}`}>{vol.status}</span>
                    </td>
                    
                    <td className="py-4 px-6 text-right relative">
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === vol.id ? null : vol.id)}
                        className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      <AnimatePresence>
                        {activeDropdown === vol.id && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.15 }}
                            className="absolute right-10 top-10 w-48 bg-white rounded-[1.2rem] shadow-[0_10px_40px_rgb(0,0,0,0.1)] border border-gray-100 py-2 z-50 text-left"
                          >
                            <button onClick={() => openDrawer(vol)} className="w-full text-left px-4 py-2 text-[12px] font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Eye className="w-3.5 h-3.5" /> View Profile</button>
                            <button onClick={() => {setModalType("EVENT"); setActiveDropdown(null)}} className="w-full text-left px-4 py-2 text-[12px] font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Assign Event</button>
                            <button onClick={() => {setModalType("PROGRAM"); setActiveDropdown(null)}} className="w-full text-left px-4 py-2 text-[12px] font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"><BookOpen className="w-3.5 h-3.5" /> Assign Program</button>
                            <button className="w-full text-left px-4 py-2 text-[12px] font-bold text-[#16a34a] hover:bg-green-50 flex items-center gap-2"><FileBadge className="w-3.5 h-3.5" /> Generate Certificate</button>
                            <button className="w-full text-left px-4 py-2 text-[12px] font-bold text-[#3b82f6] hover:bg-blue-50 flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Message</button>
                            <div className="h-px bg-gray-100 my-1"></div>
                            <button className="w-full text-left px-4 py-2 text-[12px] font-bold text-red-500 hover:bg-red-50 flex items-center gap-2"><Trash2 className="w-3.5 h-3.5" /> Remove Volunteer</button>
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

      {/* --- SLIDE-OVER DRAWER (VIEW VOLUNTEER PROFILE) --- */}
      <AnimatePresence>
        {selectedVolunteer && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeDrawer} className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-[100]" />
            <motion.div 
              initial={{ x: "100%", opacity: 0.5 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "100%", opacity: 0.5 }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-[500px] bg-white shadow-2xl z-[101] flex flex-col border-l border-gray-100 overflow-hidden"
            >
              <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gray-50/50 shrink-0">
                <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">Volunteer Profile</h2>
                <button onClick={closeDrawer} className="p-2 text-gray-400 hover:text-gray-900 bg-white border border-gray-200 rounded-full shadow-sm transition-all hover:bg-gray-50"><X className="w-4 h-4" /></button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-[#fafafa]">
                
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex items-center gap-5 mb-6">
                   <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center font-extrabold text-green-700 shadow-inner text-3xl shrink-0">
                    {selectedVolunteer.image}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-xl font-extrabold text-gray-900 leading-tight">{selectedVolunteer.name}</h3>
                    <p className="text-[12px] font-bold text-[#16a34a] mb-2">{selectedVolunteer.id}</p>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 mb-1"><Mail className="w-3 h-3" /> {selectedVolunteer.email}</div>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 mb-1"><Phone className="w-3 h-3" /> {selectedVolunteer.phone}</div>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500"><MapPin className="w-3 h-3" /> {selectedVolunteer.address}</div>
                    <p className="text-[10px] font-extrabold text-gray-400 mt-2 uppercase tracking-widest">Joined: {selectedVolunteer.joinedDate}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedVolunteer.skills.map((skill, i) => (
                      <span key={i} className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-[11px] font-extrabold tracking-wide">{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                   <div className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                     <span className="text-[24px] font-extrabold text-gray-900">{selectedVolunteer.hours}</span>
                     <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Total Hours</span>
                   </div>
                   <div className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                     <div className="flex items-center gap-1 text-[24px] font-extrabold text-[#f97316]">
                        {selectedVolunteer.performance.rating} <Star className="w-4 h-4 fill-current" />
                     </div>
                     <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Rating</span>
                   </div>
                   <div className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                     <span className="text-[20px] font-extrabold text-gray-900">{selectedVolunteer.performance.tasksCompleted}</span>
                     <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Tasks Done</span>
                   </div>
                   <div className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                     <span className="text-[20px] font-extrabold text-gray-900">{selectedVolunteer.performance.eventsParticipated}</span>
                     <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Events</span>
                   </div>
                </div>

                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 mb-6">
                  <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-4">Attendance Tracker</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-green-50 p-3 rounded-2xl flex flex-col items-center">
                      <span className="text-lg font-extrabold text-[#16a34a]">{selectedVolunteer.attendanceBreakdown.present}%</span>
                      <span className="text-[10px] font-extrabold text-gray-500 uppercase">Present</span>
                    </div>
                    <div className="bg-red-50 p-3 rounded-2xl flex flex-col items-center">
                      <span className="text-lg font-extrabold text-red-500">{selectedVolunteer.attendanceBreakdown.absent}%</span>
                      <span className="text-[10px] font-extrabold text-gray-500 uppercase">Absent</span>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-2xl flex flex-col items-center">
                      <span className="text-lg font-extrabold text-[#f97316]">{selectedVolunteer.attendanceBreakdown.late}%</span>
                      <span className="text-[10px] font-extrabold text-gray-500 uppercase">Late</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Assignments</h4>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[12px] font-extrabold text-gray-900 flex items-center gap-2"><BookOpen className="w-4 h-4 text-[#16a34a]" /> Assigned Programs</span>
                        <button onClick={() => setModalType("PROGRAM")} className="text-[10px] font-extrabold text-[#16a34a] hover:underline bg-green-50 px-2 py-1 rounded-md">+ Assign</button>
                      </div>
                      <ul className="flex flex-col gap-2">
                        {selectedVolunteer.assignedPrograms.length > 0 ? selectedVolunteer.assignedPrograms.map(p => (
                          <li key={p} className="text-[12px] font-bold text-gray-600 flex items-center gap-2"><Target className="w-3 h-3 text-gray-400" /> {p}</li>
                        )) : <li className="text-[11px] text-gray-400 italic">No programs assigned</li>}
                      </ul>
                    </div>

                    <div className="bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[12px] font-extrabold text-gray-900 flex items-center gap-2"><Calendar className="w-4 h-4 text-[#f97316]" /> Assigned Events</span>
                        <button onClick={() => setModalType("EVENT")} className="text-[10px] font-extrabold text-[#f97316] hover:underline bg-orange-50 px-2 py-1 rounded-md">+ Assign</button>
                      </div>
                      <ul className="flex flex-col gap-2">
                        {selectedVolunteer.assignedEvents.length > 0 ? selectedVolunteer.assignedEvents.map(e => (
                          <li key={e} className="text-[12px] font-bold text-gray-600 flex items-center gap-2"><Target className="w-3 h-3 text-gray-400" /> {e}</li>
                        )) : <li className="text-[11px] text-gray-400 italic">No events assigned</li>}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mb-6 bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm">
                   <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-4">Certificates</h4>
                   <div className="flex flex-col gap-3 mb-4">
                     {selectedVolunteer.certificates.map(cert => (
                       <div key={cert} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                         <span className="text-[12px] font-bold text-gray-800 flex items-center gap-2"><Award className="w-4 h-4 text-yellow-500" /> {cert}</span>
                         <button className="p-1.5 text-gray-400 hover:text-[#16a34a] transition-colors"><Download className="w-3.5 h-3.5" /></button>
                       </div>
                     ))}
                   </div>
                   <div className="flex gap-2">
                     <button className="flex-1 py-2.5 bg-green-50 text-[#16a34a] rounded-full text-[11px] font-extrabold hover:bg-green-100 transition-colors">Generate</button>
                     <button className="flex-1 py-2.5 bg-blue-50 text-blue-500 rounded-full text-[11px] font-extrabold hover:bg-blue-100 transition-colors">Email Certs</button>
                   </div>
                </div>

                <div className="mb-6 bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm">
                  <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Admin Notes</h4>
                  <ul className="list-disc pl-4 flex flex-col gap-1.5">
                    {selectedVolunteer.notes.map((note, i) => (
                      <li key={i} className="text-[12px] font-bold text-gray-600">{note}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6 bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm">
                  <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-5">Volunteer Timeline</h4>
                  <div className="relative border-l-2 border-gray-100 ml-2 flex flex-col gap-5">
                    {selectedVolunteer.timeline.map((step, i) => (
                      <div key={i} className="relative pl-5">
                        <div className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full border-4 border-white shadow-sm ${i === 0 ? 'bg-[#16a34a]' : 'bg-gray-300'}`}></div>
                        <p className={`text-[12px] font-extrabold ${i === 0 ? 'text-gray-900' : 'text-gray-600'}`}>{step.event}</p>
                        <span className="text-[10px] font-bold text-gray-400 block mt-0.5">{step.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-gray-100 bg-white shrink-0 grid grid-cols-2 gap-3">
                <button className="py-3 bg-gray-50 border border-gray-200 rounded-full text-[12px] font-extrabold text-gray-600 hover:bg-gray-100 flex items-center justify-center gap-2"><Mail className="w-4 h-4" /> Message</button>
                <button className="py-3 bg-red-50 text-red-500 rounded-full text-[12px] font-extrabold hover:bg-red-100 flex items-center justify-center gap-2"><Trash2 className="w-4 h-4" /> Remove</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- MODALS (Assign Program / Assign Event) --- */}
      <AnimatePresence>
        {modalType && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalType(null)} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2rem] p-8 shadow-2xl border border-gray-100 flex flex-col z-[121]"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                  {modalType === "PROGRAM" ? "Assign to Program" : "Assign to Event"}
                </h2>
                <button onClick={() => setModalType(null)} className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
              </div>

              <div className="flex flex-col gap-4 mb-8">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Select Volunteer</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none appearance-none">
                    {selectedVolunteer ? <option>{selectedVolunteer.name}</option> : <option>Select a Volunteer...</option>}
                    {!selectedVolunteer && initialVolunteers.map(v => <option key={v.id}>{v.name}</option>)}
                  </select>
                </div>

                {modalType === "PROGRAM" ? (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Select Program</label>
                      <select className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none appearance-none">
                        <option>Education Initiative</option>
                        <option>Health Mission</option>
                        <option>Women's Empowerment</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Role</label>
                      <input type="text" placeholder="e.g. Lead Instructor" className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Start Date</label>
                        <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">End Date</label>
                        <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Select Event</label>
                      <select className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#f97316]/20 outline-none appearance-none">
                        <option>Blood Donation Camp</option>
                        <option>Tree Plantation Drive</option>
                        <option>Food Distribution</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Assign Task</label>
                      <select className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#f97316]/20 outline-none appearance-none">
                        <option>Registration Desk</option>
                        <option>Photography</option>
                        <option>Food Distribution</option>
                        <option>Medical Support</option>
                        <option>Cleaning</option>
                        <option>Logistics</option>
                        <option>Transport</option>
                        <option>Crowd Management</option>
                        <option>Social Media</option>
                        <option>Fundraising</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Reporting Time</label>
                      <input type="time" className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#f97316]/20 outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Coordinator</label>
                      <input type="text" placeholder="Coordinator Name" className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#f97316]/20 outline-none" />
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button onClick={() => setModalType(null)} className="px-6 py-3.5 rounded-full font-bold text-[13px] text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors">Cancel</button>
                <button className={`px-8 py-3.5 rounded-full font-bold text-[13px] text-white transition-all flex items-center gap-2 ${modalType === "PROGRAM" ? 'bg-[#16A34A] hover:bg-[#15803d] shadow-green-500/25' : 'bg-[#f97316] hover:bg-[#ea580c] shadow-orange-500/25'} shadow-lg`}>
                  <CheckCircle className="w-4 h-4" /> Save Assignment
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}