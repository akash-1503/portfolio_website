"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Calendar, MapPin, Users, DollarSign, Image as ImageIcon, 
  Settings, UserCheck, Shield, ChevronLeft, UploadCloud, 
  CheckCircle2, Info, Building2, ClipboardList, Target
} from "lucide-react";

// Reusable Section Card Component
const SectionCard = ({ title, icon: Icon, children, delay }: { title: string, icon: any, children: React.ReactNode, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8 relative overflow-hidden group"
  >
    {/* Subtle Section Accent */}
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#16a34a]/20 to-transparent"></div>
    
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-[1rem] bg-green-50 flex items-center justify-center text-[#16a34a]">
        <Icon className="w-5 h-5" />
      </div>
      <h2 className="text-xl font-extrabold text-gray-900">{title}</h2>
    </div>
    <div className="flex flex-col gap-6">
      {children}
    </div>
  </motion.div>
);

export default function CreateEventPage() {
  const router = useRouter();
  
  // --- PHASE 6: Loading States ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // --- PHASE 2: Dropdown Data State ---
  const [dropdownData, setDropdownData] = useState({
    programs: [] as any[],
    categories: [] as string[],
    eventTypes: [] as string[],
    eventStatuses: [] as string[],
    campaignStatuses: [] as string[],
    timezones: [] as string[],
  });

  // --- PHASE 1: Unified Form State ---
  const [formData, setFormData] = useState({
    recordType: "Event",
    title: "",
    category: "",
    eventType: "",
    summary: "",
    description: "",
    venue: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    postalCode: "",
    googleMapUrl: "",
    startDate: "",
    endDate: "",
    registrationDeadline: "",
    timezone: "Asia/Kolkata",
    programId: "",
    coverImage: "",
    status: "DRAFT",
    maxParticipants: "",
    maxVolunteers: "",
    minVolunteers: "",
    maxGuests: "",
    goalAmount: "",
    visibility: "Public",
    registrationStatus: "Open",
  });

  // Fetch initial dropdown data from GET API
  useEffect(() => {
    async function fetchInitialData() {
      try {
        const res = await fetch("/api/admin/events?action=CREATE_DATA");
        const json = await res.json();
        if (json.success) {
          setDropdownData(json.data);
          
          // Set default selections once data is loaded
          setFormData(prev => ({
            ...prev,
            category: json.data.categories[0] || "",
            eventType: json.data.eventTypes[0] || "",
            status: json.data.eventStatuses[0] || "DRAFT",
            timezone: json.data.timezones[0] || "Asia/Kolkata",
            programId: json.data.programs.length > 0 ? json.data.programs[0].id : "",
          }));
        }
      } catch (error) {
        console.error("Failed to load initial data", error);
      } finally {
        setIsLoadingData(false);
      }
    }
    fetchInitialData();
  }, []);

  // --- PHASE 3: Handle Input Changes ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Auto-adjust status dropdown defaults when recordType changes
    if (name === "recordType") {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        status: value === "Event" ? dropdownData.eventStatuses[0] : dropdownData.campaignStatuses[0]
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // --- PHASE 4: Simulated Image Upload ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // TODO: In production, upload to Cloudinary here via POST /api/upload
    // For now, we simulate receiving a secure Cloudinary URL
    const mockCloudinaryUrl = URL.createObjectURL(file); // Temporary visual preview
    setFormData(prev => ({ ...prev, coverImage: mockCloudinaryUrl }));
    alert("Image uploaded successfully! (Mocked)");
  };

  // --- PHASE 5 & 7: Form Submission & Redirect ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic Frontend Validation
    if (!formData.title || !formData.startDate || !formData.endDate) {
      alert("Please fill in all required fields (Title, Start Date, End Date).");
      return;
    }
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      alert("Start Date must be before End Date.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (data.success) {
        alert(`${formData.recordType} Published Successfully!`);
        router.push("/admin/events"); // Redirect back to grid
      } else {
        alert(data.message || "Failed to publish record.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred while publishing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#fafafa]">
        <div className="w-16 h-16 border-4 border-[#16a34a] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-bold tracking-widest uppercase">Preparing Form...</p>
      </div>
    );
  }

  return (
    <div className="relative pb-20">
      
      {/* --- PAGE-LEVEL MOTIF (Top Right Corner Accent) --- */}
      <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none overflow-hidden z-0 opacity-40 mix-blend-multiply">
        <svg className="absolute w-full h-full" viewBox="0 0 200 200" fill="none">
          <path d="M 0 200 C 50 100, 150 100, 200 0" stroke="#f97316" strokeWidth="2" strokeDasharray="6 6" strokeLinecap="round" />
        </svg>
        <motion.div animate={{ y: [-5, 5, -5], rotate: [-2, 2, -2] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-10 right-10">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-45">
            <path d="M21.5 2.5L2 10.5L9.5 13.5L21.5 2.5Z" fill="#fb923c" opacity="0.8" />
            <path d="M21.5 2.5L14.5 22L9.5 13.5L21.5 2.5Z" fill="#f97316" />
          </svg>
        </motion.div>
      </div>

      {/* --- HEADER --- */}
      <div className="relative z-10 flex flex-col gap-2 mb-8 mt-4">
        <Link href="/admin/events" className="flex items-center gap-1 text-[13px] font-bold text-[#16a34a] hover:text-[#15803d] transition-colors w-fit">
          <ChevronLeft className="w-4 h-4" /> Back to page
        </Link>
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Create New {formData.recordType}
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-[13px] font-bold text-gray-400">
          Complete the form below to publish a new {formData.recordType.toLowerCase()} to the platform.
        </motion.p>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN (Form Sections) --- */}
        <div className="lg:col-span-2">
          
          {/* Basic Information */}
          <SectionCard title="Basic Information" icon={Info} delay={0.2}>
            
            {/* EVENT VS CAMPAIGN TOGGLE */}
            <div className="flex gap-4 mb-2">
              <label 
                className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-2 p-4 rounded-[1.2rem] border-2 cursor-pointer transition-all ${
                  formData.recordType === "Event" 
                  ? "border-[#16a34a] bg-green-50 text-[#16a34a] shadow-sm" 
                  : "border-gray-100 bg-gray-50 text-gray-400 hover:bg-gray-100"
                }`}
              >
                <input type="radio" name="recordType" value="Event" checked={formData.recordType === "Event"} onChange={handleChange} className="hidden" />
                <Calendar className="w-5 h-5" />
                <span className="font-extrabold text-sm tracking-wide">Event</span>
              </label>
              
              <label 
                className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-2 p-4 rounded-[1.2rem] border-2 cursor-pointer transition-all ${
                  formData.recordType === "Campaign" 
                  ? "border-[#f97316] bg-orange-50 text-[#f97316] shadow-sm" 
                  : "border-gray-100 bg-gray-50 text-gray-400 hover:bg-gray-100"
                }`}
              >
                <input type="radio" name="recordType" value="Campaign" checked={formData.recordType === "Campaign"} onChange={handleChange} className="hidden" />
                <Target className="w-5 h-5" />
                <span className="font-extrabold text-sm tracking-wide">Campaign</span>
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">{formData.recordType} Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder={`e.g., Annual Tree Plantation ${formData.recordType}`} className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] transition-all hover:bg-gray-50" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">{formData.recordType} Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} required className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] transition-all cursor-pointer hover:bg-gray-50 appearance-none">
                  {dropdownData.categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">{formData.recordType} Type *</label>
                <select name="eventType" value={formData.eventType} onChange={handleChange} required className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] transition-all cursor-pointer hover:bg-gray-50 appearance-none">
                  {dropdownData.eventTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Short Summary</label>
              <textarea name="summary" value={formData.summary} onChange={handleChange} rows={2} placeholder="A brief 1-2 sentence description..." className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] transition-all hover:bg-gray-50 custom-scrollbar resize-none" />
            </div>
            
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Detailed Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows={5} placeholder={`Full ${formData.recordType.toLowerCase()} details, agenda, and expectations...`} className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] transition-all hover:bg-gray-50 custom-scrollbar resize-none" />
            </div>
          </SectionCard>

          {/* Schedule */}
          <SectionCard title="Schedule" icon={Calendar} delay={0.3}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Start Date & Time *</label>
                <input type="datetime-local" name="startDate" value={formData.startDate} onChange={handleChange} required className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all hover:bg-gray-50 text-gray-700" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">End Date & Time *</label>
                <input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleChange} required className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all hover:bg-gray-50 text-gray-700" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Registration Deadline</label>
                <input type="date" name="registrationDeadline" value={formData.registrationDeadline} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all hover:bg-gray-50 text-gray-700" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Timezone</label>
                <select name="timezone" value={formData.timezone} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all appearance-none text-gray-700 cursor-pointer">
                  {dropdownData.timezones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                </select>
              </div>
            </div>
          </SectionCard>

          {/* Venue (Only strictly relevant if it's an Event, but kept standard) */}
          <SectionCard title="Venue / Location" icon={MapPin} delay={0.4}>
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Venue Name</label>
              <input type="text" name="venue" value={formData.venue} onChange={handleChange} placeholder="e.g., City Central Park" className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Complete Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Street address..." className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all" />
              <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all" />
              <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Pincode" className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all" />
              <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Google Maps Link</label>
              <input type="url" name="googleMapUrl" value={formData.googleMapUrl} onChange={handleChange} placeholder="https://maps.google.com/..." className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all text-[#16a34a]" />
            </div>
          </SectionCard>

          {/* Capacity & Volunteers */}
          <SectionCard title="Volunteers & Capacity" icon={Users} delay={0.5}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">Max Participants</label>
                <input type="number" name="maxParticipants" value={formData.maxParticipants} onChange={handleChange} min="0" placeholder="100" className="w-full bg-white border border-gray-200 rounded-[1rem] py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all text-center" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">Max Volunteers</label>
                <input type="number" name="maxVolunteers" value={formData.maxVolunteers} onChange={handleChange} min="0" placeholder="20" className="w-full bg-white border border-gray-200 rounded-[1rem] py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all text-center" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">Min Volunteers</label>
                <input type="number" name="minVolunteers" value={formData.minVolunteers} onChange={handleChange} min="0" placeholder="5" className="w-full bg-white border border-gray-200 rounded-[1rem] py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all text-center" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">Max Guests</label>
                <input type="number" name="maxGuests" value={formData.maxGuests} onChange={handleChange} min="0" placeholder="10" className="w-full bg-white border border-gray-200 rounded-[1rem] py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all text-center" />
              </div>
            </div>
          </SectionCard>

          {/* Budget & Finance (Using Goal Amount) */}
          <SectionCard title="Financials & Budget" icon={DollarSign} delay={0.6}>
            <div className="space-y-2 mb-6">
              <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Total Estimated Budget / Goal Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                <input type="number" name="goalAmount" value={formData.goalAmount} onChange={handleChange} placeholder="50000" min="0" className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 pl-8 pr-4 text-lg font-extrabold text-[#16a34a] focus:ring-2 focus:ring-[#16a34a]/20 transition-all" />
              </div>
            </div>
          </SectionCard>

          {/* Media Uploads */}
          <SectionCard title="Media & Assets" icon={ImageIcon} delay={0.7}>
            <div className={`border-2 border-dashed rounded-[2rem] p-10 flex flex-col items-center justify-center text-center transition-colors relative group overflow-hidden ${formData.coverImage ? 'border-[#16a34a] bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-green-50/50 hover:border-[#16a34a]/50'}`}>
              
              {formData.coverImage && (
                <div className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
                  <img src={formData.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="relative z-10 w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className={`w-8 h-8 ${formData.coverImage ? 'text-[#16a34a]' : 'text-gray-400'}`} />
              </div>
              <h4 className="relative z-10 text-[15px] font-extrabold text-gray-900">
                {formData.coverImage ? "Banner Uploaded" : `Upload ${formData.recordType} Banner`}
              </h4>
              <p className="relative z-10 text-[12px] font-bold text-gray-500 mt-1 mb-4">
                {formData.coverImage ? "Click to replace image" : "Drag and drop, or click to browse (1920x1080px recommended)"}
              </p>
              
              <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
              
              <button type="button" className="relative z-10 px-6 py-2.5 bg-white border border-gray-200 rounded-full text-[12px] font-extrabold text-gray-600 shadow-sm transition-colors pointer-events-none">
                Browse Files
              </button>
            </div>
          </SectionCard>

        </div>

        {/* --- RIGHT COLUMN (Sticky Actions & Status) --- */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 flex flex-col gap-6">
            
            {/* Publish Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
            >
              <h3 className="text-lg font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#16a34a]" /> Publish Status
              </h3>
              
              <div className="flex flex-col gap-4 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-[13px] font-bold text-gray-500">Status</span>
                  <select name="status" value={formData.status} onChange={handleChange} className="bg-transparent text-[11px] font-extrabold text-gray-900 focus:outline-none cursor-pointer text-right dir-rtl uppercase tracking-widest">
                    {(formData.recordType === "Event" ? dropdownData.eventStatuses : dropdownData.campaignStatuses).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-[13px] font-bold text-gray-500">Visibility</span>
                  <select name="visibility" value={formData.visibility} onChange={handleChange} className="bg-transparent text-[13px] font-extrabold text-gray-900 focus:outline-none cursor-pointer text-right dir-rtl">
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                  </select>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-[13px] font-bold text-gray-500">Registration</span>
                  <select name="registrationStatus" value={formData.registrationStatus} onChange={handleChange} className="bg-transparent text-[13px] font-extrabold text-gray-900 focus:outline-none cursor-pointer text-right dir-rtl">
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-full font-extrabold text-[13px] text-white bg-[#f97316] hover:bg-[#ea580c] shadow-[0_8px_20px_rgba(249,115,22,0.25)] transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">Publishing...</span>
                  ) : (
                    <><CheckCircle2 className="w-4 h-4" /> Publish {formData.recordType}</>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Organizers / Programs Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
            >
              <h3 className="text-lg font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#f97316]" /> Link to Program
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Select Parent Program (Optional)</label>
                  <select name="programId" value={formData.programId} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-[1rem] py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all appearance-none cursor-pointer text-gray-800">
                    <option value="">None / Standalone</option>
                    {dropdownData.programs.map((prog: any) => (
                      <option key={prog.id} value={prog.id}>{prog.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </form>
    </div>
  );
}