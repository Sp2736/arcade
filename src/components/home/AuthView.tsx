"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";

type AuthMode = "login" | "signup";

export default function AuthView() {
  const [mode, setMode] = useState<AuthMode>("login");

  return (
    /**
     * MOBILE EDIT: Added 'flex-col' and 'overflow-y-auto'. 
     * DESKTOP PRESERVED: 'md:flex-row' and 'md:h-screen' keep your original layout.
     */
    <div className="w-full min-h-screen md:h-screen flex flex-col md:flex-row bg-transparent text-white font-sans relative z-30 overflow-y-auto md:overflow-hidden custom-scrollbar">
      
      {/* ================= BRANDING PANEL ================= 
          MOBILE: Now visible ('flex'). Sized to min-h-[40vh] to act as a horizontal header.
          DESKTOP: Original 'md:w-[45%]' and 'md:h-full' preserved.
      */}
      <div className="flex w-full md:w-[45%] lg:w-[40%] min-h-[45vh] md:h-full bg-zinc-900/30 backdrop-blur-xl relative flex-col justify-between p-10 md:p-12 border-b md:border-b-0 md:border-r border-white/10 shrink-0">
        
        {/* Glow effect & Gradients (Original Styles) */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-900/10 to-transparent z-0" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Branding Content (Original Content) */}
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

      {/* ================= FORM PANEL ================= 
          MOBILE: Centered below the header.
          DESKTOP: Original split layout maintained.
      */}
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
// fixed the small screen branding panel

// --- LOGIN FORM ---
function LoginForm() {
  return (
    <motion.form
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
      onSubmit={(e) => e.preventDefault()}
    >
      <InputGroup
        label="Email"
        icon={Mail}
        type="email"
        placeholder="Enter College Email"
      />
      <InputGroup
        label="Password"
        icon={Lock}
        type="password"
        placeholder="Enter Password"
        isPassword
      />

      <div className="flex items-center justify-between text-xs mt-1">
        <label className="flex items-center gap-2 text-zinc-400 cursor-pointer hover:text-zinc-300">
          <input
            type="checkbox"
            className="rounded border-zinc-700 bg-zinc-800 text-blue-500 focus:ring-0"
          />
          Remember me
        </label>
        <button className="text-blue-400 hover:text-blue-300 transition-colors">
          Forgot password?
        </button>
      </div>

      <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 group mt-4">
        <span>Sign In</span>
        <ArrowRight
          size={18}
          className="group-hover:translate-x-1 transition-transform"
        />
      </button>
    </motion.form>
  );
}

// --- SIGNUP FORM ---
function SignupForm() {
  const [role, setRole] = useState("");
  const [dept, setDept] = useState("");

  return (
    <motion.form
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-3"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="grid grid-cols-2 gap-3">
        <InputGroup
          label="Full Name"
          icon={User}
          type="text"
          placeholder="Enter Name"
        />
        <InputGroup
          label="College ID"
          icon={IdCard}
          type="text"
          placeholder="Official ID"
        />
      </div>

      <InputGroup
        label="College Email"
        icon={Mail}
        type="email"
        placeholder="Official Email"
      />
      <InputGroup
        label="Personal Email"
        icon={Mail}
        type="email"
        placeholder="Backup Email"
      />

      <div className="grid grid-cols-2 gap-3">
        {/* FIXED: Added value and onChange to Department */}
        <SelectGroup
          label="Department"
          icon={Building2}
          value={dept}
          onChange={(e: any) => setDept(e.target.value)}
        >
          <option value="" disabled>
            Select Dept
          </option>
          <option value="CS">CSE</option>
          <option value="CE">CE</option>
          <option value="IT">IT</option>
        </SelectGroup>

        {/* ROLE (Already looked okay, but kept consistent) */}
        <SelectGroup
          label="Role"
          icon={GraduationCap}
          value={role}
          onChange={(e: any) => setRole(e.target.value)}
        >
          <option value="" disabled>
            Select Role
          </option>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
        </SelectGroup>
      </div>

      {/* Logic for Faculty Code */}
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
              noMargin
            />
            <div className="flex items-center gap-1.5 mt-1 text-[10px] text-orange-400">
              <AlertCircle size={10} />
              <span>Authorization required.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <InputGroup
        label="Password"
        icon={Lock}
        type="password"
        placeholder="Create Password"
        isPassword
      />

      <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 group mt-3">
        <span>Create Account</span>
        <ChevronRight
          size={18}
          className="group-hover:translate-x-1 transition-transform"
        />
      </button>
    </motion.form>
  );
}

// --- UI COMPONENTS ---

const InputGroup = ({
  label,
  icon: Icon,
  type,
  placeholder,
  isPassword,
  noMargin,
}: any) => {
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

const SelectGroup = ({ label, icon: Icon, children, onChange, value }: any) => (
  <div className="space-y-1">
    <label className="text-xs font-medium text-zinc-400 ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors pointer-events-none">
        <Icon size={16} />
      </div>
      <select
        value={value}
        onChange={onChange}
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
