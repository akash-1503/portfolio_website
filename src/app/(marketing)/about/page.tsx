"use client";

import { motion } from "framer-motion";
import {
  Target,
  Globe,
  CheckCircle2,
  BookOpen,
  Users,
  HandHeart,
  Flag,
  Calendar,
  HeartHandshake,
  ShieldCheck,
  Sun,
  Recycle,
  Search,
  PenTool,
  Rocket,
  Heart,
  ArrowRight
} from "lucide-react";

export default function AboutPage() {
  // Reusable animation variants for scroll reveals
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] flex flex-col relative overflow-hidden font-sans text-gray-800">
      
      {/* --- BACKGROUND GRAPHICS & CRAFTS (FIXED FOR SCROLL DEPTH) --- */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
        
        {/* Subtle Ambient Orbs */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-green-200 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-slate-200 rounded-full blur-[120px]"
        />

        {/* Professional Dotted Trail */}
        <svg className="absolute w-full h-full z-0 pointer-events-none" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <path
            d="M -50 1050 Q 450 550 1050 -50"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="1.5"
            strokeDasharray="6 6"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>

        {/* Flying Orange Paper Craft */}
        <motion.div
          animate={{ y: [0, -12, 0], x: [0, 12, 0], rotate: [15, 20, 15] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] left-[4%] lg:left-[8%]"
        >
          <svg width="45" height="45" viewBox="0 0 24 24" fill="none" className="drop-shadow-xl transform rotate-[-20deg] opacity-70">
            <path d="M21.5 2.5L2 10.5L9.5 13.5L21.5 2.5Z" fill="#fb923c" stroke="#ea580c" strokeWidth="0.5" />
            <path d="M21.5 2.5L14.5 22L9.5 13.5L21.5 2.5Z" fill="#f97316" stroke="#ea580c" strokeWidth="0.5" />
            <path d="M21.5 2.5L9.5 13.5L9.5 19L12 16Z" fill="#c2410c" />
          </svg>
        </motion.div>

        {/* Small Green Accent Craft */}
        <motion.div
          animate={{ y: [0, 10, 0], rotate: [45, 40, 45] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[20%] right-[5%] lg:right-[8%]"
        >
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none" className="drop-shadow-md opacity-60">
            <path d="M22 2L11 13" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" fill="#22c55e" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </div>

      {/* --- PAGE CONTENT (SCROLLABLE) --- */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-10 space-y-24 md:space-y-32">
        
        {/* 1. ABOUT HERO SECTION */}
        <motion.section 
          initial="hidden" animate="visible" variants={staggerContainer}
          className="text-center pt-10 md:pt-20 max-w-4xl mx-auto"
        >
          
          <motion.h1 variants={fadeUpVariant} className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 mb-6 leading-tight">
            Empowering Communities. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16A34A] to-green-500">
              Creating Meaningful Change.
            </span>
          </motion.h1>
          <motion.p variants={fadeUpVariant} className="text-base md:text-lg text-gray-600 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
            We are dedicated to building a sustainable future by uplifting those in need, fostering education, and cultivating a community of compassion and action.
          </motion.p>
          <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-8 py-3.5 bg-[#16A34A] hover:bg-[#15803d] text-white font-bold rounded-xl shadow-[0_4px_12px_rgba(22,163,74,0.25)] transition-all flex items-center justify-center gap-2 group">
              Our Mission
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button className="w-full sm:w-auto px-8 py-3.5 bg-white/80 backdrop-blur-sm text-gray-800 hover:text-[#16A34A] border border-gray-200 hover:border-green-300 hover:bg-green-50/50 font-bold rounded-xl shadow-sm transition-all flex items-center justify-center">
              Get Involved
            </button>
          </motion.div>
        </motion.section>

        {/* 2. WHO WE ARE */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Image Placeholder */}
          <motion.div variants={fadeUpVariant} className="relative w-full aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-4 border-white/80 backdrop-blur-sm bg-white/40 group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-gray-100 flex items-center justify-center">
              <Users className="w-20 h-20 text-green-600/20 group-hover:scale-110 transition-transform duration-500" />
              <p className="absolute bottom-6 text-sm font-bold text-gray-400">Replace with your image</p>
            </div>
          </motion.div>
          
          {/* Text Content */}
          <motion.div variants={fadeUpVariant} className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Who We Are</h2>
            <p className="text-gray-600 leading-relaxed font-medium">
              We are a collective of passionate individuals, volunteers, and community leaders driven by a shared goal: making a tangible difference. Our organization serves as a bridge between resources and those who need them most, operating with complete transparency and dedication.
            </p>
            <div className="space-y-4 pt-2">
              {['Community First Approach', 'Compassion in Action', 'Measurable Impact'].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-[#16A34A]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-gray-800">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* 3. MISSION & VISION */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
        >
          {/* Mission Card */}
          <motion.div variants={fadeUpVariant} className="bg-white/80 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-8 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-orange-300 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-orange-50 rounded-full blur-2xl group-hover:bg-orange-100 transition-colors"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-orange-100/80 border border-orange-200 flex items-center justify-center mb-6 text-orange-600 shadow-sm">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 font-medium leading-relaxed">
                To empower underprivileged communities by providing access to quality education, essential resources, and sustainable development programs that foster long-term independence and growth.
              </p>
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div variants={fadeUpVariant} className="bg-white/80 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-8 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-blue-300 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-50 rounded-full blur-2xl group-hover:bg-blue-100 transition-colors"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-blue-100/80 border border-blue-200 flex items-center justify-center mb-6 text-blue-600 shadow-sm">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 font-medium leading-relaxed">
                A world where every individual, regardless of their background, has the opportunity to thrive, contribute to society, and live with dignity in a compassionate and sustainable environment.
              </p>
            </div>
          </motion.div>
        </motion.section>

        {/* 4. WHAT WE DO */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4">What We Do</h2>
            <p className="text-gray-600 font-medium max-w-2xl mx-auto">Core pillars of our organizational activities.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
            {[
              { icon: BookOpen, title: "Education", color: "text-blue-600", bg: "bg-blue-100/70", border: "border-blue-200/50" },
              { icon: Users, title: "Community", color: "text-purple-600", bg: "bg-purple-100/70", border: "border-purple-200/50" },
              { icon: HandHeart, title: "Volunteers", color: "text-green-600", bg: "bg-green-100/70", border: "border-green-200/50" },
              { icon: Flag, title: "Campaigns", color: "text-red-600", bg: "bg-red-100/70", border: "border-red-200/50" },
              { icon: Calendar, title: "Events", color: "text-yellow-600", bg: "bg-yellow-100/70", border: "border-yellow-200/50" },
              { icon: HeartHandshake, title: "Support", color: "text-teal-600", bg: "bg-teal-100/70", border: "border-teal-200/50" },
            ].map((item, idx) => (
              <motion.div key={idx} variants={fadeUpVariant} className="bg-white/70 backdrop-blur-md border border-gray-200/80 rounded-2xl p-6 flex flex-col items-center text-center hover:bg-white hover:border-[#16A34A]/30 hover:shadow-[0_10px_30px_rgba(22,163,74,0.08)] transition-all duration-300 group">
                <div className={`w-14 h-14 rounded-xl border flex items-center justify-center mb-4 ${item.bg} ${item.border} ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">{item.title}</h3>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 5. OUR VALUES */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4">Our Values</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {[
              { icon: Heart, label: "Compassion" },
              { icon: ShieldCheck, label: "Integrity" },
              { icon: Users, label: "Inclusion" },
              { icon: Sun, label: "Transparency" },
              { icon: Recycle, label: "Sustainability" }
            ].map((value, idx) => (
              <motion.div key={idx} variants={fadeUpVariant} className="flex items-center gap-2.5 bg-white/80 backdrop-blur-md px-5 py-3 rounded-full border border-gray-200/80 shadow-[0_4px_10px_rgba(0,0,0,0.02)] hover:border-[#16A34A] hover:text-[#16A34A] hover:shadow-md transition-all cursor-default group">
                <value.icon className="w-4 h-4 text-[#16A34A] group-hover:scale-110 transition-transform" />
                <span className="font-bold text-gray-700 group-hover:text-[#16A34A] text-sm transition-colors">{value.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 6. HOW WE CREATE IMPACT */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4">How We Create Impact</h2>
            <p className="text-gray-600 font-medium max-w-2xl mx-auto">Our four-step methodology ensures efficiency and transparency.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting Line for Desktop */}
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-gray-200 via-[#16A34A]/40 to-gray-200 z-0"></div>

            {[
              { num: "01", title: "Discover", icon: Search, desc: "Identifying community needs." },
              { num: "02", title: "Plan", icon: PenTool, desc: "Strategizing solutions." },
              { num: "03", title: "Act", icon: Rocket, desc: "Executing on the ground." },
              { num: "04", title: "Impact", icon: CheckCircle2, desc: "Measuring outcomes." },
            ].map((step, idx) => (
              <motion.div key={idx} variants={fadeUpVariant} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-white border-2 border-gray-200 shadow-md flex items-center justify-center text-gray-500 mb-4 group-hover:border-[#16A34A] group-hover:text-[#16A34A] group-hover:-translate-y-1 transition-all duration-300">
                  <step.icon className="w-7 h-7" />
                </div>
                <div className="text-xs font-extrabold text-[#16A34A] tracking-widest mb-1">{step.num}</div>
                <h3 className="text-lg font-black text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 font-medium">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 7. CTA SECTION */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUpVariant}
          className="relative bg-gradient-to-br from-[#16A34A] to-[#15803d] rounded-[2.5rem] p-10 md:p-16 text-center overflow-hidden shadow-[0_20px_40px_rgba(22,163,74,0.2)]"
        >
          {/* Decorative CTA Background Elements */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black opacity-10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
              Be Part of the Change
            </h2>
            <p className="text-green-50 text-base md:text-lg font-medium mb-8">
              Whether you want to donate your time, skills, or resources, there is a place for you in our community. Join us today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-[#16A34A] font-black rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                Volunteer Now
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white/60 text-white hover:bg-white/10 hover:border-white font-bold rounded-xl transition-all">
                Support Us
              </button>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}