"use client";

import React, { useState } from "react";
import { FileText, ExternalLink, Download, Globe, Code, ChevronLeft, BookOpen, Layers, Filter, Briefcase, Award, GraduationCap, Star, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ResourceViewProps {
  isDark: boolean;
  initialTab?: "resumes" | "resources";
}

// ... [RESUME_DATA, SUBJECTS_DATA, RESOURCES_DATA remain the same] ...
const RESUME_DATA = [
    { id: 1, domain: "Software Engineering", level: "intern", reference: "Google STEP Intern Format", downloads: 145 },
    { id: 2, domain: "Data Science", level: "intern", reference: "Data Analyst Intern (Startups)", downloads: 89 },
    { id: 3, domain: "Web Development", level: "intern", reference: "Frontend React Intern", downloads: 210 },
    { id: 4, domain: "Software Engineering", level: "fresher", reference: "SDE-1 Standard Format", downloads: 300 },
    { id: 5, domain: "Backend Development", level: "fresher", reference: "Java Backend Associate", downloads: 120 },
    { id: 6, domain: "Cybersecurity", level: "fresher", reference: "Security Analyst L1", downloads: 45 },
    { id: 7, domain: "Management", level: "fresher", reference: "Product Management Associate", downloads: 120 },
    { id: 8, domain: "Software Engineering", level: "experienced", reference: "Senior SDE (3+ Yrs)", downloads: 110 },
    { id: 9, domain: "Data Science", level: "experienced", reference: "Senior Data Scientist", downloads: 75 },
    { id: 10, domain: "DevOps", level: "experienced", reference: "Cloud Architect Lead", downloads: 60 },
    { id: 11, domain: "Software Engineering", level: "advanced", reference: "Principal Engineer (FAANG)", downloads: 500 },
    { id: 12, domain: "Management", level: "advanced", reference: "CTO / VP of Engineering", downloads: 340 },
    { id: 13, domain: "Research", level: "advanced", reference: "PhD Research Fellow (AI)", downloads: 200 },
];

const SUBJECTS_DATA = [
    { id: "math1", title: "Engineering Mathematics I", code: "MA101", semester: "Sem 1", count: 12, icon: BookOpen, color: "blue" },
    { id: "phy", title: "Engineering Physics", code: "PY101", semester: "Sem 1", count: 8, icon: Layers, color: "orange" },
    { id: "bee", title: "Basic Electrical Eng.", code: "EE102", semester: "Sem 2", count: 15, icon: Code, color: "green" },
    { id: "eg", title: "Engineering Graphics", code: "ME102", semester: "Sem 2", count: 6, icon: Layers, color: "red" },
    { id: "dsa", title: "Data Structures", code: "CS301", semester: "Sem 3", count: 12, icon: Code, color: "blue" },
    { id: "os", title: "Operating Systems", code: "CS402", semester: "Sem 4", count: 8, icon: Layers, color: "orange" },
    { id: "dbms", title: "Database Mgmt", code: "CS403", semester: "Sem 4", count: 15, icon: BookOpen, color: "green" },
    { id: "cn", title: "Computer Networks", code: "CS501", semester: "Sem 5", count: 10, icon: Globe, color: "purple" },
    { id: "web", title: "Web Technologies", code: "CS504", semester: "Sem 5", count: 20, icon: Code, color: "pink" },
    { id: "ai", title: "Artificial Intelligence", code: "CS601", semester: "Sem 6", count: 6, icon: Layers, color: "red" },
    { id: "cd", title: "Compiler Design", code: "CS702", semester: "Sem 7", count: 5, icon: Code, color: "purple" },
    { id: "cc", title: "Cloud Computing", code: "CS801", semester: "Sem 8", count: 10, icon: Globe, color: "blue" },
];

const RESOURCES_DATA: any = {
    "dsa": [
        { title: "LeetCode: Top 75 Questions", desc: "Essential DSA practice set.", category: "Coding", url: "leetcode.com", icon: Code },
        { title: "NeetCode Roadmap", desc: "Structured video solutions.", category: "Learning", url: "neetcode.io", icon: Globe },
        { title: "Striver's SDE Sheet", desc: "Complete placement prep.", category: "Guide", url: "takeuforward.org", icon: BookOpen },
    ],
    "os": [
        { title: "OS Dinosaur Book PDF", desc: "Standard reference book.", category: "Book", url: "drive.google.com", icon: BookOpen },
        { title: "Process Scheduling Visualizer", desc: "Interactive scheduling simulator.", category: "Tool", url: "github.com", icon: Code },
    ],
    "math1": [
        { title: "Calculus Notes (Unit 1)", desc: "Differentiation & Integration basics.", category: "Note", url: "#", icon: FileText },
    ]
};

export default function ResumeResourcesView({ isDark, initialTab = "resumes" }: ResourceViewProps) {
  const activeTab = initialTab; 
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [semesterFilter, setSemesterFilter] = useState("All");
  const [domainFilter, setDomainFilter] = useState("All");

  const filteredSubjects = semesterFilter === "All" ? SUBJECTS_DATA : SUBJECTS_DATA.filter(s => s.semester === semesterFilter);
  const uniqueDomains = ["All", ...Array.from(new Set(RESUME_DATA.map(r => r.domain)))];
  const getResumesByLevel = (level: string) => {
    return RESUME_DATA.filter(r => r.level === level && (domainFilter === "All" || r.domain === domainFilter));
  };

  const textMain = isDark ? "text-white" : "text-zinc-900";
  const textSub = isDark ? "text-zinc-500" : "text-zinc-500";
  const optionClass = isDark ? "bg-zinc-900 text-white" : "bg-white text-zinc-900";
  // UPDATED BORDER/BG
  const dropdownBorder = isDark ? "bg-[#09090b] border-white/10" : "bg-white border-zinc-300";

  return (
    <div className="h-full flex flex-col space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${textMain}`}>
            {activeTab === "resumes" ? "Resume Archives" : "Practice Zone"}
          </h2>
          <p className={textSub}>
            {activeTab === "resumes" ? "Verified formats classified by experience level." : "Curated external platforms to sharpen your skills."}
          </p>
        </div>

        {activeTab === "resources" && !selectedSubject && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-colors ${dropdownBorder}`}>
                <Filter size={16} className="text-zinc-500" />
                <select value={semesterFilter} onChange={(e) => setSemesterFilter(e.target.value)} className={`bg-transparent border-none outline-none text-sm font-bold cursor-pointer ${textMain}`}>
                    <option value="All" className={optionClass}>All Semesters</option>
                    {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={`Sem ${n}`} className={optionClass}>Semester {n}</option>)}
                </select>
            </div>
        )}

        {activeTab === "resumes" && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-colors ${dropdownBorder}`}>
                <Filter size={16} className="text-zinc-500" />
                <select value={domainFilter} onChange={(e) => setDomainFilter(e.target.value)} className={`bg-transparent border-none outline-none text-sm font-bold cursor-pointer ${textMain}`}>
                    {uniqueDomains.map(d => <option key={d} value={d} className={optionClass}>{d === "All" ? "All Domains" : d}</option>)}
                </select>
            </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-10 relative">
        {activeTab === "resumes" ? (
            <div className="space-y-10">
                <ResumeSection title="Internship Opportunities" icon={GraduationCap} data={getResumesByLevel("intern")} isDark={isDark} color="text-blue-500" />
                <ResumeSection title="Fresher / Entry Level" icon={Briefcase} data={getResumesByLevel("fresher")} isDark={isDark} color="text-emerald-500" />
                <ResumeSection title="Experienced Professionals" icon={Award} data={getResumesByLevel("experienced")} isDark={isDark} color="text-orange-500" />
                <ResumeSection title="Elite & Advanced" icon={Star} data={getResumesByLevel("advanced")} isDark={isDark} color="text-purple-500" isElite={true} />
                {RESUME_DATA.filter(r => domainFilter === "All" || r.domain === domainFilter).length === 0 && (
                    <div className={`text-center p-10 border border-dashed rounded-xl ${isDark ? "border-white/10 text-zinc-500" : "border-zinc-300 text-zinc-400"}`}>No resumes found for this domain.</div>
                )}
            </div>
        ) : (
            <AnimatePresence mode="wait">
                {!selectedSubject ? (
                    <motion.div key="gallery" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredSubjects.length > 0 ? filteredSubjects.map((sub) => (
                            <SubjectCard key={sub.id} data={sub} isDark={isDark} onClick={() => setSelectedSubject(sub.id)} />
                        )) : (
                            <div className={`col-span-full p-12 text-center border border-dashed rounded-2xl ${isDark ? "border-white/10 text-zinc-500" : "border-zinc-300 text-zinc-400"}`}><p>No subjects found for {semesterFilter}.</p></div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                        <button onClick={() => setSelectedSubject(null)} className={`flex items-center gap-2 mb-6 text-sm font-bold transition-colors ${isDark ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-black"}`}><ChevronLeft size={18} /> Back to Subjects</button>
                        <div className="grid grid-cols-1 gap-3">
                            {(RESOURCES_DATA[selectedSubject] || []).length > 0 ? (
                                RESOURCES_DATA[selectedSubject].map((res: any, idx: number) => (
                                    <ResourceLink key={idx} {...res} isDark={isDark} />
                                ))
                            ) : (
                                <div className={`p-10 text-center rounded-xl border border-dashed ${isDark ? "border-white/10 text-zinc-500" : "border-zinc-300 text-zinc-400"}`}>No resources uploaded for this subject yet.</div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        )}
      </div>
    </div>
  );
}

const ResumeSection = ({ title, icon: Icon, data, isDark, color, isElite }: any) => {
    if (data.length === 0) return null;
    return (
        <div className="space-y-4">
            <div className={`flex items-center gap-2 border-b pb-2 ${isDark ? "border-white/5" : "border-zinc-200"}`}>
                <Icon size={20} className={color} />
                <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-zinc-800"}`}>{title}</h3>
                {isElite && <span className="text-[10px] font-bold bg-purple-500 text-white px-2 py-0.5 rounded-full animate-pulse">PREMIUM</span>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map((item: any) => (
                    <ResumeCard key={item.id} {...item} isDark={isDark} isElite={isElite} />
                ))}
            </div>
        </div>
    );
};

const ResumeCard = ({ reference, domain, downloads, isDark, isElite }: any) => (
    // UPDATED BG
    <div className={`group p-5 rounded-2xl border transition-all hover:-translate-y-1 ${isElite ? (isDark ? "bg-gradient-to-br from-purple-900/20 to-black border-purple-500/30" : "bg-gradient-to-br from-purple-50 to-white border-purple-200") : (isDark ? "bg-zinc-900 border-zinc-800 hover:border-blue-500/30" : "bg-white border-zinc-200 shadow-sm hover:shadow-md")}`}>
        <div className="flex justify-between items-start mb-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isElite ? "bg-purple-500/20 text-purple-500" : "bg-blue-500/10 text-blue-500"}`}>
                {isElite ? <Star size={20} fill="currentColor" /> : <FileText size={20} />}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${isDark ? "bg-zinc-800 text-zinc-500" : "bg-zinc-100 text-zinc-500"}`}>PDF</span>
        </div>
        <h3 className={`font-bold text-base mb-1 truncate ${isDark ? "text-white" : "text-zinc-900"}`}>{reference}</h3>
        <p className={`text-xs mb-4 ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>{domain}</p>
        <div className="flex items-center justify-between pt-4 border-t border-dashed border-zinc-700/20">
            <span className="text-xs text-zinc-500">{downloads} Downloads</span>
            <div className="flex gap-2">
                <button title="Preview Resume" className={`p-2 rounded-lg transition-colors ${isDark ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white" : "bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-black"}`}>
                    <Eye size={16} />
                </button>
                <button title="Download PDF" className={`p-2 rounded-lg transition-colors ${isElite ? "bg-purple-600 hover:bg-purple-500 text-white" : (isDark ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-blue-50 hover:bg-blue-100 text-blue-600")}`}>
                    <Download size={16} />
                </button>
            </div>
        </div>
    </div>
);

const SubjectCard = ({ data, isDark, onClick }: any) => {
    const colors: any = {
        blue: isDark ? "text-blue-400 bg-blue-500/10 border-blue-500/20" : "text-blue-600 bg-blue-50 border-blue-200",
        orange: isDark ? "text-orange-400 bg-orange-500/10 border-orange-500/20" : "text-orange-600 bg-orange-50 border-orange-200",
        green: isDark ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-emerald-600 bg-emerald-50 border-emerald-200",
        purple: isDark ? "text-purple-400 bg-purple-500/10 border-purple-500/20" : "text-purple-600 bg-purple-50 border-purple-200",
        pink: isDark ? "text-pink-400 bg-pink-500/10 border-pink-500/20" : "text-pink-600 bg-pink-50 border-pink-200",
        red: isDark ? "text-red-400 bg-red-500/10 border-red-500/20" : "text-red-600 bg-red-50 border-red-200",
    };

    // UPDATED BG
    return (
        <div onClick={onClick} className={`group relative overflow-hidden p-5 rounded-2xl border transition-all hover:scale-[1.02] cursor-pointer ${isDark ? "bg-zinc-900 border-zinc-800 hover:border-white/10" : "bg-white border-zinc-200 shadow-sm hover:shadow-md"}`}>
            <div className={`absolute -bottom-6 -right-6 z-0 pointer-events-none select-none ${isDark ? "opacity-[0.03] text-white" : "opacity-[0.04] text-black"}`}>
                <span className="text-8xl font-black tracking-tighter -rotate-12 block">{data.code || "SUB"}</span>
            </div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colors[data.color]}`}><data.icon size={22} /></div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${isDark ? "bg-zinc-800 text-zinc-400" : "bg-zinc-100 text-zinc-600"}`}>{data.semester}</span>
                </div>
                <h3 className={`text-lg font-bold mb-1 ${isDark ? "text-white" : "text-zinc-900"}`}>{data.title}</h3>
                <p className={`text-xs ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>{data.count} Resources Available</p>
            </div>
        </div>
    );
}

const ResourceLink = ({ title, desc, category, icon: Icon, isDark }: any) => (
    // UPDATED BG
    <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all group ${isDark ? "bg-zinc-900 border-zinc-800 hover:bg-zinc-800" : "bg-white border-zinc-200 hover:shadow-sm"}`}>
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