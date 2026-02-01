"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, Cpu, Award, ArrowRight, UploadCloud, AlertTriangle, CheckCircle } from "lucide-react";

interface OverviewProps {
  isDark: boolean;
  targetRole: string; // <--- New Prop
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
  const cardBg = isDark ? "bg-[#09090b]/60 border-white/5 backdrop-blur-md" : "bg-white/80 border-zinc-200 shadow-sm backdrop-blur-md";
  const textMain = isDark ? "text-white" : "text-zinc-900";

  return (
    <motion.div variants={containerVar} initial="hidden" animate="show" className="space-y-6 pb-10">
      
      {/* Header */}
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

      {/* Action Cards */}
      <motion.div variants={itemVar} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ActionCard title="Share Knowledge" desc="Upload notes." icon={UploadCloud} color="blue" isDark={isDark} />
        <ActionCard title="Analyze Gaps" desc="Compare skills." icon={Cpu} color="purple" isDark={isDark} />
        <ActionCard title="Resume Library" desc="Access formats." icon={FileText} color="orange" isDark={isDark} />
      </motion.div>

      {/* Split Section */}
      <motion.div variants={itemVar} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Roadmap Preview (Mocked visual for now) */}
        <div className={`col-span-1 lg:col-span-2 rounded-3xl p-6 border flex flex-col ${cardBg}`}>
            <div className="flex justify-between items-center mb-8">
                <h3 className={`font-bold text-lg ${textMain}`}>Current Trajectory</h3>
                <span className="text-[10px] font-bold bg-blue-500/10 text-blue-500 px-2 py-1 rounded border border-blue-500/20">PHASE 2</span>
            </div>
            
            <div className="flex-1 flex flex-wrap md:flex-nowrap items-center justify-between gap-4 relative">
                <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-500/20 -z-10" />
                {["Level 1", "Level 2", "Level 3", "Level 4", "Mastery"].map((l, i) => (
                    <RoadmapNode key={l} label={l} status={i < 2 ? "completed" : i === 2 ? "active" : "locked"} isDark={isDark} />
                ))}
            </div>
        </div>

        {/* Recent Activity */}
        <div className={`col-span-1 rounded-3xl p-6 border flex flex-col ${cardBg}`}>
            <h3 className={`font-bold text-lg mb-6 ${textMain}`}>Fresh Uploads</h3>
            <div className="space-y-3">
                <ResourceItem title="OS: Process Scheduling" tag="Verified" type="note" isDark={isDark} />
                <ResourceItem title="SDE-1 Resume" tag="Resume" type="resume" isDark={isDark} />
                <ResourceItem title="LeetCode: Arrays" tag="Practice" type="link" isDark={isDark} />
            </div>
        </div>

      </motion.div>
    </motion.div>
  );
}

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

const RoadmapNode = ({ label, status, isDark }: any) => {
    let statusColor = "";
    if (status === "completed") statusColor = "bg-green-500 text-white border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]";
    else if (status === "active") statusColor = "bg-blue-600 text-white border-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.6)] scale-110";
    else statusColor = isDark ? "bg-zinc-800 text-zinc-500 border-zinc-700" : "bg-zinc-100 text-zinc-400 border-zinc-300";
    return (
        <div className="flex flex-col items-center gap-2 z-10 min-w-[60px]">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${statusColor}`}>
                {status === "completed" && <CheckCircle size={14} />}
                {status === "active" && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
            </div>
            <span className={`text-[10px] font-bold ${status === "active" ? "text-blue-500" : "text-zinc-500"}`}>{label}</span>
        </div>
    );
}

const ResourceItem = ({ title, tag, type, isDark }: any) => (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 hover:bg-white/5 cursor-pointer ${isDark ? "border-white/5" : "border-zinc-100"}`}>
        <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-[10px] text-white ${type === "note" ? "bg-blue-500" : type === "resume" ? "bg-orange-500" : "bg-green-500"}`}>
            {tag.substring(0, 1)}
        </div>
        <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-bold truncate ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>{title}</h4>
        </div>
        <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
    </div>
);