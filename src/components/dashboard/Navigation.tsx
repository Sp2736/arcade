"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Layers, Github, LogIn, Mail, X } from "lucide-react";
import DockItem from "./DockItem";
import Image from "next/image";

// 1. Define valid view IDs
export type ViewState = "home" | "about" | "login" | "contact";

interface NavProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

// 2. Sidebar Component
export const Sidebar = ({ currentView, onNavigate }: NavProps) => (
  <div className="hidden md:flex flex-none flex-col items-center w-20 py-8 h-full border-r border-white/5 bg-black/40 backdrop-blur-md z-50">
    <div className="mb-8">
      {/* Small Logo - Click to go Home */}
      <button onClick={() => onNavigate("home")} className="block relative h-12 w-12 hover:scale-105 transition-transform duration-300">
         <Image 
           src="/logo-small.png" 
           alt="A" 
           fill
           className="object-contain"
           priority
         />
      </button>
    </div>
    
    <div className="flex flex-col gap-4 w-full px-2">
      <DockItem 
        icon={Home} 
        label="Home" 
        active={currentView === "home"} 
        onClick={() => onNavigate("home")} 
      />
      <DockItem 
        icon={Layers} 
        label="About Portal" 
        active={currentView === "about"} 
        onClick={() => onNavigate("about")} 
      />
      <div className="h-px w-8 bg-white/10 mx-auto my-2" />
      <DockItem 
        icon={Github} 
        label="GitHub" 
        onClick={() => window.open("https://github.com/Sp2736/arcade", "_blank")} 
      />
      <DockItem 
        icon={Mail} 
        label="Contact Us" 
        active={currentView === "contact"} 
        onClick={() => onNavigate("contact")} 
      />
    </div>

    <div className="mt-auto w-full px-2">
       <DockItem 
         icon={LogIn} 
         label="Login" 
         active={currentView === "login"} 
         onClick={() => onNavigate("login")} 
       />
    </div>
  </div>
);

// 3. Mobile Menu Component
export const MobileMenu = ({ currentView, onNavigate, mobileOpen, onMobileClose }: NavProps) => (
  <AnimatePresence>
    {mobileOpen && (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col p-6 md:hidden"
      >
        <div className="flex justify-between items-center mb-8">
          {/* Big Logo */}
          <button onClick={() => { onNavigate("home"); onMobileClose?.(); }} className="relative h-20 w-64">
             <Image 
               src="/arcade-logo.png" 
               alt="ARCADE" 
               fill
               className="object-contain object-left" 
               priority 
             />
          </button>
          <button onClick={onMobileClose} className="p-2 bg-zinc-800 rounded-full text-white border border-white/10 shrink-0">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <DockItem icon={Home} label="Home" active={currentView === "home"} onClick={() => { onNavigate("home"); onMobileClose?.(); }} />
          <DockItem icon={Layers} label="About Portal" active={currentView === "about"} onClick={() => { onNavigate("about"); onMobileClose?.(); }} />
          <div className="h-px w-full bg-white/10 my-2" />
          <DockItem icon={Github} label="GitHub" onClick={() => window.open("https://github.com/Sp2736/arcade", "_blank")} />
          <DockItem icon={Mail} label="Contact Us" active={currentView === "contact"} onClick={() => { onNavigate("contact"); onMobileClose?.(); }} />
          <DockItem icon={LogIn} label="Login" active={currentView === "login"} onClick={() => { onNavigate("login"); onMobileClose?.(); }} />
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);