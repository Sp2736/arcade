"use client";

import React, { useState, useMemo } from "react";
import { Search, UploadCloud, Eye, Download, CheckCircle, ShieldCheck, User, Filter, BookOpen } from "lucide-react";

interface NotesViewProps {
  isDark: boolean;
}

// --- MOCK DATA ---
const ALL_RESOURCES = [
    // SEMESTER 3
    { id: 1, title: "Data Structures: Trees & Graphs", desc: "Complete handwritten notes on AVL, Red-Black trees, and Graph traversals.", subject: "Data Structures", semester: "Semester 3", uploader: "faculty", author: "Prof. Mehta" },
    { id: 2, title: "DBMS: Normalization Guide", desc: "1NF to BCNF explained with real-world examples.", subject: "DBMS", semester: "Semester 3", uploader: "student", author: "Rohan Das", verifier: "Prof. Varma" },
    
    // SEMESTER 4
    { id: 3, title: "OS: Process Scheduling Algorithms", desc: "FCFS, SJF, and Round Robin solved problems.", subject: "Operating Systems", semester: "Semester 4", uploader: "student", author: "Priya Shah", verifier: "Dr. A. Patel" },
    { id: 4, title: "Computer Networks: TCP/IP Model", desc: "Layer-by-layer breakdown of the protocol suite.", subject: "Computer Networks", semester: "Semester 4", uploader: "faculty", author: "Dr. R. Iyer" },
    
    // SEMESTER 5
    { id: 5, title: "DAA: Dynamic Programming", desc: "Knapsack, LCS, and Matrix Chain Multiplication master sheet.", subject: "Algorithms", semester: "Semester 5", uploader: "student", author: "Amit Kumar", verifier: "Prof. Singh" },
    { id: 6, title: "Web Dev: React Hooks Cheatsheet", desc: "Quick reference for useState, useEffect, and custom hooks.", subject: "Web Technologies", semester: "Semester 5", uploader: "student", author: "Swayam Patel", verifier: "Prof. Zala" },

    // SEMESTER 6
    { id: 7, title: "AI: Search Algorithms", desc: "BFS, DFS, A*, and Heuristic search methods.", subject: "Artificial Intelligence", semester: "Semester 6", uploader: "faculty", author: "Dr. K. Nair" },
    { id: 8, title: "Software Eng: Agile vs Waterfall", desc: "Comparative analysis for end-term exams.", subject: "Software Engineering", semester: "Semester 6", uploader: "student", author: "Rahul V.", verifier: "Prof. T. Shah" },

    // SEMESTER 7
    { id: 9, title: "Information Security: Cryptography", desc: "RSA, DES, and AES encryption logic explained.", subject: "Info Security", semester: "Semester 7", uploader: "faculty", author: "Prof. G. Bhatt" },
    
    // SEMESTER 8
    { id: 10, title: "Cloud Computing: AWS Essentials", desc: "EC2, S3, and Lambda functions basics.", subject: "Cloud Computing", semester: "Semester 8", uploader: "student", author: "Neha Gupta", verifier: "Dr. P. Joshi" },
];

const SUBJECTS_LIST = [
    "All Subjects",
    "Data Structures",
    "DBMS",
    "Operating Systems",
    "Computer Networks",
    "Algorithms",
    "Web Technologies",
    "Artificial Intelligence",
    "Software Engineering",
    "Info Security",
    "Cloud Computing"
];

const SEMESTERS_LIST = [
    "All Semesters", "Semester 1", "Semester 2", "Semester 3", "Semester 4", 
    "Semester 5", "Semester 6", "Semester 7", "Semester 8"
];

