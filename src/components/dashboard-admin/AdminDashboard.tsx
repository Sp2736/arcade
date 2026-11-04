"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Bell,
  Search,
  Users,
  Database,
  Activity,
  Layers,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { seedSessionStorage } from "@/src/lib/mockDataService";

interface AdminDashboardProps {
  user?: any;
  onLogout: () => void;
}

type AdminTab = "approvals" | "audit" | "resumes" | "users";

interface ApprovalItem {
  id: string;
  type: string;
  title: string;
  submittedBy: string;
  studentId: string;
  department: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  link?: string;
}

interface AuditLog {
  id: string;
  action: string;
  user: string;
  role: string;
  ipAddress: string;
  timestamp: string;
  status: string;
}

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [currentTab, setCurrentTab] = useState<AdminTab>("approvals");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    seedSessionStorage();

    // Fetch initial approvals
    fetch("/api/admin/approvals")
      .then((res) => res.json())
      .then((data) => {
        if (data.approvals) setApprovals(data.approvals);
      })
      .catch(console.error);

    // Fetch initial audit logs
    fetch("/api/admin/audit")
      .then((res) => res.json())
      .then((data) => {
        if (data.logs) setAuditLogs(data.logs);
      })
      .catch(console.error);
  }, []);

  const handleDecision = async (id: string, status: "approved" | "rejected") => {
    try {
      await fetch("/api/admin/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      setApprovals((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      );

      setNotification(`Item ${status === "approved" ? "approved" : "rejected"} successfully.`);
      setTimeout(() => setNotification(null), 3500);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredApprovals = approvals.filter((item) => {
    const matchesFilter =
      filterType === "all"
        ? true
        : filterType === "pending"
        ? item.status === "pending"
        : item.type === filterType;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.submittedBy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = approvals.filter((a) => a.status === "pending").length;

  const bgMain = isDarkMode ? "bg-[#09090b]" : "bg-zinc-50";
  const bgPanel = isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200";
  const textMain = isDarkMode ? "text-white" : "text-zinc-900";
  const textSub = isDarkMode ? "text-zinc-400" : "text-zinc-600";
  const borderMain = isDarkMode ? "border-zinc-800" : "border-zinc-200";

  return (
    <div className={`flex h-screen w-full font-sans overflow-hidden ${bgMain} ${textMain}`}>
      {/* SIDEBAR */}
      <aside
        className={`flex flex-col border-r transition-all duration-300 z-30 shrink-0 ${
          isSidebarOpen ? "w-64" : "w-20"
        } ${bgPanel} ${borderMain}`}
      >
        {/* Brand header */}
        <div className={`h-16 flex items-center px-5 border-b ${borderMain} justify-between`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck size={18} />
            </div>
            {isSidebarOpen && (
              <div>
                <p className="text-xs font-black tracking-widest uppercase">ARCADE</p>
                <p className="text-[10px] text-red-400 font-semibold tracking-wider uppercase">
                  Admin Console
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 text-zinc-500 hover:text-white transition-colors"
          >
            <Menu size={16} />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          <button
            onClick={() => setCurrentTab("approvals")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
              currentTab === "approvals"
                ? "bg-red-600/20 text-red-400 border border-red-500/30"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Layers size={18} className="shrink-0" />
            {isSidebarOpen && (
              <span className="flex-1 text-left flex items-center justify-between">
                Approvals Queue
                {pendingCount > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] bg-red-500 text-white rounded-full">
                    {pendingCount}
                  </span>
                )}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentTab("audit")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
              currentTab === "audit"
                ? "bg-red-600/20 text-red-400 border border-red-500/30"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Activity size={18} className="shrink-0" />
            {isSidebarOpen && <span>System Audit Logs</span>}
          </button>

          <button
            onClick={() => setCurrentTab("resumes")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
              currentTab === "resumes"
                ? "bg-red-600/20 text-red-400 border border-red-500/30"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <FileText size={18} className="shrink-0" />
            {isSidebarOpen && <span>Platform Resumes</span>}
          </button>

          <button
            onClick={() => setCurrentTab("users")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
              currentTab === "users"
                ? "bg-red-600/20 text-red-400 border border-red-500/30"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Users size={18} className="shrink-0" />
            {isSidebarOpen && <span>User Directory</span>}
          </button>
        </nav>

        {/* User Card & Logout */}
        <div className={`p-4 border-t ${borderMain} flex flex-col gap-3`}>
          {isSidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center text-xs font-bold text-red-400">
                AM
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate">
                  {user?.full_name || "Dr. Anjali Mehta"}
                </p>
                <p className="text-[10px] text-zinc-500 truncate">HOD & Admin</p>
              </div>
            </div>
          )}
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={16} className="shrink-0" />
            {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* MAIN VIEW */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header
          className={`h-16 border-b flex items-center justify-between px-6 shrink-0 ${bgPanel} ${borderMain}`}
        >
          <div className="flex items-center gap-3">
            <h1 className="text-base font-bold capitalize">
              {currentTab === "approvals" && "Global Approvals Console"}
              {currentTab === "audit" && "System Audit & Security Logs"}
              {currentTab === "resumes" && "Platform-Wide Resume Repository"}
              {currentTab === "users" && "Platform User Registry"}
            </h1>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/10 text-red-400 border border-red-500/20">
              LIVE DEMO
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg border transition-all ${
                isDarkMode ? "bg-zinc-800 border-zinc-700 text-yellow-400" : "bg-zinc-100 border-zinc-300 text-zinc-700"
              }`}
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </header>

        {/* Notification Toast */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-6 mt-4 p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-lg flex items-center gap-2"
            >
              <CheckCircle size={15} />
              {notification}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {/* STATS ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className={`p-4 rounded-xl border ${bgPanel} ${borderMain}`}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">
                  Pending Approvals
                </span>
                <Clock size={16} className="text-amber-500" />
              </div>
              <p className="text-2xl font-black">{pendingCount}</p>
              <p className="text-[11px] text-zinc-500 mt-1">Requires admin review</p>
            </div>

            <div className={`p-4 rounded-xl border ${bgPanel} ${borderMain}`}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">
                  Total Vault Notes
                </span>
                <Database size={16} className="text-blue-500" />
              </div>
              <p className="text-2xl font-black">4</p>
              <p className="text-[11px] text-zinc-500 mt-1">Faculty-verified resources</p>
            </div>

            <div className={`p-4 rounded-xl border ${bgPanel} ${borderMain}`}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">
                  Registered Personas
                </span>
                <Users size={16} className="text-purple-500" />
              </div>
              <p className="text-2xl font-black">4</p>
              <p className="text-[11px] text-zinc-500 mt-1">Admin, Faculty, Student, Alumni</p>
            </div>

            <div className={`p-4 rounded-xl border ${bgPanel} ${borderMain}`}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">
                  System Health
                </span>
                <Activity size={16} className="text-emerald-500" />
              </div>
              <p className="text-2xl font-black text-emerald-400">99.9%</p>
              <p className="text-[11px] text-zinc-500 mt-1">All mock services operational</p>
            </div>
          </div>

          {/* TAB 1: APPROVALS */}
          {currentTab === "approvals" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  {["all", "pending", "note", "resume"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setFilterType(tab)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                        filterType === tab
                          ? "bg-red-600 text-white shadow-md shadow-red-900/30"
                          : "bg-zinc-800/60 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
                  <input
                    type="text"
                    placeholder="Search submissions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-9 pr-3 py-1.5 rounded-lg border text-xs outline-none ${
                      isDarkMode
                        ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500"
                        : "bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400"
                    }`}
                  />
                </div>
              </div>

              {/* Table */}
              <div className={`rounded-xl border overflow-hidden ${bgPanel} ${borderMain}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className={`border-b ${borderMain} bg-zinc-950/40 text-zinc-400 font-bold uppercase text-[10px]`}>
                        <th className="p-3">Type</th>
                        <th className="p-3">Title / Subject</th>
                        <th className="p-3">Submitted By</th>
                        <th className="p-3">Department</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {filteredApprovals.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-zinc-500">
                            No submissions found matching criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredApprovals.map((item) => (
                          <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-3 font-semibold">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  item.type === "resume"
                                    ? "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                                    : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                                }`}
                              >
                                {item.type}
                              </span>
                            </td>
                            <td className="p-3 font-bold max-w-xs truncate">{item.title}</td>
                            <td className="p-3">
                              <p className="font-semibold">{item.submittedBy}</p>
                              <p className="text-[10px] text-zinc-500">{item.studentId}</p>
                            </td>
                            <td className="p-3 text-zinc-400">{item.department}</td>
                            <td className="p-3 text-zinc-400">{item.submittedAt}</td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                                  item.status === "approved"
                                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                    : item.status === "rejected"
                                    ? "bg-red-500/15 text-red-400 border border-red-500/30"
                                    : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              {item.status === "pending" ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleDecision(item.id, "approved")}
                                    className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all"
                                    title="Approve"
                                  >
                                    <CheckCircle size={15} />
                                  </button>
                                  <button
                                    onClick={() => handleDecision(item.id, "rejected")}
                                    className="p-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition-all"
                                    title="Reject"
                                  >
                                    <XCircle size={15} />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[10px] text-zinc-600 italic">Resolved</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AUDIT LOGS */}
          {currentTab === "audit" && (
            <div className={`rounded-xl border overflow-hidden ${bgPanel} ${borderMain}`}>
              <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold">System Security & Access Audit</h3>
                  <p className="text-[11px] text-zinc-500">
                    Real-time transaction log mirroring app/api/admin/audit/
                  </p>
                </div>
                <span className="px-2 py-1 rounded bg-zinc-800 text-[10px] font-mono text-zinc-400">
                  {auditLogs.length} Events Logged
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className={`border-b ${borderMain} bg-zinc-950/40 text-zinc-400 font-bold uppercase text-[10px]`}>
                      <th className="p-3">Event ID</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">User</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">IP Address</th>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800 font-mono">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-3 text-zinc-500">{log.id}</td>
                        <td className="p-3 text-white font-bold">{log.action}</td>
                        <td className="p-3 text-zinc-300">{log.user}</td>
                        <td className="p-3 uppercase text-[10px]">{log.role}</td>
                        <td className="p-3 text-zinc-400">{log.ipAddress}</td>
                        <td className="p-3 text-zinc-500">{log.timestamp}</td>
                        <td className="p-3">
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400">
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: RESUMES */}
          {currentTab === "resumes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {approvals
                .filter((a) => a.type === "resume")
                .map((resume) => (
                  <div
                    key={resume.id}
                    className={`p-5 rounded-xl border flex flex-col justify-between ${bgPanel} ${borderMain}`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-500/15 text-purple-400 border border-purple-500/30">
                          {resume.department}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase ${
                            resume.status === "approved"
                              ? "text-emerald-400"
                              : resume.status === "rejected"
                              ? "text-red-400"
                              : "text-amber-400"
                          }`}
                        >
                          {resume.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold mb-1">{resume.title}</h4>
                      <p className="text-xs text-zinc-400 mb-4">{resume.submittedBy} ({resume.studentId})</p>
                    </div>
                    <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                      <span className="text-[10px] text-zinc-500">{resume.submittedAt}</span>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          alert("Demo: In full deployment, this opens the verified PDF resume in Google Drive / Storage.");
                        }}
                        className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                      >
                        Inspect Resume <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* TAB 4: USERS */}
          {currentTab === "users" && (
            <div className={`rounded-xl border p-5 ${bgPanel} ${borderMain}`}>
              <h3 className="text-sm font-bold mb-1">Ecosystem Persona Directory</h3>
              <p className="text-xs text-zinc-500 mb-4">
                Mock persona definitions currently active in the demo session.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "Dr. Anjali Mehta", role: "admin", dept: "Computer Engineering", email: "anjali.mehta@charusat.edu.in" },
                  { name: "Prof. Rohan Das", role: "faculty", dept: "Computer Science and Eng.", email: "rohan.das@charusat.edu.in" },
                  { name: "Swayam Patel", role: "student", dept: "Computer Engineering", email: "24dcs088@charusat.edu.in" },
                  { name: "Priya Sharma", role: "alumni", dept: "CSE (Google India)", email: "priya.sharma@charusat.edu.in" },
                ].map((u) => (
                  <div key={u.email} className="p-4 rounded-lg bg-zinc-950/40 border border-zinc-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs uppercase">
                      {u.name.substring(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">{u.name}</p>
                      <p className="text-[10px] text-zinc-400 truncate">{u.dept}</p>
                      <p className="text-[10px] text-zinc-500 truncate">{u.email}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-zinc-800 text-zinc-300">
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

