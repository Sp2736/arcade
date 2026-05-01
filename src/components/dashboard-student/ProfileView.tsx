"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
);

interface ProfileViewProps {
  isDarkMode: boolean;
  targetRole: string;
  onRoleChange: (newRole: string) => void;
  user: any;
}

const AVAILABLE_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "DevOps Engineer",
];

export default function ProfileView({
  isDarkMode,
  targetRole,
  onRoleChange,
  user,
}: ProfileViewProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    collegeId: "",
    email: "",
    personalEmail: "",
    phone: "",
    bio: "",
  });
  const [passwordData, setPasswordData] = useState({ new: "" });

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPass, setIsEditingPass] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState<{
    text: string;
    type: "error" | "success";
  } | null>(null);
  const [pendingRole, setPendingRole] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.full_name || "",
        collegeId: user.college_id || "",
        email: user.college_email || "",
        personalEmail: user.personal_email || "",
        phone: user.phone_number || "",
        bio: user.bio || "",
      });
      if (user.target_role && user.target_role !== targetRole)
        onRoleChange(user.target_role);
    }
  }, [user]);

  const handleEditClick = async () => {
    if (isEditing) {
      setIsSaving(true);
      setMessage(null);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const res = await fetch("/api/profile", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            personal_email: formData.personalEmail,
            phone_number: formData.phone,
            bio: formData.bio,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to save profile");

        // 1. Update local storage with the fresh database row
        localStorage.setItem("arcade-user", JSON.stringify(data.user));

        setIsEditing(false);
        setMessage({
          text: "Profile updated successfully! Syncing...",
          type: "success",
        });

        // 2. Force the app to refresh state after 1 second so the user sees the success message
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (err: any) {
        setMessage({ text: "Failed to save: " + err.message, type: "error" });
      } finally {
        setIsSaving(false);
      }
    } else {
      setIsEditing(true);
      setMessage(null);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.new.length < 6)
      return setMessage({
        text: "Password must be at least 6 characters.",
        type: "error",
      });
    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.new,
      });
      if (error) throw error;
      setMessage({ text: "Password updated successfully!", type: "success" });
      setIsEditingPass(false);
      setPasswordData({ new: "" });
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const confirmRoleChange = async () => {
    if (pendingRole) {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const res = await fetch("/api/profile", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ target_role: pendingRole }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error("Failed");

        // Update local storage so it persists on reload
        localStorage.setItem("arcade-user", JSON.stringify(data.user));

        onRoleChange(pendingRole);
        setPendingRole(null);
        setMessage({
          text: "Target role updated successfully!",
          type: "success",
        });
      } catch (error) {
        setMessage({ text: "Failed to update target role.", type: "error" });
      }
    }
  };

  const cardBg = isDarkMode
    ? "bg-zinc-900 border-zinc-800"
    : "bg-white border-zinc-200 shadow-sm";
  const labelColor = "text-zinc-500";
  const textColor = isDarkMode ? "text-white" : "text-zinc-900";
  const inputBg = isDarkMode
    ? "bg-black border-zinc-800 text-white"
    : "bg-zinc-50 border-zinc-300 text-zinc-900";

  if (!user)
    return (
      <div className="p-10 text-center text-zinc-500">
        Loading secure profile...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto pb-20 relative animate-fade-in">
      <AnimatePresence>
        {pendingRole && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`p-6 rounded-2xl border shadow-2xl max-w-sm w-full ${isDarkMode ? "bg-zinc-900 border-white/10" : "bg-white border-zinc-200"}`}
            >
              <h3 className={`text-lg font-bold mb-2 ${textColor}`}>
                Confirm Role Change?
              </h3>
              <p className="text-zinc-500 text-sm mb-6">
                Switching to{" "}
                <span className="font-bold text-blue-500">{pendingRole}</span>{" "}
                will reset your roadmap progress.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setPendingRole(null)}
                  className="flex-1 py-2 rounded-lg text-sm font-bold border border-zinc-500/20 text-zinc-500 hover:bg-zinc-500/10"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRoleChange}
                  className="flex-1 py-2 rounded-lg text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className={`text-2xl font-bold ${textColor}`}>My Profile</h2>
          <p className={labelColor}>
            Manage your personal information and security.
          </p>
        </div>
        <button
          onClick={handleEditClick}
          disabled={isSaving}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${isEditing ? "bg-green-600 hover:bg-green-500" : "bg-blue-600 hover:bg-blue-500"} text-white`}
        >
          <Save size={16} />{" "}
          {isSaving && isEditing
            ? "Saving..."
            : isEditing
              ? "Save Changes"
              : "Edit Profile"}
        </button>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-bold border ${message.type === "error" ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"}`}
        >
          <AlertCircle size={18} /> <span>{message.text}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* PERSONAL DETAILS */}
        <div className={`rounded-3xl border p-8 backdrop-blur-md ${cardBg}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field
              label="Full Name"
              value={formData.fullName}
              icon={User}
              isDark={isDarkMode}
              readOnly={true}
            />
            <Field
              label="College Email"
              value={formData.email}
              icon={Mail}
              isDark={isDarkMode}
              readOnly={true}
            />
            <Field
              label="Personal Email"
              value={formData.personalEmail}
              icon={Mail}
              isDark={isDarkMode}
              onChange={(v: string) =>
                setFormData({ ...formData, personalEmail: v })
              }
              readOnly={!isEditing}
            />
            <Field
              label="Phone Number"
              value={formData.phone}
              icon={Phone}
              isDark={isDarkMode}
              onChange={(v: string) => setFormData({ ...formData, phone: v })}
              readOnly={!isEditing}
            />
            <div className="md:col-span-2">
              <label
                className={`text-xs font-bold uppercase tracking-wider mb-2 block ${labelColor}`}
              >
                Bio / Goal
              </label>
              <textarea
                value={formData.bio}
                readOnly={!isEditing}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                rows={3}
                placeholder="Tell us about your career goals..."
                className={`w-full rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${inputBg} ${!isEditing ? "opacity-70 cursor-not-allowed" : ""}`}
              />
            </div>
          </div>
        </div>

        {/* SECURITY & TARGET ROLE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`rounded-3xl border p-6 ${cardBg}`}>
            <h3 className={`text-lg font-bold mb-4 ${textColor}`}>Security</h3>
            <div className="space-y-4">
              {!isEditingPass ? (
                <button
                  onClick={() => setIsEditingPass(true)}
                  className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm font-bold w-full flex items-center justify-center gap-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <Lock size={16} /> Change Password
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  <label
                    className={`text-xs font-bold uppercase tracking-wider mb-2 block ${labelColor}`}
                  >
                    New Password
                  </label>
                  <div className="relative mb-3">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 6 characters"
                      value={passwordData.new}
                      onChange={(e) => setPasswordData({ new: e.target.value })}
                      className={`w-full rounded-xl py-3 pl-4 pr-10 text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${inputBg}`}
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditingPass(false)}
                      className="flex-1 py-2 rounded-lg text-sm font-bold border border-zinc-500/20 text-zinc-500 hover:bg-zinc-500/10"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePasswordUpdate}
                      disabled={isSaving}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold"
                    >
                      {isSaving ? "Updating..." : "Update"}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          <div className={`rounded-3xl border p-6 ${cardBg}`}>
            <h3 className={`text-lg font-bold mb-1 ${textColor}`}>
              Target Role
            </h3>
            <p className={`text-xs mb-4 ${labelColor}`}>
              Change your career path.
            </p>
            <select
              value={targetRole}
              onChange={(e) => setPendingRole(e.target.value)}
              className={`w-full rounded-xl py-3 pl-4 pr-10 text-sm border focus:outline-none cursor-pointer ${inputBg}`}
            >
              <option value="" disabled>
                Select a Target
              </option>
              {AVAILABLE_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

const Field = ({
  label,
  value,
  icon: Icon,
  isDark,
  readOnly,
  onChange,
}: any) => {
  const inputBg = isDark
    ? "bg-black border-zinc-800 text-white"
    : "bg-zinc-50 border-zinc-300 text-zinc-900";
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider mb-2 block text-zinc-500">
        {label}
      </label>
      <div className="relative">
        <Icon
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
        />
        <input
          type="text"
          value={value || ""}
          readOnly={readOnly}
          onChange={(e) => onChange && onChange(e.target.value)}
          className={`w-full rounded-xl py-3 pl-11 pr-4 text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${inputBg} ${readOnly ? "opacity-70 cursor-not-allowed" : ""}`}
        />
      </div>
    </div>
  );
};
