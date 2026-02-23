"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, MessageCircle, Loader2 } from "lucide-react";

import { Sidebar, MobileMenu, ViewState } from "./Navigation";
import AboutPortal from "./AboutPortal";
import HomeView from "./HomeView"; 
import AuthView from "./AuthView";
import ContactView from "./ContactView";
import FAQSidebar from "./FAQSidebar";
import BackgroundMeteors from "./BackgroundMeteors";
import MeteorCursor from "./MeteorCursor";

// Dashboard Imports
import StudentDashboard from "../dashboard-student/StudentDashboard";
import FacultyDashboard from "../dashboard-faculty/FacultyDashboard";

export default function MainLayout() {
  const [currentView, setCurrentView] = useState<ViewState>("home");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);

  useEffect(() => {
    // On load, check if we have a user saved in the browser
    const savedUser = localStorage.getItem("arcade-user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("arcade-user");
      }
    }
    setLoading(false);
  }, []);

  const handleAuthSuccess = (userData: any) => {
    localStorage.setItem("arcade-user", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("arcade-user");
    setUser(null);
    setCurrentView("home");
    window.location.reload(); // Hard reset to clear all states
  };

  // 1. Initial Loading State
  if (loading) {
    return (
      <div className="h-screen w-full bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  // 2. Authenticated View (Student or Faculty)
  if (user) {
    return user.role === "faculty" ? (
      <FacultyDashboard onLogout={handleLogout} />
    ) : (
      <StudentDashboard onLogout={handleLogout} />
    );
  }

  // 3. Public Visitor View
  return (
    <div className="flex h-screen w-full bg-[#050505] text-white font-sans overflow-hidden relative">
      <BackgroundMeteors />
      <MeteorCursor />
      
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      <MobileMenu 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        mobileOpen={mobileMenuOpen} 
        onMobileClose={() => setMobileMenuOpen(false)} 
      />

      <div className="fixed top-6 left-6 z-[100] md:hidden">
        <button onClick={() => setMobileMenuOpen(true)} className="p-3 bg-zinc-900/50 backdrop-blur-md rounded-xl border border-white/10">
          <Menu size={20} />
        </button>
      </div>

      <div className="flex-1 h-full overflow-y-auto relative z-10 custom-scrollbar">
        <AnimatePresence mode="wait">
          {currentView === "home" && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <HomeView onNavigate={setCurrentView} />
            </motion.div>
          )}
          {currentView === "login" && (
            <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AuthView onAuthSuccess={handleAuthSuccess} />
            </motion.div>
          )}
          {currentView === "contact" && <ContactView onNavigate={setCurrentView} />}
          {currentView === "about" && <AboutPortal />}
        </AnimatePresence>
        <FAQSidebar isOpen={isFAQOpen} onClose={() => setIsFAQOpen(false)} />
      </div>

      {!isFAQOpen && (
        <button onClick={() => setIsFAQOpen(true)} className="fixed bottom-8 right-8 z-[100] w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center">
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
}