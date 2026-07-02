"use client";

import Link from "next/link";
import { Send, Facebook, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-[#faf8ff] text-gray-800 pt-20 pb-8 font-sans z-0">
      
      {/* Background Graphic matching the image (Concentric purple waves on the right) */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] rounded-full bg-gradient-to-bl from-[#e0c3ff] via-[#f3e8ff] to-transparent opacity-60 blur-3xl"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full border-[40px] border-[#ecd4ff] opacity-40 translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full border-[60px] border-[#f5ebff] opacity-40 translate-x-1/3 -translate-y-1/4"></div>
      </div>

      <div className="container mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        {/* Top Section: 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 mb-20 items-start">
          
          {/* Column 1: Brand & Desc */}
          <div className="flex flex-col gap-5 lg:pr-8">
            <div className="flex items-center gap-2 group cursor-pointer w-max">
              {/* Logo mimicking the purple wave icon from the image */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:shadow-purple-300/50 group-hover:rotate-[360deg] transition-all duration-700 ease-in-out">
                E
              </div>
              <span className="font-bold text-2xl tracking-tight text-gray-900 group-hover:text-purple-700 transition-colors duration-300">
                EmpowerNGO
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              We are a non-profit organization dedicated to empowering communities and creating sustainable futures for those in need.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:pl-4">
            <h4 className="text-[15px] font-bold text-gray-900 mb-6 tracking-wide">Quick Links</h4>
            <ul className="flex flex-col gap-4">
              {[
                { name: "About Us", href: "#about" },
                { name: "Our Programs", href: "#programs" },
                { name: "Get Involved", href: "#involved" },
                { name: "News & Media", href: "#media" },
                { name: "Contact Us", href: "#contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-500 text-sm font-medium hover:text-purple-600 transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="text-[15px] font-bold text-gray-900 mb-6 tracking-wide">Contact Us</h4>
            <ul className="flex flex-col gap-4">
              <li className="text-gray-500 text-sm font-medium hover:text-purple-600 transition-colors duration-300 cursor-default">
                123 NGO Street, Cityville,<br/>State 12345, Country
              </li>
              <li className="text-gray-500 text-sm font-medium hover:text-purple-600 transition-colors duration-300 cursor-pointer">
                +1 234 567 8900
              </li>
              <li className="text-gray-500 text-sm font-medium hover:text-purple-600 transition-colors duration-300 cursor-pointer">
                info@empowerngo.org
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-[15px] font-bold text-gray-900 mb-6 tracking-wide">Newsletter</h4>
            <p className="text-gray-500 text-sm mb-5">Subscribe to our newsletter to get latest updates and news.</p>
            
            <form className="w-full" onSubmit={(e) => e.preventDefault()}>
              {/* Pill-shaped integrated input matching the image */}
              <div className="flex items-center w-full border border-purple-200 rounded-full p-1 bg-white/40 backdrop-blur-sm focus-within:ring-2 focus-within:ring-purple-300/50 focus-within:border-purple-400 transition-all duration-300 shadow-sm hover:shadow-md">
                <input 
                  type="email" 
                  placeholder="Enter email address" 
                  className="w-full bg-transparent py-2 px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
                  required
                />
                <button 
                  type="submit"
                  className="bg-[#b359d9] hover:bg-[#9947bc] text-white text-sm font-medium py-2.5 px-5 rounded-full flex items-center justify-center gap-2 transform active:scale-95 transition-all duration-300 shadow-sm whitespace-nowrap"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
          
        </div>

        {/* Bottom Section: Footer line, Links, Copyright, Socials */}
        <div className="border-t border-purple-200/60 pt-6 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left: Legal Links */}
          <div className="flex items-center gap-4 text-[13px] font-medium text-gray-600 order-2 md:order-1">
            <Link href="#" className="hover:text-purple-600 transition-colors duration-300">Terms & condition</Link>
            <span className="text-gray-300">|</span>
            <Link href="#" className="hover:text-purple-600 transition-colors duration-300">Privacy Policy</Link>
          </div>

          {/* Center: Copyright */}
          <p className="text-gray-500 text-[13px] font-medium order-3 md:order-2 text-center">
            &copy; {new Date().getFullYear()} EmpowerNGO, All right reserved.
          </p>

          {/* Right: Social Icons (Outlined circles matching the image) */}
          <div className="flex items-center gap-3 order-1 md:order-3">
             <a href="#" className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center text-gray-600 hover:bg-purple-600 hover:border-purple-600 hover:text-white transform hover:-translate-y-1 transition-all duration-300">
               <Facebook className="w-3.5 h-3.5" fill="currentColor" strokeWidth={0} />
             </a>
             <a href="#" className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center text-gray-600 hover:bg-purple-600 hover:border-purple-600 hover:text-white transform hover:-translate-y-1 transition-all duration-300">
               <Twitter className="w-3.5 h-3.5" fill="currentColor" strokeWidth={0} />
             </a>
             <a href="#" className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center text-gray-600 hover:bg-purple-600 hover:border-purple-600 hover:text-white transform hover:-translate-y-1 transition-all duration-300">
               <Linkedin className="w-3.5 h-3.5" fill="currentColor" strokeWidth={0} />
             </a>
          </div>

        </div>
      </div>
    </footer>
  );
}