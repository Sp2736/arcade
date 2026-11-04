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

const MENU_ITEMS = [
  { id: "overview", label: "Command Center", icon: LayoutDashboard },
  { id: "notes", label: "Resource Vault", icon: FileText },
  { id: "roadmap", label: "Career Roadmaps", icon: Map },
  { id: "skills", label: "Skill Navigator", icon: Cpu },
  { id: "alumni", label: "Expert Network", icon: Users },
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
  
  const bgClass = isDarkMode
    ? "bg-[#09090b] border-zinc-800"
    : "bg-white border-zinc-200";
  const textMain = isDarkMode ? "text-white" : "text-zinc-900";
  const textSub = isDarkMode ? "text-zinc-500" : "text-zinc-500";

  const handleLogoutClick = () => {
    localStorage.removeItem("arcade-user");
    sessionStorage.removeItem("arcade-demo-user");
    window.location.reload();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full p-6">
      {/* Header */}
      <div className="flex flex-col items-start mb-10">
        <div className="relative w-40 h-10 mb-2">
          <img
            src="/arcade-logo.png"
            alt="ARCADE"
            className="w-full h-full object-contain object-left"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
            STUDENT PORTAL
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 custom-scrollbar">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                onMobileClose();
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 font-bold"
                  : `${textSub} hover:bg-zinc-800/20 hover:text-white`
              }`}
            >
              <Icon
                size={18}
                className={`transition-transform duration-200 ${
                  isActive
                    ? "scale-110 text-white"
                    : "group-hover:scale-110 group-hover:text-white"
                }`}
              />
              <span className="tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Profile / Logout Component */}
      <div className="pt-6 border-t border-zinc-800/40 mt-auto">
        <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-xs text-blue-400">
              {firstName.substring(0, 2)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{studentName}</p>
              <p className="text-[10px] text-zinc-500 font-mono">ENROLLED</p>
            </div>
          </div>
          <button
            onClick={handleLogoutClick}
            className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className={`hidden md:flex flex-col w-64 h-full border-r ${bgClass}`}>
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className={`fixed top-0 bottom-0 left-0 w-72 z-50 flex flex-col border-r md:hidden ${bgClass}`}
            >
              <button
                onClick={onMobileClose}
                className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-white"
              >
                <X size={20} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
