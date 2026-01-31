"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StudentSidebar from "./StudentSidebar";
import ProfileView from "./ProfileView";
import Overview from "./Overview";
import NotesView from "./NotesView";
import RoadmapView from "./RoadmapView";
import SkillNavigator from "./SkillNavigator";
import ResumeResourcesView from "./ResumeResourcesView";
import DashboardCursor from "./DashboardCursor"; 
import { Bell, Sun, Moon, X, Info, CheckCircle } from "lucide-react";

// Types for Notification
type Notification = {
    id: number;
    title: string;
    desc: string;
    time: string;
    type: "info" | "success" | "alert";
};

export default function StudentDashboard() {
  const [currentView, setCurrentView] = useState("overview");
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Notification State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [isNewUser, setIsNewUser] = useState(true); 

  // --- INITIAL NOTIFICATION LOGIC ---
  useEffect(() => {
    setNotifications([]);

    if (isNewUser) {
        setTimeout(() => {
            addNotification({
                title: "Welcome to ARCADE!",
                desc: "Your personalized career ecosystem is ready. Start by exploring the Skill Navigator.",
                type: "success",
                time: "Now"
            });
            setIsNewUser(false); 
        }, 500);
    }

    setTimeout(() => {
        addNotification({
            title: "New Material Verified",
            desc: "Topic: 'Process Scheduling' (OS) uploaded by Rohan Das has been verified by Prof. Varma.",
            type: "info",
            time: "2m ago"
        });
    }, 4000);

    setTimeout(() => {
        addNotification({
            title: "Roadmap Update",
            desc: "New 'Backend Engineering' path added by HOD.",
            type: "info",
            time: "10m ago"
        });
    }, 8000);

  }, []);

  const addNotification = (notif: Omit<Notification, "id">) => {
    setNotifications(prev => [{ id: Date.now(), ...notif }, ...prev]);
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Theme Constants
  const bgMain = isDarkMode ? "bg-[#050505]" : "bg-[#f8fafc]";
  const textMain = isDarkMode ? "text-white" : "text-zinc-900";
  const borderMain = isDarkMode ? "border-white/5" : "border-zinc-200";
  const headerBg = isDarkMode ? "bg-zinc-900/30" : "bg-white/70";

  return (
    <div className={`flex h-screen w-full font-sans overflow-hidden transition-colors duration-500 ${bgMain} ${textMain}`}>
      
      <DashboardCursor />

      {/* Background Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none z-0" 
        style={{
            backgroundImage: isDarkMode 
                ? "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)"
                : "linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px"
        }}
      />
      
      {/* Sidebar */}
      <div className="relative z-20 h-full">
        <StudentSidebar activeView={currentView} onNavigate={setCurrentView} isDarkMode={isDarkMode} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden z-10">
        
        {/* --- HEADER --- */}
        <header className={`h-20 border-b backdrop-blur-md flex items-center justify-between px-8 z-20 transition-colors duration-300 ${borderMain} ${headerBg}`}>
            <div>
                <h1 className="text-xl font-bold capitalize">
                    {currentView.replace("-", " ")}
                </h1>
                <p className={`text-xs font-mono ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                    SEM 4 // COMPUTER ENGINEERING
                </p>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
                
                {/* Theme Toggle */}
                <button 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`p-2 rounded-full transition-all ${isDarkMode ? "bg-white/5 hover:bg-white/10 text-yellow-400" : "bg-zinc-100 hover:bg-zinc-200 text-zinc-600"}`}
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {/* Notifications Trigger */}
                <div className="relative">
                    <button 
                        onClick={() => setShowNotifPanel(!showNotifPanel)}
                        className={`relative p-2 transition-colors ${isDarkMode ? "text-zinc-400 hover:text-white" : "text-zinc-400 hover:text-zinc-700"} ${showNotifPanel ? "text-blue-500" : ""}`}
                    >
                        <Bell size={20} />
                        {notifications.length > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-black" />
                        )}
                    </button>

                    {/* NOTIFICATION PANEL POPUP */}
                    <AnimatePresence>
                        {showNotifPanel && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className={`absolute right-0 top-12 w-80 md:w-96 rounded-2xl border shadow-2xl overflow-hidden backdrop-blur-xl z-50 ${isDarkMode ? "bg-zinc-900/90 border-white/10" : "bg-white/90 border-zinc-200"}`}
                            >
                                <div className={`p-4 border-b flex justify-between items-center ${isDarkMode ? "border-white/5 bg-white/5" : "border-zinc-100 bg-zinc-50"}`}>
                                    <h3 className={`font-bold text-sm ${textMain}`}>Notifications</h3>
                                    
                                    {/* --- NEW: Actions (Clear & Close) --- */}
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => setNotifications([])} className="text-[10px] text-blue-500 hover:underline">
                                            Clear All
                                        </button>
                                        <button 
                                            onClick={() => setShowNotifPanel(false)} 
                                            className={`p-1 rounded-md transition-colors ${isDarkMode ? "hover:bg-white/10 text-zinc-400 hover:text-white" : "hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900"}`}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>

                                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                    {notifications.length === 0 ? (
                                        <div className="p-8 text-center text-zinc-500 text-xs">No new notifications</div>
                                    ) : (
                                        notifications.map((n) => (
                                            <div key={n.id} className={`p-4 border-b relative group ${isDarkMode ? "border-white/5 hover:bg-white/5" : "border-zinc-100 hover:bg-zinc-50"}`}>
                                                <button 
                                                    onClick={() => removeNotification(n.id)}
                                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/10 hover:text-red-500 rounded"
                                                >
                                                    <X size={12} />
                                                </button>
                                                <div className="flex gap-3">
                                                    <div className={`mt-1 ${n.type === "success" ? "text-green-500" : "text-blue-500"}`}>
                                                        {n.type === "success" ? <CheckCircle size={16} /> : <Info size={16} />}
                                                    </div>
                                                    <div>
                                                        <h4 className={`text-sm font-bold ${textMain}`}>{n.title}</h4>
                                                        <p className={`text-xs mt-1 leading-relaxed ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>{n.desc}</p>
                                                        <p className="text-[10px] text-zinc-500 mt-2">{n.time}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* --- UPDATED: Profile Snippet (Clickable) --- */}
                <button 
                    onClick={() => setCurrentView("profile")}
                    className={`flex items-center gap-3 pl-6 border-l transition-opacity hover:opacity-80 group text-left ${borderMain}`}
                >
                    <div className="hidden md:block">
                        <p className={`text-sm font-bold ${textMain}`}>Swayam Patel</p>
                        <p className="text-xs text-blue-500">24DCS088</p>
                    </div>
                    <div className={`w-10 h-10 rounded-full overflow-hidden border shadow-sm group-hover:ring-2 ring-blue-500/50 transition-all ${isDarkMode ? "border-white/10" : "border-zinc-200"}`}>
                         <img src="/swayam.jpeg" alt="Swayam" className="w-full h-full object-cover" />
                    </div>
                </button>
                
            </div>
        </header>

        {/* Viewport */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative p-6 md:p-10">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentView}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
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