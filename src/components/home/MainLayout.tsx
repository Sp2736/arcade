"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, MessageCircle, Loader2 } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

import { Sidebar, MobileMenu, ViewState } from "./Navigation";
import AboutPortal from "./AboutPortal";
import HomeView from "./HomeView";
import AuthView from "./AuthView";
import ContactView from "./ContactView";
import FAQSidebar from "./FAQSidebar";
import BackgroundMeteors from "./BackgroundMeteors";
import MeteorCursor from "./MeteorCursor";

import StudentDashboard from "../dashboard-student/StudentDashboard";
import FacultyDashboard from "../dashboard-faculty/FacultyDashboard";

export default function MainLayout() {
  // --- NEXTAUTH REPLACES SUPABASE LISTENER ---
  const { data: session, status } = useSession();
  
  const [currentView, setCurrentView] = useState<ViewState>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);

  const handleLogout = async () => {
    // NextAuth signOut clears the session and cookie automatically
    await signOut({ redirect: false });
    setCurrentView("home");
  };

  // NextAuth gives us a built-in loading state
  if (status === "loading") {
    return (
      <div className="h-screen w-full bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  // If session exists, user is logged in
  if (session?.user) {
    const userRole = (session.user as any).role;
    
    return userRole === "faculty" ? (
      <FacultyDashboard user={session.user} onLogout={handleLogout} /> 
    ) : (
      <StudentDashboard user={session.user} onLogout={handleLogout} /> 
    );
  }

  // Unauthenticated Public View
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
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <HomeView onNavigate={setCurrentView} />
            </motion.div>
          )}
          {currentView === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Passed onClose to match our new AuthView design */}
              <AuthView onClose={() => setCurrentView("home")} />
            </motion.div>
          )}
          {currentView === "contact" && (
            <ContactView onNavigate={setCurrentView} />
          )}
          {currentView === "about" && <AboutPortal />}
        </AnimatePresence>
        <FAQSidebar isOpen={isFAQOpen} onClose={() => setIsFAQOpen(false)} />
      </div>

      {!isFAQOpen && (
        <button
          onClick={() => setIsFAQOpen(true)}
          className="fixed bottom-8 right-8 z-[100] w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center"
        >
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
}