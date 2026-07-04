"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Filter, Plus, Download, Eye, Receipt, Edit3, Trash2, 
  X, Mail, Printer, CreditCard, Banknote, Smartphone, CheckCircle2, 
  ChevronDown
} from "lucide-react";

// --- DUMMY DATA ---
const initialDonations = [
  { id: "RCP-1024", donorName: "Akash Dandale", email: "akash@example.com", phone: "+91 98765 43210", campaign: "Education Initiative", amount: "₹50,000", method: "UPI", status: "Successful", date: "24 Oct 2026", txnId: "TXN-9876543210A" },
  { id: "RCP-1025", donorName: "Priya Sharma", email: "priya@example.com", phone: "+91 98765 43211", campaign: "Health Camp", amount: "₹15,000", method: "Credit Card", status: "Successful", date: "23 Oct 2026", txnId: "TXN-9876543211B" },
  { id: "RCP-1026", donorName: "Rahul Verma", email: "rahul.v@example.com", phone: "+91 98765 43212", campaign: "General Fund", amount: "₹5,000", method: "Bank Transfer", status: "Pending", date: "22 Oct 2026", txnId: "TXN-9876543212C" },
  { id: "RCP-1027", donorName: "Sneha Patel", email: "sneha.p@example.com", phone: "+91 98765 43213", campaign: "Tree Plantation", amount: "₹2,500", method: "UPI", status: "Successful", date: "20 Oct 2026", txnId: "TXN-9876543213D" },
  { id: "RCP-1028", donorName: "Amit Kumar", email: "amit.k@example.com", phone: "+91 98765 43214", campaign: "Disaster Relief", amount: "₹1,00,000", method: "Cheque", status: "Failed", date: "18 Oct 2026", txnId: "TXN-9876543214E" },
];

// Helper components for Badges
const StatusBadge = ({ status }: { status: string }) => {
  if (status === "Successful") return <span className="bg-green-50 text-[#16a34a] px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase shadow-sm">Successful</span>;
  if (status === "Pending") return <span className="bg-orange-50 text-[#f97316] px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase shadow-sm">Pending</span>;
  return <span className="bg-red-50 text-red-500 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase shadow-sm">Failed</span>;
};

const MethodIcon = ({ method }: { method: string }) => {
  if (method === "UPI") return <Smartphone className="w-4 h-4 text-purple-500" />;
  if (method === "Credit Card") return <CreditCard className="w-4 h-4 text-blue-500" />;
  return <Banknote className="w-4 h-4 text-[#16a34a]" />;
};

