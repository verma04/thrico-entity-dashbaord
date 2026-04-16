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
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 px-5 py-3 rounded-2xl bg-zinc-900 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-md"
        >
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-white/90 leading-none">
              {title}
            </span>
            <span className="text-[10px] text-zinc-400 mt-0.5">
              {description}
            </span>
          </div>

          <div className="w-px h-8 bg-white/10 mx-1" />

          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              disabled={isSaving}
              className="h-9 px-4 rounded-xl text-[12px] font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-40 flex items-center gap-2"
            >
              <RotateCcw size={13} />
              Discard
            </button>
            <button
              onClick={onSave}
              disabled={isSaving}
              className="h-9 px-5 rounded-xl text-[12px] font-bold bg-white text-zinc-900 hover:bg-zinc-200 transition-all disabled:opacity-60 flex items-center gap-2 shadow-lg"
            >
              {isSaving ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Save size={13} />
              )}
              {buttonText}
            </button>
          </div>
        </motion.div>
      )}
      {!hasChanged && saved && (
        <motion.div
          key="saved-floating"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 rounded-xl bg-emerald-500 text-white text-[12px] font-bold shadow-xl flex items-center gap-2"
        >
          <Check size={14} strokeWidth={3} />
          Saved
        </motion.div>
      )}
    </AnimatePresence>
  );
}
