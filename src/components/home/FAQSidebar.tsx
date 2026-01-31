"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, X, Loader2 } from "lucide-react";

export default function FAQSidebar({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- MOCK CHAT STATE ---
  type Message = { id: number; role: "user" | "ai"; text: string };
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "ai", text: "Hello! I am the Arcade AI. Ask me anything about the roadmap or tech stack." }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setQuery("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await response.json();
      
      const aiMsg: Message = { 
        id: Date.now() + 1, 
        role: "ai", 
        text: data.text || "I encountered an error." 
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- ANIMATION VARIANTS ---
  // Using x: "100%" is much smoother than animating width
  const sidebarVariants = {
    closed: { 
      x: "100%", 
      opacity: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    open: { 
      x: "0%", 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 1. Backdrop (Mobile Only) - Dims the background content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] md:hidden"
          />

          {/* 2. The Sidebar Panel */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            /* CRITICAL RESPONSIVE CLASSES:
               - w-full: Occupies 100% width by default (Mobile/Tablet)
               - md:w-[30vw]: Occupies 30% width only on Desktop
               - max-w-none: Removes constraints
            */
            className="fixed inset-y-0 right-0 z-[100] flex flex-col bg-zinc-950 border-l border-white/10 shadow-2xl w-full md:w-[30vw]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-zinc-900/50">
              <div className="flex items-center gap-2">
                <Sparkles className="text-blue-500 fill-blue-500/20" size={20} />
                <span className="font-bold text-white tracking-wide">ARCADE AI</span>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-95"
              >
                <X size={24} className="text-zinc-400" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-zinc-950">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`
                    max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm
                    ${msg.role === "user" 
                      ? "bg-blue-600 text-white rounded-tr-sm" 
                      : "bg-zinc-900 border border-white/10 text-zinc-300 rounded-tl-sm"}
                  `}>
                    {/* Render Markdown-like bold text */}
                    {msg.text.split("**").map((part, i) => 
                        i % 2 === 1 ? <strong key={i} className="text-white">{part}</strong> : part
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                    <div className="bg-zinc-900 border border-white/10 text-zinc-400 p-4 rounded-2xl rounded-tl-sm flex items-center gap-2">
                        <Loader2 size={16} className="animate-spin" />
                        <span className="text-xs">Thinking...</span>
                    </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-6 bg-zinc-900 border-t border-white/10">
              
              {/* Sample Questions (Only show at start) */}
              {messages.length < 3 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                  {["Tech Stack?", "How to contribute?", "Database?"].map((q, i) => (
                      <button
                      key={i}
                      onClick={() => handleSend(q)}
                      className="text-xs bg-zinc-800 hover:bg-blue-600/20 hover:text-blue-300 border border-white/10 rounded-full px-3 py-2 transition-all text-zinc-400 flex items-center gap-2"
                      >
                      {q}
                      </button>
                  ))}
                  </div>
              )}

              <div className="relative flex items-center">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend(query)}
                  placeholder="Ask about ARCADE..."
                  disabled={isLoading}
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-4 pr-12 py-4 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-zinc-600"
                />
                <button 
                  onClick={() => handleSend(query)}
                  disabled={isLoading}
                  className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:bg-zinc-800"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}