"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, Plus, BookOpen, Target, Calendar, Users,
  Activity, Eye, Edit3, Trash2, X, ChevronDown,
  MoreVertical, Heart, UploadCloud, CheckCircle2, TrendingUp, AlertCircle
} from "lucide-react";
import {
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
} from "../../../../services/program.service";


const programCategories = [
  "Education", "Healthcare", "Environment", "Food Distribution",
  "Women Empowerment", "Child Welfare", "Blood Donation", "Rural Development",
  "Disability Support", "Animal Welfare", "Sustainability", "Disaster Relief"
];


export default function ProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form States
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [coordinator, setCoordinator] = useState("");
  const [manager, setManager] = useState("");
  const [budget, setBudget] = useState("");
  
  const [campaigns, setCampaigns] = useState(0);
  const [events, setEvents] = useState(0);
  const [volunteers, setVolunteers] = useState(0);
  const [beneficiaries, setBeneficiaries] = useState(0);
  
  const [progress, setProgress] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("UPCOMING");
  const [coverImage, setCoverImage] = useState("");

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Modal States
  const [selectedProgram, setSelectedProgram] =
useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [programToEdit, setProgramToEdit] = useState<any | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
 const [programToDelete, setProgramToDelete] =
useState<any>(null);

  // Handlers
  const handleEditClick = (program: any) => {
    setProgramToEdit(program);
    setName(program.name || "");
    setCategory(program.category || "");
    setDescription(program.description || "");
    setCoordinator(program.coordinator || "");
    setManager(program.manager || "");
    setBudget(program.budget || "");
   setCampaigns(program.campaigns?.length ?? 0);
setEvents(program.events?.length ?? 0);
setVolunteers(program.volunteers?.length ?? 0);
    setBeneficiaries(program.beneficiaries || 0);
    setProgress(program.progress || 0);
    setLocation(program.location || "");
    setStartDate(program.startDate || "");
    setEndDate(program.endDate || "");
    setStatus(program.status || "UPCOMING");
    setCoverImage(program.coverImage || "");
    setIsEditModalOpen(true);
    setActiveDropdown(null);
  };

