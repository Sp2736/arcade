"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Sun, Moon, X, Info, CheckCircle, Menu } from "lucide-react";

import StudentSidebar from "./StudentSidebar";
import ProfileView from "./ProfileView";
import Overview from "./Overview";
import NotesView from "./NotesView";
import RoadmapView from "./RoadmapView";
import SkillNavigator from "./SkillNavigator";
import ResumeResourcesView from "./ResumeResourcesView";
import DashboardCursor from "./DashboardCursor"; 
import InteractiveBackground from "./InteractiveBackground"; // New Import

// Notification Type
type Notification = { id: number; title: string; desc: string; time: string; type: "info" | "success" | "alert"; };

export default function StudentDashboard() {
  const [currentView, setCurrentView] = useState("overview");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Mobile State
  
  // Notification State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [isNewUser, setIsNewUser] = useState(true); 

  // --- NOTIFICATION LOGIC ---
  useEffect(() => {
    setNotifications([]);
    const timers: NodeJS.Timeout[] = [];

    if (isNewUser) {
        const t1 = setTimeout(() => {
            addNotification({ title: "Welcome to ARCADE!", desc: "Your personalized career ecosystem is ready.", type: "success", time: "Now" });
            setIsNewUser(false); 
        }, 500);
        timers.push(t1);
    }
    const t2 = setTimeout(() => {
        addNotification({ title: "New Material Verified", desc: "Topic: 'Process Scheduling' (OS) uploaded by Rohan Das.", type: "info", time: "2m ago" });
    }, 4000);
    timers.push(t2);

    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  const addNotification = (notif: Omit<Notification, "id">) => {
    setNotifications(prev => [{ id: Date.now() + Math.random(), ...notif }, ...prev]);
  };
  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Theme Classes
  const textMain = isDarkMode ? "text-white" : "text-zinc-900";
  const borderMain = isDarkMode ? "border-white/5" : "border-zinc-200";

  return (
    <div className={`flex h-screen w-full font-sans overflow-hidden ${textMain}`}>
      
      <DashboardCursor />
      
      {/* 1. FLUID BACKGROUND */}
      <InteractiveBackground isDarkMode={isDarkMode} />

      {/* 2. SIDEBAR (Handles Desktop & Mobile) */}
      <div className="relative z-30">
        <StudentSidebar 
            activeView={currentView} 
            onNavigate={setCurrentView} 
            isDarkMode={isDarkMode}
            studentName="Swayam Patel"
            mobileOpen={mobileMenuOpen}
            onMobileClose={() => setMobileMenuOpen(false)}
        />
      </div>

      {/* 3. MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-full relative z-20 overflow-hidden">
        
        {/* TOP BAR */}
        <header className={`h-16 md:h-20 border-b backdrop-blur-md flex items-center justify-between px-4 md:px-8 transition-colors duration-300 ${borderMain} ${isDarkMode ? "bg-zinc-900/30" : "bg-white/50"}`}>
            
            <div className="flex items-center gap-4">
                {/* Hamburger (Mobile Only) */}
                <button 
                    onClick={() => setMobileMenuOpen(true)}
                    className="md:hidden p-2 -ml-2 text-zinc-500 hover:text-zinc-800"
                >
                    <Menu size={24} />
                </button>

                <div>
                    <h1 className="text-lg md:text-xl font-bold capitalize truncate max-w-[150px] md:max-w-none">
                        {currentView.replace("-", " ")}
                    </h1>
                    <p className={`hidden md:block text-xs font-mono ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                        SEM 4 // COMPUTER ENGINEERING
                    </p>
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3 md:gap-6">
                <button 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`p-2 rounded-full transition-all ${isDarkMode ? "bg-white/5 text-yellow-400" : "bg-zinc-100 text-zinc-600"}`}
                >
                    {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                <div className="relative">
                    <button 
                        onClick={() => setShowNotifPanel(!showNotifPanel)}
                        className={`relative p-2 transition-colors ${showNotifPanel ? "text-blue-500" : "text-zinc-400"}`}
                    >
                        <Bell size={20} />
                        {notifications.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-black" />}
                    </button>
                    {/* Notification Panel (Same logic as before, just ensured z-index is high) */}
                    <AnimatePresence>
                        {showNotifPanel && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className={`absolute right-0 top-12 w-80 rounded-2xl border shadow-2xl overflow-hidden backdrop-blur-xl z-50 ${isDarkMode ? "bg-zinc-900/95 border-white/10" : "bg-white/95 border-zinc-200"}`}
                            >
                                <div className="p-4 border-b flex justify-between items-center opacity-80">
                                    <h3 className="font-bold text-sm">Notifications</h3>
                                    <div className="flex gap-3">
                                        <button onClick={() => setNotifications([])} className="text-[10px] text-blue-500">Clear</button>
                                        <button onClick={() => setShowNotifPanel(false)}><X size={14}/></button>
                                    </div>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto">
                                    {notifications.length === 0 ? <div className="p-8 text-center text-xs opacity-50">Empty</div> : notifications.map(n => (
                                        <div key={n.id} className="p-4 border-b border-white/5 relative group">
                                            <button onClick={() => removeNotification(n.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"><X size={12}/></button>
                                            <h4 className="text-sm font-bold">{n.title}</h4>
                                            <p className="text-xs opacity-70 mt-1">{n.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <button onClick={() => setCurrentView("profile")} className="flex items-center gap-3 pl-3 md:pl-6 border-l border-white/10">
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-bold">Swayam</p>
                        <p className="text-[10px] text-blue-500">24DCS088</p>
                    </div>
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border shadow-sm">
                         <img src="/swayam.jpeg" alt="Swayam" className="w-full h-full object-cover" />
                    </div>
                </button>
            </div>
        </header>

        {/* VIEWPORT Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative p-4 md:p-8">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentView}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }} // Subtle scale for WOW effect
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="h-full max-w-7xl mx-auto" // Constrain width for large screens
                >
                    {currentView === "overview" && <Overview isDark={isDarkMode} />}
                    {currentView === "profile" && <ProfileView isDarkMode={isDarkMode} />}
                    {currentView === "notes" && <NotesView isDark={isDarkMode} />}
                    {currentView === "roadmap" && <RoadmapView isDark={isDarkMode} />}
                    {currentView === "skills" && <SkillNavigator isDark={isDarkMode} />}
                    {currentView === "resumes" && <ResumeResourcesView isDark={isDarkMode} initialTab="resumes" />}
                    {currentView === "resources" && <ResumeResourcesView isDark={isDarkMode} initialTab="resources" />}
                </motion.div>
            </AnimatePresence>
        </div>

      </div>
    </div>
  );
}