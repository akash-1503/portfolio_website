import * as React from "react";
import Link from "next/link";
import { Mail, Code2, Layers, Zap } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border pt-12 sm:pt-16 pb-28 sm:pb-12">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-8 sm:mb-12">
          
          {/* Brand & Intro */}
          <div className="sm:col-span-2">
            <Link href="/" className="inline-block text-xl sm:text-2xl font-bold text-heading mb-3 sm:mb-4">
              Akash Dandale.
            </Link>
            <p className="text-paragraph text-sm sm:text-base max-w-sm mb-6">
              Full Stack Developer & AI Enthusiast building scalable, high-performance applications and intuitive digital experiences.
            </p>
            <div className="flex items-center gap-3 sm:gap-4">
              <a href="https://github.com/akash-1503" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-section flex items-center justify-center text-heading hover:bg-primary hover:text-white transition-colors shrink-0">
                <GithubIcon className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/akash-dandale-309644263" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-section flex items-center justify-center text-heading hover:bg-info hover:text-white transition-colors shrink-0">
                <LinkedinIcon className="w-5 h-5" />
              </a>
              <a href="mailto:akashdandale123@gmail.com" className="w-10 h-10 rounded-full bg-section flex items-center justify-center text-heading hover:bg-success hover:text-white transition-colors shrink-0">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-heading font-semibold text-sm sm:text-base mb-4 sm:mb-6">Quick Links</h4>
            <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-paragraph font-medium">
              <li><Link href="#projects" className="hover:text-primary transition-colors">Projects</Link></li>
              <li><a href="https://github.com/akash-1503" target="_blank" className="hover:text-primary transition-colors">GitHub</a></li>
              <li><a href="https://www.linkedin.com/in/akash-dandale-309644263" target="_blank" className="hover:text-primary transition-colors">LinkedIn</a></li>
              <li><Link href="#contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-heading font-semibold text-sm sm:text-base mb-4 sm:mb-6">Built With</h4>
            <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
              <li className="flex items-center gap-2 text-paragraph"><Code2 className="w-4 h-4 text-heading shrink-0" /> Next.js & React</li>
              <li className="flex items-center gap-2 text-paragraph"><Layers className="w-4 h-4 text-[#3178C6] shrink-0" /> TypeScript</li>
              <li className="flex items-center gap-2 text-paragraph"><Zap className="w-4 h-4 text-[#06B6D4] shrink-0" /> Tailwind CSS</li>
              <li className="flex items-center gap-2 text-paragraph"><Layers className="w-4 h-4 text-[#E91E63] shrink-0" /> Framer Motion</li>
              <li className="flex items-center gap-2 text-paragraph"><Code2 className="w-4 h-4 text-heading shrink-0" /> Prisma</li>
              <li className="flex items-center gap-2 text-paragraph"><Zap className="w-4 h-4 text-heading shrink-0" /> Vercel</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 sm:pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-paragraph text-center sm:text-left">
          <p>© {new Date().getFullYear()} Akash Dandale. All rights reserved.</p>
          <p className="flex items-center gap-1">Designed & Developed by <span className="font-semibold text-heading">Akash Dandale</span></p>
        </div>
      </div>
    </footer>
  );
}
