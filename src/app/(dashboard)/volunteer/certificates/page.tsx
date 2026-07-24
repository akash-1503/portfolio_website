"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { 
  Award, Search, Filter, Download, CheckCircle2, 
  Calendar, FileText, X, ShieldCheck, Image as ImageIcon, 
  AlertCircle, ChevronDown, Target, ArrowLeft
} from "lucide-react";

// --- TYPESCRIPT INTERFACES ---
interface Certificate {
  id: string;
  title: string;
  certificateNumber: string;
  type: "PROGRAM" | "CAMPAIGN" | "EVENT";
  program?: string;
  campaign?: string;
  event?: string;
  issuedBy: string;
  issueDate: string;
  status: "VERIFIED" | "PENDING";
  certificateUrl: string | null;
}

// --- DUMMY DATA (Will show alongside API data) ---
const dummyCertificates: Certificate[] = [
  {
    id: "CERT-DUMMY-001",
    title: "Volunteer Excellence Award",
    certificateNumber: "NGO-2026-0001",
    type: "PROGRAM",
    program: "Education Initiative 2026",
    issuedBy: "Nishkam Samarpan Foundation",
    issueDate: "2026-06-15",
    status: "VERIFIED",
    certificateUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: "CERT-DUMMY-002",
    title: "Community Impact Contributor",
    certificateNumber: "NGO-2026-0045",
    type: "EVENT",
    event: "Tree Plantation Drive",
    issuedBy: "Green Earth Society",
    issueDate: "2026-07-12",
    status: "PENDING",
    certificateUrl: null
  },
  {
    id: "CERT-DUMMY-003",
    title: "Top Fundraiser Certificate",
    certificateNumber: "NGO-2026-0089",
    type: "CAMPAIGN",
    campaign: "Flood Relief Mission",
    issuedBy: "Nishkam Samarpan Foundation",
    issueDate: "2026-05-20",
    status: "VERIFIED",
    certificateUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  }
];

