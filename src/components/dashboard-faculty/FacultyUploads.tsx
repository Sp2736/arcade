"use client";

import React, { useState } from "react";
import { UploadCloud, FileText, FileBadge, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface FacultyUploadsProps {
  isDark: boolean;
  onSimulateHODResponse: (approved: boolean) => void; // Prop to trigger notification
}

export default function FacultyUploads({ isDark, onSimulateHODResponse }: FacultyUploadsProps) {
  const [activeTab, setActiveTab] = useState<"material" | "resume">("material");
  const [uploads, setUploads] = useState([
    { id: 1, title: "Data Structures Notes", type: "Material", date: "Oct 20, 2025", status: "Published" },
    { id: 2, title: "My Updated Resume", type: "Resume", date: "Oct 25, 2025", status: "Pending HOD" },
  ]);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const newUpload = {
        id: Date.now(),
        title: activeTab === "resume" ? "Faculty Resume 2026" : "New Study Material",
        type: activeTab === "resume" ? "Resume" : "Material",
        date: "Just now",
        status: activeTab === "resume" ? "Pending HOD" : "Published"
    };
    setUploads([newUpload, ...uploads]);
  };

  // Theme Constants
  const cardClass = `p-6 rounded-md border shadow-sm ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`;
  const inputClass = `w-full px-3 py-2 rounded-md border text-sm outline-none transition-all focus:border-blue-500 ${isDark ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-white border-slate-300 text-slate-900"}`;
  const labelClass = `block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>My Uploads</h2>
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>Manage your shared resources and profile documents.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className={`lg:col-span-1 ${cardClass}`}>
            <div className="flex border-b mb-6 pb-1 gap-4 border-slate-200 dark:border-slate-800">
                <button onClick={() => setActiveTab("material")} className={`text-sm font-bold pb-2 border-b-2 transition-colors ${activeTab === "material" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>Upload Material</button>
                <button onClick={() => setActiveTab("resume")} className={`text-sm font-bold pb-2 border-b-2 transition-colors ${activeTab === "resume" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>Upload Resume</button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
                <div>
                    <label className={labelClass}>Title</label>
                    <input type="text" placeholder="e.g. Unit 4 Notes" className={inputClass} required />
                </div>
                {activeTab === "material" && (
                    <div>
                        <label className={labelClass}>Subject</label>
                        <select className={inputClass}>
                            <option>Operating Systems</option>
                            <option>Computer Networks</option>
                        </select>
                    </div>
                )}
                <div>
                    <label className={labelClass}>File Attachment</label>
                    <div className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${isDark ? "border-slate-800 hover:bg-slate-800/50" : "border-slate-200 hover:bg-slate-50"}`}>
                        <UploadCloud className="mx-auto mb-2 opacity-50" size={24} />
                        <span className="text-xs font-medium opacity-70">Click to upload PDF/DOCX</span>
                    </div>
                </div>

                {activeTab === "resume" && (
                    <div className={`text-xs p-3 rounded border ${isDark ? "bg-amber-900/10 border-amber-900/30 text-amber-400" : "bg-amber-50 border-amber-200 text-amber-700"}`}>
                        <div className="flex gap-2 font-bold mb-1"><Clock size={14} /> Approval Required</div>
                        Resumes must be approved by the HOD before appearing on your public profile.
                    </div>
                )}

                <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md text-sm transition-colors">
                    Upload {activeTab === "resume" ? "Resume" : "Material"}
                </button>
            </form>
        </div>

        {/* Upload History List */}
        <div className={`lg:col-span-2 ${cardClass}`}>
             <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Recent Uploads</h3>
             <div className="space-y-3">
                {uploads.map((item) => (
                    <div key={item.id} className={`flex items-center justify-between p-4 rounded-md border ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-md ${isDark ? "bg-slate-900 text-slate-400" : "bg-white text-slate-500 border border-slate-200"}`}>
                                {item.type === "Resume" ? <FileBadge size={20} /> : <FileText size={20} />}
                            </div>
                            <div>
                                <h4 className={`text-sm font-bold ${isDark ? "text-slate-200" : "text-slate-900"}`}>{item.title}</h4>
                                <p className="text-xs text-slate-500">{item.type} • {item.date}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            {/* Status Badge */}
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                                item.status === "Published" 
                                    ? (isDark ? "bg-emerald-900/20 text-emerald-400 border-emerald-900/50" : "bg-emerald-50 text-emerald-700 border-emerald-100") 
                                    : (isDark ? "bg-amber-900/20 text-amber-400 border-amber-900/50" : "bg-amber-50 text-amber-700 border-amber-100")
                            }`}>
                                {item.status}
                            </span>

                            {/* DEV TOOLS: Simulate HOD Action */}
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