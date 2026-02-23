"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, UploadCloud, Eye, Download, CheckCircle, ShieldCheck, User, Filter, BookOpen, Link as LinkIcon, AlertCircle, Clock, Loader2, XCircle } from "lucide-react";

interface NotesViewProps {
  isDark: boolean;
  user: any; // Requires the logged-in user object
}

// Keeping static lists until you build the Subjects API endpoint
const SUBJECTS_LIST = ["All Subjects", "Data Structures", "DBMS", "Operating Systems", "Computer Networks", "Algorithms", "Web Technologies", "Artificial Intelligence", "Software Engineering", "Info Security", "Cloud Computing"];
const SEMESTERS_LIST = ["All Semesters", "Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8"];

export default function NotesView({ isDark, user }: NotesViewProps) {
  const [activeTab, setActiveTab] = useState<"browse" | "uploads">("browse");
  
  // Dynamic State
  const [allResources, setAllResources] = useState<any[]>([]);
  const [myUploads, setMyUploads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Browse Filter State
  const [selectedSemester, setSelectedSemester] = useState("All Semesters");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [searchQuery, setSearchQuery] = useState("");

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadSubject, setUploadSubject] = useState("Operating Systems");
  const [uploadSemester, setUploadSemester] = useState("Semester 4");
  const [driveLink, setDriveLink] = useState("");

  // --- 1. FETCH DATA ON LOAD ---
  useEffect(() => {
    // Safety Valve: Log the user object to see what we actually have
    console.log("NotesView User Object:", user);

    if (!user || !user.user_id) {
      console.warn("Missing user or user_id! Stopping fetch.");
      setLoading(false); // Stop the spinner so it doesn't hang forever
      return;
    }

    const fetchNotes = async () => {
      try {
        const res = await fetch(`/api/notes?user_id=${user.user_id}&department=${encodeURIComponent(user.department)}`);
        const data = await res.json();
        
        if (res.ok) {
          setAllResources(data.vault);
          setMyUploads(data.myUploads);
        } else {
          console.error("API Error:", data.error);
        }
      } catch (error) {
        console.error("Failed to fetch notes", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [user]);

  // 2. SUBMIT DATA
  const handleStudentUpload = async (e: React.FormEvent) => {
      e.preventDefault();
      
      // 1. SAFETY CHECK: Ensure user exists before uploading
      if (!user || !user.user_id) {
          alert("Session Error: Missing user identity. Please try logging out and logging back in.");
          return;
      }

      setIsSubmitting(true);
      
      try {
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
             title: uploadTitle,
             description: uploadDesc,
             subject_name: uploadSubject,
             semester: uploadSemester,
             file_path: driveLink, 
             user_id: user.user_id, // Safe now!
             role: user.role
          }),
        });

        if (res.ok) {
            const newNote = await res.json();
            // Optimistically update the UI
            setMyUploads([{
                note_id: newNote.note_id,
                title: uploadTitle,
                semester: uploadSemester,
                status: newNote.status,
                created_at: newNote.created_at,
                subjects: { subject_name: uploadSubject }
            }, ...myUploads]);
            
            setUploadTitle(""); setUploadDesc(""); setDriveLink("");
            alert("Resource submitted! It will appear in the vault once verified by your HOD or Faculty.");
        } else {
            alert("Upload failed. Make sure your subject exists in the database.");
        }
      } catch (error) {
          console.error(error);
      } finally {
          setIsSubmitting(false);
      }
  };

  const filteredResources = useMemo(() => {
    return allResources.filter(item => {
        const itemSubject = item.subjects?.subject_name || "";
        const matchesSemester = selectedSemester === "All Semesters" || item.semester === selectedSemester;
        const matchesSubject = selectedSubject === "All Subjects" || itemSubject === selectedSubject;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              itemSubject.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSemester && matchesSubject && matchesSearch;
    });
  }, [allResources, selectedSemester, selectedSubject, searchQuery]);

  const textMain = isDark ? "text-white" : "text-zinc-900";
  const textSub = isDark ? "text-zinc-500" : "text-zinc-500";
  const inputBg = isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-300 text-zinc-900";
  const filterBg = isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200";
  const cardClass = `p-4 md:p-6 rounded-md border shadow-sm ${filterBg}`;
  const labelClass = `block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? "text-zinc-400" : "text-zinc-500"}`;
  const selectClass = `w-full md:w-auto px-3 py-2 rounded-lg border text-sm outline-none cursor-pointer appearance-none transition-colors ${isDark ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700" : "bg-white border-zinc-300 text-zinc-700 hover:border-zinc-400"}`;

  if (loading) return <div className="flex h-64 items-center justify-center text-blue-500"><Loader2 className="animate-spin w-8 h-8" /></div>;

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${textMain}`}>Resource Vault</h2>
          <p className={textSub}>Access verified study materials for {user?.department || "your department"}.</p>
        </div>
        
        <div className={`flex p-1 rounded-lg border w-full md:w-auto ${isDark ? "bg-zinc-800 border-zinc-700" : "bg-zinc-100 border-zinc-200"}`}>
            <button onClick={() => setActiveTab("browse")} className={`flex-1 md:flex-none px-4 py-1.5 text-sm font-bold rounded-md transition-all ${activeTab === "browse" ? (isDark ? "bg-zinc-900 text-white shadow" : "bg-white text-black shadow-sm border border-zinc-200") : (isDark ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200")}`}>Browse Library</button>
            <button onClick={() => setActiveTab("uploads")} className={`flex-1 md:flex-none px-4 py-1.5 text-sm font-bold rounded-md transition-all ${activeTab === "uploads" ? (isDark ? "bg-zinc-900 text-white shadow" : "bg-white text-black shadow-sm border border-zinc-200") : (isDark ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200")}`}>My Uploads</button>
        </div>
      </div>

      {activeTab === "browse" ? (
        <>
            <div className={`p-4 rounded-xl border flex flex-col md:flex-row flex-wrap gap-4 items-center ${filterBg}`}>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border w-full md:w-64 ${inputBg}`}>
                    <Search size={16} className="text-zinc-500 shrink-0" />
                    <input type="text" placeholder="Search topics..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent border-none outline-none text-sm w-full placeholder-zinc-500" />
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
                {filteredResources.length > 0 ? (
                    filteredResources.map((res) => (
                        <NoteCard key={res.note_id} data={res} isDark={isDark} />
                    ))
                ) : (
                    <div className={`col-span-full py-12 text-center border border-dashed rounded-xl ${isDark ? "border-zinc-800 text-zinc-600" : "border-zinc-300 text-zinc-400"}`}>
                        <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No verified resources found. Be the first to upload!</p>
                    </div>
                )}
            </div>
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`lg:col-span-1 ${cardClass} h-fit`}>
                <h3 className={`text-lg font-bold mb-4 ${textMain}`}>Contribute Material</h3>
                <form onSubmit={handleStudentUpload} className="space-y-4">
                    <div>
                        <label className={labelClass}>Material Title</label>
                        <input type="text" required value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} className={`w-full px-3 py-2 rounded-lg border text-sm outline-none ${inputBg}`} />
                    </div>
                    <div>
                        <label className={labelClass}>Description</label>
                        <textarea required value={uploadDesc} onChange={(e) => setUploadDesc(e.target.value)} className={`w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none h-20 ${inputBg}`} />
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
                        <label className={labelClass}>Drive Link</label>
                        <div className="relative">
                            <LinkIcon className="absolute left-3 top-2.5 text-blue-500" size={16} />
                            <input type="url" required value={driveLink} onChange={(e) => setDriveLink(e.target.value)} placeholder="Paste link here..." className={`w-full pl-9 px-3 py-2 rounded-lg border text-sm outline-none ${inputBg}`} />
                        </div>
                    </div>
                    
                    <button disabled={isSubmitting} type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold rounded-lg text-sm transition-colors shadow-md shadow-blue-900/20 flex justify-center items-center">
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit for Verification"}
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
                            <div key={item.note_id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border gap-4 ${isDark ? "bg-zinc-950 border-zinc-800" : "bg-zinc-50 border-zinc-200"}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-md ${isDark ? "bg-blue-900/20 text-blue-400" : "bg-blue-50 text-blue-600"}`}><BookOpen size={20} /></div>
                                    <div>
                                        <h4 className={`text-sm font-bold ${textMain}`}>{item.title}</h4>
                                        <p className="text-xs text-zinc-500">{item.semester} • {item.subjects?.subject_name}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start sm:items-end">
                                    <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border ${
                                        item.status === 'approved' ? (isDark ? "bg-emerald-900/20 text-emerald-400 border-emerald-900/50" : "bg-emerald-50 text-emerald-700 border-emerald-200") :
                                        item.status === 'rejected' ? (isDark ? "bg-red-900/20 text-red-400 border-red-900/50" : "bg-red-50 text-red-700 border-red-200") :
                                        (isDark ? "bg-amber-900/20 text-amber-400 border-amber-900/50" : "bg-amber-50 text-amber-700 border-amber-200")
                                    }`}>
                                        {item.status === 'approved' && <CheckCircle size={10} />}
                                        {item.status === 'rejected' && <XCircle size={10} />}
                                        {item.status === 'pending' && <Clock size={10} />}
                                        {item.status.toUpperCase()}
                                    </span>
                                    <span className="text-[10px] text-zinc-500 mt-1">{new Date(item.created_at).toLocaleDateString()}</span>
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
const NoteCard = ({ data, isDark }: { data: any, isDark: boolean }) => {
    const uploaderRole = data.users?.role || 'student';
    const isFaculty = uploaderRole === "faculty" || uploaderRole === "admin";
    const stampColor = isFaculty ? "bg-blue-600 text-white border-blue-500" : "bg-emerald-500 text-white border-emerald-500";
    const StampIcon = isFaculty ? ShieldCheck : User;
    const cardBg = isDark ? "bg-zinc-900 border-zinc-800 hover:border-blue-500/30" : "bg-white border-zinc-200 shadow-sm hover:shadow-md";

    return (
        <div className={`group flex flex-col p-5 rounded-2xl border transition-all hover:-translate-y-1 ${cardBg}`}>
            <div className="flex justify-between items-start mb-3">
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest border shadow-sm ${stampColor}`}>
                    <StampIcon size={12} strokeWidth={3} /> {uploaderRole.toUpperCase()}
                </div>
                <span className={`text-[10px] font-mono opacity-50 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                    {data.users?.full_name || 'Unknown Author'}
                </span>
            </div>

            <h3 className={`font-bold text-lg mb-1 truncate leading-tight ${isDark ? "text-white" : "text-zinc-900"}`}>{data.title}</h3>
            <p className={`text-xs mb-4 line-clamp-2 flex-1 ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>{data.description}</p>

            <div className={`pt-4 mt-auto border-t ${isDark ? "border-zinc-800" : "border-zinc-100"}`}>
                <div className="flex justify-between items-end mb-4">
                    <div className="flex flex-col">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>{data.semester}</span>
                        <span className={`text-xs font-bold ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>{data.subjects?.subject_name}</span>
                    </div>

                    <div className="flex flex-col items-end">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
                            {isFaculty ? "Published By" : "Verified By"}
                        </span>
                        <div className="flex items-center gap-1">
                            {isFaculty ? <ShieldCheck size={12} className="text-blue-500" /> : <CheckCircle size={12} className="text-emerald-500" />}
                            <span className={`text-[10px] ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                                {data.users?.full_name || 'Admin'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className={`flex items-center gap-4 mb-4 text-[11px] font-medium ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                    <div className="flex items-center gap-1.5" title="Views"><Eye size={14} /> {data.view_count || 0}</div>
                    <div className="flex items-center gap-1.5" title="Downloads"><Download size={14} /> {data.download_count || 0}</div>
                </div>

                <div className="flex gap-2">
                    <button onClick={() => window.open(data.file_path, '_blank')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-colors bg-blue-600 hover:bg-blue-500 text-white`}>
                        <LinkIcon size={14} /> Open Drive
                    </button>
                </div>
            </div>
        </div>
    );
}