export default function VolunteerCertificatesPage() {
  // --- STATE ---
  const [certificates, setCertificates] = useState<Certificate[]>(dummyCertificates);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "PROGRAM" | "CAMPAIGN" | "EVENT">("ALL");
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/volunteer/certificates");
        const json = await res.json();
        
        if (json.success) {
          // Merge Dummy Data with Actual Backend Data
          setCertificates([...dummyCertificates, ...(json.data || [])]);
        } else {
          setError(json.message || "Unable to load certificates.");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching your certificates.");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  // --- FILTER LOGIC ---
  const filteredCertificates = certificates.filter((cert) => {
    // 1. Filter by Search Query
    const matchesSearch = 
      cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.program?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.event?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 2. Filter by Type
    const matchesType = filterType === "ALL" || cert.type === filterType;

    return matchesSearch && matchesType;
  });

  // --- HELPERS ---
  const getTypeColor = (type: string) => {
    switch (type) {
      case "PROGRAM": return "bg-blue-100 text-blue-700 border-blue-200";
      case "CAMPAIGN": return "bg-orange-100 text-orange-700 border-orange-200";
      case "EVENT": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", { 
      day: "numeric", month: "short", year: "numeric" 
    });
  };

  // --- ANIMATION VARIANTS ---
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="relative flex flex-col gap-8 min-h-screen pb-10">
      
      {/* --- BACKGROUND ANIMATIONS (Craft & Dotted Lines) --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-10 w-[300px] h-[300px] opacity-60 mix-blend-multiply">
          <svg className="absolute w-full h-full" viewBox="0 0 200 200" fill="none">
            <path d="M 0 200 C 50 100, 150 100, 200 0" stroke="#f97316" strokeWidth="2" strokeDasharray="6 6" strokeLinecap="round" opacity="0.3" />
          </svg>
          <motion.div animate={{ y: [-5, 5, -5], x: [-5, 5, -5], rotate: [-2, 2, -2] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute top-12 right-12">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-45 drop-shadow-md">
              <path d="M21.5 2.5L2 10.5L9.5 13.5L21.5 2.5Z" fill="#fb923c" opacity="0.8" />
              <path d="M21.5 2.5L14.5 22L9.5 13.5L21.5 2.5Z" fill="#ea580c" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* --- PAGE HEADER --- */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="relative z-10 flex flex-col mt-4">
        <motion.h1 variants={itemVariants} className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
          Certificates
        </motion.h1>
        <motion.p variants={itemVariants} className="text-[13px] font-bold text-gray-400 mt-2 max-w-2xl">
          Your earned certificates from NGO activities. Download and share your verifiable accomplishments.
        </motion.p>
      </motion.div>

      {/* --- SEARCH & FILTER BAR --- */}
      <motion.div variants={itemVariants} initial="hidden" animate="show" className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search certificates..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white/80 backdrop-blur-md border border-gray-200 rounded-full text-[13px] font-bold focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 shadow-sm transition-all"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative w-full md:w-auto flex items-center gap-3">
          <span className="text-[12px] font-extrabold text-gray-500 uppercase tracking-widest hidden md:block">Filter:</span>
          <div className="relative w-full md:w-48 group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none" />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full pl-11 pr-10 py-3.5 bg-white/80 backdrop-blur-md border border-gray-200 rounded-full text-[13px] font-bold text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 shadow-sm transition-all cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="PROGRAM">Programs</option>
              <option value="CAMPAIGN">Campaigns</option>
              <option value="EVENT">Events</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </motion.div>

      {/* --- GRID CONTENT --- */}
      <motion.div 
        variants={containerVariants} initial="hidden" animate="show" 
        className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {/* --- Loading Skeletons --- */}
        {loading && (
          Array.from({ length: 3 }).map((_, i) => (
            <motion.div key={`skeleton-${i}`} variants={itemVariants} className="bg-white/80 rounded-[2.5rem] h-96 animate-pulse border border-gray-100 overflow-hidden shadow-sm flex flex-col">
               <div className="h-44 bg-gray-200/50 w-full rounded-b-[2rem]"></div>
               <div className="p-6 space-y-4 flex-1">
                  <div className="h-5 bg-gray-200/50 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200/50 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200/50 rounded w-full mt-6"></div>
               </div>
            </motion.div>
          ))
        )}

        {/* --- Error State --- */}
        {(!loading && error) && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-red-400 bg-white/40 rounded-[2.5rem] border border-red-100">
            <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-[13px] font-bold">{error}</p>
          </div>
        )}

        {/* --- Loaded Data --- */}
        {(!loading && !error) && (
          <AnimatePresence>
            {filteredCertificates.map((cert) => (
              <motion.div 
                key={cert.id}
                layout
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all cursor-pointer"
                onClick={() => setSelectedCertificate(cert)}
              >
                {/* Certificate Preview Image */}
                <div className="h-48 w-full bg-gradient-to-br from-blue-50 to-indigo-50 relative flex items-center justify-center overflow-hidden border-b border-gray-100">
                  {cert.certificateUrl ? (
                    <div className="w-full h-full bg-blue-100/50 flex items-center justify-center">
                      <FileText className="w-16 h-16 text-blue-300 opacity-80" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-blue-300">
                      <Award className="w-16 h-16 mb-2 opacity-50" />
                      <span className="text-[10px] font-extrabold uppercase tracking-widest opacity-50">Preview Unavailable</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest shadow-sm border ${getTypeColor(cert.type)}`}>
                      {cert.type}
                    </span>
                  </div>
                  
                  {/* Verification Badge overlay */}
                  {cert.status === "VERIFIED" && (
                    <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#16a34a]" />
                      <span className="text-[10px] font-extrabold text-[#16a34a] uppercase tracking-widest">Verified</span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col gap-3 flex-1">
                  <h3 className="text-lg font-extrabold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                    {cert.title}
                  </h3>
                  
                  <div className="flex flex-col gap-2 mt-1">
                    {cert.program && (
                      <p className="text-[12px] font-bold text-gray-500 flex items-center gap-2 truncate">
                        <Target className="w-3.5 h-3.5 text-blue-400 shrink-0"/> {cert.program}
                      </p>
                    )}
                    {cert.event && (
                      <p className="text-[12px] font-bold text-gray-500 flex items-center gap-2 truncate">
                        <Award className="w-3.5 h-3.5 text-green-400 shrink-0"/> {cert.event}
                      </p>
                    )}
                    <p className="text-[12px] font-bold text-gray-500 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#f97316] shrink-0"/> Issued: {formatDate(cert.issueDate)}
                    </p>
                    <p className="text-[12px] font-bold text-gray-500 flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#16a34a] shrink-0"/> By: {cert.issuedBy}
                    </p>
                  </div>
                </div>

                {/* Download Button (Stop propagation to prevent opening drawer if they click directly on download) */}
                <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex">
                  <a 
                    href={cert.certificateUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-full py-3 bg-white border border-gray-200 rounded-full text-[12px] font-extrabold text-blue-600 hover:text-white hover:border-blue-600 hover:bg-blue-600 shadow-sm flex items-center justify-center gap-2 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" /> Download PDF
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* --- Empty State --- */}
        {(!loading && !error && filteredCertificates.length === 0) && (
          <div className="col-span-full py-24 flex flex-col items-center justify-center bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mb-5 shadow-sm">
              <span className="text-4xl">🏆</span>
            </div>
            <h3 className="text-lg font-extrabold text-gray-900 mb-2">No certificates found.</h3>
            <p className="text-[13px] font-bold text-gray-500 text-center max-w-sm">
              Participate in NGO events, programs, and campaigns to earn verifiable certificates.
            </p>
          </div>
        )}
      </motion.div>

      {/* ==================================================== */}
      {/* --- CENTERED DIALOG BOX (VIEW CERTIFICATE DETAILS) --- */}
      {/* ==================================================== */}
      <AnimatePresence>
        {selectedCertificate && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedCertificate(null)} 
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" 
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }} 
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
              className="relative w-full max-w-[650px] max-h-[90vh] bg-white shadow-2xl flex flex-col rounded-[2.5rem] overflow-hidden z-[100000]"
            >
              
              {/* Dialog Header with Prominent BACK Button */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/80 shrink-0 backdrop-blur-md z-10">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedCertificate(null)} 
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-[12px] font-extrabold text-gray-600 hover:text-gray-900 hover:bg-gray-50 shadow-sm transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <h2 className="text-lg font-extrabold text-gray-900 tracking-tight hidden sm:block">Certificate Details</h2>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8 bg-[#fafafa]">
                
                {/* Certificate High-Res Preview */}
                <div className="w-full aspect-[4/3] bg-white border border-gray-200 rounded-[1.5rem] shadow-sm flex items-center justify-center overflow-hidden p-2">
                   <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center border border-gray-100/50 relative">
                     {selectedCertificate.certificateUrl ? (
                       <div className="flex flex-col items-center justify-center text-blue-300">
                         <FileText className="w-16 h-16 mb-3 opacity-80" />
                         <span className="text-[11px] font-extrabold uppercase tracking-widest text-gray-500">PDF Document Ready</span>
                       </div>
                     ) : (
                       <div className="flex flex-col items-center justify-center text-gray-300">
                         <FileText className="w-16 h-16 mb-3 opacity-50" />
                         <span className="text-[11px] font-extrabold uppercase tracking-widest opacity-50">Preview Unavailable</span>
                       </div>
                     )}
                   </div>
                </div>

                {/* Details Card */}
                <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col divide-y divide-gray-50">
                  <div className="p-5 flex flex-col gap-1">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Certificate Name</span>
                    <span className="text-[15px] font-extrabold text-gray-900">{selectedCertificate.title}</span>
                  </div>

                  {selectedCertificate.program && (
                    <div className="p-5 flex flex-col gap-1">
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Program</span>
                      <span className="text-[13px] font-bold text-gray-700">{selectedCertificate.program}</span>
                    </div>
                  )}

                  {selectedCertificate.campaign && (
                    <div className="p-5 flex flex-col gap-1">
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Campaign</span>
                      <span className="text-[13px] font-bold text-gray-700">{selectedCertificate.campaign}</span>
                    </div>
                  )}

                  {selectedCertificate.event && (
                    <div className="p-5 flex flex-col gap-1">
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Event</span>
                      <span className="text-[13px] font-bold text-gray-700">{selectedCertificate.event}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 divide-x divide-gray-50">
                    <div className="p-5 flex flex-col gap-1">
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Issue Date</span>
                      <span className="text-[13px] font-bold text-gray-700">{formatDate(selectedCertificate.issueDate)}</span>
                    </div>
                    <div className="p-5 flex flex-col gap-1">
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Certificate No.</span>
                      <span className="text-[12px] font-bold text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded w-fit mt-1">{selectedCertificate.certificateNumber}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 divide-x divide-gray-50">
                    <div className="p-5 flex flex-col gap-1">
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Issued By</span>
                      <span className="text-[13px] font-bold text-gray-700">{selectedCertificate.issuedBy}</span>
                    </div>
                    <div className="p-5 flex flex-col gap-1">
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Status</span>
                      <div className="mt-1">
                        {selectedCertificate.status === "VERIFIED" ? (
                           <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-[#16a34a] rounded-md text-[10px] font-extrabold uppercase tracking-widest w-fit border border-green-100">
                             <ShieldCheck className="w-3.5 h-3.5" /> Verified
                           </span>
                        ) : (
                           <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 rounded-md text-[10px] font-extrabold uppercase tracking-widest w-fit border border-amber-100">
                             <AlertCircle className="w-3.5 h-3.5" /> Pending
                           </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Drawer Footer Action */}
              <div className="p-6 border-t border-gray-100 bg-white shrink-0 flex flex-col gap-3 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                <a 
                  href={selectedCertificate.certificateUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-full font-extrabold text-[14px] text-white bg-blue-600 hover:bg-blue-700 shadow-[0_8px_20px_rgba(37,99,235,0.25)] transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download Certificate
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}