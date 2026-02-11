"use client";

import React, { useState } from "react";
import { Link as LinkIcon, FileText, FileBadge, Clock, Briefcase, GraduationCap, AlertCircle } from "lucide-react";

interface FacultyUploadsProps {
  isDark: boolean;
  onSimulateHODResponse: (approved: boolean) => void;
}

const EXPEREINCE_LEVELS = ["intern", "fresher", "experienced"];
const DOMAINS = ["Software Engineering", "Data Science", "Web Development", "App Development", "DevOps", "Cybersecurity"];

export default function FacultyUploads({ isDark, onSimulateHODResponse }: FacultyUploadsProps) {
  const [activeTab, setActiveTab] = useState<"material" | "resume">("material");
  
  // Form State
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Operating Systems");
  const [domain, setDomain] = useState(DOMAINS[0]);
  const [expLevel, setExpLevel] = useState(EXPEREINCE_LEVELS[0]);
  const [driveLink, setDriveLink] = useState(""); // NEW: Drive Link State

  const [uploads, setUploads] = useState([
    { id: 1, title: "Data Structures Notes", type: "Material", date: "Oct 20, 2025", status: "Published", link: "#" },
    { id: 2, title: "My Updated Resume", type: "Resume", date: "Oct 25, 2025", status: "Pending HOD", link: "#" },
  ]);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const newUpload = { 
        id: Date.now(), 
        title: title || (activeTab === "resume" ? "Faculty Resume" : "New Material"), 
        type: activeTab === "resume" ? "Resume" : "Material", 
        date: "Just now", 
        status: activeTab === "resume" ? "Pending HOD" : "Published",
        details: activeTab === "resume" ? `${domain} • ${expLevel}` : subject,
        link: driveLink
    };
    
    setUploads([newUpload, ...uploads]);
    setTitle(""); 
    setDriveLink(""); // Reset
  };

  const cardClass = `p-4 md:p-6 rounded-md border shadow-sm ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`;
  const inputClass = `w-full px-3 py-2 rounded-md border text-sm outline-none transition-all focus:border-blue-500 ${isDark ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-white border-slate-300 text-slate-900"}`;
  const labelClass = `block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`;

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <div>
            <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>My Uploads</h2>
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>Manage your shared resources.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- UPLOAD FORM --- */}
        <div className={`lg:col-span-1 ${cardClass}`}>
            <div className="flex border-b mb-6 pb-1 gap-4 border-slate-200 dark:border-slate-800">
                <button onClick={() => setActiveTab("material")} className={`text-sm font-bold pb-2 border-b-2 transition-colors ${activeTab === "material" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>Upload Material</button>
                <button onClick={() => setActiveTab("resume")} className={`text-sm font-bold pb-2 border-b-2 transition-colors ${activeTab === "resume" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>Upload Resume</button>
            </div>
            
            <form onSubmit={handleUpload} className="space-y-4">
                
                <div>
                    <label className={labelClass}>Title / Reference</label>
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={activeTab === "material" ? "e.g. Unit 4 Notes" : "e.g. Senior SDE Profile"} 
                        className={inputClass} 
                        required 
                    />
                </div>

                {activeTab === "material" && (
                    <div>
                        <label className={labelClass}>Subject</label>
                        <select value={subject} onChange={(e) => setSubject(e.target.value)} className={inputClass}>
                            <option>Operating Systems</option>
                            <option>Computer Networks</option>
                            <option>Data Structures</option>
                        </select>
                    </div>
                )}

                {activeTab === "resume" && (
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                            <label className={labelClass}>Domain</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-2.5 text-slate-500" size={14} />
                                <select value={domain} onChange={(e) => setDomain(e.target.value)} className={`${inputClass} pl-9`}>
                                    {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="col-span-2">
                            <label className={labelClass}>Experience Level</label>
                            <div className="relative">
                                <GraduationCap className="absolute left-3 top-2.5 text-slate-500" size={14} />
                                <select value={expLevel} onChange={(e) => setExpLevel(e.target.value)} className={`${inputClass} pl-9 capitalize`}>
                                    {EXPEREINCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* NEW: URL Input instead of File Dropzone */}
                <div>
                    <label className={labelClass}>Resource Link</label>
                    <div className="relative">
                        <LinkIcon className="absolute left-3 top-2.5 text-blue-500" size={16} />
                        <input 
                            type="url" 
                            value={driveLink}
                            onChange={(e) => setDriveLink(e.target.value)}
                            placeholder="Paste Google Drive link..." 
                            className={`${inputClass} pl-9`} 
                            required 
                        />
                    </div>
                    {/* Permission Warning */}
                    <div className="flex items-start gap-2 mt-2 text-[10px] text-blue-500 bg-blue-500/10 p-2 rounded border border-blue-500/20">
                        <AlertCircle size={12} className="shrink-0 mt-0.5" />
                        <p>Ensure the link access is set to <strong>"Anyone with the link can view"</strong> so students can access it.</p>
                    </div>
                </div>

                {activeTab === "resume" && (
                    <div className={`text-xs p-3 rounded border ${isDark ? "bg-amber-900/10 border-amber-900/30 text-amber-400" : "bg-amber-50 border-amber-200 text-amber-700"}`}>
                        <div className="flex gap-2 font-bold mb-1"><Clock size={14} /> Approval Required</div>
                        Resumes must be approved by the HOD.
                    </div>
                )}

                <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md text-sm transition-colors mt-2">
                    Submit {activeTab === "resume" ? "Resume" : "Material"} Link
                </button>
            </form>
        </div>

        {/* --- RECENT UPLOADS LIST --- */}
        <div className={`lg:col-span-2 ${cardClass}`}>
             <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Recent Uploads</h3>
             <div className="space-y-3">
                {uploads.map((item: any) => (
                    <div key={item.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-md border gap-4 ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-md ${isDark ? "bg-slate-900 text-slate-400" : "bg-white text-slate-500 border border-slate-200"}`}>
                                {item.type === "Resume" ? <FileBadge size={20} /> : <FileText size={20} />}
                            </div>
                            <div>
                                <h4 className={`text-sm font-bold ${isDark ? "text-slate-200" : "text-slate-900"}`}>{item.title}</h4>
                                <p className="text-xs text-slate-500">
                                    {item.type} • {item.date} {item.details && `• ${item.details}`}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 justify-between sm:justify-end w-full sm:w-auto">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${item.status === "Published" ? (isDark ? "bg-emerald-900/20 text-emerald-400 border-emerald-900/50" : "bg-emerald-50 text-emerald-700 border-emerald-100") : (isDark ? "bg-amber-900/20 text-amber-400 border-amber-900/50" : "bg-amber-50 text-amber-700 border-amber-100")}`}>
                                {item.status}
                            </span>
                            {item.status === "Pending HOD" && (
                                <div className="flex flex-col gap-1">
                                    <button onClick={() => onSimulateHODResponse(true)} className="text-[9px] text-emerald-500 hover:underline">Sim: Approve</button>
                                    <button onClick={() => onSimulateHODResponse(false)} className="text-[9px] text-red-500 hover:underline">Sim: Reject</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
             </div>
        </div>
      </div>
    </div>
  );
}