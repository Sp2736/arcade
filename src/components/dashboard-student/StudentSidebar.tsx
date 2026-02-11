"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Map,
  Cpu,
  Library,
  LogOut,
  X,
  Users,
} from "lucide-react";

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  isDarkMode: boolean;
  studentName: string;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

// ... inside the file ...

// 2. Add the 'alumni' object to your MENU_ITEMS
const MENU_ITEMS = [
  { id: "overview", label: "Command Center", icon: LayoutDashboard },
  { id: "notes", label: "Resource Vault", icon: FileText },
  { id: "roadmap", label: "Career Roadmaps", icon: Map },
  { id: "skills", label: "Skill Navigator", icon: Cpu },
  { id: "alumni", label: "Expert Network", icon: Users }, // The new option
  { id: "resumes", label: "Resume Archives", icon: FileText },
  { id: "resources", label: "Practice Zone", icon: Library },
];
export default function StudentSidebar({
  activeView,
  onNavigate,
  isDarkMode,
  studentName,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const firstName = studentName.split(" ")[0].toUpperCase();
  // UPDATED BG: Dark mode is now a solid tint
  const bgClass = isDarkMode
    ? "bg-[#09090b] border-zinc-800"
    : "bg-white border-zinc-200";
  const textMain = isDarkMode ? "text-white" : "text-zinc-900";
  const textSub = isDarkMode ? "text-zinc-500" : "text-zinc-500";

  const SidebarContent = () => (
    <div className="flex flex-col h-full p-6">
      {/* Header */}
      <div className="flex flex-col items-start mb-10">
        <div className="flex items-center justify-between w-full">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden shadow-lg shadow-blue-600/20 bg-white">
            {/* Replace 'logo.png' with your actual file name */}
            <img
              src="/logo-small.png"
              alt="ARCADE Logo"
              className="w-full h-full object-contain p-1"
            />
          </div>
          <button
            onClick={onMobileClose}
            className="md:hidden p-2 text-zinc-500 hover:text-zinc-800"
          >
            <X size={20} />
          </button>
        </div>
        <div className="mt-4">
          <h2 className={`text-sm font-bold tracking-widest ${textMain}`}>
            ARCADE
          </h2>
          <p className={`text-[10px] font-mono ${textSub}`}>
            {firstName}'S TERMINAL
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 space-y-2">
        {MENU_ITEMS.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                onMobileClose();
              }}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? isDarkMode
                    ? "bg-blue-600/10 text-blue-400"
                    : "bg-blue-50 text-blue-700"
                  : isDarkMode
                    ? "text-zinc-500 hover:text-white hover:bg-white/5"
                    : "text-zinc-500 hover:text-black hover:bg-zinc-100/70"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full"
                />
              )}
              <div className="relative">
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Footer - FIXED: HOVER EFFECTS */}
      <div
        className={`pt-6 border-t ${isDarkMode ? "border-zinc-800" : "border-zinc-200"}`}
      >
        <button
          className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
            isDarkMode
              ? "text-red-400/70 hover:text-red-400 hover:bg-red-500/10"
              : "text-red-500/70 hover:text-red-600 hover:bg-red-50"
          }`}
        >
          <LogOut size={20} /> <span className="text-sm">Disconnect</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div
        className={`hidden md:flex w-72 h-full border-r flex-col backdrop-blur-xl transition-colors duration-300 ${bgClass}`}
      >
        <SidebarContent />
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed inset-y-0 left-0 z-50 w-72 border-r shadow-2xl ${bgClass}`}
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
