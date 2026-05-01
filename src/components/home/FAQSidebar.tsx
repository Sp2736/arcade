"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, X, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Message = { id: string; role: "user" | "assistant"; content: string };

export default function FAQSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [localInput, setLocalInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello, I am Arcade AI Assistant, ready to help you get answers pertaining to this portal. How may I assist you?",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleCustomSubmit = async (
    e?: React.FormEvent,
    textOverride?: string,
  ) => {
    if (e) e.preventDefault();

    const textToSend = textOverride || localInput;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
    };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setLocalInput("");
    setIsLoading(true);

    try {
      // This call automatically uses NextAuth cookies for authorization
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Chat failed");

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.text || "I encountered an error processing your request.",
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { 
          id: "error", 
          role: "assistant", 
          content: "I'm having trouble connecting to the system. Please ensure you are logged in." 
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sidebarVariants = {
    closed: {
      x: "100%",
      opacity: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    open: {
      x: "0%",
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] md:hidden"
          />

          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed inset-y-0 right-0 z-[100] flex flex-col bg-zinc-950 border-l border-white/10 shadow-2xl w-full md:w-[350px] lg:w-[400px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-zinc-900/50">
              <div className="flex items-center gap-2">
                <Sparkles
                  className="text-blue-500 fill-blue-500/20"
                  size={20}
                />
                <span className="font-bold text-white tracking-wide">
                  ARCADE AI
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-95"
              >
                <X size={24} className="text-zinc-400" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-zinc-950">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`
                    max-w-[85%] p-4 rounded-2xl text-sm shadow-sm
                    ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-sm"
                        : "bg-zinc-900 border border-white/10 text-zinc-300 rounded-tl-sm"
                    }
                  `}
                  >
                    <div className="space-y-3 prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          strong: ({ ...props }) => (
                            <strong className="text-white font-semibold" {...props} />
                          ),
                          ul: ({ ...props }) => (
                            <ul className="list-disc pl-5 space-y-1 marker:text-zinc-500" {...props} />
                          ),
                          ol: ({ ...props }) => (
                            <ol className="list-decimal pl-5 space-y-1 marker:text-zinc-500" {...props} />
                          ),
                          p: ({ ...props }) => (
                            <p className="leading-relaxed mb-0" {...props} />
                          ),
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-900 border border-white/10 text-zinc-400 p-4 rounded-2xl rounded-tl-sm flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-xs italic">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Footer / Input */}
            <div className="p-4 md:p-6 bg-zinc-900 border-t border-white/10">
              {messages.length <= 1 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    "What can Faculty do?",
                    "How do I verify notes?",
                    "Tell me about roles.",
                  ].map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleCustomSubmit(undefined, q)}
                      className="text-[10px] bg-zinc-800 hover:bg-blue-600/20 hover:text-blue-300 border border-white/10 rounded-full px-3 py-1.5 transition-all text-zinc-400"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <form
                onSubmit={handleCustomSubmit}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={localInput}
                  onChange={(e) => setLocalInput(e.target.value)}
                  placeholder="Ask about ARCADE..."
                  disabled={isLoading}
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-4 pr-12 py-4 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-zinc-600"
                />
                <button
                  type="submit"
                  disabled={isLoading || !localInput.trim()}
                  className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:bg-zinc-800"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}