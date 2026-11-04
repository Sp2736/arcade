"use client";

import React, { useState } from "react";
import { 
  User, Mail, Phone, Lock, Save, Edit3, 
  Target, GraduationCap, Award, Compass, ArrowRight,
  Sparkles, CheckCircle2
} from "lucide-react";
import Confetti from "./Confetti"; 

interface ProfileViewProps {
  isDarkMode: boolean;
  targetRole: string;
  onRoleChange: (newRole: string) => void;
  isUnlocked: boolean; 
}

const AVAILABLE_ROLES = [
  "Frontend Developer", 
  "Backend Developer", 
  "Full Stack Developer", 
  "Data Scientist", 
  "DevOps Engineer"
];

export default function ProfileView({ isDarkMode, targetRole, onRoleChange, isUnlocked }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Profile Information State
  const [formData, setFormData] = useState({
    fullName: "Swayam Patel",
    email: "24dcs088@charusat.edu.in",
    personalEmail: "swayampatel2736@gmail.com",
    phone: "+91 98765 43210",
    collegeId: "24DCS088",
    department: "Computer Engineering",
    semester: "Semester 4",
    graduationYear: "2028"
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
  };

  const handleApplyClick = () => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 5000); 
  };

  const cardBg = isDarkMode ? "bg-zinc-900/40 border-zinc-800" : "bg-white border-zinc-200 shadow-sm";
  const textColor = isDarkMode ? "text-white" : "text-zinc-900";
  const subTextColor = isDarkMode ? "text-zinc-400" : "text-zinc-500";
  const inputBg = isDarkMode ? "bg-zinc-800/50 border-zinc-700 text-white" : "bg-zinc-50 border-zinc-200 text-zinc-900";

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {showCelebration && <Confetti />}

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className={`text-2xl md:text-3xl font-black tracking-tight ${textColor}`}>Student Profile</h1>
          <p className={`text-sm ${subTextColor}`}>Manage your platform identity and career trajectory</p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            isEditing 
              ? "bg-emerald-600 hover:bg-emerald-500 text-white" 
              : "bg-blue-600 hover:bg-blue-500 text-white"
          }`}
        >
          {isEditing ? <><Save size={16} /> Save Changes</> : <><Edit3 size={16} /> Edit Profile</>}
        </button>
      </div>

      {/* VERIFICATION CALLOUT */}
      {isUnlocked && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-400">Roadmap Completed!</p>
              <p className="text-xs text-zinc-400">All mandatory milestones verified by faculty standards.</p>
            </div>
          </div>
          <button 
            onClick={handleApplyClick}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-900/20"
          >
            Apply for Verification <ArrowRight size={14} />
          </button>
        </div>
      )}

      <div className="space-y-6">
        
        {/* PERSONAL DETAILS */}
        <div className={`rounded-3xl border p-8 backdrop-blur-md ${cardBg}`}>
            <div className="flex flex-col md:flex-row items-center gap-8 mb-10 border-b border-dashed border-zinc-500/20 pb-10">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500/20">
                        <img 
                          src="/arcade/swayam.jpeg" 
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/swayam.jpeg";
                          }}
                          alt="Profile" 
                          className="w-full h-full object-cover" 
                        />
                    </div>
                    <div className="absolute bottom-0 right-0 p-2 bg-zinc-800 rounded-full text-zinc-400 border border-zinc-700 shadow-lg" title="Photo locked">
                        <Lock size={14} />
                    </div>
                </div>
                <div className="text-center md:text-left">
                    <h3 className={`text-xl font-bold ${textColor}`}>{formData.fullName}</h3>
                    <p className="text-blue-500 font-mono text-sm font-bold">{formData.collegeId}</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Full Name" value={formData.fullName} icon={User} isDark={isDarkMode} readOnly={true} />
                <Field label="College Email" value={formData.email} icon={Mail} isDark={isDarkMode} readOnly={true} />
                <Field label="Personal Email" value={formData.personalEmail} icon={Mail} isDark={isDarkMode} onChange={(v: string) => setFormData({...formData, personalEmail: v})} readOnly={!isEditing} />
                <Field label="Phone Number" value={formData.phone} icon={Phone} isDark={isDarkMode} onChange={(v: string) => setFormData({...formData, phone: v})} readOnly={!isEditing} />
            </div>
        </div>

        {/* ACADEMIC PROFILE */}
        <div className={`rounded-3xl border p-8 backdrop-blur-md ${cardBg}`}>
            <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${textColor}`}>
                <GraduationCap size={20} className="text-blue-500" />
                Academic Enrollment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Field label="Department" value={formData.department} icon={Award} isDark={isDarkMode} readOnly={true} />
                <Field label="Current Semester" value={formData.semester} icon={Compass} isDark={isDarkMode} readOnly={true} />
                <Field label="Target Grad Year" value={formData.graduationYear} icon={Target} isDark={isDarkMode} readOnly={true} />
            </div>
        </div>

        {/* CAREER TRAJECTORY SELECTOR */}
        <div className={`rounded-3xl border p-8 backdrop-blur-md ${cardBg}`}>
            <h3 className={`text-lg font-bold mb-2 flex items-center gap-2 ${textColor}`}>
                <Target size={20} className="text-blue-500" />
                Active Career Target
            </h3>
            <p className={`text-xs ${subTextColor} mb-6`}>
              Changing your target role re-indexes your roadmap progression and milestone requirements.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {AVAILABLE_ROLES.map((role) => {
                const isSelected = targetRole === role;
                return (
                  <button
                    key={role}
                    onClick={() => onRoleChange(role)}
                    className={`p-4 rounded-xl border text-left text-sm font-bold transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/30"
                        : `${inputBg} hover:border-zinc-500`
                    }`}
                  >
                    <span>{role}</span>
                    {isSelected && <CheckCircle2 size={16} />}
                  </button>
                );
              })}
            </div>
        </div>

      </div>
    </div>
  );
}

function Field({ label, value, icon: Icon, isDark, readOnly, onChange }: any) {
  return (
    <div className="space-y-1.5">
      <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
        {label}
      </label>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
        isDark ? "bg-zinc-900/60 border-zinc-800" : "bg-zinc-50 border-zinc-200"
      }`}>
        <Icon size={16} className="text-zinc-500 shrink-0" />
        <input
          type="text"
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full bg-transparent outline-none text-sm font-medium ${
            readOnly ? "cursor-default text-zinc-400" : isDark ? "text-white" : "text-zinc-900"
          }`}
        />
        {readOnly && <Lock size={12} className="text-zinc-600 shrink-0" />}
      </div>
    </div>
  );
}
