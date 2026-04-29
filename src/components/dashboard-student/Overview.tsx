"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Cpu, Award, 
  Layers, Sparkles, ScrollText, ExternalLink, Activity, Bell, Map, ChevronRight, X
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

interface OverviewProps {
  isDark: boolean;
  targetRole: string; 
  notifications: any[];
  checkedSkills: string[];
  roleData: any;
}

const containerVar = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVar = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Overview({ isDark, targetRole, notifications, checkedSkills, roleData }: OverviewProps) {
  const textMain = isDark ? "text-white" : "text-zinc-900";
  
  const [showAssetsPopup, setShowAssetsPopup] = useState(false);
  const [latestAssets, setLatestAssets] = useState<any[]>([]);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);

  // Calculate Roadmap Progress
  const totalNodes = (roleData?.mandatory?.length || 0) + (roleData?.advanced?.length || 0) + (roleData?.optional?.length || 0);
  const completedNodes = checkedSkills?.length || 0;
  const progressPercent = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;

  // Process Pending Alerts
  const unreadAlerts = notifications?.filter(n => !n.is_read) || [];
  const displayAlerts = unreadAlerts.slice(0, 2);

  // Fetch Latest 5 Assets directly from Database
  const fetchLatestAssets = async () => {
      setIsLoadingAssets(true);
      setShowAssetsPopup(true);
      try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) return;
          
          const { data: notes } = await supabase.from('notes').select('id:note_id, title, file_path, created_at').eq('status', 'approved').order('created_at', { ascending: false }).limit(5);
          const { data: resumes } = await supabase.from('resume_samples').select('id:resume_id, title, file_path, created_at').eq('status', 'approved').order('created_at', { ascending: false }).limit(5);
          
          const combined = [
              ...(notes?.map(n => ({ ...n, type: 'Material' })) || []), 
              ...(resumes?.map(r => ({ ...r, type: 'Resume' })) || [])
          ];
          
          combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          setLatestAssets(combined.slice(0, 5));
      } catch (error) {
          console.error("Failed to load assets.");
      } finally {
          setIsLoadingAssets(false);
      }
  };

  return (
    <motion.div variants={containerVar} initial="hidden" animate="show" className="space-y-10 pb-10">
      
      {/* Latest Assets Popup Modal */}
      <AnimatePresence>
          {showAssetsPopup && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}>
                      <div className="flex justify-between items-center mb-6 border-b pb-4 border-white/10">
                          <h3 className={`text-xl font-bold flex items-center gap-2 ${textMain}`}>
                              <FileText className="text-purple-500" size={24} /> 
                              Latest System Vaults
                          </h3>
                          <button onClick={() => setShowAssetsPopup(false)} className="p-2 rounded-lg text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-colors"><X size={20} /></button>
                      </div>
                      
                      <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                          {isLoadingAssets ? (
                              <p className="text-zinc-500 text-sm text-center py-8 animate-pulse">Decrypting secure files...</p>
                          ) : latestAssets.length === 0 ? (
                              <p className="text-zinc-500 text-sm text-center py-8">No approved assets available in the vault yet.</p>
                          ) : latestAssets.map((asset, i) => (
                              <a key={i} href={asset.file_path} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${isDark ? "border-zinc-800 hover:border-zinc-600 bg-zinc-800/30 hover:bg-zinc-800" : "border-zinc-200 hover:border-zinc-400 bg-zinc-50 hover:bg-zinc-100"}`}>
                                  <div className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center ${asset.type === 'Resume' ? 'bg-purple-500/20 text-purple-500' : 'bg-blue-500/20 text-blue-500'}`}><FileText size={18} /></div>
                                  <div className="flex-1 min-w-0">
                                      <p className={`font-bold text-sm truncate ${textMain}`}>{asset.title}</p>
                                      <p className="text-[11px] text-zinc-500 uppercase tracking-widest mt-1">{asset.type} • {new Date(asset.created_at).toLocaleDateString()}</p>
                                  </div>
                                  <ExternalLink size={16} className="text-zinc-400 shrink-0" />
                              </a>
                          ))}
                      </div>
                  </motion.div>
              </div>
          )}
      </AnimatePresence>

      <motion.div variants={itemVar} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl md:text-3xl font-black uppercase tracking-tight ${textMain}`}>Command Center</h2>
          <p className="text-zinc-500 flex items-center gap-2 mt-1">
            <Activity size={16} className="text-emerald-500" /> System Online & Synced
          </p>
        </div>
        
        <div className={`px-5 py-3 rounded-xl flex flex-col border ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200 shadow-sm"}`}>
             <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-1">Target Trajectory</span>
             <span className={`font-bold text-md uppercase ${isDark ? "text-blue-400" : "text-blue-700"}`}>
                 {targetRole || "ROLE NOT CONFIGURED"}
             </span>
        </div>
      </motion.div>

      <motion.div variants={itemVar} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className={`p-5 rounded-2xl border ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200 shadow-sm"}`}>
            <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${isDark ? "bg-orange-500/10 border-orange-500/30 text-orange-400" : "bg-orange-50 border-orange-200 text-orange-600"}`}><Bell size={20} /></div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${unreadAlerts.length > 0 ? "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400" : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"}`}>
                    {unreadAlerts.length} Unread
                </span>
            </div>
            <h4 className={`text-lg font-bold mb-2 ${textMain}`}>Pending Alerts</h4>
            <ul className="space-y-2 min-h-[40px]">
                {displayAlerts.length > 0 ? displayAlerts.map(alert => (
                    <li key={alert.notification_id} className="text-sm text-zinc-500 flex items-start gap-2 line-clamp-1 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0"></span> 
                        {alert.title}
                    </li>
                )) : (
                    <li className="text-sm text-zinc-500 italic">No pending alerts. You're all caught up!</li>
                )}
            </ul>
        </div>

        <div className={`p-5 rounded-2xl border ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200 shadow-sm"}`}>
            <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${isDark ? "bg-blue-500/10 border-blue-500/30 text-blue-400" : "bg-blue-50 border-blue-200 text-blue-600"}`}><Map size={20} /></div>
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">In Progress</span>
            </div>
            <h4 className={`text-lg font-bold mb-2 ${textMain}`}>Active Roadmap</h4>
            <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2.5 mb-2 mt-4 relative overflow-hidden">
                <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-700 ease-out" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <div className="flex justify-between items-center mt-1">
                <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">{completedNodes} / {totalNodes} Nodes</p>
                <p className="text-xs font-bold text-blue-500">{progressPercent}% Completed</p>
            </div>
        </div>

        <div className={`p-5 rounded-2xl border flex flex-col ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200 shadow-sm"}`}>
            <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${isDark ? "bg-purple-500/10 border-purple-500/30 text-purple-400" : "bg-purple-50 border-purple-200 text-purple-600"}`}><FileText size={20} /></div>
            </div>
            <h4 className={`text-lg font-bold mb-2 ${textMain}`}>Latest Academic Assets</h4>
            <div className="mt-auto">
                <button onClick={fetchLatestAssets} className={`w-full py-2.5 flex items-center justify-between text-sm font-bold rounded-lg px-4 transition-colors ${isDark ? "bg-zinc-800 hover:bg-zinc-700 text-white" : "bg-zinc-100 hover:bg-zinc-200 text-zinc-900"}`}>
                    View 5 New Uploads <ChevronRight size={16} />
                </button>
            </div>
        </div>

      </motion.div>

      <motion.div variants={itemVar}>
        <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${textMain}`}>
            <span className="w-1 h-6 bg-blue-500 rounded-full"></span> Industry Intelligence Grid
        </h3>
        <GlobalIntelligenceGrid isDark={isDark} />
      </motion.div>

    </motion.div>
  );
}

