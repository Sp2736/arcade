"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function InteractiveBackground({ isDarkMode }: { isDarkMode: boolean }) {
  // We use a fixed number of particles to keep it lightweight
  const particleCount = 25; 
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    // Generate static random values on mount to avoid hydration mismatch
    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // % position
      y: Math.random() * 100, // % position
      size: Math.random() * 4 + 1, // 1px to 5px
      duration: Math.random() * 20 + 10, // 10s to 30s float duration
      delay: Math.random() * 10,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className={`fixed inset-0 z-0 overflow-hidden transition-colors duration-[3000ms] ${isDarkMode ? "bg-[#050505]" : "bg-zinc-50"}`}>
      
      {/* 1. Subtle Gradient Mesh (Background ambiance) */}
      <div className={`absolute inset-0 opacity-40 transition-colors duration-[3000ms] ${
          isDarkMode 
            ? "bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1),rgba(5,5,5,1))]" 
            : "bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,1),rgba(244,244,245,1))]"
        }`} 
      />

      {/* 2. Floating Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute rounded-full ${isDarkMode ? "bg-blue-500" : "bg-zinc-400"}`}
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            opacity: isDarkMode ? 0.2 : 0.3, // Very subtle
          }}
          initial={{ y: `${p.y}%`, opacity: 0 }}
          animate={{
            y: [null, "-10%"], // Move upwards
            opacity: [0, 0.4, 0], // Fade in and out
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
            delay: p.delay,
          }}
        />
      ))}

      {/* 3. Slow Drifting Fog (Adds depth) */}
      <motion.div 
        animate={{ x: ["-10%", "10%"], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] mix-blend-screen pointer-events-none ${isDarkMode ? "bg-blue-900/20" : "bg-blue-200/40"}`}
      />
      <motion.div 
        animate={{ x: ["10%", "-10%"], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 25, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className={`absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full blur-[120px] mix-blend-screen pointer-events-none ${isDarkMode ? "bg-purple-900/10" : "bg-purple-200/30"}`}
      />

    </div>
  );
}