export default function NotesView({ isDark }: NotesViewProps) {
  const [activeTab, setActiveTab] = useState<"browse" | "uploads">("browse");
  const [selectedSemester, setSelectedSemester] = useState("All Semesters");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [searchQuery, setSearchQuery] = useState("");

  // --- FILTER LOGIC ---
  const filteredResources = useMemo(() => {
    return ALL_RESOURCES.filter(item => {
        const matchesSemester = selectedSemester === "All Semesters" || item.semester === selectedSemester;
        const matchesSubject = selectedSubject === "All Subjects" || item.subject === selectedSubject;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              item.subject.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSemester && matchesSubject && matchesSearch;
    });
  }, [selectedSemester, selectedSubject, searchQuery]);

  // Theme Constants
  const textMain = isDark ? "text-white" : "text-zinc-900";
  const textSub = isDark ? "text-zinc-500" : "text-zinc-500";
  const inputBg = isDark ? "bg-black/40 border-white/10 text-white" : "bg-white border-zinc-300 text-zinc-900";
  
  // Solid background for dropdowns
  const selectClass = `px-3 py-2 rounded-lg border text-sm outline-none cursor-pointer appearance-none transition-colors ${
    isDark 
      ? "bg-[#09090b] border-white/10 text-zinc-300 hover:border-zinc-700" 
      : "bg-white border-zinc-300 text-zinc-700 hover:border-zinc-400"
  }`;

  return (
    <div className="h-full flex flex-col space-y-6">
      
      {/* --- HEADER & CONTROLS --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${textMain}`}>Resource Vault</h2>
          <p className={textSub}>Access verified study materials across all semesters.</p>
        </div>
        
        {/* Tab Switcher */}
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

      {/* --- CONTENT AREA --- */}
      {activeTab === "browse" ? (
        <>
            {/* FILTERS TOOLBAR */}
            <div className={`p-4 rounded-xl border flex flex-wrap gap-4 items-center ${isDark ? "bg-zinc-900/40 border-white/5" : "bg-zinc-50 border-zinc-200"}`}>
                
                {/* Search */}
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border w-full md:w-64 ${inputBg}`}>
                    <Search size={16} className="text-zinc-500" />
                    <input 
                        type="text" 
                        placeholder="Search topics..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm w-full placeholder-zinc-500" 
                    />
                </div>
                
                {/* Semester Dropdown (1-8) */}
                <div className="relative">
                    <select 
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        className={selectClass}
                    >
                        {SEMESTERS_LIST.map(sem => <option key={sem} value={sem}>{sem}</option>)}
                    </select>
                </div>
                
                {/* Subject Dropdown */}
                <div className="relative">
                    <select 
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className={selectClass}
                    >
                        {SUBJECTS_LIST.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                    </select>
                </div>

                {/* Filter Reset (Hidden if no filter) */}
                {(selectedSemester !== "All Semesters" || selectedSubject !== "All Subjects") && (
                    <button 
                        onClick={() => { setSelectedSemester("All Semesters"); setSelectedSubject("All Subjects"); }}
                        className="text-xs text-red-500 hover:underline flex items-center gap-1"
                    >
                        <Filter size={12} /> Reset
                    </button>
                )}

                <button className="ml-auto flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-blue-600/20">
                    <UploadCloud size={16} />
                    <span>Upload Note</span>
                </button>
            </div>

            {/* RESULTS COUNT */}
            <div className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
                Showing {filteredResources.length} Resources
            </div>

            {/* NOTES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto custom-scrollbar pr-2 pb-10">
                {filteredResources.length > 0 ? (
                    filteredResources.map((res) => (
                        <NoteCard 
                            key={res.id}
                            title={res.title}
                            desc={res.desc}
                            subject={res.subject}
                            semester={res.semester}
                            uploader={res.uploader}
                            facultyName={res.uploader === "faculty" ? res.author : undefined}
                            studentName={res.uploader === "student" ? res.author : undefined}
                            verifierName={res.verifier}
                            isDark={isDark}
                        />
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-zinc-500">
                        <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No resources found for this selection.</p>
                    </div>
                )}
            </div>
        </>
      ) : (
        /* --- MY UPLOADS TAB (Empty State Demo) --- */
        <div className={`flex flex-col items-center justify-center h-64 rounded-2xl border border-dashed ${isDark ? "border-white/10 bg-zinc-900/20" : "border-zinc-300 bg-zinc-50"}`}>
            <div className={`w-16 h-16 mb-4 rounded-full flex items-center justify-center ${isDark ? "bg-zinc-800 text-zinc-600" : "bg-zinc-200 text-zinc-400"}`}>
                <UploadCloud size={32} />
            </div>
            <h3 className={`text-lg font-bold ${textMain}`}>No uploads yet</h3>
            <p className="text-sm text-zinc-500 mb-6">Share your notes to help the community.</p>
            <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-colors">
                <UploadCloud size={16} />
                <span>Upload Your First Note</span>
            </button>
        </div>
      )}
    </div>
  );
}

// --- NOTE CARD COMPONENT ---
const NoteCard = ({ title, desc, subject, semester, uploader, facultyName, studentName, verifierName, isDark }: any) => {
    
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
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest border shadow-sm ${stampColor}`}>
                    <StampIcon size={12} strokeWidth={3} />
                    {stampLabel}
                </div>
                
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

            {/* Footer: Details & Actions */}
            <div className={`pt-4 border-t ${isDark ? "border-white/5" : "border-zinc-100"}`}>
                
                <div className="flex justify-between items-end mb-3">
                    <div className="flex flex-col">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>{semester}</span>
                        <span className={`text-xs font-bold ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>{subject}</span>
                    </div>

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
                    <button className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-colors bg-blue-600 hover:bg-blue-500 text-white`}>
                        <Download size={14} /> Download
                    </button>
                </div>
            </div>

        </div>
    );
}