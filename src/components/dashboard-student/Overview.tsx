"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileText, Cpu, Award, UploadCloud, 
  Newspaper, Layers, Sparkles, ScrollText, ExternalLink 
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
          <p className="text-zinc-500">
            Target: <span className="text-blue-500 font-bold uppercase">{targetRole || "NOT SELECTED"}</span>
          </p>
        </div>
        
        <div className={`px-5 py-2 rounded-xl flex items-center gap-3 border ${isDark ? "bg-blue-900/20 border-blue-500/20 text-blue-400" : "bg-blue-50 border-blue-200 text-blue-700"}`}>
             <Award size={18} /> 
             <span className="font-bold text-sm">Skill Score: 68</span>
        </div>
      </motion.div>

      {/* --- QUICK ACTIONS --- */}
      <motion.div variants={itemVar} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ActionCard title="Share Knowledge" desc="Upload notes." icon={UploadCloud} color="blue" isDark={isDark} />
        <ActionCard title="Analyze Gaps" desc="Compare skills." icon={Cpu} color="purple" isDark={isDark} />
        <ActionCard title="Resume Library" desc="Access formats." icon={FileText} color="orange" isDark={isDark} />
      </motion.div>

      {/* --- GLOBAL INTELLIGENCE --- */}
      <motion.div variants={itemVar}>
        <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${textMain}`}>
            <span className="w-1 h-6 bg-blue-500 rounded-full"></span> Global Intelligence
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
            title: "Tech News", 
            desc: "Daily headlines from the world of technology. Keep up with TOI Tech, global gadget reviews from The Verge, and breaking news.", 
            icon: Newspaper, 
            color: "red",
            links: [
                { name: "TOI Tech", url: "https://timesofindia.indiatimes.com/technology", brand: "toi" },
                { name: "The Verge", url: "https://www.theverge.com/", brand: "verge" },
                { name: "NDTV Gadgets", url: "https://www.gadgets360.com/", brand: "ndtv" }
            ]
        },
        { 
            id: 2, 
            title: "Startups & Tools", 
            desc: "Discover fresh tools on Product Hunt, read startup gossip on TechCrunch, and follow YC discussions.", 
            icon: Layers, 
            color: "green",
            links: [
                { name: "TechCrunch", url: "https://techcrunch.com/", brand: "techcrunch" },
                { name: "Product Hunt", url: "https://www.producthunt.com/", brand: "producthunt" },
                { name: "YCombinator", url: "https://news.ycombinator.com/", brand: "ycombinator" }
            ]
        },
        { 
            id: 3, 
            title: "AI Research", 
            desc: "Direct access to the labs inventing the future. Read research papers and blogs from OpenAI, DeepMind, and HuggingFace.", 
            icon: Sparkles, 
            color: "purple",
            links: [
                { name: "OpenAI", url: "https://openai.com/research", brand: "openai" },
                { name: "DeepMind", url: "https://deepmind.google/research/", brand: "deepmind" },
                { name: "Hugging Face", url: "https://huggingface.co/", brand: "huggingface" }
            ]
        },
        { 
            id: 4, 
            title: "Pro Certifications", 
            desc: "Validate your skills with industry-standard exams. Direct links to certification paths for the 6 Tech Titans.", 
            icon: ScrollText, 
            color: "yellow",
            links: [
                { name: "Google", url: "https://grow.google/certificates/", brand: "google" },
                { name: "AWS", url: "https://aws.amazon.com/certification/", brand: "aws" },
                { name: "Microsoft", url: "https://learn.microsoft.com/en-us/credentials/", brand: "microsoft" },
                { name: "Oracle", url: "https://education.oracle.com/certification", brand: "oracle" },
                { name: "Nvidia", url: "https://www.nvidia.com/en-us/training/certification/", brand: "nvidia" },
                { name: "OpenAI", url: "https://openai.com/residency/", brand: "openai" } 
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

    // Theme Mappings
    const theme: any = {
        red: { icon: "text-red-500", glow: "shadow-red-500/20 border-red-500/50" },
        green: { icon: "text-emerald-500", glow: "shadow-emerald-500/20 border-emerald-500/50" },
        purple: { icon: "text-violet-500", glow: "shadow-violet-500/20 border-violet-500/50" },
        yellow: { icon: "text-yellow-500", glow: "shadow-yellow-500/20 border-yellow-500/50" },
    };
    const t = theme[color];

    // UPDATED CARD BG: Solid background for distinct look
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
            {/* ICON & TITLE */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 px-6 z-10 ${isHovered ? "-translate-y-32 opacity-0 pointer-events-none" : "translate-y-0 opacity-100"}`}>
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 ${isDark ? "bg-black" : "bg-zinc-100"}`}>
                    <Icon size={40} className={t.icon} />
                </div>
                <h3 className={`text-xl font-black uppercase tracking-tight text-center ${isDark ? "text-white" : "text-zinc-900"} ${t.icon}`}>
                    {title}
                </h3>
            </div>

            {/* EXPANDED CONTENT */}
            <div className={`absolute inset-0 z-20 p-6 flex flex-col items-center justify-center text-center transition-all duration-500 transform 
                ${isHovered ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-20 opacity-0 pointer-events-none"}
            `}>
                
                <div className={`flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-widest ${t.icon}`}>
                    <Icon size={14} /> {title}
                </div>

                <p className={`text-[11px] leading-relaxed mb-6 line-clamp-3 ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
                    {desc}
                </p>
                
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-8 relative z-30 pb-2">
                    {links.map((link: any, i: number) => (
                        <a 
                            key={i} 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all hover:scale-125 hover:-translate-y-1 relative group/icon cursor-pointer shadow-lg hover:z-50
                                ${isDark ? "bg-black border-zinc-700 text-white hover:bg-white hover:text-black" : "bg-white border-zinc-200 text-black hover:bg-black hover:text-white"}
                            `}
                        >
                            <BrandLogo brand={link.brand} />
                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold bg-black text-white px-2 py-1 rounded opacity-0 group-hover/icon:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg z-50">
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
        case "google": return <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>;
        case "aws": return <span className="font-black text-[10px] tracking-tighter">AWS</span>;
        case "microsoft": return <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/></svg>;
        case "oracle": return <span className="font-black text-[8px] tracking-tighter">ORCL</span>;
        case "nvidia": return <span className="font-black text-[9px]">NV</span>;
        case "openai": return <Sparkles size={16} strokeWidth={3} />;
        case "toi": return <span className="font-black text-[10px] tracking-tighter">TOI</span>;
        case "verge": return <span className="font-black text-[10px] font-serif">V</span>;
        case "ndtv": return <span className="font-black text-[9px]">NDTV</span>;
        case "techcrunch": return <span className="font-black text-[10px] tracking-tighter text-green-500">TC</span>;
        case "producthunt": return <span className="font-black text-[10px]">P</span>;
        case "ycombinator": return <span className="font-black text-[12px]">Y</span>;
        case "deepmind": return <span className="font-black text-[10px]">DM</span>;
        case "huggingface": return <span className="text-[14px]">🤗</span>;
        default: return <ExternalLink size={16} />;
    }
}

// --- ACTION CARD ---
const ActionCard = ({ title, desc, icon: Icon, color, isDark }: any) => {
    const colors: any = {
        blue: isDark ? "text-blue-400 border-blue-500/30 bg-blue-500/10" : "text-blue-700 border-blue-200 bg-blue-50",
        purple: isDark ? "text-purple-400 border-purple-500/30 bg-purple-500/10" : "text-purple-700 border-purple-200 bg-purple-50",
        orange: isDark ? "text-orange-400 border-orange-500/30 bg-orange-500/10" : "text-orange-700 border-orange-200 bg-orange-50",
    };
    // UPDATED CARD BG
    return (
        <div className={`p-5 rounded-2xl border transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200 shadow-sm"}`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 border ${colors[color]}`}><Icon size={20} /></div>
            <h4 className={`text-lg font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>{title}</h4>
            <p className="text-xs text-zinc-500 mt-1">{desc}</p>
        </div>
    );
}