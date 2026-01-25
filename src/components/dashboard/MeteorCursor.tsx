"use client";

import React, { useEffect, useRef } from "react";

export default function MeteorCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    
    // Arrays to hold our active elements
    const sparkles: Sparkle[] = [];
    const trail: TrailPoint[] = [];

    // --- Configuration ---
    // 1.0 life / 60 frames (1 sec) ≈ 0.016
    const TRAIL_DECAY = 0.016; 
    const TRAIL_WIDTH = 3;
    
    // Sparkle Settings
    const SPARKLE_COUNT = 12; 
    const SPARKLE_SPEED_MIN = 2;
    const SPARKLE_SPEED_MAX = 6; 
    const COLORS = ["#3b82f6", "#60a5fa", "#93c5fd", "#ffffff"]; 

    // Resize logic
    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener("resize", setSize);

    // Mouse Tracking
    const handleMouseMove = (e: MouseEvent) => {
      trail.push(new TrailPoint(e.clientX, e.clientY));
    };

    // Click Explosion
    const handleClick = (e: MouseEvent) => {
      for (let i = 0; i < SPARKLE_COUNT; i++) {
        sparkles.push(new Sparkle(e.clientX, e.clientY));
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    // --- Classes ---

    class TrailPoint {
      x: number;
      y: number;
      life: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.life = 1.0; // Starts fully opaque
      }

      update() {
        this.life -= TRAIL_DECAY; // Decays slowly over 1 second
      }
    }

    class Sparkle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      life: number;
      maxLife: number;
      color: string;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * (SPARKLE_SPEED_MAX - SPARKLE_SPEED_MIN) + SPARKLE_SPEED_MIN;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.size = Math.random() * 4 + 2; 
        this.life = 0;
        this.maxLife = Math.random() * 20 + 30;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;
        this.size *= 0.95; 
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.globalAlpha = 1 - this.life / this.maxLife;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    // --- Animation Loop ---

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. UPDATE TRAIL POINTS
      // Iterate backwards to remove dead points safely
      for (let i = trail.length - 1; i >= 0; i--) {
        const point = trail[i];
        point.update();

        // If point is dead, remove it
        if (point.life <= 0) {
          trail.splice(i, 1);
        }
      }

      // 2. DRAW TRAIL
      if (trail.length > 1) {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        
        for (let i = 0; i < trail.length - 1; i++) {
            const point = trail[i];
            const nextPoint = trail[i+1];
            
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(nextPoint.x, nextPoint.y);
            
            // Outer Glow
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#3b82f6";
            ctx.lineWidth = TRAIL_WIDTH * point.life; 
            ctx.strokeStyle = `rgba(59, 130, 246, ${point.life})`;
            ctx.stroke();
            
            // Inner Core
            ctx.shadowBlur = 0;
            ctx.lineWidth = (TRAIL_WIDTH * 0.5) * point.life;
            ctx.strokeStyle = `rgba(255, 255, 255, ${point.life})`;
            ctx.stroke();
        }
      }

      // 3. UPDATE & DRAW SPARKLES
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const p = sparkles[i];
        p.update();
        p.draw(ctx);
        if (p.life >= p.maxLife) {
          sparkles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Cleanup
    return () => {
      window.removeEventListener("resize", setSize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}