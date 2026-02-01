"use client";

import React, { useState } from "react";
import { Check, Info, Lock, Star } from "lucide-react";
import { motion } from "framer-motion";
import Confetti from "./Confetti"; 

interface RoadmapViewProps {
  isDark: boolean;
  targetRole: string;
  checkedSkills: string[];
  setCheckedSkills: (skills: string[]) => void;
  roleData: any;
}

export default function RoadmapView({ isDark, targetRole, checkedSkills, setCheckedSkills, roleData }: RoadmapViewProps) {
  const [celebration, setCelebration] = useState<{ type: "standard" | "fireworks" | "none", title?: string, msg?: string }>({ type: "none" });

  // --- UNLOCK LOGIC ---
  const isMandatoryDone = roleData.mandatory.every((s: string) => checkedSkills.includes(s));
  const isAdvancedDone = roleData.advanced.every((s: string) => checkedSkills.includes(s));

  // --- NEW STAMP LOGIC ---
  // A section is "NEW" if it is unlocked BUT no skills in it are checked yet.
  const isAdvancedNew = isMandatoryDone && !roleData.advanced.some((s: string) => checkedSkills.includes(s));
  const isOptionalNew = isAdvancedDone && !roleData.optional.some((s: string) => checkedSkills.includes(s));

  const handleCheck = (skill: string, category: "mandatory" | "advanced" | "optional") => {
    let newChecked: string[] = [];
    if (checkedSkills.includes(skill)) {
        newChecked = checkedSkills.filter(s => s !== skill);
        setCheckedSkills(newChecked);
    } else {
        newChecked = [...checkedSkills, skill];
        setCheckedSkills(newChecked);

        // Check Completion
        const categorySkills = roleData[category] || [];
        const isCategoryComplete = categorySkills.every((s: string) => newChecked.includes(s));

        if (isCategoryComplete) {
            let title = "", msg = "";
            if (category === "mandatory") { title = "FOUNDATION SET!"; msg = "You have unlocked Advanced Skills."; }
            else if (category === "advanced") { title = "MASTER CLASS!"; msg = "You have unlocked Optional Skills."; }
            else { title = "COMPLETIONIST!"; msg = "You have conquered this role entirely."; }
            
            setCelebration({ type: "fireworks", title, msg });
            setTimeout(() => setCelebration({ type: "none" }), 5000);
        } else {
            setCelebration({ type: "standard" });
            setTimeout(() => setCelebration({ type: "none" }), 3000);
        }
    }
  };

  const textMain = isDark ? "text-white" : "text-zinc-900";
  const cardBg = isDark ? "bg-zinc-900/40 border-white/5" : "bg-white border-zinc-200 shadow-sm";

  if (!targetRole) return <div className="p-10 text-center text-zinc-500">Please select a Target Role in your Profile.</div>;

  const totalSkills = roleData.mandatory.length + roleData.advanced.length + roleData.optional.length;

  return (
    <div className="relative pb-20">
      {celebration.type !== "none" && <Confetti type={celebration.type as any} title={celebration.title} message={celebration.msg} />}

      <div className="mb-8">
        <div className="flex justify-between items-center">
            <h2 className={`text-2xl font-bold ${textMain}`}>{targetRole} Roadmap</h2>
            <div className={`text-xs font-bold px-3 py-1 rounded-full border ${isDark ? "bg-zinc-800 border-zinc-700 text-zinc-400" : "bg-zinc-100 border-zinc-200 text-zinc-600"}`}>
                Progress: {checkedSkills.length} / {totalSkills}
            </div>
        </div>
        <div className={`mt-2 p-3 rounded-lg flex items-start gap-3 border ${isDark ? "bg-blue-900/10 border-blue-500/20 text-blue-300" : "bg-blue-50 border-blue-200 text-blue-700"}`}>
            <Info size={18} className="shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed opacity-90">This module is meant for your personal tracking of skills. Please be honest with marking the completions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Mandatory - Always Unlocked */}
        <RoadmapColumn title="Mandatory" colorClass="border-red-500/50" badgeClass="bg-red-500 text-white" skills={roleData.mandatory} checkedSkills={checkedSkills} onCheck={(s: string) => handleCheck(s, "mandatory")} isDark={isDark} cardBg={cardBg} />

        {/* Advanced - Locked until Mandatory done */}
        <RoadmapColumn 
            title="Advanced" 
            colorClass="border-blue-500/50" 
            badgeClass="bg-blue-500 text-white"
            skills={roleData.advanced} 
            checkedSkills={checkedSkills} 
            onCheck={(s: string) => handleCheck(s, "advanced")} 
            isDark={isDark} 
            cardBg={cardBg}
            isLocked={!isMandatoryDone}
            isNew={isAdvancedNew}
        />

        {/* Optional - Locked until Advanced done */}
        <RoadmapColumn 
            title="Optional" 
            colorClass="border-emerald-500/50" 
            badgeClass="bg-emerald-500 text-white"
            skills={roleData.optional} 
            checkedSkills={checkedSkills} 
            onCheck={(s: string) => handleCheck(s, "optional")} 
            isDark={isDark} 
            cardBg={cardBg}
            isLocked={!isAdvancedDone}
            isNew={isOptionalNew}
        />

      </div>
    </div>
  );
}

