"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Sun, Moon, X, Info, CheckCircle, Menu } from "lucide-react";

import StudentSidebar from "./StudentSidebar";
import ProfileView from "./ProfileView";
import Overview from "./Overview";
import NotesView from "./NotesView";
import RoadmapView from "./RoadmapView";
import SkillNavigator from "./SkillNavigator";
import ResumeResourcesView from "./ResumeResourcesView";
import DashboardCursor from "./DashboardCursor"; 
// Import the new component
import AlumniNetwork from "./AlumniNetwork";

export const ROADMAP_DATA: any = {
    "Frontend Developer": {
        mandatory: ["HTML5 Semantic", "CSS3 Flexbox/Grid", "JavaScript (ES6+)", "Git Basics", "React.js Fundamentals"],
        advanced: ["Next.js (App Router)", "TypeScript", "Tailwind CSS", "Redux/Zustand", "API Integration"],
        optional: ["Figma Basics", "SEO Optimization", "Jest/Testing", "Web Accessibility"]
    },
    "Backend Developer": {
        mandatory: ["Node.js Basics", "Express.js", "SQL (PostgreSQL)", "REST API Design", "Git Basics"],
        advanced: ["Microservices", "Docker/Kubernetes", "Redis/Caching", "GraphQL", "CI/CD Pipelines"],
        optional: ["AWS Basics", "System Design", "WebSockets"]
    },
    "Full Stack Developer": {
        mandatory: ["HTML/CSS/JS", "React.js", "Node.js", "SQL/NoSQL", "Git"],
        advanced: ["Next.js", "Docker", "AWS/Cloud", "System Design", "Testing"],
        optional: ["Mobile Dev (React Native)", "Graph DB", "Web3 Basics"]
    },
    "Data Scientist": {
        mandatory: ["Python Basics", "Pandas/NumPy", "SQL", "Statistics", "Data Viz"],
        advanced: ["Machine Learning", "Deep Learning", "TensorFlow/PyTorch", "Big Data (Spark)", "Model Deployment"],
        optional: ["R Language", "Computer Vision", "NLP"]
    },
    "DevOps Engineer": {
        mandatory: ["Linux Basics", "Networking", "Git", "Docker", "Python/Bash Scripting"],
        advanced: ["Kubernetes", "AWS/Azure", "Terraform", "CI/CD (Jenkins/GitHub)", "Monitoring (Prometheus)"],
        optional: ["Ansible", "Security (DevSecOps)", "Golang"]
    }
};

type Notification = { id: number; title: string; desc: string; time: string; type: "info" | "success" | "alert"; };