const handleDeleteClick = (prog: any) => { 
    setProgramToDelete(prog);
    setIsDeleteModalOpen(true);
    setActiveDropdown(null);
  };

  const confirmDelete = async () => {
    if (!programToDelete) return;
    try {
      const res = await deleteProgram(programToDelete.id);
      if (res.success) {
        await loadPrograms();
        setProgramToDelete(null);
        setIsDeleteModalOpen(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(amount));
  };

  const filteredPrograms =
programs.filter(program =>
program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
program.coordinator?.toLowerCase().includes(searchQuery.toLowerCase())
);
  useEffect(() => {
    loadPrograms();
  }, []);

  async function loadPrograms() {
    try {
      const res = await getPrograms();
      if (res.success) {
        setPrograms(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  }
  
 async function handleCreateProgram() {

  console.log("Create button clicked");

  try {

    const data = {
      ngoId: "YOUR_REAL_NGO_ID",
      createdBy: "YOUR_REAL_USER_ID",
      name,
      category,
      description,
      coordinator,
      manager,
      budget,
      campaigns,
      events,
      volunteers,
      beneficiaries,
      progress,
      location,
      coverImage,
      status,
      startDate,
      endDate,
    };

    console.log("Sending:", data);

    const res = await createProgram(data);

    console.log("Response:", res);

    if (res.success) {

      await loadPrograms();

  setName("");
  setCategory("");
  setDescription("");
  setCoordinator("");
  setManager("");
  setBudget("");
  setCampaigns(0);
  setEvents(0);
  setVolunteers(0);
  setBeneficiaries(0);
  setProgress(0);
  setLocation("");
  setStartDate("");
  setEndDate("");
  setStatus("UPCOMING");
  setCoverImage("");


      setIsCreateModalOpen(false);

    }

  } catch (err) {

    console.error(err);

  }

}

  async function handleUpdateProgram() {
    if (!programToEdit) return;
    try {
      const res = await updateProgram({
        id: programToEdit.id,
        name,
        category,
        description,
        coordinator,
        manager,
        budget: Number(budget),
        campaigns,
        events,
        volunteers,
        beneficiaries,
        progress,
        location,
        startDate: new Date(startDate),
endDate: endDate ? new Date(endDate) : null,
        status,
        coverImage,
      });

      if (res.success) {
        await loadPrograms();
        setIsEditModalOpen(false);
        setProgramToEdit(null);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col gap-8 pb-10 overflow-x-hidden">

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
              <path d="M22 2L15 22L11 13L2 9L22 2Z" fill="#22c55e" stroke="#16a34a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
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
        <div className="flex items-center justify-between">

          {/* Quick Search */}
          <div className="relative w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#16A34A] transition-colors" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/80 backdrop-blur-md border border-gray-200 rounded-full py-2.5 pl-9 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 transition-all shadow-sm hover:bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredPrograms.map((prog, i) => (
              <motion.div
                key={prog.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: 0.1 }}
                className={`bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all flex flex-col relative ${activeDropdown === prog.id ? 'z-50' : 'z-10 overflow-hidden'}`}
              >
                {/* Header Banner */}
                <div className={`h-32 w-full ${prog.color || 'bg-blue-50'} relative p-6 flex flex-col justify-end overflow-hidden rounded-t-[2.5rem]`}>
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>

                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-white shadow-sm ${prog.textColor || 'text-blue-600'}`}>{prog.status}</span>
                  </div>

                  {/* Actions Dropdown Button in Banner */}
                  <div className="absolute top-4 right-4 z-20">
                    <button onClick={() => setActiveDropdown(activeDropdown === prog.id ? null : prog.id)} className="p-1.5 text-gray-700 bg-white/50 hover:bg-white rounded-full transition-colors backdrop-blur-sm shadow-sm">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="relative z-10 flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                      {prog.icon ? <prog.icon className={`w-6 h-6 ${prog.textColor}`} /> : <BookOpen className="w-6 h-6 text-blue-600" />}
                    </div>
                  </div>
                </div>

                {/* Actions Menu (Rendered outside the hidden overflow flow via high Z) */}
                <AnimatePresence>
                  {activeDropdown === prog.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.15 }}
                      className="absolute right-6 top-14 w-48 bg-white rounded-[1.2rem] shadow-[0_10px_40px_rgb(0,0,0,0.15)] border border-gray-100 py-2 z-[60] text-left"
                    >
                      <button onClick={() => { setSelectedProgram(prog); setActiveDropdown(null); }} className="w-full text-left px-4 py-2 text-[12px] font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Eye className="w-3.5 h-3.5" /> View Details</button>
                      <button onClick={() => handleEditClick(prog)} className="w-full text-left px-4 py-2 text-[12px] font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Edit3 className="w-3.5 h-3.5" /> Edit Program</button>
                      <div className="h-px bg-gray-100 my-1"></div>
                      <button className="w-full text-left px-4 py-2 text-[12px] font-bold text-[#16a34a] hover:bg-green-50 flex items-center gap-2"><Target className="w-3.5 h-3.5" /> Link Campaign</button>
                      <button className="w-full text-left px-4 py-2 text-[12px] font-bold text-[#f97316] hover:bg-orange-50 flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Assign Event</button>
                      <div className="h-px bg-gray-100 my-1"></div>
                      <button onClick={() => handleDeleteClick(prog)} className="w-full text-left px-4 py-2 text-[12px] font-bold text-red-500 hover:bg-red-50 flex items-center gap-2"><Trash2 className="w-3.5 h-3.5" /> Delete Program</button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="p-6 flex flex-col flex-1">
                  <span className={`text-[11px] font-extrabold uppercase tracking-widest mb-1 ${prog.textColor || 'text-blue-600'}`}>{prog.category}</span>
                  <h3 className="text-xl font-extrabold text-gray-900 leading-tight mb-2 hover:text-[#16a34a] transition-colors">{prog.name}</h3>
                  <p className="text-[12px] font-bold text-gray-500 mb-6 line-clamp-2">{prog.description}</p>

                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-6 border-t border-b border-gray-100 py-4">
                    <div>
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1">Coordinator</span>
                      <p className="text-[13px] font-bold text-gray-900 truncate">{prog.coordinator}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1">Total Budget</span>
                      <p className="text-[13px] font-extrabold text-gray-900">{prog.budget ? formatCurrency(prog.budget) : 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-gray-50 rounded-[1.2rem] p-3 mb-6">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-extrabold text-gray-900">{prog.campaigns?.length ?? 0}</span>
                      <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-wide">Camp.</span>
                    </div>
                    <div className="w-px h-8 bg-gray-200"></div>
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-extrabold text-gray-900">{prog.events?.length ?? 0}</span>
                      <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-wide">Events</span>
                    </div>
                    <div className="w-px h-8 bg-gray-200"></div>
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-extrabold text-gray-900">{prog.volunteers?.length ?? 0}</span>
                      <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-wide">Vols</span>
                    </div>
                    <div className="w-px h-8 bg-gray-200"></div>
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-extrabold text-gray-900">{prog.beneficiaries ?? 0}</span>
                      <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-wide">Benfs</span>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex justify-between text-[11px] font-extrabold mb-2">
                      <span className="text-gray-500">Program Progress</span>
                      <span className={prog.textColor || 'text-blue-600'}>{prog.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden mb-6">
                      <div className={`h-full rounded-full ${(prog.color || 'bg-blue-100').replace('100', '500')}`} style={{ width: `${prog.progress || 0}%` }}></div>
                    </div>
                    <button onClick={() => setSelectedProgram(prog)} className="w-full py-3.5 bg-gray-50 text-gray-700 rounded-full text-[12px] font-extrabold hover:bg-[#16a34a] hover:text-white transition-all shadow-sm flex items-center justify-center gap-2">
                      <Eye className="w-4 h-4" /> View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredPrograms.length === 0 && (
            <div className="col-span-full py-20 text-center flex flex-col items-center justify-center text-gray-400">
              <BookOpen className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-[13px] font-bold">No programs found.</p>
            </div>
          )}
        </div>
      </div>

      {/* ==================================================== */}
      {/* --- CENTERED MODAL (VIEW PROGRAM PROFILE) --- */}
      {/* ==================================================== */}
      <AnimatePresence>
        {selectedProgram && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProgram(null)} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-[800px] max-h-[90vh] bg-[#fafafa] rounded-[2.5rem] shadow-2xl z-[101] flex flex-col overflow-hidden"
            >
              {/* Modal Header / Banner */}
              <div className={`relative h-40 w-full ${selectedProgram.color || 'bg-blue-100'} shrink-0 p-8 flex flex-col justify-end`}>
                <button onClick={() => setSelectedProgram(null)} className="absolute top-6 right-6 p-2 bg-white/50 hover:bg-white text-gray-800 rounded-full shadow-sm transition-all backdrop-blur-md"><X className="w-4 h-4" /></button>
                <div className="absolute top-6 left-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-white shadow-sm ${selectedProgram.textColor || 'text-blue-600'}`}>{selectedProgram.status}</span>
                </div>
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md">
                    {selectedProgram.icon ? <selectedProgram.icon className={`w-7 h-7 ${selectedProgram.textColor}`} /> : <BookOpen className={`w-7 h-7 ${selectedProgram.textColor || 'text-blue-600'}`} />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">{selectedProgram.name}</h2>
                    <p className={`text-[12px] font-extrabold uppercase tracking-widest ${selectedProgram.textColor || 'text-blue-600'}`}>{selectedProgram.category}</p>
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
                    <p className="text-[13px] font-bold text-gray-900">{selectedProgram.budget ? formatCurrency(selectedProgram.budget) : 'N/A'}</p>
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
                      <span className="text-xl font-extrabold text-purple-600">{selectedProgram.campaigns?.length ?? 0}</span>
                      <span className="text-[9px] font-extrabold text-gray-500 uppercase">Campaigns</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-orange-50 rounded-2xl">
                      <span className="text-xl font-extrabold text-[#f97316]">{selectedProgram.events?.length ?? 0}</span>
                      <span className="text-[9px] font-extrabold text-gray-500 uppercase">Events</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-green-50 rounded-2xl">
                      <span className="text-xl font-extrabold text-[#16a34a]">{selectedProgram.volunteers?.length ?? 0}</span>
                      <span className="text-[9px] font-extrabold text-gray-500 uppercase">Vols</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-blue-50 rounded-2xl">
                      <span className="text-xl font-extrabold text-blue-600">{selectedProgram.beneficiaries?.length ?? 0}</span>
                      <span className="text-[9px] font-extrabold text-gray-500 uppercase">Beneficiaries</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-[11px] font-extrabold mb-2">
                    <span className="text-gray-500">Overall Progress</span>
                    <span className={selectedProgram.textColor || 'text-blue-600'}>{selectedProgram.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden mb-4">
                    <div className={`h-full rounded-full ${(selectedProgram.color || 'bg-blue-100').replace('100', '500')}`} style={{ width: `${selectedProgram.progress || 0}%` }}></div>
                  </div>
                  <p className="text-[11px] font-bold text-gray-500 text-center">Used <span className="font-extrabold text-gray-900">{selectedProgram.usedBudget || '₹0'}</span> out of {selectedProgram.budget ? formatCurrency(selectedProgram.budget) : '₹0'}</p>
                </div>

                {/* 3. Linked Assets */}
                <div className="mb-8 flex flex-col gap-4">
                  <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm">
                    <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Target className="w-3.5 h-3.5" /> Linked Campaigns</h4>
                    <div className="flex flex-wrap gap-2">
                      
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm">
                    <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Linked Events</h4>
                    <div className="flex flex-wrap gap-2">
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="p-4 border-t border-gray-100 bg-white shrink-0 grid grid-cols-2 gap-3">
                <button onClick={() => { setSelectedProgram(null); handleEditClick(selectedProgram); }} className="py-3.5 bg-gray-50 border border-gray-200 rounded-full text-[12px] font-extrabold text-gray-600 hover:bg-gray-100 flex items-center justify-center gap-2"><Edit3 className="w-4 h-4" /> Edit Program</button>
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
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
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
                  
                  {/* File Upload Area */}
                  <div className="col-span-1 md:col-span-2 border-2 border-dashed border-gray-200 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-green-50/50 transition-colors cursor-pointer relative">
                    <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                      <UploadCloud className="w-6 h-6 text-[#16a34a]" />
                    </div>
                    <h4 className="text-[13px] font-extrabold text-gray-900">Upload Program Banner</h4>
                    <p className="text-[11px] font-bold text-gray-400 mb-2">1920x1080px recommended</p>
                    {coverImage && <p className="text-[11px] font-bold text-[#16a34a] bg-green-100 px-3 py-1 rounded-full">{coverImage}</p>}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setCoverImage(file.name);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Program Name *</label>
                    <input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="e.g. Health for All" className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Category *</label>
                    <select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none appearance-none">
                      <option value="">Select a Category</option>
                      {programCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  
                  <div className="space-y-1.5 col-span-1 md:col-span-2">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Description *</label>
                    <textarea rows={3} value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Program objectives and overview..." className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none resize-none custom-scrollbar" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Program Coordinator</label>
                    <input type="text" value={coordinator} onChange={(e)=>setCoordinator(e.target.value)} placeholder="Coordinator Name" className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Program Manager</label>
                    <input type="text" value={manager} onChange={(e) => setManager(e.target.value)} placeholder="Manager Name" className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none" /> 
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Target Beneficiaries</label>
                    <input type="number" value={beneficiaries} onChange={(e)=>setBeneficiaries(Number(e.target.value))} placeholder="500" className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Estimated Budget (₹)</label>
                    <input type="number" value={budget} onChange={(e)=>setBudget(e.target.value)} placeholder="500000" className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Progress (%)</label>
                    <input type="number" value={progress} onChange={(e) => setProgress(Number(e.target.value))} placeholder="0" min={0} max={100} className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Location Coverage</label>
                    <input type="text" value={location} onChange={(e)=>setLocation(e.target.value)} placeholder="e.g. Pan India" className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none appearance-none">
                      <option value="UPCOMING">Upcoming</option>
                      <option value="ACTIVE">Active</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Start Date</label>
                    <input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none text-gray-600" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">End Date</label>
                    <input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none text-gray-600" />
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50/50 shrink-0 flex justify-end gap-3">
                <button onClick={() => setIsCreateModalOpen(false)} className="px-8 py-3.5 rounded-full font-bold text-[13px] text-gray-600 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">Cancel</button>
                <button
                  type="button"
                  onClick={handleCreateProgram}
                  className="px-10 py-3.5 rounded-full font-bold text-[13px] text-white bg-[#16A34A] hover:bg-[#15803d] shadow-[0_8px_20px_rgba(22,163,74,0.25)] transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4"/>
                  Save Program
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* --- MODAL (EDIT PROGRAM) --- */}
      {/* ==================================================== */}
      <AnimatePresence>
        {isEditModalOpen && programToEdit && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col z-[121] overflow-hidden max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50 shrink-0">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Edit Program</h2>
                  <p className="text-[13px] font-bold text-gray-400 mt-1">ID: {programToEdit.id}</p>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 bg-white hover:bg-gray-50 rounded-full transition-colors border border-gray-200 shadow-sm"><X className="w-5 h-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* File Upload Area */}
                  <div className="col-span-1 md:col-span-2 border-2 border-dashed border-gray-200 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-orange-50/50 transition-colors cursor-pointer relative">
                    <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                      <UploadCloud className="w-6 h-6 text-[#f97316]" />
                    </div>
                    <h4 className="text-[13px] font-extrabold text-gray-900">Update Program Banner</h4>
                    <p className="text-[11px] font-bold text-gray-400 mb-2">1920x1080px recommended</p>
                    {coverImage && <p className="text-[11px] font-bold text-[#f97316] bg-orange-100 px-3 py-1 rounded-full">{coverImage}</p>}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setCoverImage(file.name);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>

                  {/* Basic Information */}
                  <div className="col-span-1 md:col-span-2">
                    <h4 className="text-[12px] font-extrabold text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">Basic Information</h4>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Program Name *</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#f97316]/20 outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Category *</label>
                    <select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#f97316]/20 outline-none appearance-none">
                      <option value="">Select a Category</option>
                      {programCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5 col-span-1 md:col-span-2">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Description *</label>
                    <textarea rows={3} value={description} onChange={(e)=>setDescription(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#f97316]/20 outline-none resize-none custom-scrollbar" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Program Coordinator</label>
                    <input type="text" value={coordinator} onChange={(e)=>setCoordinator(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#f97316]/20 outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Program Manager</label>
                    <input type="text" value={manager} onChange={(e) => setManager(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#f97316]/20 outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Estimated Budget (₹)</label>
                    <input type="number" value={budget} onChange={(e)=>setBudget(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#f97316]/20 outline-none" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Progress (%)</label>
                    <input type="number" value={progress} onChange={(e) => setProgress(Number(e.target.value))} min={0} max={100} className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#f97316]/20 outline-none" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Location Coverage</label>
                    <input type="text" value={location} onChange={(e)=>setLocation(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#f97316]/20 outline-none" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#f97316]/20 outline-none appearance-none">
                      <option value="UPCOMING">Upcoming</option>
                      <option value="ACTIVE">Active</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Start Date</label>
                    <input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#f97316]/20 outline-none text-gray-600" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">End Date</label>
                    <input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#f97316]/20 outline-none text-gray-600" />
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50/50 shrink-0 flex justify-end gap-3">
                <button onClick={() => setIsEditModalOpen(false)} className="px-8 py-3.5 rounded-full font-bold text-[13px] text-gray-600 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="button" onClick={handleUpdateProgram} className="px-10 py-3.5 rounded-full font-bold text-[13px] text-white bg-[#f97316] hover:bg-[#ea580c] shadow-[0_8px_20px_rgba(249,115,22,0.25)] transition-all flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* --- DELETE CONFIRMATION MODAL --- */}
      {/* ==================================================== */}
      <AnimatePresence>
        {isDeleteModalOpen && programToDelete && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[2rem] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col items-center text-center z-[1000]"
            >
              <button onClick={() => setIsDeleteModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors">
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 bg-red-50 text-red-500">
                <AlertCircle className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-extrabold text-gray-900 mb-2">Delete Program?</h3>
              <p className="text-[13px] font-bold text-gray-500 mb-8 leading-relaxed">
                Are you sure you want to completely delete the <strong className="text-gray-800">{programToDelete.name}</strong> program? This will detach all linked campaigns and events.
              </p>

              <div className="w-full flex gap-3">
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3.5 rounded-full font-bold text-[13px] text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button onClick={confirmDelete} className="flex-1 py-3.5 rounded-full font-bold text-[13px] text-white bg-red-500 hover:bg-red-600 shadow-[0_8px_20px_rgba(239,68,68,0.3)] transition-all">
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}