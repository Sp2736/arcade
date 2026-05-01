"use client";

import React, { useState } from 'react';

// --- DATA DEFINITIONS ---

const QUESTIONS = [
  {
    id: 1,
    text: "You are given a box of 1,000 mixed, unlabeled puzzle pieces. What is your very first physical action?",
    options: [
      { text: "Sort them strictly by color and edge type before assembling anything.", scores: { SYS: 2, QNT: 1, OPS: 0, PROD: 0, RND: 0 } },
      { text: "Find a recognizable focal point and build outward organically.", scores: { SYS: 0, QNT: 0, OPS: 0, PROD: 2, RND: 1 } }
    ]
  },
  {
    id: 2,
    text: "You manage a supply chain with 100 units of energy. Do you:",
    options: [
      { text: "Invest 90 units into a hyper-efficient system that guarantees a 110-unit return.", scores: { SYS: 1, QNT: 2, OPS: 1, PROD: 0, RND: 0 } },
      { text: "Invest 10 units into 10 high-risk, unproven systems that could yield a 500-unit return.", scores: { SYS: 0, QNT: 0, OPS: 0, PROD: 1, RND: 2 } }
    ]
  },
  {
    id: 3,
    text: "A critical machine in your facility stops working. Where does your mind go first?",
    options: [
      { text: "The blueprint: 'Was this system designed with a fundamental flaw?'", scores: { SYS: 2, QNT: 0, OPS: 0, PROD: 0, RND: 1 } },
      { text: "The output logs: 'What do the error metrics tell me?'", scores: { SYS: 0, QNT: 2, OPS: 1, PROD: 0, RND: 0 } }
    ]
  },
  {
    id: 4,
    text: "You are tasked with navigating a dark, unmapped maze. What is your strategy?",
    options: [
      { text: "Keep your right hand on the wall and walk continuously to map the perimeter.", scores: { SYS: 2, QNT: 0, OPS: 1, PROD: 0, RND: 0 } },
      { text: "Move quickly toward the center, adjusting direction based on intuition and dead ends.", scores: { SYS: 0, QNT: 0, OPS: 0, PROD: 2, RND: 1 } }
    ]
  },
  {
    id: 5,
    text: "Which scenario causes you more personal frustration?",
    options: [
      { text: "Building a perfect, flawless tool that only 10 people ever use.", scores: { SYS: 1, QNT: 0, OPS: 0, PROD: 0, RND: 2 } },
      { text: "Building a massive tool used by 10 million people, but it has persistent, annoying bugs.", scores: { SYS: 0, QNT: 0, OPS: 1, PROD: 2, RND: 0 } }
    ]
  },
  {
    id: 6,
    text: "Two departments are deadlocked over a project requirement. How do you break the tie?",
    options: [
      { text: "Redefine the parameters and force a logistical compromise so both teams can move forward immediately.", scores: { SYS: 0, QNT: 0, OPS: 2, PROD: 1, RND: 0 } },
      { text: "Dig into the technical limitations of both sides to find a third, previously unseen engineering solution.", scores: { SYS: 1, QNT: 0, OPS: 0, PROD: 0, RND: 2 } }
    ]
  },
  {
    id: 7,
    text: "How long are you willing to work in the dark before seeing a measurable result?",
    options: [
      { text: "I need to see the mechanism working (or failing) by the end of the day to stay engaged.", scores: { SYS: 0, QNT: 0, OPS: 1, PROD: 2, RND: 0 } },
      { text: "I am entirely comfortable architecting a foundation for 6 months before pushing the first button.", scores: { SYS: 2, QNT: 1, OPS: 0, PROD: 0, RND: 0 } }
    ]
  },
  {
    id: 8,
    text: "You have to teach someone a complex task. Do you:",
    options: [
      { text: "Write a highly detailed, step-by-step manual that leaves no room for interpretation.", scores: { SYS: 1, QNT: 0, OPS: 2, PROD: 0, RND: 0 } },
      { text: "Teach them the core principles and let them figure out their own localized steps.", scores: { SYS: 0, QNT: 0, OPS: 0, PROD: 1, RND: 2 } }
    ]
  },
  {
    id: 9,
    text: "You are given a project that requires 3 distinct skills. You possess 2 of them. Do you:",
    options: [
      { text: "Spend 3 weeks aggressively learning the 3rd skill so you can control the whole stack.", scores: { SYS: 0, QNT: 1, OPS: 0, PROD: 0, RND: 2 } },
      { text: "Immediately delegate the 3rd skill to someone else, even if they aren't perfect at it, to maintain velocity.", scores: { SYS: 0, QNT: 0, OPS: 2, PROD: 1, RND: 0 } }
    ]
  },
  {
    id: 10,
    text: "Your workspace (physical or digital) inevitably gets cluttered over time. How do you handle it?",
    options: [
      { text: "I have strict micro-routines to clean and organize at the end of every single day.", scores: { SYS: 2, QNT: 0, OPS: 1, PROD: 0, RND: 0 } },
      { text: "I let the chaos build organically until it actively impedes my speed, then do a massive purge.", scores: { SYS: 0, QNT: 0, OPS: 0, PROD: 1, RND: 2 } }
    ]
  }
];

