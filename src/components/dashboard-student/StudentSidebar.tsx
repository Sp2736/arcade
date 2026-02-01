"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  FileText, 
  Map,      
  Cpu,      
  Library,  
  LogOut, 
  Settings 
} from "lucide-react";

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  isDarkMode: boolean;
  studentName: string; // Added prop
}

const MENU_ITEMS = [
  { id: "overview", label: "Command Center", icon: LayoutDashboard },
  { id: "notes", label: "Resource Vault", icon: FileText },      
  { id: "roadmap", label: "Career Roadmaps", icon: Map },        
  { id: "skills", label: "Skill Navigator", icon: Cpu },         
  { id: "resumes", label: "Resume Archives", icon: FileText },   
  { id: "resources", label: "Practice Zone", icon: Library },    
];

export default function StudentSidebar({ activeView, onNavigate, isDarkMode, studentName }: SidebarProps) {
  
  // Extract First Name for the Label
  const firstName = studentName.split(" ")[0].toUpperCase();

  // High Contrast Theme Styles
  const containerClass = isDarkMode 
    ? "bg-zinc-900/50 border-white/5" 
    : "bg-white/90 border-zinc-200 shadow-xl shadow-zinc-200/50";
  
  const textMain = isDarkMode ? "text-white" : "text-zinc-900";
  const textSub = isDarkMode ? "text-zinc-500" : "text-zinc-500";

  return (
    <div className={`h-full w-20 md:w-64 backdrop-blur-xl border-r flex flex-col justify-between py-6 transition-all duration-300 ${containerClass}`}>
      
      {/* --- LOGO AREA --- */}
      <div className="px-0 md:px-8 flex flex-col items-center md:items-start mb-8">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-600/20">
          A
        </div>
        <div className="hidden md:block mt-4">
          <h2 className={`text-sm font-bold tracking-widest ${textMain}`}>ARCADE</h2>
          {/* Dynamic Terminal Name */}
          <p className={`text-[10px] font-mono ${textSub}`}>{firstName}'S TERMINAL</p>
        </div>
      </div>

      {/* --- NAVIGATION --- */}
      <div className="flex-1 px-3 space-y-2">
        {MENU_ITEMS.map((item) => {
          const isActive = activeView === item.id;
          
          let buttonClass = "";
          if (isActive) {
            buttonClass = isDarkMode 
                ? "bg-blue-600/10 text-blue-400" 
                : "bg-blue-50 text-blue-700"; 
          } else {
            buttonClass = isDarkMode
                ? "text-zinc-500 hover:text-white hover:bg-white/5"
                : "text-zinc-500 hover:text-black hover:bg-zinc-200/70"; 
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group relative ${buttonClass}`}
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

              <span className="hidden md:block text-sm font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* --- FOOTER --- */}
      <div className={`px-3 border-t pt-4 space-y-2 ${isDarkMode ? "border-white/5" : "border-zinc-200"}`}>
        <button className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${isDarkMode ? "text-zinc-500 hover:text-white hover:bg-white/5" : "text-zinc-500 hover:text-black hover:bg-zinc-200/70"}`}>
          <Settings size={20} />
          <span className="hidden md:block text-sm font-medium">Settings</span>
        </button>
        <button className="w-full flex items-center gap-4 p-3 rounded-xl text-red-400/70 hover:text-red-500 hover:bg-red-500/10 transition-all">
          <LogOut size={20} />
          <span className="hidden md:block text-sm font-medium">Disconnect</span>
        </button>
      </div>

    </div>
  );
}