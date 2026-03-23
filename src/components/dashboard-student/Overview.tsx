"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileText, Cpu, Award, 
  Newspaper, Layers, Sparkles, ScrollText, ExternalLink, Activity, Bell, Map, ChevronRight 
} from "lucide-react";

interface OverviewProps {
  isDark: boolean;
  targetRole: string; 
}

const containerVar = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVar = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Overview({ isDark, targetRole }: OverviewProps) {
  const textMain = isDark ? "text-white" : "text-zinc-900";

  return (
    <motion.div variants={containerVar} initial="hidden" animate="show" className="space-y-10 pb-10">
      
      {/* --- HEADER --- */}
      <motion.div variants={itemVar} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl md:text-3xl font-black uppercase tracking-tight ${textMain}`}>Command Center</h2>
          <p className="text-zinc-500 flex items-center gap-2 mt-1">
            <Activity size={16} className="text-emerald-500" /> System Online & Synced
          </p>
        </div>
        
        <div className={`px-5 py-3 rounded-xl flex flex-col border ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200 shadow-sm"}`}>
             <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-1">Target Trajectory</span>
             <span className={`font-bold text-md uppercase ${isDark ? "text-blue-400" : "text-blue-700"}`}>
                 {targetRole || "ROLE NOT CONFIGURED"}
             </span>
        </div>
      </motion.div>

      {/* --- DYNAMIC WIDGETS (Replaced useless blocks) --- */}
      <motion.div variants={itemVar} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Widget 1: System Alerts */}
        <div className={`p-5 rounded-2xl border ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200 shadow-sm"}`}>
            <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${isDark ? "bg-orange-500/10 border-orange-500/30 text-orange-400" : "bg-orange-50 border-orange-200 text-orange-600"}`}><Bell size={20} /></div>
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">2 Unread</span>
            </div>
            <h4 className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-zinc-900"}`}>Pending Alerts</h4>
            <ul className="space-y-2">
                <li className="text-sm text-zinc-500 flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0"></span> Your note 'OS Chap 3' was approved.</li>
                <li className="text-sm text-zinc-500 flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0"></span> Profile update window unlocked.</li>
            </ul>
        </div>

        {/* Widget 2: Roadmap Progress */}
        <div className={`p-5 rounded-2xl border ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200 shadow-sm"}`}>
            <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${isDark ? "bg-blue-500/10 border-blue-500/30 text-blue-400" : "bg-blue-50 border-blue-200 text-blue-600"}`}><Map size={20} /></div>
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">In Progress</span>
            </div>
            <h4 className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-zinc-900"}`}>Active Roadmap</h4>
            <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2.5 mb-2 mt-4">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
            </div>
            <p className="text-xs text-zinc-500 text-right">45% Nodes Completed</p>
        </div>

        {/* Widget 3: Recent Assets */}
        <div className={`p-5 rounded-2xl border flex flex-col ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200 shadow-sm"}`}>
            <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${isDark ? "bg-purple-500/10 border-purple-500/30 text-purple-400" : "bg-purple-50 border-purple-200 text-purple-600"}`}><FileText size={20} /></div>
            </div>
            <h4 className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-zinc-900"}`}>Latest Academic Assets</h4>
            <div className="mt-auto">
                <button className={`w-full py-2 flex items-center justify-between text-sm font-semibold rounded-lg px-3 transition-colors ${isDark ? "bg-zinc-800 hover:bg-zinc-700 text-white" : "bg-zinc-100 hover:bg-zinc-200 text-zinc-900"}`}>
                    View 5 New Uploads <ChevronRight size={16} />
                </button>
            </div>
        </div>

      </motion.div>

      {/* --- GLOBAL INTELLIGENCE (Updated for CS) --- */}
      <motion.div variants={itemVar}>
        <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${textMain}`}>
            <span className="w-1 h-6 bg-blue-500 rounded-full"></span> Industry Intelligence Grid
        </h3>
        <GlobalIntelligenceGrid isDark={isDark} />
      </motion.div>

    </motion.div>
  );
}

// --- GLOBAL INTELLIGENCE GRID ---
const GlobalIntelligenceGrid = ({ isDark }: { isDark: boolean }) => {
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    const cards = [
        { 
            id: 1, 
            title: "Code Mastery", 
            desc: "Daily problem-solving is the key to passing technical rounds. Master DSA with the standard platforms.", 
            icon: Cpu, 
            color: "red",
            links: [
                { name: "LeetCode", url: "https://leetcode.com/", brand: "leetcode" },
                { name: "HackerRank", url: "https://www.hackerrank.com/", brand: "hackerrank" },
                { name: "Codeforces", url: "https://codeforces.com/", brand: "codeforces" }
            ]
        },
        { 
            id: 2, 
            title: "Architecture", 
            desc: "Understand how large-scale systems are designed. Essential resources for System Design interviews.", 
            icon: Layers, 
            color: "green",
            links: [
                { name: "ByteByteGo", url: "https://bytebytego.com/", brand: "bytebytego" },
                { name: "Roadmap.sh", url: "https://roadmap.sh/", brand: "roadmap" },
                { name: "System Design", url: "https://github.com/donnemartin/system-design-primer", brand: "github" }
            ]
        },
        { 
            id: 3, 
            title: "Open Source", 
            desc: "See what the global community is building. Contribute to repositories and ask the right questions.", 
            icon: Sparkles, 
            color: "purple",
            links: [
                { name: "Trending", url: "https://github.com/trending", brand: "github" },
                { name: "StackOverflow", url: "https://stackoverflow.com/", brand: "stackoverflow" },
                { name: "Dev.to", url: "https://dev.to/", brand: "devto" }
            ]
        },
        { 
            id: 4, 
            title: "Pro Certs", 
            desc: "Validate your skills with industry-standard exams. Direct links to certification paths.", 
            icon: ScrollText, 
            color: "yellow",
            links: [
                { name: "Google", url: "https://grow.google/certificates/", brand: "google" },
                { name: "AWS", url: "https://aws.amazon.com/certification/", brand: "aws" },
                { name: "Microsoft", url: "https://learn.microsoft.com/en-us/credentials/", brand: "microsoft" }
            ]
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card) => (
                <ExpandableCard 
                    key={card.id}
                    data={card}
                    isDark={isDark}
                    isHovered={hoveredId === card.id}
                    isBlurred={hoveredId !== null && hoveredId !== card.id}
                    onHover={() => setHoveredId(card.id)}
                    onLeave={() => setHoveredId(null)}
                />
            ))}
        </div>
    );
};

const ExpandableCard = ({ data, isDark, isHovered, isBlurred, onHover, onLeave }: any) => {
    const { title, desc, icon: Icon, links, color } = data;

    const theme: any = {
        red: { icon: "text-red-500", glow: "shadow-red-500/20 border-red-500/50" },
        green: { icon: "text-emerald-500", glow: "shadow-emerald-500/20 border-emerald-500/50" },
        purple: { icon: "text-violet-500", glow: "shadow-violet-500/20 border-violet-500/50" },
        yellow: { icon: "text-yellow-500", glow: "shadow-yellow-500/20 border-yellow-500/50" },
    };
    const t = theme[color];
    const bgClass = isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200 shadow-sm";

    return (
        <div 
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            className={`relative h-96 rounded-3xl border transition-all duration-500 cursor-default overflow-hidden flex flex-col
                ${bgClass}
                ${isBlurred ? "opacity-40 scale-95 blur-[2px]" : "opacity-100 scale-100 blur-0"}
                ${isHovered ? `scale-105 shadow-2xl z-20 ${t.glow}` : "z-0"}
            `}
        >
            <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 px-6 z-10 ${isHovered ? "-translate-y-32 opacity-0 pointer-events-none" : "translate-y-0 opacity-100"}`}>
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 ${isDark ? "bg-black border border-zinc-800" : "bg-zinc-100 border border-zinc-200"}`}>
                    <Icon size={40} className={t.icon} />
                </div>
                <h3 className={`text-xl font-black uppercase tracking-tight text-center ${isDark ? "text-white" : "text-zinc-900"} ${t.icon}`}>
                    {title}
                </h3>
            </div>

            <div className={`absolute inset-0 z-20 p-6 flex flex-col items-center justify-center text-center transition-all duration-500 transform 
                ${isHovered ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-20 opacity-0 pointer-events-none"}
            `}>
                <div className={`flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-widest ${t.icon}`}>
                    <Icon size={14} /> {title}
                </div>
                <p className={`text-[12px] leading-relaxed mb-8 ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
                    {desc}
                </p>
                
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-8 relative z-30 pb-2">
                    {links.map((link: any, i: number) => (
                        <a 
                            key={i} 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all hover:scale-110 hover:-translate-y-2 relative group/icon cursor-pointer shadow-lg hover:z-50
                                ${isDark ? "bg-black border-zinc-700 text-white hover:bg-white hover:text-black" : "bg-white border-zinc-200 text-black hover:bg-black hover:text-white"}
                            `}
                        >
                            <BrandLogo brand={link.brand} />
                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-black text-white px-3 py-1.5 rounded opacity-0 group-hover/icon:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg z-50">
                                {link.name}
                            </span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

const BrandLogo = ({ brand }: { brand: string }) => {
    switch (brand) {
        case "leetcode": return <span className="font-black text-[12px] text-yellow-500">LC</span>;
        case "hackerrank": return <span className="font-black text-[12px] text-green-500">H</span>;
        case "codeforces": return <span className="font-black text-[12px] text-blue-500">CF</span>;
        case "bytebytego": return <span className="font-black text-[10px]">BBG</span>;
        case "roadmap": return <Map size={18} />;
        case "github": return <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>;
        case "stackoverflow": return <span className="font-black text-[10px] text-orange-500">SO</span>;
        case "devto": return <span className="font-black text-[12px] bg-black text-white px-1 rounded">DEV</span>;
        case "google": return <span className="font-black text-[12px]">G</span>;
        case "aws": return <span className="font-black text-[12px] tracking-tighter">AWS</span>;
        case "microsoft": return <span className="font-black text-[12px]">MS</span>;
        default: return <ExternalLink size={18} />;
    }
}