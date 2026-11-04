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
import AdminDashboard from "../dashboard-admin/AdminDashboard";

// Demo Utilities & Global Modules
import {
  installFetchInterceptor,
  seedSessionStorage,
  getDemoUser,
  setDemoUser,
  clearDemoUser,
} from "@/src/lib/mockDataService";
import RoleDetailsPanel from "../demo/RoleDetailsPanel";

export default function MainLayout() {
  const [currentView, setCurrentView] = useState<ViewState>("home");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);

  useEffect(() => {
    // 1. Initialize mock service and seed data
    installFetchInterceptor();
    seedSessionStorage();

    // 2. Load demo user if present in session
    const existingUser = getDemoUser();
    if (existingUser) {
      setUser(existingUser);
    }

    setLoading(false);

    // 3. Listen to auth changes from other components
    const handleAuthChange = (e: any) => {
      setUser(e.detail || getDemoUser());
    };
    window.addEventListener("arcade-auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("arcade-auth-change", handleAuthChange);
    };
  }, []);

  const handleAuthSuccess = (userData: any) => {
    setDemoUser(userData);
    setUser(userData);
  };

  const handleLogout = () => {
    clearDemoUser();
    setUser(null);
    setCurrentView("home");
    window.location.reload();
  };

  // 1. Initial Loading State
  if (loading) {
    return (
      <div className="h-screen w-full bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  // 2. Authenticated Persona Views (Admin, Faculty, Student, Alumni)
  if (user) {
    let dashboardContent = null;
    if (user.role === "admin") {
      dashboardContent = <AdminDashboard user={user} onLogout={handleLogout} />;
    } else if (user.role === "faculty") {
      dashboardContent = <FacultyDashboard onLogout={handleLogout} />;
    } else if (user.role === "alumni") {
      dashboardContent = <StudentDashboard user={user} initialView="alumni" onLogout={handleLogout} />;
    } else {
      dashboardContent = <StudentDashboard user={user} onLogout={handleLogout} />;
    }

    return (
      <div className="relative w-full h-full">
        {dashboardContent}
        <RoleDetailsPanel role={user.role} />
      </div>
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
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-3 bg-zinc-900/50 backdrop-blur-md rounded-xl border border-white/10"
        >
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
        <button
          onClick={() => setIsFAQOpen(true)}
          className="fixed bottom-8 right-8 z-[100] w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/30"
          aria-label="FAQ & Help"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Global Universal Details Panel for public landing as well */}
      <RoleDetailsPanel role={null} />
    </div>
  );
}
