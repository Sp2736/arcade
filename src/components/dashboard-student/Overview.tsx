"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileText, Cpu, Award, UploadCloud, 
  Newspaper, Layers, Sparkles, ScrollText, ArrowUpRight 
} from "lucide-react";

interface OverviewProps {
  isDark: boolean;
  targetRole: string; 
}

// Animation Variants
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
        
        <div className={`px-5 py-2 rounded-xl flex items-center gap-3 border ${isDark ? "bg-blue-900/10 border-blue-500/20 text-blue-400" : "bg-blue-50 border-blue-200 text-blue-700"}`}>
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
            title: "Times Tech", 
            desc: "Stay ahead with comprehensive coverage of the technology sector. Access breaking news, in-depth gadget reviews, the latest trends in Indian and global tech markets, policy updates, and exclusive interviews with industry leaders. Your daily dose of everything tech.", 
            icon: Newspaper, 
            url: "https://timesofindia.indiatimes.com/technology", 
            color: "red" 
        },
        { 
            id: 2, 
            title: "TechCrunch", 
            desc: "The definitive source for reporting on the business of the technology industry. Discover the latest startup launches, funding rounds, venture capital insights, and disruptive technologies shaping Silicon Valley and beyond. Essential reading for aspiring founders and innovators.", 
            icon: Layers, 
            url: "https://techcrunch.com/", 
            color: "green" 
        },
        { 
            id: 3, 
            title: "GenAI R&D", 
            desc: "Dive into the cutting edge of Artificial Intelligence. Track breakthroughs in Generative AI, Large Language Models (LLMs), and machine learning research from giants like OpenAI, DeepMind, and Google. Understand the ethical implications and future trajectory of AI.", 
            icon: Sparkles, 
            url: "https://www.artificialintelligence-news.com/", 
            color: "purple" 
        },
        { 
            id: 4, 
            title: "Pro Certifications", 
            desc: "Accelerate your career with industry-standard professional certifications. Explore a curated catalog of exams from tech titans like Google, AWS, Oracle, and Microsoft. Validate your skills in cloud computing, data analytics, and development to stand out to top recruiters.", 
            icon: ScrollText, 
            url: "https://grow.google/certificates/", 
            color: "yellow" 
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
    const { title, desc, icon: Icon, url, color } = data;

    // Theme Mappings
    const theme: any = {
        red: { icon: "text-red-500", glow: "group-hover:shadow-red-500/20 group-hover:border-red-500/50" },
        green: { icon: "text-emerald-500", glow: "group-hover:shadow-emerald-500/20 group-hover:border-emerald-500/50" },
        purple: { icon: "text-violet-500", glow: "group-hover:shadow-violet-500/20 group-hover:border-violet-500/50" },
        yellow: { icon: "text-yellow-500", glow: "group-hover:shadow-yellow-500/20 group-hover:border-yellow-500/50" },
    };
    const t = theme[color];

    return (
        <a 
            href={url} target="_blank" rel="noopener noreferrer"
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            className={`group relative h-80 rounded-3xl border transition-all duration-500 cursor-pointer overflow-hidden flex flex-col
                ${isDark ? "bg-zinc-900/40 border-white/5" : "bg-white border-zinc-200 shadow-sm"}
                ${isBlurred ? "opacity-40 scale-95 blur-[2px]" : "opacity-100 scale-100 blur-0"}
                ${isHovered ? `scale-105 shadow-2xl z-10 ${t.glow}` : ""}
            `}
        >
            {/* ICON & TITLE (Centered initially, moves Top on Hover) */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 px-6 z-10 ${isHovered ? "-translate-y-24 opacity-0" : "translate-y-0 opacity-100"}`}>
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 
                    ${isDark ? "bg-zinc-800" : "bg-zinc-100"} 
                `}>
                    <Icon size={40} className={t.icon} />
                </div>
                <h3 className={`text-xl font-black uppercase tracking-tight text-center ${isDark ? "text-white" : "text-zinc-900"} ${t.icon}`}>
                    {title}
                </h3>
            </div>

            {/* EXPANDED CONTENT (Slides Up) */}
            <div className={`absolute inset-0 p-6 flex flex-col items-center justify-center text-center transition-all duration-500 transform ${isHovered ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}>
                
                {/* Small Icon Header for Context */}
                <div className={`flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-widest ${t.icon}`}>
                    <Icon size={14} /> {title}
                </div>

                <p className={`text-xs leading-relaxed mb-6 ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
                    {desc}
                </p>
                
                {/* PROPER LINK BUTTON */}
                <button className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-transform duration-300 hover:scale-105 active:scale-95 ${isDark ? "bg-white text-black" : "bg-black text-white"}`}>
                    Visit Website <ArrowUpRight size={14} />
                </button>
            </div>
        </a>
    );
};

// --- SUB COMPONENTS ---

const ActionCard = ({ title, desc, icon: Icon, color, isDark }: any) => {
    const colors: any = {
        blue: isDark ? "text-blue-400 border-blue-500/30 bg-blue-500/10" : "text-blue-700 border-blue-200 bg-blue-50",
        purple: isDark ? "text-purple-400 border-purple-500/30 bg-purple-500/10" : "text-purple-700 border-purple-200 bg-purple-50",
        orange: isDark ? "text-orange-400 border-orange-500/30 bg-orange-500/10" : "text-orange-700 border-orange-200 bg-orange-50",
    };
    return (
        <div className={`p-5 rounded-2xl border transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${isDark ? "bg-[#09090b]/40 border-white/5" : "bg-white border-zinc-200 shadow-sm"}`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 border ${colors[color]}`}><Icon size={20} /></div>
            <h4 className={`text-lg font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>{title}</h4>
            <p className="text-xs text-zinc-500 mt-1">{desc}</p>
        </div>
    );
}