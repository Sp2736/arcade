"use client";

import React, { useState } from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff, Save, AlertCircle, Calendar, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileViewProps {
  isDarkMode: boolean;
  targetRole: string;
  onRoleChange: (newRole: string) => void;
  isUnlocked: boolean; 
}

const AVAILABLE_ROLES = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Scientist", "DevOps Engineer"];

export default function ProfileView({ isDarkMode, targetRole, onRoleChange, isUnlocked }: ProfileViewProps) {
  // ... [State definitions remain same] ...
  const [formData, setFormData] = useState({
    fullName: "Swayam Patel", collegeId: "24DCS088", email: "24dcs088@charusat.edu.in", 
    personalEmail: "swayampatel2736@gmail.com", phone: "+91 98765 43210", bio: "Fullstack Developer | AI/ML Enthusiast",
  });
  const [passwordData, setPasswordData] = useState({ current: "password123", new: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditingPass, setIsEditingPass] = useState(false);
  const [lastProfileUpdate, setLastProfileUpdate] = useState<number | null>(null);
  const [lastRoleUpdate, setLastRoleUpdate] = useState<number | null>(null);
  const [lockMessage, setLockMessage] = useState("");
  const [pendingRole, setPendingRole] = useState<string | null>(null);

  const handleEditClick = () => {
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    if (lastProfileUpdate && (now - lastProfileUpdate) < twentyFourHours) {
        const hoursLeft = Math.ceil((twentyFourHours - (now - lastProfileUpdate)) / (60 * 60 * 1000));
        setLockMessage(`Profile editing is locked. Try again in ${hoursLeft} hours.`);
        return;
    }
    if (isEditing) { setLastProfileUpdate(now); setLockMessage(""); }
    setIsEditing(!isEditing);
  };

  const handleRoleSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const canChange = isUnlocked || (!lastRoleUpdate || (now - lastRoleUpdate) > oneWeek);
    if (!canChange) {
        const daysLeft = Math.ceil((oneWeek - (now - lastRoleUpdate!)) / (24 * 60 * 60));
        setLockMessage(`Role locked. Complete Mandatory + 2 Advanced skills, or wait ${daysLeft} days.`);
        return;
    }
    setPendingRole(newRole);
  };

  const confirmRoleChange = () => {
    if (pendingRole) {
        onRoleChange(pendingRole);
        setLastRoleUpdate(Date.now());
        setPendingRole(null);
        setLockMessage("");
    }
  };

  // UPDATED THEME CONSTANTS: Solid backgrounds
  const cardBg = isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200 shadow-sm";
  const labelColor = "text-zinc-500";
  const textColor = isDarkMode ? "text-white" : "text-zinc-900";
  // Inputs get a darker shade to contrast against the card
  const inputBg = isDarkMode ? "bg-black border-zinc-800 text-white" : "bg-zinc-50 border-zinc-300 text-zinc-900";

  return (
    <div className="max-w-4xl mx-auto pb-20 relative">
      
      <AnimatePresence>
        {pendingRole && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <motion.div initial={{scale: 0.9, opacity: 0}} animate={{scale: 1, opacity: 1}} exit={{scale: 0.9, opacity: 0}} className={`p-6 rounded-2xl border shadow-2xl max-w-sm w-full ${isDarkMode ? "bg-zinc-900 border-white/10" : "bg-white border-zinc-200"}`}>
                    <h3 className={`text-lg font-bold mb-2 ${textColor}`}>Confirm Role Change?</h3>
                    <p className="text-zinc-500 text-sm mb-6">
                        Switching to <span className="font-bold text-blue-500">{pendingRole}</span> will reset your roadmap progress. This action cannot be undone for 7 days.
                    </p>
                    <div className="flex gap-3">
                        <button onClick={() => setPendingRole(null)} className="flex-1 py-2 rounded-lg text-sm font-bold border border-zinc-500/20 hover:bg-zinc-500/10 text-zinc-500">Cancel</button>
                        <button onClick={confirmRoleChange} className="flex-1 py-2 rounded-lg text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white">Confirm</button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className={`text-2xl font-bold ${textColor}`}>My Profile</h2>
          <p className={labelColor}>Manage your personal information and security.</p>
        </div>
        <button onClick={handleEditClick} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${isEditing ? "bg-green-600 text-white hover:bg-green-500" : "bg-blue-600 text-white hover:bg-blue-500"}`}>
            <Save size={16} /> {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      {lockMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500">
            <AlertCircle size={18} /> <span className="text-sm font-bold">{lockMessage}</span>
        </div>
      )}

      <div className="space-y-6">
        
        {/* PERSONAL DETAILS */}
        <div className={`rounded-3xl border p-8 backdrop-blur-md ${cardBg}`}>
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
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Full Name" value={formData.fullName} icon={User} isDark={isDarkMode} readOnly={true} />
                <Field label="College Email" value={formData.email} icon={Mail} isDark={isDarkMode} readOnly={true} />
                <Field label="Personal Email" value={formData.personalEmail} icon={Mail} isDark={isDarkMode} onChange={(v: string) => setFormData({...formData, personalEmail: v})} readOnly={!isEditing} />
                <Field label="Phone Number" value={formData.phone} icon={Phone} isDark={isDarkMode} onChange={(v: string) => setFormData({...formData, phone: v})} readOnly={!isEditing} />
                <div className="md:col-span-2">
                    <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${labelColor}`}>Bio / Goal</label>
                    <textarea value={formData.bio} readOnly={!isEditing} onChange={(e) => setFormData({...formData, bio: e.target.value})} rows={3} className={`w-full rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${inputBg} ${!isEditing ? "opacity-70" : ""}`} />
                </div>
            </div>
        </div>

        {/* SECURITY & ROLE */}
        {isEditing ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`rounded-3xl border p-6 ${cardBg}`}>
                    <h3 className={`text-lg font-bold mb-4 ${textColor}`}>Security</h3>
                    <div className="space-y-4">
                        <div>
                            <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${labelColor}`}>Current Password</label>
                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} value={passwordData.current} readOnly={!isEditingPass} onChange={(e) => setPasswordData({...passwordData, current: e.target.value})} className={`w-full rounded-xl py-3 pl-4 pr-10 text-sm border focus:outline-none transition-all ${inputBg} ${!isEditingPass ? "opacity-60" : "focus:ring-2 focus:ring-blue-500"}`} />
                                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                            </div>
                        </div>
                        {!isEditingPass ? (
                            <button onClick={() => setIsEditingPass(true)} className="text-xs text-blue-500 hover:underline">Change Password</button>
                        ) : (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                                <label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${labelColor}`}>New Password</label>
                                <input type="password" placeholder="Enter new password" value={passwordData.new} onChange={(e) => setPasswordData({...passwordData, new: e.target.value})} className={`w-full rounded-xl py-3 pl-4 text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${inputBg}`} />
                                <div className="flex gap-2 mt-3">
                                    <button onClick={() => setIsEditingPass(false)} className="flex-1 py-2 rounded-lg text-sm font-bold border border-zinc-500/20 text-zinc-500">Cancel</button>
                                    <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold">Update</button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                <div className={`rounded-3xl border p-6 ${cardBg}`}>
                    <h3 className={`text-lg font-bold mb-1 ${textColor}`}>Target Role</h3>
                    <p className={`text-xs mb-4 ${labelColor}`}>Change your career path.</p>
                    <div className="space-y-4">
                        <select value={targetRole} onChange={handleRoleSelection} className={`w-full rounded-xl py-3 pl-4 pr-10 text-sm border focus:outline-none cursor-pointer appearance-none ${inputBg}`}>
                            <option value="" disabled>Select a Target</option>
                            {AVAILABLE_ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                        </select>
                        <div className={`flex items-center gap-2 text-xs p-3 rounded-lg ${isDarkMode ? "bg-zinc-800" : "bg-zinc-100 text-zinc-600"}`}>
                            <Calendar size={14} /> <span>Locked for 7 days after change.</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        ) : (
            <div className={`p-8 rounded-3xl border border-dashed text-center ${isDarkMode ? "border-zinc-800 text-zinc-500" : "border-zinc-300 text-zinc-400"}`}>
                <Lock size={24} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Security and Role settings are hidden. Click "Edit Profile" to manage them.</p>
            </div>
        )}
      </div>
    </div>
  );
}

const Field = ({ label, value, icon: Icon, isDark, readOnly, onChange }: any) => {
    const inputBg = isDark ? "bg-black border-zinc-800 text-white" : "bg-zinc-50 border-zinc-300 text-zinc-900";
    return (
        <div>
            <label className="text-xs font-bold uppercase tracking-wider mb-2 block text-zinc-500">{label}</label>
            <div className="relative">
                <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input type="text" value={value} readOnly={readOnly} onChange={(e) => onChange && onChange(e.target.value)} className={`w-full rounded-xl py-3 pl-11 pr-4 text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${inputBg} ${readOnly ? "opacity-70 cursor-not-allowed" : ""}`} />
            </div>
        </div>
    );
}