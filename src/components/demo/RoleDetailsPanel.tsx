"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  Users,
  CheckCircle2,
  Info,
} from "lucide-react";
import { getDemoUser } from "@/src/lib/mockDataService";

// ─── Permission Sets ──────────────────────────────────────────────────────────

interface PermissionGroup {
  group: string;
  items: string[];
}

const ROLE_DETAILS: Record<
  string,
  {
    title: string;
    icon: React.ElementType;
    color: string;
    borderColor: string;
    bgBadge: string;
    groups: PermissionGroup[];
  }
> = {
  admin: {
    title: "System Administrator",
    icon: ShieldCheck,
    color: "text-red-400",
    borderColor: "border-red-500/30",
    bgBadge: "bg-red-500/15 text-red-300",
    groups: [
      {
        group: "Platform Control & Workflows",
        items: [
          "Oversee all global approvals (notes & resumes)",
          "Inspect real-time system audit logs",
          "Manage platform-wide resume repository",
          "Toggle user status and permission tiers",
        ],
      },
      {
        group: "Target Backend API Routes",
        items: [
          "app/api/admin/approvals/ (POST/GET)",
          "app/api/admin/audit/ (GET)",
          "app/api/user/ (GET)",
        ],
      },
      {
        group: "Component Workspaces",
        items: [
          "AdminDashboard.tsx (Approval Queue)",
          "AdminDashboard.tsx (Audit Table)",
          "AdminDashboard.tsx (Resume Archives)",
        ],
      },
    ],
  },
  faculty: {
    title: "Academic Faculty",
    icon: BookOpen,
    color: "text-blue-400",
    borderColor: "border-blue-500/30",
    bgBadge: "bg-blue-500/15 text-blue-300",
    groups: [
      {
        group: "Academic Workflows",
        items: [
          "Upload syllabus notes & reference materials",
          "Student resource verification console",
          "HOD resume approval review pipeline",
          "Faculty profile & cabin directory update",
        ],
      },
      {
        group: "Component Tree",
        items: [
          "FacultyProfile.tsx (Profile details)",
          "FacultyVerification.tsx (Verification queue)",
          "FacultyUploads.tsx (Upload management)",
        ],
      },
      {
        group: "Target Backend API Routes",
        items: [
          "app/api/notes/ (Direct auto-verified POST)",
          "app/api/auth/ (Faculty authorization)",
        ],
      },
    ],
  },
  student: {
    title: "Enrolled Student",
    icon: GraduationCap,
    color: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    bgBadge: "bg-emerald-500/15 text-emerald-300",
    groups: [
      {
        group: "Interactive Academic Tools",
        items: [
          "Track dynamic career roadmap milestones",
          "Review personal skill matrices and gap analysis",
          "Access faculty-verified Resource Vault",
          "Submit study notes for verification",
          "Explore Alumni network & resume archives",
        ],
      },
      {
        group: "Component Tree",
        items: [
          "Overview.tsx (Academic KPI dashboard)",
          "RoadmapView.tsx (Interactive career graph)",
          "NotesView.tsx (Vault & My Uploads)",
          "SkillNavigator.tsx (Skill diagnostic engine)",
          "AlumniNetwork.tsx (Mentorship & expert net)",
          "ResumeResourcesView.tsx (Resume archives)",
        ],
      },
      {
        group: "Target Backend API Routes",
        items: [
          "app/api/notes/ (Submit & Browse library)",
          "app/api/alumni/ (Network directory)",
        ],
      },
    ],
  },
  alumni: {
    title: "Graduated Alumni",
    icon: Users,
    color: "text-purple-400",
    borderColor: "border-purple-500/30",
    bgBadge: "bg-purple-500/15 text-purple-300",
    groups: [
      {
        group: "Network & Mentorship Actions",
        items: [
          "Connect with enrolled undergraduate students",
          "Provide industry guidance & career insights",
          "Share referral and job board opportunities",
          "Browse alumni batch directory",
        ],
      },
      {
        group: "Data Sources & Components",
        items: [
          "AlumniNetwork.tsx (Expert directory)",
          "AlumniData.ts (Industry profiles & filters)",
          "app/api/alumni/ (Alumni endpoint)",
        ],
      },
      {
        group: "Accessible Workspaces",
        items: [
          "Alumni Network Directory",
          "Practice Zone & Career Insights",
        ],
      },
    ],
  },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface RoleDetailsPanelProps {
  role?: string | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RoleDetailsPanel({ role: propRole }: RoleDetailsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<string>("admin");

  // Sync role with session or prop
  useEffect(() => {
    const updateRoleFromSession = () => {
      if (propRole) {
        setActiveRole(propRole);
        return;
      }
      const demoUser = getDemoUser();
      if (demoUser?.role && ROLE_DETAILS[demoUser.role]) {
        setActiveRole(demoUser.role);
      }
    };

    updateRoleFromSession();

    const handleAuthChange = (e: any) => {
      const newUser = e.detail || getDemoUser();
      if (newUser?.role && ROLE_DETAILS[newUser.role]) {
        setActiveRole(newUser.role);
      }
    };

    window.addEventListener("arcade-auth-change", handleAuthChange);
    window.addEventListener("storage", updateRoleFromSession);
    return () => {
      window.removeEventListener("arcade-auth-change", handleAuthChange);
      window.removeEventListener("storage", updateRoleFromSession);
    };
  }, [propRole]);

  const details = ROLE_DETAILS[activeRole] || ROLE_DETAILS["admin"];
  const Icon = details.icon;

  return (
    <>
      {/* Floating Toggle Tab pinned to right edge */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close Role Details" : "Open Role Details"}
        className={`
          fixed top-1/2 -translate-y-1/2 z-[9990] flex items-center gap-1.5
          bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white
          border border-zinc-700/80 backdrop-blur-md
          transition-all duration-300 rounded-l-xl px-2 py-3 shadow-2xl cursor-pointer
          ${isOpen ? "right-80 md:right-96" : "right-0"}
        `}
      >
        <div className="flex flex-col items-center gap-1">
          <Info size={14} className={details.color} />
          <span className="text-[10px] font-black tracking-widest uppercase [writing-mode:vertical-rl] rotate-180 select-none">
            Role Permissions
          </span>
        </div>
        {isOpen ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Sliding Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 z-[9991] bg-black/60 backdrop-blur-sm"
            />

            <motion.aside
              key="role-details-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed right-0 top-0 bottom-0 w-80 md:w-96 z-[9992] bg-zinc-950/95 backdrop-blur-xl border-l border-zinc-800 flex flex-col shadow-2xl overflow-hidden font-sans"
              aria-label="Universal Role Details Panel"
            >
              {/* Header */}
              <div className="p-5 border-b border-zinc-800/80 bg-zinc-900/40 shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg bg-zinc-900 border ${details.borderColor} ${details.color}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase font-black tracking-wider">
                        Universal Details Panel
                      </p>
                      <h3 className="text-sm font-bold text-white capitalize">
                        {details.title}
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>

                {/* Role Switcher Pills */}
                <div className="grid grid-cols-4 gap-1 p-1 rounded-lg bg-zinc-900 border border-zinc-800">
                  {(["admin", "faculty", "student", "alumni"] as const).map((r) => {
                    const isSelected = activeRole === r;
                    return (
                      <button
                        key={r}
                        onClick={() => setActiveRole(r)}
                        className={`py-1 text-[10px] font-bold uppercase rounded-md transition-all ${
                          isSelected
                            ? "bg-zinc-800 text-white shadow-sm"
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        {r}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
                {details.groups.map((group) => (
                  <div key={group.group}>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-2.5">
                      {group.group}
                    </p>
                    <div className="space-y-2">
                      {group.items.map((item) => (
                        <div
                          key={item}
                          className="flex items-start gap-2.5 p-2 rounded-lg bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700/50 transition-colors"
                        >
                          <CheckCircle2
                            size={14}
                            className={`mt-0.5 shrink-0 ${details.color}`}
                          />
                          <span className="text-xs text-zinc-300 font-mono leading-relaxed">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-zinc-800/80 bg-zinc-900/60 shrink-0">
                <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                  <span>Ephemeral Session • Reset on tab close</span>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
