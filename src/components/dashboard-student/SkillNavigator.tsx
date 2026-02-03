"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, ChevronRight, Check, X, 
  TrendingUp, DollarSign, ArrowRight, RefreshCw, Zap, BookOpen, ThumbsUp, ThumbsDown, FastForward, Globe, Briefcase, Building
} from "lucide-react";

interface SkillNavigatorProps {
  isDark: boolean;
}

// ... [SURVEY_QUESTIONS array remains the same] ...
const SURVEY_QUESTIONS = [
  { id: 1, text: "I care deeply about pixel-perfect designs and UI aesthetics.", role: "Frontend Developer" },
  { id: 2, text: "I enjoy optimizing website load speeds and animation smoothness.", role: "Frontend Developer" },
  { id: 3, text: "Ensuring an app works on all screen sizes (mobile/desktop) is satisfying.", role: "Frontend Developer" },
  { id: 4, text: "I prefer working with visual components over database queries.", role: "Frontend Developer" },
  { id: 5, text: "I get excited about new CSS features and layout techniques.", role: "Frontend Developer" },
  { id: 6, text: "I prefer logic and data processing over making things look pretty.", role: "Backend Developer" },
  { id: 7, text: "I enjoy designing efficient database schemas and relationships.", role: "Backend Developer" },
  { id: 8, text: "Security, authentication, and API protection interest me.", role: "Backend Developer" },
  { id: 9, text: "I like optimizing server response times and handling high traffic.", role: "Backend Developer" },
  { id: 10, text: "Debugging a complex logic error is more rewarding than fixing a layout bug.", role: "Backend Developer" },
  { id: 11, text: "I love finding hidden patterns in large, messy datasets.", role: "Data Scientist" },
  { id: 12, text: "I am comfortable with statistics, probability, and math.", role: "Data Scientist" },
  { id: 13, text: "Predicting future trends using historical data fascinates me.", role: "Data Scientist" },
  { id: 14, text: "I enjoy creating visualizations (charts/graphs) to explain data.", role: "Data Scientist" },
  { id: 15, text: "Building models that 'learn' from data is exciting.", role: "Data Scientist" },
  { id: 16, text: "I hate doing the same task twice; I'd rather automate it.", role: "DevOps Engineer" },
  { id: 17, text: "I am interested in how code gets from a laptop to a production server.", role: "DevOps Engineer" },
  { id: 18, text: "Managing cloud infrastructure (AWS/Azure) sounds cool.", role: "DevOps Engineer" },
  { id: 19, text: "I care about system uptime, reliability, and monitoring logs.", role: "DevOps Engineer" },
  { id: 20, text: "Containerization (Docker) and orchestration (Kubernetes) interest me.", role: "DevOps Engineer" },
  { id: 21, text: "I want to own a feature from the database all the way to the UI.", role: "Full Stack Developer" },
  { id: 22, text: "I get bored doing just one thing; I like context switching.", role: "Full Stack Developer" },
  { id: 23, text: "I want to be able to build a complete product (MVP) by myself.", role: "Full Stack Developer" },
  { id: 24, text: "Understanding how the client and server communicate is key for me.", role: "Full Stack Developer" },
  { id: 25, text: "I am comfortable jumping between SQL queries and React components.", role: "Full Stack Developer" },
];

const TECH_CATEGORIES = {
  "Languages": ["JavaScript", "Python", "Java", "C++", "Go", "Rust"],
  "Frontend": ["React", "Vue", "Tailwind", "Next.js", "Figma"],
  "Backend": ["Node.js", "Django", "PostgreSQL", "MongoDB", "Redis"],
  "DevOps": ["Docker", "Kubernetes", "AWS", "Linux", "Git"]
};

