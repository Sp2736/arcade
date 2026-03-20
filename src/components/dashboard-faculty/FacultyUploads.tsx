"use client";

import React, { useState, useEffect } from "react";
import { UploadCloud, FileText, CheckCircle, Clock, AlertCircle, Loader2, Link as LinkIcon } from "lucide-react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

interface FacultyUploadsProps {
  isDark: boolean;
  user?: any;
}

const SUBJECTS_LIST = ["Calculus", "Data Structures", "DBMS", "Operating Systems", "Computer Networks", "Software Engineering"];
const SEMESTERS_LIST = ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8"];

export default function FacultyUploads({ isDark, user }: FacultyUploadsProps) {
  const [myUploads, setMyUploads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [uploadData, setUploadData] = useState({
      title: "", description: "", subject_name: "Operating Systems", semester: "Semester 4", file_path: ""
  });

  const fetchMyUploads = async () => {
      if (!user?.user_id) return;
      const { data: { session } } = await supabase.auth.getSession();
      setLoading(true);
      try {
          // Re-using the same notes GET endpoint, it returns myUploadsData
          const res = await fetch(`/api/notes?user_id=${user.user_id}&department=${encodeURIComponent(user.department)}`, {
              headers: { 'Authorization': `Bearer ${session?.access_token}` }
          });
          if (res.ok) {
              const data = await res.json();
              setMyUploads(data.myUploadsData || []);
          }
      } catch (error) { console.error("Error fetching faculty uploads"); }
      setLoading(false);
  };

  useEffect(() => { fetchMyUploads(); }, [user]);

  const handleUploadSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setErrorMsg("");

      try {
          const { data: { session } } = await supabase.auth.getSession();
          const res = await fetch('/api/notes', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
              body: JSON.stringify({ ...uploadData, user_id: user.user_id, role: 'faculty' })
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Upload failed");

          setUploadData({ title: "", description: "", subject_name: "Operating Systems", semester: "Semester 4", file_path: "" });
          fetchMyUploads(); 
      } catch (error: any) { setErrorMsg(error.message); } 
      finally { setIsSubmitting(false); }
  };

  const cardClass = `p-6 rounded-md border shadow-sm ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`;
  const inputClass = `w-full px-3 py-2 rounded-md border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${isDark ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-white border-slate-300 text-slate-900"}`;

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 animate-fade-in">
      {/* Upload Form */}
      <div className={`w-full md:w-1/3 flex flex-col ${cardClass}`}>
        <h3 className={`text-lg font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>Upload Material</h3>
        <p className={`text-xs mb-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Faculty uploads bypass verification and go live instantly.</p>
        
        {errorMsg && <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-sm">{errorMsg}</div>}

        <form onSubmit={handleUploadSubmit} className="space-y-4 flex-1">
            <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">Material Title</label>
                <input type="text" required value={uploadData.title} onChange={e => setUploadData({...uploadData, title: e.target.value})} className={inputClass} placeholder="e.g., Mid-Sem Question Bank" />
            </div>
            <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">Google Drive Link</label>
                <input type="url" required value={uploadData.file_path} onChange={e => setUploadData({...uploadData, file_path: e.target.value})} className={inputClass} placeholder="https://drive.google.com/..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">Subject</label>
                    <select value={uploadData.subject_name} onChange={e => setUploadData({...uploadData, subject_name: e.target.value})} className={inputClass}>
                        {SUBJECTS_LIST.map(s => <option key={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">Semester</label>
                    <select value={uploadData.semester} onChange={e => setUploadData({...uploadData, semester: e.target.value})} className={inputClass}>
                        {SEMESTERS_LIST.map(s => <option key={s}>{s}</option>)}
                    </select>
                </div>
            </div>
            <button disabled={isSubmitting} type="submit" className="w-full mt-4 py-2.5 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2">
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />} 
                {isSubmitting ? "Publishing..." : "Publish to Vault"}
            </button>
        </form>
      </div>

      {/* History */}
      <div className={`w-full md:w-2/3 flex flex-col ${cardClass}`}>
        <h3 className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>My Upload History</h3>
        
        <div className="flex-1 overflow-y-auto pr-2">
            {loading ? <div className="text-center p-10 text-slate-500"><Loader2 className="animate-spin mx-auto" size={24} /></div> :
             myUploads.length === 0 ? (
                <div className="text-center py-16 text-slate-500 border border-dashed rounded-lg border-slate-300 dark:border-slate-800">
                    <FileText size={32} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">You haven't published any materials yet.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {myUploads.map((item, idx) => (
                        <div key={idx} className={`p-4 rounded-lg border flex flex-col sm:flex-row justify-between gap-4 ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isDark ? "bg-slate-800 text-slate-300" : "bg-white border text-slate-600"}`}>{item.subjects?.subject_name}</span>
                                    <span className="text-[10px] text-slate-500">{new Date(item.created_at).toLocaleDateString()}</span>
                                </div>
                                <h4 className={`font-semibold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>{item.title}</h4>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                                    <CheckCircle size={14} /> Live
                                </span>
                                <button onClick={() => window.open(item.file_path, '_blank')} className="p-2 rounded text-blue-500 hover:bg-blue-500/10 transition-colors">
                                    <LinkIcon size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}