"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Mail, Lock, Info } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(""); // Track the user's email
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call and Role-Based Routing
    setTimeout(() => {
      setIsLoading(false);
      
      const lowerEmail = email.toLowerCase();
      
      // Smart Routing Logic based on Email
      if (lowerEmail.includes("admin")) {
        router.push("/admin");
      } else if (lowerEmail.includes("volunteer")) {
        router.push("/volunteer");
      } else {
        // Default fallback for regular users/donors
        router.push("/user");
      }
    }, 1500);
  };

  return (
    <div className="flex-1 bg-[#fafafa] flex items-center justify-center relative overflow-hidden px-4 py-12 min-h-screen">
      
      {/* --- THEME DESIGN: Glowing Orbs & Diagonal Uplift --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
        
        {/* Soft Glowing Ambient Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-green-400/30 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] bg-orange-400/20 rounded-full blur-[120px]"
        />

        {/* Uplifting Diagonal Dotted Trail */}
        <svg className="absolute w-full h-full opacity-40" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <path 
            d="M -100 1100 Q 400 500 1100 -100" 
            fill="none" 
            stroke="#16a34a" 
            strokeWidth="2" 
            strokeDasharray="8 8" 
            strokeLinecap="round"
          />
        </svg>

        {/* Flying Orange Airplane (Bottom Left to Top Right) */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 20, 0],
            rotate: [15, 20, 15],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[25%] left-[15%] lg:left-[25%]"
        >
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl transform rotate-[-20deg]">
            <path d="M21.5 2.5L2 10.5L9.5 13.5L21.5 2.5Z" fill="#fb923c" stroke="#ea580c" strokeWidth="0.5"/>
            <path d="M21.5 2.5L14.5 22L9.5 13.5L21.5 2.5Z" fill="#f97316" stroke="#ea580c" strokeWidth="0.5"/>
            <path d="M21.5 2.5L9.5 13.5L9.5 19L12 16Z" fill="#c2410c"/>
          </svg>
        </motion.div>

        {/* Small Green Accent Craft (Top Right) */}
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [45, 40, 45] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[20%] right-[15%] lg:right-[20%] opacity-70"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13" stroke="#16a34a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" fill="#22c55e" stroke="#16a34a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </div>

      {/* --- CENTERED LOGIN DIALOG BOX --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="w-full max-w-[480px] bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_40px_rgb(0,0,0,0.06)] border border-white/60 p-8 sm:p-10 relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-sm font-medium text-gray-500">
            Sign in to continue managing your impact.
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#16A34A] transition-colors" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-white/60 border border-gray-200 rounded-[1.2rem] py-3.5 pl-12 pr-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all hover:bg-white"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-gray-700">Password</label>
              <Link href="/forgot-password" className="text-[13px] font-bold text-[#16A34A] hover:text-[#15803d] transition-colors">
                Forgot Password?
              </Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#16A34A] transition-colors" />
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="w-full bg-white/60 border border-gray-200 rounded-[1.2rem] py-3.5 pl-12 pr-4 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all hover:bg-white"
              />
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center mt-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-md checked:bg-[#16A34A] checked:border-[#16A34A] transition-colors cursor-pointer" />
                <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none">
                  <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">Remember me for 30 days</span>
            </label>
          </div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            className="w-full mt-4 bg-[#16A34A] hover:bg-[#15803d] text-white font-bold py-4 rounded-2xl shadow-[0_8px_20px_rgba(22,163,74,0.25)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Sign In"
            )}
            <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></span>
          </motion.button>
        </form>

        {/* --- DEV HELPER TEXT (Remove in Production) --- */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[11px] font-medium text-blue-700 leading-tight">
            <strong>Testing Routes:</strong> Use an email containing <code className="bg-white px-1 py-0.5 rounded font-bold">admin</code> to go to Admin, <code className="bg-white px-1 py-0.5 rounded font-bold">volunteer</code> to go to Volunteer. Anything else goes to User.
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="h-px bg-gray-200 flex-1"></div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Or continue with</span>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        {/* SSO Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 py-3.5 border border-gray-200 rounded-2xl bg-white/80 hover:bg-white transition-colors shadow-sm font-semibold text-gray-700"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 py-3.5 border border-gray-200 rounded-2xl bg-white/80 hover:bg-white transition-colors shadow-sm font-semibold text-gray-700"
          >
            <svg className="w-5 h-5" viewBox="0 0 21 21">
              <path d="M10 0H0v10h10V0z" fill="#f25022"/>
              <path d="M21 0H11v10h10V0z" fill="#7fba00"/>
              <path d="M10 11H0v10h10V11z" fill="#00a4ef"/>
              <path d="M21 11H11v10h10V11z" fill="#ffb900"/>
            </svg>
            Microsoft
          </motion.button>
        </div>

        {/* Register Link */}
        <div className="mt-8 text-center">
          <p className="text-[13.5px] font-medium text-gray-600">
            Don't have an account?{" "}
            <Link href="/register" className="font-bold text-[#F97316] hover:text-[#ea580c] transition-colors relative after:content-[''] after:absolute after:-bottom-0.5 after:left-0 after:w-0 after:h-[2px] after:bg-[#F97316] hover:after:w-full after:transition-all after:duration-300">
              Create an account
            </Link>
          </p>
        </div>

      </motion.div>
    </div>
  );
}