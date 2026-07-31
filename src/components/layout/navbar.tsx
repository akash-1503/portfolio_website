"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useTransform, useMotionValue, useSpring } from "framer-motion";
import { 
  Home, User, Briefcase, Code2, Cpu, GraduationCap, 
  Trophy, FileBadge, Moon, Sun, Monitor, Play, FileText, Mail
} from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

type DockItemData = {
  name: string;
  href: string;
  icon: React.ElementType;
};

const DOCK_ITEMS: DockItemData[] = [
  { name: "Home", href: "#home", icon: Home },
  { name: "About", href: "#about", icon: User },
  { name: "Projects", href: "#projects", icon: Code2 },
  { name: "Skills", href: "#skills", icon: Cpu },
  { name: "Learning", href: "#learning", icon: GraduationCap },
  { name: "Contact", href: "#contact", icon: Mail },
];

function DockItem({ item, mouseX }: { item: DockItemData, mouseX: any }) {
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
  const [isVisible, setIsVisible] = React.useState(true);
  const { scrollY, scrollYProgress } = useScroll();
  const mouseX = useMotionValue(Infinity);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  });

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: isVisible ? 0 : 150 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="fixed bottom-6 inset-x-0 z-50 flex items-center justify-center px-4 pointer-events-none"
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

        <DockItem key="Resume" item={{ name: "Resume", href: "/resume.pdf", icon: FileText }} mouseX={mouseX} />
        <DockItem key="GitHub" item={{ name: "GitHub", href: "https://github.com/akash-1503", icon: GithubIcon }} mouseX={mouseX} />
      </div>
    </motion.div>
  );
}
