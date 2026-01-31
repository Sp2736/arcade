"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardCursor() {
  const [clickSparks, setClickSparks] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // 1. Create a unique ID for this click event
      const newSpark = { id: Date.now(), x: e.clientX, y: e.clientY };
      
      // 2. Add it to state to trigger render
      setClickSparks((prev) => [...prev, newSpark]);

      // 3. Remove it after animation completes (600ms)
      setTimeout(() => {
        setClickSparks((prev) => prev.filter((s) => s.id !== newSpark.id));
      }, 600);
    };

    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {clickSparks.map((spark) => (
          <ClickExplosion key={spark.id} x={spark.x} y={spark.y} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// --- SUB COMPONENT: THE EXPLOSION ---
const ClickExplosion = ({ x, y }: { x: number; y: number }) => {
  return (
    <>
      {/* 1. The Ring Shockwave */}
      <motion.div
        initial={{ opacity: 0.8, scale: 0, x: x - 20, y: y - 20 }}
        animate={{ opacity: 0, scale: 2 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="absolute w-10 h-10 rounded-full border-2 border-blue-500"
      />
      
      {/* 2. The Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ x, y, scale: 1, opacity: 1 }}
          animate={{
            x: x + (Math.random() - 0.5) * 80, // Scatter X
            y: y + (Math.random() - 0.5) * 80, // Scatter Y
            opacity: 0,
            scale: 0
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute w-1 h-1 bg-blue-400 rounded-full"
        />
      ))}
    </>
  );
};