export default function StudentDashboard() {
  const [currentView, setCurrentView] = useState("overview");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [targetRole, setTargetRole] = useState("Frontend Developer"); 
  const [checkedSkills, setCheckedSkills] = useState<string[]>([]);

  const currentRoleData = ROADMAP_DATA[targetRole] || ROADMAP_DATA["Frontend Developer"];
  const mandatoryDone = currentRoleData.mandatory.every((s: string) => checkedSkills.includes(s));
  const advancedCount = currentRoleData.advanced.filter((s: string) => checkedSkills.includes(s)).length;
  const isRoleUnlocked = mandatoryDone && advancedCount >= 2;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [isNewUser, setIsNewUser] = useState(true); 

  useEffect(() => {
    setNotifications([]);
    const timers: NodeJS.Timeout[] = [];

    if (isNewUser) {
        timers.push(setTimeout(() => {
            addNotification({ title: "Welcome to ARCADE!", desc: "Your personalized career ecosystem is ready.", type: "success", time: "Now" });
            setIsNewUser(false); 
        }, 500));
    }
    timers.push(setTimeout(() => {
        addNotification({ title: "New Material Verified", desc: "Topic: 'Process Scheduling' (OS) uploaded by Rohan Das.", type: "info", time: "2m ago" });
    }, 4000));

    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

useEffect(() => {
    const timer = setTimeout(() => {
        addNotification({
            title: "Material Approved",
            desc: "Prof. J. Doe verified your 'Data Structures' notes.",
            time: "Now",
            type: "success"
        });
    }, 5000);
    return () => clearTimeout(timer);
}, []);

  const addNotification = (notif: Omit<Notification, "id">) => {
    setNotifications(prev => [{ id: Date.now() + Math.random(), ...notif }, ...prev]);
  };
  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const textMain = isDarkMode ? "text-white" : "text-zinc-900";
  const borderMain = isDarkMode ? "border-zinc-800" : "border-zinc-200";
  
  const bgMain = isDarkMode ? "bg-[#050505]" : "bg-[#f8fafc]"; 
  const panelBg = isDarkMode ? "bg-[#09090b] border-zinc-800" : "bg-white border-zinc-200"; 

  return (
    <div className={`flex h-screen w-full font-sans overflow-hidden transition-colors duration-300 ${bgMain} ${textMain}`}>
      
      <DashboardCursor />

      <div 
        className="absolute inset-0 pointer-events-none z-0" 
        style={{
            backgroundImage: isDarkMode 
                ? "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)"
                : "linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px"
        }}
      />

      <div className="relative z-30 h-full">
        <StudentSidebar 
            activeView={currentView} 
            onNavigate={setCurrentView} 
            isDarkMode={isDarkMode}
            studentName="Swayam Patel"
            mobileOpen={mobileMenuOpen}
            onMobileClose={() => setMobileMenuOpen(false)}
        />
      </div>

      <div className="flex-1 flex flex-col h-full relative z-20 overflow-hidden">
        
        <header className={`h-16 md:h-20 border-b backdrop-blur-md flex items-center justify-between px-4 md:px-8 relative z-50 transition-colors duration-300 ${borderMain} ${isDarkMode ? "bg-[#050505]/80" : "bg-white/50"}`}>
            
            <div className="flex items-center gap-3 md:gap-4">
                <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 -ml-2 text-zinc-500 hover:text-zinc-800 transition-colors"><Menu size={24} /></button>
                <div>
                    <h1 className="text-lg md:text-xl font-bold capitalize truncate max-w-[150px] md:max-w-none">
                        {currentView.replace("-", " ")}
                    </h1>
                    <p className={`hidden md:block text-xs font-mono ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                        SEM 4 // COMPUTER ENGINEERING
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-6">
                <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-full transition-all ${isDarkMode ? "bg-zinc-800 text-yellow-400" : "bg-zinc-100 text-zinc-600"}`}>
                    {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                <div className="relative">
                    <button 
                        onClick={() => setShowNotifPanel(!showNotifPanel)} 
                        className={`relative p-2 transition-colors ${showNotifPanel ? "text-blue-500" : "text-zinc-400"}`}
                    >
                        <Bell size={20} />
                        {notifications.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-black" />}
                    </button>
                    
                    <AnimatePresence>
                        {showNotifPanel && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                                animate={{ opacity: 1, y: 0, scale: 1 }} 
                                exit={{ opacity: 0, y: 10, scale: 0.95 }} 
                                className={`absolute right-0 top-14 w-80 md:w-96 rounded-2xl border shadow-2xl overflow-hidden z-[100] ${panelBg}`}
                            >
                                <div className={`p-4 border-b flex justify-between items-center ${isDarkMode ? "border-zinc-800 bg-zinc-900" : "border-zinc-100 bg-white"}`}>
                                    <h3 className={`font-bold text-sm ${textMain}`}>Notifications</h3>
                                    <div className="flex gap-3 items-center">
                                        <button onClick={() => setNotifications([])} className="text-[10px] text-blue-500 hover:underline">Clear</button>
                                        <button onClick={() => setShowNotifPanel(false)} className={`p-1 rounded transition-colors ${isDarkMode ? "hover:bg-zinc-800 text-zinc-400" : "hover:bg-zinc-200 text-zinc-600"}`}><X size={14}/></button>
                                    </div>
                                </div>

                                <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                                    {notifications.length === 0 ? (
                                        <div className={`p-8 text-center text-xs py-12 ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>No new notifications</div>
                                    ) : (
                                        notifications.map(n => (
                                            <div key={n.id} className={`p-4 border-b relative group transition-colors ${isDarkMode ? "border-zinc-800 hover:bg-zinc-800/50" : "border-zinc-100 hover:bg-zinc-50"}`}>
                                                <button onClick={() => removeNotification(n.id)} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-red-500"><X size={12}/></button>
                                                <div className="flex gap-3">
                                                    <div className={`mt-0.5 ${n.type === "success" ? "text-green-500" : "text-blue-500"}`}>{n.type === "success" ? <CheckCircle size={16} /> : <Info size={16} />}</div>
                                                    <div>
                                                        <h4 className={`text-sm font-bold leading-none mb-1 ${textMain}`}>{n.title}</h4>
                                                        <p className={`text-xs leading-relaxed ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>{n.desc}</p>
                                                        <span className="text-[10px] opacity-40 mt-1 block">{n.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <button onClick={() => setCurrentView("profile")} className="flex items-center gap-3 pl-3 md:pl-6 border-l border-white/10">
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-bold">Swayam</p>
                        <p className="text-[10px] text-blue-500">24DCS088</p>
                    </div>
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border shadow-sm">
                         <img src="/swayam.jpeg" alt="Swayam" className="w-full h-full object-cover" />
                    </div>
                </button>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar relative p-4 md:p-10 pb-24 z-0">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentView}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: "easeOut" }}
                    className="h-full max-w-7xl mx-auto"
                >
                    {currentView === "overview" && <Overview isDark={isDarkMode} targetRole={targetRole} />}
                    {currentView === "profile" && <ProfileView isDarkMode={isDarkMode} targetRole={targetRole} onRoleChange={(role) => { setTargetRole(role); setCheckedSkills([]); }} isUnlocked={isRoleUnlocked} />}
                    {currentView === "roadmap" && <RoadmapView isDark={isDarkMode} targetRole={targetRole} checkedSkills={checkedSkills} setCheckedSkills={setCheckedSkills} roleData={currentRoleData} />}
                    {currentView === "notes" && <NotesView isDark={isDarkMode} />}
                    {currentView === "skills" && <SkillNavigator isDark={isDarkMode} />}
                    {currentView === "resumes" && <ResumeResourcesView isDark={isDarkMode} initialTab="resumes" />}
                    {currentView === "resources" && <ResumeResourcesView isDark={isDarkMode} initialTab="resources" />}
                    {/* NEW: Alumni Network View */}
                    {currentView === "alumni" && <AlumniNetwork isDark={isDarkMode} />}
                </motion.div>
            </AnimatePresence>
        </div>

      </div>
    </div>
  );
}