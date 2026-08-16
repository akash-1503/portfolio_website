"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Heart,
  Calendar,
  Settings,
  PieChart,
  Shield,
  ChevronLeft,
  ChevronRight,
  Gift,
  Wallet,
  Globe,
  ClipboardList,
  LogOut,
  User,
  ChevronDown,
  Images,
  Award,
  CreditCard,
  Form,
} from "lucide-react";
import React, { useState, useEffect } from "react";

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
        { name: "Volunteers", href: "/admin/volunteers", icon: Users },
        { name: "Programs", href: "/admin/programs", icon: BookOpen },
        { name: "Events & Campaigns", href: "/admin/events", icon: Calendar },
        { name: "Registrations", href: "/admin/registrations", icon: Form },
        { name: "Donations", href: "/admin/donations", icon: Heart },
        { name: "Gallery", href: "/admin/gallery", icon: Images },
        { name: "Certificates", href: "/admin/certificates", icon: Gift },
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
        {
          name: "Dashboard",
          href: "/volunteer",
          icon: LayoutDashboard,
        },
        {
          name: "Assigned Programs",
          href: "/volunteer/programs",
          icon: BookOpen,
        },
        {
          name: "Events & Campaigns",
          href: "/volunteer/activities",
          icon: Calendar,
        },
        {
          name: "Certificates",
          href: "/volunteer/certificates",
          icon: Gift,
        },
        {
          name: "Messages",
          href: "/volunteer/messages",
          icon: Heart,
        },
      ]
    };
  } else if (pathname?.startsWith("/user")) {
    return {
      id: "user",
      badgeTitle: "USER PORTAL",
      badgeSubtitle: "Community Member",
      icon: User,

      accentColor: "#3B82F6",
      accentBg: "bg-blue-50",
      accentBgHover: "hover:bg-blue-50",
      accentBgActive: "bg-[#3B82F6]",
      accentText: "text-[#3B82F6]",
      accentTextHover: "hover:text-[#3B82F6]",
      accentBorder: "border-[#3B82F6]",
      accentBorderHover: "hover:border-[#3b82f6]",

      buttonShadow:
        "shadow-[0_8px_20px_rgba(59,130,246,0.25)]",

      indicatorColor: "bg-blue-500",
      badgeBorder: "border-blue-100",

      links: [
        {
          name: "Dashboard",
          href: "/user",
          icon: LayoutDashboard,
        },

        {
          name: "Programs",
          href: "/user/programs",
          icon: BookOpen,
        },

        {
          name: "Events & Campaigns",
          href: "/user/eventcamp",
          icon: Calendar,
        },

        {
          name: "Gallery",
          href: "/user/gallery",
          icon: Images,
        },

        {
          name: "Certificates",
          href: "/user/certificates",
          icon: Award,
        },

        {
          name: "Donations",
          href: "/user/donations",
          icon: CreditCard,
        },
      ],
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
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };
    fetchUser();
  }, []);

  const config = getRoleConfig(pathname);
  const Icon = config.icon;
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Logout failed");
      }

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout Error:", error);
      alert("Unable to logout. Please try again.");
    }
  };

  return (
    <div className="h-screen w-full bg-[#fafafa] font-sans flex flex-col text-gray-900 overflow-hidden">

      {/* --- TOP NAVBAR --- */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-6 py-4 shadow-sm h-[73px] shrink-0">
        {/* --- LOGO --- */}
        <Link href="/" className="flex items-center gap-3 group z-20">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#16a34a] to-green-400 flex items-center justify-center text-white font-extrabold text-base shadow-md group-hover:rotate-12 transition-transform">
            N
          </div>
          <span className="font-extrabold text-xl tracking-tight text-gray-900 drop-shadow-sm hidden sm:block">
            Nishkam<span className="text-[#f97316]">NGO</span>
          </span>
        </Link>

        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 focus:outline-none"
          >
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-bold text-gray-900">{user?.name || "User"}</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{user?.role || "GUEST"}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#16a34a] to-[#3BAF4A] flex items-center justify-center text-white shadow-md">
              <User className="w-5 h-5" />
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
              >
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <p className="text-sm font-extrabold text-gray-900 truncate">{user?.name || "User Name"}</p>
                  <p className="text-xs font-bold text-gray-500 truncate">{user?.email || "user@example.com"}</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">
                    {user?.role || "ROLE"}
                  </span>
                </div>
                <div className="p-2 flex flex-col gap-1">
                  <Link
                    href="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <Link
                    href={user?.role ? `/${user.role.toLowerCase()}` : "/"}
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* --- SIDEBAR --- */}
        <motion.aside
          initial={{ width: 280 }}
          animate={{ width: isSidebarOpen ? 280 : 88 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="hidden md:flex flex-col bg-white border-r border-gray-100 h-full z-40 shadow-[4px_0_24px_rgba(0,0,0,0.02)] relative flex-shrink-0"
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
                  <div className={`flex items-center gap-3 rounded-xl transition-all group relative ${isSidebarOpen ? 'px-3 py-3' : 'justify-center p-3'
                    } ${isActive
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

          {/* Footer Sidebar (Settings & Logout) */}
          <div className="p-4 border-t border-gray-50 shrink-0 flex flex-col gap-2">
            <Link href={['/admin', '/volunteer', '/user', '/finance', '/content'].find(p => pathname?.startsWith(p)) ? `${['/admin', '/volunteer', '/user', '/finance', '/content'].find(p => pathname?.startsWith(p))}/settings` : "/settings"}>
              <button
                className={`w-full flex items-center rounded-xl transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 ${isSidebarOpen ? "px-3 py-3 gap-3" : "justify-center p-3"
                  }`}
              >
                <Settings className="w-5 h-5 shrink-0" />
                {isSidebarOpen && (
                  <span className="text-[13px] font-bold">Settings</span>
                )}
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center rounded-xl transition-all duration-200 text-red-500 hover:bg-red-50 hover:text-red-600 ${isSidebarOpen ? "px-3 py-3 gap-3" : "justify-center p-3"
                }`}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {isSidebarOpen && (
                <span className="text-[13px] font-bold">Logout</span>
              )}
            </button>
          </div>
        </motion.aside>

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
                <path d="M21.5 2.5L9.5 13.5L9.5 19L12 16Z" fill={config.accentColor} opacity="0.6" />
              </svg>
            </motion.div>

            {/* Animated Floating Element 2 (Bottom Left) */}
            <motion.div
              animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-[20%] left-[5%] opacity-30 mix-blend-multiply"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform -rotate-45">
                <path d="M22 2L11 13" stroke={config.accentColor} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" fill={config.accentColor} stroke={config.accentColor} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>

          </div>

          {/* Children wrapped in relative z-10 to stay above motifs */}
          <div className="relative z-10 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full min-h-full">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}