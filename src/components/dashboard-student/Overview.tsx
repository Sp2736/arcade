"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, Map, Cpu, Award, ArrowRight, UploadCloud, CheckCircle, AlertTriangle } from "lucide-react";

interface OverviewProps {
  isDark: boolean;
}

export default function Overview({ isDark }: OverviewProps) {
  // Theme Colors
  const cardBg = isDark ? "bg-zinc-900/40 border-white/5" : "bg-white border-zinc-200 shadow-sm";
  const textMain = isDark ? "text-white" : "text-zinc-900";
  const textSub = isDark ? "text-zinc-500" : "text-zinc-500";
  
  return (
    <div className="space-y-6">
      
      {/* --- WELCOME BANNER --- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-3xl font-black uppercase tracking-tight ${textMain}`}>Command Center</h2>
          <p className={textSub}>
            Career Target: <span className="text-blue-500 font-bold">FULL STACK DEV</span> // Gap Analysis Active
          </p>
        </div>
        <div className={`px-4 py-2 rounded-lg border flex items-center gap-3 ${isDark ? "bg-blue-900/20 border-blue-500/20 text-blue-400" : "bg-blue-50 border-blue-200 text-blue-700"}`}>
            <Award size={18} />
            <span className="font-bold text-sm">Skill Score: 68/100</span>
        </div>
      </div>

      {/* --- ACTION CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ActionCard 
          title="Share Knowledge"
          desc="Upload your notes for faculty verification."
          icon={UploadCloud}
          color="blue"
          isDark={isDark}
          action="Upload Note"
        />
        <ActionCard 
          title="Analyze Gaps"
          desc="Compare your skills against industry roles."
          icon={Cpu}
          color="purple"
          isDark={isDark}
          action="Check Matrix"
        />
        <ActionCard 
          title="Resume Library"
          desc="Access verified formats for your domain."
          icon={FileText}
          color="orange"
          isDark={isDark}
          action="View Archive"
        />
      </div>

      {/* --- ROADMAP PREVIEW --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        <div className={`col-span-1 lg:col-span-2 rounded-3xl p-6 border ${cardBg} min-h-[300px] flex flex-col`}>
            <div className="flex justify-between items-center mb-6">
                <h3 className={`font-bold text-lg ${textMain}`}>Current Trajectory</h3>
                <span className="text-xs font-mono text-blue-500 font-bold">PHASE 2: FRONTEND MASTERY</span>
            </div>
            
            <div className="flex-1 flex items-center justify-between px-4 relative">
                <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-zinc-700/50 -z-10" />
                <RoadmapNode label="HTML/CSS" status="completed" isDark={isDark} />
                <RoadmapNode label="JS (ES6+)" status="completed" isDark={isDark} />
                <RoadmapNode label="React.js" status="active" isDark={isDark} />
                <RoadmapNode label="Next.js" status="locked" isDark={isDark} />
                <RoadmapNode label="Deployment" status="locked" isDark={isDark} />
            </div>

            <div className={`mt-6 p-4 rounded-xl flex items-start gap-3 ${isDark ? "bg-blue-500/10" : "bg-blue-50 border border-blue-100"}`}>
                <AlertTriangle size={18} className="text-blue-500 shrink-0 mt-0.5" />
                <div>
                    <h4 className={`text-sm font-bold ${isDark ? "text-blue-200" : "text-blue-800"}`}>Next Milestone: React Hooks</h4>
                    <p className={`text-xs ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                        You are 70% through this module. Complete the "State Management" quiz to proceed.
                    </p>
                </div>
            </div>
        </div>

        {/* --- RECENT ACTIVITY --- */}
        <div className={`col-span-1 rounded-3xl p-6 border ${cardBg} flex flex-col`}>
            <h3 className={`font-bold text-lg mb-6 ${textMain}`}>New Resources</h3>
            <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2">
                <ResourceItem title="OS: Process Scheduling" tag="Verified" by="Prof. Sharma" type="note" isDark={isDark} />
                <ResourceItem title="SDE-1 Resume Sample" tag="Resume" by="Admin" type="resume" isDark={isDark} />
                <ResourceItem title="LeetCode: Arrays" tag="Practice" by="External" type="link" isDark={isDark} />
            </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---
const ActionCard = ({ title, desc, icon: Icon, color, isDark, action }: any) => {
    const colors: any = {
        blue: isDark ? "text-blue-400 bg-blue-500/10 border-blue-500/20" : "text-blue-700 bg-blue-50 border-blue-200",
        purple: isDark ? "text-purple-400 bg-purple-500/10 border-purple-500/20" : "text-purple-700 bg-purple-50 border-purple-200",
        orange: isDark ? "text-orange-400 bg-orange-500/10 border-orange-500/20" : "text-orange-700 bg-orange-50 border-orange-200",
    };

    return (
        <motion.div whileHover={{ y: -2 }} className={`p-5 rounded-2xl border ${isDark ? "bg-zinc-900/40 border-white/5" : "bg-white border-zinc-200 shadow-sm"}`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 border ${colors[color]}`}>
                <Icon size={20} />
            </div>
            <h4 className={`text-lg font-bold mb-1 ${isDark ? "text-white" : "text-zinc-900"}`}>{title}</h4>
            <p className={`text-xs mb-4 ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>{desc}</p>
            <button className={`text-xs font-bold flex items-center gap-1 ${colors[color].split(" ")[0]}`}>
                {action} <ArrowRight size={12} />
            </button>
        </motion.div>
    );
}

const RoadmapNode = ({ label, status, isDark }: any) => {
    let statusColor = "";
    if (status === "completed") statusColor = "bg-green-500 text-white border-green-500";
    else if (status === "active") statusColor = "bg-blue-600 text-white border-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]";
    else statusColor = isDark ? "bg-zinc-800 text-zinc-500 border-zinc-700" : "bg-zinc-200 text-zinc-400 border-zinc-300";

    return (
        <div className="flex flex-col items-center gap-2 relative z-10">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${statusColor}`}>
                {status === "completed" ? <CheckCircle size={14} /> : (status === "active" ? <div className="w-2 h-2 bg-white rounded-full animate-pulse" /> : <div className="w-2 h-2 bg-zinc-500 rounded-full" />)}
            </div>
            <span className={`text-[10px] font-medium ${status === "active" ? (isDark ? "text-white" : "text-black") : "text-zinc-500"}`}>{label}</span>
        </div>
    );
}

const ResourceItem = ({ title, tag, by, type, isDark }: any) => {
    return (
        <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isDark ? "bg-black/20 border-white/5 hover:bg-white/5" : "bg-zinc-50 border-zinc-200 hover:bg-white hover:shadow-sm"}`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs text-white shrink-0 ${type === "note" ? "bg-blue-500" : (type === "resume" ? "bg-orange-500" : "bg-green-500")}`}>
                {tag.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-bold truncate ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>{title}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-[10px] text-zinc-500">By {by}</p>
                </div>
            </div>
        </div>
    );
}