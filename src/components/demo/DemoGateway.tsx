"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  GraduationCap,
  BookOpen,
  Users,
  ArrowRight,
  Zap,
} from "lucide-react";
import { MOCK_USERS, seedSessionStorage, setDemoUser, installFetchInterceptor } from "@/src/lib/mockDataService";

// ─── Role Definitions ─────────────────────────────────────────────────────────

type DemoRole = "admin" | "faculty" | "student" | "alumni";

interface RoleCard {
  role: DemoRole;
  label: string;
  tagline: string;
  icon: React.ElementType;
  color: string;
  glowColor: string;
  borderColor: string;
  features: string[];
}

const ROLE_CARDS: RoleCard[] = [
  {
    role: "admin",
    label: "Admin",
    tagline: "Platform Overseer",
    icon: ShieldCheck,
    color: "from-red-600/20 to-red-900/10",
    glowColor: "shadow-red-900/30",
    borderColor: "border-red-500/30 hover:border-red-500/70",
    features: ["Global Approvals", "Audit Logs", "Resume Management", "User Control"],
  },
  {
    role: "faculty",
    label: "Faculty",
    tagline: "Academic Mentor",
    icon: BookOpen,
    color: "from-blue-600/20 to-blue-900/10",
    glowColor: "shadow-blue-900/30",
    borderColor: "border-blue-500/30 hover:border-blue-500/70",
    features: ["Upload Notes", "Student Verification", "HOD Approvals", "My Profile"],
  },
  {
    role: "student",
    label: "Student",
    tagline: "Career Navigator",
    icon: GraduationCap,
    color: "from-green-600/20 to-green-900/10",
    glowColor: "shadow-green-900/30",
    borderColor: "border-green-500/30 hover:border-green-500/70",
    features: ["Skill Roadmap", "Shared Notes", "Resume Resources", "Alumni Network"],
  },
  {
    role: "alumni",
    label: "Alumni",
    tagline: "Industry Navigator",
    icon: Users,
    color: "from-purple-600/20 to-purple-900/10",
    glowColor: "shadow-purple-900/30",
    borderColor: "border-purple-500/30 hover:border-purple-500/70",
    features: ["Alumni Network", "Career Insights", "Mentor Connect", "Job Board"],
  },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface DemoGatewayProps {
  onRoleSelected: (user: any) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DemoGateway({ onRoleSelected }: DemoGatewayProps) {
  useEffect(() => {
    // Install fetch interceptor and seed storage as soon as gateway mounts
    installFetchInterceptor();
    seedSessionStorage();
  }, []);

  const handleRoleClick = (role: DemoRole) => {
    const user = MOCK_USERS[role];
    setDemoUser(user);
    onRoleSelected(user);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-transparent text-white p-6 relative z-30">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/15 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-widest uppercase mb-5">
          <Zap size={12} className="animate-pulse" />
          Interactive Demo
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
          Choose Your{" "}
          <span className="text-blue-500">Role</span>
        </h1>
        <p className="text-zinc-400 text-base max-w-md mx-auto leading-relaxed">
          Instantly explore ARCADE from any perspective. No login required — your session resets when you close the tab.
        </p>
      </motion.div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl">
        {ROLE_CARDS.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.button
              key={card.role}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleRoleClick(card.role)}
              className={`
                relative group text-left p-6 rounded-2xl border transition-all duration-300
                bg-gradient-to-br ${card.color}
                ${card.borderColor}
                shadow-xl ${card.glowColor}
                backdrop-blur-sm
              `}
            >
              {/* Icon */}
              <div className="mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors">
                  <Icon size={22} />
                </div>
              </div>

              {/* Text */}
              <h2 className="text-xl font-bold mb-0.5">{card.label}</h2>
              <p className="text-xs text-zinc-400 font-medium mb-4">{card.tagline}</p>

              {/* Feature list */}
              <ul className="space-y-1.5 mb-5">
                {card.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-zinc-300">
                    <span className="w-1 h-1 rounded-full bg-zinc-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="flex items-center gap-2 text-xs font-bold text-white/70 group-hover:text-white transition-colors">
                Enter as {card.label}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Footer note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mt-8 text-zinc-600 text-xs text-center"
      >
        All data shown is fictional and generated for demonstration purposes only.
      </motion.p>
    </div>
  );
}

