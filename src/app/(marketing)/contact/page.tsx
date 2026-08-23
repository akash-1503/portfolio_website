"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Mail,
  MapPin,
  PhoneCall,
  Clock,
  User,
  MessageSquare,
  Loader2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";


export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <div className="w-full min-h-[100dvh] bg-[#f8fafc] flex flex-col relative overflow-x-hidden font-sans text-gray-800">
      
      {/* --- BACKGROUND GRAPHICS --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
        {/* Subtle Ambient Orbs */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-5%] w-[450px] h-[450px] bg-green-200 rounded-full blur-[90px]"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-slate-200 rounded-full blur-[100px]"
        />

        {/* SUBTLE PROFESSIONAL DOTTED TRAIL */}
        <svg className="absolute w-full h-full z-0 pointer-events-none" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <path
            d="M -50 1050 Q 450 550 1050 -50"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="1.5"
            strokeDasharray="6 6"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>

        {/* Flying Orange Paper Craft */}
        <motion.div
          animate={{ y: [0, -12, 0], x: [0, 12, 0], rotate: [15, 20, 15] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[12%] left-[4%] lg:left-[8%]"
        >
          <svg width="35" height="35" viewBox="0 0 24 24" fill="none" className="drop-shadow-xl transform rotate-[-20deg] opacity-80">
            <path d="M21.5 2.5L2 10.5L9.5 13.5L21.5 2.5Z" fill="#fb923c" stroke="#ea580c" strokeWidth="0.5" />
            <path d="M21.5 2.5L14.5 22L9.5 13.5L21.5 2.5Z" fill="#f97316" stroke="#ea580c" strokeWidth="0.5" />
            <path d="M21.5 2.5L9.5 13.5L9.5 19L12 16Z" fill="#c2410c" />
          </svg>
        </motion.div>

        {/* Small Green Accent Craft */}
        <motion.div
          animate={{ y: [0, 10, 0], rotate: [45, 40, 45] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[8%] right-[5%] lg:right-[8%]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="drop-shadow-md opacity-70">
            <path d="M22 2L11 13" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" fill="#22c55e" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </div>

      {/* CONTAINER CONTENT */}
      <motion.div
  className="relative z-10 mx-auto w-full max-w-6xl px-4 pt-6 pb-10 sm:px-6 lg:px-8"
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
        {/* HEADER SECTION - COMPACT */}
        <motion.div variants={itemVariants} className="text-center max-w-3xl mx-auto mb-6 lg:mb-8">
          
          <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl lg:text-5xl mb-3">
            We'd love to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16A34A] to-green-600">hear from you</span>
          </h1>
          <p className="text-sm sm:text-base font-medium text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Have a question, want to volunteer, or support our mission? Send us a message.
          </p>
        </motion.div>

        {/* TWO COLUMN GRID LAYOUT - CENTERED AND COMPACT */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: GET IN TOUCH */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-3">
            <div className="mb-2 hidden lg:block">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Get in Touch</h2>
              <p className="text-xs text-gray-500 font-medium">Reach out directly via our channels.</p>
            </div>

            {/* Address Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-[0_5px_15px_rgb(0,0,0,0.02)] hover:border-green-300 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100/70 border border-orange-200/60 text-[#F97316]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-0.5">📍 Address</h3>
                  <p className="text-xs font-medium text-gray-600 leading-snug">
                    123 Hope Avenue, Impact District<br />
                    Chikhli, Maharashtra 443201
                  </p>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-[0_5px_15px_rgb(0,0,0,0.02)] hover:border-green-300 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100/70 border border-green-200/60 text-[#16A34A]">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-0.5">✉ Email</h3>
                  <a href="mailto:contact@edudiagnox.org" className="text-xs font-bold text-gray-600 hover:text-[#16A34A] transition-colors">
                    contact@edudiagnox.org
                  </a>
                </div>
              </div>
            </div>

            {/* Phone Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-[0_5px_15px_rgb(0,0,0,0.02)] hover:border-green-300 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100/70 border border-blue-200/60 text-blue-600">
                  <PhoneCall className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-0.5">📞 Phone</h3>
                  <a href="tel:+919876543210" className="text-xs font-bold text-gray-600 hover:text-blue-600 transition-colors">
                    +91 98765 43210
                  </a>
                </div>
              </div>
            </div>

            {/* Office Hours Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-[0_5px_15px_rgb(0,0,0,0.02)] hover:border-green-300 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100/70 border border-purple-200/60 text-purple-600">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-0.5">🕐 Office Hours</h3>
                  <p className="text-xs font-medium text-gray-600">Mon - Sat: 9:00 AM - 6:00 PM IST</p>
                </div>
              </div>
            </div>

          </motion.div>

          {/* RIGHT COLUMN: SEND US A MESSAGE FORM */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <div className="bg-white/90 backdrop-blur-2xl rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-[0_15px_40px_rgb(0,0,0,0.04)]">
              
              {isSubmitted ? (
                /* SUCCESS SUBMISSION STATE */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-10"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 border-4 border-green-100 mb-5">
                    <CheckCircle2 className="h-8 w-8 text-[#16A34A]" />
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-900 mb-2">Message Received!</h3>
                  <p className="text-sm text-gray-500 font-medium max-w-sm mx-auto mb-6">
                    Thank you for contacting us. Our team will read your message and respond shortly.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="inline-flex items-center justify-center rounded-xl bg-gray-100 px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                /* FORM INPUT STATE */
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="mb-1">
                    <h2 className="text-xl font-black text-gray-900">Send a Message</h2>
                  </div>

                  {/* Top Row: Name & Email for Desktop */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700">Full Name</label>
                      <div className="relative group">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#16A34A] transition-colors" />
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          className="w-full bg-gray-50/80 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Email Address */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700">Email Address</label>
                      <div className="relative group">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#16A34A] transition-colors" />
                        <input
                          type="email"
                          required
                          placeholder="name@example.com"
                          className="w-full bg-gray-50/80 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Subject</label>
                    <div className="relative group">
                      <MessageSquare className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#16A34A] transition-colors" />
                      <input
                        type="text"
                        required
                        placeholder="Volunteer query, Donation..."
                        className="w-full bg-gray-50/80 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Message</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Write your message here..."
                      className="w-full bg-gray-50/80 border border-gray-200 rounded-xl p-3.5 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] focus:bg-white transition-all resize-none"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    className="w-full mt-1 bg-[#16A34A] hover:bg-[#15803d] text-white font-bold py-3 rounded-xl shadow-[0_4px_12px_rgba(22,163,74,0.2)] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed group"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>

        </div>
      </motion.div>
    
    </div>
  );
}