const CAREER_RESULTS: any = {
  "Frontend Developer": {
    desc: "The Architect of User Experience. You blend logic with aesthetics to build the face of the web.",
    salary: "₹15k - ₹40k / mo", 
    demand: "High 🔥",
    country: "USA / India / Remote",
    recruiters: "Vercel, Adobe, Airbnb",
    missing: ["TypeScript", "Unit Testing"],
    loadout: [{ type: "Book", title: "Refactoring UI", author: "Adam Wathan" }, { type: "Course", title: "Epic React", author: "Kent C. Dodds" }]
  },
  "Backend Developer": {
    desc: "The Engine Room Commander. You build the invisible logic that powers the modern world.",
    salary: "₹18k - ₹45k / mo", 
    demand: "Very High 🔥",
    country: "Germany / UK / India",
    recruiters: "Amazon, Uber, Netflix",
    missing: ["System Design", "Redis"],
    loadout: [{ type: "Book", title: "Designing Data-Intensive Apps", author: "Martin Kleppmann" }, { type: "Video", title: "Backend Eng. Guide", author: "Hussein Nasser" }]
  },
  "Data Scientist": {
    desc: "The Oracle. You turn raw noise into actionable wisdom and predict the future.",
    salary: "₹25k - ₹60k / mo", 
    demand: "High 🔥",
    country: "USA / Canada / Singapore",
    recruiters: "Google AI, OpenAI, IBM",
    missing: ["TensorFlow", "Advanced Stats"],
    loadout: [{ type: "Book", title: "100-Page ML Book", author: "Andriy Burkov" }, { type: "Course", title: "Fast.ai", author: "Jeremy Howard" }]
  },
  "DevOps Engineer": {
    desc: "The Infrastructure Architect. You ensure the code lives, breathes, and scales globally.",
    salary: "₹20k - ₹50k / mo", 
    demand: "Explosive 🚀",
    country: "Remote / Europe",
    recruiters: "GitLab, HashiCorp, AWS",
    missing: ["Terraform", "CI/CD Patterns"],
    loadout: [{ type: "Book", title: "The Phoenix Project", author: "Gene Kim" }, { type: "Video", title: "Docker Mastery", author: "Bret Fisher" }]
  },
  "Full Stack Developer": {
    desc: "The Swiss Army Knife. You can build a complete product from scratch, end-to-end.",
    salary: "₹20k - ₹50k / mo", 
    demand: "Explosive 🚀",
    country: "Global / Remote",
    recruiters: "Startups, Meta, YCombinator",
    missing: ["Docker", "GraphQL"],
    loadout: [{ type: "Book", title: "Clean Code", author: "Robert C. Martin" }, { type: "Repo", title: "FullStackOpen", author: "University of Helsinki" }]
  }
};

