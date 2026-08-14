"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, AlertCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FloatingSavePanelProps {
  hasChanged: boolean;
  saved: boolean;
  isSaving?: boolean;
  onSave: () => void;
  onReset: () => void;
  title?: string;
  description?: string;
  buttonText?: string;
  saveButtonText?: string;
  discardButtonText?: string;
  className?: string;
}

export function FloatingSavePanel({
  hasChanged,
  saved,
  isSaving,
  onSave,
  onReset,
  title = "Unsaved product",
  buttonText,
  saveButtonText,
  discardButtonText = "Discard",
  className,
}: FloatingSavePanelProps) {
  const saveLabel = saveButtonText || buttonText || "Save";

  return (
    <AnimatePresence>
      {hasChanged && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.98 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className={cn(
            "fixed bottom-5 left-1/2 -translate-x-1/2 z-[9999] w-[92%] sm:w-[60%] md:w-[45%] lg:w-[30%] min-w-[340px] max-w-[520px]",
            className
          )}
        >
          {/* Centered Capsule Bar */}
          <div className="w-full bg-[#212121]/95 backdrop-blur-md border border-[#383838] rounded-xl px-3.5 py-2 flex items-center justify-between shadow-2xl shadow-black/50">
            {/* Left: Icon + Title */}
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-neutral-300">
                <AlertCircle size={16} className="text-neutral-300 stroke-[2.2]" />
              </div>
              <span className="text-[13px] sm:text-[13.5px] font-medium text-neutral-100 truncate tracking-tight">
                {title}
              </span>
            </div>

            {/* Right: Discard & Save Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={onReset}
                disabled={isSaving}
                className="h-7.5 px-3 rounded-lg text-[12.5px] font-medium text-neutral-300 bg-[#2f2f2f] hover:bg-[#3a3a3a] active:bg-[#444444] border border-[#424242] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
              >
                {discardButtonText}
              </button>
              <button
                type="button"
                onClick={onSave}
                disabled={isSaving}
                className="h-7.5 px-3.5 rounded-lg text-[12.5px] font-semibold text-white bg-[#424242] hover:bg-[#505050] active:bg-[#5a5a5a] border border-[#555555] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                {isSaving && <Loader2 size={13} className="animate-spin text-neutral-300" />}
                <span>{saveLabel}</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {!hasChanged && saved && (
        <motion.div
          key="saved-floating"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-4 py-1.5 rounded-full bg-[#181818] border border-emerald-500/40 text-emerald-400 text-[12px] font-medium shadow-2xl backdrop-blur-md flex items-center gap-2"
        >
          <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Check size={11} className="stroke-[3] text-emerald-400" />
          </div>
          <span>Saved successfully</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

