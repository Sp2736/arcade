"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Layers, Users, LogIn, Github, Box, X } from "lucide-react";
import DockItem from "./DockItem";
import Image from "next/image";
import Link from "next/link";

export const Sidebar = () => (
  <div className="hidden md:flex flex-none flex-col items-center w-20 py-8 h-full border-r border-white/5 bg-black/40 backdrop-blur-md z-50">
    {/* 1. BIG SCREEN LOGO (Square 'A') */}
    <div className="mb-8">
      <Link href="/" className="block relative h-12 w-12 hover:scale-105 transition-transform duration-300">
         {/* Ensure you have cropped the 'A' and saved it as logo-small.png */}
         <Image 
           src="/logo-small.png" 
           alt="A" 
           fill
           className="object-contain"
           priority
         />
      </Link>
    </div>
    
    {/* Main Navigation */}
    <div className="flex flex-col gap-4 w-full px-2">
      <DockItem icon={Home} label="Home" />
      <DockItem icon={Layers} label="Modules" active />
      <DockItem icon={Box} label="Components" />
      <div className="h-px w-8 bg-white/10 mx-auto my-2" />
      <DockItem icon={Users} label="Team" />
      <DockItem icon={Github} label="GitHub" onClick={() => window.open("https://github.com/Sp2736/arcade", "_blank")} />
    </div>

    {/* Login Button */}
    <div className="mt-auto w-full px-2">
       <DockItem icon={LogIn} label="Login" />
    </div>
  </div>
);

export const MobileMenu = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col p-6 md:hidden"
      >
        <div className="flex justify-between items-center mb-8">
          
          {/* UPDATED: Increased dimensions to h-20 (80px) and w-64 (256px) */}
          <Link href="/" onClick={onClose} className="relative h-20 w-64">
             <Image 
               src="/arcade-logo.png" 
               alt="ARCADE" 
               fill
               className="object-contain object-left" 
               priority 
             />
          </Link>

          <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full text-white border border-white/10 shrink-0">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <DockItem icon={Home} label="Home" onClick={onClose} />
          <DockItem icon={Layers} label="Modules" active onClick={onClose} />
          <DockItem icon={Box} label="Components" onClick={onClose} />
          <div className="h-px w-full bg-white/10 my-2" />
          <DockItem icon={Users} label="Our Team" onClick={onClose} />
          <DockItem icon={Github} label="GitHub" onClick={() => window.open("https://github.com/Sp2736/arcade", "_blank")} />
          <DockItem icon={LogIn} label="Login" onClick={onClose} />
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);