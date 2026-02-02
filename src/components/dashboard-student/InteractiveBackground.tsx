"use client";

import React, { useEffect, useRef } from "react";

interface InteractiveBackgroundProps {
  isDarkMode: boolean;
}

export default function InteractiveBackground({ isDarkMode }: InteractiveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    // --- CONFIGURATION ---
    const gridSize = 40; 
    const connectionChance = 0.15; // Increased density (was 0.05)
    const speed = 2.5; // Slightly faster (was 2)
    const tailLength = 20; // Longer tails for better visibility

    // Colors
    const bgDark = "#050505";
    const bgLight = "#f8fafc";
    
    // Grid dots
    const gridColorDark = "rgba(255, 255, 255, 0.05)"; 
    const gridColorLight = "rgba(0, 0, 0, 0.05)";

    // Signal Colors (Core Line)
    const signalColorDark = "#22d3ee"; // Cyan-400 (Bright)
    const signalColorLight = "#4f46e5"; // Indigo-600 (Darker for contrast)

    // Glow Colors (The Halo)
    const glowColorDark = "rgba(6, 182, 212, 0.8)"; // Cyan Glow
    const glowColorLight = "rgba(99, 102, 241, 0.6)"; // Indigo Glow

    let signals: any[] = [];

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const drawGrid = () => {
      ctx.fillStyle = isDarkMode ? gridColorDark : gridColorLight;
      ctx.shadowBlur = 0; // No glow for grid dots
      for (let x = 0; x <= w; x += gridSize) {
        for (let y = 0; y <= h; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const spawnSignal = () => {
      if (Math.random() > connectionChance) return;

      const x = Math.floor((Math.random() * w) / gridSize) * gridSize;
      const y = Math.floor((Math.random() * h) / gridSize) * gridSize;

      // 0=right, 1=left, 2=down, 3=up
      const dir = Math.floor(Math.random() * 4);
      let dx = 0, dy = 0;
      let axis = true; 

      if (dir === 0) { dx = speed; axis = true; }
      else if (dir === 1) { dx = -speed; axis = true; }
      else if (dir === 2) { dy = speed; axis = false; }
      else { dy = -speed; axis = false; }

      signals.push({ x, y, dx, dy, life: 120, axis, trail: [] });
    };

    const updateSignals = () => {
      // Set styles for the electric signals
      ctx.strokeStyle = isDarkMode ? signalColorDark : signalColorLight;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      
      // ENABLE GLOW
      ctx.shadowBlur = isDarkMode ? 15 : 8; // Stronger glow in dark mode
      ctx.shadowColor = isDarkMode ? glowColorDark : glowColorLight;

      for (let i = signals.length - 1; i >= 0; i--) {
        const s = signals[i];
        
        s.x += s.dx;
        s.y += s.dy;
        s.life--;

        // Random turn logic
        if (s.x % gridSize === 0 && s.y % gridSize === 0 && Math.random() < 0.2) {
            if (s.axis) {
                s.dx = 0;
                s.dy = Math.random() > 0.5 ? speed : -speed;
                s.axis = false;
            } else {
                s.dy = 0;
                s.dx = Math.random() > 0.5 ? speed : -speed;
                s.axis = true;
            }
        }

        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > tailLength) s.trail.shift();

        if (s.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(s.trail[0].x, s.trail[0].y);
            for (let j = 1; j < s.trail.length; j++) {
                ctx.lineTo(s.trail[j].x, s.trail[j].y);
            }
            ctx.stroke();
            
            // Draw head "spark" (Extra bright tip)
            ctx.fillStyle = isDarkMode ? "#ffffff" : "#312e81";
            ctx.beginPath();
            ctx.arc(s.x, s.y, 2, 0, Math.PI*2);
            ctx.fill();
        }

        if (s.life <= 0 || s.x < 0 || s.x > w || s.y < 0 || s.y > h) {
          signals.splice(i, 1);
        }
      }
      
      // Reset shadow for next frame (important for performance)
      ctx.shadowBlur = 0;
    };

    const loop = () => {
      ctx.fillStyle = isDarkMode ? bgDark : bgLight;
      ctx.fillRect(0, 0, w, h);

      drawGrid();
      spawnSignal();
      updateSignals();

      animationFrameId = requestAnimationFrame(loop);
    };

    window.addEventListener("resize", resize);
    loop();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]);

  return (
    <canvas 
        ref={canvasRef} 
        className="fixed inset-0 z-[-1] pointer-events-none transition-colors duration-300"
    />
  );
}