const GlobalIntelligenceGrid = ({ isDark }: { isDark: boolean }) => {
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    const cards = [
        {
            id: 1,
            title: "GitHub Repos",
            desc: "Must-know repositories for developers.",
            icon: Sparkles,
            color: "purple",
            links: [
                { name: "Awesome", url: "https://github.com/sindresorhus/awesome", brand: "github" },
                { name: "Free Books", url: "https://github.com/EbookFoundation/free-programming-books", brand: "github" },
                { name: "Dev Roadmap", url: "https://github.com/kamranahmedse/developer-roadmap", brand: "github" },
                { name: "System Design", url: "https://github.com/donnemartin/system-design-primer", brand: "github" },
                { name: "Interview Uni", url: "https://github.com/jwasham/coding-interview-university", brand: "github" },
                { name: "JS Algorithms", url: "https://github.com/trekhleb/javascript-algorithms", brand: "github" },
                { name: "30 Sec Code", url: "https://github.com/30-seconds/30-seconds-of-code", brand: "github" },
                { name: "Public APIs", url: "https://github.com/public-apis/public-apis", brand: "github" },
                { name: "Project Learn", url: "https://github.com/practical-tutorials/project-based-learning", brand: "github" },
                { name: "Build X", url: "https://github.com/codecrafters-io/build-your-own-x", brand: "github" },
                { name: "OSSU CS", url: "https://github.com/ossu/computer-science", brand: "github" },
                { name: "freeCodeCamp", url: "https://github.com/freeCodeCamp/freeCodeCamp", brand: "github" },
                { name: "Algo Python", url: "https://github.com/TheAlgorithms/Python", brand: "github" },
                { name: "Projects", url: "https://github.com/karan/Projects", brand: "github" },
                { name: "Realworld", url: "https://github.com/gothinkster/realworld", brand: "github" }
            ]
        },
        {
            id: 2,
            title: "Gate Smashers",
            desc: "Complete playlists for core computer science subjects.",
            icon: Layers,
            color: "blue",
            links: [
                { name: "DBMS", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGd7_9qz4h9j7x5Jr6c0H8L", brand: "youtube" },
                { name: "OS", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiE45o7z0h7z2eX0h0g1k6aF", brand: "youtube" },
                { name: "Networks", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiH6c0c6c5z5X8Y2p2w0n7mX", brand: "youtube" },
                { name: "TOC", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiF5p4Z2m4kz5n8z3h9k7p2A", brand: "youtube" },
                { name: "Compilers", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiH7c8Y8m9p3k5z1n7h6c0bP", brand: "youtube" },
                { name: "DSA", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiF5f7p3n6k8j2m4z9h1c0bA", brand: "youtube" },
                { name: "Algorithms", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiG8h7k9m6z3p2n4c5b1a0xZ", brand: "youtube" },
                { name: "Digi Logic", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiG0m2n3k4p5z6h7j8c9b1a", brand: "youtube" },
                { name: "Discrete Math", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiF3n2k5z7h8m4p1c0b9a6", brand: "youtube" },
                { name: "COA", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiE2k4n5m6z7p8h1c3b0a9", brand: "youtube" },
                { name: "AI", url: "https://www.youtube.com/@GateSmashers/playlists", brand: "youtube" },
                { name: "Soft Eng", url: "https://www.youtube.com/@GateSmashers/playlists", brand: "youtube" },
                { name: "Data Mining", url: "https://www.youtube.com/@GateSmashers/playlists", brand: "youtube" },
                { name: "Crypto", url: "https://www.youtube.com/@GateSmashers/playlists", brand: "youtube" },
                { name: "Microprocessors", url: "https://www.youtube.com/@GateSmashers/playlists", brand: "youtube" }
            ]
        },
        {
            id: 3,
            title: "Career Portals",
            desc: "Internships, Jobs & Simulations platforms.",
            icon: Cpu,
            color: "red",
            links: [
                { name: "LinkedIn", url: "https://www.linkedin.com/jobs", brand: "linkedin" },
                { name: "Internshala", url: "https://internshala.com", brand: "default" },
                { name: "Wellfound", url: "https://wellfound.com", brand: "default" },
                { name: "Forage", url: "https://theforage.com", brand: "default" },
                { name: "Naukri", url: "https://naukri.com", brand: "default" },
                { name: "Indeed", url: "https://indeed.com", brand: "default" },
                { name: "Glassdoor", url: "https://glassdoor.com", brand: "default" },
                { name: "Cutshort", url: "https://cutshort.io", brand: "default" },
                { name: "Hirist", url: "https://hirist.com", brand: "default" },
                { name: "AngelList", url: "https://angel.co/jobs", brand: "default" },
                { name: "Unstop", url: "https://unstop.com", brand: "default" },
                { name: "YC Jobs", url: "https://ycombinator.com/jobs", brand: "default" },
                { name: "RemoteOK", url: "https://remoteok.com", brand: "default" },
                { name: "WeWork", url: "https://weworkremotely.com", brand: "default" },
                { name: "Google Jobs", url: "https://jobs.google.com", brand: "google" }
            ]
        },
        {
            id: 4,
            title: "Certifications",
            desc: "Free and valuable certification platforms.",
            icon: Award,
            color: "yellow",
            links: [
                { name: "Coursera", url: "https://coursera.org", brand: "default" },
                { name: "edX", url: "https://edx.org", brand: "default" },
                { name: "SkillsBuild", url: "https://skillsbuild.org", brand: "default" },
                { name: "MS Learn", url: "https://learn.microsoft.com", brand: "microsoft" },
                { name: "Grow Google", url: "https://grow.google", brand: "google" },
                { name: "AWS Training", url: "https://aws.amazon.com/training", brand: "aws" },
                { name: "CloudSkills", url: "https://cloudskillsboost.google", brand: "google" },
                { name: "Alison", url: "https://alison.com", brand: "default" },
                { name: "Udemy", url: "https://udemy.com", brand: "default" },
                { name: "FutureLearn", url: "https://futurelearn.com", brand: "default" },
                { name: "SAP", url: "https://open.sap.com", brand: "default" },
                { name: "CognitiveClass", url: "https://cognitiveclass.ai", brand: "default" },
                { name: "Oracle", url: "https://oracle.com/education", brand: "default" },
                { name: "freeCodeCamp", url: "https://freecodecamp.org/certification", brand: "default" },
                { name: "Kaggle", url: "https://kaggle.com/learn", brand: "default" }
            ]
        },
        {
            id: 5,
            title: "Code Practice",
            desc: "Platforms and sheets for coding practice.",
            icon: Cpu,
            color: "emerald",
            links: [
                { name: "LeetCode", url: "https://leetcode.com", brand: "leetcode" },
                { name: "Codeforces", url: "https://codeforces.com", brand: "codeforces" },
                { name: "HackerRank", url: "https://hackerrank.com", brand: "hackerrank" },
                { name: "CodeChef", url: "https://codechef.com", brand: "default" },
                { name: "AtCoder", url: "https://atcoder.jp", brand: "default" },
                { name: "GFG", url: "https://geeksforgeeks.org", brand: "default" },
                { name: "InterviewBit", url: "https://interviewbit.com", brand: "default" },
                { name: "CodingNinjas", url: "https://codingninjas.com", brand: "default" },
                { name: "CSES", url: "https://cses.fi/problemset", brand: "default" },
                { name: "ProjectEuler", url: "https://projecteuler.net", brand: "default" },
                { name: "BinarySearch", url: "https://binarysearch.com", brand: "default" },
                { name: "Exercism", url: "https://exercism.org", brand: "default" },
                { name: "NeetCode", url: "https://neetcode.io", brand: "default" },
                { name: "TakeUForward", url: "https://takeuforward.org", brand: "default" },
                { name: "Striver Sheet", url: "https://striver-sde-sheet.vercel.app", brand: "default" }
            ]
        },
        {
            id: 6,
            title: "Playlists",
            desc: "Build-along project playlists from top creators.",
            icon: ScrollText,
            color: "orange",
            links: [
                { name: "freeCodeCamp", url: "https://www.youtube.com/@freecodecamp/playlists", brand: "youtube" },
                { name: "Traversy", url: "https://www.youtube.com/@TraversyMedia/playlists", brand: "youtube" },
                { name: "Harry", url: "https://www.youtube.com/@CodeWithHarry/playlists", brand: "youtube" },
                { name: "Mosh", url: "https://www.youtube.com/@ProgrammingWithMosh/playlists", brand: "youtube" },
                { name: "Academind", url: "https://www.youtube.com/@Academind/playlists", brand: "youtube" },
                { name: "NetNinja", url: "https://www.youtube.com/@NetNinja/playlists", brand: "youtube" },
                { name: "CleverProg", url: "https://www.youtube.com/@CleverProgrammer/playlists", brand: "youtube" },
                { name: "DevEd", url: "https://www.youtube.com/@DevEd/playlists", brand: "youtube" },
                { name: "JSMastery", url: "https://www.youtube.com/@JavaScriptMastery/playlists", brand: "youtube" },
                { name: "Fireship", url: "https://www.youtube.com/@Fireship/playlists", brand: "youtube" },
                { name: "Codevolution", url: "https://www.youtube.com/@Codevolution/playlists", brand: "youtube" },
                { name: "AniaKubow", url: "https://www.youtube.com/@AniaKubow/playlists", brand: "youtube" },
                { name: "SonnySangha", url: "https://www.youtube.com/@SonnySangha/playlists", brand: "youtube" },
                { name: "PedroTech", url: "https://www.youtube.com/@PedroTech/playlists", brand: "youtube" },
                { name: "WebDevSimp", url: "https://www.youtube.com/@WebDevSimplified/playlists", brand: "youtube" }
            ]
        },
        {
            id: 7,
            title: "Dev Tools",
            desc: "Essential tools and resources for developers.",
            icon: Layers,
            color: "teal",
            links: [
                { name: "VS Code", url: "https://code.visualstudio.com", brand: "default" },
                { name: "GitHub", url: "https://github.com", brand: "github" },
                { name: "Git", url: "https://git-scm.com", brand: "default" },
                { name: "Postman", url: "https://postman.com", brand: "default" },
                { name: "Figma", url: "https://figma.com", brand: "default" },
                { name: "Vercel", url: "https://vercel.com", brand: "default" },
                { name: "Netlify", url: "https://netlify.com", brand: "default" },
                { name: "Replit", url: "https://replit.com", brand: "default" },
                { name: "CodeSandbox", url: "https://codesandbox.io", brand: "default" },
                { name: "Docker", url: "https://docker.com", brand: "default" },
                { name: "NPM", url: "https://npmjs.com", brand: "default" },
                { name: "Yarn", url: "https://yarnpkg.com", brand: "default" },
                { name: "Hoppscotch", url: "https://hoppscotch.io", brand: "default" },
                { name: "Canva", url: "https://canva.com", brand: "default" },
                { name: "Notion", url: "https://notion.so", brand: "default" }
            ]
        },
        {
            id: 8,
            title: "Roadmaps",
            desc: "Structured learning paths from zero to pro.",
            icon: Map,
            color: "pink",
            links: [
                { name: "roadmap.sh", url: "https://roadmap.sh", brand: "default" },
                { name: "kamranahmedse", url: "https://github.com/kamranahmedse/developer-roadmap", brand: "github" },
                { name: "OSSU CS", url: "https://ossu.github.io/computer-science", brand: "github" },
                { name: "TeachCS", url: "https://teachyourselfcs.com", brand: "default" },
                { name: "FullStackOpen", url: "https://fullstackopen.com", brand: "default" },
                { name: "FrontendMasters", url: "https://frontendmasters.com/learn", brand: "default" },
                { name: "Scrimba", url: "https://scrimba.com/learn", brand: "default" },
                { name: "OdinProject", url: "https://theodinproject.com", brand: "default" },
                { name: "freeCodeCamp", url: "https://freecodecamp.org/learn", brand: "default" },
                { name: "MDN Web", url: "https://developer.mozilla.org/en-US/docs/Learn", brand: "default" },
                { name: "CS50", url: "https://cs50.harvard.edu", brand: "default" },
                { name: "fast.ai", url: "https://fast.ai", brand: "default" },
                { name: "D2L.ai", url: "https://d2l.ai", brand: "default" },
                { name: "Karpathy", url: "https://karpathy.ai/zero-to-hero.html", brand: "default" },
                { name: "Google Devs", url: "https://developers.google.com/learn", brand: "google" }
            ]
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card) => (
                <ExpandableCard 
                    key={card.id}
                    data={card}
                    isDark={isDark}
                    isHovered={hoveredId === card.id}
                    isBlurred={hoveredId !== null && hoveredId !== card.id}
                    onHover={() => setHoveredId(card.id)}
                    onLeave={() => setHoveredId(null)}
                />
            ))}
        </div>
    );
};

const ExpandableCard = ({ data, isDark, isHovered, isBlurred, onHover, onLeave }: any) => {
    const { title, desc, icon: Icon, links, color } = data;

    const theme: any = {
        red: { icon: "text-red-500", glow: "shadow-red-500/20 border-red-500/50" },
        emerald: { icon: "text-emerald-500", glow: "shadow-emerald-500/20 border-emerald-500/50" },
        purple: { icon: "text-violet-500", glow: "shadow-violet-500/20 border-violet-500/50" },
        yellow: { icon: "text-yellow-500", glow: "shadow-yellow-500/20 border-yellow-500/50" },
        blue: { icon: "text-blue-500", glow: "shadow-blue-500/20 border-blue-500/50" },
        orange: { icon: "text-orange-500", glow: "shadow-orange-500/20 border-orange-500/50" },
        teal: { icon: "text-teal-500", glow: "shadow-teal-500/20 border-teal-500/50" },
        pink: { icon: "text-pink-500", glow: "shadow-pink-500/20 border-pink-500/50" },
    };
    const t = theme[color];
    const bgClass = isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200 shadow-sm";

    return (
        <div 
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            className={`relative h-96 rounded-3xl border transition-all duration-500 cursor-default overflow-hidden flex flex-col
                ${bgClass}
                ${isBlurred ? "opacity-40 scale-95 blur-[2px]" : "opacity-100 scale-100 blur-0"}
                ${isHovered ? `scale-105 shadow-2xl z-20 ${t.glow}` : "z-0"}
            `}
        >
            <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 px-6 z-10 ${isHovered ? "-translate-y-32 opacity-0 pointer-events-none" : "translate-y-0 opacity-100"}`}>
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 ${isDark ? "bg-black border border-zinc-800" : "bg-zinc-100 border border-zinc-200"}`}>
                    <Icon size={40} className={t.icon} />
                </div>
                <h3 className={`text-xl font-black uppercase tracking-tight text-center ${isDark ? "text-white" : "text-zinc-900"} ${t.icon}`}>
                    {title}
                </h3>
            </div>

            <div className={`absolute inset-0 z-20 p-4 flex flex-col items-center justify-center text-center transition-all duration-500 transform 
                ${isHovered ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-20 opacity-0 pointer-events-none"}
            `}>
                <div className={`flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-widest ${t.icon}`}>
                    <Icon size={14} /> {title}
                </div>
                <p className={`text-[12px] leading-relaxed mb-4 ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
                    {desc}
                </p>
                
                <div className="flex flex-wrap justify-center gap-x-2 gap-y-3 relative z-30 pb-2 w-full px-2 max-h-48 overflow-y-auto custom-scrollbar">
                    {links.map((link: any, i: number) => (
                        <a 
                            key={i} 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all hover:scale-110 relative group/icon cursor-pointer shadow-md hover:z-50 shrink-0
                                ${isDark ? "bg-black border-zinc-700 text-white hover:bg-white hover:text-black" : "bg-white border-zinc-200 text-black hover:bg-black hover:text-white"}
                            `}
                        >
                            <BrandLogo brand={link.brand} />
                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-black text-white px-3 py-1.5 rounded opacity-0 group-hover/icon:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg z-50">
                                {link.name}
                            </span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

const BrandLogo = ({ brand }: { brand: string }) => {
    switch (brand) {
        case "leetcode": return <span className="font-black text-[10px] text-yellow-500">LC</span>;
        case "hackerrank": return <span className="font-black text-[10px] text-green-500">H</span>;
        case "codeforces": return <span className="font-black text-[10px] text-blue-500">CF</span>;
        case "github": return <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>;
        case "youtube": return <span className="font-black text-[10px] text-red-500">YT</span>;
        case "linkedin": return <span className="font-black text-[10px] text-blue-500">IN</span>;
        case "google": return <span className="font-black text-[12px]">G</span>;
        case "aws": return <span className="font-black text-[10px] tracking-tighter">AWS</span>;
        case "microsoft": return <span className="font-black text-[10px]">MS</span>;
        default: return <ExternalLink size={14} />;
    }
}