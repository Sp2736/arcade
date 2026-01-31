"use client";

import React from "react";
import { motion } from "framer-motion";
import { modules } from "./data";

type Props = {
  activeId: number;
  setActiveId: (id: number) => void;
};

export default function TimelineController({ activeId, setActiveId }: Props) {
  return (
    <div className="hidden md:flex flex-col justify-center h-full pr-8 relative z-30">
      <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-full py-6 px-3 flex flex-col gap-6 items-center">
        {modules.map((m) => {
          const isActive = m.id === activeId;
          return (
            <div key={m.id} className="relative group flex items-center justify-center">
              {/* The Dot */}
              <button
                onClick={() => setActiveId(m.id)}
                className={`
                  relative z-10 rounded-full transition-all duration-300
                  ${isActive ? "w-4 h-4 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,1)]" : "w-2 h-2 bg-zinc-600 hover:bg-zinc-400"}
                `}
              />

              {/* Hover Label (Tooltip) */}
              <div className="absolute right-8 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="text-xs font-bold text-white whitespace-nowrap bg-zinc-800 px-2 py-1 rounded">
                  {m.title}
                </span>
              </div>

              {/* Active Label (Always visible next to dot) */}
              {isActive && (
                <motion.div
                  layoutId="activeLabel"
                  className="absolute right-10 text-right"
                >
                  <span className="block text-2xl font-black text-white leading-none">
                    0{m.id}
                  </span>
                </motion.div>
              )}
            </div>
          );
        })}
        {/* Connecting Line */}
        <div className="absolute top-6 bottom-6 left-1/2 -translate-x-1/2 w-px bg-white/5 -z-0" />
      </div>
    </div>
  );
}