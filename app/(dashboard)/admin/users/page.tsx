"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Search, Filter, MoreVertical, Shield, Heart, 
  User as UserIcon, Building2, Trash2, UserCog, Plus,
  ChevronDown, AlertCircle, X
} from "lucide-react";

// --- DUMMY DATA ---
const initialUsers = [
  { id: "1", name: "Akash Dandale", email: "akash@example.com", role: "ADMIN", status: "Active", joinedAt: "Oct 12, 2025" },
  { id: "2", name: "Priya Sharma", email: "priya@example.com", role: "VOLUNTEER", status: "Active", joinedAt: "Nov 05, 2025" },
  { id: "3", name: "Rahul Verma", email: "rahul.v@example.com", role: "USER", status: "Active", joinedAt: "Jan 15, 2026" },
  { id: "4", name: "Sneha Patel", email: "sneha.p@example.com", role: "FINANCE", status: "Active", joinedAt: "Feb 22, 2026" },
  { id: "5", name: "Amit Kumar", email: "amit.k@example.com", role: "USER", status: "Inactive", joinedAt: "Mar 10, 2026" },
  { id: "6", name: "Neha Gupta", email: "neha.g@example.com", role: "VOLUNTEER", status: "Active", joinedAt: "Apr 02, 2026" },
];

// Helper function for Role Badges
const RoleBadge = ({ role }: { role: string }) => {
  switch (role) {
    case "ADMIN":
      return <span className="flex items-center gap-1.5 w-fit px-3 py-1 bg-green-50 text-[#16a34a] rounded-full text-[11px] font-extrabold tracking-wider"><Shield className="w-3 h-3" /> ADMIN</span>;
    case "VOLUNTEER":
      return <span className="flex items-center gap-1.5 w-fit px-3 py-1 bg-orange-50 text-[#f97316] rounded-full text-[11px] font-extrabold tracking-wider"><Heart className="w-3 h-3" /> VOLUNTEER</span>;
    case "FINANCE":
      return <span className="flex items-center gap-1.5 w-fit px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[11px] font-extrabold tracking-wider"><Building2 className="w-3 h-3" /> FINANCE</span>;
    default:
      return <span className="flex items-center gap-1.5 w-fit px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[11px] font-extrabold tracking-wider"><UserIcon className="w-3 h-3" /> USER</span>;
  }
};

