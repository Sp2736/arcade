"use client";

import React, { useState } from "react";
import { CheckCircle, Lock, PlayCircle, Map, ChevronRight } from "lucide-react";
import Confetti from "./Confetti"; // <--- IMPORT THIS

interface RoadmapViewProps {
  isDark: boolean;
}

export default function RoadmapView({ isDark }: RoadmapViewProps) {
  // Theme Constants
  const cardBg = isDark ? "bg-zinc-900/40 border-white/5" : "bg-white border-zinc-200 shadow-sm";
  const textMain = isDark ? "text-white" : "text-zinc-900";
  const textSub = isDark ? "text-zinc-500" : "text-zinc-400";

  // Confetti State
  const [showConfetti, setShowConfetti] = useState(false);

  const handleStepComplete = () => {
    // Trigger Confetti
    setShowConfetti(true);
    // Hide it after 2 seconds so it can be triggered again later
    setTimeout(() => setShowConfetti(false), 2000);
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 relative">
      
      {/* --- CONFETTI LAYER --- */}
      {showConfetti && <Confetti />}

      {/* --- LEFT PANEL: PATH SELECTOR --- */}
      <div className={`w-full md:w-1/3 p-6 rounded-2xl border flex flex-col h-fit ${cardBg}`}>
        <h2 className={`text-xl font-bold mb-2 ${textMain}`}>Career Trajectories</h2>
        <p className={`text-xs mb-6 ${textSub}`}>Select a path to view the step-by-step master plan.</p>

        <div className="space-y-3">
            <PathOption title="Frontend Developer" progress={45} isActive={true} isDark={isDark} />
            <PathOption title="Backend Engineer" progress={10} isActive={false} isDark={isDark} />
            <PathOption title="Data Scientist" progress={0} isActive={false} isDark={isDark} />
            <PathOption title="DevOps Architect" progress={0} isActive={false} isDark={isDark} />
        </div>

        <div className={`mt-8 p-4 rounded-xl border border-dashed ${isDark ? "bg-blue-900/10 border-blue-500/20" : "bg-blue-50 border-blue-200"}`}>
            <h4 className={`text-sm font-bold mb-1 ${isDark ? "text-blue-400" : "text-blue-700"}`}>Why follow a roadmap?</h4>
            <p className={`text-xs ${isDark ? "text-blue-300/70" : "text-blue-600/70"}`}>
                Roadmaps prevent "tutorial hell" by giving you a structured, verified path used by industry professionals.
            </p>
        </div>
      </div>

      {/* --- RIGHT PANEL: THE MAP --- */}
      <div className={`flex-1 p-8 rounded-2xl border relative overflow-hidden ${cardBg}`}>
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }}>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <Map className="text-blue-500" />
                <h3 className={`text-2xl font-black uppercase tracking-tight ${textMain}`}>Frontend Mastery</h3>
            </div>

            {/* TIMELINE */}
            <div className="relative border-l-2 border-dashed border-zinc-700/50 ml-4 md:ml-6 space-y-12 pl-8 md:pl-12 py-4">
                
                <RoadmapStep 
                    step="01" title="Internet Fundamentals" desc="DNS, HTTP/HTTPS basics." 
                    status="completed" isDark={isDark} 
                />
                <RoadmapStep 
                    step="02" title="HTML5 & CSS3" desc="Flexbox, Grid, Responsive." 
                    status="completed" isDark={isDark} 
                />
                
                {/* ACTIVE STEP (Clickable for Confetti) */}
                <div onClick={handleStepComplete} className="cursor-pointer">
                    <RoadmapStep 
                        step="03" 
                        title="JavaScript (ES6+)" 
                        desc="DOM, Async/Await. (Click to Complete!)" 
                        status="active" 
                        isDark={isDark} 
                    />
                </div>

                <RoadmapStep 
                    step="04" title="React Framework" desc="Hooks, Context API." 
                    status="locked" isDark={isDark} 
                />
                <RoadmapStep 
                    step="05" title="Deployment" desc="Vercel, Netlify, CI/CD." 
                    status="locked" isDark={isDark} 
                />

            </div>
        </div>
      </div>

    </div>
  );
}

// --- SUB COMPONENTS ---

const PathOption = ({ title, progress, isActive, isDark }: any) => {
    return (
        <button className={`w-full text-left p-4 rounded-xl border transition-all ${isActive ? "bg-blue-600 border-blue-500 shadow-lg shadow-blue-900/20" : (isDark ? "bg-zinc-900 border-zinc-800 hover:border-zinc-700" : "bg-white border-zinc-200 hover:bg-zinc-50")}`}>
            <div className="flex justify-between items-center mb-2">
                <span className={`text-sm font-bold ${isActive ? "text-white" : (isDark ? "text-zinc-300" : "text-zinc-800")}`}>{title}</span>
                {isActive && <ChevronRight size={16} className="text-white" />}
            </div>
            <div className="w-full h-1.5 bg-zinc-700/30 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${isActive ? "bg-white" : "bg-blue-500"}`} style={{ width: `${progress}%` }} />
            </div>
            <p className={`text-[10px] mt-1.5 ${isActive ? "text-blue-100" : "text-zinc-500"}`}>{progress}% Complete</p>
        </button>
    );
}

const RoadmapStep = ({ step, title, desc, status, isDark }: any) => {
    const isCompleted = status === "completed";
    const isActive = status === "active";
    
    let iconColor = "";
    
    if (isCompleted) {
        iconColor = "bg-green-500 text-white border-green-500";
    } else if (isActive) {
        iconColor = "bg-blue-600 text-white border-blue-600 animate-pulse";
    } else {
        iconColor = isDark ? "bg-zinc-800 text-zinc-500 border-zinc-700" : "bg-zinc-200 text-zinc-400 border-zinc-200";
    }

    return (
        <div className="relative group">
            {/* Connector Dot */}
            <div className={`absolute -left-[43px] md:-left-[59px] top-0 w-6 h-6 rounded-full border-4 ${isDark ? "border-[#050505]" : "border-white"} ${iconColor} flex items-center justify-center z-10`}>
                {isCompleted && <CheckCircle size={10} />}
                {isActive && <PlayCircle size={10} />}
                {status === "locked" && <Lock size={10} />}
            </div>

            <div className={`p-5 rounded-xl border transition-all ${isActive ? (isDark ? "bg-blue-900/10 border-blue-500/50" : "bg-blue-50 border-blue-200") : (isDark ? "bg-zinc-900/40 border-white/5 hover:bg-white/5" : "bg-white border-zinc-200 hover:shadow-md")}`}>
                <div className="flex justify-between items-start mb-1">
                    <span className={`text-xs font-mono font-bold ${isActive ? "text-blue-500" : "text-zinc-500"}`}>STEP {step}</span>
                    {isActive && <span className="text-[10px] font-bold bg-blue-500 px-2 py-0.5 rounded text-white">IN PROGRESS</span>}
                </div>
                <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>{title}</h3>
                <p className={`text-sm mt-1 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>{desc}</p>
                
                {isActive && (
                    <button className="mt-4 text-xs font-bold text-blue-500 hover:underline flex items-center gap-1">
                        View Resources <ChevronRight size={12} />
                    </button>
                )}
            </div>
        </div>
    );
}