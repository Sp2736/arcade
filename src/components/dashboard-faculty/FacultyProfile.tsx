"use client";

import React, { useState } from "react";
import { User, Mail, Briefcase, Phone, MapPin, Save, Shield } from "lucide-react";

interface FacultyProfileProps {
  isDark: boolean;
}

const POSITIONS = [
    "Assistant Professor",
    "Associate Professor",
    "Professor",
    "Head of Department (HOD)",
    "Lab Assistant",
    "Visiting Faculty"
];

const DEPARTMENTS = [
    "Computer Engineering",
    "Information Technology",
    "Civil Engineering",
    "Mechanical Engineering",
    "Electrical Engineering"
];

export default function FacultyProfile({ isDark }: FacultyProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    empId: "FAC-2024-089",
    email: "johndoe@charusat.edu.in",
    phone: "+91 98765 43210",
    position: "Assistant Professor",
    department: "Computer Engineering",
    cabin: "D-204, Main Building"
  });

  // Theme Helpers
  const cardClass = `p-6 rounded-md border shadow-sm ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`;
  const labelClass = `block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`;
  const inputClass = `w-full px-3 py-2 rounded-md border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
    isDark 
      ? "bg-slate-950 border-slate-800 text-slate-200 focus:border-blue-500" 
      : "bg-white border-slate-300 text-slate-900 focus:border-blue-500"
  }`;
  const disabledClass = isDark ? "opacity-50 bg-slate-900/50 cursor-not-allowed" : "opacity-60 bg-slate-50 cursor-not-allowed";

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
            <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Faculty Profile</h2>
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>Manage your employment details and account settings.</p>
        </div>
        <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isEditing 
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                    : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
        >
            {isEditing ? <Save size={16} /> : <User size={16} />}
            {isEditing ? "Save Changes" : "Edit Details"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- LEFT COLUMN: IDENTITY --- */}
        <div className={`lg:col-span-1 space-y-6`}>
            <div className={cardClass}>
                <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-800 mb-4 flex items-center justify-center text-3xl font-bold text-slate-400">
                        JD
                    </div>
                    <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                        {formData.firstName} {formData.lastName}
                    </h3>
                    <p className="text-sm text-blue-600 font-medium mb-1">{formData.position}</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-mono border ${isDark ? "bg-slate-800 border-slate-700 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-600"}`}>
                        {formData.empId}
                    </span>
                </div>
            </div>

            <div className={cardClass}>
                <h4 className={`text-sm font-bold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                    <Shield size={16} className="text-emerald-500" /> System Status
                </h4>
                <div className="space-y-3">
                    <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Account Status</span>
                        <span className="text-emerald-600 font-bold">Active</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Last Login</span>
                        <span className={isDark ? "text-slate-300" : "text-slate-700"}>Today, 10:42 AM</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Permissions</span>
                        <span className={isDark ? "text-slate-300" : "text-slate-700"}>Level 3 (Faculty)</span>
                    </div>
                </div>
            </div>
        </div>

        {/* --- RIGHT COLUMN: DETAILS FORM --- */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Official Information */}
            <div className={cardClass}>
                <h3 className={`text-md font-bold mb-6 border-b pb-2 ${isDark ? "text-white border-slate-800" : "text-slate-900 border-slate-100"}`}>
                    Official Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}>Designation / Post</label>
                        <select 
                            disabled={!isEditing}
                            value={formData.position}
                            onChange={(e) => setFormData({...formData, position: e.target.value})}
                            className={`${inputClass} ${!isEditing && disabledClass}`}
                        >
                            {POSITIONS.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Department</label>
                        <select 
                            disabled={!isEditing}
                            value={formData.department}
                            onChange={(e) => setFormData({...formData, department: e.target.value})}
                            className={`${inputClass} ${!isEditing && disabledClass}`}
                        >
                            {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Employee ID</label>
                        <input type="text" value={formData.empId} disabled className={`${inputClass} opacity-50 cursor-not-allowed`} />
                    </div>
                    <div>
                        <label className={labelClass}>Cabin / Office</label>
                        <div className="relative">
                            <MapPin size={16} className="absolute left-3 top-2.5 text-slate-400" />
                            <input 
                                type="text" 
                                value={formData.cabin}
                                disabled={!isEditing}
                                onChange={(e) => setFormData({...formData, cabin: e.target.value})}
                                className={`${inputClass} pl-10 ${!isEditing && disabledClass}`} 
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Contact Details */}
            <div className={cardClass}>
                <h3 className={`text-md font-bold mb-6 border-b pb-2 ${isDark ? "text-white border-slate-800" : "text-slate-900 border-slate-100"}`}>
                    Contact Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}>Full Name</label>
                        <input 
                            type="text" 
                            value={`${formData.firstName} ${formData.lastName}`}
                            disabled={!isEditing}
                            onChange={(e) => {
                                const parts = e.target.value.split(" ");
                                setFormData({...formData, firstName: parts[0], lastName: parts.slice(1).join(" ")});
                            }}
                            className={`${inputClass} ${!isEditing && disabledClass}`} 
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Email Address</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3 top-2.5 text-slate-400" />
                            <input 
                                type="email" 
                                value={formData.email}
                                disabled={!isEditing}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className={`${inputClass} pl-10 ${!isEditing && disabledClass}`} 
                            />
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClass}>Phone Number</label>
                        <div className="relative">
                            <Phone size={16} className="absolute left-3 top-2.5 text-slate-400" />
                            <input 
                                type="text" 
                                value={formData.phone}
                                disabled={!isEditing}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                className={`${inputClass} pl-10 ${!isEditing && disabledClass}`} 
                            />
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}