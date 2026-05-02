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
          className="fixed bottom-6 right-6 z-[100] flex items-center gap-4 pl-4 pr-3 py-2.5 rounded-2xl bg-zinc-900/95 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl"
        >
          <div className="flex flex-col min-w-[120px]">
            <span className="text-[12px] font-semibold text-white tracking-tight leading-none">
              {title}
            </span>
            <span className="text-[10px] text-zinc-400 mt-1 font-medium">
              {description}
            </span>
          </div>

          <div className="w-px h-8 bg-white/10 mx-1" />

          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              disabled={isSaving}
              className="h-9 px-3 rounded-xl text-[12px] font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-40 flex items-center gap-2"
            >
              <RotateCcw size={14} className="opacity-70" />
              Discard
            </button>
            <button
              onClick={onSave}
              disabled={isSaving}
              className="h-9 px-4 rounded-xl text-[12px] font-semibold bg-white text-zinc-950 hover:bg-zinc-100 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center gap-2 shadow-sm"
            >
              {isSaving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
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
          className="fixed bottom-6 right-6 z-[100] px-4 py-2.5 rounded-2xl bg-zinc-900/95 border border-emerald-500/20 text-emerald-400 text-[12px] font-semibold shadow-lg backdrop-blur-xl flex items-center gap-2.5"
        >
          <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <Check size={12} strokeWidth={3} />
          </div>
          Saved successfully
        </motion.div>
      )}
    </AnimatePresence>
  );
}
