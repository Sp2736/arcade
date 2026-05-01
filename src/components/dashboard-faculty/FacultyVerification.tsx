// src/components/dashboard-faculty/FacultyVerification.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Check, X, Eye, Filter, RefreshCw, AlertCircle, Loader2, BookOpen, FileText } from "lucide-react";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface FacultyVerificationProps {
  isDark: boolean;
  user?: any;
}

const ALL_SUBJECTS = ["All Subjects", "Calculus", "Basic Electronics", "Data Structures", "DBMS", "Operating Systems", "Computer Networks", "Software Engineering"];
const SEMESTERS = ["All Semesters", "Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6"];

export default function FacultyVerification({ isDark, user }: FacultyVerificationProps) {
  // Master Tab State
  const [activeTab, setActiveTab] = useState<"notes" | "resumes">("notes");

  // Queue States
  const [pendingNotes, setPendingNotes] = useState<any[]>([]);
  const [pendingResumes, setPendingResumes] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // Filters for Notes
  const [selectedSemester, setSelectedSemester] = useState("All Semesters");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");

  const getAuthToken = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token;
  };

  const fetchQueues = async () => {
      setLoading(true);
      try {
          const token = await getAuthToken();
          
          if (activeTab === "notes") {
              if (!user?.department) return;
              const res = await fetch(`/api/notes/pending?department=${encodeURIComponent(user.department)}`, {
                  headers: { 'Authorization': `Bearer ${token}` }
              });
              if (res.ok) {
                  const data = await res.json();
                  setPendingNotes(data.pendingNotes || []);
              }
          } else {
              // Fetch Resumes
              const res = await fetch(`/api/admin/resumes`, {
                  headers: { 'Authorization': `Bearer ${token}` }
              });
              if (res.ok) {
                  const data = await res.json();
                  setPendingResumes(data.pendingResumes || []);
              }
          }
      } catch (error) {
          console.error(`Failed to load ${activeTab} queue:`, error);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchQueues();
  }, [user, activeTab]);

  // Unified action handler for both notes and resumes
  const handleAction = async (itemId: number, status: 'approved' | 'rejected') => {
      setProcessingId(itemId);
      try {
          const token = await getAuthToken();
          const reason = status === 'rejected' ? prompt("Please provide a reason for rejection:") : null;
          
          if (status === 'rejected' && !reason) {
              setProcessingId(null);
              return; // Cancelled
          }

          const endpoint = activeTab === "notes" ? "/api/notes/verify" : "/api/admin/resumes";
          const payloadIdKey = activeTab === "notes" ? "note_id" : "resume_id";

          const res = await fetch(endpoint, {
              method: 'PATCH', // Resumes is mapped to PUT inside the API, we can use PUT
              // Note: For consistency, ensuring the fetch matches the API route method.
              // We mapped Resumes to PUT in the API above.
          });
          
          const actualMethod = activeTab === "notes" ? 'PATCH' : 'PUT';

          const finalRes = await fetch(endpoint, {
              method: actualMethod,
              headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                  [payloadIdKey]: itemId,
                  status: status,
                  rejection_reason: reason,
                  verified_by: user.user_id // For notes
              })
          });

          if (!finalRes.ok) throw new Error("Verification failed");

          // Optimistically remove from queue
          if (activeTab === "notes") {
              setPendingNotes(prev => prev.filter(n => n.note_id !== itemId));
          } else {
              setPendingResumes(prev => prev.filter(r => r.resume_id !== itemId));
          }

      } catch (error) {
          alert("Error processing verification. Make sure you are authorized.");
          console.error(error);
      } finally {
          setProcessingId(null);
      }
  };

  const filteredNotesQueue = pendingNotes.filter(item => {
      const matchSem = selectedSemester === "All Semesters" || item.semester === selectedSemester;
      const matchSub = selectedSubject === "All Subjects" || item.subjects?.subject_name === selectedSubject;
      return matchSem && matchSub;
  });

  const activeQueue = activeTab === "notes" ? filteredNotesQueue : pendingResumes;

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className={`p-5 md:p-8 border-b ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-white"}`}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h2 className="text-2xl font-bold tracking-tight mb-2">Verification Console</h2>
                <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Review and authorize academic materials and student resumes before they go live.
                </p>
            </div>
            <button onClick={fetchQueues} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${isDark ? "border-slate-700 hover:bg-slate-800 text-slate-300" : "border-slate-300 hover:bg-slate-100 text-slate-700"}`}>
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh Queue
            </button>
        </div>

        {/* Console Tabs */}
        <div className="flex items-center gap-2 mt-6">
            <button onClick={() => setActiveTab("notes")} className={`flex items-center gap-2 px-4 py-2 rounded-t-lg border-x border-t transition-all ${activeTab === "notes" ? (isDark ? "bg-slate-950 border-slate-800 text-blue-400 font-bold" : "bg-slate-50 border-slate-200 text-blue-600 font-bold") : (isDark ? "border-transparent text-slate-500 hover:bg-slate-800" : "border-transparent text-slate-500 hover:bg-slate-100")}`}>
                <BookOpen size={16} /> Course Notes
                {pendingNotes.length > 0 && <span className="ml-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">{pendingNotes.length}</span>}
            </button>
            <button onClick={() => setActiveTab("resumes")} className={`flex items-center gap-2 px-4 py-2 rounded-t-lg border-x border-t transition-all ${activeTab === "resumes" ? (isDark ? "bg-slate-950 border-slate-800 text-blue-400 font-bold" : "bg-slate-50 border-slate-200 text-blue-600 font-bold") : (isDark ? "border-transparent text-slate-500 hover:bg-slate-800" : "border-transparent text-slate-500 hover:bg-slate-100")}`}>
                <FileText size={16} /> Resumes
                {pendingResumes.length > 0 && <span className="ml-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">{pendingResumes.length}</span>}
            </button>
        </div>
      </div>

      <div className={`p-4 md:p-8 flex-1 overflow-y-auto ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
        {/* Filters (Only for Notes) */}
        {activeTab === "notes" && (
            <div className="flex flex-wrap gap-3 mb-6">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                    <Filter size={16} className="text-slate-400" />
                    <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} className="bg-transparent outline-none cursor-pointer">
                        {SEMESTERS.map(s => <option key={s} value={s} className={isDark ? "bg-slate-800" : ""}>{s}</option>)}
                    </select>
                </div>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                    <Filter size={16} className="text-slate-400" />
                    <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="bg-transparent outline-none cursor-pointer">
                        {ALL_SUBJECTS.map(s => <option key={s} value={s} className={isDark ? "bg-slate-800" : ""}>{s}</option>)}
                    </select>
                </div>
            </div>
        )}

        {/* Table */}
        <div className={`rounded-xl border overflow-hidden shadow-sm ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-white"}`}>
            <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className={`border-b font-semibold ${isDark ? "border-slate-800 bg-slate-900 text-slate-300" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
                    <tr>
                        <th className="p-4">Student Info</th>
                        <th className="p-4">{activeTab === "notes" ? "Material Details" : "Resume Details"}</th>
                        <th className="p-4">Submission Date</th>
                        <th className="p-4 text-center">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {loading ? (
                        <tr>
                            <td colSpan={4} className="p-16 text-center text-slate-500">
                                <Loader2 className="animate-spin mx-auto mb-4" size={32} />
                                Loading pending items...
                            </td>
                        </tr>
                    ) : activeQueue.length > 0 ? (
                        activeQueue.map((item) => {
                            const itemId = activeTab === "notes" ? item.note_id : item.resume_id;
                            
                            return (
                                <tr key={itemId} className={`transition-colors ${isDark ? "hover:bg-slate-800/50" : "hover:bg-slate-50"}`}>
                                    <td className="p-4">
                                        <p className="font-bold">{item.uploader?.full_name}</p>
                                        <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{item.uploader?.college_id}</p>
                                    </td>
                                    <td className="p-4">
                                        <p className="font-medium truncate max-w-[250px]" title={item.title}>{item.title}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            {activeTab === "notes" ? (
                                                <>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}>{item.subjects?.subject_name}</span>
                                                    <span className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>{item.semester}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}>{item.domain}</span>
                                                    <span className={`text-[10px] uppercase font-bold text-blue-500`}>{item.experience_level}</span>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={isDark ? "text-slate-400" : "text-slate-500"}>{new Date(item.created_at).toLocaleDateString()}</span>
                                    </td>
                                    <td className="p-4 text-center">
                                        {processingId === itemId ? (
                                            <div className="flex justify-center"><Loader2 size={20} className="animate-spin text-blue-500" /></div>
                                        ) : (
                                            <div className="flex justify-center items-center gap-2">
                                                <button onClick={() => window.open(item.file_path, '_blank')} title="Review File" className={`p-1.5 rounded transition-all ${isDark ? "hover:bg-slate-800 text-slate-400 hover:text-blue-400" : "hover:bg-slate-100 text-slate-500 hover:text-blue-600"}`}>
                                                    <Eye size={18} />
                                                </button>
                                                <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                                                <button onClick={() => handleAction(itemId, 'approved')} title="Approve" className="p-1.5 rounded bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-500/20 transition-all">
                                                    <Check size={18} />
                                                </button>
                                                <button onClick={() => handleAction(itemId, 'rejected')} title="Reject" className="p-1.5 rounded bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/20 transition-all">
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={4} className={`p-16 text-center ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                                <div className="flex flex-col items-center justify-center">
                                    <Check size={40} className="mb-4 opacity-20 text-emerald-500" />
                                    <span className="text-sm font-medium">All caught up! No pending {activeTab} in the queue.</span>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}