const DOMAINS: Record<string, any> = {
  SYS: {
    title: "Systems Architecture / Cloud Infrastructure",
    whyFit: "You scored exceptionally high in delayed feedback loops and systemic redundancy. You prefer mapping perimeters over blind execution, making you highly suited for backend infrastructure where structural integrity is paramount.",
    logic: "Moving beyond basic coding, this role now requires deep expertise in distributed systems, Kubernetes orchestration, and predictive scaling.",
    automation: "Heavy reliance on AI-driven deployment pipelines; you must manage the bots that manage the servers.",
    market: "High demand, low volatility. Companies are paying premiums for architects who can minimize cloud costs through ruthless optimization."
  },
  OPS: {
    title: "Product Operations & Logistics (ProductOps)",
    whyFit: "Your answers indicate a strong preference for resolving friction through process and delegating for velocity. You are a natural bottleneck-remover who thrives on structured execution.",
    logic: "ProductOps is now the nervous system of tech companies. You bridge the gap between engineering reality and go-to-market strategy.",
    automation: "Requires high fluency in querying databases (SQL/NoSQL) and building real-time telemetry dashboards to track feature health.",
    market: "The fastest-growing non-coding role in tech. Requires high EQ combined with ruthless logistical efficiency."
  },
  QNT: {
    title: "Quantitative Data Analysis",
    whyFit: "You consistently chose output logs over blueprints and prefer optimized, guaranteed returns. You trust numbers over narratives and possess a highly analytical baseline.",
    logic: "Pure data science has become heavily automated. The modern Quant Analyst focuses on framing the right mathematical questions and validating AI-generated models against real-world entropy.",
    automation: "Python, R, and mastery of integrating proprietary LLMs into data pipelines to parse unstructured data at scale.",
    market: "Highly lucrative, but incredibly competitive. Success requires not just math, but the ability to translate raw logic into immediate business strategy."
  },
  PROD: {
    title: "Consumer Product / UX Engineering",
    whyFit: "You lean towards organic building, quick iteration, and wide impact. You are comfortable navigating ambiguity based on intuition rather than strict perimeter mapping.",
    logic: "Focus is on hyper-optimized user journeys and micro-interactions. The code must serve human psychology seamlessly.",
    automation: "Utilizing AI for A/B testing variations and relying on generative UI frameworks to speed up prototyping.",
    market: "Saturated at the entry level, but desperate for senior talent who understand the psychology of retention and conversion."
  },
  RND: {
    title: "Deep Tech / Applied R&D",
    whyFit: "You show a high tolerance for risk and a desire to control the entire stack to find unseen solutions. You are willing to fail multiple times for an exponential breakthrough.",
    logic: "Working on zero-to-one problems. This involves writing algorithms for hardware that barely exists or optimizing completely novel software paradigms.",
    automation: "Building the automation tools others will use. You are the one training the models, not just calling the APIs.",
    market: "High risk, high reward. Jobs are concentrated in heavily funded startups or secretive wings of major tech conglomerates."
  }
};

// --- COMPONENT ---

