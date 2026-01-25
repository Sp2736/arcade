"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket, Search, Lightbulb, CheckCircle, PenTool, Layout, Code,
  ChevronLeft, ChevronRight, Home, Layers, Users, LogIn, Github, Box,
  Menu, X
} from "lucide-react";

// --- Types ---
type ModuleData = {
  id: number;
  title: string;
  description: string;
  outputs: string[];
  icon: React.ElementType;
};

// --- Mock Data ---
const modules: ModuleData[] = [
  {
    id: 1,
    title: "Kick-off",
    description: "Initialize the ARCADE environment, setup the Next.js repo, and configure database connections.",
    outputs: ["Project roadmap", "Repo setup", "DB Schema design", "Env configuration"],
    icon: Rocket,
  },
  {
    id: 2,
    title: "Authentication",
    description: "Secure user access control using JWT or NextAuth with role-based permissions.",
    outputs: ["Login/Signup UI", "OAuth integration", "Session management", "Protected routes"],
    icon: CheckCircle,
  },
  {
    id: 3,
    title: "Dashboard",
    description: "The central hub for user activity, displaying real-time stats and overview metrics.",
    outputs: ["Data visualization", "Sidebar navigation", "User widgets", "Activity logs"],
    icon: Layout,
  },
  {
    id: 4,
    title: "Game Engine",
    description: "Core logic for the arcade functionality, handling state and user interactions.",
    outputs: ["State management", "Canvas rendering", "Score tracking", "Physics engine"],
    icon: Code,
  },
  {
    id: 5,
    title: "Leaderboard",
    description: "Global ranking system to track top players and high scores across games.",
    outputs: ["Sorting algorithms", "Redis caching", "Real-time updates", "Profile linking"],
    icon: Lightbulb,
  },
  {
    id: 6,
    title: "Marketplace",
    description: "Virtual economy for trading in-game assets or unlocking new features.",
    outputs: ["Payment gateway", "Inventory system", "Transaction history", "Asset UI"],
    icon: Search,
  },
  {
    id: 7,
    title: "Testing & Deploy",
    description: "Final quality assurance checks and deployment to Vercel/Edge network.",
    outputs: ["Unit tests", "E2E testing", "CI/CD pipeline", "Production build"],
    icon: PenTool,
  },
];

// --- Components ---

function DockItem({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`relative p-4 rounded-xl transition-all duration-300 group w-full md:w-auto flex md:block items-center justify-start md:justify-center gap-4 md:gap-0
        ${active ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" : "bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-white/5"}
      `}
    >
      <Icon size={28} strokeWidth={2} />
      {/* Label for Mobile Menu (Visible) */}
      <span className="md:hidden text-lg font-bold">{label}</span>
      
      {/* Tooltip for Desktop (Hover) */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.8 }}
            animate={{ opacity: 1, x: 20, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.8 }}
            className="hidden md:block absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1 bg-zinc-800 text-white text-xs font-bold rounded-lg whitespace-nowrap border border-white/10 z-50 pointer-events-none"
          >
            {label}
            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-zinc-800 border-l border-b border-white/10 rotate-45 transform" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

const DesktopSidebar = () => (
  <div className="hidden md:flex flex-none flex-col justify-center items-center w-28 h-full border-r border-white/5 bg-black/50 backdrop-blur-sm z-40">
    <div className="absolute top-8">
       <span className="text-3xl font-black italic tracking-tighter text-white">A<span className="text-blue-500">.</span></span>
    </div>

    <div className="flex flex-col gap-5 p-4 rounded-2xl bg-zinc-950/80 border border-white/5 shadow-2xl">
      <DockItem icon={Home} label="Home" />
      <DockItem icon={Layers} label="Modules" active />
      <DockItem icon={Box} label="Components" />
      <div className="h-px w-10 bg-white/10 mx-auto my-1" />
      <DockItem icon={Users} label="Our Team" />
      <DockItem icon={Github} label="GitHub" />
      <DockItem icon={LogIn} label="Login" />
    </div>
  </div>
);

