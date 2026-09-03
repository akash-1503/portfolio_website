"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence, useTransform, useMotionValue, useSpring, MotionValue } from "framer-motion";
import { 
  Home, Activity, Briefcase, Code2, Rocket, Star, Mail, Menu, X
} from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

type DockItemData = {
  name: string;
  href: string;
  icon: React.ElementType;
};

const DOCK_ITEMS: DockItemData[] = [
  { name: "Home", href: "#home", icon: Home },
  { name: "Dashboard", href: "#dashboard", icon: Activity },
  { name: "Experience", href: "#experience", icon: Briefcase },
  { name: "Projects", href: "#projects", icon: Code2 },
  { name: "Hackathons", href: "#hackathons", icon: Rocket },
  { name: "Excellence", href: "#excellence", icon: Star },
  { name: "Contact", href: "#contact", icon: Mail },
];

function DockItem({ item, mouseX }: { item: DockItemData, mouseX: MotionValue<number> }) {
  const ref = React.useRef<HTMLDivElement>(null);
  
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  const [hovered, setHovered] = React.useState(false);

  return (
    <Link href={item.href}>
      <motion.div
        ref={ref}
        style={{ width }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative aspect-square rounded-2xl bg-card border border-border flex items-center justify-center hover:bg-section hover:border-primary transition-colors shadow-sm hover:shadow-md"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: -45, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              className="absolute top-0 flex items-center justify-center px-3 py-1.5 rounded-lg bg-heading border border-border text-white text-xs font-semibold whitespace-nowrap shadow-xl z-50 pointer-events-none"
            >
              {item.name}
            </motion.div>
          )}
        </AnimatePresence>
        <item.icon className="w-1/2 h-1/2 text-paragraph group-hover:text-primary transition-colors" />
      </motion.div>
    </Link>
  );
}

export function Navbar() {
  const mouseX = useMotionValue(Infinity);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<string>("home");

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Passive active section scroll detection
  React.useEffect(() => {
    const sectionIds = DOCK_ITEMS.map((item) => item.href.replace("#", ""));

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sectionIds[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const MOBILE_QUICK_TABS: DockItemData[] = [
    { name: "Home", href: "#home", icon: Home },
    { name: "Projects", href: "#projects", icon: Code2 },
    { name: "Contact", href: "#contact", icon: Mail },
  ];

  return (
    <>
      {/* Desktop macOS Dock Navigation (sm and up) */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="hidden sm:flex fixed bottom-6 inset-x-0 z-50 items-center justify-center px-4 pointer-events-none"
      >
        <div 
          onMouseMove={(e) => mouseX.set(e.pageX)}
          onMouseLeave={() => mouseX.set(Infinity)}
          className="flex items-end gap-2 p-3 rounded-3xl border border-border bg-glass backdrop-blur-2xl shadow-xl pointer-events-auto"
        >
          {DOCK_ITEMS.map((item) => (
            <DockItem key={item.name} item={item} mouseX={mouseX} />
          ))}
          
          <div className="w-px h-10 bg-border mx-2 self-center" />

          <DockItem key="GitHub" item={{ name: "GitHub", href: "https://github.com/akash-1503", icon: GithubIcon }} mouseX={mouseX} />
        </div>
      </motion.div>

      {/* Mobile Floating Compact Navigation Bar (Below sm) */}
      <div className="sm:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md pointer-events-auto">
        <nav 
          aria-label="Mobile Navigation" 
          className="flex items-center justify-between p-1.5 rounded-full border border-border bg-glass/95 backdrop-blur-2xl shadow-xl"
        >
          {MOBILE_QUICK_TABS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.href.replace("#", "");

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMobileMenu}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-full text-xs font-semibold transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                    : "text-paragraph hover:text-heading hover:bg-card/40"
                )}
              >
                <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-primary" : "text-paragraph")} />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}

          {/* Hamburger Toggle Button */}
          <button
            onClick={toggleMobileMenu}
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
            className={cn(
              "flex items-center justify-center gap-1 py-2 px-3 rounded-full text-xs font-semibold transition-all duration-200 shrink-0",
              mobileMenuOpen
                ? "bg-primary text-white shadow-sm"
                : "text-heading hover:text-primary hover:bg-card/40"
            )}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            <span className="text-xs">{mobileMenuOpen ? "Close" : "Menu"}</span>
          </button>
        </nav>

        {/* Mobile Navigation Drawer Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.96 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute bottom-14 inset-x-0 p-3 rounded-3xl border border-border bg-card/95 backdrop-blur-2xl shadow-2xl space-y-1 max-h-[65vh] overflow-y-auto z-50"
            >
              <div className="text-[11px] font-bold uppercase tracking-wider text-paragraph px-3 py-1 border-b border-border/50 mb-1 flex items-center justify-between">
                <span>All Sections</span>
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </div>

              {DOCK_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.href.replace("#", "");

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-2xl transition-all duration-200 text-xs font-semibold",
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-heading hover:text-primary hover:bg-section"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={cn(
                        "w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border border-border",
                        isActive ? "bg-primary text-white border-primary" : "bg-section text-paragraph"
                      )}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span>{item.name}</span>
                    </div>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </Link>
                );
              })}

              <div className="pt-1.5 border-t border-border/50">
                <a
                  href="https://github.com/akash-1503"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-2xl text-heading hover:text-primary hover:bg-section transition-all duration-200 text-xs font-semibold"
                >
                  <div className="w-7 h-7 rounded-xl bg-section border border-border flex items-center justify-center text-heading shrink-0">
                    <GithubIcon className="w-3.5 h-3.5" />
                  </div>
                  <span>GitHub Profile</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

