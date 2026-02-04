"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Sun,
  Moon,
  LogOut,
  Menu,
  Bell,
  CheckCircle,
  X,
  Info,
  AlertTriangle,
  UploadCloud,
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

type Notification = {
  id: number;
  title: string;
  desc: string;
  time: string;
  type: "info" | "warning" | "success" | "error";
};

export default function FacultyDashboard() {
  const [currentView, setCurrentView] = useState("profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  /**
   * FIX: Added Persistence Logic
   * We initialize the state as false, then use useEffect to check localStorage.
   */
  const [isDarkMode, setIsDarkMode] = useState(false);

  // --- PERSISTENCE ENGINE ---
  useEffect(() => {
    // 1. Check if a theme was previously saved in this browser
    const savedTheme = localStorage.getItem("arcade-theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const nextMode = !prev;
      // 2. Save the new preference to localStorage
      localStorage.setItem("arcade-theme", nextMode ? "dark" : "light");
      return nextMode;
    });
  };

  // --- NOTIFICATIONS STATE ---
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);

  useEffect(() => {
    setNotifications([
      {
        id: 1,
        title: "Pending Approvals",
        desc: "5 new notes require your verification.",
        time: "10m ago",
        type: "warning",
      },
    ]);
  }, []);

  const addNotification = (n: Omit<Notification, "id">) => {
    setNotifications((prev) => [{ id: Date.now(), ...n }, ...prev]);
    setShowNotifPanel(true);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleHODSimulation = (approved: boolean) => {
    if (approved) {
      addNotification({
        title: "Resume Approved",
        desc: "The HOD has approved your resume.",
        time: "Just now",
        type: "success",
      });
    } else {
      addNotification({
        title: "Resume Rejected",
        desc: "The HOD returned your resume.",
        time: "Just now",
        type: "error",
      });
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
    inactiveNav: isDarkMode
      ? "text-slate-400 hover:text-slate-200"
      : "text-slate-500 hover:text-slate-900",
  };

  return (
    <div
      className={`flex h-screen w-full font-sans overflow-hidden transition-colors duration-300 ${theme.bgMain} ${theme.textMain}`}
    >
      {/* SIDEBAR */}
      <aside
        className={`flex-shrink-0 border-r transition-all duration-300 flex flex-col z-20 ${theme.bgSidebar} ${theme.border} ${isSidebarOpen ? "w-64" : "w-20"}`}
      >
        <div className={`h-16 flex items-center px-6 border-b ${theme.border}`}>
          <div className="w-8 h-8 bg-blue-700 rounded-md flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
            A
          </div>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ml-3 font-bold text-lg tracking-tight whitespace-nowrap"
            >
              ARCADE{" "}
              <span className="text-xs font-normal text-slate-500 ml-1">
                ADMIN
              </span>
            </motion.div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {MODULES.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                title={!isSidebarOpen ? item.label : ""}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all group whitespace-nowrap ${isActive ? theme.activeNav : `${theme.inactiveNav} ${theme.hover}`}`}
              >
                <item.icon
                  size={20}
                  className={`shrink-0 ${isActive ? "text-white" : ""}`}
                />
                {isSidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className={`p-4 border-t ${theme.border}`}>
          <button
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors whitespace-nowrap`}
          >
            <LogOut size={20} className="shrink-0" />
            {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        <header
          className={`h-16 border-b flex items-center justify-between px-6 z-30 ${theme.bgSidebar} ${theme.border}`}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-2 rounded-md ${theme.hover} ${theme.textSub}`}
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-semibold capitalize tracking-tight">
              {MODULES.find((m) => m.id === currentView)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowNotifPanel(!showNotifPanel)}
                className={`p-2 rounded-md relative ${showNotifPanel ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20" : `${theme.textSub} ${theme.hover}`}`}
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
                )}
              </button>
              <AnimatePresence>
                {showNotifPanel && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={`absolute right-0 top-12 w-80 rounded-md border shadow-xl overflow-hidden z-50 ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
                  >
                    <div
                      className={`p-3 border-b flex justify-between items-center ${isDarkMode ? "border-slate-800 bg-slate-950" : "border-slate-100 bg-slate-50"}`}
                    >
                      <h3
                        className={`font-bold text-xs uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
                      >
                        Notifications
                      </h3>
                      <button
                        onClick={() => setShowNotifPanel(false)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div
                          className={`p-6 text-center text-xs ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
                        >
                          No new alerts
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-3 border-b relative group transition-colors ${isDarkMode ? "border-slate-800 hover:bg-slate-800/50" : "border-slate-100 hover:bg-slate-50"}`}
                          >
                            <button
                              onClick={() => removeNotification(n.id)}
                              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity"
                            >
                              <X size={12} />
                            </button>
                            <div className="flex gap-3">
                              <div
                                className={`mt-0.5 ${n.type === "warning" ? "text-amber-500" : n.type === "success" ? "text-emerald-500" : n.type === "error" ? "text-red-500" : "text-blue-500"}`}
                              >
                                {n.type === "warning" ? (
                                  <AlertTriangle size={14} />
                                ) : n.type === "success" ? (
                                  <CheckCircle size={14} />
                                ) : (
                                  <Info size={14} />
                                )}
                              </div>
                              <div>
                                <h4
                                  className={`text-sm font-semibold leading-tight ${theme.textMain}`}
                                >
                                  {n.title}
                                </h4>
                                <p className={`text-xs mt-1 ${theme.textSub}`}>
                                  {n.desc}
                                </p>
                                <span
                                  className={`text-[10px] mt-1 block ${theme.textSub}`}
                                >
                                  {n.time}
                                </span>
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

            <div className={`h-6 w-px ${theme.border}`}></div>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-md border transition-colors ${isDarkMode ? "bg-slate-800 border-slate-700 text-yellow-400" : "bg-white border-slate-200 text-slate-600"}`}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={() => setCurrentView("profile")}
              className={`flex items-center gap-3 pl-2 group rounded-md p-1 transition-colors ${theme.hover}`}
            >
              <div className="text-right hidden sm:block">
                <p
                  className={`text-sm font-bold leading-none ${theme.textMain}`}
                >
                  Prof. J. Doe
                </p>
                <p
                  className={`text-[10px] uppercase font-bold ${theme.textSub}`}
                >
                  HOD - Comp Eng
                </p>
              </div>
              <div className="h-9 w-9 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm border border-blue-200 group-hover:ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 transition-all">
                JD
              </div>
            </button>
          </div>
        </header>

        <main className={`flex-1 overflow-y-auto p-4 md:p-8 ${theme.bgMain}`}>
          <div className="max-w-7xl mx-auto h-full">
            <AnimatePresence mode="wait">
              {currentView === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <FacultyProfile isDark={isDarkMode} />
                </motion.div>
              )}
              {currentView === "verification" && (
                <motion.div
                  key="verification"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <FacultyVerification isDark={isDarkMode} />
                </motion.div>
              )}
              {currentView === "uploads" && (
                <motion.div
                  key="uploads"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <FacultyUploads
                    isDark={isDarkMode}
                    onSimulateHODResponse={handleHODSimulation}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}