"use client";

import React, { useState } from "react";
import { UploadCloud, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

export default function FacultyResumeUpload({ isDark, user }: { isDark: boolean, user: any }) {
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  
  const [formData, setFormData] = useState({
    title: "",
    domain: "",
    experience_level: "fresher",
    file: null as File | null
  });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file || !formData.title || !formData.domain) return;
    
    setIsUploading(true);
    setStatus({ type: null, message: '' });

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // 1. Upload file to Supabase Storage (assuming a 'resumes' bucket exists)
      const fileExt = formData.file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `resumes/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, formData.file);

      if (uploadError) throw uploadError;

      // 2. Insert record into database
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          title: formData.title,
          domain: formData.domain,
          experience_level: formData.experience_level,
          file_path: filePath,
          // If user is HOD, auto-approve. Otherwise, pending.
          status: user?.is_hod ? 'approved' : 'pending_hod' 
        })
      });

      if (!res.ok) throw new Error("Database insertion failed");

      setStatus({ type: 'success', message: user?.is_hod ? 'Resume published successfully!' : 'Resume submitted for HOD approval.' });
      setFormData({ title: "", domain: "", experience_level: "fresher", file: null });

    } catch (error: any) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsUploading(false);
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border text-sm focus:ring-2 focus:ring-blue-500 transition-all ${isDark ? "bg-slate-900 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-900"}`;

  return (
    <div className={`p-6 rounded-2xl border ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200 shadow-sm"} max-w-2xl mx-auto`}>
      <div className="flex items-center gap-3 mb-6 border-b pb-4 dark:border-slate-800">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
          <FileText size={24} />
        </div>
        <div>
          <h3 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Upload Resume Resource</h3>
          <p className="text-xs text-slate-500">Contribute industry-standard formats for students.</p>
        </div>
      </div>

      <form onSubmit={handleUpload} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
                <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Resume Title</label>
                <input type="text" placeholder="e.g., Google SWE Format" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={inputClass} required />
            </div>
            <div>
                <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Domain</label>
                <input type="text" placeholder="e.g., Frontend, Machine Learning" value={formData.domain} onChange={e => setFormData({...formData, domain: e.target.value})} className={inputClass} required />
            </div>
        </div>

        <div>
            <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Target Experience Level</label>
            <select value={formData.experience_level} onChange={e => setFormData({...formData, experience_level: e.target.value})} className={inputClass}>
                <option value="intern">Internship (0 YOE)</option>
                <option value="fresher">Fresher (0-1 YOE)</option>
                <option value="experienced">Experienced (2-5 YOE)</option>
                <option value="advanced">Advanced (5+ YOE)</option>
            </select>
        </div>

        <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDark ? "border-slate-700 hover:border-blue-500 bg-slate-900" : "border-slate-300 hover:border-blue-500 bg-slate-50"}`}>
            <input type="file" id="resume-upload" className="hidden" accept=".pdf,.doc,.docx" onChange={e => setFormData({...formData, file: e.target.files?.[0] || null})} />
            <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                <UploadCloud size={32} className={`mb-3 ${formData.file ? "text-blue-500" : "text-slate-400"}`} />
                <span className="text-sm font-medium dark:text-slate-300">{formData.file ? formData.file.name : "Click to select a file (PDF, DOCX)"}</span>
            </label>
        </div>

        {status.type && (
            <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                {status.message}
            </div>
        )}

        <button type="submit" disabled={isUploading || !formData.file} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold transition-all flex justify-center items-center gap-2">
            {isUploading ? <span className="animate-pulse">Processing...</span> : <><UploadCloud size={18} /> Submit Resource</>}
        </button>
      </form>
    </div>
  );
}