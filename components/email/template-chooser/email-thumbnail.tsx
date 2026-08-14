"use client";

import React from "react";
import { Plus, Check, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { StarterEntry, BADGE_STYLES } from "./template-data";
import { Badge } from "@/components/ui/badge";

interface EmailThumbnailProps {
  starter: StarterEntry;
  selected: boolean;
  onSelect: () => void;
}

export function EmailThumbnail({
  starter,
  selected,
  onSelect,
}: EmailThumbnailProps) {
  const isBlank = starter.key === "blank";
  const { wireframe, accentColor, headerGradient } = starter;

  return (
    <div
      onClick={onSelect}
      className={cn(
        "group relative flex flex-col rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden bg-white dark:bg-zinc-900 shadow-xs hover:shadow-lg",
        selected
          ? "border-zinc-900 dark:border-zinc-100 ring-2 ring-zinc-900/15 dark:ring-zinc-100/20 shadow-md"
          : "border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
      )}
    >
      {/* Selection Checkmark Indicator */}
      {selected && (
        <div className="absolute top-3 right-3 z-20 h-6 w-6 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center shadow-md animate-in zoom-in-50 duration-200">
          <Check className="h-3.5 w-3.5 stroke-[3]" />
        </div>
      )}

      {/* Miniature Email Wireframe Preview Container */}
      <div className="relative p-3.5 pb-0 bg-zinc-100/70 dark:bg-zinc-950/60 border-b border-zinc-200/60 dark:border-zinc-800/80 overflow-hidden">
        {/* Email Window Mockup Shell */}
        <div className="w-full bg-white dark:bg-zinc-900 rounded-t-xl border border-zinc-200/90 dark:border-zinc-800 shadow-xs overflow-hidden transition-transform duration-300 group-hover:-translate-y-0.5">
          {/* Top Window Header Bar */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80">
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <div className="h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <div className="h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            </div>
            <div className="h-2 w-16 rounded-full bg-zinc-200/80 dark:bg-zinc-800" />
          </div>

          {/* Email Content Body */}
          <div className="p-3 space-y-2.5 h-[130px] flex flex-col justify-between select-none">
            {isBlank ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg p-2">
                <div className="h-7 w-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center">
                  <Plus className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-bold text-zinc-400">Empty Canvas</span>
              </div>
            ) : (
              <>
                {/* Hero Header Area */}
                {wireframe.heroType === "banner" && (
                  <div
                    className={cn(
                      "h-8 w-full rounded-md bg-gradient-to-r flex items-center px-2 shadow-xs",
                      headerGradient
                    )}
                  >
                    <div className="h-2 w-12 rounded-full bg-white/80 shadow-xs" />
                  </div>
                )}

                {wireframe.heroType === "split" && (
                  <div className="space-y-1.5">
                    {wireframe.hasNav && (
                      <div className="flex items-center justify-between pb-1 border-b border-zinc-100 dark:border-zinc-800">
                        <div className="h-2 w-8 rounded-full bg-zinc-800 dark:bg-zinc-200" />
                        <div className="flex items-center gap-1">
                          <div className="h-1.5 w-4 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                          <div className="h-1.5 w-4 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "h-6 w-6 rounded-md bg-gradient-to-br shrink-0 shadow-xs",
                          headerGradient
                        )}
                      />
                      <div className="space-y-1 flex-1">
                        <div className="h-2 w-3/4 rounded-full bg-zinc-700 dark:bg-zinc-300" />
                        <div className="h-1.5 w-1/2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                      </div>
                    </div>
                  </div>
                )}

                {wireframe.heroType === "minimal" && (
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "h-6 w-6 rounded-full bg-gradient-to-br flex items-center justify-center shrink-0 text-white shadow-xs text-[10px]",
                        headerGradient
                      )}
                    >
                      <Sparkles className="h-3 w-3" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="h-2 w-4/5 rounded-full bg-zinc-800 dark:bg-zinc-200" />
                      <div className="h-1.5 w-1/2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    </div>
                  </div>
                )}

                {/* Skeleton Text Lines */}
                <div className="space-y-1 py-0.5">
                  <div className="h-1.5 w-full rounded-full bg-zinc-200/90 dark:bg-zinc-800" />
                  <div className="h-1.5 w-4/5 rounded-full bg-zinc-200/70 dark:bg-zinc-800/80" />
                  <div className="h-1.5 w-2/3 rounded-full bg-zinc-200/50 dark:bg-zinc-800/60" />
                </div>

                {/* Simulated Call to Action Button */}
                <div className="pt-0.5">
                  <div
                    className="h-5 px-3 rounded-md text-[9px] font-bold text-white flex items-center justify-center shadow-xs truncate max-w-[120px]"
                    style={{ backgroundColor: wireframe.buttonColor || accentColor }}
                  >
                    {wireframe.buttonText || "Call to Action"}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Card Metadata & Labels */}
      <div className="flex flex-col flex-1 p-4 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
              {starter.icon}
            </div>
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
              {starter.label}
            </span>
          </div>

          {starter.badge && starter.badgeVariant && (
            <Badge
              variant="outline"
              className={cn(
                "text-[9px] font-bold px-1.5 py-0 uppercase tracking-wider shrink-0",
                BADGE_STYLES[starter.badgeVariant]
              )}
            >
              {starter.badge}
            </Badge>
          )}
        </div>

        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
          {starter.description}
        </p>

        {/* Hover Action Link */}
        <div className="pt-2 mt-auto border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
          <span>{isBlank ? "Open blank canvas" : "Use this starter"}</span>
          <ArrowRight className="h-3 w-3 transform group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
}
