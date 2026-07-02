"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const partners = [
  "Partner 1", "Partner 2", "Partner 3", "Partner 4", "Partner 5", "Partner 6"
];

export default function Partners() {
  return (
    <section className="py-16 bg-white overflow-hidden border-t border-gray-100">
      <div className="container mx-auto px-4 mb-8 text-center">
        <h3 className="text-gray-500 font-semibold uppercase tracking-widest text-sm">Our Trusted Partners</h3>
      </div>
      
      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-16 py-4 group-hover:[animation-play-state:paused]">
          {[...partners, ...partners, ...partners].map((partner, index) => (
            <div 
              key={index} 
              className="mx-8 w-40 h-16 relative flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 cursor-pointer"
            >
              {/* Using text placeholder since logo images aren't provided */}
              <div className="text-2xl font-bold text-gray-400 whitespace-nowrap">{partner}</div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </section>
  );
}
