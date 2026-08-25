"use client";

import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, AlertCircle, Check, Sparkles, Command } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FloatingSaveButtonProps {
  /** Whether the form has unsaved changes */
  hasChanged?: boolean;
  /** Alias for hasChanged */
  isDirty?: boolean;
  /** Whether a save request is in-flight */
  isSubmitting?: boolean;
  /** Alias for isSubmitting */
  isSaving?: boolean;
  /** Whether save was just completed (shows temporary green check badge) */
  saved?: boolean;
  /** Callback fired when user clicks Save */
  onSave: () => void | Promise<void>;
  /** Callback fired when user clicks Discard / Reset */
  onDiscard?: () => void;
  /** Alias for onDiscard */
  onReset?: () => void;
  /** Title shown on the left of the capsule (default: "Unsaved changes") */
  title?: string;
  /** Optional subtitle or description */
  description?: string;
  /** Label for the save button (default: "Save discount") */
  saveLabel?: string;
  /** Alias for saveLabel */
  buttonText?: string;
  /** Alias for saveLabel */
  saveButtonText?: string;
  /** Label for the discard button (default: "Discard") */
  discardLabel?: string;
  /** Alias for discardLabel */
  discardButtonText?: string;
  /** Optional badge text (e.g. "Draft", "Shopify") */
  badgeText?: string;
  /** Variant style: "capsule" (default floating pill) | "dock" (full width bottom dock) | "minimal" (compact float pill) */
  variant?: "capsule" | "dock" | "minimal";
  /** Optional custom className for outer container */
  className?: string;
  /** Enable keyboard shortcut (Cmd+S / Ctrl+S) to trigger onSave when dirty (default: true) */
  enableKeyboardShortcut?: boolean;
}

export function FloatingSaveButton({
  hasChanged,
  isDirty,
  isSubmitting,
  isSaving,
  saved = false,
  onSave,
  onDiscard,
  onReset,
  title = "Unsaved changes",
  description,
  saveLabel,
  buttonText,
  saveButtonText,
  discardLabel = "Discard",
  discardButtonText,
  badgeText,
  variant = "capsule",
  className,
  enableKeyboardShortcut = true,
}: FloatingSaveButtonProps) {
  const [mounted, setMounted] = useState(false);
  const [isMac, setIsMac] = useState(true);

  // Normalize dirty & submitting states
  const dirty = Boolean(hasChanged ?? isDirty);
  const submitting = Boolean(isSubmitting ?? isSaving);
  const finalSaveLabel = saveLabel || saveButtonText || buttonText || "Save discount";
  const finalDiscardLabel = discardLabel || discardButtonText || "Discard";
  const handleDiscard = onDiscard || onReset;

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setIsMac(navigator.platform?.toUpperCase().indexOf("MAC") >= 0);
    }
  }, []);

  // Keyboard shortcut handler (Cmd+S / Ctrl+S)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enableKeyboardShortcut || !dirty || submitting) return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        onSave();
      }
    },
    [enableKeyboardShortcut, dirty, submitting, onSave]
  );

  useEffect(() => {
    if (!enableKeyboardShortcut) return;
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enableKeyboardShortcut, handleKeyDown]);

  if (!mounted) return null;

  const content = (
    <AnimatePresence mode="wait">
      {dirty && (
        <motion.div
          key="floating-save-container"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ type: "spring", damping: 26, stiffness: 360 }}
          className={cn(
            variant === "dock"
              ? "fixed bottom-0 left-0 right-0 z-[99999] pointer-events-auto"
              : "fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999] w-[94%] sm:w-auto min-w-[340px] max-w-[620px] pointer-events-auto",
            className
          )}
        >
          {variant === "dock" ? (
            /* ── Docked Full-Width Variant ── */
            <div className="w-full bg-[#1c1c1f]/95 dark:bg-[#141416]/95 backdrop-blur-xl border-t border-white/10 dark:border-zinc-800 shadow-[0_-8px_30px_rgba(0,0,0,0.3)]">
              <div className="max-w-[1280px] mx-auto h-[64px] px-6 sm:px-8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[14px] font-semibold text-white tracking-tight truncate">
                      {title}
                    </span>
                    {description && (
                      <span className="text-[12px] text-zinc-400 truncate">
                        {description}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  {handleDiscard && (
                    <button
                      type="button"
                      onClick={handleDiscard}
                      disabled={submitting}
                      className="h-9 px-4 rounded-lg text-[13px] font-medium text-zinc-300 bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {finalDiscardLabel}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onSave()}
                    disabled={submitting}
                    className="h-9 px-5 rounded-lg text-[13px] font-semibold text-zinc-950 bg-white hover:bg-zinc-100 active:bg-zinc-200 border border-transparent transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-950" />
                        <span>Saving…</span>
                      </>
                    ) : (
                      <>
                        <span>{finalSaveLabel}</span>
                        {enableKeyboardShortcut && (
                          <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono tracking-tighter bg-zinc-200 text-zinc-700">
                            {isMac ? "⌘S" : "Ctrl+S"}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ── Floating Capsule Variant (Default / Polaris Obsidian) ── */
            <div className="w-full bg-[#18181b]/95 dark:bg-[#121214]/95 text-white backdrop-blur-xl border border-white/12 dark:border-zinc-700/60 rounded-2xl p-2 sm:py-2.5 sm:px-3.5 flex items-center justify-between gap-3 sm:gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.45)] ring-1 ring-white/5">
              {/* Left Status & Label */}
              <div className="flex items-center gap-2.5 min-w-0 pl-1.5 sm:pl-2">
                <div className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[13px] sm:text-[13.5px] font-semibold text-zinc-100 tracking-tight truncate">
                    {title}
                  </span>
                  {badgeText && (
                    <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-medium bg-amber-500/15 text-amber-300 border border-amber-500/20">
                      {badgeText}
                    </span>
                  )}
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {handleDiscard && (
                  <button
                    type="button"
                    onClick={handleDiscard}
                    disabled={submitting}
                    className="h-8 sm:h-8.5 px-3 rounded-lg text-[12.5px] font-medium text-zinc-300 bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
                  >
                    {finalDiscardLabel}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onSave()}
                  disabled={submitting}
                  className="h-8 sm:h-8.5 px-4 rounded-lg text-[12.5px] sm:text-[13px] font-semibold text-zinc-950 bg-white hover:bg-zinc-100 active:bg-zinc-200 border border-white/40 transition-all duration-150 shadow-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-900" />
                      <span>Saving…</span>
                    </>
                  ) : (
                    <>
                      <span>{finalSaveLabel}</span>
                      {enableKeyboardShortcut && (
                        <span className="hidden sm:inline-flex items-center px-1 py-0.2 rounded text-[10px] font-mono tracking-tighter bg-zinc-200 text-zinc-700">
                          {isMac ? "⌘S" : "Ctrl+S"}
                        </span>
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ── Saved Success Toast Capsule ── */}
      {!dirty && saved && (
        <motion.div
          key="saved-floating-pill"
          initial={{ opacity: 0, y: 16, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.94 }}
          transition={{ duration: 0.22 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999] px-4 py-2 rounded-full bg-[#141416]/95 border border-emerald-500/40 text-emerald-400 text-[12.5px] font-medium shadow-2xl backdrop-blur-xl flex items-center gap-2 pointer-events-auto ring-1 ring-emerald-500/20"
        >
          <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Check className="h-3 w-3 stroke-[3] text-emerald-400" />
          </div>
          <span>Discount saved successfully</span>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}

// Export alias FloatSaveButton for developer convenience
export const FloatSaveButton = FloatingSaveButton;
export default FloatingSaveButton;
