"use client";

import React, { useEffect, useRef, useState } from "react";

export default function InteractiveBackground({ isDarkMode }: { isDarkMode: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return (
    <div ref={containerRef} className={`fixed inset-0 z-0 transition-colors duration-500 overflow-hidden ${isDarkMode ? "bg-[#050505]" : "bg-zinc-50"}`}>
      
      {/* 1. Base Grid (Faint) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
            backgroundImage: `
              linear-gradient(to right, ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px),
              linear-gradient(to bottom, ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)" // Fade out at bottom edges
        }}
      />

      {/* 2. Spotlight Reveal Layer (The "Torch" Effect) */}
      {/* This layer has the same grid but BRIGHTER. It is masked by the cursor position. */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
            backgroundImage: `
              linear-gradient(to right, ${isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'} 1px, transparent 1px),
              linear-gradient(to bottom, ${isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'} 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            // The Mask is the "Flashlight"
            maskImage: `radial-gradient(350px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
            WebkitMaskImage: `radial-gradient(350px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
        }}
      />

      {/* 3. Ambient Glow (Soft color splash) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, ${isDarkMode ? 'rgba(29, 78, 216, 0.15)' : 'rgba(59, 130, 246, 0.1)'}, transparent 40%)`
        }}
      />
    </div>
  );
}