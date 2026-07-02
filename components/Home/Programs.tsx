"use client";

import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { BookOpen, HeartPulse, Leaf, User, ShieldAlert, ArrowRight } from "lucide-react";

const programs = [
  {
    id: 1,
    title: "Education for All",
    desc: "Providing quality education and resources to underprivileged children.",
    icon: BookOpen,
    image: "/image.png",
    themeColor: "text-green-600",
    borderColor: "border-green-600",
    iconBg: "bg-green-600"
  },
  {
    id: 2,
    title: "Healthcare Support",
    desc: "Organizing health camps and providing medical aid to those in need.",
    icon: HeartPulse,
    image: "/image.png",
    themeColor: "text-orange-500",
    borderColor: "border-orange-500",
    iconBg: "bg-orange-500"
  },
  {
    id: 3,
    title: "Environment Care",
    desc: "Promoting a clean, green, and sustainable environment for future generations.",
    icon: Leaf,
    image: "/image.png",
    themeColor: "text-green-500",
    borderColor: "border-green-500",
    iconBg: "bg-green-500"
  },
  {
    id: 4,
    title: "Women Empowerment",
    desc: "Skill development and empowerment programs for women and girls.",
    icon: User,
    image: "/image.png",
    themeColor: "text-orange-500",
    borderColor: "border-orange-500",
    iconBg: "bg-orange-500"
  },
  {
    id: 5,
    title: "Disaster Relief",
    desc: "Providing immediate relief and rehabilitation during natural disasters.",
    icon: ShieldAlert,
    image: "/image.png",
    themeColor: "text-green-600",
    borderColor: "border-green-600",
    iconBg: "bg-green-600"
  }
];

export default function Programs() {
  return (
    <section id="programs" className="relative py-24 bg-[#fafafa] overflow-hidden">
      
      {/* 1. CUSTOM SWIPER ARROW CSS (Matches the white circles in the image) */}
      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          background-color: #ffffff;
          width: 46px !important;
          height: 46px !important;
          border-radius: 50%;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          border: 1px solid #f3f4f6;
        }
        .swiper-button-next::after,
        .swiper-button-prev::after {
          font-size: 16px !important;
          color: #4b5563 !important;
          font-weight: 800 !important;
        }
        .swiper-button-disabled {
          opacity: 0.3 !important;
        }
      `}</style>

      {/* Background Organic Curve */}
      <div className="absolute top-0 left-0 w-full h-64 bg-white rounded-br-[100%] z-0 pointer-events-none opacity-60"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-[1400px]">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-green-600 font-extrabold tracking-widest uppercase text-[10px] mb-2 block"
          >
            WHAT WE DO
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-extrabold text-gray-900 flex flex-col items-center gap-1"
          >
            Our Programs
            <svg width="40" height="8" viewBox="0 0 40 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-1">
              <path d="M2 6C6.5 6 9.5 2 14 2C18.5 2 21.5 6 26 6C30.5 6 33.5 2 38 2" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.h2>
        </div>

        {/* Carousel Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative px-2 md:px-12" // Added padding so arrows sit outside cards
        >
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              900: { slidesPerView: 3 },
              1200: { slidesPerView: 4 }, // Shows 4 cards like the image
            }}
            navigation // Enables the custom styled arrows
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            className="pb-12"
          >
            {programs.map((program) => (
              <SwiperSlide key={program.id} className="py-4">
                <div className="bg-white rounded-[1.5rem] p-3 shadow-sm hover:shadow-md border border-gray-100 group hover:-translate-y-2 transition-all duration-300 h-full flex flex-col cursor-pointer">
                  
                  {/* Card Image Wrapper */}
                  <div className="relative">
                    <div className="relative h-44 w-full rounded-[1.2rem] overflow-hidden">
                      <Image 
                        src={program.image}
                        alt={program.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    {/* Overlapping Icon */}
                    <div className="absolute -bottom-5 left-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md border-4 border-white z-10">
                      <div className={`w-full h-full rounded-full flex items-center justify-center ${program.iconBg}`}>
                         <program.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Card Content Wrapper */}
                  <div className="pt-8 pb-3 px-3 flex flex-col flex-grow">
                    <h3 className="text-[1.1rem] font-bold text-gray-900 mb-2 leading-tight">
                      {program.title}
                    </h3>
                    <p className="text-gray-500 text-[13px] leading-relaxed flex-grow">
                      {program.desc}
                    </p>
                    
                    {/* Card Inner Arrow Outline */}
                    <button 
                      suppressHydrationWarning
                      className={`w-7 h-7 rounded-full border-[1.5px] ${program.borderColor} flex items-center justify-center mt-4 transition-colors group-hover:bg-gray-50`}
                    >
                      <ArrowRight className={`w-3.5 h-3.5 ${program.themeColor}`} />
                    </button>
                  </div>

                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>

      {/* --- 2. ANIMATED PAPER AIRPLANE (Yellow Craft + Green Trail) --- */}
      <div className="absolute bottom-12 right-2 md:right-12 w-48 h-32 z-20 pointer-events-none hidden lg:block">
        
        {/* Wavy Dotted Green Trail */}
        <svg className="absolute bottom-4 right-14 w-32 h-16 opacity-60" viewBox="0 0 100 50">
          <path 
            d="M 0 45 Q 40 50 80 15" 
            fill="none" 
            stroke="#22c55e" 
            strokeWidth="2" 
            strokeDasharray="6 4" 
            strokeLinecap="round"
          />
        </svg>

        {/* Flying Yellow Craft */}
        <motion.div
          animate={{
            y: [0, -8, 4, 0],
            x: [0, 4, -2, 0],
            rotate: [0, -2, 2, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-2 right-0"
        >
          {/* Custom SVG designed to look like the yellow folded paper airplane */}
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md transform rotate-12">
            {/* Top Light Yellow Fold */}
            <path d="M21.5 2.5L2 10.5L9.5 13.5L21.5 2.5Z" fill="#FDE047" stroke="#EAB308" strokeWidth="0.5"/>
            {/* Main Yellow Body */}
            <path d="M21.5 2.5L14.5 22L9.5 13.5L21.5 2.5Z" fill="#FACC15" stroke="#EAB308" strokeWidth="0.5"/>
            {/* Bottom Dark Fold (Creates depth) */}
            <path d="M21.5 2.5L9.5 13.5L9.5 19L12 16Z" fill="#EAB308"/>
          </svg>
        </motion.div>
      </div>

    </section>
  );
}