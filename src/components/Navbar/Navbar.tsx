"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, Menu, X, ChevronDown, User, LayoutDashboard, LogOut } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

type NavLink = {
  name: string;
  href: string;
  dropdown?: { name: string; href: string }[];
};

const navLinks: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar({ user = null }: { user?: any }) {
  const [activeTab, setActiveTab] = useState("Home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

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

  // Determine if on a page that uses the transparent reference style
  const isReferencePage = ['/', '/about', '/gallery', '/contact'].includes(pathname);

  // --- Common Components (for placement) ---
  const desktopLinks = (
    <div className="flex items-center gap-1 relative z-20">
      {navLinks.map((link) => (
        <div
          key={link.name}
          className="relative group"
          onMouseEnter={() => link.dropdown && setActiveDropdown(link.name)}
          onMouseLeave={() => link.dropdown && setActiveDropdown(null)}
        >
          <Link
            href={link.href}
            onClick={() => setActiveTab(link.name)}
            className={`relative z-10 flex items-center gap-1 px-5 py-2.5 rounded-full text-[14px] font-bold transition-colors duration-300 ${
              activeTab === link.name
                ? "text-green-700"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {link.name}
            {link.dropdown && (
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180 ${activeTab === link.name ? 'text-green-700' : 'text-gray-400'}`} />
            )}
          </Link>

          {/* Sliding White Pill Background */}
          {activeTab === link.name && (
            <motion.div
              layoutId="activeTab"
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="absolute inset-0 bg-white rounded-full z-0 shadow-sm border border-gray-100"
            />
          )}

          {/* Dropdown Menu */}
          {link.dropdown && (
            <AnimatePresence>
              {activeDropdown === link.name && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 bg-white/95 backdrop-blur-xl rounded-[1.5rem] shadow-[0_10px_40px_rgb(0,0,0,0.1)] border border-gray-100 overflow-hidden z-50 p-2"
                >
                  {link.dropdown.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setActiveTab(link.name)}
                      className="block px-4 py-3 text-[13px] font-bold text-gray-600 hover:bg-green-50 hover:text-[#16a34a] rounded-[1rem] transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      ))}
    </div>
  );

  const desktopActions = (
    <div className="flex items-center gap-5">
      {user ? (
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
                    href={
                      user?.role === "SUPER_ADMIN"
                        ? "/superadmin"
                        : user?.role
                          ? `/${user.role.toLowerCase()}`
                          : "/dashboard"
                    }
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <Link href="/login" className="flex items-center gap-2 font-bold text-gray-500 hover:text-green-600 transition-colors px-3 text-sm bg-white/80 py-2 rounded-full backdrop-blur-sm">
          <User className="w-4 h-4" />
          Login
        </Link>
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-[#f97316] hover:bg-[#ea580c] flex items-center gap-2 px-7 py-3 rounded-full font-bold text-sm text-white shadow-[0_8px_20px_rgba(249,115,22,0.3)] transition-all"
      >
        <Heart className="w-4 h-4 fill-current" />
        Donate
      </motion.button>
    </div>
  );

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`transition-all duration-300 z-[60] ${mobileMenuOpen ? 'fixed top-0' : 'sticky top-0'} w-full left-0 px-6 py-4 lg:px-10 ${
          isReferencePage 
            ? 'bg-transparent' // Transparent wrapper for reference pages
            : 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm' // Standard background for other pages
        }`}
      >
        <div className="max-w-[1600px] mx-auto flex items-center justify-between relative">

          {/* --- LOGO --- */}
          <Link href="/" onClick={() => setActiveTab("Home")} className="flex items-center gap-3 group z-20 pl-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#16a34a] to-green-400 flex items-center justify-center text-white font-extrabold text-base shadow-lg shadow-green-500/30 group-hover:rotate-12 transition-transform">
              N
            </div>
            <span className={`font-extrabold text-xl tracking-tight drop-shadow-sm ${isReferencePage ? 'text-white' : 'text-gray-900'}`}>
              Nishkam<span className="text-[#f97316]">NGO</span>
            </span>
          </Link>

          {/* --- CENTERED PILL FOR NAV LINKS --- */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center z-20">
            <div className={`rounded-full px-2 py-1.5 flex items-center gap-1 relative ${
              isReferencePage
                ? 'bg-white shadow-md' // Solid white pill on transparent background
                : 'bg-gray-50/80 border border-gray-100 shadow-inner' // Standard nested pill style
            }`}>
                {desktopLinks}
            </div>
          </div>

          {/* --- RIGHT ACTIONS --- */}
          <div className="hidden lg:flex items-center z-20 pr-1">
            {desktopActions}
          </div>

          {/* --- MOBILE MENU TOGGLE --- */}
          <button
            className="lg:hidden p-2 text-gray-800 z-20 hover:bg-gray-100 rounded-full transition-colors bg-white/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </motion.nav>

      {/* --- MOBILE MENU OVERLAY --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Dark Blurred Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
            />

            {/* Sliding White Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-[70] shadow-2xl flex flex-col overflow-y-auto rounded-l-[2rem]"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <span className="font-extrabold text-xl text-gray-900 tracking-tight">
                  Nishkam<span className="text-[#f97316]">NGO</span>
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="flex-1 py-6 px-6 flex flex-col gap-6">
                {/* Mobile Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-full py-3.5 px-5 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium text-sm"
                  />
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>

                {/* Mobile Links */}
                <div className="flex flex-col gap-2 mt-2">
                  {navLinks.map((link) => (
                    <div key={link.name} className="flex flex-col">
                      <Link
                        href={link.href}
                        onClick={() => {
                          setActiveTab(link.name);
                          setMobileMenuOpen(false);
                        }}
                        className={`text-[15px] font-bold transition-colors block py-3 px-4 rounded-[1.2rem] ${
                          activeTab === link.name ? "bg-green-50 text-[#16a34a]" : "text-gray-700 hover:bg-gray-50 hover:text-[#16a34a]"
                        }`}
                      >
                        {link.name}
                      </Link>

                      {/* Mobile Dropdown items */}
                      {link.dropdown && (
                        <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-green-100 pl-4 py-2">
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              onClick={() => {
                                setActiveTab(link.name);
                                setMobileMenuOpen(false);
                              }}
                              className="text-gray-500 hover:text-[#16a34a] font-semibold text-sm block py-2.5 px-4 rounded-xl hover:bg-green-50/50 transition-colors"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Bottom Actions */}
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col gap-5 rounded-bl-[2rem]">
                <div className="flex justify-between items-center px-2">
                  <Link href="#contact" onClick={() => setMobileMenuOpen(false)} className="font-bold text-sm text-gray-600 hover:text-green-600 transition-colors">Contact Us</Link>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="font-bold text-sm text-gray-600 hover:text-green-600 transition-colors">Login</Link>
                </div>
                <button className="bg-[#f97316] w-full flex items-center justify-center gap-2 py-4 rounded-full font-bold shadow-[0_8px_20px_rgba(249,115,22,0.25)] text-white hover:bg-[#ea580c] transition-colors">
                  <Heart className="w-5 h-5 fill-current" />
                  Donate Now
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}