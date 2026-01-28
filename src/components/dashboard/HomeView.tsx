"use client";

import React, { useState, memo } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, ArrowRight, Database, Map, ShieldCheck, Cpu, Instagram, Mail } from "lucide-react";
import Image from "next/image";

// --- DATA ---
const TEAM = [
  {
    id: 1,
    name: "Swayam Patel",
    studentId: "24DCS088",
    image: "/swayam.jpg",
    role: "Lead Architect",
    desc: "Orchestrating the ecosystem. Bridging the gap between conceptual depth and production reality through scalable system design.",
    color: "from-blue-500 to-indigo-600",
    borderColor: "group-hover:border-blue-500/50",
    socials: {
      github: "https://github.com/Sp2736",
      linkedin: "https://www.linkedin.com/in/swayam-patel-316ba5317?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      instagram: "https://instagram.com/sp_27.03",
      mail: "mailto:swayampatel2736@gmail.com"
    }
  },
  {
    id: 2,
    name: "Jalisa Malik",
    studentId: "24DCS049",
    image: "/jalisa.jpeg",
    role: "UI/UX Specialist",
    desc: "Crafting the glass-morphic interfaces and ensuring seamless fluid interactions that define the ARCADE user experience.",
    color: "from-purple-500 to-pink-600",
    borderColor: "group-hover:border-purple-500/50",
    socials: {
      github: "https://github.com/jalisa2106",
      linkedin: "https://www.linkedin.com/in/jalisa-malik-8b0308333?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      instagram: "https://www.instagram.com/jalisamalik_0612?igsh=aXZ3N2o4MGt2MDRy",
      mail: "mailto:jalisamalik21@gmail.com"
    }
  },
  {
    id: 3,
    name: "Rutansh Govardhan",
    studentId: "24DCE045",
    image: "/rutansh.jpeg",
    role: "System Engineer",
    desc: "Designing the scalable schemas and secure approval pipelines that power the core data infrastructure.",
    color: "from-orange-500 to-red-600",
    borderColor: "group-hover:border-orange-500/50",
    socials: {
      github: "https://github.com/rutansh-07",
      linkedin: "https://www.linkedin.com/in/rutansh-govardhan-9592b932a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      instagram: "https://www.instagram.com/irutansh07?igsh=MWYxNXE3YTlqN2VidQ==",
      mail: "mailto:rutanshgovardhan07@gmail.com"
    }
  },
];

const FEATURES = [
  { 
    title: "Verified Intelligence", 
    desc: "In an era of information overload, accuracy is paramount. ARCADE introduces a Faculty-Verified Layer where every resource is rigorously vetted.", 
    icon: ShieldCheck 
  },
  { 
    title: "Visual Trajectories", 
    desc: "We replace static, linear PDF syllabi with dynamic, node-based visualization graphs to navigate dependency trees.", 
    icon: Map 
  },
  { 
    title: "Diagnostic Gap Analysis", 
    desc: "Our rule-based logic engine continuously compares a student's acquired skill matrix against industry-standard role requirements.", 
    icon: Cpu 
  },
  { 
    title: "Secure Repository", 
    desc: "A centralized, role-gated asset vault. From handwritten notes to capstone project binaries, all intellectual property is indexed.", 
    icon: Database 
  },
];

// --- PROPS INTERFACE ---
interface HomeViewProps {
  onNavigate?: (view: "home" | "about" | "login" | "contact") => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Fallback function if onNavigate is not provided
  const handleNavigate = (view: "home" | "about" | "login" | "contact") => {
    if (onNavigate) onNavigate(view);
  };

  return (
    <div className="w-full flex flex-col items-center justify-start relative z-20">
      
      {/* ================= HERO SECTION ================= */}
      <section className="w-full min-h-[90vh] flex flex-col items-center justify-center text-center px-4 md:px-24 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-6xl relative z-10"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-12 bg-blue-500/50" />
            <span className="text-blue-400 font-mono text-xs md:text-sm tracking-[0.4em] uppercase">Welcome To The Portal</span>
            <div className="h-px w-12 bg-blue-500/50" />
          </div>

          <div className="mb-10">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-widest mb-4 leading-none select-none drop-shadow-2xl">
              A.R.C.A.D.E.
            </h1>
            <h2 className="text-lg md:text-2xl lg:text-3xl font-bold tracking-widest uppercase">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-blue-500 filter drop-shadow-[0_0_20px_rgba(37,99,235,0.5)]">
                Academic Resource & Career Assist Digital Environment
              </span>
            </h2>
          </div>

          <p className="text-zinc-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light mb-10">
            A <span className="text-white font-semibold">guided academic ecosystem</span> designed to dismantle the ambiguity of university education and replace it with precision, verification, and strategic direction.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => handleNavigate('login')}
              className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full transition-all hover:scale-105 flex items-center gap-2 shadow-[0_0_40px_rgba(37,99,235,0.4)]"
            >
              <span>Initialize Portal</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => handleNavigate('about')}
              className="px-8 py-4 border border-white/20 hover:bg-white/5 text-zinc-300 font-medium rounded-full transition-all"
            >
              Learn More
            </button>
          </div>
        </motion.div>
      </section>

      {/* ================= MISSION BRIEF ================= */}
      <section className="w-full px-6 md:px-24 py-16 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 text-center md:text-left">
             <h2 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
              THE ACADEMIC <br/><span className="text-zinc-600">DISCONNECT.</span>
            </h2>
            <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-3xl">
              Students today face a paradox: <strong className="text-white">information overload, yet a lack of direction.</strong> Random PDFs and outdated syllabi create noise. We engineered a solution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {FEATURES.map((feat, i) => (
               <div key={i} className="group p-8 md:p-10 rounded-[2rem] border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all hover:border-blue-500/30 relative overflow-hidden backdrop-blur-sm">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] group-hover:bg-blue-500/10 transition-colors" />
                 <div className="relative z-10">
                    <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.1)]">
                      <feat.icon size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{feat.title}</h3>
                    <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                      {feat.desc}
                    </p>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* ================= CORE TEAM ================= */}
      <section className="w-full px-4 py-16 flex flex-col items-center relative z-10">
        <div className="text-center mb-12 relative z-10">
          <h2 className="text-blue-500 font-mono text-sm tracking-[0.3em] uppercase mb-2">The Architects</h2>
          <h3 className="text-4xl md:text-6xl font-black text-white">CORE TEAM</h3>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start justify-center w-full max-w-6xl px-2">
          {TEAM.map((member) => (
            <MemberCard 
              key={member.id}
              member={member}
              isHovered={hoveredCard === member.id}
              isDimmed={hoveredCard !== null && hoveredCard !== member.id}
              onHover={() => setHoveredCard(member.id)}
              onLeave={() => setHoveredCard(null)}
            />
          ))}
        </div>
      </section>

      <footer className="w-full py-8 text-center border-t border-white/5 text-zinc-600 text-xs uppercase tracking-widest bg-transparent relative z-20">
        ARCADE System // Developed for University Ecosystem
      </footer>
    </div>
  );
}

