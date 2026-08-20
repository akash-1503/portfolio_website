"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { 
  Calendar, Target, Heart, Search, MapPin, 
  Clock, Users, ArrowRight, X, Sparkles, 
  ArrowLeft, Image as ImageIcon, CheckCircle2, 
  Mail, Loader2, CheckSquare, Square
} from "lucide-react";
import Link from "next/link";

// ============================================================================
// INTERFACES
// ============================================================================

type RegistrationStep = "DETAILS" | "CONFIRM" | "SUCCESS";

interface EventItem {
  id: string;
  title: string;
  
  status: "UPCOMING" | "ONGOING";
  location: string;
  description: string;
  participants: number;
  maxParticipants: number | null;
  isRegistered: boolean;
  canRegister: boolean;
  registrationDeadline: string | null;
  registeredAt: string | null;
  startDate: string;
  endDate: string | null;
  coverImage: string | null;
  program: {
    id: string;
    name: string;
  } | null;
}

interface CampaignItem {
  id: string;
  title: string;
  description: string;
  raisedAmount: number;
  targetAmount: number;
  supporters: number;
  status: "ACTIVE";
  coverImage: string | null;
  startDate: string | null;
  endDate: string | null;
  program: {
    id: string;
    name: string;
  } | null;
}

interface CurrentUser {
  id: string;
  name: string | null;
  email: string;
}

// ============================================================================
// FORMATTERS
// ============================================================================

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (startDate: string, endDate: string | null) => {
  const start = new Date(startDate);
  const startTime = new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(start);

  if (!endDate) {
    return startTime;
  }

  const end = new Date(endDate);
  const endTime = new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(end);

  return `${startTime} - ${endTime}`;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function EventsCampaignsPage() {
  // --- STATE ---
  const [mounted, setMounted] = useState(false);
  
  // Tab & Search State
  const [activeTab, setActiveTab] = useState<"EVENTS" | "CAMPAIGNS">("EVENTS");
  const [searchQuery, setSearchQuery] = useState("");

  // API State
  const [events, setEvents] = useState<EventItem[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Modal States
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignItem | null>(null);

  // Registration Workflow States
  const [registrationStep, setRegistrationStep] = useState<RegistrationStep>("DETAILS");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- INITIAL DATA FETCH ---
  const fetchEventsCampaigns = async () => {
    try {
      setIsLoading(true);
      setApiError(null);

      const response = await fetch("/api/user/events-campaigns", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const text = await response.text();
      let result;

      try {
        result = JSON.parse(text);
      } catch {
        console.error("Invalid API response:", text);
        throw new Error("Invalid server response.");
      }

      if (!response.ok || !result.success) {
  console.error("EVENT/CAMPAIGN API FAILED:", {
    status: response.status,
    statusText: response.statusText,
    result,
  });

  throw new Error(
    result.message || "Failed to load events and campaigns."
  );
}

      setCurrentUser(result.data.user);
      setEvents(result.data.events);
      setCampaigns(result.data.campaigns);

    } catch (error) {
      console.error("Failed to fetch events and campaigns:", error);
      setApiError(error instanceof Error ? error.message : "Failed to load events and campaigns.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchEventsCampaigns();
  }, []);

  // --- REGISTRATION LOGIC ---
  const handleRegisterConfirm = async () => {
    if (!selectedEvent || !acceptedTerms) return;

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/user/events-campaigns/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          eventId: selectedEvent.id,
        }),
      });

      const text = await response.text();
      let result;

      try {
        result = JSON.parse(text);
      } catch {
        console.error("Invalid server response:", text);
        throw new Error("Invalid server response.");
      }

      if (!response.ok || !result.success) {
  console.error("API ERROR:", {
    status: response.status,
    result,
  });

  throw new Error(
    result.message || "Failed to register for the event."
  );
}

      // Update selected event locally
      setEvents((prevEvents) =>
  prevEvents.map((event) =>
    event.id === selectedEvent.id
      ? {
          ...event,
          isRegistered: true,
          canRegister: false,
          participants: event.participants + 1,
          registeredAt: result.data.registeredAt,
        }
      : event
  )
);

      // Update event list locally
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEvent.id
            ? {
                ...event,
                isRegistered: true,
                canRegister: false,
                participants: event.participants + 1,
                registeredAt: result.data.registeredAt,
              }
            : event
        )
      );

      await fetchEventsCampaigns();
