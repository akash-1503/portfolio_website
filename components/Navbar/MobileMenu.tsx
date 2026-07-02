"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Search } from "lucide-react";
import Link from "next/link";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: any[];
}

export default function MobileMenu({ isOpen, onClose, links }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-white z-[70] shadow-2xl flex flex-col overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <span className="font-bold text-xl">
                Empower<span className="text-primary">NGO</span>
              </span>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="flex-1 py-6 px-6 flex flex-col gap-6">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full bg-gray-100 rounded-full py-3 px-5 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>

              <div className="flex flex-col gap-4">
                {links.map((link) => (
                  <div key={link.name}>
                    <Link 
                      href={link.href}
                      onClick={onClose}
                      className="text-lg font-medium text-gray-800 hover:text-primary transition-colors block py-2"
                    >
                      {link.name}
                    </Link>
                    {link.dropdown && (
                      <div className="ml-4 mt-2 flex flex-col gap-3 border-l-2 border-gray-100 pl-4">
                        {link.dropdown.map((item: any) => (
                          <Link 
                            key={item.name}
                            href={item.href}
                            onClick={onClose}
                            className="text-gray-600 hover:text-primary block"
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

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <Link href="#contact" onClick={onClose} className="font-medium text-gray-700">Contact Us</Link>
                <Link href="#login" onClick={onClose} className="font-medium text-gray-700">Login</Link>
              </div>
              <button className="gradient-bg w-full flex items-center justify-center gap-2 py-3 rounded-full font-bold shadow-md shadow-orange/30">
                <Heart className="w-5 h-5" />
                Donate Now
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
