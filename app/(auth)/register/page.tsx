"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, User, Mail, Phone, Lock, Heart, Shield, Building2, Landmark, PenTool, ClipboardList, Check } from "lucide-react";

const roles = [
  { id: "volunteer", label: "Volunteer", icon: Heart, color: "text-rose-500", bg: "bg-rose-100", border: "border-rose-200", selected: "border-rose-500 bg-rose-50" },
  { id: "donor", label: "Donor", icon: Landmark, color: "text-emerald-500", bg: "bg-emerald-100", border: "border-emerald-200", selected: "border-emerald-500 bg-emerald-50" },
  { id: "coordinator", label: "Coordinator", icon: ClipboardList, color: "text-blue-500", bg: "bg-blue-100", border: "border-blue-200", selected: "border-blue-500 bg-blue-50" },
  { id: "admin", label: "Org Admin", icon: Shield, color: "text-purple-500", bg: "bg-purple-100", border: "border-purple-200", selected: "border-purple-500 bg-purple-50" },
  { id: "finance", label: "Finance", icon: Building2, color: "text-amber-500", bg: "bg-amber-100", border: "border-amber-200", selected: "border-amber-500 bg-amber-50" },
  { id: "content", label: "Content", icon: PenTool, color: "text-cyan-500", bg: "bg-cyan-100", border: "border-cyan-200", selected: "border-cyan-500 bg-cyan-50" },
];

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("volunteer");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex-1 bg-[#fafafa] flex items-center justify-center relative overflow-hidden px-4 py-12">
      
      {/* --- LEFT SIDE DECORATION (Green Craft & Trail) --- */}
      <div className="absolute top-0 left-0 w-64 lg:w-80 h-full pointer-events-none z-0 hidden lg:block">
        {/* Green Dotted Trail */}
        <svg className="absolute top-1/4 -left-10 w-64 h-96 opacity-40" viewBox="0 0 100 150">
          <path 
            d="M 100 10 C 50 10, 10 50, 20 100 C 30 140, 80 140, 70 90 C 60 50, 10 50, 0 80" 
            fill="none" 
            stroke="#16a34a" 
            strokeWidth="1.5" 
            strokeDasharray="4 5" 
          />
        </svg>

        {/* Flying Green Airplane */}
        <motion.div
          animate={{ y: [0, -10, 0], x: [0, 5, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-20"
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg transform -rotate-12">
            <path d="M21.5 2.5L2 10.5L9.5 13.5L21.5 2.5Z" fill="#4ade80" stroke="#16a34a" strokeWidth="0.5"/>
            <path d="M21.5 2.5L14.5 22L9.5 13.5L21.5 2.5Z" fill="#22c55e" stroke="#16a34a" strokeWidth="0.5"/>
            <path d="M21.5 2.5L9.5 13.5L9.5 19L12 16Z" fill="#16a34a"/>
          </svg>
        </motion.div>
      </div>

      {/* --- RIGHT SIDE DECORATION (Orange Craft & Trail) --- */}
      <div className="absolute top-0 right-0 w-64 lg:w-80 h-full pointer-events-none z-0 hidden lg:block">
        {/* Orange Dotted Trail */}
        <svg className="absolute top-1/3 right-0 w-64 h-96 opacity-40" viewBox="0 0 100 200">
          <path 
            d="M 10 10 C 60 30, 90 80, 80 130 C 70 170, 20 170, 30 120 C 40 80, 90 80, 100 110" 
            fill="none" 
            stroke="#ea580c" 
            strokeWidth="1.5" 
            strokeDasharray="4 5" 
          />
        </svg>

        {/* Flying Orange Airplane */}
        <motion.div
          animate={{ y: [0, 10, 0], x: [0, -5, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[25%] right-24"
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg transform rotate-45">
            <path d="M21.5 2.5L2 10.5L9.5 13.5L21.5 2.5Z" fill="#fb923c" stroke="#ea580c" strokeWidth="0.5"/>
            <path d="M21.5 2.5L14.5 22L9.5 13.5L21.5 2.5Z" fill="#f97316" stroke="#ea580c" strokeWidth="0.5"/>
            <path d="M21.5 2.5L9.5 13.5L9.5 19L12 16Z" fill="#c2410c"/>
          </svg>
        </motion.div>
      </div>

      {/* --- CENTERED REGISTER DIALOG BOX --- */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-8 sm:p-10 relative z-10 mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Create Account</h1>
          <p className="text-sm font-medium text-gray-500">
            Join our community and start making an impact.
          </p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-6">
          
          {/* Scrollable Form Container */}
          <div className="flex flex-col gap-6 max-h-[55vh] overflow-y-auto pr-2 custom-scrollbar pb-4">
            
            {/* Role Selection */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700">Select Your Role</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {roles.map((role) => (
                  <motion.button
                    type="button"
                    key={role.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedRole(role.id)}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-[1.2rem] border-2 transition-all ${
                      selectedRole === role.id ? role.selected : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {selectedRole === role.id && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#16A34A] flex items-center justify-center">
                        <Check className="w-3 h-3 text-white stroke-[3px]" />
                      </div>
                    )}
                    <div className={`p-2 rounded-full mb-2 ${role.bg}`}>
                      <role.icon className={`w-5 h-5 ${role.color}`} />
                    </div>
                    <span className={`text-xs font-bold ${selectedRole === role.id ? 'text-gray-900' : 'text-gray-500'}`}>
                      {role.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#16A34A] transition-colors" />
                  <input type="text" required placeholder="John Doe" className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3 pl-11 pr-4 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all hover:bg-gray-100/50" />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#16A34A] transition-colors" />
                  <input type="email" required placeholder="name@example.com" className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3 pl-11 pr-4 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all hover:bg-gray-100/50" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Phone</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#16A34A] transition-colors" />
                  <input type="tel" placeholder="+1 234 567 890" className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3 pl-11 pr-4 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all hover:bg-gray-100/50" />
                </div>
              </div>
              
              {/* Organization */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Organization (Optional)</label>
                <div className="relative group">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#16A34A] transition-colors" />
                  <input type="text" placeholder="Company / NGO" className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3 pl-11 pr-4 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all hover:bg-gray-100/50" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#16A34A] transition-colors" />
                  <input type="password" required placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3 pl-11 pr-4 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all hover:bg-gray-100/50" />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#16A34A] transition-colors" />
                  <input type="password" required placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3 pl-11 pr-4 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all hover:bg-gray-100/50" />
                </div>
              </div>
            </div>

            {/* Location (Simplified) */}
            <div className="grid grid-cols-3 gap-3">
              <input type="text" placeholder="Country" className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3 px-4 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all hover:bg-gray-100/50" />
              <input type="text" placeholder="State" className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3 px-4 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all hover:bg-gray-100/50" />
              <input type="text" placeholder="City" className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3 px-4 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all hover:bg-gray-100/50" />
            </div>

            {/* Checkboxes */}
            <div className="space-y-4 mt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input type="checkbox" required className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-md checked:bg-[#16A34A] checked:border-[#16A34A] transition-colors cursor-pointer" />
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none"><path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">I accept the Terms of Service and Privacy Policy.</span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-md checked:bg-[#16A34A] checked:border-[#16A34A] transition-colors cursor-pointer" />
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none"><path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Subscribe to our newsletter for impact updates.</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="w-full bg-[#16A34A] hover:bg-[#15803d] text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
              <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </motion.button>
          </div>
          
          {/* Login Link */}
          <div className="text-center mt-2">
            <p className="text-sm font-medium text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-[#F97316] hover:text-[#ea580c] transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}