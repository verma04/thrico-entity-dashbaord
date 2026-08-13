"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, AlertCircle, Check } from "lucide-react";

export interface FloatingSavePanelProps {
  hasChanged: boolean;
  saved: boolean;
  isSaving?: boolean;
  onSave: () => void;
  onReset: () => void;
  title?: string;
  description?: string;
  buttonText?: string;
}

export function FloatingSavePanel({
  hasChanged,
  saved,
  isSaving,
  onSave,
  onReset,
  title = "Unsaved changes",
  buttonText = "Save",
}: FloatingSavePanelProps) {
  return (
    <AnimatePresence>
      {hasChanged && (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[100]"
        >
          {/* Dark contextual save bar */}
          <div className="bg-[#1a1a1a] border-t border-[#333] px-4 py-3 flex items-center justify-between">
            {/* Left: icon + label */}
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-white/80 flex-shrink-0" />
              <span className="text-[14px] font-medium text-white">
                {title}
              </span>
            </div>

            {/* Right: action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={onReset}
                disabled={isSaving}
                className="h-8 px-4 rounded-lg text-[13px] font-medium text-white/90 bg-transparent hover:bg-white/10 active:bg-white/15 transition-colors disabled:opacity-40"
              >
                Discard
              </button>
              <button
                onClick={onSave}
                disabled={isSaving}
                className="h-8 px-4 rounded-lg text-[13px] font-medium text-white bg-transparent border border-white/40 hover:border-white/70 hover:bg-white/5 active:bg-white/10 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving && (
                  <Loader2 size={14} className="animate-spin" />
                )}
                {buttonText}
              </button>
            </div>
          </div>
        </motion.div>
      )}
      {!hasChanged && saved && (
        <motion.div
          key="saved-floating"
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 dark:bg-emerald-500/10 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold shadow-lg backdrop-blur-md flex items-center gap-2"
        >
          <Check size={12} strokeWidth={3} />
          Saved successfully
        </motion.div>
      )}
    </AnimatePresence>
  );
}
