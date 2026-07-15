"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, User, Mail, Phone, Lock, Building2 } from "lucide-react";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  
  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Feedback States
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Step 6: Validate Passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // Step 7: POST to Backend
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
        }),
      });

      const data = await response.json();

      // Step 8: Handle Error
      if (!data.success) {
        setError(data.message || "Registration failed");
        setIsLoading(false);
        return;
      }

      // Step 9: Handle Success
      setSuccess("Registration Successful! Redirecting to login...");
      setIsLoading(false);
      
      // Wait briefly so user sees the success message, then redirect
      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#16A34A] transition-colors" />
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3 pl-11 pr-4 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all hover:bg-gray-100/50" 
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#16A34A] transition-colors" />
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3 pl-11 pr-4 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all hover:bg-gray-100/50" 
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Phone</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#16A34A] transition-colors" />
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3 pl-11 pr-4 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all hover:bg-gray-100/50" 
                  />
                </div>
              </div>
              
            </div>

            <div className="grid grid-cols-1 gap-5">
              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#16A34A] transition-colors" />
                  <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3 pl-11 pr-4 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all hover:bg-gray-100/50" 
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#16A34A] transition-colors" />
                  <input 
                    type="password" 
                    required 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3 pl-11 pr-4 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all hover:bg-gray-100/50" 
                  />
                </div>
              </div>
            </div>

            {/* Location (Simplified - UI Only) */}
            <div className="grid grid-cols-3 gap-3">
              <input type="text" placeholder="Country" className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3 px-4 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all hover:bg-gray-100/50" />
              <input type="text" placeholder="State" className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3 px-4 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all hover:bg-gray-100/50" />
              <input type="text" placeholder="City" className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3 px-4 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all hover:bg-gray-100/50" />
            </div>
          </div>

          {/* Error and Success Messages */}
          {(error || success) && (
            <div className="text-center">
              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
              {success && <p className="text-green-600 text-sm font-medium">{success}</p>}
            </div>
          )}

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