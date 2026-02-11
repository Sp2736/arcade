"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Sun, Moon, LogOut, Menu, Bell, CheckCircle, 
  X, Info, AlertTriangle, UploadCloud
} from "lucide-react";

import FacultyProfile from "./FacultyProfile";
import FacultyVerification from "./FacultyVerification";
import FacultyUploads from "./FacultyUploads";

// --- NAVIGATION MODULES ---
const MODULES = [
  { id: "profile", label: "My Profile", icon: User },
  { id: "uploads", label: "My Uploads", icon: UploadCloud },
  { id: "verification", label: "Verification Console", icon: CheckCircle },
];

type Notification = { id: number; title: string; desc: string; time: string; type: "info" | "warning" | "success" | "error" };

export default function FacultyDashboard() {
  const [currentView, setCurrentView] = useState("profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // --- THEME STATE ---
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // --- NOTIFICATIONS STATE ---
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("arcade-theme");
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
    }

    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsMobile(true);
        setIsSidebarOpen(false);
      } else {
        setIsMobile(false);
        setIsSidebarOpen(true);
      }
    };

    handleResize(); 
    window.addEventListener("resize", handleResize);
    setMounted(true);

    setNotifications([{ id: 1, title: "Pending Approvals", desc: "5 new notes require your verification.", time: "10m ago", type: "warning" }]);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("arcade-theme", newMode ? "dark" : "light");
  };

  const addNotification = (n: Omit<Notification, "id">) => {
    setNotifications(prev => [{ id: Date.now(), ...n }, ...prev]);
    setShowNotifPanel(true);
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleHODSimulation = (approved: boolean) => {
    if (approved) {
        addNotification({ title: "Resume Approved", desc: "The HOD has approved your resume.", time: "Just now", type: "success" });
    } else {
        addNotification({ title: "Resume Rejected", desc: "The HOD returned your resume.", time: "Just now", type: "error" });
    }
  };

  // --- THEME ENGINE ---
  const theme = {
    bgMain: isDarkMode ? "bg-slate-950" : "bg-slate-50",
    bgSidebar: isDarkMode ? "bg-slate-900" : "bg-white",
    textMain: isDarkMode ? "text-slate-100" : "text-slate-900",
    textSub: isDarkMode ? "text-slate-400" : "text-slate-500",
    border: isDarkMode ? "border-slate-800" : "border-slate-200",
    hover: isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-100",
    activeNav: "bg-blue-700 text-white shadow-md shadow-blue-900/20",
    inactiveNav: isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-900",
    panelBg: isDarkMode ? "bg-slate-900" : "bg-white",
  };

  if (!mounted) return <div className="h-screen w-full bg-slate-50 dark:bg-slate-950" />;

  return (
    <div className={`flex h-screen w-full font-sans overflow-hidden transition-colors duration-200 ease-in-out ${theme.bgMain} ${theme.textMain}`}>
      
      {/* MOBILE BACKDROP & DRAWER */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsSidebarOpen(false)}
            />
        )}
      </AnimatePresence>

      <aside 
        className={`fixed md:relative z-50 h-full flex flex-col border-r transition-[transform,width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] 
            ${theme.bgSidebar} ${theme.border}
            ${isMobile 
                ? (isSidebarOpen ? "translate-x-0 w-72" : "-translate-x-full w-72") 
                : (isSidebarOpen ? "translate-x-0 w-64" : "translate-x-0 w-20")
            }
        `}
      >
        <div className={`h-16 flex items-center px-5 border-b shrink-0 ${theme.border} ${isMobile ? "justify-between" : ""}`}>
          <div className="flex items-center overflow-hidden">
            <div className="w-8 h-8 rounded-md flex items-center justify-center overflow-hidden shadow-sm shrink-0 bg-white">
  {/* Replace 'logo.png' with your actual file name */}
  <img src="/logo-small.png" alt="ARCADE Logo" className="w-full h-full object-contain p-0.5" />
