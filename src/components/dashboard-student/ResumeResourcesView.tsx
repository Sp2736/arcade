"use client";

import React, { useState } from "react";
import { FileText, ExternalLink, Download, Globe, Code } from "lucide-react";

interface ResourceViewProps {
  isDark: boolean;
  initialTab?: "resumes" | "resources";
}

export default function ResumeResourcesView({ isDark, initialTab = "resumes" }: ResourceViewProps) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Theme Constants
  const textMain = isDark ? "text-white" : "text-zinc-900";
  const textSub = isDark ? "text-zinc-500" : "text-zinc-500";

  return (
    <div className="h-full flex flex-col space-y-6">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${textMain}`}>
            {activeTab === "resumes" ? "Resume Archives" : "Practice Zone"}
          </h2>
          <p className={textSub}>
            {activeTab === "resumes" 
                ? "Verified formats approved by the placement cell." 
                : "Curated external platforms to sharpen your skills."}
          </p>
        </div>
        
        {/* Consistent Tab Switcher */}
        <div className={`flex p-1 rounded-lg border ${isDark ? "bg-zinc-800/50 border-white/5" : "bg-zinc-100 border-zinc-200"}`}>
            <button 
                onClick={() => setActiveTab("resumes")}
                className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${
                    activeTab === "resumes" 
                        ? (isDark ? "bg-zinc-800 text-white shadow" : "bg-white text-black shadow-sm border border-zinc-200") 
                        : "text-zinc-500"
                }`}
            >
                Resumes
            </button>
            <button 
                onClick={() => setActiveTab("resources")}
                className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${
                    activeTab === "resources" 
                        ? (isDark ? "bg-zinc-800 text-white shadow" : "bg-white text-black shadow-sm border border-zinc-200") 
                        : "text-zinc-500"
                }`}
            >
                Resources
            </button>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-10">
        
        {activeTab === "resumes" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ResumeCard title="SDE Intern Format (Google)" role="Software Dev" downloads={120} isDark={isDark} />
                <ResumeCard title="Data Analyst Standard" role="Data Science" downloads={85} isDark={isDark} />
                <ResumeCard title="Frontend React Specialist" role="Web Dev" downloads={200} isDark={isDark} />
                <ResumeCard title="Academic CV (Masters)" role="Research" downloads={40} isDark={isDark} />
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-3">
                <ResourceLink title="LeetCode: Top 75 Questions" desc="Essential DSA practice." category="Coding" url="leetcode.com" icon={Code} isDark={isDark} />
                <ResourceLink title="NeetCode Roadmap" desc="Structured video solutions." category="Learning" url="neetcode.io" icon={Globe} isDark={isDark} />
                <ResourceLink title="System Design Primer" desc="GitHub repo for scalability." category="Architecture" url="github.com" icon={Code} isDark={isDark} />
            </div>
        )}
      </div>
    </div>
  );
}

const ResumeCard = ({ title, role, downloads, isDark }: any) => (
    <div className={`group p-5 rounded-2xl border transition-all hover:-translate-y-1 ${isDark ? "bg-zinc-900/40 border-white/5 hover:border-orange-500/30" : "bg-white border-zinc-200 shadow-sm hover:shadow-md"}`}>
        <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center"><FileText size={20} /></div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-zinc-500/10 text-zinc-500 px-2 py-1 rounded-full">ReadOnly</span>
        </div>
        <h3 className={`font-bold text-lg mb-1 ${isDark ? "text-white" : "text-zinc-900"}`}>{title}</h3>
        <p className={`text-xs mb-4 ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>{role}</p>
        <div className="flex items-center justify-between pt-4 border-t border-dashed border-zinc-700/20">
            <span className="text-xs text-zinc-500">{downloads} Downloads</span>
            <button className={`p-2 rounded-lg transition-colors ${isDark ? "bg-white/5 hover:bg-white/10 text-orange-400" : "bg-orange-50 hover:bg-orange-100 text-orange-600"}`}><Download size={16} /></button>
        </div>
    </div>
);

const ResourceLink = ({ title, desc, category, icon: Icon, isDark }: any) => (
    <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all group ${isDark ? "bg-zinc-900/40 border-white/5 hover:bg-white/5" : "bg-white border-zinc-200 hover:shadow-sm"}`}>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"}`}><Icon size={20} /></div>
        <div className="flex-1">
            <h4 className={`font-bold text-sm ${isDark ? "text-white" : "text-zinc-900"}`}>{title}</h4>
            <p className="text-xs text-zinc-500">{desc}</p>
        </div>
        <div className="flex items-center gap-3">
            <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded hidden md:block ${isDark ? "bg-zinc-800 text-zinc-400" : "bg-zinc-100 text-zinc-600"}`}>{category}</span>
            <ExternalLink size={16} className="text-zinc-500 group-hover:text-blue-500 transition-colors" />
        </div>
    </div>
);