"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, BookOpen, Heart, Calendar, 
  Settings, PieChart, Shield, ChevronLeft, ChevronRight,
  Gift, Wallet, Globe, ClipboardList, LogOut
} from "lucide-react";
import React, { useState } from "react";

const getRoleConfig = (pathname: string) => {
  if (pathname?.startsWith("/admin")) {
    return {
      id: "admin",
      badgeTitle: "ADMIN PORTAL",
      badgeSubtitle: "Full Access",
      icon: Shield,
      accentColor: "#16A34A",
      accentBg: "bg-green-50",
      accentBgHover: "hover:bg-green-50",
      accentBgActive: "bg-[#16A34A]",
      accentText: "text-[#16A34A]",
      accentTextHover: "hover:text-[#16a34a]",
      accentBorder: "border-[#16a34a]",
      accentBorderHover: "hover:border-[#16a34a]",
      buttonShadow: "shadow-[0_8px_20px_rgba(22,163,74,0.25)]",
      indicatorColor: "bg-green-500",
      badgeBorder: "border-green-100",
      links: [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Donations", href: "/admin/donations", icon: Heart },
        { name: "Programs", href: "/admin/programs", icon: BookOpen },
        { name: "Volunteers", href: "/admin/volunteers", icon: Users },
        { name: "Events & Campaigns", href: "/admin/events", icon: Calendar },
        { name: "Settings", href: "/admin/settings", icon: Settings },
      ]
    };
  } else if (pathname?.startsWith("/volunteer")) {
    return {
      id: "volunteer",
      badgeTitle: "VOLUNTEER PORTAL",
      badgeSubtitle: "Community Volunteer",
      icon: Heart,
      accentColor: "#F97316",
      accentBg: "bg-orange-50",
      accentBgHover: "hover:bg-orange-50",
      accentBgActive: "bg-[#F97316]",
      accentText: "text-[#F97316]",
      accentTextHover: "hover:text-[#F97316]",
      accentBorder: "border-[#F97316]",
      accentBorderHover: "hover:border-[#f97316]",
      buttonShadow: "shadow-[0_8px_20px_rgba(249,115,22,0.25)]",
      indicatorColor: "bg-orange-500",
      badgeBorder: "border-orange-100",
      links: [
        { name: "Dashboard", href: "/volunteer", icon: LayoutDashboard },
        { name: "Tasks", href: "/volunteer/tasks", icon: ClipboardList },
        { name: "Events", href: "/volunteer/events", icon: Calendar },
        { name: "Settings", href: "/volunteer/settings", icon: Settings },
      ]
    };
  } else if (pathname?.startsWith("/user")) {
    return {
      id: "donor",
      badgeTitle: "DONOR PORTAL",
      badgeSubtitle: "Supporter",
      icon: Gift,
      accentColor: "#3B82F6",
      accentBg: "bg-blue-50",
      accentBgHover: "hover:bg-blue-50",
      accentBgActive: "bg-[#3B82F6]",
      accentText: "text-[#3B82F6]",
      accentTextHover: "hover:text-[#3B82F6]",
      accentBorder: "border-[#3B82F6]",
      accentBorderHover: "hover:border-[#3b82f6]",
      buttonShadow: "shadow-[0_8px_20px_rgba(59,130,246,0.25)]",
      indicatorColor: "bg-blue-500",
      badgeBorder: "border-blue-100",
      links: [
        { name: "Dashboard", href: "/user", icon: LayoutDashboard },
        { name: "History", href: "/user/history", icon: Heart },
        { name: "Settings", href: "/user/settings", icon: Settings },
      ]
    };
  } else if (pathname?.startsWith("/finance")) {
    return {
      id: "finance",
      badgeTitle: "FINANCE PORTAL",
      badgeSubtitle: "Finance Manager",
      icon: Wallet,
      accentColor: "#7C3AED",
      accentBg: "bg-purple-50",
      accentBgHover: "hover:bg-purple-50",
      accentBgActive: "bg-[#7C3AED]",
      accentText: "text-[#7C3AED]",
      accentTextHover: "hover:text-[#7C3AED]",
      accentBorder: "border-[#7C3AED]",
      accentBorderHover: "hover:border-[#7c3aed]",
      buttonShadow: "shadow-[0_8px_20px_rgba(124,58,237,0.25)]",
      indicatorColor: "bg-purple-500",
      badgeBorder: "border-purple-100",
      links: [
        { name: "Dashboard", href: "/finance", icon: LayoutDashboard },
        { name: "Reports", href: "/finance/reports", icon: PieChart },
        { name: "Settings", href: "/finance/settings", icon: Settings },
      ]
    };
  } else if (pathname?.startsWith("/content")) {
    return {
      id: "content",
      badgeTitle: "CONTENT STUDIO",
      badgeSubtitle: "Content Manager",
      icon: Globe,
      accentColor: "#0D9488",
      accentBg: "bg-teal-50",
      accentBgHover: "hover:bg-teal-50",
      accentBgActive: "bg-[#0D9488]",
      accentText: "text-[#0D9488]",
      accentTextHover: "hover:text-[#0D9488]",
      accentBorder: "border-[#0D9488]",
      accentBorderHover: "hover:border-[#0d9488]",
      buttonShadow: "shadow-[0_8px_20px_rgba(13,148,136,0.25)]",
      indicatorColor: "bg-teal-500",
      badgeBorder: "border-teal-100",
      links: [
        { name: "Dashboard", href: "/content", icon: LayoutDashboard },
        { name: "Articles", href: "/content/articles", icon: BookOpen },
        { name: "Settings", href: "/content/settings", icon: Settings },
      ]
    };
  } else {
    // Default fallback
    return {
      id: "default",
      badgeTitle: "WORKSPACE",
      badgeSubtitle: "User",
      icon: LayoutDashboard,
      accentColor: "#6B7280",
      accentBg: "bg-gray-50",
      accentBgHover: "hover:bg-gray-50",
      accentBgActive: "bg-[#6B7280]",
      accentText: "text-[#6B7280]",
      accentTextHover: "hover:text-[#6b7280]",
      accentBorder: "border-[#6B7280]",
      accentBorderHover: "hover:border-[#6b7280]",
      buttonShadow: "shadow-[0_8px_20px_rgba(107,114,128,0.25)]",
      indicatorColor: "bg-gray-500",
      badgeBorder: "border-gray-200",
      links: [
        { name: "Dashboard", href: "/", icon: LayoutDashboard },
      ]
    };
  }
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const config = getRoleConfig(pathname);
  const Icon = config.icon;

  return (
    <div className="h-screen bg-[#fafafa] font-sans flex text-gray-900 overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <motion.aside 
        initial={{ width: 280 }}
        animate={{ width: isSidebarOpen ? 280 : 88 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden md:flex flex-col bg-white border-r border-gray-100 sticky top-0 h-full z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] relative flex-shrink-0"
      >
        {/* Collapse Toggle Button */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`absolute -right-3.5 top-8 bg-white border border-gray-200 shadow-sm w-7 h-7 rounded-full flex items-center justify-center text-gray-500 transition-colors z-50 hover:bg-gray-50 ${config.accentTextHover}`}
        >
          {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        
        {/* User Role Badge */}
        <div className={`px-4 mb-6 mt-8 shrink-0 transition-all ${isSidebarOpen ? 'px-4' : 'px-3'}`}>
          <div className={`flex items-center ${config.accentBg} rounded-[1.5rem] border ${config.badgeBorder} transition-all ${isSidebarOpen ? 'p-3 gap-3' : 'p-2 justify-center'}`}>
            <div className="relative">
              <Icon className="w-9 h-9 p-2 bg-white rounded-full shadow-sm" style={{ color: config.accentColor }} />
              <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full ${config.indicatorColor}`}></div>
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-[13px] font-extrabold text-gray-900 truncate tracking-tight">{config.badgeTitle}</span>
                <span className="text-[11px] font-bold text-gray-500 truncate">{config.badgeSubtitle}</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar pb-6">
          {config.links.map((link) => {
            
            // Exact match for the base route, loose match for sub-routes
            const isBaseRoute = ['/admin', '/volunteer', '/user', '/finance', '/content'].includes(link.href);
            const isActive = isBaseRoute 
              ? pathname === link.href 
              : pathname === link.href || pathname?.startsWith(`${link.href}/`);

            return (
              <Link key={link.name} href={link.href}>
                <div className={`flex items-center gap-3 rounded-xl transition-all group relative ${
                  isSidebarOpen ? 'px-3 py-3' : 'justify-center p-3'
                } ${
                  isActive 
                    ? `${config.accentBgActive} text-white shadow-md ${config.buttonShadow}` 
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
                    <div className="absolute left-16 bg-gray-900 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl border border-gray-700">
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
        
        {/* --- SCROLLABLE CONTENT WITH THEME MOTIF --- */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative bg-[#fafafa]">
          
          {/* THEME BACKGROUND MOTIF (Dotted Lines & Crafts) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            
            {/* Sweeping Dotted Trail */}
            <svg className="absolute w-full h-[600px] opacity-[0.15] top-0 left-0" viewBox="0 0 1200 600" preserveAspectRatio="none">
              <path 
                d="M -100 500 C 200 600, 400 100, 800 300 C 1000 400, 1100 200, 1300 100" 
                fill="none" 
                stroke={config.accentColor} 
                strokeWidth="2" 
                strokeDasharray="6 8" 
                strokeLinecap="round"
              />
            </svg>

            {/* Animated Floating Element 1 (Top Right) */}
            <motion.div
              animate={{
                y: [-10, 10, -10],
                x: [-5, 5, -5],
                rotate: [-2, 2, -2],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[10%] right-[10%] opacity-40 mix-blend-multiply"
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg transform rotate-12">
                <path d="M21.5 2.5L2 10.5L9.5 13.5L21.5 2.5Z" fill={config.accentColor} opacity="0.8" />
                <path d="M21.5 2.5L14.5 22L9.5 13.5L21.5 2.5Z" fill={config.accentColor} />
                <path d="M21.5 2.5L9.5 13.5L9.5 19L12 16Z" fill={config.accentColor} opacity="0.6"/>
              </svg>
            </motion.div>

            {/* Animated Floating Element 2 (Bottom Left) */}
            <motion.div
              animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-[20%] left-[5%] opacity-30 mix-blend-multiply"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform -rotate-45">
                <path d="M22 2L11 13" stroke={config.accentColor} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" fill={config.accentColor} stroke={config.accentColor} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>

          </div>

          {/* Children wrapped in relative z-10 to stay above motifs */}
          <div className="relative z-10 p-6 lg:p-10 max-w-[1600px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>

    </div>
  );
}