export default function UsersManagementPage() {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // --- MODAL STATE ---
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    actionType: "ROLE" | "DELETE" | null;
    userId: string | null;
    userName: string;
    targetRole?: string;
  }>({
    isOpen: false,
    actionType: null,
    userId: null,
    userName: "",
  });

  // --- MOCK ACTIONS (Triggers Modal) ---
  const triggerDelete = (id: string, name: string) => {
    setModalState({ isOpen: true, actionType: "DELETE", userId: id, userName: name });
    setActiveDropdown(null);
  };

  const triggerRoleChange = (id: string, name: string, newRole: string) => {
    setModalState({ isOpen: true, actionType: "ROLE", userId: id, userName: name, targetRole: newRole });
    setActiveDropdown(null);
  };

  // --- CONFIRM ACTIONS (Executes Data Change) ---
  const confirmAction = () => {
    if (modalState.actionType === "DELETE" && modalState.userId) {
      setUsers(users.filter(user => user.id !== modalState.userId));
    } else if (modalState.actionType === "ROLE" && modalState.userId && modalState.targetRole) {
      setUsers(users.map(user => user.id === modalState.userId ? { ...user, role: modalState.targetRole! } : user));
    }
    closeModal();
  };

  const closeModal = () => setModalState({ ...modalState, isOpen: false });

  // --- FILTER LOGIC ---
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative flex flex-col gap-8">
      
      {/* --- CORNER BACKGROUND MOTIFS (Visible around the table) --- */}
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

      {/* --- CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {modalState.isOpen && (
          <div className="fixed top-[73px] inset-x-0 bottom-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            
            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[2rem] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col items-center text-center z-10"
            >
              {/* Close Icon */}
              <button onClick={closeModal} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors">
                <X className="w-5 h-5" />
              </button>

              {/* Icon Container */}
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 ${
                modalState.actionType === "DELETE" ? "bg-red-50 text-red-500" : 
                modalState.targetRole === "ADMIN" ? "bg-green-50 text-[#16a34a]" : 
                modalState.targetRole === "VOLUNTEER" ? "bg-orange-50 text-[#f97316]" : "bg-gray-100 text-gray-600"
              }`}>
                {modalState.actionType === "DELETE" ? <AlertCircle className="w-8 h-8" /> : 
                 modalState.targetRole === "ADMIN" ? <Shield className="w-8 h-8" /> : 
                 modalState.targetRole === "VOLUNTEER" ? <Heart className="w-8 h-8" /> : <UserIcon className="w-8 h-8" />
                }
              </div>

              {/* Text Content */}
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">
                {modalState.actionType === "DELETE" ? "Remove User?" : "Change User Role?"}
              </h3>
              <p className="text-[13px] font-bold text-gray-500 mb-8 leading-relaxed">
                {modalState.actionType === "DELETE" 
                  ? `Are you sure you want to permanently remove ${modalState.userName} from the platform? This action cannot be undone.` 
                  : `Are you sure you want to change ${modalState.userName}'s role to ${modalState.targetRole}? They will inherit new permissions instantly.`
                }
              </p>

              {/* Actions */}
              <div className="w-full flex gap-3">
                <button 
                  onClick={closeModal}
                  className="flex-1 py-3.5 rounded-full font-bold text-[13px] text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmAction}
                  className={`flex-1 py-3.5 rounded-full font-bold text-[13px] text-white transition-all shadow-lg ${
                    modalState.actionType === "DELETE" 
                      ? "bg-red-500 hover:bg-red-600 shadow-red-500/30" 
                      : "bg-[#16A34A] hover:bg-[#15803d] shadow-green-500/30"
                  }`}
                >
                  Yes, Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* --- PAGE HEADER (z-10 ensures it sits above absolute background SVGs) --- */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-extrabold text-gray-900 tracking-tight"
          >
            User Management
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[13px] font-bold text-gray-400 mt-1"
          >
            Manage administrators, volunteers, and donors across the platform.
          </motion.p>
        </div>
        
      </div>

      {/* --- USERS TABLE --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative z-10 bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden"
      >
        <div className="overflow-x-auto custom-scrollbar min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="py-5 px-8 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">User Profile</th>
                <th className="py-5 px-8 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Role</th>
                <th className="py-5 px-8 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="py-5 px-8 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Joined Date</th>
                <th className="py-5 px-8 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence>
                {filteredUsers.map((user) => (
                  <motion.tr 
                    key={user.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95, backgroundColor: "#fee2e2" }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-white/60 transition-colors group"
                  >
                    {/* User Profile Info */}
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center font-extrabold text-sm text-[#16a34a] group-hover:bg-[#16a34a] group-hover:text-white transition-colors shrink-0 shadow-sm border border-green-100/50">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-extrabold text-gray-900 text-[14px]">{user.name}</span>
                          <span className="font-bold text-gray-400 text-[12px]">{user.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="py-5 px-8">
                      <RoleBadge role={user.role} />
                    </td>

                    {/* Status */}
                    <td className="py-5 px-8">
                      <span className="flex items-center gap-2 text-[12px] font-bold text-gray-600">
                        <span className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-[#16a34a]' : 'bg-gray-300'}`}></span>
                        {user.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-5 px-8 text-[13px] font-bold text-gray-500">
                      {user.joinedAt}
                    </td>

                    {/* Actions Dropdown */}
                    <td className="py-5 px-8 text-right relative">
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                        className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {activeDropdown === user.id && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-10 top-12 w-48 bg-white rounded-[1.2rem] shadow-[0_10px_40px_rgb(0,0,0,0.1)] border border-gray-100 py-2 z-50 overflow-hidden text-left"
                          >
                            <div className="px-3 py-1.5 mb-1">
                              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Change Role</span>
                            </div>
                            
                            {/* Role Change Buttons */}
                            {user.role !== "ADMIN" && (
                              <button onClick={() => triggerRoleChange(user.id, user.name, "ADMIN")} className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-green-50 hover:text-[#16a34a] flex items-center gap-2 transition-colors">
                                <Shield className="w-3.5 h-3.5" /> Make Admin
                              </button>
                            )}
                            {user.role !== "VOLUNTEER" && (
                              <button onClick={() => triggerRoleChange(user.id, user.name, "VOLUNTEER")} className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-orange-50 hover:text-[#f97316] flex items-center gap-2 transition-colors">
                                <Heart className="w-3.5 h-3.5" /> Make Volunteer
                              </button>
                            )}
                            {user.role !== "USER" && (
                              <button onClick={() => triggerRoleChange(user.id, user.name, "USER")} className="w-full text-left px-4 py-2 text-[13px] font-bold text-gray-700 hover:bg-gray-50 hover:text-gray-900 flex items-center gap-2 transition-colors">
                                <UserIcon className="w-3.5 h-3.5" /> Make User
                              </button>
                            )}

                            <div className="h-px bg-gray-100 my-1.5"></div>
                            
                            {/* Delete Button */}
                            <button 
                              onClick={() => triggerDelete(user.id, user.name)} 
                              className="w-full text-left px-4 py-2 text-[13px] font-bold text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Remove User
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center text-gray-400"
                    >
                      <UserCog className="w-12 h-12 mb-4 opacity-20" />
                      <p className="text-[13px] font-bold">No users found matching your criteria.</p>
                      <button onClick={() => setSearchQuery("")} className="mt-4 text-[#16a34a] font-bold text-[13px] hover:underline">
                        Clear Search
                      </button>
                    </motion.div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}