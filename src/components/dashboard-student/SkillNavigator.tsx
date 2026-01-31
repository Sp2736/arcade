"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Check, AlertTriangle, ArrowRight, RefreshCw, Layers } from "lucide-react";

interface SkillNavigatorProps {
    isDark: boolean;
}

// Mock Data for Rule-Based Logic
const TECH_STACK = [
    "HTML/CSS", "JavaScript", "React.js", "Next.js", "Node.js",
    "Python", "Django", "SQL", "MongoDB", "Java",
    "C++", "Docker", "AWS", "Git"
];

const ROLES: any = {
    "Frontend Developer": ["HTML/CSS", "JavaScript", "React.js", "Git"],
    "Backend Developer": ["Node.js", "SQL", "MongoDB", "Docker"],
    "Full Stack Developer": ["React.js", "Node.js", "SQL", "Git", "Docker"],
    "Data Scientist": ["Python", "SQL", "Java"],
};

export default function SkillNavigator({ isDark }: SkillNavigatorProps) {
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [targetRole, setTargetRole] = useState<string | null>(null);
    const [showAnalysis, setShowAnalysis] = useState(false);

    // Theme Constants
    const cardBg = isDark ? "bg-zinc-900/40 border-white/5" : "bg-white border-zinc-200 shadow-sm";
    const textMain = isDark ? "text-white" : "text-zinc-900";
    const textSub = isDark ? "text-zinc-500" : "text-zinc-400";
    const chipBase = isDark ? "bg-zinc-800 text-zinc-400 border-zinc-700" : "bg-zinc-100 text-zinc-600 border-zinc-200";
    const chipActive = "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20";

    const toggleSkill = (tech: string) => {
        if (selectedSkills.includes(tech)) {
            setSelectedSkills(selectedSkills.filter(s => s !== tech));
        } else {
            setSelectedSkills([...selectedSkills, tech]);
        }
    };

    const calculateGap = () => {
        if (!targetRole) return { missing: [], score: 0 };
        const required = ROLES[targetRole];
        const missing = required.filter((req: string) => !selectedSkills.includes(req));
        const score = Math.round(((required.length - missing.length) / required.length) * 100);
        return { missing, score };
    };

    const { missing, score } = calculateGap();

    return (
        <div className="h-full flex flex-col space-y-6">

            {/* --- HEADER --- */}
            <div>
                <h2 className={`text-2xl font-bold ${textMain}`}>Skill Navigator</h2>
                <p className={textSub}>Map your current abilities against industry standards.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full pb-10">
                {/* --- LEFT: INPUTS --- */}
                <div className={`col-span-1 lg:col-span-7 p-6 rounded-2xl border ${cardBg} flex flex-col`}>

                    {/* Step 1: Skills */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">1</div>
                            <h3 className={`font-bold ${textMain}`}>Select Your Tech Stack</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {TECH_STACK.map(tech => (
                                <button
                                    key={tech}
                                    onClick={() => toggleSkill(tech)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${selectedSkills.includes(tech) ? chipActive : chipBase} hover:scale-105`}
                                >
                                    {tech}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Step 2: Role */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">2</div>
                            <h3 className={`font-bold ${textMain}`}>Target Career Role</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {Object.keys(ROLES).map(role => (
                                <button
                                    key={role}
                                    onClick={() => { setTargetRole(role); setShowAnalysis(false); }}
                                    className={`p-3 rounded-xl border text-left transition-all ${targetRole === role ? "bg-blue-600/10 border-blue-500 text-blue-500" : (isDark ? "bg-black/20 border-white/5 hover:border-zinc-600" : "bg-zinc-50 border-zinc-200 hover:border-zinc-400")}`}
                                >
                                    <span className={`text-sm font-bold block ${targetRole === role ? "text-blue-500" : (isDark ? "text-zinc-300" : "text-zinc-700")}`}>{role}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => setShowAnalysis(true)}
                        disabled={!targetRole}
                        className="mt-auto w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        <Cpu size={18} /> Run Gap Analysis
                    </button>
                </div>

                {/* --- RIGHT: ANALYSIS OUTPUT --- */}
                <div className={`col-span-1 lg:col-span-5 p-6 rounded-2xl border flex flex-col justify-center items-center text-center relative overflow-hidden ${cardBg}`}>

                    <AnimatePresence mode="wait">
                        {!showAnalysis ? (
                            <motion.div
                                key="waiting"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="text-zinc-500"
                            >
                                <Layers size={48} className="mx-auto mb-4 opacity-20" />
                                <h3 className="font-bold">Ready to Analyze</h3>
                                <p className="text-xs max-w-xs mx-auto mt-2">Select your skills and a target role to generate a compatibility report.</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="result"
                                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                className="w-full"
                            >
                                <div className="mb-6">
                                    <span className="text-xs font-bold uppercase text-zinc-500 tracking-widest">Compatibility Score</span>
                                    <div className={`text-6xl font-black mt-2 ${score > 70 ? "text-green-500" : (score > 40 ? "text-orange-500" : "text-red-500")}`}>
                                        {score}%
                                    </div>
                                </div>

                                {missing.length === 0 ? (
                                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl mb-6">
                                        <Check className="text-green-500 mx-auto mb-2" />
                                        <p className="text-sm font-bold text-green-500">Perfect Match!</p>
                                        <p className="text-xs text-green-400/70">You are ready for this role.</p>
                                    </div>
                                ) : (
                                    <div className="text-left w-full bg-red-500/5 border border-red-500/10 rounded-xl p-4 mb-6">
                                        <div className="flex items-center gap-2 mb-3 text-red-500">
                                            <AlertTriangle size={16} />
                                            <span className="text-sm font-bold">Missing Critical Skills</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {missing.map((m: string) => (
                                                <span key={m} className="px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded text-xs font-bold">
                                                    {m}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="pt-6 border-t border-dashed border-zinc-700/50">
                                    <h4 className={`text-sm font-bold mb-3 ${textMain}`}>Recommended Action</h4>
                                    <button className={`w-full py-2 rounded-lg text-xs font-bold border flex items-center justify-center gap-2 transition-all ${isDark ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-zinc-50 border-zinc-200 hover:bg-zinc-100"}`}>
                                        View Learning Roadmap <ArrowRight size={12} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>

            </div>
        </div>
    );
}