const MobileMenuOverlay = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col p-6 md:hidden"
        >
          <div className="flex justify-between items-center mb-8">
            <span className="text-3xl font-black italic tracking-tighter text-white">ARCADE<span className="text-blue-500">.</span></span>
            <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full text-white">
              <X size={24} />
            </button>
          </div>
          
          <div className="flex flex-col gap-4">
            <DockItem icon={Home} label="Home" onClick={onClose} />
            <DockItem icon={Layers} label="Modules" active onClick={onClose} />
            <DockItem icon={Box} label="Components" onClick={onClose} />
            <div className="h-px w-full bg-white/10 my-2" />
            <DockItem icon={Users} label="Our Team" onClick={onClose} />
            <DockItem icon={Github} label="GitHub" onClick={onClose} />
            <DockItem icon={LogIn} label="Login" onClick={onClose} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function ArcadeDashboard() {
  const [activeModuleId, setActiveModuleId] = useState<number>(1);
  const activeModule = modules.find((m) => m.id === activeModuleId) || modules[0];

  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setVisibleCount(1);
      else if (width < 1024) setVisibleCount(2);
      else if (width < 1400) setVisibleCount(3);
      else setVisibleCount(4);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const maxStart = Math.max(0, modules.length - visibleCount);
    if (startIndex > maxStart) setStartIndex(maxStart);
  }, [visibleCount, startIndex]);

  const nextSlide = () => {
    if (startIndex < modules.length - visibleCount) setStartIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (startIndex > 0) setStartIndex((prev) => prev - 1);
  };

  const visibleModules = modules.slice(startIndex, startIndex + visibleCount);

  return (
    <div className="flex h-screen w-full bg-black text-white font-sans selection:bg-blue-500 selection:text-white overflow-hidden">
      
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Mobile Menu Overlay */}
      <MobileMenuOverlay isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content Area */}
      {/* Added overflow-y-auto so shorter screens can scroll if the big text overflows */}
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto overflow-x-hidden">
        
        {/* --- Header / Top Bar --- */}
        <div className="flex-none px-6 md:px-12 py-8 flex justify-between items-center">
             <div className="flex items-center gap-3 text-sm md:text-base text-zinc-500 font-mono uppercase tracking-wider">
                {/* Mobile Hamburger Trigger */}
                <button 
                  onClick={() => setMobileMenuOpen(true)}
                  className="md:hidden p-2 -ml-2 mr-2 text-white bg-zinc-900 rounded-lg border border-white/10"
                >
                  <Menu size={20} />
                </button>

                <span className="hidden md:inline">Arcade</span>
                <ChevronRight size={14} className="hidden md:block" />
                <span className="text-blue-400 font-bold">Development Phase</span>
             </div>
             
             <div className="text-right">
                <span className="text-4xl md:text-5xl font-black text-white/10 leading-none select-none">0{activeModuleId}</span>
                <span className="text-xs md:text-sm text-zinc-600 font-bold ml-2">/ 07</span>
            </div>
        </div>

        {/* --- Middle Section: Grouped Content --- */}
        {/* Using flex-grow to take up space, but justify-center to bundle content together */}
        <div className="flex-grow flex flex-col justify-center px-6 md:px-12 py-4">
           
           <div className="flex flex-col xl:flex-row items-center gap-12 xl:gap-24 w-full max-w-8xl mx-auto">
            
            {/* Text Area */}
            <motion.div
                key={activeModuleId}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: "circOut" }}
                className="flex-1 w-full text-center xl:text-left z-10"
            >
                <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-8 tracking-tight leading-[1.05] text-white">
                    {activeModule.title}
                </h1>
                
                <p className="text-zinc-400 text-lg sm:text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto xl:mx-0 border-l-4 border-blue-500 pl-6 md:pl-8">
                    {activeModule.description}
                </p>
            </motion.div>

            {/* Glass Card - Deliverables */}
            <div className="w-full xl:w-[500px] shrink-0 relative group">
                {/* Glow Effect behind card */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-600/30 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"></div>
                
                <motion.div 
                    key={`card-${activeModuleId}`}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
                    className="relative w-full bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl"
                >
                    <div className="flex flex-col gap-8">
                        <div className="flex justify-between items-start">
                             <div>
                                <h3 className="text-xs font-black uppercase text-blue-400 mb-2 tracking-[0.25em]">Deliverables</h3>
                                <h4 className="text-2xl font-bold text-white">Key Outcomes</h4>
                             </div>
                             <div className="h-20 w-20 flex-shrink-0 bg-gradient-to-br from-zinc-800 to-black rounded-2xl border border-white/10 flex items-center justify-center shadow-lg">
                                <activeModule.icon size={40} className="text-blue-500" />
                            </div>
                        </div>

                        <div className="h-px w-full bg-white/5" />

                        <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
                            {activeModule.outputs.map((item, idx) => (
                                <li key={idx} className="flex items-center gap-4 text-base md:text-lg font-medium text-zinc-300">
                                    <div className="h-2 w-2 flex-shrink-0 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,1)]"/>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        
                        <div className="mt-2 pt-6 border-t border-white/5 flex justify-between items-center">
                           <span className="text-zinc-500 text-sm font-mono">EST. 2 WEEKS</span>
                           <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-bold transition-colors border border-white/5">
                             View Details
                           </button>
                        </div>
                    </div>
                </motion.div>
            </div>

           </div>
        </div>

        {/* --- Bottom Section: Carousel --- */}
        <div className="flex-none px-6 md:px-12 pb-8 pt-4">
            <div className="flex justify-between items-end mb-4">
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em]">Select Module</p>
                <div className="flex gap-3">
                    <button onClick={prevSlide} disabled={startIndex === 0} className="h-10 w-10 flex items-center justify-center rounded-full border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all text-white">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextSlide} disabled={startIndex >= modules.length - visibleCount} className="h-10 w-10 flex items-center justify-center rounded-full border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all text-white">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${visibleCount}, minmax(0, 1fr))` }}>
                <AnimatePresence mode="popLayout">
                    {visibleModules.map((module) => {
                        const isActive = module.id === activeModuleId;
                        return (
                            <motion.button
                                layout
                                key={module.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onClick={() => setActiveModuleId(module.id)}
                                className={`
                                    group relative h-28 md:h-32 rounded-xl p-5 text-left transition-all duration-300 overflow-hidden border
                                    ${isActive 
                                        ? "bg-blue-600 border-blue-500 shadow-xl shadow-blue-600/20" 
                                        : "bg-zinc-900/40 border-white/5 hover:border-white/20 hover:bg-zinc-800"}
                                `}
                            >
                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    <span className={`text-xs font-bold tracking-widest uppercase ${isActive ? "text-blue-200" : "text-zinc-500 group-hover:text-zinc-400"}`}>
                                        Step 0{module.id}
                                    </span>
                                    <h4 className={`text-lg md:text-xl font-bold leading-tight pr-8 ${isActive ? "text-white" : "text-zinc-400 group-hover:text-white"}`}>
                                        {module.title}
                                    </h4>
                                </div>
                                
                                <span className={`absolute -bottom-6 -right-2 text-7xl md:text-8xl font-black leading-none transition-all duration-500 select-none
                                    ${isActive ? "text-blue-800/30" : "text-zinc-800/50 group-hover:text-zinc-700/50"}`}>
                                    {module.id}
                                </span>
                            </motion.button>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
      </main>
    </div>
  );
}