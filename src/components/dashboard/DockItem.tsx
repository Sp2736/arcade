"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type DockItemProps = {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
};

export default function DockItem({ icon: Icon, label, active, onClick }: DockItemProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`relative p-3 rounded-xl transition-all duration-300 group flex items-center gap-3 w-full md:w-auto md:justify-center
        ${active ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" : "text-zinc-500 hover:text-white hover:bg-white/10"}
      `}
    >
      <Icon size={24} strokeWidth={2} />
      <span className="md:hidden text-lg font-bold">{label}</span>
      
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.8 }}
            animate={{ opacity: 1, x: 20, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.8 }}
            className="hidden md:block absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1 bg-zinc-800 text-white text-xs font-bold rounded-lg whitespace-nowrap border border-white/10 z-50 pointer-events-none"
          >
            {label}
            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-zinc-800 border-l border-b border-white/10 rotate-45 transform" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}