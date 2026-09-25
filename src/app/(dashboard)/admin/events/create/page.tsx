"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Image as ImageIcon,
  Settings,
  UserCheck,
  Shield,
  ChevronLeft,
  CheckCircle2,
  Info,
  Building2,
  ClipboardList,
  Target
} from "lucide-react";
import { CLOUDINARY_FOLDERS } from "../../../../../lib/cloudinary-folders";
import MediaUploader from "../../../../../components/cloudinary/MediaUploader";
import type { UploadedMedia } from "../../../../../types/cloudinary";

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
coverImagePublicId: "",
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


  // --- PHASE 5 & 7: Form Submission & Redirect ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
// ========================================
// FRONTEND VALIDATION
// ========================================

if (!formData.title.trim()) {
  alert(`${formData.recordType} title is required.`);
  return;
}

if (!formData.description.trim()) {
  alert(`${formData.recordType} description is required.`);
  return;
}

if (!formData.startDate) {
  alert("Start date and time are required.");
  return;
}

if (!formData.endDate) {
  alert("End date and time are required.");
  return;
}

if (new Date(formData.startDate) >= new Date(formData.endDate)) {
  alert("Start Date must be before End Date.");
  return;
}

// Event-only validation
if (formData.recordType === "Event") {
  if (!formData.category) {
    alert("Event category is required.");
    return;
  }

  if (!formData.venue.trim()) {
    alert("Event venue is required.");
    return;
  }
}

// Campaign-only validation
if (formData.recordType === "Campaign") {
  if (
    formData.goalAmount === "" ||
    Number(formData.goalAmount) <= 0
  ) {
    alert("Campaign goal amount must be greater than zero.");
    return;
  }
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
        
       {/* LEFT COLUMN (Form Sections) */}
<div className="lg:col-span-2">

  {/* ================================
      BASIC INFORMATION
  ================================= */}

  <SectionCard
    title="Basic Information"
    icon={ClipboardList}
    delay={0.2}
  >
    {/* Record Type */}
    <div className="space-y-2">
      <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">
        Type *
      </label>

      <select
        name="recordType"
        value={formData.recordType}
        onChange={handleChange}
        className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all appearance-none"
      >
        <option value="Event">Event</option>
        <option value="Campaign">Campaign</option>
      </select>
    </div>

    {/* Title */}
    <div className="space-y-2">
      <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">
        {formData.recordType} Title *
      </label>

      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder={`Enter ${formData.recordType.toLowerCase()} title`}
        required
        className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all"
      />
    </div>

    {/* Event-only fields */}
    {formData.recordType === "Event" && (
      <>
        {/* Category */}
        <div className="space-y-2">
          <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">
            Category *
          </label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all appearance-none"
          >
            <option value="">Select Category</option>

            {dropdownData.categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Event Type */}
        <div className="space-y-2">
          <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">
            Event Type
          </label>

          <select
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all appearance-none"
          >
            <option value="">Select Event Type</option>

            {dropdownData.eventTypes.map((eventType) => (
              <option key={eventType} value={eventType}>
                {eventType}
              </option>
            ))}
          </select>
        </div>

        {/* Summary */}
        <div className="space-y-2">
          <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">
            Short Summary
          </label>

          <input
            type="text"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            placeholder="Short summary of the event"
            className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all"
          />
        </div>
      </>
    )}

    {/* Description */}
    <div className="space-y-2">
      <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">
        Description *
      </label>

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows={5}
        placeholder={`Describe the ${formData.recordType.toLowerCase()}...`}
        required
        className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all resize-none"
      />
    </div>
  </SectionCard>

  {/* ================================
      COVER IMAGE
  ================================= */}

  <SectionCard title="Cover Image" icon={ImageIcon} delay={0.3}>
  <div className="space-y-4">

    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">
          {formData.recordType} Cover Image
        </label>

        <span className="text-[9px] font-extrabold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
          ONE IMAGE
        </span>
      </div>

      <MediaUploader
        accept="image"
        multiple={false}
        folder={
          formData.recordType === "Event"
            ? CLOUDINARY_FOLDERS.events.covers
            : CLOUDINARY_FOLDERS.campaigns.covers
        }
        buttonText={
          formData.coverImage
            ? `Replace ${formData.recordType} Cover`
            : `Upload ${formData.recordType} Cover`
        }
        onUpload={(media: UploadedMedia) => {
          setFormData((prev) => ({
            ...prev,
            coverImage: media.url,
            coverImagePublicId: media.publicId,
          }));
        }}
      />
    </div>

    {formData.coverImage && (
      <div className="relative overflow-hidden rounded-[1.5rem] border border-gray-200">

        <img
          src={formData.coverImage}
          alt={`${formData.recordType} cover`}
          className="w-full h-56 object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

        <button
          type="button"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              coverImage: "",
              coverImagePublicId: "",
            }))
          }
          className="absolute top-3 right-3 px-4 py-2 rounded-full bg-red-500 text-white text-[11px] font-extrabold shadow-lg hover:bg-red-600 transition-colors"
        >
          Remove
        </button>

        <div className="absolute bottom-4 left-4">
          <span className="text-white text-[11px] font-extrabold uppercase tracking-widest">
            Cover Preview
          </span>
        </div>

      </div>
    )}

  </div>
</SectionCard>

          {/* Schedule */}
         <SectionCard title="Schedule" icon={Calendar} delay={0.4}>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    {/* Start */}
    <div className="space-y-2">
      <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">
        Start Date & Time *
      </label>

      <input
        type="datetime-local"
        name="startDate"
        value={formData.startDate}
        onChange={handleChange}
        required
        className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all text-gray-700"
      />
    </div>

    {/* End */}
    <div className="space-y-2">
      <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">
        End Date & Time *
      </label>

      <input
        type="datetime-local"
        name="endDate"
        value={formData.endDate}
        onChange={handleChange}
        required
        className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all text-gray-700"
      />
    </div>

    {/* Event-only schedule fields */}
    {formData.recordType === "Event" && (
      <>
        <div className="space-y-2">
          <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">
            Registration Deadline
          </label>

          <input
            type="date"
            name="registrationDeadline"
            value={formData.registrationDeadline}
            onChange={handleChange}
            className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all text-gray-700"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">
            Timezone
          </label>

          <select
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
            className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all appearance-none text-gray-700"
          >
            {dropdownData.timezones.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>
      </>
    )}

  </div>
</SectionCard>

          {/* Venue (Only strictly relevant if it's an Event, but kept standard) */}
          {formData.recordType === "Event" && (
  <SectionCard
    title="Venue / Location"
    icon={MapPin}
    delay={0.5}
  >
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
          )}

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
         {formData.recordType === "Campaign" && (
  <SectionCard
    title="Campaign Goal"
    icon={DollarSign}
    delay={0.7}
  >
            <div className="space-y-2 mb-6">
              <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Total Estimated Budget / Goal Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                <input type="number" name="goalAmount" value={formData.goalAmount} onChange={handleChange} placeholder="50000" min="0" className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 pl-8 pr-4 text-lg font-extrabold text-[#16a34a] focus:ring-2 focus:ring-[#16a34a]/20 transition-all" />
              </div>
            </div>
          </SectionCard>
        )}

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