</div>
            <div className={`ml-3 font-bold text-lg tracking-tight whitespace-nowrap transition-all duration-300 ${!isMobile && !isSidebarOpen ? "opacity-0 w-0" : "opacity-100 w-auto"}`}>
                ARCADE <span className="text-xs font-normal text-slate-500 ml-1">ADMIN</span>
            </div>
          </div>
          {isMobile && <button onClick={() => setIsSidebarOpen(false)} className={`p-1 ${theme.textSub}`}><X size={20} /></button>}
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {MODULES.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button 
                key={item.id} 
                onClick={() => { setCurrentView(item.id); if (isMobile) setIsSidebarOpen(false); }} 
                title={!isSidebarOpen && !isMobile ? item.label : ""} 
                className={`w-full flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 group whitespace-nowrap overflow-hidden ${isActive ? theme.activeNav : `${theme.inactiveNav} ${theme.hover}`}`}
              >
                <item.icon size={20} className={`shrink-0 ${isActive ? "text-white" : ""}`} />
                <span className={`ml-3 transition-opacity duration-300 ${!isMobile && !isSidebarOpen ? "opacity-0" : "opacity-100"}`}>{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        <div className={`p-4 border-t ${theme.border}`}>
          <button className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors whitespace-nowrap overflow-hidden`}>
            <LogOut size={20} className="shrink-0" />
            <span className={`ml-3 transition-opacity duration-300 ${!isMobile && !isSidebarOpen ? "opacity-0" : "opacity-100"}`}>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        <header className={`h-16 border-b flex items-center justify-between px-4 md:px-6 z-30 shrink-0 ${theme.bgSidebar} ${theme.border}`}>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-2 rounded-md transition-colors ${theme.hover} ${theme.textSub}`}><Menu size={20} /></button>
            <h1 className="text-lg font-semibold capitalize tracking-tight truncate max-w-[120px] md:max-w-none">{MODULES.find(m => m.id === currentView)?.label}</h1>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* NOTIFICATIONS */}
            <div className="relative">
                <button onClick={() => setShowNotifPanel(!showNotifPanel)} className={`p-2 rounded-md relative transition-colors ${showNotifPanel ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20" : `${theme.textSub} ${theme.hover}`}`}>
                    <Bell size={20} />
                    {notifications.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>}
                </button>

                <AnimatePresence>
                    {showNotifPanel && (
                        <>
                            {/* Mobile Backdrop for Notifications */}
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                                onClick={() => setShowNotifPanel(false)}
                            />
                            
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                                animate={{ opacity: 1, y: 0, scale: 1 }} 
                                exit={{ opacity: 0, y: 10, scale: 0.95 }} 
                                // FIX: Fixed positioning on mobile (center screen), Absolute on Desktop (anchored to button)
                                className={`
                                    fixed md:absolute 
                                    top-20 md:top-12 
                                    left-4 right-4 md:left-auto md:right-0 
                                    w-auto md:w-80 
                                    rounded-lg border shadow-2xl overflow-hidden z-50 
                                    ${theme.panelBg} ${theme.border}
                                `}
                            >
                                <div className={`p-3 border-b flex justify-between items-center ${isDarkMode ? "border-slate-800 bg-slate-950" : "border-slate-100 bg-slate-50"}`}>
                                    <h3 className={`font-bold text-xs uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Notifications</h3>
                                    <button onClick={() => setShowNotifPanel(false)} className="text-slate-400 hover:text-slate-600"><X size={14}/></button>
                                </div>
                                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                                    {notifications.length === 0 ? (
                                        <div className={`p-8 text-center flex flex-col items-center ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                            <Bell size={32} className="mb-2 opacity-20" />
                                            <span className="text-xs">No new alerts</span>
                                        </div>
                                    ) : (
                                        notifications.map(n => (
                                            <div key={n.id} className={`p-3 border-b relative group transition-colors ${isDarkMode ? "border-slate-800 hover:bg-slate-800/50" : "border-slate-100 hover:bg-slate-50"}`}>
                                                <button onClick={() => removeNotification(n.id)} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity"><X size={12}/></button>
                                                <div className="flex gap-3">
                                                    <div className={`mt-0.5 shrink-0 ${n.type === "warning" ? "text-amber-500" : n.type === "success" ? "text-emerald-500" : n.type === "error" ? "text-red-500" : "text-blue-500"}`}>
                                                        {n.type === "warning" ? <AlertTriangle size={14} /> : n.type === "success" ? <CheckCircle size={14} /> : <Info size={14} />}
                                                    </div>
                                                    <div className="min-w-0 pr-4">
                                                        <h4 className={`text-sm font-semibold leading-tight truncate ${theme.textMain}`}>{n.title}</h4>
                                                        <p className={`text-xs mt-1 break-words leading-relaxed ${theme.textSub}`}>{n.desc}</p>
                                                        <span className={`text-[10px] mt-1.5 block ${theme.textSub} opacity-70`}>{n.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
            
            <div className={`h-6 w-px transition-colors ${theme.border}`}></div>
            
            <button onClick={toggleTheme} className={`p-2 rounded-md border transition-all ${isDarkMode ? "bg-slate-800 border-slate-700 text-yellow-400" : "bg-white border-slate-200 text-slate-600"}`}>
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <button onClick={() => setCurrentView("profile")} className={`flex items-center gap-3 pl-2 group rounded-md p-1 transition-colors ${theme.hover}`}>
                <div className="text-right hidden md:block">
                    <p className={`text-sm font-bold leading-none ${theme.textMain}`}>Prof. J. Doe</p>
                    <p className={`text-[10px] uppercase font-bold ${theme.textSub}`}>HOD - Comp Eng</p>
                </div>
                <div className="h-9 w-9 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm border border-blue-200">JD</div>
            </button>
          </div>
        </header>

        <main className={`flex-1 overflow-y-auto p-4 md:p-8 transition-colors duration-200 ${theme.bgMain}`}>
            <div className="max-w-7xl mx-auto h-full">
                <AnimatePresence mode="wait">
                    {currentView === "profile" && <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}><FacultyProfile isDark={isDarkMode} /></motion.div>}
                    {currentView === "verification" && <motion.div key="verification" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}><FacultyVerification isDark={isDarkMode} /></motion.div>}
                    {currentView === "uploads" && <motion.div key="uploads" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}><FacultyUploads isDark={isDarkMode} onSimulateHODResponse={handleHODSimulation} /></motion.div>}
                </AnimatePresence>
            </div>
        </main>
      </div>
    </div>
  );
}