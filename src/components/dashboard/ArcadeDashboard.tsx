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

// --- PLACEHOLDER VIEWS ---
const LoginView = () => (
  <div className="w-full min-h-full flex flex-col items-center justify-center text-zinc-500">
     <h1 className="text-4xl font-black text-white">LOGIN VIEW</h1>
  </div>
);

const ContactView = () => (
    <div className="w-full min-h-full flex flex-col items-center justify-center text-zinc-500">
       <h1 className="text-4xl font-black text-white">CONTACT VIEW</h1>
    </div>
);

export default function ArcadeDashboard() {
  const [currentView, setCurrentView] = useState<ViewState>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-[#050505] text-white font-sans overflow-hidden selection:bg-blue-500/30 relative">
      
      {/* --- SHARED BACKGROUND --- */}
      <BackgroundMeteors />
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[50%] h-full bg-blue-900/10 blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[30%] h-[50%] bg-indigo-900/10 blur-[100px]" />
      </div>

      <MeteorCursor />
      
      {/* --- NAVIGATION --- */}
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      
      <MobileMenu 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        mobileOpen={mobileMenuOpen} 
        onMobileClose={() => setMobileMenuOpen(false)} 
      />

      {/* --- MAIN CONTENT AREA (SCROLL CONTAINER) --- */}
      {/* FIX: 
          1. Removed 'overflow-hidden' and added 'overflow-y-auto'. 
          2. This div is now responsible for the scrollbar.
          3. 'h-full' ensures it takes up the full screen height minus no margins.
      */}
      <div className="flex-1 h-full overflow-y-auto overflow-x-hidden relative z-10 scroll-smooth custom-scrollbar">
        
        {/* Mobile Toggle */}
        <div className="absolute top-8 left-8 flex md:hidden items-center z-50">
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-white bg-zinc-900/50 rounded-lg border border-white/10">
                <Menu size={20} />
            </button>
        </div>

        {/* View Switcher */}
        {/* min-h-full ensures full height views (like AboutPortal) still look good */}
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
                    {/* Pass the setCurrentView function to HomeView */}
                    <HomeView onNavigate={setCurrentView} />
                </motion.div>
             )}
             
             {currentView === "about" && (
                 <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-[calc(100vh)]">
                    <AboutPortal />
                 </motion.div>
             )}
             
             {currentView === "login" && <LoginView key="login" />}
             {currentView === "contact" && <ContactView key="contact" />}
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