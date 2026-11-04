"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  BookOpen,
  GraduationCap,
  Users,
  ArrowRight,
  Zap,
  CheckCircle2,
  Lock,
} from "lucide-react";
import {
  MOCK_USERS,
  seedSessionStorage,
  setDemoUser,
  installFetchInterceptor,
} from "@/src/lib/mockDataService";

interface AuthViewProps {
  onAuthSuccess?: (userData: any) => void;
}

type PersonaRole = "admin" | "faculty" | "student" | "alumni";

interface PersonaConfig {
  role: PersonaRole;
  title: string;
  name: string;
  badge: string;
  desc: string;
  icon: React.ElementType;
  gradient: string;
  borderGlow: string;
  accentText: string;
  features: string[];
}

const PERSONAS: PersonaConfig[] = [
  {
    role: "admin",
    title: "System Administrator",
    name: "Dr. Anjali Mehta",
    badge: "HOD & Admin",
    desc: "Oversee global notes/resume approvals, audit trails, and platform configurations.",
    icon: ShieldCheck,
    gradient: "from-red-600/20 via-red-900/10 to-transparent",
    borderGlow: "border-red-500/30 hover:border-red-500/80 hover:shadow-red-900/30",
    accentText: "text-red-400",
    features: ["Global Approvals Queue", "System Audit Logs", "Resume Repository"],
  },
  {
    role: "faculty",
    title: "Academic Faculty",
    name: "Prof. Rohan Das",
    badge: "Asst. Professor",
    desc: "Verify student-submitted study resources, upload department notes, and manage profile.",
    icon: BookOpen,
    gradient: "from-blue-600/20 via-blue-900/10 to-transparent",
    borderGlow: "border-blue-500/30 hover:border-blue-500/80 hover:shadow-blue-900/30",
    accentText: "text-blue-400",
    features: ["Verification Console", "Upload Academic Notes", "HOD Approval Pipeline"],
  },
  {
    role: "student",
    title: "Enrolled Student",
    name: "Swayam Patel",
    badge: "24DCS088 (CE)",
    desc: "Explore interactive career roadmaps, download verified notes, and assess skill gaps.",
    icon: GraduationCap,
    gradient: "from-emerald-600/20 via-emerald-900/10 to-transparent",
    borderGlow: "border-emerald-500/30 hover:border-emerald-500/80 hover:shadow-emerald-900/30",
    accentText: "text-emerald-400",
    features: ["Career Roadmaps", "Resource Vault", "Skill Gap Navigator"],
  },
  {
    role: "alumni",
    title: "Industry Alumni",
    name: "Priya Sharma",
    badge: "Google SWE II",
    desc: "Connect with current students, share industry hiring perspectives, and view alumni network.",
    icon: Users,
    gradient: "from-purple-600/20 via-purple-900/10 to-transparent",
    borderGlow: "border-purple-500/30 hover:border-purple-500/80 hover:shadow-purple-900/30",
    accentText: "text-purple-400",
    features: ["Expert Alumni Directory", "Industry Mentorship", "Career Insights"],
  },
];

export default function AuthView({ onAuthSuccess }: AuthViewProps) {
  useEffect(() => {
    installFetchInterceptor();
    seedSessionStorage();
  }, []);

  const handleSelectPersona = (role: PersonaRole) => {
    const userPayload = MOCK_USERS[role];
    setDemoUser(userPayload);
    if (onAuthSuccess) {
      onAuthSuccess(userPayload);
    }
  };

  return (
    <div className="w-full min-h-screen md:h-screen flex flex-col md:flex-row bg-transparent text-white font-sans relative z-30 overflow-y-auto md:overflow-hidden custom-scrollbar">
      {/* ================= BRANDING PANEL ================= */}
      <div className="flex w-full md:w-[40%] min-h-[40vh] md:h-full bg-zinc-900/30 backdrop-blur-xl relative flex-col justify-between p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/10 shrink-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-900/15 to-transparent z-0 pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-[11px] font-bold tracking-wider uppercase mb-3">
            <Zap size={12} className="animate-pulse" />
            Static Interactive Demo
          </div>
          <h2 className="text-xl font-black tracking-[0.2em] text-white mb-2 uppercase">
            A.R.C.A.D.E.
          </h2>
          <div className="h-1 w-12 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
        </div>

        <div className="relative z-10 my-6 md:my-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4">
            Experience every perspective <span className="text-blue-500">instantly</span>.
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-6">
            Authentication boundaries have been lifted for this static showcase. Select any persona to test dashboards, verify notes, and explore roadmaps with simulated in-browser session storage.
          </p>
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono">
            <Lock size={12} className="text-emerald-400" />
            <span>Zero credentials required • Resets on tab close</span>
          </div>
        </div>

        <div className="relative z-10 text-[10px] text-zinc-500 font-mono">
          © 2026 ARCADE SYSTEM // DEMO ENVIRONMENT
        </div>
      </div>

      {/* ================= PERSONA SELECTION GATEWAY ================= */}
      <div className="w-full md:w-[60%] flex flex-col justify-center p-6 sm:p-10 md:p-12 bg-[#050505] relative z-20 overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-2xl mx-auto py-6">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">
              Select Demo Persona
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm">
              Click any role to load mock session data and enter the corresponding workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PERSONAS.map((p, index) => {
              const Icon = p.icon;
              return (
                <motion.button
                  key={p.role}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.08 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectPersona(p.role)}
                  className={`
                    group text-left p-5 rounded-2xl border transition-all duration-300
                    bg-gradient-to-br ${p.gradient} bg-zinc-900/40
                    ${p.borderGlow} shadow-lg backdrop-blur-md relative overflow-hidden
                  `}
                >
                  {/* Top Bar with Icon and Badge */}
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 ${p.accentText}`}>
                      <Icon size={20} />
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-zinc-300">
                      {p.badge}
                    </span>
                  </div>

                  {/* Title & Name */}
                  <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mb-2">{p.name}</p>
                  <p className="text-[11px] text-zinc-400 leading-relaxed mb-4">
                    {p.desc}
                  </p>

                  {/* Features Pill List */}
                  <div className="space-y-1 mb-4 pt-2 border-t border-white/5">
                    {p.features.map((feat) => (
                      <div key={feat} className="flex items-center gap-1.5 text-[10px] text-zinc-300">
                        <CheckCircle2 size={10} className={p.accentText} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Action Prompt */}
                  <div className="flex items-center justify-between text-xs font-bold pt-2 border-t border-white/5">
                    <span className="text-zinc-400 group-hover:text-white transition-colors">
                      Enter as {p.role.toUpperCase()}
                    </span>
                    <ArrowRight
                      size={14}
                      className="text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all"
                    />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
