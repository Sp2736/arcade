"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation"; // NEW: For redirecting after login
import {
  Mail,
  Lock,
  User,
  IdCard,
  Building2,
  ChevronRight,
  ArrowRight,
  GraduationCap,
  KeyRound,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2, // NEW: For loading spinner
} from "lucide-react";

type AuthMode = "login" | "signup";

export default function AuthView() {
  const [mode, setMode] = useState<AuthMode>("login");

  return (
    <div className="w-full min-h-screen md:h-screen flex flex-col md:flex-row bg-transparent text-white font-sans relative z-30 overflow-y-auto md:overflow-hidden custom-scrollbar">
      
      {/* ================= BRANDING PANEL ================= */}
      <div className="flex w-full md:w-[45%] lg:w-[40%] min-h-[45vh] md:h-full bg-zinc-900/30 backdrop-blur-xl relative flex-col justify-between p-10 md:p-12 border-b md:border-b-0 md:border-r border-white/10 shrink-0">
        
        {/* Glow effect & Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-900/10 to-transparent z-0" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Branding Content */}
        <div className="relative z-10">
          <h2 className="text-xl font-black tracking-[0.2em] text-white mb-2 uppercase">
            A.R.C.A.D.E.
          </h2>
          <div className="h-1 w-12 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
        </div>

        <div className="relative z-10 mt-10 md:mt-0">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            Bridge the gap between <span className="text-blue-500">theory</span>{" "}
            and <span className="text-blue-500">reality</span>.
          </h1>
          <div className="flex items-center gap-3 text-zinc-400 text-sm">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-zinc-900" />
              <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-zinc-900" />
              <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-zinc-900" />
            </div>
            <span className="font-medium">Faculty Verified Ecosystem</span>
          </div>
        </div>

        <div className="relative z-10 text-[10px] text-zinc-500 font-mono mt-8 md:mt-0">
          © 2026 ARCADE SYSTEM // V1.0.4
        </div>
      </div>

      {/* ================= FORM PANEL ================= */}
      <div className="w-full md:w-[55%] lg:w-[60%] flex flex-col items-center justify-center p-6 sm:p-12 md:p-0 bg-[#050505] relative z-20">
        
        <div className="w-full max-w-md py-8">
          {/* Header */}
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
              {mode === "login" ? "User Login" : "Create Account"}
            </h2>
            <p className="text-zinc-400 text-sm">
              {mode === "login" ? "Enter your credentials to access." : "Fill details to register."}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex gap-8 mb-8 border-b border-white/10 justify-center md:justify-start">
            {(["login", "signup"] as AuthMode[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setMode(tab)}
                className={`pb-3 text-sm font-bold transition-all relative capitalize ${mode === tab ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                {tab === "login" ? "Login" : "Sign Up"}
                {mode === tab && (
                  <motion.div layoutId="tab-highlight" className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {mode === "login" ? <LoginForm key="login" /> : <SignupForm key="signup" />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// --- LOGIN FORM ---
function LoginForm() {
  const router = useRouter();
  
  // NEW: State variables to capture input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // NEW: API Submission Logic
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to login");

      // Save user to local storage for quick access in dashboards
      localStorage.setItem("arcade-user", JSON.stringify(data.user));

      // Redirect based on role fetched from DB
      if (data.user.role === 'faculty') {
        router.push('/dashboard/faculty');
      } else {
        router.push('/dashboard/student');
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
      onSubmit={handleLogin}
    >
      {/* NEW: Error Message Display */}
      {errorMsg && (
        <div className="text-red-500 text-xs font-bold bg-red-500/10 p-2 rounded border border-red-500/20">
          {errorMsg}
        </div>
      )}

      <InputGroup
        label="Email"
        icon={Mail}
        type="email"
        placeholder="Enter College Email"
        value={email}
        onChange={(e: any) => setEmail(e.target.value)}
        required
      />
      <InputGroup
        label="Password"
        icon={Lock}
        type="password"
        placeholder="Enter Password"
        isPassword
        value={password}
        onChange={(e: any) => setPassword(e.target.value)}
        required
      />

      <div className="flex items-center justify-between text-xs mt-1">
        <label className="flex items-center gap-2 text-zinc-400 cursor-pointer hover:text-zinc-300">
          <input
            type="checkbox"
            className="rounded border-zinc-700 bg-zinc-800 text-blue-500 focus:ring-0"
          />
          Remember me
        </label>
        <button type="button" className="text-blue-400 hover:text-blue-300 transition-colors">
          Forgot password?
        </button>
      </div>

      {/* NEW: Loading state on button */}
      <button 
        disabled={loading}
        className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:text-zinc-400 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 group mt-4"
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <>
            <span>Sign In</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </motion.form>
  );
}

// --- SIGNUP FORM ---
function SignupForm() {
  const router = useRouter();

  // NEW: State variables
  const [fullName, setFullName] = useState("");
  const [collegeId, setCollegeId] = useState("");
  const [email, setEmail] = useState("");
  const [personalEmail, setPersonalEmail] = useState("");
  const [dept, setDept] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // NEW: API Submission Logic
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, personalEmail, password, fullName, collegeId, department: dept, role, adminCode 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create account");

      alert("Account created successfully! Please log in.");
      window.location.reload(); // Refresh to switch to login view
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-3"
      onSubmit={handleSignup}
    >
      {/* NEW: Error Message Display */}
      {errorMsg && (
        <div className="text-red-500 text-xs font-bold bg-red-500/10 p-2 rounded border border-red-500/20">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <InputGroup label="Full Name" icon={User} type="text" placeholder="Enter Name" value={fullName} onChange={(e: any) => setFullName(e.target.value)} required />
        <InputGroup label="College ID" icon={IdCard} type="text" placeholder="Official ID" value={collegeId} onChange={(e: any) => setCollegeId(e.target.value)} required />
      </div>

      <InputGroup label="College Email" icon={Mail} type="email" placeholder="Official Email" value={email} onChange={(e: any) => setEmail(e.target.value)} required />
      <InputGroup label="Personal Email" icon={Mail} type="email" placeholder="Backup Email" value={personalEmail} onChange={(e: any) => setPersonalEmail(e.target.value)} />

      <div className="grid grid-cols-2 gap-3">
        <SelectGroup label="Department" icon={Building2} value={dept} onChange={(e: any) => setDept(e.target.value)} required>
          <option value="" disabled>Select Dept</option>
          <option value="Computer Engineering">Computer Engineering</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Information Technology">Information Technology</option>
        </SelectGroup>

        <SelectGroup label="Role" icon={GraduationCap} value={role} onChange={(e: any) => setRole(e.target.value)} required>
          <option value="" disabled>Select Role</option>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
        </SelectGroup>
      </div>

      <AnimatePresence>
        {role === "faculty" && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 12 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden bg-orange-500/10 border border-orange-500/20 rounded-lg p-2"
          >
            <InputGroup
              label="Verification Code"
              icon={KeyRound}
              type="password"
              placeholder="Admin Code"
              value={adminCode}
              onChange={(e: any) => setAdminCode(e.target.value)}
              noMargin
              required={role === "faculty"}
            />
            <div className="flex items-center gap-1.5 mt-1 text-[10px] text-orange-400">
              <AlertCircle size={10} />
              <span>Authorization required.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <InputGroup label="Password" icon={Lock} type="password" placeholder="Create Password" isPassword value={password} onChange={(e: any) => setPassword(e.target.value)} required />

      {/* NEW: Loading state on button */}
      <button 
        disabled={loading}
        className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:text-zinc-400 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 group mt-3"
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <>
            <span>Create Account</span>
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </motion.form>
  );
}

// --- UI COMPONENTS ---

// NEW: Added value, onChange, and required props
const InputGroup = ({ label, icon: Icon, type, placeholder, isPassword, noMargin, value, onChange, required }: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={noMargin ? "" : "space-y-1"}>
      <label className="text-xs font-medium text-zinc-400 ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors pointer-events-none">
          <Icon size={16} />
        </div>
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 pl-10 pr-10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};

// NEW: Added required prop
const SelectGroup = ({ label, icon: Icon, children, onChange, value, required }: any) => (
  <div className="space-y-1">
    <label className="text-xs font-medium text-zinc-400 ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors pointer-events-none">
        <Icon size={16} />
      </div>
      <select
        value={value}
        onChange={onChange}
        required={required}
        className="w-full appearance-none bg-zinc-900 border border-zinc-800 rounded-lg py-2 pl-10 pr-8 text-sm text-zinc-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all cursor-pointer"
      >
        {children}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600">
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1 1L5 5L9 1" />
        </svg>
      </div>
    </div>
  </div>
);