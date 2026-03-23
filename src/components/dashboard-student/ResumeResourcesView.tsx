// src/components/dashboard-student/ResumeResourcesView.tsx
"use client";

import React, { useState, useEffect } from "react";
import { FileText, ExternalLink, Download, Globe, Code, ChevronLeft, BookOpen, Layers, Filter, Briefcase, Award, GraduationCap, Star, Eye, UploadCloud, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

interface ResourceViewProps {
  isDark: boolean;
  initialTab?: "resumes" | "resources";
}

// Global Static Syllabus Constants
const SUBJECTS_DATA = [
    { id: "math1", title: "Engineering Mathematics I", code: "MA101", semester: "Sem 1", count: 12, icon: BookOpen, color: "blue" },
    { id: "dsa", title: "Data Structures", code: "CS301", semester: "Sem 3", count: 12, icon: Code, color: "blue" },
    { id: "os", title: "Operating Systems", code: "CS402", semester: "Sem 4", count: 8, icon: Layers, color: "orange" },
    { id: "cn", title: "Computer Networks", code: "CS501", semester: "Sem 5", count: 10, icon: Globe, color: "purple" },
];

export default function ResumeResourcesView({ isDark, initialTab = "resumes" }: ResourceViewProps) {
  const activeTab = initialTab; 
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [semesterFilter, setSemesterFilter] = useState("All");
  const [domainFilter, setDomainFilter] = useState("All");
  
  // View mode for toggling between Browsing and Uploading
  const [viewMode, setViewMode] = useState<"browse" | "upload">("browse");

  // Dynamic State for Database Resumes
  const [dbResumes, setDbResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [uploadData, setUploadData] = useState({
    title: "",
    domain: "Web Development",
    experience_level: "fresher",
    file_path: "",
  });

  const fetchResumes = async () => {
    if (activeTab !== "resumes") return;
    const { data: { session } } = await supabase.auth.getSession();
    setLoading(true);
    try {
        const res = await fetch('/api/resumes', {
            headers: { 'Authorization': `Bearer ${session?.access_token}` }
        });
        const data = await res.json();
        if (data.resumes) setDbResumes(data.resumes);
    } catch (error) { console.error("Failed to fetch resumes"); }
    setLoading(false);
  };

  useEffect(() => {
      fetchResumes();
  }, [activeTab]);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
        const { data: { session } } = await supabase.auth.getSession();
        
        // Grab dynamic user from localStorage since component doesn't directly receive it via props in all cases
        const savedUserStr = localStorage.getItem("arcade-user");
        if (!savedUserStr) throw new Error("User session not found. Please log in again.");
        const user = JSON.parse(savedUserStr);

        const payload = {
            ...uploadData,
            user_id: user.user_id,
        };

        const res = await fetch("/api/resumes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session?.access_token}`,
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");

        setUploadData({ title: "", domain: "Web Development", experience_level: "fresher", file_path: "" });
        setViewMode("browse");
        fetchResumes(); // Refresh the list
    } catch (error: any) {
        setErrorMsg(error.message);
    } finally {
        setIsSubmitting(false);
    }
  };

  const uniqueDomains = ["All", ...Array.from(new Set(dbResumes.map(r => r.domain)))];
  
  const getResumesByLevel = (level: string) => {
    return dbResumes.filter(r => r.experience_level === level && (domainFilter === "All" || r.domain === domainFilter));
  };

  const textMain = isDark ? "text-white" : "text-zinc-900";
  const dropdownBorder = isDark ? "bg-[#09090b] border-white/10" : "bg-white border-zinc-300";

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${textMain}`}>{activeTab === "resumes" ? "Resume Archives" : "Practice Zone"}</h2>
          <p className={`text-sm mt-1 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
            {activeTab === "resumes" ? "Browse verified formats or submit your own for review." : "Practice essential resources."}
          </p>
        </div>
        {activeTab === "resumes" && (
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                {viewMode === "browse" && (
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${dropdownBorder}`}>
                        <Filter size={16} className="text-zinc-500" />
                        <select value={domainFilter} onChange={(e) => setDomainFilter(e.target.value)} className="bg-transparent outline-none text-sm font-bold">
                            {uniqueDomains.map(d => <option key={d} value={d} className="bg-zinc-900 text-white">{d}</option>)}
                        </select>
                    </div>
                )}
                <button 
                    onClick={() => setViewMode(viewMode === "browse" ? "upload" : "browse")}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-colors"
                >
                    {viewMode === "browse" ? <><UploadCloud size={16} /> Contribute Format</> : "Back to Archives"}
                </button>
            </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-10">
        {activeTab === "resumes" ? (
            viewMode === "upload" ? (
                <div className={`max-w-2xl mx-auto p-6 md:p-8 rounded-2xl border ${isDark ? "bg-[#0a0a0a] border-zinc-800" : "bg-white border-zinc-200 shadow-sm"}`}>
                    <h3 className="text-xl font-bold mb-2">Submit Resume Format</h3>
                    <p className={`text-sm mb-6 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                        Help peers by sharing your high-converting resume. It will be sent to the administration for verification before going live.
                    </p>

                    {errorMsg && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-start gap-2">
                            <AlertCircle size={18} className="mt-0.5 shrink-0" />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleUploadSubmit}>
                        <div>
                            <label className={`block text-sm font-bold mb-2 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>Resume Title</label>
                            <input type="text" required value={uploadData.title} onChange={e => setUploadData({...uploadData, title: e.target.value})} placeholder="e.g., FAANG Frontend Intern Resume" 
                                className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${isDark ? "bg-zinc-900 border-zinc-800 focus:border-blue-500 text-white" : "bg-slate-50 border-zinc-200 focus:border-blue-500"}`} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className={`block text-sm font-bold mb-2 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>Domain</label>
                                <input type="text" required value={uploadData.domain} onChange={e => setUploadData({...uploadData, domain: e.target.value})} placeholder="e.g., Data Science, UI/UX" 
                                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${isDark ? "bg-zinc-900 border-zinc-800 focus:border-blue-500 text-white" : "bg-slate-50 border-zinc-200 focus:border-blue-500"}`} />
                            </div>
                            <div>
                                <label className={`block text-sm font-bold mb-2 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>Experience Level</label>
                                <select value={uploadData.experience_level} onChange={e => setUploadData({...uploadData, experience_level: e.target.value})} 
                                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${isDark ? "bg-zinc-900 border-zinc-800 focus:border-blue-500 text-white" : "bg-slate-50 border-zinc-200 focus:border-blue-500"}`}>
                                    <option value="intern">Internship</option>
                                    <option value="fresher">Entry Level (Fresher)</option>
                                    <option value="experienced">Experienced Professional</option>
                                    <option value="advanced">Advanced / Leadership</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className={`block text-sm font-bold mb-2 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>Google Drive Link (PDF)</label>
                            <input type="url" required value={uploadData.file_path} onChange={e => setUploadData({...uploadData, file_path: e.target.value})} placeholder="https://drive.google.com/file/d/..." 
                                className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${isDark ? "bg-zinc-900 border-zinc-800 focus:border-blue-500 text-white" : "bg-slate-50 border-zinc-200 focus:border-blue-500"}`} />
                            <p className={`text-xs mt-2 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Make sure link access is set to "Anyone with the link can view".</p>
                        </div>
                        
                        <div className="pt-2">
                            <button disabled={isSubmitting} type="submit" className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${isSubmitting ? "bg-blue-600/50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"} text-white`}>
                                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />} 
                                {isSubmitting ? "Submitting..." : "Submit for Verification"}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                loading ? <div className="text-center p-10 text-zinc-500">Loading secure resume vault...</div> :
                <div className="space-y-10">
                    <ResumeSection title="Internship Formats" icon={GraduationCap} data={getResumesByLevel("intern")} isDark={isDark} color="text-blue-500" />
                    <ResumeSection title="Entry Level Formats" icon={Briefcase} data={getResumesByLevel("fresher")} isDark={isDark} color="text-emerald-500" />
                    <ResumeSection title="Experienced Formats" icon={Award} data={getResumesByLevel("experienced")} isDark={isDark} color="text-orange-500" />
                    <ResumeSection title="Advanced Formats" icon={Star} data={getResumesByLevel("advanced")} isDark={isDark} color="text-purple-500" />
                    
                    {dbResumes.length === 0 && (
                        <div className="text-center p-10 border border-dashed rounded-xl border-zinc-500 text-zinc-500">
                            No resumes uploaded matching the current filters.
                        </div>
                    )}
                </div>
            )
        ) : (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SUBJECTS_DATA.map((sub) => (
                    <SubjectCard key={sub.id} data={sub} isDark={isDark} onClick={() => setSelectedSubject(sub.id)} />
                ))}
            </motion.div>
        )}
      </div>
    </div>
  );
}

