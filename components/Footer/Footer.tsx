"use client";



import Link from "next/link";

import { Send, Mail, Phone, MapPin, Globe, MessageCircle } from "lucide-react";



export default function Footer() {

  return (

    <footer className="bg-footer text-white pt-20 pb-10">

      <div className="container mx-auto px-4 md:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

         

          {/* Brand & Desc */}

          <div>

            <div className="flex items-center gap-2 group mb-6">

              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl group-hover:rotate-12 transition-transform">

                E

              </div>

              <span className="font-bold text-2xl tracking-tight">

                Empower<span className="text-primary">NGO</span>

              </span>

            </div>

            <p className="text-gray-400 mb-6 leading-relaxed">

              We are a non-profit organization dedicated to empowering communities and creating sustainable futures for those in need.

            </p>

            <div className="flex items-center gap-4">

              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">

                <Globe className="w-5 h-5" />

              </a>

              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">

                <MessageCircle className="w-5 h-5" />

              </a>

            </div>

          </div>



          {/* Quick Links */}

          <div>

            <h4 className="text-xl font-bold mb-6">Quick Links</h4>

            <ul className="flex flex-col gap-3">

              <li><Link href="#about" className="text-gray-400 hover:text-primary transition-colors inline-flex items-center gap-2 hover:translate-x-1 duration-300">About Us</Link></li>

              <li><Link href="#programs" className="text-gray-400 hover:text-primary transition-colors inline-flex items-center gap-2 hover:translate-x-1 duration-300">Our Programs</Link></li>

              <li><Link href="#involved" className="text-gray-400 hover:text-primary transition-colors inline-flex items-center gap-2 hover:translate-x-1 duration-300">Get Involved</Link></li>

              <li><Link href="#media" className="text-gray-400 hover:text-primary transition-colors inline-flex items-center gap-2 hover:translate-x-1 duration-300">News & Media</Link></li>

              <li><Link href="#contact" className="text-gray-400 hover:text-primary transition-colors inline-flex items-center gap-2 hover:translate-x-1 duration-300">Contact Us</Link></li>

            </ul>

          </div>



          {/* Contact Info */}

          <div>

            <h4 className="text-xl font-bold mb-6">Contact Us</h4>

            <ul className="flex flex-col gap-4">

              <li className="flex items-start gap-3">

                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />

                <span className="text-gray-400">123 NGO Street, Cityville, State 12345, Country</span>

              </li>

              <li className="flex items-center gap-3">

                <Phone className="w-5 h-5 text-primary flex-shrink-0" />

                <span className="text-gray-400">+1 234 567 8900</span>

              </li>

              <li className="flex items-center gap-3">

                <Mail className="w-5 h-5 text-primary flex-shrink-0" />

                <span className="text-gray-400">info@empowerngo.org</span>

              </li>

            </ul>

          </div>



          {/* Newsletter */}

          <div>

            <h4 className="text-xl font-bold mb-6">Newsletter</h4>

            <p className="text-gray-400 mb-4">Subscribe to our newsletter to get latest updates and news.</p>

            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>

              <div className="relative">

                <input

                  type="email"

                  placeholder="Email Address"

                  className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-primary transition-colors"

                />

              </div>

              <button className="gradient-bg flex items-center justify-center gap-2 py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-orange/20 transition-shadow">

                Subscribe <Send className="w-4 h-4" />

              </button>

            </form>

          </div>

         

        </div>



        {/* Bottom */}

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-gray-500 text-sm">

            &copy; {new Date().getFullYear()} EmpowerNGO. All Rights Reserved.

          </p>

          <div className="flex items-center gap-6 text-sm text-gray-500">

            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>

            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>

          </div>

        </div>

      </div>

    </footer>

  );

}