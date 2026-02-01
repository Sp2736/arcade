"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ConfettiProps {
  type?: "standard" | "fireworks";
  title?: string;
  message?: string;
}

export default function Confetti({ type = "standard", title, message }: ConfettiProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Capture full viewport size
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    
    // Prevent scrolling while celebration is active
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (windowSize.width === 0) return null; // Wait for mount

  return (
    // FIXED INSET-0 ensures it covers the whole screen, Z-[9999] puts it on top of everything
    <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center">
      
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" />

      {type === "fireworks" ? (
        <FireworksOverlay width={windowSize.width} height={windowSize.height} title={title} message={message} />
      ) : (
        <StandardConfetti width={windowSize.width} height={windowSize.height} />
      )}
    </div>
  );
}

// --- STANDARD MODE (Rain) ---
const StandardConfetti = ({ width, height }: { width: number; height: number }) => {
  const particles = Array.from({ length: 150 }).map((_, i) => ({
    id: i,
    x: Math.random() * width,
    y: -100,
    targetY: height + 200,
    rotate: Math.random() * 360,
    color: ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#ffffff"][Math.floor(Math.random() * 6)],
    delay: Math.random() * 2,
    scale: Math.random() * 0.8 + 0.5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="absolute inset-0 flex items-center justify-center z-50"
      >
        <h2 className="text-5xl md:text-7xl font-black text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] tracking-widest uppercase bg-black/20 p-6 rounded-3xl backdrop-blur-md border border-white/10">
          Skill Acquired!
        </h2>
      </motion.div>

      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: p.x, y: p.y, opacity: 1, rotate: 0 }}
          animate={{ y: p.targetY, opacity: 0, rotate: p.rotate + 720 }}
          transition={{ duration: 3.5, ease: "linear", delay: p.delay }}
          style={{ backgroundColor: p.color, scale: p.scale }}
          className="absolute w-3 h-6 rounded-sm"
        />
      ))}
    </div>
  );
};

// --- FIREWORKS MODE ---
const FireworksOverlay = ({ width, height, title, message }: { width: number; height: number; title?: string; message?: string }) => {
  const bursts = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: Math.random() * (width * 0.8) + (width * 0.1),
    y: Math.random() * (height * 0.8) + (height * 0.1),
    color: ["#ef4444", "#fbbf24", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899"][i % 6],
    delay: i * 0.2, 
  }));

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="absolute inset-0 flex flex-col items-center justify-center z-50 px-4 text-center"
      >
        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 drop-shadow-[0_0_30px_rgba(251,191,36,0.8)] mb-6">
          {title || "CONGRATULATIONS!"}
        </h1>
        <p className="text-white text-2xl md:text-3xl font-bold tracking-widest uppercase drop-shadow-md bg-black/30 px-6 py-2 rounded-full border border-white/10">
          {message || "Milestone Achieved"}
        </p>
      </motion.div>

      {bursts.map((burst) => (
        <FireworkBurst key={burst.id} x={burst.x} y={burst.y} color={burst.color} delay={burst.delay} />
      ))}
    </div>
  );
};

const FireworkBurst = ({ x, y, color, delay }: { x: number; y: number; color: string; delay: number }) => {
  const particles = Array.from({ length: 30 }).map((_, i) => {
    const angle = (i * 12) * (Math.PI / 180);
    return {
      id: i,
      x: 0, y: 0,
      targetX: Math.cos(angle) * (200 + Math.random() * 100), 
      targetY: Math.sin(angle) * (200 + Math.random() * 100),
    };
  });

  return (
    <div className="absolute" style={{ left: x, top: y }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{ x: p.targetX, y: p.targetY, scale: [2, 0], opacity: 0 }}
          transition={{ duration: 2, ease: "easeOut", delay: delay }}
          style={{ backgroundColor: color }}
          className="absolute w-2 h-2 rounded-full shadow-[0_0_20px_currentColor]"
        />
      ))}
    </div>
  );
};