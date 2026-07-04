"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
   Plus, Calendar, MapPin, Clock, 
  Users, MoreVertical, ChevronDown, Edit3, Trash2, 
  ExternalLink, Image as ImageIcon
} from "lucide-react";

// --- DUMMY EVENT DATA ---
const initialEvents = [
  {
    id: "1",
    title: "Annual Tree Plantation Drive",
    category: "Environment",
    status: "Upcoming",
    date: "24 Oct 2026",
    time: "08:00 AM - 02:00 PM",
    venue: "City Central Park, New Delhi",
    volunteers: { current: 15, required: 20 },
    imageColor: "bg-green-100",
  },
  {
    id: "2",
    title: "Community Blood Donation Camp",
    category: "Healthcare",
    status: "Draft",
    date: "15 Nov 2026",
    time: "09:00 AM - 05:00 PM",
    venue: "Civil Hospital, Main Branch",
    volunteers: { current: 0, required: 10 },
    imageColor: "bg-rose-100",
  },
  {
    id: "3",
    title: "Women Empowerment Workshop",
    category: "Education",
    status: "Upcoming",
    date: "02 Dec 2026",
    time: "10:00 AM - 01:00 PM",
    venue: "Community Hall, Sector 4",
    volunteers: { current: 5, required: 5 },
    imageColor: "bg-purple-100",
  },
  {
    id: "4",
    title: "Flood Disaster Relief Camp",
    category: "Disaster Relief",
    status: "Completed",
    date: "10 Aug 2026",
    time: "06:00 AM - 08:00 PM",
    venue: "Relief Center, Assam",
    volunteers: { current: 45, required: 40 },
    imageColor: "bg-blue-100",
  },
  {
    id: "5",
    title: "Winter Clothes Distribution",
    category: "Social Welfare",
    status: "Upcoming",
    date: "10 Dec 2026",
    time: "05:00 PM - 09:00 PM",
    venue: "Shelter Home, Old City",
    volunteers: { current: 8, required: 15 },
    imageColor: "bg-orange-100",
  }
];

export default function EventsManagementPage() {
  const [events, setEvents] = useState(initialEvents);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // --- FILTER LOGIC ---
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    event.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative flex flex-col gap-8">
      
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
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
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
          {filteredEvents.map((event, index) => (
            <motion.div 
              key={event.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all group flex flex-col"
            >
              {/* Event Image Placeholder / Banner */}
              <div className={`h-40 w-full ${event.imageColor} relative flex items-center justify-center overflow-hidden`}>
                <ImageIcon className="w-10 h-10 text-white/50 mix-blend-overlay" />
                
                {/* Date Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm flex flex-col items-center">
                  <span className="text-[10px] font-extrabold text-[#f97316] uppercase tracking-widest leading-none mb-1">{event.date.split(" ")[1]}</span>
                  <span className="text-lg font-extrabold text-gray-900 leading-none">{event.date.split(" ")[0]}</span>
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold tracking-widest uppercase shadow-sm ${
                    event.status === 'Upcoming' ? 'bg-[#16a34a] text-white' : 
                    event.status === 'Draft' ? 'bg-gray-800 text-white' : 
                    'bg-blue-500 text-white'
                  }`}>
                    {event.status}
                  </span>
                </div>
              </div>

              {/* Event Details */}
              <div className="p-6 flex-1 flex flex-col">
                <span className="text-[11px] font-extrabold text-[#f97316] uppercase tracking-widest mb-2">
                  {event.category}
                </span>
                <h3 className="text-xl font-extrabold text-gray-900 leading-tight mb-4 group-hover:text-[#16a34a] transition-colors">
                  {event.title}
                </h3>
                
                <div className="flex flex-col gap-2.5 mb-6">
                  <div className="flex items-center gap-2.5 text-gray-500">
                    <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="text-[13px] font-bold truncate">{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-gray-500">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="text-[13px] font-bold truncate">{event.venue}</span>
                  </div>
                </div>

                {/* Volunteers Progress */}
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-[12px] font-bold text-gray-500">Volunteers</span>
                    </div>
                    <span className="text-[12px] font-extrabold text-gray-900">
                      {event.volunteers.current} / {event.volunteers.required}
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        (event.volunteers.current / event.volunteers.required) >= 1 ? 'bg-[#16a34a]' : 'bg-[#f97316]'
                      }`}
                      style={{ width: `${Math.min((event.volunteers.current / event.volunteers.required) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="px-6 py-4 bg-gray-50 flex items-center justify-between border-t border-gray-100">
                <button className="text-[12px] font-extrabold text-[#16a34a] hover:text-[#15803d] flex items-center gap-1.5 transition-colors">
                  Manage  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                
                <div className="relative">
                  <button 
                    onClick={() => setActiveDropdown(activeDropdown === event.id ? null : event.id)}
                    className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {activeDropdown === event.id && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 bottom-full mb-2 w-40 bg-white rounded-[1.2rem] shadow-[0_10px_40px_rgb(0,0,0,0.1)] border border-gray-100 py-2 z-50 overflow-hidden text-left"
                      >
                        <button className="w-full text-left px-4 py-2 text-[12px] font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                          <Edit3 className="w-3.5 h-3.5" /> Edit Details
                        </button>
                        <div className="h-px bg-gray-100 my-1"></div>
                        <button className="w-full text-left px-4 py-2 text-[12px] font-bold text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" /> Delete 
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredEvents.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400">
            <Calendar className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-[13px] font-bold">No events found matching your search.</p>
            <button onClick={() => setSearchQuery("")} className="mt-4 text-[#16a34a] font-bold text-[13px] hover:underline">
              Clear Filters
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}