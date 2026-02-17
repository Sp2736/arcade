"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, MessageCircle, Loader2 } from "lucide-react";

import { Sidebar, MobileMenu, ViewState } from "./Navigation";
import AboutPortal from "./AboutPortal";
import HomeView from "./HomeView"; 
import MeteorCursor from "./MeteorCursor";
import FAQSidebar from "./FAQSidebar";
import BackgroundMeteors from "./BackgroundMeteors";
import AuthView from "./AuthView";
import ContactView from "./ContactView";
import StudentDashboard from "../dashboard-student/StudentDashboard";

export default function MainLayout() {
  const [currentView, setCurrentView] = useState<ViewState>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  
  // --- AUTH STATE ---
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollTarget, setScrollTarget] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem("arcade-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const handleNavigate = (view: ViewState, scrollId?: string) => {
    setCurrentView(view);
    setScrollTarget(scrollId || null);
  };

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    localStorage.setItem("arcade-user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem("arcade-user");
    setUser(null);
    setCurrentView("home");
  };

  // 1. Loading State (Prevents flicker)
  if (isLoading) {
    return (
      <div className="h-screen w-full bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  // 2. Logged In State (Redirects to Dashboards)
  if (user) {
    if (user.role === 'faculty') {
      // Temporary Faculty Placeholder until Dashboard is ready
      return (
        <div className="h-screen w-full bg-[#050505] flex flex-col items-center justify-center text-white space-y-4">
          <h1 className="text-2xl font-bold">Faculty Portal</h1>
          <p className="text-zinc-400">Welcome, {user.full_name}. The Faculty Dashboard is under construction.</p>
          <button 
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      );
    }

    return <StudentDashboard user={user} onLogout={handleLogout} />;
  }

  // 3. Logged Out State (Landing Page / Auth)
  return (
    <div className="flex h-screen w-full bg-[#050505] text-white font-sans overflow-hidden selection:bg-blue-500/30 relative">
      
      {/* --- BACKGROUNDS --- */}
      <BackgroundMeteors />
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[50%] h-full bg-blue-900/10 blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[30%] h-[50%] bg-indigo-900/10 blur-[100px]" />
      </div>

      <MeteorCursor />
      
      {/* --- NAVIGATION --- */}
      <Sidebar currentView={currentView} onNavigate={handleNavigate} />
      
      <MobileMenu 
        currentView={currentView} 
        onNavigate={handleNavigate} 
        mobileOpen={mobileMenuOpen} 
        onMobileClose={() => setMobileMenuOpen(false)} 
      />

      <div className="fixed top-6 left-6 z-[100] md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(true)} 
            className="p-3 text-white bg-zinc-900/50 backdrop-blur-md rounded-xl border border-white/10 shadow-lg active:scale-95 transition-all"
          >
              <Menu size={20} />
          </button>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 h-full overflow-y-auto overflow-x-hidden relative z-10 scroll-smooth custom-scrollbar">
        
        <div className="min-h-full w-full flex flex-col">
          <AnimatePresence mode="wait">
             {currentView === "home" && (
                <motion.div 
                    key="home" 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="w-full"
                >
                    <HomeView onNavigate={handleNavigate} scrollToId={scrollTarget} />
                </motion.div>
             )}
             
             {currentView === "about" && (
                 <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-[calc(100vh)]">
                    <AboutPortal />
                 </motion.div>
             )}
             
             {currentView === "login" && (
                 <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
                    <AuthView onAuthSuccess={handleAuthSuccess} /> 
                 </motion.div>
             )}
             
             {currentView === "contact" && (
                <motion.div key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
                    <ContactView onNavigate={handleNavigate} />
                </motion.div>
             )}
          </AnimatePresence>
        </div>

        <FAQSidebar isOpen={isFAQOpen} onClose={() => setIsFAQOpen(false)} />
      </div>
      
      {/* FAQ TRIGGER */}
      <AnimatePresence>
        {!isFAQOpen && (
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={() => setIsFAQOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-8 right-8 z-[100] w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-600/50 hover:bg-blue-500 transition-colors"
            >
                <MessageCircle size={24} />
            </motion.button>
        )}
      </AnimatePresence>
      
    </div>
  );
}