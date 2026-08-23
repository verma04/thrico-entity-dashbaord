"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StickySaveBarProps {
  hasChanged: boolean;
  isSubmitting?: boolean;
  onSave: () => void;
  onDiscard: () => void;
  saveLabel?: string;
  discardLabel?: string;
  title?: string;
}

export function StickySaveBar({
  hasChanged,
  isSubmitting = false,
  onSave,
  onDiscard,
  saveLabel = "Save discount",
  discardLabel = "Discard",
  title = "Unsaved changes",
}: StickySaveBarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !hasChanged) return null;

  const content = (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-[#d2d5d9] dark:border-zinc-800 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] animate-in slide-in-from-bottom-2 duration-200">
      <div className="max-w-[1280px] mx-auto h-[64px] px-6 sm:px-8 flex items-center justify-between gap-4">
        {/* Left: Unsaved changes status */}
        <div className="flex items-center gap-2 text-[#303030] dark:text-zinc-100 min-w-0">
          <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
          <span className="text-[14px] font-semibold tracking-tight truncate">
            {title}
          </span>
        </div>

        {/* Right: Discard & Save buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onDiscard}
            disabled={isSubmitting}
            className="h-[40px] px-4 rounded-[8px] border-[#d2d5d9] dark:border-zinc-700 text-[14px] font-medium text-[#303030] dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            {discardLabel}
          </Button>

          <Button
            type="button"
            onClick={onSave}
            disabled={isSubmitting}
            className="h-[40px] px-5 rounded-[8px] bg-[#005bd3] hover:bg-[#004bb0] text-white text-[14px] font-medium gap-2 shadow-xs transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Saving…</span>
              </>
            ) : (
              <span>{saveLabel}</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
