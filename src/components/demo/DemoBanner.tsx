"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, FlaskConical } from "lucide-react";

/**
 * DemoBanner
 * A persistent, highly-visible banner pinned to the top of every page
 * informing visitors they are in demo mode and that all data resets
 * when the browser tab is closed.
 */
export default function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between gap-3 px-4 py-2.5 bg-amber-500 text-black text-sm font-semibold shadow-lg"
          role="alert"
          aria-live="polite"
        >
          {/* Left group */}
          <div className="flex items-center gap-2 min-w-0">
            <FlaskConical size={16} className="shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline font-bold uppercase tracking-wide text-xs">
              Demo Mode
            </span>
            <span className="text-xs font-medium truncate">
              You&apos;re exploring a live demo.{" "}
              <span className="hidden md:inline">
                All data is mocked in-browser and will reset when you close this
                tab.
              </span>{" "}
              No real data is read or written.
            </span>
          </div>

          {/* Right group */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold bg-black/15 px-2 py-0.5 rounded-full">
              <AlertTriangle size={11} aria-hidden="true" />
              Ephemeral session
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 rounded hover:bg-black/20 transition-colors"
              aria-label="Dismiss demo banner"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

