"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, MessageCircle } from "lucide-react";

import { Sidebar, MobileMenu, ViewState } from "./Navigation";
import AboutPortal from "./AboutPortal";
import HomeView from "./HomeView"; 
import MeteorCursor from "./MeteorCursor";
import FAQSidebar from "./FAQSidebar";
import BackgroundMeteors from "./BackgroundMeteors";
import AuthView from "./AuthView";
import ContactView from "./ContactView";

// ... (keep Placeholder Views if any) ...

export default function ArcadeDashboard() {
  const [currentView, setCurrentView] = useState<ViewState>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  
  // --- NEW STATE FOR SCROLLING ---
  const [scrollTarget, setScrollTarget] = useState<string | null>(null);

  // --- NEW NAVIGATION HANDLER ---
  const handleNavigate = (view: ViewState, scrollId?: string) => {
    setCurrentView(view);
    // If a scroll ID is provided, set it. Otherwise, clear it so it doesn't auto-scroll next time.
    setScrollTarget(scrollId || null);
  };

  return (
    <div className="flex h-screen w-full bg-[#050505] text-white font-sans overflow-hidden selection:bg-blue-500/30 relative">
      
      {/* ... (Keep Backgrounds & Cursor) ... */}
      <BackgroundMeteors />
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[50%] h-full bg-blue-900/10 blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[30%] h-[50%] bg-indigo-900/10 blur-[100px]" />
      </div>

      <MeteorCursor />
      
      {/* Pass handleNavigate to Sidebar if you want sidebar to support scroll (optional)
          Currently Sidebar expects strictly (view: ViewState) => void.
          Typescript allows passing (view, scrollId) where scrollId is optional, 
          so handleNavigate works for Sidebar too! 
      */}
      <Sidebar currentView={currentView} onNavigate={handleNavigate} />
      
      <MobileMenu 
        currentView={currentView} 
        onNavigate={handleNavigate} 
        mobileOpen={mobileMenuOpen} 
        onMobileClose={() => setMobileMenuOpen(false)} 
      />

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 h-full overflow-y-auto overflow-x-hidden relative z-10 scroll-smooth custom-scrollbar">
        
        {/* Mobile Toggle */}
        <div className="absolute top-8 left-8 flex md:hidden items-center z-50">
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-white bg-zinc-900/50 rounded-lg border border-white/10">
                <Menu size={20} />
            </button>
        </div>

        {/* View Switcher */}
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
                    {/* PASS THE SCROLL TARGET AND HANDLER HERE */}
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
                    <AuthView />
                 </motion.div>
             )}
             
             {currentView === "contact" && (
                <motion.div key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
                    {/* PASS HANDLER HERE */}
                    <ContactView onNavigate={handleNavigate} />
                </motion.div>
             )}
          </AnimatePresence>
        </div>

        {/* --- FAQ SIDEBAR --- */}
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
                <span className="absolute inset-0 rounded-full border border-blue-400 opacity-0 animate-ping" />
            </motion.button>
        )}
      </AnimatePresence>
      
    </div>
  );
}