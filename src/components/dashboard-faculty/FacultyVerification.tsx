"use client";

import React, { useState, useEffect } from "react";
import { Check, X, Eye, Filter, RefreshCw, AlertCircle, Loader2 } from "lucide-react";
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
  const [pendingNotes, setPendingNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const [selectedSemester, setSelectedSemester] = useState("All Semesters");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");

  const getAuthToken = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token;
  };

  const fetchPendingQueue = async () => {
      if (!user?.department) return;
      setLoading(true);
      try {
          const token = await getAuthToken();
          const res = await fetch(`/api/notes/pending?department=${encodeURIComponent(user.department)}`, {
              headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (res.ok) {
              const data = await res.json();
              setPendingNotes(data.pendingNotes || []);
          }
      } catch (error) {
          console.error("Failed to load queue:", error);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchPendingQueue();
  }, [user]);

  const handleAction = async (noteId: number, status: 'approved' | 'rejected') => {
      setProcessingId(noteId);
      try {
          const token = await getAuthToken();
          const reason = status === 'rejected' ? prompt("Please provide a reason for rejection:") : null;
          
          if (status === 'rejected' && !reason) {
              setProcessingId(null);
              return; // Cancelled
          }

          const res = await fetch('/api/notes/verify', {
              method: 'PATCH',
              headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                  note_id: noteId,
                  status: status,
                  rejection_reason: reason,
                  verified_by: user.user_id
              })
          });

          if (!res.ok) throw new Error("Verification failed");

          // Optimistically remove from queue
          setPendingNotes(prev => prev.filter(n => n.note_id !== noteId));

      } catch (error) {
          alert("Error processing verification. Make sure you are authorized.");
          console.error(error);
      } finally {
          setProcessingId(null);
      }
  };

  const filteredQueue = pendingNotes.filter(item => {
      const matchSem = selectedSemester === "All Semesters" || item.semester === selectedSemester;
      const matchSub = selectedSubject === "All Subjects" || item.subjects?.subject_name === selectedSubject;
      return matchSem && matchSub;
  });

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className={`p-5 md:p-8 border-b ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-white"}`}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h2 className="text-2xl font-bold tracking-tight mb-2">Verification Console</h2>
                <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Review and authorize academic materials for the <strong className={isDark ? "text-slate-200" : "text-slate-800"}>{user?.department || "Department"}</strong> vault.
                </p>
            </div>
            <button onClick={fetchPendingQueue} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${isDark ? "border-slate-700 hover:bg-slate-800 text-slate-300" : "border-slate-300 hover:bg-slate-100 text-slate-700"}`}>
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh Queue
            </button>
        </div>
      </div>

      <div className={`p-4 md:p-8 flex-1 overflow-y-auto ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
        {/* Filters */}
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

        {/* Table */}
        <div className={`rounded-xl border overflow-hidden shadow-sm ${isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-white"}`}>
            <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className={`border-b font-semibold ${isDark ? "border-slate-800 bg-slate-900 text-slate-300" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
                    <tr>
                        <th className="p-4">Student Info</th>
                        <th className="p-4">Material Details</th>
                        <th className="p-4">Submission Date</th>
                        <th className="p-4 text-center">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {loading ? (
                        <tr>
                            <td colSpan={4} className="p-16 text-center text-slate-500">
                                <Loader2 className="animate-spin mx-auto mb-4" size={32} />
                                Loading pending verifications...
                            </td>
                        </tr>
                    ) : filteredQueue.length > 0 ? (
                        filteredQueue.map((item) => (
                            <tr key={item.note_id} className={`transition-colors ${isDark ? "hover:bg-slate-800/50" : "hover:bg-slate-50"}`}>
                                <td className="p-4">
                                    <p className="font-bold">{item.users?.full_name}</p>
                                    <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{item.users?.college_id}</p>
                                </td>
                                <td className="p-4">
                                    <p className="font-medium truncate max-w-[250px]" title={item.title}>{item.title}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}>{item.subjects?.subject_name}</span>
                                        <span className={`text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>{item.semester}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>{new Date(item.created_at).toLocaleDateString()}</span>
                                </td>
                                <td className="p-4 text-center">
                                    {processingId === item.note_id ? (
                                        <div className="flex justify-center"><Loader2 size={20} className="animate-spin text-blue-500" /></div>
                                    ) : (
                                        <div className="flex justify-center items-center gap-2">
                                            <button onClick={() => window.open(item.file_path, '_blank')} title="Review File" className={`p-1.5 rounded transition-all ${isDark ? "hover:bg-slate-800 text-slate-400 hover:text-blue-400" : "hover:bg-slate-100 text-slate-500 hover:text-blue-600"}`}>
                                                <Eye size={18} />
                                            </button>
                                            <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                                            <button onClick={() => handleAction(item.note_id, 'approved')} title="Approve" className="p-1.5 rounded bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-500/20 transition-all">
                                                <Check size={18} />
                                            </button>
                                            <button onClick={() => handleAction(item.note_id, 'rejected')} title="Reject" className="p-1.5 rounded bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/20 transition-all">
                                                <X size={18} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className={`p-16 text-center ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                                <div className="flex flex-col items-center justify-center">
                                    <Check size={40} className="mb-4 opacity-20 text-emerald-500" />
                                    <span className="text-sm font-medium">All caught up! No pending items.</span>
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