const RoadmapColumn = ({ title, colorClass, badgeClass, skills, checkedSkills, onCheck, isDark, cardBg, isLocked = false, isNew = false }: any) => {
    if (!skills) return null; 

    return (
        <div className={`relative rounded-2xl border-t-4 p-4 transition-all duration-500 ${cardBg} ${colorClass} ${isLocked ? "opacity-50 blur-[2px] grayscale pointer-events-none select-none" : "opacity-100"}`}>
            
            {/* LOCK OVERLAY */}
            {isLocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <div className="p-3 bg-zinc-900 rounded-full border border-white/20 shadow-xl">
                        <Lock size={24} className="text-zinc-400" />
                    </div>
                    <span className="mt-2 text-xs font-bold text-zinc-500 bg-zinc-900/80 px-2 py-1 rounded">LOCKED</span>
                </div>
            )}

            {/* NEW STAMP */}
            {!isLocked && isNew && (
                <motion.div 
                    initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 12 }} 
                    className="absolute -top-6 -right-4 z-20 bg-yellow-400 text-black font-black text-xs px-3 py-1 shadow-lg border-2 border-white rotate-12"
                >
                    NEW!!
                </motion.div>
            )}

            <div className="flex items-center justify-between mb-6">
                <h3 className={`font-bold ${isDark ? "text-white" : "text-zinc-800"}`}>{title}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${badgeClass}`}>{skills.length} Nodes</span>
            </div>
            
            <div className="space-y-3">
                {skills.map((skill: string) => {
                    const isChecked = checkedSkills.includes(skill);
                    return (
                        <div key={skill} onClick={() => !isLocked && onCheck(skill)} className={`group flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isChecked ? (isDark ? "bg-green-900/20 border-green-500/30" : "bg-green-50 border-green-200") : (isDark ? "bg-black/20 border-white/5 hover:border-white/20" : "bg-zinc-50 border-zinc-200 hover:border-zinc-300")}`}>
                            <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${isChecked ? "bg-green-500 border-green-500 text-white" : (isDark ? "border-zinc-600 group-hover:border-zinc-400" : "border-zinc-400 group-hover:border-zinc-600")}`}>
                                {isChecked && <Check size={12} strokeWidth={4} />}
                            </div>
                            <span className={`text-sm ${isChecked ? (isDark ? "text-green-400 line-through opacity-70" : "text-green-800 line-through opacity-70") : (isDark ? "text-zinc-300" : "text-zinc-700")}`}>{skill}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};