"use client";

import React from "react";
import { Users, BookOpen, Clock, AlertCircle } from "lucide-react";

interface FacultyAnalyticsProps {
  isDark: boolean;
}

export default function FacultyAnalytics({ isDark }: FacultyAnalyticsProps) {
  
  // Theme Helpers
  const cardClass = `p-6 rounded-md border shadow-sm ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`;
  const textHead = isDark ? "text-slate-100" : "text-slate-900";
  const textSub = isDark ? "text-slate-400" : "text-slate-500";

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
            <h2 className={`text-2xl font-bold ${textHead}`}>Class Analytics</h2>
            <p className={`text-sm ${textSub}`}>Performance metrics for Semester 4 (Computer Engineering).</p>
        </div>
        <select className={`px-3 py-2 rounded-md border text-sm outline-none ${isDark ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-white border-slate-300 text-slate-700"}`}>
            <option>Last 30 Days</option>
            <option>This Semester</option>
            <option>All Time</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Students" value="142" change="+2" icon={Users} color="blue" isDark={isDark} />
        <KPICard title="Notes Verified" value="89%" change="+12%" icon={BookOpen} color="emerald" isDark={isDark} />
        <KPICard title="Avg. Attendance" value="76%" change="-4%" icon={Clock} color="orange" isDark={isDark} />
        <KPICard title="At Risk" value="8" change="High" icon={AlertCircle} color="red" isDark={isDark} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Simple Bar Chart (Attendance) */}
        <div className={`lg:col-span-2 ${cardClass}`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-6 ${textSub}`}>Weekly Attendance Trends</h3>
            <div className="flex items-end justify-between h-64 gap-2">
                {[65, 70, 85, 72, 90, 88, 76, 82, 60, 95, 80, 85].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end items-center group">
                        <div 
                            style={{ height: `${h}%` }} 
                            className={`w-full rounded-t-sm transition-all duration-500 ${isDark ? "bg-blue-600/60 group-hover:bg-blue-500" : "bg-blue-500/80 group-hover:bg-blue-600"}`} 
                        />
                        <span className="text-[10px] mt-2 text-slate-500">W{i+1}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Skill Distribution (Simple List) */}
        <div className={`lg:col-span-1 ${cardClass}`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-6 ${textSub}`}>Skill Interest Distribution</h3>
            <div className="space-y-4">
                <SkillBar label="Full Stack Dev" percent={65} color="bg-indigo-500" isDark={isDark} />
                <SkillBar label="Data Science" percent={20} color="bg-pink-500" isDark={isDark} />
                <SkillBar label="Cloud/DevOps" percent={10} color="bg-orange-500" isDark={isDark} />
                <SkillBar label="Cybersecurity" percent={5} color="bg-red-500" isDark={isDark} />
            </div>
            
            <div className={`mt-8 p-4 rounded border text-xs leading-relaxed ${isDark ? "bg-slate-950 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                <strong>Insight:</strong> Majority of students are focusing on Web Development stacks. Recommend organizing a React/Node.js workshop.
            </div>
        </div>

      </div>
    </div>
  );
}

// Sub-components
const KPICard = ({ title, value, change, icon: Icon, color, isDark }: any) => {
    const colors: any = {
        blue: isDark ? "text-blue-400 bg-blue-500/10" : "text-blue-600 bg-blue-50",
        emerald: isDark ? "text-emerald-400 bg-emerald-500/10" : "text-emerald-600 bg-emerald-50",
        orange: isDark ? "text-orange-400 bg-orange-500/10" : "text-orange-600 bg-orange-50",
        red: isDark ? "text-red-400 bg-red-500/10" : "text-red-600 bg-red-50",
    };
    const isPositive = change.includes("+");

    return (
        <div className={`p-5 rounded-md border shadow-sm ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-500" : "text-slate-500"}`}>{title}</p>
                    <h3 className={`text-2xl font-bold mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>{value}</h3>
                </div>
                <div className={`p-2 rounded-md ${colors[color]}`}>
                    <Icon size={20} />
                </div>
            </div>
            <div className="mt-3 text-xs">
                <span className={isPositive ? "text-emerald-500" : "text-red-500"}>{change}</span>
                <span className="text-slate-500 ml-1">vs last month</span>
            </div>
        </div>
    );
};

const SkillBar = ({ label, percent, color, isDark }: any) => (
    <div>
        <div className="flex justify-between text-xs mb-1">
            <span className={isDark ? "text-slate-300" : "text-slate-700"}>{label}</span>
            <span className="text-slate-500">{percent}%</span>
        </div>
        <div className={`h-2 rounded-full overflow-hidden ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
            <div style={{ width: `${percent}%` }} className={`h-full ${color}`} />
        </div>
    </div>
);