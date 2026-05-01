"use client";

import React, { useState, useEffect } from "react";
import { FileText, ExternalLink, Download, Globe, Code, ChevronLeft, BookOpen, Layers, Filter, Briefcase, Award, GraduationCap, Star, Eye, UploadCloud, Loader2, AlertCircle, Database, GitMerge, Monitor, Brain, Layout, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

interface ResourceViewProps {
  isDark: boolean;
  initialTab?: "resumes" | "resources";
}

const SUBJECTS_DATA = [
    { id: "math1", title: "Engineering Mathematics", code: "MA101", semester: "Sem 1", icon: BookOpen, color: "blue", links: [
        { name: "Paul's Online Notes", url: "https://tutorial.math.lamar.edu/" },
        { name: "Khan Academy Math", url: "https://www.khanacademy.org/math" },
        { name: "MIT OpenCourseWare Mathematics", url: "https://ocw.mit.edu/search/?d=Mathematics" },
        { name: "Wolfram MathWorld", url: "https://mathworld.wolfram.com/" },
        { name: "NPTEL Engineering Math", url: "https://nptel.ac.in/courses/111105111" }
    ]},
    { id: "dsa", title: "Data Structures", code: "CS301", semester: "Sem 3", icon: Code, color: "blue", links: [
        { name: "LeetCode Practice", url: "https://leetcode.com/problemset/all/" },
        { name: "GeeksforGeeks DSA", url: "https://www.geeksforgeeks.org/data-structures/" },
        { name: "HackerRank Data Structures", url: "https://www.hackerrank.com/domains/data-structures" },
        { name: "NeetCode Roadmap", url: "https://neetcode.io/roadmap" },
        { name: "Codeforces Problemset", url: "https://codeforces.com/problemset" }
    ]},
    { id: "os", title: "Operating Systems", code: "CS402", semester: "Sem 4", icon: Layers, color: "orange", links: [
        { name: "OSTEP (Three Easy Pieces)", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/" },
        { name: "GeeksforGeeks OS", url: "https://www.geeksforgeeks.org/operating-systems/" },
        { name: "Tutorialspoint OS", url: "https://www.tutorialspoint.com/operating_system/index.htm" },
        { name: "NPTEL Operating Systems", url: "https://nptel.ac.in/courses/106108101" },
        { name: "Baeldung Linux/OS", url: "https://www.baeldung.com/linux/" }
    ]},
    { id: "cn", title: "Computer Networks", code: "CS501", semester: "Sem 5", icon: Globe, color: "purple", links: [
        { name: "GeeksforGeeks Networks", url: "https://www.geeksforgeeks.org/computer-network-tutorials/" },
        { name: "IBM Networking Basics", url: "https://www.ibm.com/cloud/learn/networking-a-complete-guide" },
        { name: "Cisco Networking Academy", url: "https://www.netacad.com/" },
        { name: "Cloudflare Learning Center", url: "https://www.cloudflare.com/learning/" },
        { name: "NPTEL Computer Networks", url: "https://nptel.ac.in/courses/106105081" }
    ]},
    { id: "dbms", title: "Database Management", code: "CS403", semester: "Sem 4", icon: Database, color: "emerald", links: [
        { name: "SQLZoo Interactive SQL", url: "https://sqlzoo.net/" },
        { name: "LeetCode Database Questions", url: "https://leetcode.com/problemset/database/" },
        { name: "GeeksforGeeks DBMS", url: "https://www.geeksforgeeks.org/dbms/" },
        { name: "Mode SQL Tutorial", url: "https://mode.com/sql-tutorial/" },
        { name: "W3Schools SQL", url: "https://www.w3schools.com/sql/" }
    ]},
    { id: "daa", title: "Design & Analysis of Algorithms", code: "CS502", semester: "Sem 5", icon: GitMerge, color: "red", links: [
        { name: "GeeksforGeeks DAA", url: "https://www.geeksforgeeks.org/fundamentals-of-algorithms/" },
        { name: "MIT Intro to Algorithms", url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/" },
        { name: "CP-Algorithms", url: "https://cp-algorithms.com/" },
        { name: "HackerEarth Algorithms", url: "https://www.hackerearth.com/practice/algorithms/" },
        { name: "TopCoder Algorithm Tutorials", url: "https://www.topcoder.com/community/competitive-programming/tutorials/" }
    ]},
    { id: "se", title: "Software Engineering", code: "CS601", semester: "Sem 6", icon: Monitor, color: "teal", links: [
        { name: "GeeksforGeeks SE", url: "https://www.geeksforgeeks.org/software-engineering/" },
        { name: "Atlassian Agile Coach", url: "https://www.atlassian.com/agile" },
        { name: "Guru99 Software Testing", url: "https://www.guru99.com/software-testing.html" },
        { name: "Tutorialspoint SE", url: "https://www.tutorialspoint.com/software_engineering/index.htm" },
        { name: "IBM DevOps Guide", url: "https://www.ibm.com/cloud/learn/devops-a-complete-guide" }
    ]},
    { id: "ai", title: "Artificial Intelligence", code: "CS701", semester: "Sem 7", icon: Brain, color: "pink", links: [
        { name: "Google Machine Learning Crash Course", url: "https://developers.google.com/machine-learning/crash-course" },
        { name: "Kaggle Learn Microcourses", url: "https://www.kaggle.com/learn" },
        { name: "OpenAI Spinning Up (RL)", url: "https://spinningup.openai.com/" },
        { name: "GeeksforGeeks AI", url: "https://www.geeksforgeeks.org/artificial-intelligence-an-introduction/" },
        { name: "Towards Data Science", url: "https://towardsdatascience.com/" }
    ]},
    { id: "webdev", title: "Web Development", code: "CS405", semester: "Sem 4", icon: Layout, color: "yellow", links: [
        { name: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/" },
        { name: "freeCodeCamp Curriculum", url: "https://www.freecodecamp.org/learn" },
        { name: "JavaScript.info", url: "https://javascript.info/" },
        { name: "CSS-Tricks", url: "https://css-tricks.com/" },
        { name: "Frontend Mentor", url: "https://www.frontendmentor.io/challenges" }
    ]},
    { id: "coa", title: "Computer Architecture", code: "CS302", semester: "Sem 3", icon: Cpu, color: "zinc", links: [
        { name: "NPTEL Computer Architecture", url: "https://nptel.ac.in/courses/106105163" },
        { name: "GeeksforGeeks COA", url: "https://www.geeksforgeeks.org/computer-organization-and-architecture-tutorials/" },
        { name: "Tutorialspoint COA", url: "https://www.tutorialspoint.com/computer_logical_organization/index.htm" },
        { name: "MIT Computer System Architecture", url: "https://ocw.mit.edu/courses/6-823-computer-system-architecture-fall-2005/" },
        { name: "David Patterson RISC-V Resources", url: "http://riscvbook.com/" }
    ]}
];

export default function ResumeResourcesView({ isDark, initialTab = "resumes" }: ResourceViewProps) {
  const activeTab = initialTab; 
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [semesterFilter, setSemesterFilter] = useState("All");
  const [domainFilter, setDomainFilter] = useState("All");
  
  const [viewMode, setViewMode] = useState<"browse" | "upload" | "my_uploads">("browse");

  const [dbResumes, setDbResumes] = useState<any[]>([]);
  const [myResumes, setMyResumes] = useState<any[]>([]);
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
    setLoading(true);
    try {
        const { data: vaultData } = await supabase
            .from('resume_samples')
            .select('*')
            .eq('status', 'approved')
            .order('created_at', { ascending: false });
        
        if (vaultData) setDbResumes(vaultData);

        const savedUserStr = localStorage.getItem("arcade-user");
        if (savedUserStr) {
            const user = JSON.parse(savedUserStr);
            const { data: myData } = await supabase
                .from('resume_samples')
                .select('*')
                .eq('uploaded_by', user.user_id)
                .order('created_at', { ascending: false });
            if (myData) setMyResumes(myData);
        }
    } catch (error) { 
        console.error("Failed to fetch resumes"); 
    }
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
        
        const savedUserStr = localStorage.getItem("arcade-user");
        if (!savedUserStr) throw new Error("User session not found. Please log in again.");
        const user = JSON.parse(savedUserStr);

        const payload = { ...uploadData, user_id: user.user_id };

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
        setViewMode("my_uploads");
        fetchResumes(); 
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
                <div className={`flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border dark:border-zinc-800`}>
                    <button onClick={() => setViewMode("browse")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === "browse" ? "bg-white dark:bg-zinc-800 shadow-sm text-blue-600 dark:text-blue-400" : "text-zinc-500"}`}>Browse</button>
                    <button onClick={() => setViewMode("my_uploads")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === "my_uploads" ? "bg-white dark:bg-zinc-800 shadow-sm text-blue-600 dark:text-blue-400" : "text-zinc-500"}`}>My Uploads</button>
                </div>
                <button 
                    onClick={() => setViewMode("upload")}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-colors"
                >
                    <UploadCloud size={16} /> Contribute
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
            ) : viewMode === "my_uploads" ? (
                <div className="max-w-4xl mx-auto space-y-4">
                    <h3 className="font-bold text-lg mb-4">My Resume Uploads</h3>
                    {myResumes.length === 0 ? (
                        <div className={`p-8 rounded-2xl border text-center ${isDark ? "bg-zinc-900 border-zinc-800 text-zinc-500" : "bg-white border-zinc-200 text-zinc-400"}`}>
                            <UploadCloud size={32} className="mx-auto mb-3 opacity-30" />
                            <p className="text-sm">You haven't uploaded any resumes yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {myResumes.map((item, idx) => (
                                <div key={idx} className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${isDark ? "bg-zinc-900 border-zinc-800 hover:border-zinc-700" : "bg-white border-zinc-200 hover:border-zinc-300"}`}>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isDark ? "bg-zinc-800 text-zinc-300" : "bg-zinc-100 text-zinc-600"}`}>
                                                {item.domain || "General"}
                                            </span>
                                            <span className={`text-[10px] ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-sm truncate">{item.title}</h4>
                                        {item.status === "rejected" && item.rejection_reason && (
                                            <p className="text-xs text-red-500 mt-1">Reason: {item.rejection_reason}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border ${item.status === "approved" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : item.status === "pending_hod" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}`}>
                                            <span className="capitalize">{item.status.replace('_hod', '')}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
            selectedSubject ? (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSelectedSubject(null)} className={`p-2 rounded-xl border transition-colors ${isDark ? "bg-zinc-900 border-zinc-800 hover:bg-zinc-800" : "bg-white border-zinc-200 hover:bg-zinc-100"}`}>
                            <ChevronLeft size={20} className={isDark ? "text-white" : "text-zinc-900"} />
                        </button>
                        <div>
                            <h3 className={`text-xl font-bold ${textMain}`}>
                                {SUBJECTS_DATA.find(s => s.id === selectedSubject)?.title}
                            </h3>
                            <p className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                                Curated practice platforms and learning resources.
                            </p>
                        </div>
                    </div>
    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {SUBJECTS_DATA.find(s => s.id === selectedSubject)?.links.map((link, idx) => (
                            <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className={`p-5 rounded-2xl border flex flex-col gap-4 transition-all hover:-translate-y-1 ${isDark ? "bg-zinc-900 border-zinc-800 hover:border-blue-500/50" : "bg-white border-zinc-200 hover:border-blue-300 shadow-sm"}`}>
                                <div className="flex items-start justify-between">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${isDark ? "bg-blue-500/10 border-blue-500/20 text-blue-500" : "bg-blue-50 border-blue-200 text-blue-600"}`}>
                                        <ExternalLink size={18} />
                                    </div>
                                    <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${isDark ? "bg-zinc-800 text-zinc-400" : "bg-zinc-100 text-zinc-500"}`}>
                                        Resource {idx + 1}
                                    </div>
                                </div>
                                <div>
                                    <h4 className={`font-bold truncate ${textMain}`}>{link.name}</h4>
                                    <p className={`text-xs mt-1 truncate ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>{link.url}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {SUBJECTS_DATA.map((sub) => (
                        <SubjectCard key={sub.id} data={sub} isDark={isDark} onClick={() => setSelectedSubject(sub.id)} />
                    ))}
                </motion.div>
            )
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
    <div onClick={onClick} className={`p-5 rounded-2xl border cursor-pointer transition-all hover:-translate-y-1 ${isDark ? "bg-zinc-900 border-zinc-800 hover:border-zinc-600" : "bg-white border-zinc-200 hover:shadow-md"}`}>
        <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${isDark ? "text-blue-400 bg-blue-500/10 border-blue-500/20" : "text-blue-600 bg-blue-50 border-blue-200"}`}>
                <data.icon size={22} />
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${isDark ? "bg-zinc-800 text-zinc-400" : "bg-zinc-100 text-zinc-500"}`}>{data.semester}</span>
        </div>
        <h3 className="text-lg font-bold mb-1 leading-tight">{data.title}</h3>
        <p className="text-xs text-zinc-500">{data.links.length} Resources Available</p>
    </div>
);