export default function SkillNavigator() {
  const [step, setStep] = useState(0); // 0: Intro, 1-10: Questions, 11: Results
  const [scores, setScores] = useState({ SYS: 0, OPS: 0, QNT: 0, PROD: 0, RND: 0 });
  const [topResults, setTopResults] = useState<any[]>([]);

  const handleStart = () => setStep(1);

  const handleAnswer = (optionScores: any) => {
    const newScores = { ...scores };
    for (const [key, val] of Object.entries(optionScores)) {
      newScores[key as keyof typeof newScores] += val as number;
    }
    setScores(newScores);

    if (step < 10) {
      setStep(step + 1);
    } else {
      calculateResults(newScores);
    }
  };

  const calculateResults = (finalScores: typeof scores) => {
    const sortedDomains = Object.entries(finalScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([key]) => DOMAINS[key]);

    setTopResults(sortedDomains);
    setStep(11);
  };

  const resetNavigator = () => {
    setScores({ SYS: 0, OPS: 0, QNT: 0, PROD: 0, RND: 0 });
    setTopResults([]);
    setStep(0);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      
      {/* HEADER */}
      <div className="mb-8 border-b border-gray-800 pb-4">
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
          Skill Navigator Core
        </h1>
        <p className="text-gray-400 mt-2 text-sm">Logistical & Cognitive Mapping Engine</p>
      </div>

      {/* INTRO VIEW */}
      {step === 0 && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center animate-in fade-in zoom-in duration-500">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">A Radical Approach to Career Mapping</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Forget standard personality tests. This diagnostic bypasses predictable questions to test your 
            entropy management, risk tolerance, and structural thinking. Answer instinctively.
          </p>
          <button 
            onClick={handleStart}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
          >
            Initiate Diagnostic
          </button>
        </div>
      )}

      {/* QUESTION VIEW */}
      {step > 0 && step <= 10 && (
        <div className="animate-in slide-in-from-right-4 fade-in duration-300">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Diagnostic Sequence</span>
            <span className="text-sm font-bold text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full">
              {step} / 10
            </span>
          </div>
          
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 md:p-10 shadow-lg">
            <h3 className="text-xl md:text-2xl font-medium text-gray-100 mb-8 leading-relaxed">
              {QUESTIONS[step - 1].text}
            </h3>
            <div className="space-y-4">
              {QUESTIONS[step - 1].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option.scores)}
                  className="w-full text-left p-5 rounded-lg border border-gray-700 bg-gray-800/50 hover:bg-gray-800 hover:border-blue-500 transition-all group flex items-start gap-4"
                >
                  <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border border-gray-600 group-hover:border-blue-500 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    {option.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RESULTS VIEW */}
      {step === 11 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Cognitive Dossier Generated</h2>
            <p className="text-gray-400">Based on your logistical processing patterns, here are your top 3 domain fits.</p>
          </div>

          <div className="space-y-8">
            {topResults.map((result, idx) => (
              <div key={idx} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
                {/* Result Header */}
                <div className={`p-6 border-b ${idx === 0 ? 'bg-blue-900/20 border-blue-800/50' : 'border-gray-800'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wider ${
                      idx === 0 ? 'bg-blue-500 text-white' : 
                      idx === 1 ? 'bg-gray-700 text-gray-300' : 'bg-gray-800 text-gray-400'
                    }`}>
                      {idx === 0 ? 'Primary Match' : idx === 1 ? 'Secondary Match' : 'Tertiary Match'}
                    </span>
                  </div>
                  <h3 className={`text-2xl font-bold ${idx === 0 ? 'text-blue-400' : 'text-gray-200'}`}>
                    {result.title}
                  </h3>
                </div>

                {/* Result Body */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Why You Fit
                    </h4>
                    <p className="text-gray-300 text-sm leading-relaxed">{result.whyFit}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">2026 Core Logic</h4>
                      <p className="text-gray-400 text-sm">{result.logic}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Automation Factor</h4>
                      <p className="text-gray-400 text-sm">{result.automation}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Market Reality</h4>
                      <p className="text-gray-400 text-sm">{result.market}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button 
              onClick={resetNavigator}
              className="text-gray-400 hover:text-white underline decoration-gray-600 hover:decoration-gray-400 transition-colors"
            >
              Recalibrate / Retake Diagnostic
            </button>
          </div>
        </div>
      )}

    </div>
  );
}