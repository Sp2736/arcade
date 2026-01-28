"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Send, User, MessageSquare, Phone, Github, Linkedin, Instagram, ArrowRight, Loader2, Users } from "lucide-react";

interface ContactViewProps {
  onNavigate: (view: "home" | "about" | "login" | "contact", scrollId?: string) => void;
}

export default function ContactView({ onNavigate }: ContactViewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
        setIsSubmitting(false);
        setIsSent(true);
    }, 2000);
  };

  return (
    // RESTORED: Standard padding and overflow handling.
    // 'overflow-hidden' on the container prevents the background blob from creating scrollbars.
    // 'overflow-y-auto' allows the FORM to scroll if the screen is too short.
    <div className="w-full h-full flex flex-col items-center justify-center relative z-20 overflow-hidden p-6 md:p-12">
      
      {/* Background Ambience (Constrained) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        // RESTORED: max-w-5xl (Large Width)
        className="w-full max-w-5xl bg-zinc-900/80 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row backdrop-blur-xl relative z-10 max-h-full overflow-y-auto custom-scrollbar md:overflow-visible"
      >
        
        {/* ================= LEFT PANEL ================= */}
        {/* RESTORED: p-10 (Large Padding) */}
        <div className="w-full md:w-2/5 bg-zinc-900/40 backdrop-blur-md border-r border-white/5 relative p-10 flex flex-col justify-between overflow-hidden">
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative z-10">
                <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Get in Touch</h2>
                <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                    Have questions about the ARCADE ecosystem? Our team of architects is ready to assist.
                </p>

                {/* RESTORED: Spacing y-6 */}
                <div className="space-y-6">
                    <InfoRow icon={Mail} text="support@arcade.charusat.edu" label="Electronic Mail" />
                    <InfoRow icon={Phone} text="+91 98765 43210" label="Helpline" />
                    <InfoRow icon={MapPin} text="CMPICA, CHARUSAT Campus, Changa" label="Base of Operations" />
                </div>
            </div>

            <div className="relative z-10 mt-12">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">Connect with us</p>
                
                <div className="flex flex-col gap-6">
                    <div className="flex gap-4">
                        <SocialButton icon={Github} />
                        <SocialButton icon={Linkedin} />
                        <SocialButton icon={Instagram} />
                    </div>

                    <button 
                        onClick={() => onNavigate('home', 'core-team')}
                        className="flex items-center gap-2 text-sm font-medium text-white hover:text-blue-400 transition-colors group w-fit"
                    >
                        <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-blue-500/50 transition-colors">
                            <Users size={16} />
                        </div>
                        <span>See The Team</span>
                        <ArrowRight size={14} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    </button>
                </div>
            </div>
        </div>

        {/* ================= RIGHT PANEL ================= */}
        {/* RESTORED: p-10 (Large Padding) */}
        <div className="w-full md:w-3/5 bg-[#0a0a0a]/90 p-10 relative">
            
            {isSent ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-10">
                    <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-6"
                    >
                        <Send size={32} />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-2">Transmission Received</h3>
                    <p className="text-zinc-400 max-w-xs mx-auto mb-8">
                        Your message has been logged in our system. A representative will contact you shortly.
                    </p>
                    <button 
                        onClick={() => setIsSent(false)}
                        className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        Send Another Message
                    </button>
                </div>
            ) : (
                // RESTORED: space-y-6
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-1">Send a Message</h3>
                        <p className="text-zinc-500 text-sm">We typically respond within 24 hours.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="First Name" icon={User} placeholder="Swayam" />
                        <InputGroup label="Last Name" icon={User} placeholder="Patel" />
                    </div>

                    <InputGroup label="Email Address" icon={Mail} type="email" placeholder="official@charusat.edu.in" />
                    
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400 ml-1">Message</label>
                        <div className="relative group">
                            <div className="absolute left-3 top-4 text-zinc-500 group-focus-within:text-white transition-colors pointer-events-none">
                                <MessageSquare size={16} />
                            </div>
                            {/* RESTORED: rows={4} */}
                            <textarea 
                                rows={4}
                                placeholder="Describe your query..."
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all resize-none custom-scrollbar"
                            />
                        </div>
                    </div>

                    <button 
                        disabled={isSubmitting}
                        className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Transmitting...</span>
                            </>
                        ) : (
                            <>
                                <span>Send Message</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            )}
        </div>

      </motion.div>
    </div>
  );
}

// --- RESTORED SUB COMPONENTS (Large Sizes) ---

const InfoRow = ({ icon: Icon, text, label }: any) => (
    <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-1">
            <Icon size={20} />
        </div>
        <div>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-0.5">{label}</p>
            <p className="text-zinc-200 font-medium text-sm md:text-base">{text}</p>
        </div>
    </div>
);

const SocialButton = ({ icon: Icon }: any) => (
    <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white hover:text-black text-zinc-400 flex items-center justify-center transition-all duration-300">
        <Icon size={18} />
    </button>
);

const InputGroup = ({ label, icon: Icon, type = "text", placeholder }: any) => (
    <div className="space-y-1.5">
        <label className="text-xs font-medium text-zinc-400 ml-1">{label}</label>
        <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors pointer-events-none">
                <Icon size={16} />
            </div>
            {/* RESTORED: py-2.5 */}
            <input 
                type={type}
                placeholder={placeholder}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
            />
        </div>
    </div>
);  