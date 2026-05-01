"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, FileText, AlertCircle, Eye } from "lucide-react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

export default function HODResumeApproval({ isDark }: { isDark: boolean }) {
  const [pendingResumes, setPendingResumes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rejectionModal, setRejectionModal] = useState<{ isOpen: boolean, resumeId: number | null, reason: string }>({ isOpen: false, resumeId: null, reason: "" });

  useEffect(() => {
    fetchPendingResumes();
  }, []);

  const fetchPendingResumes = async () => {
    setIsLoading(true);
    // Fetching from resume_samples with joined user data for the uploader
    const { data, error } = await supabase
      .from('resume_samples')
      .select(`*, uploader:users!uploaded_by(full_name, designation)`)
      .eq('status', 'pending_hod');
      
    if (!error && data) setPendingResumes(data);
    setIsLoading(false);
  };

  const handleAction = async (resumeId: number, action: 'approved' | 'rejected', reason?: string) => {
    try {
      const { error } = await supabase
        .from('resume_samples')
        .update({ 
            status: action, 
            ...(reason && { rejection_reason: reason })
        })
        .eq('resume_id', resumeId);

      if (error) throw error;
      
      // Remove from UI optimistically
      setPendingResumes(prev => prev.filter(r => r.resume_id !== resumeId));
      if (action === 'rejected') setRejectionModal({ isOpen: false, resumeId: null, reason: "" });
      
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  const textMain = isDark ? "text-white" : "text-slate-900";
  const bgCard = isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";

  if (isLoading) return <div className="animate-pulse flex gap-4"><div className="w-full h-24 bg-slate-200 dark:bg-slate-800 rounded-xl"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className={`text-xl font-bold ${textMain}`}>Pending Resume Approvals</h3>
        <span className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-bold rounded-full">
            {pendingResumes.length} Pending
        </span>
      </div>

      {pendingResumes.length === 0 ? (
        <div className={`p-8 text-center rounded-xl border border-dashed ${isDark ? "border-slate-800 text-slate-500" : "border-slate-300 text-slate-500"}`}>
            <CheckCircle size={40} className="mx-auto mb-3 text-emerald-500 opacity-50" />
            <p>Queue is empty. All resources are verified.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
            {pendingResumes.map((resume) => (
                <div key={resume.resume_id} className={`p-5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${bgCard}`}>
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${isDark ? "bg-blue-900/20 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
                            <FileText size={24} />
                        </div>
                        <div>
                            <h4 className={`font-bold ${textMain}`}>{resume.title}</h4>
                            <div className="flex gap-3 text-xs mt-1 text-slate-500">
                                <span>Domain: <span className="font-semibold text-slate-700 dark:text-slate-300">{resume.domain}</span></span>
                                <span>Level: <span className="font-semibold text-slate-700 dark:text-slate-300 uppercase">{resume.experience_level}</span></span>
                            </div>
                            <p className="text-xs text-slate-400 mt-2">Uploaded by {resume.uploader?.full_name} ({resume.uploader?.designation})</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Preview Document">
                            <Eye size={18} className="text-slate-500" />
                        </button>
                        <button 
                            onClick={() => handleAction(resume.resume_id, 'approved')}
                            className="flex-1 md:flex-none px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <CheckCircle size={16} /> Approve
                        </button>
                        <button 
                            onClick={() => setRejectionModal({ isOpen: true, resumeId: resume.resume_id, reason: "" })}
                            className="flex-1 md:flex-none px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <XCircle size={16} /> Reject
                        </button>
                    </div>
                </div>
            ))}
        </div>
      )}

      {/* Rejection Modal */}
      {rejectionModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className={`w-full max-w-md p-6 rounded-2xl shadow-xl ${isDark ? "bg-slate-900 border border-slate-800" : "bg-white"}`}>
                  <h4 className={`text-lg font-bold flex items-center gap-2 mb-4 ${textMain}`}><AlertCircle className="text-rose-500"/> Reason for Rejection</h4>
                  <textarea 
                      value={rejectionModal.reason}
                      onChange={(e) => setRejectionModal({...rejectionModal, reason: e.target.value})}
                      placeholder="e.g., Formatting is off, outdated information..."
                      className={`w-full p-3 rounded-lg border text-sm min-h-[100px] mb-4 outline-none focus:ring-2 focus:ring-rose-500 ${isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200"}`}
                  />
                  <div className="flex justify-end gap-2">
                      <button onClick={() => setRejectionModal({ isOpen: false, resumeId: null, reason: "" })} className="px-4 py-2 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">Cancel</button>
                      <button 
                          onClick={() => handleAction(rejectionModal.resumeId!, 'rejected', rejectionModal.reason)}
                          disabled={!rejectionModal.reason.trim()}
                          className="px-4 py-2 rounded-lg text-sm font-bold bg-rose-500 hover:bg-rose-600 text-white disabled:opacity-50"
                      >
                          Confirm Rejection
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}