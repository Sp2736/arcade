"use client";

import React, { useState, useMemo } from "react";
import { Search, UploadCloud, Eye, Download, CheckCircle, ShieldCheck, User, Filter, BookOpen, Link as LinkIcon, AlertCircle, Clock } from "lucide-react";

interface NotesViewProps {
  isDark: boolean;
}

// ... [ALL_RESOURCES, SUBJECTS_LIST, SEMESTERS_LIST arrays remain unchanged] ...
const ALL_RESOURCES = [
    { id: 1, title: "Data Structures: Trees & Graphs", desc: "Complete handwritten notes on AVL, Red-Black trees, and Graph traversals.", subject: "Data Structures", semester: "Semester 3", uploader: "faculty", author: "Prof. Mehta" },
    { id: 2, title: "DBMS: Normalization Guide", desc: "1NF to BCNF explained with real-world examples.", subject: "DBMS", semester: "Semester 3", uploader: "student", author: "Rohan Das", verifier: "Prof. Varma" },
    { id: 3, title: "OS: Process Scheduling Algorithms", desc: "FCFS, SJF, and Round Robin solved problems.", subject: "Operating Systems", semester: "Semester 4", uploader: "student", author: "Priya Shah", verifier: "Dr. A. Patel" },
    { id: 4, title: "Computer Networks: TCP/IP Model", desc: "Layer-by-layer breakdown of the protocol suite.", subject: "Computer Networks", semester: "Semester 4", uploader: "faculty", author: "Dr. R. Iyer" },
    { id: 5, title: "DAA: Dynamic Programming", desc: "Knapsack, LCS, and Matrix Chain Multiplication master sheet.", subject: "Algorithms", semester: "Semester 5", uploader: "student", author: "Amit Kumar", verifier: "Prof. Singh" },
    { id: 6, title: "Web Dev: React Hooks Cheatsheet", desc: "Quick reference for useState, useEffect, and custom hooks.", subject: "Web Technologies", semester: "Semester 5", uploader: "student", author: "Swayam Patel", verifier: "Prof. Zala" },
    { id: 7, title: "AI: Search Algorithms", desc: "BFS, DFS, A*, and Heuristic search methods.", subject: "Artificial Intelligence", semester: "Semester 6", uploader: "faculty", author: "Dr. K. Nair" },
    { id: 8, title: "Software Eng: Agile vs Waterfall", desc: "Comparative analysis for end-term exams.", subject: "Software Engineering", semester: "Semester 6", uploader: "student", author: "Rahul V.", verifier: "Prof. T. Shah" },
    { id: 9, title: "Information Security: Cryptography", desc: "RSA, DES, and AES encryption logic explained.", subject: "Info Security", semester: "Semester 7", uploader: "faculty", author: "Prof. G. Bhatt" },
    { id: 10, title: "Cloud Computing: AWS Essentials", desc: "EC2, S3, and Lambda functions basics.", subject: "Cloud Computing", semester: "Semester 8", uploader: "student", author: "Neha Gupta", verifier: "Dr. P. Joshi" },
];

const SUBJECTS_LIST = ["All Subjects", "Data Structures", "DBMS", "Operating Systems", "Computer Networks", "Algorithms", "Web Technologies", "Artificial Intelligence", "Software Engineering", "Info Security", "Cloud Computing"];
const SEMESTERS_LIST = ["All Semesters", "Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8"];

