"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { modules } from "./data"; 
import TimelineController from "./TimelineController";

export default function AboutPortal() {
  const [activeId, setActiveId] = useState<number>(1);
  const activeModule = modules.find((m) => m.id === activeId) || modules[0];

  const handleNext = () => { if (activeId < modules.length) setActiveId(activeId + 1); };
  const handlePrev = () => { if (activeId > 1) setActiveId(activeId - 1); };

  const numberVariants = {
    initial: { y: 100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -100, opacity: 0 },
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col md:flex-row h-full min-w-0 w-full relative"
    >
        {/* Left Column: Text Content */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 relative z-10">
            {/* Breadcrumb moved here inside the content area */}
            <div className="hidden md:flex absolute top-8 left-8 items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest">
                <span className="text-blue-500 font-bold">Dev_Phase</span>
                <span className="text-zinc-700">/</span>
                <span>Module_0{activeId}</span>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4, ease: "circOut" }}
                    className="mt-16 md:mt-0"
                >
                    <h1 className="text-5xl md:text-6xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-6 break-words">
                        {activeModule.title}
                        <span className="text-blue-600">.</span>
                    </h1>
                    <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-lg border-l-2 border-blue-500/50 pl-6">
                        {activeModule.description}
                    </p>
                    
                    <div className="mt-10 flex items-center gap-4">
                        <button onClick={handlePrev} disabled={activeId === 1} className="group flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all">
                            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="font-bold">Prev</span>
                        </button>
                        <button onClick={handleNext} disabled={activeId === modules.length} className="group flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-zinc-200 disabled:opacity-50 disabled:hover:bg-white transition-all">
                            <span>Next</span>
                            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>

        {/* Right Column: Card & Number */}
        <div className="flex-1 relative flex items-center justify-center p-8 md:p-0">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0 w-full flex justify-center items-center">
                <AnimatePresence mode="wait">
                    <motion.span 
                        key={activeId}
                        variants={numberVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="text-[200px] lg:text-[400px] font-black leading-none text-transparent drop-shadow-[0_0_100px_rgba(37,99,235,0.5)] blur-2xl md:blur-3xl filter max-w-full text-center"
                    >
                        {activeId}
                    </motion.span>
                </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                key={`card-${activeId}`}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="relative w-full max-w-sm bg-zinc-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl z-20 group"
                >
                    <div className="absolute -top-6 -right-6 h-20 w-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/50 rotate-3 group-hover:rotate-6 transition-transform duration-300">
                        <activeModule.icon size={36} className="text-white" />
                    </div>
                    <div className="mb-6">
                        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Objective</h3>
                        <h4 className="text-2xl font-bold text-white">Deliverables</h4>
                    </div>
                    <div className="space-y-4">
                        {activeModule.outputs.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                                <span className="text-sm font-medium text-zinc-200">{item}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>

        {/* Timeline Controller */}
        <TimelineController activeId={activeId} setActiveId={setActiveId} />
    </motion.div>
  );
}