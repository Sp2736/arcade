"use client";

import React, { useState } from "react";
import { Search, UploadCloud, Eye, Download, CheckCircle, ShieldCheck, User } from "lucide-react";

interface NotesViewProps {
  isDark: boolean;
}

export default function NotesView({ isDark }: NotesViewProps) {
  const [activeTab, setActiveTab] = useState<"browse" | "uploads">("browse");

  // Theme Constants
  const textMain = isDark ? "text-white" : "text-zinc-900";
  const textSub = isDark ? "text-zinc-500" : "text-zinc-500"; // Darker grey for light mode readability
  const inputBg = isDark ? "bg-zinc-900/50 border-white/10" : "bg-white border-zinc-300";
  
  // Specific fix for Dropdown options visibility
  const selectClass = `px-3 py-2 rounded-lg border text-sm outline-none cursor-pointer transition-colors ${
    isDark 
      ? "bg-zinc-900 border-white/10 text-zinc-300 hover:border-zinc-700" 
      : "bg-white border-zinc-300 text-zinc-700 hover:border-zinc-400"
  }`;

  return (
    <div className="h-full flex flex-col space-y-6">
      
      {/* --- HEADER & CONTROLS --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${textMain}`}>Resource Vault</h2>
          <p className={textSub}>Access verified study materials and share your own.</p>
        </div>
        
        {/* Tab Switcher with High Contrast for Light Mode */}
        <div className={`flex p-1 rounded-lg border ${isDark ? "bg-zinc-800/50 border-white/5" : "bg-zinc-100 border-zinc-200"}`}>
            <button 
                onClick={() => setActiveTab("browse")}
                className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${
                    activeTab === "browse" 
                        ? (isDark ? "bg-zinc-800 text-white shadow" : "bg-white text-black shadow-sm border border-zinc-200") 
                        : (isDark ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200")
                }`}
            >
                Browse Library
            </button>
            <button 
                onClick={() => setActiveTab("uploads")}
                className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${
                    activeTab === "uploads" 
                        ? (isDark ? "bg-zinc-800 text-white shadow" : "bg-white text-black shadow-sm border border-zinc-200") 
                        : (isDark ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200")
                }`}
            >
                My Uploads
            </button>
        </div>
      </div>

      {/* --- FILTERS TOOLBAR --- */}
      <div className={`p-4 rounded-xl border flex flex-wrap gap-4 items-center ${isDark ? "bg-zinc-900/40 border-white/5" : "bg-zinc-50 border-zinc-200"}`}>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border w-full md:w-64 ${inputBg}`}>
            <Search size={16} className={textSub} />
            <input 
                type="text" 
                placeholder="Search topics..." 
                className={`bg-transparent border-none outline-none text-sm w-full ${textMain} placeholder-zinc-500`} 
            />
        </div>
        
        {/* Dropdowns with Fixed Colors */}
        <select className={selectClass}>
            <option>All Semesters</option>
            <option>Semester 4</option>
            <option>Semester 5</option>
        </select>
        
        <select className={selectClass}>
            <option>All Subjects</option>
            <option>Operating Systems</option>
            <option>Data Mining</option>
            <option>Computer Networks</option>
        </select>

        <button className="ml-auto flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-blue-600/20">
            <UploadCloud size={16} />
            <span>Upload Note</span>
        </button>
      </div>

      {/* --- NOTES GRID --- */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto custom-scrollbar pr-2 pb-10">        <NoteCard 
            title="OS: Deadlocks & Scheduling"
            desc="Handwritten notes for Unit 3, covers Banker's Algo."
            subject="Oper. Sys"
            uploader="faculty"
            facultyName="Prof. Sharma"
            isDark={isDark}
        />
        <NoteCard 
            title="DM: Clustering Algorithms"
            desc="K-Means and Hierarchical clustering explained with diagrams."
            subject="Data Mining"
            uploader="student"
            studentName="Rohan Das"
            verifierName="Prof. Varma"
            isDark={isDark}
        />
        <NoteCard 
            title="CN: TCP/IP Model Details"
            desc="Layer-by-layer breakdown of the protocol suite."
            subject="Comp. Network"
            uploader="student"
            studentName="Priya Shah"
            verifierName="Dr. A. Patel"
            isDark={isDark}
        />
        <NoteCard 
            title="Maths: Graph Theory Formulas"
            desc="Cheat sheet for final exam preparation."
            subject="Mathematics"
            uploader="faculty"
            facultyName="Dr. R. Iyer"
            isDark={isDark}
        />
      </div>
    </div>
  );
}

// --- UPDATED NOTE CARD COMPONENT ---
const NoteCard = ({ title, desc, subject, uploader, facultyName, studentName, verifierName, isDark }: any) => {
    
    // Stamp Logic
    const isFaculty = uploader === "faculty";
    const stampColor = isFaculty 
        ? "bg-blue-600 text-white border-blue-500" 
        : "bg-emerald-500 text-white border-emerald-500";
    
    const StampIcon = isFaculty ? ShieldCheck : User;
    const stampLabel = isFaculty ? "FACULTY" : "STUDENT";

    return (
        <div className={`group p-5 rounded-2xl border transition-all hover:-translate-y-1 ${isDark ? "bg-zinc-900/40 border-white/5 hover:border-blue-500/30" : "bg-white border-zinc-200 shadow-sm hover:shadow-md"}`}>
            
            {/* Header: Stamp & Title */}
            <div className="flex justify-between items-start mb-3">
                {/* THE STAMP */}
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest border shadow-sm ${stampColor}`}>
                    <StampIcon size={12} strokeWidth={3} />
                    {stampLabel}
                </div>
                
                {/* Uploader Name (Top Right - Small) */}
                <span className={`text-[10px] font-mono opacity-50 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                    {isFaculty ? facultyName : studentName}
                </span>
            </div>

            <h3 className={`font-bold text-lg mb-1 truncate leading-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
                {title}
            </h3>
            <p className={`text-xs mb-4 line-clamp-2 ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
                {desc}
            </p>

            {/* Footer: Subject & Approver */}
            <div className={`pt-4 border-t ${isDark ? "border-white/5" : "border-zinc-100"}`}>
                
                <div className="flex justify-between items-end mb-3">
                    <div className="flex flex-col">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>Subject</span>
                        <span className={`text-xs font-bold ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>{subject}</span>
                    </div>

                    {/* APPROVED BY SECTION (Only if verified) */}
                    {(verifierName || isFaculty) && (
                        <div className="flex flex-col items-end">
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
                                {isFaculty ? "Published By" : "Verified By"}
                            </span>
                            <div className="flex items-center gap-1">
                                {isFaculty ? (
                                    <ShieldCheck size={12} className="text-blue-500" />
                                ) : (
                                    <CheckCircle size={12} className="text-emerald-500" />
                                )}
                                <span className={`text-xs font-bold ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                                    {isFaculty ? facultyName : verifierName}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-2">
                    <button className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-colors ${isDark ? "bg-white/5 hover:bg-white/10 text-zinc-300" : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"}`}>
                        <Eye size={14} /> View
                    </button>
                    <button className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-colors ${isDark ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-blue-600 hover:bg-blue-500 text-white"}`}>
                        <Download size={14} /> Download
                    </button>
                </div>
            </div>

        </div>
    );
}