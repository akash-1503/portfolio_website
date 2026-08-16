"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { 
  Search, Image as ImageIcon, Video, FileText, 
  CheckCircle, Plus, UploadCloud, MoreVertical, 
  Eye, Edit3, Trash2, X, MapPin, Calendar, 
  Folder, LayoutGrid, FileImage, Layers, AlertCircle,
  ArrowLeft
} from "lucide-react";

// --- MOCK DATA & INTERFACES ---

interface GalleryStat {
  label: string;
  value: number | string;
  icon: any;
  color: string;
  bg: string;
}

const mockStats: GalleryStat[] = [
  { label: "Total Photos", value: 248, icon: ImageIcon, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Videos", value: 32, icon: Video, color: "text-orange-600", bg: "bg-orange-50" },
  { label: "Stories", value: 18, icon: FileText, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Published", value: 41, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
];

type GalleryStatus = "Published" | "Draft" | "Archived";
type GalleryType = "Photo Story" | "Video Story" | "Event Story" | "Campaign Story";

interface GalleryItem {
  id: string;
  title: string;
  type: GalleryType;
  status: GalleryStatus;
  date: string;
  location: string;
  description: string;
  coverImage: string | null;
  mediaCount: number;
}

const initialGalleryItems: GalleryItem[] = [
  {
    id: "g-1",
    title: "Education Drive 2026",
    type: "Photo Story",
    status: "Published",
    date: "2026-08-12",
    location: "Chhatrapati Sambhajinagar",
    description: "Our volunteers distributed educational materials to students in rural communities.",
    coverImage: null,
    mediaCount: 15
  },
  {
    id: "g-2",
    title: "Green Canopy Tree Plantation",
    type: "Event Story",
    status: "Published",
    date: "2026-08-05",
    location: "Pune City Park",
    description: "Planting over 500 saplings to promote urban greenery.",
    coverImage: null,
    mediaCount: 24
  },
  {
    id: "g-3",
    title: "Health & Wellness Camp Highlights",
    type: "Video Story",
    status: "Draft",
    date: "2026-07-28",
    location: "Nashik Community Center",
    description: "A comprehensive look at our latest free medical checkup drive.",
    coverImage: null,
    mediaCount: 1
  },
  {
    id: "g-4",
    title: "Flood Relief Campaign Journey",
    type: "Campaign Story",
    status: "Archived",
    date: "2026-07-10",
    location: "Kolhapur District",
    description: "Documenting our response and support during the recent floods.",
    coverImage: null,
    mediaCount: 42
  }
];

const TABS = ["All Media", "Stories", "Photos", "Videos", "Albums"];

export default function AdminGalleryDashboard() {
  const [mounted, setMounted] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(initialGalleryItems);
  
  const [activeTab, setActiveTab] = useState("All Media");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Modals State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [viewingItem, setViewingItem] = useState<GalleryItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<GalleryItem | null>(null);

  // Form States
  const [formState, setFormState] = useState<Partial<GalleryItem>>({
    title: "", description: "", type: "Photo Story", location: "", date: "", status: "Draft"
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // --- ACTIONS ---
  const handleCreateSave = () => {
    const newItem: GalleryItem = {
      id: `g-${Date.now()}`,
      title: formState.title || "Untitled Story",
      type: formState.type as GalleryType || "Photo Story",
      status: formState.status as GalleryStatus || "Draft",
      date: formState.date || new Date().toISOString().split('T')[0],
      location: formState.location || "Unknown Location",
      description: formState.description || "No description provided.",
      coverImage: null,
      mediaCount: 0
    };
    setGalleryItems([newItem, ...galleryItems]);
    setIsCreateModalOpen(false);
    setFormState({ title: "", description: "", type: "Photo Story", location: "", date: "", status: "Draft" });
  };

  const handleEditSave = () => {
    if (!editingItem) return;
    setGalleryItems(galleryItems.map(item => item.id === editingItem.id ? { ...item, ...formState } as GalleryItem : item));
    setEditingItem(null);
  };

  const confirmDelete = () => {
    if (!deletingItem) return;
    setGalleryItems(galleryItems.filter(item => item.id !== deletingItem.id));
    setDeletingItem(null);
  };

  const togglePublishStatus = (item: GalleryItem) => {
    const newStatus = item.status === "Published" ? "Draft" : "Published";
    setGalleryItems(galleryItems.map(i => i.id === item.id ? { ...i, status: newStatus } : i));
    setActiveDropdown(null);
  };

  // --- FILTERS ---
  const filteredGallery = galleryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "All Media" || 
      (activeTab === "Stories" && item.type.includes("Story")) ||
      (activeTab === "Photos" && item.type === "Photo Story") ||
      (activeTab === "Videos" && item.type === "Video Story");
    return matchesSearch && matchesTab;
  });

  // --- ANIMATIONS ---
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="relative flex flex-col gap-8 min-h-screen pb-24 overflow-x-hidden w-full bg-[#fafafa]">
      
      {/* ==================================================== */}
      {/* --- BACKGROUND ELEMENTS (CLEAN/WHITE THEME) --- */}
      {/* ==================================================== */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] right-[5%] w-[300px] h-[300px] opacity-10 mix-blend-multiply">
          <svg className="absolute w-full h-full" viewBox="0 0 200 200" fill="none">
            <path d="M 50 150 C 50 50, 150 50, 200 150" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6 8" strokeLinecap="round" opacity="0.4" />
          </svg>
          <motion.div animate={{ y: [-15, 15, -15], rotate: [0, -10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-10 left-10">
            <LayoutGrid className="w-10 h-10 text-blue-400 opacity-60 drop-shadow-md" />
          </motion.div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* --- 1. HEADER SECTION --- */}
      {/* ==================================================== */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="relative z-10 px-4 md:px-8 mt-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.h1 variants={itemVariants} className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
              Gallery Management
            </motion.h1>
            <motion.p variants={itemVariants} className="text-[14px] font-bold text-gray-500 max-w-2xl">
              Manage your NGO's stories, photos, videos, and memories.
            </motion.p>
          </div>
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
            <button className="px-6 py-3.5 bg-white text-gray-800 border border-gray-200 rounded-full text-[13px] font-extrabold shadow-sm hover:bg-gray-50 hover:shadow transition-all flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-gray-600" /> Upload Media
            </button>
            <button 
              onClick={() => {
                setFormState({ title: "", description: "", type: "Photo Story", location: "", date: "", status: "Draft" });
                setIsCreateModalOpen(true);
              }} 
              className="px-8 py-3.5 bg-white text-black border border-gray-300 rounded-full text-[13px] font-extrabold shadow-sm hover:bg-gray-50 hover:shadow-md transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 text-black" /> Create Story
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* ==================================================== */}
      {/* --- 2. STATISTICS --- */}
      {/* ==================================================== */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-4 md:px-8">
        {mockStats.map((stat, i) => (
          <motion.div key={i} variants={itemVariants} className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight mt-0.5">
                  {stat.label === "Published" ? galleryItems.filter(i => i.status === "Published").length : stat.value}
                </h3>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ==================================================== */}
      {/* --- 3. FILTERS & SEARCH --- */}
      {/* ==================================================== */}
      <div className="relative z-10 px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* TABS */}
        <div className="flex overflow-x-auto custom-scrollbar pb-2 md:pb-0 gap-2 snap-x w-full md:w-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSearchQuery(""); }}
              className={`snap-start whitespace-nowrap px-6 py-3 rounded-full text-[12px] font-extrabold tracking-wide transition-all border ${
                activeTab === tab 
                ? "bg-gray-900 text-white border-gray-900 shadow-md" 
                : "bg-white text-gray-600 hover:bg-gray-50 border-gray-200 shadow-sm"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* SEARCH */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search gallery..."
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-full text-[13px] font-bold text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 outline-none shadow-sm transition-all"
          />
        </div>
      </div>

      {/* ==================================================== */}
      {/* --- 4. GALLERY GRID --- */}
      {/* ==================================================== */}
      <div className="relative z-10 px-4 md:px-8">
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredGallery.map((item) => (
              <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
                className={`bg-white rounded-[1.5rem] border border-gray-200 shadow-sm flex flex-col group relative transition-all ${activeDropdown === item.id ? 'z-50' : 'z-0 hover:shadow-md hover:-translate-y-1'}`}
              >
                {/* Image Area */}
                <div className="h-48 w-full bg-gray-100 relative overflow-hidden flex items-center justify-center rounded-t-[1.5rem] border-b border-gray-100">
                  {item.coverImage ? (
                    <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-gray-300 group-hover:scale-110 transition-transform duration-700" />
                  )}
                  <div className="absolute top-4 left-4">
                    <span className={`px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-md text-[9px] font-extrabold uppercase tracking-widest shadow-sm flex items-center gap-1.5 ${
                      item.status === 'Published' ? 'text-green-700 border border-green-200' : 
                      item.status === 'Draft' ? 'text-orange-700 border border-orange-200' : 'text-gray-600 border border-gray-300'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        item.status === 'Published' ? 'bg-green-500' : item.status === 'Draft' ? 'bg-orange-500' : 'bg-gray-400'
                      }`}></span>
                      {item.status}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur-sm rounded-lg px-2.5 py-1 flex items-center gap-1.5 text-white shadow-sm border border-gray-700/50">
                    <FileImage className="w-3.5 h-3.5" /> <span className="text-[11px] font-bold">{item.mediaCount}</span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-[16px] font-extrabold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    
                    {/* Action Menu (3-dots) */}
                    <div className="relative">
                      <button onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)} className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      <AnimatePresence>
                        {activeDropdown === item.id && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -10 }} transition={{ duration: 0.15 }}
                            className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-[0_10px_40px_rgb(0,0,0,0.15)] border border-gray-100 py-2 z-[999] text-left origin-top-right overflow-hidden"
                          >
                            <button onClick={() => { setViewingItem(item); setActiveDropdown(null); }} className="w-full text-left px-4 py-2.5 text-[12px] font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                              <Eye className="w-3.5 h-3.5" /> View Story
                            </button>
                            <button onClick={() => { 
                               setFormState(item);
                               setEditingItem(item); 
                               setActiveDropdown(null); 
                            }} className="w-full text-left px-4 py-2.5 text-[12px] font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                              <Edit3 className="w-3.5 h-3.5" /> Edit
                            </button>
                            <div className="h-px bg-gray-100 my-1"></div>
                            {item.status === 'Published' ? (
                              <button onClick={() => togglePublishStatus(item)} className="w-full text-left px-4 py-2.5 text-[12px] font-bold text-orange-600 hover:bg-orange-50 flex items-center gap-2"><Folder className="w-3.5 h-3.5" /> Unpublish</button>
                            ) : (
                              <button onClick={() => togglePublishStatus(item)} className="w-full text-left px-4 py-2.5 text-[12px] font-bold text-green-600 hover:bg-green-50 flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5" /> Publish</button>
                            )}
                            <button onClick={() => { setDeletingItem(item); setActiveDropdown(null); }} className="w-full text-left px-4 py-2.5 text-[12px] font-bold text-red-600 hover:bg-red-50 flex items-center gap-2">
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <p className="text-[10px] font-extrabold text-blue-700 uppercase tracking-widest bg-blue-50 w-fit px-2 py-1 rounded border border-blue-100 mb-3">
                    {item.type}
                  </p>
                  
                  <div className="mt-auto flex flex-col gap-2 pt-2 border-t border-gray-50">
                    <p className="text-[11px] font-bold text-gray-600 flex items-center gap-2"><MapPin className="w-3 h-3 text-gray-400"/> {item.location}</p>
                    <p className="text-[11px] font-bold text-gray-600 flex items-center gap-2"><Calendar className="w-3 h-3 text-gray-400"/> {item.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredGallery.length === 0 && (
          <div className="py-24 flex flex-col items-center justify-center text-center bg-white rounded-[2.5rem] border border-dashed border-gray-300 mt-6">
            <ImageIcon className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-[16px] font-extrabold text-gray-900 mb-2">No Media Found</h3>
            <p className="text-[13px] font-bold text-gray-500 max-w-sm mb-6">Create a new story or try adjusting your search filters.</p>
            <button onClick={() => {
              setFormState({ title: "", description: "", type: "Photo Story", location: "", date: "", status: "Draft" });
              setIsCreateModalOpen(true);
            }} className="px-8 py-3.5 bg-white text-black border border-gray-300 rounded-full text-[12px] font-extrabold shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4 text-black" /> Create Story
            </button>
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* --- VIEW STORY DIALOG (REACT PORTAL) --- */}
      {/* ==================================================== */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {viewingItem && (
            <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6" style={{ zIndex: 9999999 }}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewingItem(null)} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="relative z-10 w-full max-w-3xl flex flex-col bg-white shadow-2xl rounded-[2.5rem] overflow-hidden max-h-[90vh]"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-gray-100 shrink-0 bg-white">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setViewingItem(null)} className="p-2.5 text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors shadow-sm">
                      <X className="w-5 h-5" />
                    </button>
                    <span className="text-[12px] font-extrabold text-gray-500 uppercase tracking-widest">Story Details</span>
                  </div>
                  <span className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest border shadow-sm ${
                      viewingItem.status === 'Published' ? 'text-green-600 bg-green-50 border-green-200' : 'text-orange-600 bg-orange-50 border-orange-200'
                  }`}>
                    {viewingItem.status}
                  </span>
                </div>
                
                {/* Body */}
                <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar bg-white">
                  <div className="h-64 w-full bg-gray-100 relative flex items-center justify-center border-b border-gray-200">
                    {viewingItem.coverImage ? (
                      <img src={viewingItem.coverImage} alt={viewingItem.title} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-16 h-16 text-gray-300 opacity-60" />
                    )}
                    <div className="absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-2 text-white shadow-sm border border-gray-700/50">
                      <FileImage className="w-4 h-4" /> <span className="text-[12px] font-bold">{viewingItem.mediaCount} Media Files</span>
                    </div>
                  </div>
                  
                  <div className="p-6 md:p-8 space-y-6">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">{viewingItem.title}</h2>
                      <div className="flex flex-wrap items-center gap-3 text-[12px] font-bold text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm w-fit">
                        <span className="text-blue-600 uppercase tracking-widest">{viewingItem.type}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/> {viewingItem.date}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5"/> {viewingItem.location}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[12px] font-extrabold text-gray-500 uppercase tracking-widest mb-3">Description</h4>
                      <p className="text-[14px] font-medium text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
                        {viewingItem.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ==================================================== */}
      {/* --- CREATE / EDIT STORY DIALOG (REACT PORTAL) --- */}
      {/* ==================================================== */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {(isCreateModalOpen || editingItem) && (
            <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6" style={{ zIndex: 9999999 }}>
              {/* Backdrop */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setIsCreateModalOpen(false); setEditingItem(null); }} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
              
              {/* Modal Container */}
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="relative z-10 w-full max-w-4xl flex flex-col bg-white rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh]"
              >
                
                {/* Header (Fixed) */}
                <div className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-gray-100 shrink-0 bg-white">
                  <div>
                    <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">{editingItem ? "Edit Story" : "Create New Story"}</h2>
                    <p className="text-[12px] font-bold text-gray-500 mt-1">{editingItem ? "Update details" : "Publish a new photo or video story."}</p>
                  </div>
                  <button onClick={() => { setIsCreateModalOpen(false); setEditingItem(null); }} className="p-2.5 text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors shadow-sm">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Body / Form (Scrollable) */}
                <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar bg-white">
                  <div className="p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      
                      {/* LEFT COLUMN: Main Details */}
                      <div className="space-y-6">
                        
                        {/* Story Type Selector */}
                        <div className="bg-white p-5 rounded-[1.5rem] border border-gray-200 shadow-sm">
                          <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest block mb-4">Story Type</label>
                          <div className="grid grid-cols-2 gap-3">
                            {["Photo Story", "Video Story", "Event Story", "Campaign Story"].map((type) => (
                              <button
                                key={type}
                                onClick={(e) => { e.preventDefault(); setFormState({...formState, type: type as GalleryType}) }}
                                className={`py-3 px-3 rounded-xl text-[12px] font-extrabold transition-all border ${
                                  formState.type === type 
                                  ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm" 
                                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                                }`}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Text Details */}
                        <div className="bg-white p-5 rounded-[1.5rem] border border-gray-200 shadow-sm space-y-5">
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Story Title</label>
                            <input type="text" value={formState.title} onChange={e => setFormState({...formState, title: e.target.value})} placeholder="e.g., Education Drive" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 px-4 text-[13px] font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Description</label>
                            <textarea rows={5} value={formState.description} onChange={e => setFormState({...formState, description: e.target.value})} placeholder="Write the full story details here..." className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 px-4 text-[13px] font-medium text-gray-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none custom-scrollbar" />
                          </div>
                        </div>

                      </div>

                      {/* RIGHT COLUMN: Media & Meta */}
                      <div className="space-y-6">
                        
                        {/* Media Uploads */}
                        <div className="bg-white p-5 rounded-[1.5rem] border border-gray-200 shadow-sm space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest flex items-center justify-between mb-1">
                                Cover <span className="text-[9px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">Required</span>
                              </label>
                              <div className="w-full h-24 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer flex flex-col items-center justify-center text-center p-2 group">
                                <UploadCloud className="w-5 h-5 text-gray-400 mb-1" />
                                <p className="text-[11px] font-bold text-gray-600">Upload Cover</p>
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest flex items-center justify-between mb-1">
                                Images <span className="text-[9px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">Multiple</span>
                              </label>
                              <div className="w-full h-24 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer flex flex-col items-center justify-center text-center p-2 group">
                                <Plus className="w-5 h-5 text-gray-400 mb-1" />
                                <p className="text-[11px] font-bold text-gray-600">Add Images</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Relations & Meta Information */}
                        <div className="bg-white p-5 rounded-[1.5rem] border border-gray-200 shadow-sm space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Related Program</label>
                            <select className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-[13px] font-bold text-gray-700 outline-none cursor-pointer appearance-none">
                              <option value="">Select Program...</option>
                              <option value="p1">Education Program</option>
                              <option value="p2">Environment Initiative</option>
                            </select>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Location</label>
                              <input type="text" value={formState.location} onChange={e => setFormState({...formState, location: e.target.value})} placeholder="e.g., Pune" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-[13px] font-bold text-gray-900 outline-none" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Story Date</label>
                              <input type="date" value={formState.date} onChange={e => setFormState({...formState, date: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-[13px] font-bold text-gray-900 outline-none cursor-pointer" />
                            </div>
                          </div>

                          <div className="space-y-1.5 pt-2">
                             <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest mb-2 block">Publish Status</label>
                             <div className="flex gap-4">
                               <label className="flex flex-1 items-center gap-2 cursor-pointer p-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
                                 <input type="radio" name="status" checked={formState.status === "Draft"} onChange={() => setFormState({...formState, status: "Draft"})} className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                                 <span className="text-[12px] font-bold text-gray-800">Draft</span>
                               </label>
                               <label className="flex flex-1 items-center gap-2 cursor-pointer p-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
                                 <input type="radio" name="status" checked={formState.status === "Published"} onChange={() => setFormState({...formState, status: "Published"})} className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                                 <span className="text-[12px] font-bold text-gray-800">Published</span>
                               </label>
                             </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions (Fixed at bottom) */}
                <div className="px-6 md:px-8 py-5 border-t border-gray-100 bg-white shrink-0 flex items-center justify-between">
                  <button onClick={() => { setIsCreateModalOpen(false); setEditingItem(null); }} className="flex items-center gap-2 px-4 py-3 rounded-full font-bold text-[13px] text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <div className="flex gap-3">
                    <button onClick={() => { setIsCreateModalOpen(false); setEditingItem(null); }} className="px-8 py-3.5 rounded-full font-bold text-[13px] text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors shadow-sm">
                      Cancel
                    </button>
                    <button onClick={editingItem ? handleEditSave : handleCreateSave} className="px-8 py-3.5 rounded-full font-extrabold text-[13px] text-black bg-white border border-gray-300 hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4 text-black" /> {editingItem ? "Save Changes" : "Save Story"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ==================================================== */}
      {/* --- DELETE CONFIRMATION DIALOG (REACT PORTAL) --- */}
      {/* ==================================================== */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {deletingItem && (
            <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6" style={{ zIndex: 9999999 }}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeletingItem(null)} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="relative z-10 w-full max-w-sm bg-white shadow-2xl flex flex-col items-center text-center rounded-[2rem] overflow-hidden p-8 border border-gray-100"
              >
                <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-5 shadow-sm">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">Delete Story?</h3>
                <p className="text-[13px] font-bold text-gray-500 mb-8 leading-relaxed px-2">
                  Are you sure you want to delete <strong className="text-gray-800">{deletingItem.title}</strong>? This action cannot be undone.
                </p>
                <div className="w-full flex gap-3">
                  <button onClick={() => setDeletingItem(null)} className="flex-1 py-3.5 rounded-full font-bold text-[13px] text-gray-800 bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm">
                    Cancel
                  </button>
                  <button onClick={confirmDelete} className="flex-1 py-3.5 rounded-full font-extrabold text-[13px] text-white bg-red-600 border border-red-700 hover:bg-red-700 shadow-sm transition-all">
                    Yes, Delete
                  </button>
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