export default function NotesView({ isDark }: NotesViewProps) {
  const [activeTab, setActiveTab] = useState<"browse" | "uploads">("browse");
  
  // Browse State
  const [selectedSemester, setSelectedSemester] = useState("All Semesters");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [searchQuery, setSearchQuery] = useState("");

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadSubject, setUploadSubject] = useState("Operating Systems");
  const [uploadSemester, setUploadSemester] = useState("Semester 4");
  const [driveLink, setDriveLink] = useState("");
  const [myUploads, setMyUploads] = useState<any[]>([]);

  const filteredResources = useMemo(() => {
    return ALL_RESOURCES.filter(item => {
        const matchesSemester = selectedSemester === "All Semesters" || item.semester === selectedSemester;
        const matchesSubject = selectedSubject === "All Subjects" || item.subject === selectedSubject;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              item.subject.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSemester && matchesSubject && matchesSearch;
    });
  }, [selectedSemester, selectedSubject, searchQuery]);

  const handleStudentUpload = (e: React.FormEvent) => {
      e.preventDefault();
      const newNote = {
          id: Date.now(),
          title: uploadTitle,
          desc: uploadDesc,
          subject: uploadSubject,
          semester: uploadSemester,
          status: "Pending Verification",
          date: "Just now",
          link: driveLink
      };
      setMyUploads([newNote, ...myUploads]);
      setUploadTitle(""); setUploadDesc(""); setDriveLink("");
  };

  const textMain = isDark ? "text-white" : "text-zinc-900";
  const textSub = isDark ? "text-zinc-500" : "text-zinc-500";
  const inputBg = isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-300 text-zinc-900";
  const filterBg = isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200";
  const cardClass = `p-4 md:p-6 rounded-md border shadow-sm ${filterBg}`;
  const labelClass = `block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? "text-zinc-400" : "text-zinc-500"}`;
  const selectClass = `w-full md:w-auto px-3 py-2 rounded-lg border text-sm outline-none cursor-pointer appearance-none transition-colors ${isDark ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700" : "bg-white border-zinc-300 text-zinc-700 hover:border-zinc-400"}`;

  return (
    <div className="flex flex-col space-y-6">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${textMain}`}>Resource Vault</h2>
          <p className={textSub}>Access verified study materials across all semesters.</p>
        </div>
        
        <div className={`flex p-1 rounded-lg border w-full md:w-auto ${isDark ? "bg-zinc-800 border-zinc-700" : "bg-zinc-100 border-zinc-200"}`}>
            <button 
                onClick={() => setActiveTab("browse")}
                className={`flex-1 md:flex-none px-4 py-1.5 text-sm font-bold rounded-md transition-all ${
                    activeTab === "browse" 
                        ? (isDark ? "bg-zinc-900 text-white shadow" : "bg-white text-black shadow-sm border border-zinc-200") 
                        : (isDark ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200")
                }`}
            >
                Browse Library
            </button>
            <button 
                onClick={() => setActiveTab("uploads")}
                className={`flex-1 md:flex-none px-4 py-1.5 text-sm font-bold rounded-md transition-all ${
                    activeTab === "uploads" 
                        ? (isDark ? "bg-zinc-900 text-white shadow" : "bg-white text-black shadow-sm border border-zinc-200") 
                        : (isDark ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200")
                }`}
            >
                My Uploads
            </button>
        </div>
      </div>

      {activeTab === "browse" ? (
        <>
            <div className={`p-4 rounded-xl border flex flex-col md:flex-row flex-wrap gap-4 items-center ${filterBg}`}>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border w-full md:w-64 ${inputBg}`}>
                    <Search size={16} className="text-zinc-500 shrink-0" />
                    <input 
                        type="text" placeholder="Search topics..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm w-full placeholder-zinc-500" 
                    />
                </div>
                
                <div className="relative w-full md:w-auto">
                    <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} className={selectClass}>
                        {SEMESTERS_LIST.map(sem => <option key={sem} value={sem}>{sem}</option>)}
                    </select>
                </div>
                
                <div className="relative w-full md:w-auto">
                    <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className={selectClass}>
                        {SUBJECTS_LIST.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                    </select>
                </div>

                {(selectedSemester !== "All Semesters" || selectedSubject !== "All Subjects") && (
                    <button onClick={() => { setSelectedSemester("All Semesters"); setSelectedSubject("All Subjects"); }} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                        <Filter size={12} /> Reset
                    </button>
                )}

                <button onClick={() => setActiveTab("uploads")} className="w-full md:w-auto md:ml-auto flex justify-center items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-blue-600/20">
                    <UploadCloud size={16} />
                    <span>Upload Note</span>
                </button>
            </div>

            <div className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
                Showing {filteredResources.length} Resources
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
                {filteredResources.length > 0 ? (
                    filteredResources.map((res) => (
                        <NoteCard 
                            key={res.id} title={res.title} desc={res.desc} subject={res.subject} semester={res.semester}
                            uploader={res.uploader} facultyName={res.uploader === "faculty" ? res.author : undefined}
                            studentName={res.uploader === "student" ? res.author : undefined} verifierName={res.verifier} isDark={isDark}
                        />
                    ))
                ) : (
                    <div className={`col-span-full py-12 text-center border border-dashed rounded-xl ${isDark ? "border-zinc-800 text-zinc-600" : "border-zinc-300 text-zinc-400"}`}>
                        <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No resources found for this selection.</p>
                    </div>
                )}
            </div>
        </>
      ) : (
        // --- STUDENT UPLOAD FORM (Replaced empty state) ---
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`lg:col-span-1 ${cardClass} h-fit`}>
                <h3 className={`text-lg font-bold mb-4 ${textMain}`}>Contribute Material</h3>
                <form onSubmit={handleStudentUpload} className="space-y-4">
                    <div>
                        <label className={labelClass}>Material Title</label>
                        <input type="text" required value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} placeholder="e.g. Unit 4 Notes" className={`w-full px-3 py-2 rounded-lg border text-sm outline-none ${inputBg}`} />
                    </div>
                    <div>
                        <label className={labelClass}>Short Description</label>
                        <textarea required value={uploadDesc} onChange={(e) => setUploadDesc(e.target.value)} placeholder="What topics are covered?" className={`w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none h-20 ${inputBg}`} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelClass}>Semester</label>
                            <select value={uploadSemester} onChange={(e) => setUploadSemester(e.target.value)} className={`w-full px-3 py-2 rounded-lg border text-sm outline-none ${inputBg}`}>
                                {SEMESTERS_LIST.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Subject</label>
                            <select value={uploadSubject} onChange={(e) => setUploadSubject(e.target.value)} className={`w-full px-3 py-2 rounded-lg border text-sm outline-none ${inputBg}`}>
                                {SUBJECTS_LIST.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>Google Drive Link</label>
                        <div className="relative">
                            <LinkIcon className="absolute left-3 top-2.5 text-blue-500" size={16} />
                            <input type="url" required value={driveLink} onChange={(e) => setDriveLink(e.target.value)} placeholder="Paste link here..." className={`w-full pl-9 px-3 py-2 rounded-lg border text-sm outline-none ${inputBg}`} />
                        </div>
                        <div className="flex items-start gap-2 mt-2 text-[10px] text-blue-500 bg-blue-500/10 p-2 rounded border border-blue-500/20">
                            <AlertCircle size={12} className="shrink-0 mt-0.5" />
                            <p>Ensure the link access is set to <strong>"Anyone with the link can view"</strong> so peers can read it.</p>
                        </div>
                    </div>
                    
                    <div className={`text-[10px] p-3 rounded border ${isDark ? "bg-amber-900/10 border-amber-900/30 text-amber-400" : "bg-amber-50 border-amber-200 text-amber-700"}`}>
                        <div className="flex gap-2 font-bold mb-1"><Clock size={12} /> Verification Required</div>
                        Student uploads must be verified by course faculty before appearing in the public vault.
                    </div>

                    <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm transition-colors shadow-md shadow-blue-900/20">
                        Submit for Verification
                    </button>
                </form>
            </div>

            <div className={`lg:col-span-2 ${cardClass}`}>
                <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>My Submissions</h3>
                <div className="space-y-3">
                    {myUploads.length === 0 ? (
                        <div className={`p-8 text-center text-xs border border-dashed rounded-lg ${isDark ? "border-zinc-800 text-zinc-600" : "border-zinc-300 text-zinc-400"}`}>
                            You haven't uploaded any materials yet.
                        </div>
                    ) : (
                        myUploads.map((item: any) => (
                            <div key={item.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border gap-4 ${isDark ? "bg-zinc-950 border-zinc-800" : "bg-zinc-50 border-zinc-200"}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-md ${isDark ? "bg-blue-900/20 text-blue-400" : "bg-blue-50 text-blue-600"}`}><BookOpen size={20} /></div>
                                    <div>
                                        <h4 className={`text-sm font-bold ${textMain}`}>{item.title}</h4>
                                        <p className="text-xs text-zinc-500">{item.semester} • {item.subject}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start sm:items-end">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${isDark ? "bg-amber-900/20 text-amber-400 border-amber-900/50" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                                        {item.status}
                                    </span>
                                    <span className="text-[10px] text-zinc-500 mt-1">{item.date}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

// --- NOTE CARD COMPONENT ---
const NoteCard = ({ title, desc, subject, semester, uploader, facultyName, studentName, verifierName, isDark }: any) => {
    const isFaculty = uploader === "faculty";
    const stampColor = isFaculty ? "bg-blue-600 text-white border-blue-500" : "bg-emerald-500 text-white border-emerald-500";
    const StampIcon = isFaculty ? ShieldCheck : User;
    const stampLabel = isFaculty ? "FACULTY" : "STUDENT";
    const cardBg = isDark ? "bg-zinc-900 border-zinc-800 hover:border-blue-500/30" : "bg-white border-zinc-200 shadow-sm hover:shadow-md";

    return (
        <div className={`group flex flex-col p-5 rounded-2xl border transition-all hover:-translate-y-1 ${cardBg}`}>
            <div className="flex justify-between items-start mb-3">
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest border shadow-sm ${stampColor}`}>
                    <StampIcon size={12} strokeWidth={3} /> {stampLabel}
                </div>
                <span className={`text-[10px] font-mono opacity-50 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                    {isFaculty ? facultyName : studentName}
                </span>
            </div>

            <h3 className={`font-bold text-lg mb-1 truncate leading-tight ${isDark ? "text-white" : "text-zinc-900"}`}>{title}</h3>
            <p className={`text-xs mb-4 line-clamp-2 flex-1 ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>{desc}</p>

            <div className={`pt-4 mt-auto border-t ${isDark ? "border-zinc-800" : "border-zinc-100"}`}>
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
                                {isFaculty ? <ShieldCheck size={12} className="text-blue-500" /> : <CheckCircle size={12} className="text-emerald-500" />}
                                <span className={`text-xs font-bold ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                                    {isFaculty ? facultyName : verifierName}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex gap-2 mt-2">
                    <button className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-colors ${isDark ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300" : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"}`}>
                        <Eye size={14} /> View
                    </button>
                    <button className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-colors bg-blue-600 hover:bg-blue-500 text-white`}>
                        <LinkIcon size={14} /> Get Link
                    </button>
                </div>
            </div>
        </div>
    );
}