// --- TYPES ---
interface Member {
  id: number;
  name: string;
  studentId: string;
  image: string; // Changed to string
  role: string;
  desc: string;
  color: string;
  borderColor: string;
  socials: {
    github: string;
    linkedin: string;
    instagram: string;
    mail: string;
  };
}

interface MemberCardProps {
  member: Member;
  isHovered: boolean;
  isDimmed: boolean;
  onHover: () => void;
  onLeave: () => void;
}

// --- MEMBER CARD ---
const MemberCard = memo(({ member, isHovered, isDimmed, onHover, onLeave }: MemberCardProps) => {
  return (
    <motion.div 
      className={`relative w-full max-w-sm rounded-[2rem] border border-white/10 bg-[#0a0a0a] overflow-hidden flex flex-col transition-all duration-500 ${isDimmed ? 'opacity-50 scale-95 grayscale' : 'opacity-100 grayscale-0'} ${isHovered ? 'shadow-2xl shadow-blue-900/20 border-blue-500/30' : ''}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      layout
    >
        {/* --- TOP: IMAGE AREA --- */}
        <div className="p-3">
            {/* FIXED HEIGHT (h-72) ensures image is always visible.
                'relative' allows Next.js Image fill to work.
            */}
            <div className={`w-full h-72 rounded-[1.5rem] bg-gradient-to-br ${member.color} relative overflow-hidden`}>
                 
                 {/* ACTUAL IMAGE */}
                 <Image 
                    src={member.image} 
                    alt={member.name}
                    fill
                    className="object-cover object-top opacity-90 group-hover:scale-105 transition-transform duration-700"
                    priority={true} // Ensures images load fast
                 />

                 {/* VISUAL OVERLAYS */}
                 {/* Noise */}
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-10 pointer-events-none"></div>
                 {/* Bottom Gradient for text readability if needed */}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-20 pointer-events-none"></div>
                 {/* Tint */}
                 <div className={`absolute inset-0 bg-gradient-to-br ${member.color} mix-blend-overlay opacity-20 z-30 pointer-events-none`}></div>
            </div>
        </div>

        {/* --- BOTTOM: INFO & EXPANSION --- */}
        <div className="px-6 pb-6 pt-2">
            
            {/* Always Visible Header */}
            <div className="mb-2">
                <h3 className="text-2xl font-black text-white tracking-tight leading-none mb-1">
                  {member.name}
                </h3>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-zinc-500">({member.studentId})</span>
                    <span className="h-1 w-1 rounded-full bg-zinc-700"></span>
                    <span className={`text-xs font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r ${member.color}`}>
                      {member.role}
                    </span>
                </div>
            </div>

            {/* Hidden Content: Reveals on Hover */}
            <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ 
                    height: isHovered ? "auto" : 0, 
                    opacity: isHovered ? 1 : 0 
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="overflow-hidden"
            >
                <div className="pt-4 border-t border-white/10 mt-4 pb-2">
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6 text-center">
                        {member.desc}
                    </p>
                    
                    {/* Centered Icons */}
                    <div className="flex gap-4 justify-center w-full p-2">
                        <SocialIcon href={member.socials.github} icon={<Github size={18} />} color="hover:text-white" />
                        <SocialIcon href={member.socials.linkedin} icon={<Linkedin size={18} />} color="hover:text-blue-400" />
                        <SocialIcon href={member.socials.instagram} icon={<Instagram size={18} />} color="hover:text-pink-400" />
                        <SocialIcon href={member.socials.mail} icon={<Mail size={18} />} color="hover:text-red-400" />
                    </div>
                </div>
            </motion.div>
        </div>
    </motion.div>
  );
});

const SocialIcon = ({ href, icon, color }: { href: string, icon: React.ReactNode, color: string }) => (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`p-3 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 transition-all border border-white/5 hover:scale-110 hover:border-white/20 ${color}`}
    >
      {icon}
    </a>
);

MemberCard.displayName = "MemberCard";