setRegistrationStep("SUCCESS");

    } catch (error) {
      console.error("Event registration failed:", error);
      alert(error instanceof Error ? error.message : "Failed to register for the event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeEventModal = () => {
    setSelectedEvent(null);
    setTimeout(() => {
      setRegistrationStep("DETAILS");
      setAcceptedTerms(false);
      setIsSubmitting(false);
    }, 300); // Reset after modal closes
  };

  // --- FILTER LOGIC ---
  const filteredEvents = events.filter((ev) => 
    ev.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    ev.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCampaigns = campaigns.filter((camp) =>
  camp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  camp.description.toLowerCase().includes(searchQuery.toLowerCase())
);

  // --- ANIMATIONS ---
  const containerVariants: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants: Variants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

  return (
    <div className="relative flex flex-col gap-8 min-h-screen pb-16 overflow-x-hidden w-full bg-[#f8fafc]">
      
      {/* ==================================================== */}
      {/* --- BACKGROUND ANIMATIONS & GLASSMORPHISM --- */}
      {/* ==================================================== */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[5%] left-[5%] w-[400px] h-[400px] bg-blue-300/20 rounded-full blur-[120px]" />
        <div className="absolute top-[60%] right-[10%] w-[300px] h-[300px] bg-orange-300/20 rounded-full blur-[100px]" />
        <div className="absolute top-[5%] right-[-50px] w-[300px] md:w-[400px] h-[300px] md:h-[400px] opacity-40 mix-blend-multiply">
          <svg className="absolute w-full h-full" viewBox="0 0 200 200" fill="none">
            <path d="M 150 0 C 150 100, 50 100, 0 200" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6 8" strokeLinecap="round" opacity="0.4" />
          </svg>
          <motion.div animate={{ y: [-15, 15, -15], rotate: [0, 10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="absolute top-20 right-20">
            <Sparkles className="w-8 h-8 text-blue-400 opacity-80 drop-shadow-md" />
          </motion.div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* --- 1. PAGE HEADER --- */}
      {/* ==================================================== */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="relative z-10 px-4 mt-6">
        <motion.h1 variants={itemVariants} className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
          Events & Campaigns
        </motion.h1>
        <motion.p variants={itemVariants} className="text-[14px] font-bold text-gray-600 max-w-2xl">
          Discover opportunities to participate, contribute, and make a meaningful impact.
        </motion.p>
      </motion.div>

      {/* ==================================================== */}
      {/* --- 2. LIGHT-THEMED HERO SECTION --- */}
      {/* ==================================================== */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="relative z-10 px-4">
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 border border-blue-200 rounded-[2rem] p-8 md:p-10 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 group">
          <svg className="absolute top-0 right-0 w-80 h-80 opacity-10 transform translate-x-20 -translate-y-20 group-hover:rotate-45 group-hover:scale-110 transition-all duration-1000" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="40" stroke="#1e3a8a" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M 50 10 L 50 90 M 10 50 L 90 50" stroke="#1e3a8a" strokeWidth="2" strokeDasharray="2 4" />
          </svg>
          
          <div className="relative z-10 max-w-xl">
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 tracking-tight text-blue-950">
              Be Part of Something Meaningful
            </h2>
            <p className="text-[14px] md:text-[15px] font-bold text-blue-800 mb-8 opacity-90 leading-relaxed">
              Every event and campaign is an opportunity to create positive change. Explore what's happening in our community and find the best way to get involved.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button onClick={() => setActiveTab("EVENTS")} className="px-8 py-3.5 bg-blue-200 text-blue-900 rounded-xl text-[13px] font-extrabold shadow-sm hover:shadow-md hover:bg-blue-300 transition-all flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-900" /> Explore Events
              </button>
              <button onClick={() => setActiveTab("CAMPAIGNS")} className="px-8 py-3.5 bg-orange-200 text-orange-900 rounded-xl text-[13px] font-extrabold shadow-sm hover:shadow-md hover:bg-orange-300 transition-all flex items-center gap-2">
                <Heart className="w-4 h-4 text-orange-900" /> Support Campaign
              </button>
            </div>
          </div>

          <div className="relative z-10 hidden lg:flex items-center justify-center w-48 h-48 bg-white/50 backdrop-blur-md rounded-full border border-white/60 shadow-sm">
             <Target className="w-20 h-20 text-blue-600 drop-shadow-sm" />
          </div>
        </motion.div>
      </motion.div>

      {/* ==================================================== */}
      {/* --- 3. SLIDING TAB & SEARCH --- */}
      {/* ==================================================== */}
      <div className="relative z-10 px-4 mt-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex p-1.5 bg-white border border-gray-200 rounded-full w-full md:w-fit shadow-sm relative">
          {["EVENTS", "CAMPAIGNS"].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab as any); setSearchQuery(""); }}
              className={`relative flex-1 md:px-10 py-3 rounded-full text-[13px] font-extrabold tracking-widest transition-all z-10 ${
                activeTab === tab ? (tab === "EVENTS" ? "text-blue-900" : "text-orange-900") : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTabBadge"
                  className={`absolute inset-0 rounded-full shadow-sm -z-10 ${tab === "EVENTS" ? "bg-blue-100" : "bg-orange-100"}`}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder={`Search ${activeTab.toLowerCase()}...`}
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-full text-[13px] font-bold text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 outline-none shadow-sm transition-all"
          />
        </div>
      </div>

      {/* ==================================================== */}
      {/* --- 4. DYNAMIC VERTICAL SQUARE GRID --- */}
      {/* ==================================================== */}
      <div className="relative z-10 px-4">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-sm font-bold text-gray-500">
                Loading events and campaigns...
              </p>
            </div>
          </div>
        ) : apiError ? (
          <div className="col-span-full bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-sm font-bold text-red-700">
              {apiError}
            </p>
            <button
              onClick={fetchEventsCampaigns}
              className="mt-4 px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold"
            >
              Try Again
            </button>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <AnimatePresence mode="popLayout">
              
              {/* --- EVENT CARDS --- */}
              {activeTab === "EVENTS" && filteredEvents.map((ev) => (
                <motion.div key={ev.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
                  className={`bg-white rounded-[2rem] border shadow-sm flex flex-col overflow-hidden hover:shadow-md transition-all p-6 gap-5 h-full min-h-[340px] ${ev.isRegistered ? 'border-green-300 bg-green-50/30' : 'border-gray-200'}`}
                >
                  {/* Header: Icon & Badge */}
                  <div className="flex justify-between items-start">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${ev.isRegistered ? 'bg-green-100 border border-green-200 text-green-700' : 'bg-blue-50 border border-blue-100 text-blue-600'}`}>
                      {ev.isRegistered ? <CheckCircle2 className="w-6 h-6" /> : <Calendar className="w-6 h-6" />}
                    </div>
                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest border shrink-0 ${
                      ev.status === 'UPCOMING' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-green-50 text-green-700 border-green-200'
                    }`}>
                      {ev.status}
                    </span>
                  </div>
                  
                  {/* Body: Title & Info */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-[18px] font-extrabold text-gray-900 leading-tight mb-4">{ev.title}</h3>
                    <div className={`flex flex-col gap-3 text-[12px] font-bold p-4 rounded-2xl border flex-1 ${ev.isRegistered ? 'bg-white text-gray-700 border-green-100' : 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                      <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-500"/> {formatDate(ev.startDate)}</span>
                      <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-blue-500"/> {formatTime(ev.startDate, ev.endDate)}</span>
                      <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-500"/> <span className="truncate">{ev.location}</span></span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => { setRegistrationStep(ev.isRegistered ? "SUCCESS" : "DETAILS"); setSelectedEvent(ev); }} className="flex-1 py-3.5 bg-gray-100 text-gray-800 border border-gray-200 rounded-xl text-[12px] font-extrabold hover:bg-gray-200 transition-colors shadow-sm text-center">
                      View Details
                    </button>
                    
                    {ev.isRegistered ? (
                      <button disabled className="flex-1 py-3.5 bg-green-100 text-green-800 border border-green-200 rounded-xl text-[12px] font-extrabold flex items-center justify-center gap-2 opacity-80 cursor-not-allowed">
                        <CheckCircle2 className="w-4 h-4" /> Registered
                      </button>
                    ) : ev.canRegister ? (
                      <button onClick={() => { setRegistrationStep("DETAILS"); setSelectedEvent(ev); }} className="flex-1 py-3.5 bg-blue-200 text-blue-900 border border-blue-300 rounded-xl text-[12px] font-extrabold hover:bg-blue-300 transition-colors shadow-sm text-center">
                        Register
                      </button>
                    ) : (
                      <button disabled className="flex-1 py-3.5 bg-gray-200 text-gray-500 border border-gray-300 rounded-xl text-[12px] font-extrabold opacity-80 cursor-not-allowed text-center">
                        Registration Closed
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* --- CAMPAIGN CARDS --- */}
              {activeTab === "CAMPAIGNS" && filteredCampaigns.map((camp) => {
                const progress = camp.targetAmount > 0 ? Math.min((camp.raisedAmount / camp.targetAmount) * 100, 100) : 0;
                
                return (
                  <motion.div key={camp.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
                    className="bg-white rounded-[2rem] border border-gray-200 shadow-sm flex flex-col overflow-hidden hover:shadow-md transition-all p-6 gap-5 h-full min-h-[340px]"
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center shadow-sm">
                        <Target className="w-6 h-6 text-orange-600" />
                      </div>
                      <span className="px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest border shrink-0 bg-orange-50 text-orange-800 border-orange-200">
                        {camp.program?.name || "CAMPAIGN"}
                      </span>
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-[18px] font-extrabold text-gray-900 leading-tight mb-4">{camp.title}</h3>
                      <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex flex-col justify-center flex-1">
                        <div className="flex justify-between items-end mb-2 text-[12px] font-bold">
                          <span className="text-green-800 text-[15px]">₹{(camp.raisedAmount/1000).toFixed(1)}k <span className="text-gray-500 text-[11px] font-medium">raised</span></span>
                          <span className="text-gray-600">Goal: ₹{(camp.targetAmount/1000).toFixed(1)}k</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 overflow-hidden">
                          <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                        <p className="text-[12px] font-extrabold text-gray-600 flex items-center gap-2">
                          <Users className="w-4 h-4 text-orange-500"/> {camp.supporters} Supporters
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button onClick={() => setSelectedCampaign(camp)} className="flex-1 py-3.5 bg-gray-100 text-gray-800 border border-gray-200 rounded-xl text-[12px] font-extrabold hover:bg-gray-200 transition-colors shadow-sm text-center">
                        View Details
                      </button>
                      <Link href={`/user/donate?campaignId=${camp.id}`} className="flex-1">
                        <button className="w-full py-3.5 bg-orange-200 text-orange-900 border border-orange-300 rounded-xl text-[12px] font-extrabold hover:bg-orange-300 transition-colors shadow-sm text-center block">
                          Donate
                        </button>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}

              {/* --- EMPTY STATES --- */}
              {activeTab === "EVENTS" && filteredEvents.length === 0 && (
                <div className="col-span-full text-center py-20 bg-white/50 rounded-[2rem] border border-dashed border-gray-200">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3 opacity-50" />
                  <p className="text-gray-600 font-bold text-[14px]">No events match your search.</p>
                </div>
              )}
              {activeTab === "CAMPAIGNS" && filteredCampaigns.length === 0 && (
                <div className="col-span-full text-center py-20 bg-white/50 rounded-[2rem] border border-dashed border-gray-200">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-3 opacity-50" />
                  <p className="text-gray-600 font-bold text-[14px]">No campaigns match your search.</p>
                </div>
              )}

            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* ==================================================== */}
      {/* --- EVENT MODAL (DETAILS → CONFIRM → SUCCESS) --- */}
      {/* ==================================================== */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {selectedEvent && (
            <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6" style={{ zIndex: 999999 }}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeEventModal} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="relative z-10 w-full max-w-2xl bg-[#fafafa] shadow-2xl flex flex-col rounded-[2rem] overflow-hidden max-h-[90vh]"
              >
                
                {/* ------------------------------------------------------------------ */}
                {/* STEP 1: EVENT DETAILS */}
                {/* ------------------------------------------------------------------ */}
                {registrationStep === "DETAILS" && (
                  <>
                    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0 sticky top-0 z-20">
                      <button onClick={closeEventModal} className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-200 rounded-xl text-[12px] font-extrabold text-gray-800 hover:bg-gray-200 shadow-sm transition-all">
                        <ArrowLeft className="w-4 h-4 text-gray-600" /> Back
                      </button>
                      <span className="text-[12px] font-extrabold text-gray-600 uppercase tracking-widest truncate max-w-[200px]">{selectedEvent.title}</span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                      <div className="h-40 w-full bg-gradient-to-br from-blue-100 to-indigo-100 relative flex items-center justify-center border-b border-gray-200">
                         {selectedEvent.coverImage ? (
                            <img src={selectedEvent.coverImage} alt={selectedEvent.title} className="w-full h-full object-cover" />
                         ) : (
                            <ImageIcon className="w-12 h-12 text-blue-400 opacity-60" />
                         )}
                      </div>
                      <div className="p-6 md:p-8">
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-4">{selectedEvent.title}</h2>
                        <div className="flex flex-wrap gap-4 text-[13px] font-bold text-gray-700 mb-6 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                          <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-600"/> {formatDate(selectedEvent.startDate)}</span>
                          <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-blue-600"/> {formatTime(selectedEvent.startDate, selectedEvent.endDate)}</span>
                          <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-600"/> {selectedEvent.location}</span>
                        </div>

                        <h4 className="text-[12px] font-extrabold text-gray-500 uppercase tracking-widest mb-3">About this event</h4>
                        <p className="text-[14px] font-medium text-gray-700 leading-relaxed mb-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm whitespace-pre-line">
                          {selectedEvent.description}
                        </p>

                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
                            <Users className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-1">Participants</p>
                            <p className="text-[15px] font-extrabold text-gray-900">
                              {selectedEvent.participants} {selectedEvent.maxParticipants !== null ? `/ ${selectedEvent.maxParticipants}` : ""} people registered
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-white border-t border-gray-200 shrink-0">
                      {selectedEvent.isRegistered ? (
                        <button disabled className="w-full py-4 rounded-xl font-extrabold text-[14px] flex items-center justify-center gap-2 bg-green-100 text-green-800 border border-green-200 cursor-not-allowed">
                          <CheckCircle2 className="w-5 h-5" /> Already Registered
                        </button>
                      ) : selectedEvent.canRegister ? (
                        <button onClick={() => setRegistrationStep("CONFIRM")} className="w-full py-4 rounded-xl font-extrabold text-[14px] transition-all shadow-sm bg-blue-600 text-white hover:bg-blue-700">
                          Register for Event
                        </button>
                      ) : (
                        <button disabled className="w-full py-4 rounded-xl font-extrabold text-[14px] transition-all bg-gray-300 text-gray-600 cursor-not-allowed">
                          Registration Closed
                        </button>
                      )}
                    </div>
                  </>
                )}

                {/* ------------------------------------------------------------------ */}
                {/* STEP 2: REGISTRATION CONFIRMATION */}
                {/* ------------------------------------------------------------------ */}
                {registrationStep === "CONFIRM" && (
                  <>
                    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0 sticky top-0 z-20">
                      <button disabled={isSubmitting} onClick={() => setRegistrationStep("DETAILS")} className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-200 rounded-xl text-[12px] font-extrabold text-gray-800 hover:bg-gray-200 shadow-sm transition-all disabled:opacity-50">
                        <ArrowLeft className="w-4 h-4 text-gray-600" /> Back to Event
                      </button>
                      <button disabled={isSubmitting} onClick={closeEventModal} className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 rounded-full transition-colors disabled:opacity-50">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 bg-[#fafafa]">
                      <div className="max-w-xl mx-auto space-y-8">
                        
                        <div className="text-center space-y-2">
                          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Confirm Registration</h2>
                          <p className="text-[14px] font-bold text-gray-500">You are registering for</p>
                        </div>

                        {/* Event Summary Card */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
                          <h3 className="text-xl font-extrabold text-gray-900 mb-4 leading-tight">{selectedEvent.title}</h3>
                          <div className="flex flex-col gap-2 text-[13px] font-bold text-gray-600 items-center justify-center">
                            <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-500"/> {formatDate(selectedEvent.startDate)}</span>
                            <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-blue-500"/> {formatTime(selectedEvent.startDate, selectedEvent.endDate)}</span>
                            <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-500"/> {selectedEvent.location}</span>
                          </div>
                        </div>

                        {/* User Summary Card */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                          <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-4">Registering As</p>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-[15px] border border-blue-200">
                              {currentUser?.name?.split(' ').map(n=>n[0]).join('').substring(0, 2).toUpperCase() || "U"}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[15px] font-extrabold text-gray-900">{currentUser?.name || "User"}</span>
                              <span className="text-[12px] font-bold text-gray-500 flex items-center gap-1.5 mt-0.5">
                                <Mail className="w-3.5 h-3.5" /> {currentUser?.email || ""}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Terms Checkbox */}
                        <button 
                          disabled={isSubmitting}
                          onClick={() => setAcceptedTerms(!acceptedTerms)} 
                          className="w-full flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100/50 transition-colors text-left disabled:opacity-50"
                        >
                          {acceptedTerms ? (
                            <CheckSquare className="w-5 h-5 text-blue-600 shrink-0" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-400 shrink-0" />
                          )}
                          <span className={`text-[13px] font-bold transition-colors ${acceptedTerms ? 'text-blue-900' : 'text-gray-600'}`}>
                            I confirm that I want to participate in this event.
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="p-6 bg-white border-t border-gray-200 shrink-0">
                      <button 
                        onClick={handleRegisterConfirm} 
                        disabled={!acceptedTerms || isSubmitting}
                        className="w-full py-4 rounded-xl font-extrabold text-[14px] transition-all shadow-md flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <><Loader2 className="w-5 h-5 animate-spin" /> Registering...</>
                        ) : (
                          "Confirm Registration"
                        )}
                      </button>
                    </div>
                  </>
                )}

                {/* ------------------------------------------------------------------ */}
                {/* STEP 3: SUCCESS */}
                {/* ------------------------------------------------------------------ */}
                {registrationStep === "SUCCESS" && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center p-8 md:p-12 text-center h-full bg-white">
                    <div className="w-24 h-24 bg-green-50 border-2 border-green-200 rounded-full flex items-center justify-center mb-6 shadow-sm">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                      </motion.div>
                    </div>
                    
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Registration Successful!</h2>
                    <p className="text-[15px] font-bold text-gray-500 mb-8 max-w-md">You have successfully registered for this event.</p>
                    
                    <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl w-full max-w-md mb-8">
                      <h3 className="text-[16px] font-extrabold text-gray-900 mb-4">{selectedEvent.title}</h3>
                      <div className="flex flex-col gap-2 text-[13px] font-bold text-gray-600 items-center">
                        <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-500"/> {formatDate(selectedEvent.startDate)}</span>
                        <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-blue-500"/> {formatTime(selectedEvent.startDate, selectedEvent.endDate)}</span>
                        <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-500"/> {selectedEvent.location}</span>
                      </div>
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Registered On</p>
                        <p className="text-[14px] font-extrabold text-gray-900">
                          {selectedEvent.registeredAt
                            ? new Date(selectedEvent.registeredAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : "-"}
                        </p>
                      </div>
                    </div>

                    <button onClick={closeEventModal} className="w-full max-w-md py-4 bg-gray-900 text-white rounded-xl text-[14px] font-extrabold shadow-md hover:bg-gray-800 transition-colors">
                      Done
                    </button>
                  </motion.div>
                )}

              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ==================================================== */}
      {/* --- CAMPAIGN DETAILS MODAL (PORTAL) --- */}
      {/* ==================================================== */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {selectedCampaign && (
            <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6" style={{ zIndex: 999999 }}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedCampaign(null)} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="relative z-10 w-full max-w-2xl max-h-[90vh] bg-[#f8fafc] shadow-2xl flex flex-col rounded-[2rem] overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0 sticky top-0 z-20">
                  <button onClick={() => setSelectedCampaign(null)} className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-200 rounded-xl text-[12px] font-extrabold text-gray-800 hover:bg-gray-200 shadow-sm transition-all">
                    <ArrowLeft className="w-4 h-4 text-gray-600" /> Back
                  </button>
                  <span className="text-[12px] font-extrabold text-gray-600 uppercase tracking-widest truncate max-w-[200px]">{selectedCampaign.title}</span>
                </div>
                
                {/* Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <div className="h-40 w-full bg-gradient-to-br from-orange-100 to-red-100 relative flex items-center justify-center border-b border-gray-200 overflow-hidden">
                     {selectedCampaign.coverImage ? (
                        <img src={selectedCampaign.coverImage} alt={selectedCampaign.title} className="w-full h-full object-cover" />
                     ) : (
                        <ImageIcon className="w-12 h-12 text-orange-400 opacity-60" />
                     )}
                     <div className="absolute bottom-4 left-6 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[11px] font-extrabold uppercase tracking-widest text-orange-900 shadow-sm border border-orange-200">
                       {selectedCampaign.program?.name || "CAMPAIGN"}
                     </div>
                  </div>
                  
                  <div className="p-6 md:p-8 space-y-6">
                    <h2 className="text-2xl font-extrabold text-gray-900">{selectedCampaign.title}</h2>
                    <div>
                      <h4 className="text-[12px] font-extrabold text-gray-500 uppercase tracking-widest mb-3">About the Campaign</h4>
                      <p className="text-[14px] font-medium text-gray-700 leading-relaxed bg-white p-6 rounded-xl border border-gray-200 shadow-sm whitespace-pre-line">
                        {selectedCampaign.description}
                      </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                      <h4 className="text-[12px] font-extrabold text-gray-500 uppercase tracking-widest mb-4">Fundraising Progress</h4>
                      <div className="flex justify-between items-end mb-2 text-[13px] font-bold">
                        <span className="text-[20px] font-extrabold text-green-800">₹{(selectedCampaign.raisedAmount/1000).toLocaleString()}k <span className="text-gray-500 text-[12px] font-medium">raised</span></span>
                        <span className="text-gray-600">Goal: ₹{(selectedCampaign.targetAmount/1000).toLocaleString()}k</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
                        <div className="bg-green-500 h-3 rounded-full" style={{ width: `${selectedCampaign.targetAmount > 0 ? Math.min((selectedCampaign.raisedAmount / selectedCampaign.targetAmount) * 100, 100) : 0}%` }}></div>
                      </div>
                      <p className="text-[13px] font-extrabold text-gray-600 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-orange-500"/> {selectedCampaign.supporters} supporters have contributed
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-white border-t border-gray-200 shrink-0">
                  <Link href={`/user/donate?campaignId=${selectedCampaign.id}`} className="w-full" onClick={() => setSelectedCampaign(null)}>
                    <button className="w-full py-4 rounded-xl font-extrabold text-[14px] transition-all shadow-sm bg-orange-500 text-white hover:bg-orange-600 text-center block border border-orange-600">
                      Donate Now
                    </button>
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </div>
  );
}