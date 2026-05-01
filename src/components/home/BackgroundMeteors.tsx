"use client";

import React, { useEffect, useRef } from "react";

export default function BackgroundMeteors() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let meteors: Meteor[] = [];
    let stars: Star[] = [];

    // --- Configuration ---
    const STAR_COUNT = 300; // Increased for density
    const METEOR_FREQUENCY = 0.03; 
    const COLORS = {
      star: "rgba(255, 255, 255, 0.8)",
      meteorHead: "#ffffff",
      meteorTail: "rgba(59, 130, 246, 1)", // Blue-500
    };

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener("resize", setSize);

    // --- Star Class ---
    class Star {
      x: number; y: number; size: number; opacity: number; blinkSpeed: number;
      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 1.2;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.blinkSpeed = Math.random() * 0.005 + 0.002;
      }
      update() {
        this.opacity += this.blinkSpeed;
        if (this.opacity > 0.8 || this.opacity < 0.1) this.blinkSpeed = -this.blinkSpeed;
      }
      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // --- Meteor Class ---
    class Meteor {
      x: number; y: number; length: number; speed: number; angle: number;
      constructor() {
        this.x = Math.random() * (canvas!.width + 200) - 100;
        this.y = -100;
        this.length = Math.random() * 150 + 50; // Longer, clearer trails
        this.speed = Math.random() * 15 + 10; // Faster
        this.angle = Math.PI / 4; 
      }
      update() {
        this.x -= this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);
      }
      draw() {
        if (!ctx) return;
        const endX = this.x + this.length * Math.cos(this.angle);
        const endY = this.y - this.length * Math.sin(this.angle);
        
        const gradient = ctx.createLinearGradient(this.x, this.y, endX, endY);
        gradient.addColorStop(0, COLORS.meteorHead);
        gradient.addColorStop(0.2, COLORS.meteorTail);
        gradient.addColorStop(1, "transparent");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.shadowBlur = 15;
        ctx.shadowColor = COLORS.meteorTail;

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      isOutOfBounds() { return this.x < -200 || this.y > canvas!.height + 200; }
    }

    // Init Stars
    for (let i = 0; i < STAR_COUNT; i++) stars.push(new Star());

    // Loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => { s.update(); s.draw(); });
      
      if (Math.random() < METEOR_FREQUENCY) meteors.push(new Meteor());
      
      meteors.forEach((m, i) => {
        m.update(); m.draw();
        if (m.isOutOfBounds()) meteors.splice(i, 1);
      });

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", setSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-100" />;
}