"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Confetti() {
  // Generate 40 random confetti pieces
  const particles = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    x: Math.random() * 600 - 300, // Wide horizontal spread
    y: Math.random() * -400 - 100, // High vertical throw
    rotation: Math.random() * 360,
    color: ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"][Math.floor(Math.random() * 5)],
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] flex items-center justify-center">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: 0,
            scale: 1,
            rotate: p.rotation + 720, // Spin while flying
          }}
          transition={{ duration: 2, ease: "easeOut" }}
          style={{ backgroundColor: p.color }}
          className="absolute w-2 h-4 rounded-sm"
        />
      ))}
    </div>
  );
}