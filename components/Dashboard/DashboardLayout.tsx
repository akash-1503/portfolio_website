"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, BookOpen, Heart, Calendar, 
  Settings, Bell, Search, MessageSquare, ChevronDown, 
  LogOut, PieChart, Shield, ChevronLeft, ChevronRight
} from "lucide-react";
import React, { useState } from "react";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Donations", href: "/admin/donations", icon: Heart },
  { name: "Campaigns", href: "/admin/campaigns", icon: PieChart },
  { name: "Programs", href: "/admin/programs", icon: BookOpen },
  { name: "Volunteers", href: "/admin/volunteers", icon: Users },
  { name: "Events", href: "/admin/events", icon: Calendar },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="h-full bg-[#fafafa] font-sans flex text-gray-900 overflow-hidden">
      
      {/* --- SIDEBAR (Light Theme) --- */}
      <motion.aside 
        initial={{ width: 280 }}
        animate={{ width: isSidebarOpen ? 280 : 88 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden md:flex flex-col bg-white border-r border-gray-100 sticky top-0 h-full z-40 shadow-[4px_0_24px_rgba(0,0,0,0.02)] relative flex-shrink-0"
      >
        {/* Collapse Toggle Button */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3.5 top-8 bg-white border border-gray-200 shadow-sm w-7 h-7 rounded-full flex items-center justify-center text-gray-500 hover:text-[#16a34a] hover:border-[#16a34a] transition-colors z-50"
        >
          {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        
        {/* Logo */}
        <div className={`h-20 flex items-center shrink-0 ${isSidebarOpen ? 'px-6' : 'justify-center px-4'}`}>
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-9 h-9 min-w-[36px] rounded-full bg-gradient-to-tr from-[#16a34a] to-green-400 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-green-500/30 group-hover:rotate-12 transition-transform">
              N
            </div>
            {isSidebarOpen && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-extrabold text-[19px] tracking-tight text-gray-900 drop-shadow-sm whitespace-nowrap"
              >
                Nishkam<span className="text-[#f97316]">NGO</span>
              </motion.span>
            )}
          </Link>
        </div>

        {/* User Role Badge */}
        <div className={`px-4 mb-6 shrink-0 transition-all ${isSidebarOpen ? 'px-4' : 'px-3'}`}>
          <div className={`flex items-center bg-green-50/50 rounded-[1.2rem] border border-green-100/50 transition-all ${isSidebarOpen ? 'p-3 gap-3' : 'p-2 justify-center'}`}>
            <div className="relative">
              <Shield className="w-8 h-8 text-[#16a34a] p-1.5 bg-white rounded-full shadow-sm" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-[13px] font-extrabold text-gray-900 truncate">Admin Portal</span>
                <span className="text-[11px] font-bold text-gray-500 truncate">Full Access</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar pb-6">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
            return (
              <Link key={link.name} href={link.href}>
                <div className={`flex items-center gap-3 rounded-xl transition-all group relative ${
                  isSidebarOpen ? 'px-3 py-3' : 'justify-center p-3'
                } ${
                  isActive 
                    ? "bg-[#16a34a] text-white shadow-md shadow-green-500/20" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-bold"
                }`}>
                  <link.icon className={`w-5 h-5 min-w-[20px] shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  
                  {isSidebarOpen && (
                    <span className={`text-[13px] font-bold truncate ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-900'}`}>
                      {link.name}
                    </span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {!isSidebarOpen && (
                    <div className="absolute left-16 bg-gray-900 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                      {link.name}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar (Logout) */}
        <div className="p-4 border-t border-gray-50 shrink-0">
          <Link href="/login">
            <div className={`flex items-center rounded-xl transition-all duration-200 text-red-500 hover:bg-red-50 hover:text-red-600 ${
              isSidebarOpen ? 'px-3 py-3 gap-3' : 'justify-center p-3'
            }`}>
              <LogOut className="w-5 h-5 shrink-0" />
              {isSidebarOpen && <span className="text-[13px] font-bold">Logout</span>}
            </div>
          </Link>
        </div>
      </motion.aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        
{/* HEADER REMOVED */}

        {/* --- SCROLLABLE CONTENT WITH THEME MOTIF --- */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative bg-[#fafafa]">
          
          {/* THEME BACKGROUND MOTIF (Dotted Lines & Crafts) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {/* Sweeping Green Dotted Trail */}
            <svg className="absolute w-full h-[600px] opacity-30 top-0 left-0" viewBox="0 0 1200 600" preserveAspectRatio="none">
              <path 
                d="M -100 500 C 200 600, 400 100, 800 300 C 1000 400, 1100 200, 1300 100" 
                fill="none" 
                stroke="#16a34a" 
                strokeWidth="2" 
                strokeDasharray="6 8" 
                strokeLinecap="round"
              />
            </svg>

            {/* Animated Orange Paper Airplane */}
            <motion.div
              animate={{
                y: [-10, 10, -10],
                x: [-5, 5, -5],
                rotate: [-2, 2, -2],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[10%] right-[10%] opacity-80"
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg transform rotate-12">
                <path d="M21.5 2.5L2 10.5L9.5 13.5L21.5 2.5Z" fill="#fb923c" stroke="#ea580c" strokeWidth="0.5"/>
                <path d="M21.5 2.5L14.5 22L9.5 13.5L21.5 2.5Z" fill="#f97316" stroke="#ea580c" strokeWidth="0.5"/>
                <path d="M21.5 2.5L9.5 13.5L9.5 19L12 16Z" fill="#c2410c"/>
              </svg>
            </motion.div>

            {/* Animated Green Paper Airplane */}
            <motion.div
              animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-[20%] left-[5%] opacity-50"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform -rotate-45">
                <path d="M22 2L11 13" stroke="#16a34a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" fill="#22c55e" stroke="#16a34a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          </div>

          {/* Children wrapped in relative z-10 to stay above motifs */}
          <div className="relative z-10 p-6 lg:p-10 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}