export default function DonationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // States for Drawer (View Mode)
  const [selectedDonation, setSelectedDonation] = useState<typeof initialDonations[0] | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // State for Add Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const openDrawer = (donation: typeof initialDonations[0]) => {
    setSelectedDonation(donation);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedDonation(null), 300);
  };

  const filteredDonations = initialDonations.filter(d => 
    d.donorName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.campaign.toLowerCase().includes(searchQuery.toLowerCase())
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
          <motion.div animate={{ y: [-5, 5, -5], rotate: [-2, 2, -2] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-10 right-10">
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
          <motion.div animate={{ y: [-8, 8, -8], x: [-2, 2, -2] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-5 left-5">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform -rotate-[120deg]">
              <path d="M22 2L15 22L11 13L2 9L22 2Z" fill="#22c55e" stroke="#16a34a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </div>
      </div>

      {/* --- PAGE HEADER --- */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Donation Management
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-[13px] font-bold text-gray-400 mt-1">
            Track, verify, and manage all organizational financial contributions.
          </motion.p>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="flex gap-3">
          
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3.5 bg-[#16A34A] rounded-full font-bold text-[13px] text-white shadow-[0_8px_20px_rgba(22,163,74,0.25)] hover:bg-[#15803d] hover:shadow-[0_8px_20px_rgba(22,163,74,0.4)] transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" /> Add Offline Donation
          </button>
        </motion.div>
      </div>

      {/* --- DONATIONS TABLE --- */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="relative z-10 bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar min-h-[400px]">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="py-5 px-6 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Receipt</th>
                <th className="py-5 px-6 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Donor</th>
                <th className="py-5 px-6 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Campaign</th>
                <th className="py-5 px-6 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="py-5 px-6 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Method</th>
                <th className="py-5 px-6 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="py-5 px-6 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Date</th>
                <th className="py-5 px-6 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence>
                {filteredDonations.map((d) => (
                  <motion.tr key={d.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, backgroundColor: "#fee2e2" }} className="hover:bg-white/60 transition-colors group">
                    <td className="py-4 px-6 text-[13px] font-bold text-gray-500">{d.id}</td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-gray-900 text-[14px] group-hover:text-[#16a34a] transition-colors cursor-pointer">{d.donorName}</span>
                        <span className="font-bold text-gray-400 text-[11px]">{d.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[13px] font-bold text-gray-600">{d.campaign}</td>
                    <td className="py-4 px-6 text-[14px] font-extrabold text-gray-900">{d.amount}</td>
                    <td className="py-4 px-6">
                      <span className="flex items-center gap-1.5 text-[12px] font-bold text-gray-600">
                        <MethodIcon method={d.method} /> {d.method}
                      </span>
                    </td>
                    <td className="py-4 px-6"><StatusBadge status={d.status} /></td>
                    <td className="py-4 px-6 text-[12px] font-bold text-gray-500">{d.date}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openDrawer(d)} className="p-2 text-gray-400 hover:text-[#16a34a] hover:bg-green-50 rounded-full transition-all" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all" title="Download Receipt">
                          <Receipt className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-[#f97316] hover:bg-orange-50 rounded-full transition-all" title="Edit">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>


      {/* ==================================================== */}
      {/* --- ADD OFFLINE DONATION MODAL (POPUP) ---           */}
      {/* ==================================================== */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed top-[73px] inset-x-0 bottom-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            
            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-full bg-white rounded-[2rem] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col z-[101] overflow-y-auto custom-scrollbar"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Add Offline Donation</h2>
                  <p className="text-[13px] font-bold text-gray-400 mt-1">Record a manual donation received outside the platform.</p>
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(false)} 
                  className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Donor Name *</label>
                  <input type="text" placeholder="e.g., John Doe" className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 focus:bg-white transition-all outline-none" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 focus:bg-white transition-all outline-none" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Campaign *</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 focus:bg-white transition-all outline-none appearance-none cursor-pointer">
                    <option value="">Select a Campaign</option>
                    <option value="general">General Fund</option>
                    <option value="education">Education Initiative</option>
                    <option value="health">Health Camp</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Donation Amount *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                    <input type="number" placeholder="0" className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3.5 pl-9 pr-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 focus:bg-white transition-all outline-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Payment Method *</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 focus:bg-white transition-all outline-none appearance-none cursor-pointer">
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Bank Transfer">Bank Transfer / NEFT</option>
                    <option value="UPI">UPI (Offline QR)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Date Received *</label>
                  <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 focus:bg-white transition-all outline-none text-gray-700" />
                </div>

                <div className="space-y-1.5 col-span-1 md:col-span-2">
                  <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Reference Number (Optional)</label>
                  <input type="text" placeholder="Cheque no., UTR, or Txn ID" className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 focus:bg-white transition-all outline-none" />
                </div>

                <div className="space-y-1.5 col-span-1 md:col-span-2">
                  <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Remarks</label>
                  <textarea rows={2} placeholder="Any additional notes about this donation..." className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 focus:bg-white transition-all outline-none resize-none custom-scrollbar" />
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-6 py-3.5 rounded-full font-bold text-[13px] text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  className="px-8 py-3.5 rounded-full font-bold text-[13px] text-white bg-[#16A34A] hover:bg-[#15803d] shadow-[0_8px_20px_rgba(22,163,74,0.25)] transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Save Donation
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* --- SLIDE-OVER DRAWER (VIEW DONATION DETAILS) --- */}
      {/* ==================================================== */}
      <AnimatePresence>
        {isDrawerOpen && selectedDonation && (
          <>
            {/* Dark Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="fixed top-[73px] inset-x-0 bottom-0 bg-gray-900/30 backdrop-blur-sm z-[100]"
            />
            
            {/* Drawer Panel */}
            <motion.div 
              initial={{ x: "100%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.5 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-[73px] right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col border-l border-gray-100 overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                <div>
                  <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">Donation Details</h2>
                  <p className="text-[12px] font-bold text-gray-400 mt-0.5">Receipt: {selectedDonation.id}</p>
                </div>
                <button onClick={closeDrawer} className="p-2 text-gray-400 hover:text-gray-900 bg-white border border-gray-200 rounded-full shadow-sm transition-all hover:bg-gray-50">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                
                {/* 1. Donor Information */}
                <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-4">Donor Information</h3>
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-[1.5rem] border border-gray-100 mb-8">
                  <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center text-[#16a34a] font-extrabold text-lg">
                    {selectedDonation.donorName.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-gray-900 text-[15px]">{selectedDonation.donorName}</span>
                    <span className="font-bold text-gray-500 text-[12px] mt-0.5">{selectedDonation.email}</span>
                    <span className="font-bold text-gray-400 text-[11px]">{selectedDonation.phone}</span>
                  </div>
                </div>

                {/* 2. Donation Information */}
                <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-4">Donation Overview</h3>
                <div className="bg-white border border-gray-100 shadow-sm rounded-[1.5rem] p-5 mb-8 grid grid-cols-2 gap-y-6 gap-x-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Amount</span>
                    <span className="text-[18px] font-extrabold text-[#16a34a]">{selectedDonation.amount}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Status</span>
                    <div><StatusBadge status={selectedDonation.status} /></div>
                  </div>
                  <div className="flex flex-col col-span-2">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Campaign</span>
                    <span className="text-[13px] font-bold text-gray-900">{selectedDonation.campaign}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Payment Method</span>
                    <span className="text-[13px] font-bold text-gray-900 flex items-center gap-1.5"><MethodIcon method={selectedDonation.method} /> {selectedDonation.method}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Donation Date</span>
                    <span className="text-[13px] font-bold text-gray-900">{selectedDonation.date}</span>
                  </div>
                  <div className="flex flex-col col-span-2">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Transaction ID</span>
                    <span className="text-[12px] font-bold text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded-md w-fit">{selectedDonation.txnId}</span>
                  </div>
                </div>

                {/* 3. Receipt Actions */}
                <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-4">Receipt Actions</h3>
                <div className="flex flex-col gap-3 mb-8">
                  <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-white border border-gray-200 rounded-full font-bold text-[13px] text-gray-700 shadow-sm hover:border-[#16a34a] hover:text-[#16a34a] transition-all">
                    <Download className="w-4 h-4" /> Download PDF Receipt
                  </button>
                  <div className="flex gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-white border border-gray-200 rounded-full font-bold text-[13px] text-gray-700 shadow-sm hover:bg-gray-50 transition-all">
                      <Printer className="w-4 h-4" /> Print
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-green-50 border border-green-100 rounded-full font-bold text-[13px] text-[#16a34a] shadow-sm hover:bg-green-100 transition-all">
                      <Mail className="w-4 h-4" /> Email Receipt
                    </button>
                  </div>
                </div>

                {/* 4. Timeline */}
                <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-4">Transaction Timeline</h3>
                <div className="pl-4 pb-4">
                  <div className="relative border-l-2 border-gray-100 flex flex-col gap-6">
                    
                    <div className="relative pl-6">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#16a34a] border-4 border-white shadow-sm"></div>
                      <p className="text-[13px] font-extrabold text-gray-900">Donation Initiated</p>
                      <span className="text-[11px] font-bold text-gray-400 block mt-0.5">{selectedDonation.date} - 10:23 AM</span>
                    </div>

                    <div className="relative pl-6">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#16a34a] border-4 border-white shadow-sm"></div>
                      <p className="text-[13px] font-extrabold text-gray-900">Payment Verified</p>
                      <span className="text-[11px] font-bold text-gray-400 block mt-0.5">{selectedDonation.date} - 10:25 AM</span>
                    </div>

                    <div className="relative pl-6">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#16a34a] border-4 border-white shadow-sm"></div>
                      <p className="text-[13px] font-extrabold text-gray-900">Receipt Generated</p>
                      <span className="text-[11px] font-bold text-gray-400 block mt-0.5">Receipt {selectedDonation.id} created.</span>
                    </div>

                    <div className="relative pl-6">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gray-200 border-4 border-white shadow-sm"></div>
                      <p className="text-[13px] font-extrabold text-gray-500">Email Sent</p>
                      <span className="text-[11px] font-bold text-gray-400 block mt-0.5">Pending delivery to donor.</span>
                    </div>

                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}