"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Save, RotateCcw, Check } from "lucide-react";

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
  title = "Unsaved Changes",
  description = "You have made changes to the settings",
  buttonText = "Apply Changes",
}: FloatingSavePanelProps) {
  return (
    <AnimatePresence>
      {hasChanged && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 pl-4 pr-1.5 py-1.5 rounded-full bg-foreground shadow-2xl border border-white/10"
        >
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-semibold text-background tracking-wide">
              {title}
            </span>
            {description && (
              <span className="text-[10px] text-background/60 ml-1 hidden sm:inline-block">
                — {description}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 border-l border-background/20 pl-3">
            <button
              onClick={onReset}
              disabled={isSaving}
              className="h-6 px-3 rounded-full text-[10px] font-medium text-background/70 hover:text-background hover:bg-background/10 transition-all disabled:opacity-40 flex items-center gap-1.5"
            >
              <RotateCcw size={10} className="opacity-70" />
              Discard
            </button>
            <button
              onClick={onSave}
              disabled={isSaving}
              className="h-6 px-3 rounded-full text-[10px] font-semibold bg-background text-foreground hover:bg-muted active:scale-[0.98] transition-all disabled:opacity-60 flex items-center gap-1.5 shadow-sm"
            >
              {isSaving ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Save size={12} />
              )}
              {buttonText}
            </button>
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
