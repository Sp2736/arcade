"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, FileText, Map, Cpu, Library, LogOut, Settings, X 
} from "lucide-react";

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  isDarkMode: boolean;
  studentName: string;
  mobileOpen: boolean;      // New Prop
  onMobileClose: () => void; // New Prop
}

const MENU_ITEMS = [
  { id: "overview", label: "Command Center", icon: LayoutDashboard },
  { id: "notes", label: "Resource Vault", icon: FileText },      
  { id: "roadmap", label: "Career Roadmaps", icon: Map },        
  { id: "skills", label: "Skill Navigator", icon: Cpu },         
  { id: "resumes", label: "Resume Archives", icon: FileText },   
  { id: "resources", label: "Practice Zone", icon: Library },    
];

export default function StudentSidebar({ 
  activeView, onNavigate, isDarkMode, studentName, mobileOpen, onMobileClose 
}: SidebarProps) {
  
  const firstName = studentName.split(" ")[0].toUpperCase();

  // Styles
  const bgClass = isDarkMode ? "bg-[#09090b]/90 border-white/5" : "bg-white/90 border-zinc-200";
  const textMain = isDarkMode ? "text-white" : "text-zinc-900";
  
  // The internal content of the sidebar (Reused for both modes)
  const SidebarContent = () => (
    <div className="flex flex-col h-full p-6">
       {/* Header */}
       <div className="flex flex-col items-start mb-10">
        <div className="flex items-center justify-between w-full">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-600/20">
            A
            </div>
            {/* Mobile Close Button */}
            <button onClick={onMobileClose} className="md:hidden p-2 text-zinc-500">
                <X size={20} />
            </button>
        </div>
        <div className="mt-4">
          <h2 className={`text-sm font-bold tracking-widest ${textMain}`}>ARCADE</h2>
          <p className="text-[10px] font-mono text-zinc-500">{firstName}'S TERMINAL</p>
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 space-y-2">
        {MENU_ITEMS.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); onMobileClose(); }}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group relative ${
                isActive 
                 ? (isDarkMode ? "bg-blue-600/10 text-blue-400" : "bg-blue-50 text-blue-700")
                 : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/50"
              }`}
            >
              {isActive && (
                <motion.div layoutId="sidebar-active" className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full" />
              )}
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className={`pt-6 border-t ${isDarkMode ? "border-white/5" : "border-zinc-200"}`}>
        <button className="w-full flex items-center gap-4 p-3 text-zinc-500 hover:text-zinc-900 transition-all">
          <Settings size={20} /> <span className="text-sm">Settings</span>
        </button>
        <button className="w-full flex items-center gap-4 p-3 text-red-400/70 hover:text-red-500 transition-all">
          <LogOut size={20} /> <span className="text-sm">Disconnect</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
        {/* DESKTOP SIDEBAR (Static) */}
        <div className={`hidden md:flex w-72 h-full border-r flex-col backdrop-blur-xl ${bgClass}`}>
            <SidebarContent />
        </div>

        {/* MOBILE SIDEBAR (Overlay) */}
        <AnimatePresence>
            {mobileOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onMobileClose}
                        className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
                    />
                    {/* Sidebar */}
                    <motion.div 
                        initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
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