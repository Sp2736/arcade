"use client";

import React from "react";
import { motion } from "framer-motion";
// Removed deprecated Linkedin import
import { Mail, Award, GraduationCap, AlertCircle } from "lucide-react";
import { ALUMNI_EXPERTS } from "./AlumniData";

// ✅ Custom LinkedIn Icon (Lucide-style)
const LinkedInIcon = ({ size = 24, color = "currentColor", strokeWidth = 2, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface AlumniNetworkProps {
  isDark: boolean;
}

export default function AlumniNetwork({ isDark }: AlumniNetworkProps) {
  const textMain = isDark ? "text-white" : "text-zinc-900";
  const textSub = "text-zinc-500";
  const cardBg = isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200 shadow-sm";

  return (
    <div className="space-y-8 pb-20">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col gap-4">
        <h2 className={`text-2xl md:text-3xl font-bold tracking-tight ${textMain}`}>
          Expert Network
        </h2>

        {/* Styled Disclaimer Box */}
        <div
          className={`flex items-start gap-3 p-4 rounded-2xl border ${
            isDark
              ? "bg-blue-500/5 border-blue-500/20 text-blue-300"
              : "bg-blue-50 border-blue-200 text-blue-700"
          }`}
        >
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <p className="text-sm font-medium leading-relaxed italic">
            "The module is currently under consideration and development. The design and layout
            expected is depicted below, for illustrative purposes only."
          </p>
        </div>
      </div>

      {/* --- CARDS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ALUMNI_EXPERTS.map((person) => (
          <motion.div
            key={person.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className={`p-6 rounded-[2rem] border transition-all duration-300 ${cardBg} group overflow-hidden relative`}
          >
            {/* Background Decorative Glow */}
            <div
              className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 pointer-events-none rounded-full transition-colors ${
                person.type === "Alumni" ? "bg-blue-500" : "bg-purple-500"
              }`}
            />

            {/* Profile Header */}
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div
                className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex items-center justify-center text-2xl font-black transition-all duration-500 ${
                  isDark ? "bg-zinc-800 border-white/5" : "bg-zinc-100 border-zinc-200"
                }`}
              >
                <span className={isDark ? "text-zinc-600" : "text-zinc-400"}>
                  {person.name.split(" ").map((n) => n[0]).join("")}
                </span>
              </div>

              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                  person.type === "Alumni"
                    ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                    : "bg-purple-500/10 text-purple-500 border-purple-500/20"
                }`}
              >
                {person.type === "Alumni" ? <GraduationCap size={12} /> : <Award size={12} />}
                {person.type}
              </div>
            </div>

            {/* Identity Info */}
            <div className="mb-6 relative z-10">
              <h3 className={`text-xl font-black tracking-tight mb-1 ${textMain}`}>
                {person.name}
              </h3>
              <p className={`text-sm font-medium ${textSub}`}>{person.role}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-dashed border-zinc-500/20 relative z-10">
              <a
                href={person.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
              >
                <LinkedInIcon size={14} /> Profile
              </a>
              <a
                href={`mailto:${person.email}`}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
                  isDark
                    ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                    : "border-zinc-300 text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                <Mail size={14} /> Email
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}