const ResumeSection = ({ title, icon: Icon, data, isDark, color }: any) => {
    if (data.length === 0) return null;
    return (
        <div className="space-y-4">
            <div className={`flex items-center gap-2 border-b pb-2 ${isDark ? "border-white/5" : "border-zinc-200"}`}>
                <Icon size={20} className={color} />
                <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-zinc-800"}`}>{title}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map((item: any) => (
                    <div key={item.resume_id} className={`p-5 rounded-2xl border transition-all hover:-translate-y-1 ${isDark ? "bg-zinc-900 border-zinc-800 hover:border-blue-500/50" : "bg-white border-zinc-200 hover:border-blue-300 shadow-sm"}`}>
                        <h3 className="font-bold mb-1 truncate" title={item.title}>{item.title}</h3>
                        <p className="text-xs mb-4 text-zinc-500">{item.domain}</p>
                        <button onClick={() => window.open(item.file_path, '_blank')} className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold flex justify-center gap-2">
                            <Download size={16} /> Get PDF
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SubjectCard = ({ data, isDark, onClick }: any) => (
    <div onClick={onClick} className={`p-5 rounded-2xl border cursor-pointer ${isDark ? "bg-zinc-900 border-zinc-800 hover:border-zinc-600" : "bg-white border-zinc-200 hover:shadow-md"}`}>
        <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center border text-blue-500 bg-blue-500/10 border-blue-500/20"><data.icon size={22} /></div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-zinc-800 text-zinc-400">{data.semester}</span>
        </div>
        <h3 className="text-lg font-bold mb-1">{data.title}</h3>
        <p className="text-xs text-zinc-500">{data.count} Resources Available</p>
    </div>
);