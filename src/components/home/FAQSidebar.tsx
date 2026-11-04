"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
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
        text: data.reply || data.text || "I encountered an error." 
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- ANIMATION VARIANTS ---
  const sidebarVariants: Variants = {
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
            className="fixed inset-y-0 right-0 z-[100] flex flex-col bg-zinc-950 border-l border-white/10 shadow-2xl w-full md:w-[30vw]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-zinc-900/50">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-blue-500" />
                <h2 className="font-bold text-white text-base">Arcade Assistant</h2>
              </div>
              <button onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-blue-600 text-white font-medium"
                        : "bg-zinc-900 border border-white/10 text-zinc-200"
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1 uppercase font-mono tracking-wider">
                    {m.role === "user" ? "You" : "AI"}
                  </span>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-zinc-500 text-xs py-2">
                  <Loader2 size={14} className="animate-spin text-blue-500" />
                  <span>Generating response...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-6 py-2 flex gap-2 overflow-x-auto no-scrollbar border-t border-white/5 bg-zinc-950">
              {["What is ARCADE?", "Current Phase?", "Tech Stack"].map((p) => (
                <button
                  key={p}
                  onClick={() => handleSend(p)}
                  className="whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:border-blue-500 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(query);
              }}
              className="p-4 border-t border-white/10 bg-zinc-900/50"
            >
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Ask a question..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <button
                  type="submit"
                  disabled={!query.trim() || isLoading}
                  className="absolute right-2 p-2 text-blue-500 hover:text-blue-400 disabled:opacity-40 transition-opacity"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
