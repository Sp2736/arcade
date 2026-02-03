"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutGrid, User, Settings, FileText, 
  BarChart3, Users, Sun, Moon, LogOut, Menu, Bell, CheckCircle
} from "lucide-react";

// Sub-components
import FacultyProfile from "./FacultyProfile";
import FacultyVerification from "./FacultyVerification";
import FacultyAnalytics from "./FacultyAnalytics";

// --- NAVIGATION MODULES ---
const MODULES = [
  { id: "dashboard", label: "Dashboard Overview", icon: LayoutGrid },
  { id: "profile", label: "My Profile", icon: User },
  { id: "verification", label: "Verification Console", icon: CheckCircle }, // Module A
  { id: "analytics", label: "Student Analytics", icon: BarChart3 },         // Module B
  { id: "students", label: "Student Directory", icon: Users },              // Placeholder
  { id: "settings", label: "System Settings", icon: Settings },
];

export default function FacultyDashboard() {
  const [currentView, setCurrentView] = useState("profile");
  const [isDarkMode, setIsDarkMode] = useState(false); // Default Light for Enterprise feel
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // --- THEME ENGINE (Corporate Slate Palette) ---
  // We use specific consts to ensure strict consistency across the faculty dashboard
  const theme = {
    bgMain: isDarkMode ? "bg-slate-950" : "bg-slate-50",
    bgSidebar: isDarkMode ? "bg-slate-900" : "bg-white",
    textMain: isDarkMode ? "text-slate-100" : "text-slate-900",
    textSub: isDarkMode ? "text-slate-400" : "text-slate-500",
    border: isDarkMode ? "border-slate-800" : "border-slate-200",
    hover: isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-100",
    activeNav: "bg-blue-700 text-white shadow-md shadow-blue-900/20",
    inactiveNav: isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-900",
  };

  return (
    <div className={`flex h-screen w-full font-sans overflow-hidden transition-colors duration-300 ${theme.bgMain} ${theme.textMain}`}>
      
      {/* --- SIDEBAR --- */}
      <aside 
        className={`flex-shrink-0 border-r transition-all duration-300 flex flex-col z-20 ${theme.bgSidebar} ${theme.border} ${isSidebarOpen ? "w-64" : "w-20"}`}
      >
        {/* Brand Header */}
        <div className={`h-16 flex items-center px-6 border-b ${theme.border}`}>
          <div className="w-8 h-8 bg-blue-700 rounded-md flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
            A
          </div>
          {isSidebarOpen && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                className="ml-3 font-bold text-lg tracking-tight whitespace-nowrap"
            >
                ARCADE <span className="text-xs font-normal text-slate-500 ml-1">ADMIN</span>
            </motion.div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {MODULES.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                title={!isSidebarOpen ? item.label : ""}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all group whitespace-nowrap ${
                  isActive ? theme.activeNav : `${theme.inactiveNav} ${theme.hover}`
                }`}
              >
                <item.icon size={20} className={`shrink-0 ${isActive ? "text-white" : ""}`} />
                {isSidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className={`p-4 border-t ${theme.border}`}>
          <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors whitespace-nowrap`}>
            <LogOut size={20} className="shrink-0" />
            {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT WRAPPER --- */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        
        {/* Topbar */}
        <header className={`h-16 border-b flex items-center justify-between px-6 z-10 ${theme.bgSidebar} ${theme.border}`}>
          
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-2 rounded-md ${theme.hover} ${theme.textSub}`}>
                <Menu size={20} />
            </button>
            <h1 className="text-lg font-semibold capitalize tracking-tight">
                {MODULES.find(m => m.id === currentView)?.label || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className={`p-2 rounded-md relative ${theme.hover} ${theme.textSub}`}>
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
            </button>
            <div className={`h-6 w-px ${theme.border}`}></div>
            <button 
                onClick={() => setIsDarkMode(!isDarkMode)} 
                className={`p-2 rounded-md border transition-colors ${isDarkMode ? "bg-slate-800 border-slate-700 text-yellow-400" : "bg-white border-slate-200 text-slate-600"}`}
            >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <div className="flex items-center gap-3 pl-2">
                <div className="text-right hidden sm:block">
                    <p className={`text-sm font-bold leading-none ${theme.textMain}`}>Prof. J. Doe</p>
                    <p className={`text-[10px] uppercase font-bold ${theme.textSub}`}>HOD - Comp Eng</p>
                </div>
                <div className="h-9 w-9 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm border border-blue-200">
                    JD
                </div>
            </div>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <main className={`flex-1 overflow-y-auto p-4 md:p-8 ${theme.bgMain}`}>
            <div className="max-w-7xl mx-auto h-full">
                <AnimatePresence mode="wait">
                    
                    {/* PROFILE MODULE */}
                    {currentView === "profile" && (
                        <motion.div 
                            key="profile"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} 
                            transition={{ duration: 0.2 }}
                        >
                            <FacultyProfile isDark={isDarkMode} />
                        </motion.div>
                    )}

                    {/* MODULE A: VERIFICATION */}
                    {currentView === "verification" && (
                        <motion.div 
                            key="verification"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} 
                            transition={{ duration: 0.2 }}
                        >
                            <FacultyVerification isDark={isDarkMode} />
                        </motion.div>
                    )}

                    {/* MODULE B: ANALYTICS */}
                    {currentView === "analytics" && (
                        <motion.div 
                            key="analytics"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} 
                            transition={{ duration: 0.2 }}
                        >
                            <FacultyAnalytics isDark={isDarkMode} />
                        </motion.div>
                    )}

                    {/* FALLBACK FOR UNBUILT MODULES */}
                    {["dashboard", "students", "settings"].includes(currentView) && (
                        <motion.div 
                            key="placeholder"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className={`flex flex-col items-center justify-center h-[60vh] rounded-lg border-2 border-dashed ${theme.border}`}
                        >
                            <Settings size={48} className={`mb-4 opacity-20 ${theme.textMain}`} />
                            <h3 className={`text-lg font-medium ${theme.textSub}`}>Module Under Construction</h3>
                            <p className={`text-sm opacity-50 ${theme.textSub}`}>Administrator access required.</p>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </main>

      </div>
    </div>
  );
}