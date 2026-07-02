"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, CheckSquare, Calendar, Award, 
  MessageSquare, Bell, BookOpen, Users, User,
  Settings, LogOut, Search, HelpCircle, ChevronDown,
  CloudSun
} from "lucide-react";
import React, { useState } from "react";

const sidebarLinks = [
  { name: "Dashboard", href: "/volunteer", icon: LayoutDashboard },
  { name: "My Tasks", href: "/volunteer/tasks", icon: CheckSquare },
  { name: "Attendance", href: "/volunteer/attendance", icon: Calendar },
  { name: "Events", href: "/volunteer/events", icon: Calendar },
  { name: "Certificates", href: "/volunteer/certificates", icon: Award },
  { name: "Messages", href: "/volunteer/messages", icon: MessageSquare },
  { name: "Notifications", href: "/volunteer/notifications", icon: Bell },
  { name: "Resources", href: "/volunteer/resources", icon: BookOpen },
  { name: "Community", href: "/volunteer/community", icon: Users },
  { name: "Profile", href: "/volunteer/profile", icon: User },
  { name: "Settings", href: "/volunteer/settings", icon: Settings },
];

export default function VolunteerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="h-full bg-[#FAFAFA] font-sans flex text-slate-800">
      
      {/* SIDEBAR */}
      <motion.aside 
        initial={{ width: 280 }}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="hidden md:flex flex-col bg-white border-r border-slate-200 sticky top-0 h-full z-40 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#16A34A]/5 to-transparent pointer-events-none" />
        
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 min-w-[40px] rounded-2xl bg-gradient-to-br from-[#16A34A] to-[#F97316] flex items-center justify-center font-bold text-xl shadow-[0_8px_16px_rgba(22,163,74,0.2)] text-white">
            N
          </div>
          {isSidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-extrabold text-2xl tracking-tight text-[#0F172A]"
            >
              Nishkam<span className="text-[#16A34A]">NGO</span>
            </motion.span>
          )}
        </div>

        {/* User Role Badge */}
        {isSidebarOpen && (
          <div className="px-6 mb-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-[#16A34A]/10 to-transparent rounded-2xl p-3 border border-[#16A34A]/10">
              <div className="w-8 h-8 rounded-full bg-[#16A34A]/20 flex items-center justify-center">
                <HeartIcon className="w-4 h-4 text-[#16A34A]" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#0F172A]">Volunteer</span>
                <span className="text-[11px] text-slate-500 font-medium">Impact Maker</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar pb-4">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/volunteer" && pathname?.startsWith(`${link.href}/`));
            return (
              <Link key={link.name} href={link.href}>
                <div className={`flex items-center gap-3 px-3 py-3 rounded-2xl transition-all relative overflow-hidden group ${
                  isActive 
                    ? "bg-[#16A34A] text-white shadow-[0_4px_12px_rgba(22,163,74,0.2)] font-bold" 
                    : "text-slate-500 hover:text-[#0F172A] hover:bg-slate-50 font-medium"
                }`}>
                  <link.icon className={`w-5 h-5 min-w-[20px] transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#16A34A]'}`} />
                  {isSidebarOpen && (
                    <span className="whitespace-nowrap z-10">{link.name}</span>
                  )}
                  {isActive && (
                    <motion.div layoutId="active-nav-bg" className="absolute inset-0 bg-[#16A34A] -z-10" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <Link href="/">
            <div className="flex items-center gap-3 px-3 py-3 rounded-2xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-bold transition-all cursor-pointer group">
              <LogOut className="w-5 h-5 min-w-[20px] group-hover:-translate-x-1 transition-transform" />
              {isSidebarOpen && <span>Logout</span>}
            </div>
          </Link>
        </div>
      </motion.aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#16A34A]/5 rounded-full blur-[100px] pointer-events-none -z-10 transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#F97316]/5 rounded-full blur-[80px] pointer-events-none -z-10 transform -translate-x-1/2 translate-y-1/2" />
        
{/* HEADER REMOVED */}

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}

function HeartIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}