export default function SkillNavigator({ isDark }: SkillNavigatorProps) {
  const [step, setStep] = useState<"intro" | "tech" | "survey" | "processing" | "results">("intro");
  const [selectedSkills, setSelectedSkills] = useState<Record<string, number>>({});
  const [surveyScores, setSurveyScores] = useState<Record<string, number>>({});
  const [topRoles, setTopRoles] = useState<string[]>([]);

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => {
      const current = prev[skill] || 0;
      const next = current === 3 ? 0 : current + 1;
      if (next === 0) { const { [skill]: _, ...rest } = prev; return rest; }
      return { ...prev, [skill]: next };
    });
  };

  const handleSurveyVote = (role: string, liked: boolean) => {
    if (liked) {
      setSurveyScores(prev => ({ ...prev, [role]: (prev[role] || 0) + 1 }));
    }
  };

  const calculateResult = () => {
    setStep("processing");
    const scores = Object.entries(surveyScores).sort((a, b) => b[1] - a[1]);
    let distinctRoles = scores.map(s => s[0]);
    const allRoles = Object.keys(CAREER_RESULTS);
    allRoles.forEach(r => {
        if (!distinctRoles.includes(r)) distinctRoles.push(r);
    });
    const top3 = distinctRoles.slice(0, 3);
    setTopRoles(top3);
    setTimeout(() => {
        setStep("results");
    }, 2500);
  };

  // UPDATED CARD BG: More distinct in Dark Mode
  const cardBg = isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200 shadow-sm";

  return (
    <div className={`h-full flex flex-col relative overflow-hidden rounded-3xl border transition-all duration-500 ${cardBg}`}>
      {step !== "intro" && step !== "results" && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-800 z-20">
            <motion.div 
                className="h-full bg-blue-500"
                initial={{ width: "0%" }}
                animate={{ width: step === "tech" ? "33%" : step === "survey" ? "66%" : "100%" }}
            />
        </div>
      )}

      <div className="flex-1 flex flex-col p-6 md:p-10 relative z-10 min-h-0">
        <AnimatePresence mode="wait">
            {step === "intro" && <IntroView key="intro" isDark={isDark} onStart={() => setStep("tech")} onSkip={calculateResult} />}
            {step === "tech" && <TechStackView key="tech" isDark={isDark} selectedSkills={selectedSkills} onToggle={handleSkillToggle} onNext={() => setStep("survey")} />}
            {step === "survey" && <VibeCheckView key="survey" isDark={isDark} onVote={handleSurveyVote} onFinish={calculateResult} />}
            {step === "processing" && <ProcessingView key="processing" isDark={isDark} />}
            {step === "results" && <ResultsView key="results" isDark={isDark} roles={topRoles} onReset={() => { setStep("intro"); setSurveyScores({}); }} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

const IntroView = ({ isDark, onStart, onSkip }: any) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center justify-center h-full text-center space-y-6">
        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-4 ${isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"}`}><Cpu size={40} /></div>
        <div><h2 className={`text-3xl md:text-4xl font-black uppercase tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>Career Engine</h2><p className={`mt-2 max-w-md mx-auto ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Don't know where to start? We'll analyze your skills, interests, and personality to build your perfect loadout.</p></div>
        <div className="flex flex-col gap-4">
            <button onClick={onStart} className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(37,99,235,0.3)]"><span className="flex items-center gap-2">Initialize System <ChevronRight /></span></button>
            <button onClick={onSkip} className="text-xs font-mono text-zinc-500 hover:text-zinc-300 flex items-center gap-1"><FastForward size={12} /> DEV SKIP: Results</button>
        </div>
    </motion.div>
);

const TechStackView = ({ isDark, selectedSkills, onToggle, onNext }: any) => (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="h-full flex flex-col">
        <div className="mb-6"><h3 className={`text-2xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>Step 1: The Arsenal</h3><p className="text-zinc-500 text-sm">Click repeatedly to set proficiency: <span className="text-blue-400">Novice</span> → <span className="text-purple-400">Competent</span> → <span className="text-orange-400">Pro</span>.</p></div>
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pr-2">
            {Object.entries(TECH_CATEGORIES).map(([category, techs]: any) => (
                <div key={category}><h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">{category}</h4><div className="flex flex-wrap gap-2">{techs.map((tech: string) => {
                    const level = selectedSkills[tech] || 0;
                    const levelColors = [isDark ? "bg-zinc-800 border-zinc-700 text-zinc-500" : "bg-zinc-100 border-zinc-200 text-zinc-600", "bg-blue-500/10 border-blue-500 text-blue-500", "bg-purple-500/10 border-purple-500 text-purple-500", "bg-orange-500/10 border-orange-500 text-orange-500"];
                    const levelLabels = ["", "Lvl 1", "Lvl 2", "MAX"];
                    return <button key={tech} onClick={() => onToggle(tech)} className={`px-4 py-2 rounded-lg border text-sm font-bold transition-all flex items-center gap-2 ${levelColors[level]}`}>{tech}{level > 0 && <span className="text-[9px] uppercase opacity-70 bg-black/10 px-1 rounded">{levelLabels[level]}</span>}</button>;
                })}</div></div>
            ))}
        </div>
        <div className="pt-6 border-t border-dashed border-zinc-700/50 flex justify-end"><button onClick={onNext} className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors flex items-center gap-2">Next Phase <ArrowRight size={16} /></button></div>
    </motion.div>
);

const VibeCheckView = ({ isDark, onVote, onFinish }: any) => {
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState(0); 

    const handleAction = (liked: boolean) => {
        setDirection(liked ? 1 : -1);
        onVote(SURVEY_QUESTIONS[index].role, liked);
        setTimeout(() => {
            if (index < SURVEY_QUESTIONS.length - 1) {
                setIndex(index + 1);
                setDirection(0);
            } else {
                onFinish();
            }
        }, 400); 
    };

    const question = SURVEY_QUESTIONS[index];
    const progress = ((index + 1) / SURVEY_QUESTIONS.length) * 100;

    return (
        <div className="h-full flex flex-col items-center justify-center max-w-lg mx-auto w-full relative">
            <div className="text-center mb-8 w-full">
                <h3 className={`text-2xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>Step 2: Vibe Check</h3>
                <p className="text-zinc-500 text-sm mb-4">Question {index + 1} of {SURVEY_QUESTIONS.length}</p>
                <div className="h-1 bg-zinc-800 rounded-full w-full max-w-xs mx-auto overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
            </div>

            <div className="relative w-full aspect-[16/10] min-h-[250px]">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={question.id}
                        initial={{ scale: 0.9, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0, x: 0, rotate: 0, backgroundColor: isDark ? "#27272a" : "#ffffff" }}
                        exit={{ 
                            x: direction * 800, 
                            rotate: direction * 25, 
                            opacity: 0,
                            backgroundColor: direction === 1 ? "#22c55e" : "#ef4444" 
                        }}
                        transition={{ duration: 0.3 }}
                        className={`absolute inset-0 rounded-3xl p-8 flex flex-col items-center justify-center text-center border shadow-2xl z-20 ${isDark ? "border-zinc-700" : "border-zinc-200"}`}
                    >
                        <p className={`text-xl md:text-2xl font-bold leading-relaxed ${isDark ? "text-white" : "text-zinc-900"}`}>
                            "{question.text}"
                        </p>
                    </motion.div>
                </AnimatePresence>
                <div className={`absolute top-4 inset-x-4 bottom-[-16px] rounded-3xl z-10 opacity-30 ${isDark ? "bg-zinc-800" : "bg-zinc-200"}`} />
            </div>

            <div className="flex gap-12 mt-12">
                <button onClick={() => handleAction(false)} className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-lg hover:shadow-red-500/30 scale-100 hover:scale-110"><ThumbsDown size={32} fill="currentColor" /></button>
                <button onClick={() => handleAction(true)} className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 text-green-500 flex items-center justify-center hover:bg-green-500 hover:text-white hover:border-green-500 transition-all shadow-lg hover:shadow-green-500/30 scale-100 hover:scale-110"><ThumbsUp size={32} fill="currentColor" /></button>
            </div>
        </div>
    );
};

const ProcessingView = ({ isDark }: any) => (
    <motion.div className="h-full flex flex-col items-center justify-center font-mono text-center">
        <div className={`w-20 h-20 mb-6 flex items-center justify-center rounded-2xl ${isDark ? "bg-zinc-900" : "bg-zinc-100"}`}><RefreshCw size={40} className="animate-spin text-blue-500" /></div>
        <h3 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-black"}`}>ANALYZING VECTOR SPACE...</h3>
        <div className="text-xs text-zinc-500 space-y-1"><p>Compiling Proficiency Matrix...</p><p>Cross-referencing Market Demand...</p><p>Optimizing for Maximum Salary...</p></div>
    </motion.div>
);

const ResultsView = ({ isDark, roles, onReset }: any) => {
    const mainRole = roles[0];
    const data = CAREER_RESULTS[mainRole] || CAREER_RESULTS["Full Stack Developer"];
    const secondaryRoles = roles.slice(1, 3);

    return (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
            className="h-full flex flex-col overflow-y-auto custom-scrollbar pr-2 pb-24"
        >
            <div className="text-center mb-8">
                <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-black tracking-widest uppercase mb-4">Top Match Identified</div>
                <h2 className={`text-4xl md:text-6xl font-black uppercase leading-none mb-4 ${isDark ? "text-white" : "text-zinc-900"}`}>{mainRole}</h2>
                <p className={`max-w-xl mx-auto text-sm ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>{data.desc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard icon={DollarSign} label="Avg. Intern Stipend" value={data.salary} color="text-green-500" isDark={isDark} />
                <StatCard icon={TrendingUp} label="Market Demand" value={data.demand} color="text-orange-500" isDark={isDark} />
                <StatCard icon={Globe} label="Top Locations" value={data.country} color="text-blue-500" isDark={isDark} />
                <StatCard icon={Building} label="Top Recruiters" value={data.recruiters} color="text-purple-500" isDark={isDark} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                <div className={`p-6 rounded-2xl border ${isDark ? "bg-zinc-800/30 border-white/5" : "bg-white border-zinc-200"}`}>
                    <h4 className={`text-sm font-bold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-zinc-900"}`}>
                        <Zap size={16} className="text-yellow-500" /> Critical Gaps (Main Path)
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {data.missing.map((m: string) => (
                            <span key={m} className={`px-3 py-1.5 rounded text-xs font-bold border ${isDark ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-red-50 border-red-200 text-red-600"}`}>{m}</span>
                        ))}
                    </div>
                    <p className="text-xs text-zinc-500">Mastering these will make you job-ready.</p>
                </div>

                <div className={`p-6 rounded-2xl border ${isDark ? "bg-zinc-800/30 border-white/5" : "bg-white border-zinc-200"}`}>
                    <h4 className={`text-sm font-bold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-zinc-900"}`}>
                        <BookOpen size={16} className="text-blue-500" /> Recommended Starter
                    </h4>
                    <div className="space-y-3">
                        {data.loadout.map((item: any, i: number) => (
                            <div key={i} className="flex justify-between items-center text-sm">
                                <span className={isDark ? "text-zinc-300" : "text-zinc-700"}>{item.title}</span>
                                <span className="text-xs text-zinc-500 border px-2 py-0.5 rounded">{item.type}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-zinc-900"}`}>
                    <RefreshCw size={18} className="text-zinc-500" /> Other Viable Paths
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {secondaryRoles.map((role: string) => {
                        const altData = CAREER_RESULTS[role] || CAREER_RESULTS["Full Stack Developer"];
                        return (
                            <div key={role} className={`p-5 rounded-2xl border transition-all hover:border-zinc-500/50 ${isDark ? "bg-zinc-900/50 border-white/5" : "bg-white border-zinc-200"}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className={`text-lg font-black uppercase ${isDark ? "text-zinc-300" : "text-zinc-800"}`}>{role}</h4>
                                    <span className="text-xs font-bold bg-green-500/10 text-green-500 px-2 py-1 rounded">{altData.salary}</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {altData.missing.map((m: string) => (
                                        <span key={m} className={`px-2 py-1 rounded text-[10px] font-bold border ${isDark ? "bg-zinc-800 border-zinc-700 text-zinc-400" : "bg-white border-zinc-300 text-zinc-600"}`}>
                                            Missing: {m}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-auto flex gap-4">
                {/* --- FIXED: RESTART BUTTON --- */}
                <button 
                    onClick={onReset} 
                    className={`px-6 py-3 rounded-xl font-bold transition-colors border ${
                        isDark 
                            ? "bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800" 
                            : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-200"
                    }`}
                >
                    Restart Analysis
                </button>
                <button className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20">
                    Set "{mainRole}" as Goal
                </button>
            </div>
        </motion.div>
    );
};

const StatCard = ({ icon: Icon, label, value, color, isDark }: any) => (
    <div className={`p-4 rounded-2xl border ${isDark ? "bg-zinc-800/50 border-white/5" : "bg-white border-zinc-200"}`}>
        <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase mb-2">
            <Icon size={14} /> {label}
        </div>
        <div className={`text-sm font-bold truncate ${color}`}>{value}</div>
    </div>
);