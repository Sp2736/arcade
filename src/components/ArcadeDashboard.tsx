"use client";

import React, { useState } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import {
  Rocket, Search, Lightbulb, CheckCircle, PenTool, Layout, Code,
  Home, Layers, Users, LogIn, Github, Box, Menu, X, ArrowRight
} from "lucide-react";

// --- Types ---
type ModuleData = {
  id: number;
  title: string;
  description: string;
  outputs: string[];
  icon: React.ElementType;
  time: string;
};

// --- Data ---
const modules: ModuleData[] = [
  {
    id: 1,
    title: "Kick-off",
    description: "Initialize the ARCADE environment, setup the Next.js repo, and configure database connections.",
    outputs: ["Project roadmap", "Repo setup", "DB Schema"],
    icon: Rocket,
    time: "Week 1"
  },
  {
    id: 2,
    title: "Authentication",
    description: "Secure user access control using JWT or NextAuth with role-based permissions.",
    outputs: ["Login UI", "OAuth", "Session Logic"],
    icon: CheckCircle,
    time: "Week 2"
  },
  {
    id: 3,
    title: "Dashboard",
    description: "The central hub for user activity, displaying real-time stats and overview metrics.",
    outputs: ["Charts", "Sidebar", "Activity Logs"],
    icon: Layout,
    time: "Week 3"
  },
  {
    id: 4,
    title: "Game Engine",
    description: "Core logic for the arcade functionality, handling state and user interactions.",
    outputs: ["State Mgmt", "Canvas", "Physics"],
    icon: Code,
    time: "Week 4-5"
  },
  {
    id: 5,
    title: "Ranking",
    description: "Global ranking system to track top players and high scores across games.",
    outputs: ["Sorting Algo", "Redis", "Real-time"],
    icon: Lightbulb,
    time: "Week 6"
  },
  {
    id: 6,
    title: "Marketplace",
    description: "Virtual economy for trading in-game assets or unlocking new features.",
    outputs: ["Payments", "Inventory", "Assets"],
    icon: Search,
    time: "Week 7"
  },
  {
    id: 7,
    title: "Deployment",
    description: "Final quality assurance checks and deployment to Vercel/Edge network.",
    outputs: ["Unit Tests", "CI/CD", "Production"],
    icon: PenTool,
    time: "Week 8"
  },
];

// --- Reusable Components ---

