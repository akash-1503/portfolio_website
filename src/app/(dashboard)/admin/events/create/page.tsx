"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Calendar, MapPin, Users, DollarSign, Image as ImageIcon, 
  Settings, UserCheck, Shield, ChevronLeft, UploadCloud, 
  CheckCircle2, Info, Building2, ClipboardList, Target
} from "lucide-react";

// --- DUMMY DATA FOR DROPDOWNS ---
const categories = [
  "Education", "Healthcare", "Environment", "Tree Plantation", "Food Distribution", 
  "Blood Donation", "Women Empowerment", "Disaster Relief", "Fundraising", 
  "Animal Welfare", "Awareness Campaign", "Workshop", "Training Program", "Cultural Program"
];

const volunteerTasks = [
  "Registration Desk", "Food Distribution", "Medical Support", "Photography", 
  "Logistics", "Security", "Stage Management", "Social Media", "Cleaning", "Transportation"
];

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recordType, setRecordType] = useState<"Event" | "Campaign">("Event");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 2000);
  };

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
      <div className="relative z-10 flex flex-col gap-2 mb-8">
        <Link href="/admin/events" className="flex items-center gap-1 text-[13px] font-bold text-[#16a34a] hover:text-[#15803d] transition-colors w-fit">
          <ChevronLeft className="w-4 h-4" /> Back to page
        </Link>
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Create New {recordType}
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-[13px] font-bold text-gray-400">
          Complete the form below to publish a new {recordType.toLowerCase()} to the platform.
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
                  recordType === "Event" 
                  ? "border-[#16a34a] bg-green-50 text-[#16a34a] shadow-sm" 
                  : "border-gray-100 bg-gray-50 text-gray-400 hover:bg-gray-100"
                }`}
              >
                <input type="radio" name="recordType" value="Event" checked={recordType === "Event"} onChange={() => setRecordType("Event")} className="hidden" />
                <Calendar className="w-5 h-5" />
                <span className="font-extrabold text-sm tracking-wide">Event</span>
              </label>
              
              <label 
                className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-2 p-4 rounded-[1.2rem] border-2 cursor-pointer transition-all ${
                  recordType === "Campaign" 
                  ? "border-[#f97316] bg-orange-50 text-[#f97316] shadow-sm" 
                  : "border-gray-100 bg-gray-50 text-gray-400 hover:bg-gray-100"
                }`}
              >
                <input type="radio" name="recordType" value="Campaign" checked={recordType === "Campaign"} onChange={() => setRecordType("Campaign")} className="hidden" />
                <Target className="w-5 h-5" />
                <span className="font-extrabold text-sm tracking-wide">Campaign</span>
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">{recordType} Name *</label>
              <input type="text" required placeholder={`e.g., Annual Tree Plantation ${recordType}`} className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] transition-all hover:bg-gray-50" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">{recordType} Category *</label>
                <select required className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] transition-all cursor-pointer hover:bg-gray-50 appearance-none">
                  <option value="">Select Category</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">{recordType} Type *</label>
                <select required className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] transition-all cursor-pointer hover:bg-gray-50 appearance-none">
                  <option value="public">Public (Open to All)</option>
                  <option value="private">Private (Invite Only)</option>
                  <option value="volunteer">Volunteer Exclusive</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Short Summary *</label>
              <textarea required rows={2} placeholder="A brief 1-2 sentence description..." className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] transition-all hover:bg-gray-50 custom-scrollbar resize-none" />
            </div>
            
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Detailed Description *</label>
              <textarea required rows={5} placeholder={`Full ${recordType.toLowerCase()} details, agenda, and expectations...`} className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] transition-all hover:bg-gray-50 custom-scrollbar resize-none" />
            </div>
          </SectionCard>

          {/* Schedule */}
          <SectionCard title="Schedule" icon={Calendar} delay={0.3}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Start Date & Time</label>
                <input type="datetime-local" className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all hover:bg-gray-50 text-gray-700" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">End Date & Time</label>
                <input type="datetime-local" className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all hover:bg-gray-50 text-gray-700" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Registration Deadline</label>
                <input type="date" className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all hover:bg-gray-50 text-gray-700" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Timezone</label>
                <select className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all appearance-none text-gray-700">
                  <option>Asia/Kolkata (IST)</option>
                  <option>UTC (GMT)</option>
                </select>
              </div>
            </div>
          </SectionCard>

          {/* Venue */}
          <SectionCard title="Venue / Location" icon={MapPin} delay={0.4}>
            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 cursor-pointer">
                <input type="radio" name="locationType" value="offline" defaultChecked className="w-4 h-4 text-[#16a34a] focus:ring-[#16a34a]" /> Physical Venue
              </label>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 cursor-pointer">
                <input type="radio" name="locationType" value="online" className="w-4 h-4 text-[#16a34a] focus:ring-[#16a34a]" /> Online (Virtual)
              </label>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Venue Name</label>
              <input type="text" placeholder="e.g., City Central Park" className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Complete Address</label>
              <input type="text" placeholder="Street address..." className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <input type="text" placeholder="City" className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all" />
              <input type="text" placeholder="State" className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all" />
              <input type="text" placeholder="Pincode" className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all" />
              <input type="text" placeholder="Country" defaultValue="India" className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Google Maps Link</label>
              <input type="url" placeholder="https://maps.google.com/..." className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all text-[#16a34a]" />
            </div>
          </SectionCard>

          {/* Capacity & Volunteers */}
          <SectionCard title="Volunteers & Capacity" icon={Users} delay={0.5}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6 border-b border-gray-100 pb-8">
              {[
                { label: "Max Participants", ph: "100" },
                { label: "Max Volunteers", ph: "20" },
                { label: "Min Volunteers", ph: "5" },
                { label: "Max Guests", ph: "10" }
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">{item.label}</label>
                  <input type="number" placeholder={item.ph} className="w-full bg-white border border-gray-200 rounded-[1rem] py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all text-center" />
                </div>
              ))}
            </div>
            
            <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest block mb-3">Required Volunteer Tasks (Select Multiple)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {volunteerTasks.map((task) => (
                <label key={task} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl bg-gray-50/50 cursor-pointer hover:bg-green-50 hover:border-green-100 transition-colors group">
                  <input type="checkbox" className="w-4 h-4 text-[#16a34a] rounded border-gray-300 focus:ring-[#16a34a]" />
                  <span className="text-[12px] font-bold text-gray-600 group-hover:text-gray-900">{task}</span>
                </label>
              ))}
            </div>
          </SectionCard>

          {/* Budget & Finance */}
          <SectionCard title="Financials & Budget" icon={DollarSign} delay={0.6}>
            <div className="space-y-2 mb-6">
              <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Total Estimated Budget</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                <input type="number" placeholder="50000" className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 pl-8 pr-4 text-lg font-extrabold text-[#16a34a] focus:ring-2 focus:ring-[#16a34a]/20 transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {["Venue Cost", "Food & Beverage", "Travel Cost", "Equipment", "Medical", "Other Expenses"].map((cost) => (
                <div key={cost} className="space-y-1">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">{cost}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">₹</span>
                    <input type="number" placeholder="0" className="w-full bg-gray-50 border border-gray-200 rounded-[1rem] py-2 pl-7 pr-3 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Media Uploads */}
          <SectionCard title="Media & Assets" icon={ImageIcon} delay={0.7}>
            <div className="border-2 border-dashed border-gray-300 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-green-50/50 hover:border-[#16a34a]/50 transition-colors cursor-pointer group">
              <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8 text-[#16a34a]" />
              </div>
              <h4 className="text-[15px] font-extrabold text-gray-900">Upload {recordType} Banner</h4>
              <p className="text-[12px] font-bold text-gray-400 mt-1 mb-4">Drag and drop, or click to browse (1920x1080px recommended)</p>
              <button type="button" className="px-6 py-2.5 bg-white border border-gray-200 rounded-full text-[12px] font-extrabold text-gray-600 shadow-sm group-hover:border-[#16a34a] group-hover:text-[#16a34a] transition-colors">
                Browse Files
              </button>
            </div>
          </SectionCard>

          {/* Additional Details */}
          <SectionCard title="Additional Requirements" icon={Settings} delay={0.8}>
             <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Dress Code</label>
                  <input type="text" placeholder="e.g., Casual, NGO T-shirt..." className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all" />
               </div>
               <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Emergency Contact</label>
                  <input type="text" placeholder="+91 XXXXX XXXXX" className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all" />
               </div>
             </div>
             
             {/* Toggles */}
             <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {["Food Provided", "Parking Available", "Certificates Issued", "Transport Provided"].map((toggle) => (
                  <label key={toggle} className="flex flex-col items-center justify-center gap-2 p-4 border border-gray-100 rounded-2xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                    <input type="checkbox" className="w-5 h-5 text-[#f97316] rounded border-gray-300 focus:ring-[#f97316]" />
                    <span className="text-[11px] font-extrabold text-gray-600 text-center">{toggle}</span>
                  </label>
                ))}
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
                  <span className="text-[11px] font-extrabold bg-gray-100 text-gray-600 px-3 py-1 rounded-full uppercase tracking-widest">Draft</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-[13px] font-bold text-gray-500">Visibility</span>
                  <select className="bg-transparent text-[13px] font-extrabold text-gray-900 focus:outline-none cursor-pointer text-right dir-rtl">
                    <option>Public</option>
                    <option>Private</option>
                  </select>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-[13px] font-bold text-gray-500">Registration</span>
                  <select className="bg-transparent text-[13px] font-extrabold text-gray-900 focus:outline-none cursor-pointer text-right dir-rtl">
                    <option>Open</option>
                    <option>Closed</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button type="button" className="w-full py-4 rounded-full font-extrabold text-[13px] text-[#16a34a] bg-green-50 hover:bg-green-100 transition-colors">
                  Save as Draft
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full font-extrabold text-[13px] text-white bg-[#f97316] hover:bg-[#ea580c] shadow-[0_8px_20px_rgba(249,115,22,0.25)] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">Publishing...</span>
                  ) : (
                    <><CheckCircle2 className="w-4 h-4" /> Publish {recordType}</>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Organizers Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
            >
              <h3 className="text-lg font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#f97316]" /> Organizers
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Coordinator</label>
                  <input type="text" defaultValue="Admin Kumar" className="w-full bg-gray-50 border border-gray-200 rounded-[1rem] py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Contact Email</label>
                  <input type="email" placeholder="events@ngo.org" className="w-full bg-gray-50 border border-gray-200 rounded-[1rem] py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Linked Program (Sec 7)</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-[1rem] py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 transition-all appearance-none cursor-pointer">
                    <option>None</option>
                    <option>Education Initiative</option>
                    <option>Health Mission</option>
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