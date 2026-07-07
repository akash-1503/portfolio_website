"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Send, Mail, Phone, MapPin, Globe, MessageCircle, ChevronRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#fafafa] border-t border-gray-100 pt-24 pb-8 relative overflow-hidden text-gray-800">
      
      {/* --- BACKGROUND THEME ELEMENTS (Craft & Dotted Line) --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
        {/* Sweeping Green Dotted Trail */}
        <svg className="absolute w-full h-full opacity-30 top-0 left-0" viewBox="0 0 1200 400" preserveAspectRatio="none">
          <path 
            d="M -100 350 C 200 400, 400 50, 800 150 C 1000 200, 1100 50, 1300 100" 
            fill="none" 
            stroke="#16a34a" 
            strokeWidth="2" 
            strokeDasharray="6 8" 
            strokeLinecap="round"
          />
        </svg>

        {/* Animated Green Paper Airplane */}
        <motion.div
          animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[20%] left-[5%] opacity-60"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform -rotate-12">
            <path d="M22 2L11 13" stroke="#16a34a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" fill="#22c55e" stroke="#16a34a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>

        {/* Animated Orange Paper Airplane */}
        <motion.div
          animate={{
            y: [-10, 10, -10],
            x: [-5, 5, -5],
            rotate: [-2, 2, -2],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[15%] right-[8%] opacity-80"
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg transform rotate-12">
            <path d="M21.5 2.5L2 10.5L9.5 13.5L21.5 2.5Z" fill="#fb923c" stroke="#ea580c" strokeWidth="0.5"/>
            <path d="M21.5 2.5L14.5 22L9.5 13.5L21.5 2.5Z" fill="#f97316" stroke="#ea580c" strokeWidth="0.5"/>
            <path d="M21.5 2.5L9.5 13.5L9.5 19L12 16Z" fill="#c2410c"/>
          </svg>
        </motion.div>
      </div>

      {/* --- FOOTER CONTENT --- */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Desc */}
          <div className="flex flex-col gap-6 lg:pr-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#16a34a] to-green-400 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-green-500/30 group-hover:rotate-12 transition-transform">
                N
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-gray-900 drop-shadow-sm">
                Nishkam<span className="text-[#f97316]">NGO</span>
              </span>
            </Link>
            <p className="text-gray-500 font-medium text-sm leading-relaxed">
              We are a non-profit organization dedicated to empowering communities and creating sustainable futures for those in need. Serve selflessly, empower lives.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 hover:bg-[#16a34a] hover:text-white hover:border-[#16a34a] hover:-translate-y-1 transition-all duration-300">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 hover:bg-[#16a34a] hover:text-white hover:border-[#16a34a] hover:-translate-y-1 transition-all duration-300">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-8">
            <h4 className="text-lg font-extrabold text-gray-900 mb-6">Quick Links</h4>
            <ul className="flex flex-col gap-4">
              {[
                { name: "About Us", href: "#about" },
                { name: "Our Programs", href: "#programs" },
                { name: "Get Involved", href: "#involved" },
                { name: "News & Media", href: "#media" },
                { name: "Contact Us", href: "#contact" }
              ].map((link, i) => (
                <li key={i}>
                  <Link 
                    href={link.href} 
                    className="text-sm font-bold text-gray-500 hover:text-[#f97316] transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#f97316] group-hover:translate-x-1 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-extrabold text-gray-900 mb-6">Contact Us</h4>
            <ul className="flex flex-col gap-5">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0 mt-0.5 text-[#16a34a]">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-gray-500 leading-relaxed mt-1.5">
                  123 NGO Street, Cityville,<br /> State 12345, Country
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0 text-[#16a34a]">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-gray-500">+1 234 567 8900</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0 text-[#16a34a]">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-gray-500">info@nishkamngo.org</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-extrabold text-gray-900 mb-6">Newsletter</h4>
            <p className="text-sm font-bold text-gray-500 mb-4 leading-relaxed">
              Subscribe to our newsletter to get the latest impact updates.
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all shadow-sm hover:bg-gray-50/50"
                />
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#f97316] hover:bg-[#ea580c] text-white flex items-center justify-center gap-2 py-3.5 rounded-[1.2rem] font-bold shadow-[0_8px_20px_rgba(249,115,22,0.25)] transition-all text-sm"
              >
                Subscribe <Send className="w-4 h-4" />
              </motion.button>
            </form>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-[13px] font-bold">
            &copy; {new Date().getFullYear()} Nishkam Samarpan Foundation. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6 text-[13px] font-bold text-gray-400">
            <Link href="#" className="hover:text-[#16a34a] transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-[#16a34a] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>  
    </footer>
  );
}