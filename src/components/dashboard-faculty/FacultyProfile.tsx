"use client";

import React, { useState, useEffect } from "react";
import { User, MapPin, Save, Shield } from "lucide-react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

interface FacultyProfileProps {
  isDark: boolean;
  user: any; // Added user prop
}

export default function FacultyProfile({ isDark, user }: FacultyProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "", empId: "", department: "", cabin: "", position: ""
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
        setFormData({
            fullName: user.full_name || "",
            empId: user.college_id || "",
            department: user.department || "",
            cabin: user.cabin_location || "",
            position: user.designation || (user.is_hod ? "Head of Department" : "Assistant Professor")
        });
    }
  }, [user]);

  const handleSave = async () => {
    if (!isEditing) { setIsEditing(true); return; }
    setIsSaving(true);
    try {
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch('/api/profile', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session?.access_token}`
            },
            body: JSON.stringify({
                cabin_location: formData.cabin,
                designation: formData.position
            })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to save profile");

        // Update local storage so it persists on reload
        localStorage.setItem("arcade-user", JSON.stringify(data.user));

        setIsEditing(false);
    } catch (error) { 
        console.error(error); 
    } finally { 
        setIsSaving(false); 
    }
  };

  const cardClass = `p-6 rounded-md border shadow-sm ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`;
  const inputClass = `w-full px-3 py-2 rounded-md border text-sm focus:outline-none ${isDark ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-white border-slate-300 text-slate-900"}`;

  if (!user) return <div>Loading...</div>;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
            <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Faculty Profile</h2>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white">
            <Save size={16} /> {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Edit Details"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-1 space-y-6`}>
            <div className={cardClass}>
                <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-slate-800 mb-4 flex items-center justify-center text-3xl font-bold text-blue-600">
                        {formData.fullName.substring(0, 2).toUpperCase()}
                    </div>
                    <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{formData.fullName}</h3>
                    <p className="text-sm text-blue-600 font-medium mb-1">{formData.position}</p>
                    <span className="inline-block px-2 py-1 rounded text-xs font-mono border dark:border-slate-700">{formData.empId}</span>
                </div>
            </div>
            <div className={cardClass}>
                <h4 className={`text-sm font-bold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}><Shield size={16} className="text-emerald-500" /> System Status</h4>
                <div className="flex justify-between text-xs"><span className="text-slate-500">Permissions</span><span className="font-bold">{user.is_hod ? 'HOD Level' : 'Standard Faculty'}</span></div>
            </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
            <div className={cardClass}>
                <h3 className="text-md font-bold mb-6 border-b pb-2">Official Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-semibold uppercase text-slate-500 mb-2 block">Designation</label>
                        <input type="text" value={formData.position} disabled={!isEditing} onChange={e => setFormData({...formData, position: e.target.value})} className={`${inputClass} ${!isEditing && "opacity-60"}`} />
                    </div>
                    <div>
                        <label className="text-xs font-semibold uppercase text-slate-500 mb-2 block">Department</label>
                        <input type="text" value={formData.department} disabled className={`${inputClass} opacity-60`} />
                    </div>
                    <div>
                        <label className="text-xs font-semibold uppercase text-slate-500 mb-2 block">Cabin Location</label>
                        <div className="relative">
                            <MapPin size={16} className="absolute left-3 top-2.5 text-slate-400" />
                            <input type="text" value={formData.cabin} disabled={!isEditing} onChange={e => setFormData({...formData, cabin: e.target.value})} className={`${inputClass} pl-10 ${!isEditing && "opacity-60"}`} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}