function DockItem({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`relative p-3 rounded-xl transition-all duration-300 group flex items-center gap-3 w-full md:w-auto md:justify-center
        ${active ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" : "text-zinc-500 hover:text-white hover:bg-white/10"}
      `}
    >
      <Icon size={24} strokeWidth={2} />
      <span className="md:hidden text-lg font-bold">{label}</span>
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

const Sidebar = () => (
  <div className="hidden md:flex flex-col items-center w-20 py-8 h-screen sticky top-0 border-r border-white/5 bg-black/40 backdrop-blur-md z-50">
    <div className="mb-8">
       <span className="text-2xl font-black italic text-white">A<span className="text-blue-500">.</span></span>
    </div>
    <div className="flex flex-col gap-4 w-full px-2">
      <DockItem icon={Home} label="Home" />
      <DockItem icon={Layers} label="Modules" active />
      <DockItem icon={Box} label="Components" />
      <div className="h-px w-8 bg-white/10 mx-auto my-2" />
      <DockItem icon={Users} label="Team" />
      <DockItem icon={Github} label="GitHub" onClick={() => window.open("https://github.com/Sp2736/arcade", "_blank")} />
    </div>
  </div>
);

const MobileMenu = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
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
          <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full text-white border border-white/10">
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <DockItem icon={Home} label="Home" onClick={onClose} />
          <DockItem icon={Layers} label="Modules" active onClick={onClose} />
          <DockItem icon={Box} label="Components" onClick={onClose} />
          <div className="h-px w-full bg-white/10 my-2" />
          <DockItem icon={Users} label="Our Team" onClick={onClose} />
          <DockItem icon={Github} label="GitHub" onClick={() => window.open("https://github.com/Sp2736/arcade", "_blank")} />
          <DockItem icon={LogIn} label="Login" onClick={onClose} />
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

// --- Individual Module Section ---
const ModuleSection = ({ data, index }: { data: ModuleData, index: number }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`relative min-h-[80vh] flex items-center justify-center py-20 px-4 md:px-12 w-full max-w-7xl mx-auto`}
    >
      {/* Central Connector Line (Desktop) */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-white/0 via-blue-500/30 to-white/0 -translate-x-1/2" />
      
      {/* Central Node Dot */}
      <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-black border-2 border-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,1)] z-10 items-center justify-center">
        <div className="w-1.5 h-1.5 bg-blue-100 rounded-full" />
      </div>

      <div className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 w-full ${isEven ? "" : "md:flex-row-reverse"}`}>
        
        {/* TEXT SIDE */}
        <div className={`flex-1 text-center ${isEven ? "md:text-right" : "md:text-left"}`}>
          <div className={`flex flex-col gap-2 mb-4 ${isEven ? "md:items-end" : "md:items-start"} items-center`}>
             <span className="text-blue-500 font-bold tracking-widest uppercase text-sm">{data.time}</span>
             <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9]">
               {data.title}
             </h2>
          </div>
          <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-lg mx-auto md:mx-0">
            {data.description}
          </p>
          
          {/* Giant Number (Decorative) */}
          <span className={`absolute top-1/2 -translate-y-1/2 text-[15rem] font-black text-white/5 pointer-events-none select-none -z-10
            ${isEven ? "right-1/2 translate-x-16" : "left-1/2 -translate-x-16"}
          `}>
            {data.id}
          </span>
        </div>

        {/* CARD SIDE */}
        <div className="flex-1 w-full flex justify-center relative">
          <motion.div 
             whileHover={{ y: -10, rotate: isEven ? 1 : -1 }}
             className="relative w-full max-w-md bg-zinc-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl group"
          >
             {/* Icon Badge */}
             <div className="absolute -top-6 -right-6 h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/40 transform rotate-6 group-hover:rotate-12 transition-transform">
                <data.icon size={32} className="text-white" />
             </div>

             <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">Deliverables</h3>
             <ul className="space-y-3">
               {data.outputs.map((out, i) => (
                 <li key={i} className="flex items-center gap-3 text-zinc-300">
                   <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,1)]" />
                   <span className="text-base font-medium">{out}</span>
                 </li>
               ))}
             </ul>

             {/* Action Area */}
             <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                <span className="text-xs font-mono text-zinc-500">STATUS: PENDING</span>
                <button className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors">
                   <ArrowRight size={14} />
                </button>
             </div>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
};

// --- Main Layout ---
export default function ArcadeDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="flex min-h-screen w-full bg-[#050505] text-white font-sans selection:bg-blue-500/30">
      
      {/* Scroll Progress Bar (Top) */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-[60]"
        style={{ scaleX }}
      />

      <Sidebar />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <main className="flex-1 relative flex flex-col">
        {/* Background Ambient */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
           <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-blue-900/10 blur-[120px]" />
           <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-indigo-900/10 blur-[120px]" />
        </div>

        {/* Header Section */}
        <div className="relative h-[60vh] flex flex-col items-center justify-center text-center px-6">
           {/* Mobile Menu Trigger */}
           <button 
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden absolute top-6 right-6 p-2 text-white bg-zinc-900/50 rounded-lg border border-white/10"
            >
                <Menu size={20} />
            </button>

           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
           >
             <span className="text-blue-500 font-mono font-bold tracking-widest uppercase mb-4 block">Arcade Roadmap</span>
             <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-6">
               The Plan.
             </h1>
             <p className="text-zinc-400 max-w-xl mx-auto text-lg md:text-xl">
               A step-by-step breakdown of the Arcade development phase. Scroll down to explore the journey.
             </p>
           </motion.div>
           
           {/* Scroll Indicator */}
           <motion.div 
             animate={{ y: [0, 10, 0] }}
             transition={{ duration: 2, repeat: Infinity }}
             className="absolute bottom-10 text-zinc-500 flex flex-col items-center gap-2"
           >
             <span className="text-xs uppercase tracking-widest">Scroll</span>
             <div className="w-px h-12 bg-gradient-to-b from-blue-500 to-transparent" />
           </motion.div>
        </div>

        {/* Modules Stack */}
        <div className="pb-32">
          {modules.map((module, index) => (
            <ModuleSection key={module.id} data={module} index={index} />
          ))}
        </div>

        {/* Footer */}
        <footer className="py-12 border-t border-white/5 text-center text-zinc-600 text-sm">
           <p>© 2024 Arcade Inc. Built for builders.</p>
        </footer>
      </main>
    </div>
  );
}