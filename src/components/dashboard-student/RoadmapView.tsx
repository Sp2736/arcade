"use client";

import React, { useState, useEffect } from "react";
import { Check, Info, Lock } from "lucide-react";
import { motion } from "framer-motion";
import Confetti from "./Confetti"; 
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

interface RoadmapViewProps {
  isDark: boolean;
  targetRole: string;
  checkedSkills: string[];
  setCheckedSkills: (skills: string[]) => void;
  roleData: any;
  user: any; // Added user prop
}

export default function RoadmapView({ isDark, targetRole, checkedSkills, setCheckedSkills, roleData, user }: RoadmapViewProps) {
  const [celebration, setCelebration] = useState<{ type: "standard" | "fireworks" | "none", title?: string, msg?: string }>({ type: "none" });

  // Fetch progress on load
  useEffect(() => {
    const fetchProgress = async () => {
        if (!user?.user_id) return;
        const { data: { session } } = await supabase.auth.getSession();
        try {
            const res = await fetch(`/api/progress?student_id=${user.user_id}`, {
                headers: { 'Authorization': `Bearer ${session?.access_token}` }
            });
            const data = await res.json();
            if (data.progress && data.progress.completed_nodes) {
                setCheckedSkills(data.progress.completed_nodes);
            }
        } catch (error) { console.error("Failed to load progress"); }
    };
    fetchProgress();
  }, [user]);

  const saveProgressToDb = async (newSkills: string[]) => {
      const { data: { session } } = await supabase.auth.getSession();
      await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
          body: JSON.stringify({
              student_id: user.user_id,
              target_role: targetRole,
              completed_nodes: newSkills
          })
      });
  };

  const handleCheck = (skill: string, category: "mandatory" | "advanced" | "optional") => {
    let newChecked: string[] = [];
    if (checkedSkills.includes(skill)) {
        newChecked = checkedSkills.filter(s => s !== skill);
    } else {
        newChecked = [...checkedSkills, skill];
        const categorySkills = roleData[category] || [];
        const isCategoryComplete = categorySkills.every((s: string) => newChecked.includes(s));
        if (isCategoryComplete) {
            let title = category === "mandatory" ? "FOUNDATION SET!" : category === "advanced" ? "MASTER CLASS!" : "COMPLETIONIST!";
            setCelebration({ type: "fireworks", title, msg: "Great job!" });
            setTimeout(() => setCelebration({ type: "none" }), 5000);
        }
    }
    setCheckedSkills(newChecked);
    saveProgressToDb(newChecked); // Persist
  };

  const isMandatoryDone = roleData.mandatory.every((s: string) => checkedSkills.includes(s));
  const isAdvancedDone = roleData.advanced.every((s: string) => checkedSkills.includes(s));

  const textMain = isDark ? "text-white" : "text-zinc-900";
  const cardBg = isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200 shadow-sm";

  if (!targetRole) return <div className="p-10 text-center text-zinc-500">Please select a Target Role in your Profile.</div>;

  const totalSkills = roleData.mandatory.length + roleData.advanced.length + roleData.optional.length;

  return (
    <div className="relative pb-20">
      {celebration.type !== "none" && <Confetti type={celebration.type as any} title={celebration.title} message={celebration.msg} />}

      <div className="mb-8 flex justify-between items-center">
            <h2 className={`text-2xl font-bold ${textMain}`}>{targetRole} Roadmap</h2>
            <div className={`text-xs font-bold px-3 py-1 rounded-full border ${isDark ? "bg-zinc-800 border-zinc-700 text-zinc-400" : "bg-zinc-100 border-zinc-200 text-zinc-600"}`}>
                Progress: {checkedSkills.length} / {totalSkills}
            </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RoadmapColumn title="Mandatory" colorClass="border-red-500/50" badgeClass="bg-red-500" skills={roleData.mandatory} checkedSkills={checkedSkills} onCheck={(s: string) => handleCheck(s, "mandatory")} isDark={isDark} cardBg={cardBg} />
        <RoadmapColumn title="Advanced" colorClass="border-blue-500/50" badgeClass="bg-blue-500" skills={roleData.advanced} checkedSkills={checkedSkills} onCheck={(s: string) => handleCheck(s, "advanced")} isDark={isDark} cardBg={cardBg} isLocked={!isMandatoryDone} />
        <RoadmapColumn title="Optional" colorClass="border-emerald-500/50" badgeClass="bg-emerald-500" skills={roleData.optional} checkedSkills={checkedSkills} onCheck={(s: string) => handleCheck(s, "optional")} isDark={isDark} cardBg={cardBg} isLocked={!isAdvancedDone} />
      </div>
    </div>
  );
}

const RoadmapColumn = ({ title, colorClass, badgeClass, skills, checkedSkills, onCheck, isDark, cardBg, isLocked = false }: any) => {
    if (!skills) return null; 
    return (
        <div className={`relative rounded-2xl border-t-4 p-4 transition-all ${cardBg} ${colorClass}`}>
            {isLocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 backdrop-blur-sm rounded-2xl">
                    <Lock size={28} className={isDark ? "text-zinc-400" : "text-zinc-600"} />
                    <span className="mt-3 text-xs font-black tracking-widest px-3 py-1 bg-black text-white rounded-full">LOCKED</span>
                </div>
            )}
            <div className={`space-y-3 ${isLocked ? "opacity-20 pointer-events-none" : "opacity-100"}`}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className={`font-bold ${isDark ? "text-white" : "text-zinc-800"}`}>{title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${badgeClass}`}>{skills.length} Nodes</span>
                </div>
                {skills.map((skill: string) => {
                    const isChecked = checkedSkills.includes(skill);
                    return (
                        <div key={skill} onClick={() => !isLocked && onCheck(skill)} className={`group flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isChecked ? (isDark ? "bg-green-900/20 border-green-500/30" : "bg-green-50 border-green-200") : (isDark ? "bg-black border-zinc-800" : "bg-zinc-50 border-zinc-200")}`}>
                            <div className={`w-5 h-5 rounded flex items-center justify-center border ${isChecked ? "bg-green-500 border-green-500 text-white" : "border-zinc-400"}`}>
                                {isChecked && <Check size={12} strokeWidth={4} />}
                            </div>
                            <span className={`text-sm ${isChecked ? "text-green-500 line-through opacity-70" : (isDark ? "text-zinc-300" : "text-zinc-700")}`}>{skill}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};