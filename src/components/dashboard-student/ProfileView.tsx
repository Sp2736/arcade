"use client";

import React, { useState } from "react";
import { User, Mail, Phone, Lock } from "lucide-react";

interface ProfileViewProps {
  isDarkMode: boolean;
}

export default function ProfileView({ isDarkMode }: ProfileViewProps) {
  const [formData, setFormData] = useState({
    fullName: "Swayam Patel",
    collegeId: "24DCS088",
    email: "24dcs088@charusat.edu.in",
    personalEmail: "swayampatel2736@gmail.com",
    phone: "+91 98765 43210",
    bio: "Fullstack Developer | AI/ML Enthusiast",
  });

  const [isEditing, setIsEditing] = useState(false);

  // Theme Constants
  const cardBg = isDarkMode ? "bg-zinc-900/50 border-white/10" : "bg-white border-zinc-200 shadow-sm";
  const labelColor = "text-zinc-500";
  const textColor = isDarkMode ? "text-white" : "text-zinc-900";

  return (
    <div className="max-w-4xl mx-auto pb-10">
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className={`text-2xl font-bold ${textColor}`}>My Profile</h2>
          <p className={labelColor}>Manage your personal information and academic identity.</p>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${isEditing ? "bg-green-600 text-white hover:bg-green-500" : "bg-blue-600 text-white hover:bg-blue-500"}`}
        >
            {isEditing ? "Save Changes" : "Edit Details"}
        </button>
      </div>

      <div className={`rounded-3xl border p-8 backdrop-blur-md ${cardBg}`}>
        
        {/* --- PHOTO SECTION --- */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10 border-b border-dashed border-zinc-500/20 pb-10">
            <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500/20">
                    <img src="/swayam.jpeg" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-0 right-0 p-2 bg-zinc-800 rounded-full text-zinc-400 border border-zinc-700 shadow-lg" title="Photo locked">
                    <Lock size={14} />
                </div>
            </div>
            
            <div className="text-center md:text-left">
                <h3 className={`text-xl font-bold ${textColor}`}>{formData.fullName}</h3>
                <p className="text-blue-500 font-mono text-sm font-bold">{formData.collegeId}</p>
                <p className={`mt-2 text-sm max-w-md ${labelColor}`}>
                    Profile photos are synced with the University Database. Contact Admin for updates.
                </p>
            </div>
        </div>

        {/* --- FIELDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Full Name" value={formData.fullName} icon={User} isDark={isDarkMode} readOnly={true} />
            <Field label="College Email" value={formData.email} icon={Mail} isDark={isDarkMode} readOnly={true} />
            <Field label="Personal Email" value={formData.personalEmail} icon={Mail} isDark={isDarkMode} onChange={(v: string) => setFormData({...formData, personalEmail: v})} readOnly={!isEditing} />
            <Field label="Phone Number" value={formData.phone} icon={Phone} isDark={isDarkMode} onChange={(v: string) => setFormData({...formData, phone: v})} readOnly={!isEditing} />

            <div className="md:col-span-2">
                <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${labelColor}`}>Bio / Goal</label>
                <textarea 
                    value={formData.bio}
                    readOnly={!isEditing}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    rows={3}
                    className={`w-full rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${isDarkMode ? "bg-black/40 border-white/10 text-white" : "bg-zinc-50 border-zinc-300 text-zinc-900"} ${!isEditing ? "opacity-70" : ""}`}
                />
            </div>
        </div>
      </div>
    </div>
  );
}

const Field = ({ label, value, icon: Icon, isDark, readOnly, onChange }: any) => {
    const inputBg = isDark ? "bg-black/40 border-white/10 text-white" : "bg-zinc-50 border-zinc-300 text-zinc-900";
    return (
        <div>
            <label className="text-xs font-bold uppercase tracking-wider mb-2 block text-zinc-500">{label}</label>
            <div className="relative">
                <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input 
                    type="text" 
                    value={value}
                    readOnly={readOnly}
                    onChange={(e) => onChange && onChange(e.target.value)}
                    className={`w-full rounded-xl py-3 pl-11 pr-4 text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${inputBg} ${readOnly ? "opacity-70 cursor-not-allowed" : ""}`}
                />
            </div>
        </div>
    );
}