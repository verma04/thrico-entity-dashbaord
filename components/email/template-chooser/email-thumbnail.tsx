"use client";

import React from "react";
import { Plus, Check, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { StarterEntry, BADGE_STYLES } from "./template-data";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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
        "group relative flex flex-col rounded-[8px] border transition-all duration-200 cursor-pointer overflow-hidden bg-white dark:bg-zinc-900 shadow-2xs hover:shadow-xs",
        selected
          ? "border-zinc-900 dark:border-zinc-100 ring-2 ring-zinc-900/15 dark:ring-zinc-100/20 shadow-xs"
          : "border-[#d2d5d9] dark:border-zinc-800 hover:border-[#aeb4b9] dark:hover:border-zinc-700"
      )}
    >
      {/* Selection Checkmark Indicator */}
      {selected && (
        <div className="absolute top-2 right-2 z-20 h-5 w-5 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center shadow-xs animate-in zoom-in-50 duration-200">
          <Check className="h-3 w-3 stroke-[3]" />
        </div>
      )}

      {/* Miniature Email Wireframe Preview Container */}
      <div className="relative p-2 pb-0 bg-[#f6f6f7] dark:bg-zinc-950/60 border-b border-border/40 overflow-hidden">
        {/* Email Window Mockup Shell */}
        <div className="w-full bg-white dark:bg-zinc-900 rounded-t-[5px] border border-border/60 shadow-2xs overflow-hidden transition-transform duration-200 group-hover:-translate-y-0.5">
          {/* Top Window Header Bar */}
          <div className="flex items-center justify-between px-2 py-1 border-b border-border/30 bg-muted/30">
            <div className="flex items-center gap-0.5">
              <div className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <div className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <div className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            </div>
            <div className="h-1 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          </div>

          {/* Email Content Body */}
          <div className="p-2 space-y-1.5 h-[62px] flex flex-col justify-between select-none">
            {isBlank ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-1 border border-dashed border-border/80 rounded-[4px] p-1">
                <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  <Plus className="h-3 w-3" />
                </div>
                <span className="text-[8.5px] font-bold text-muted-foreground">Empty Canvas</span>
              </div>
            ) : (
              <>
                {/* Hero Header Area */}
                {wireframe.heroType === "banner" && (
                  <div
                    className={cn(
                      "h-5 w-full rounded-[3px] bg-gradient-to-r flex items-center px-1.5 shadow-2xs",
                      headerGradient
                    )}
                  >
                    <div className="h-1 w-8 rounded-full bg-white/80 shadow-2xs" />
                  </div>
                )}

                {wireframe.heroType === "split" && (
                  <div className="space-y-1">
                    {wireframe.hasNav && (
                      <div className="flex items-center justify-between pb-0.5 border-b border-border/30">
                        <div className="h-1 w-5 rounded-full bg-zinc-800 dark:bg-zinc-200" />
                        <div className="flex items-center gap-0.5">
                          <div className="h-1 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                          <div className="h-1 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <div
                        className={cn(
                          "h-4 w-4 rounded-[3px] bg-gradient-to-br shrink-0 shadow-2xs",
                          headerGradient
                        )}
                      />
                      <div className="space-y-0.5 flex-1">
                        <div className="h-1 w-3/4 rounded-full bg-zinc-700 dark:bg-zinc-300" />
                        <div className="h-1 w-1/2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                      </div>
                    </div>
                  </div>
                )}

                {wireframe.heroType === "minimal" && (
                  <div className="flex items-center gap-1.5">
                    <div
                      className={cn(
                        "h-4 w-4 rounded-full bg-gradient-to-br flex items-center justify-center shrink-0 text-white shadow-2xs",
                        headerGradient
                      )}
                    >
                      <Sparkles className="h-2 w-2" />
                    </div>
                    <div className="space-y-0.5 flex-1">
                      <div className="h-1 w-4/5 rounded-full bg-zinc-800 dark:bg-zinc-200" />
                      <div className="h-1 w-1/2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    </div>
                  </div>
                )}

                {/* Skeleton Text Lines */}
                <div className="space-y-0.5 py-0.2">
                  <div className="h-1 w-full rounded-full bg-zinc-200/90 dark:bg-zinc-800" />
                  <div className="h-1 w-4/5 rounded-full bg-zinc-200/70 dark:bg-zinc-800/80" />
                </div>

                {/* Simulated Call to Action Button */}
                <div className="pt-0.2">
                  <div
                    className="h-3.5 px-2 rounded-[3px] text-[7.5px] font-bold text-white flex items-center justify-center shadow-2xs truncate max-w-[90px]"
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
      <div className="flex flex-col flex-1 p-2.5 space-y-1.5">
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="h-5 w-5 rounded-[4px] bg-muted/60 flex items-center justify-center shrink-0 border border-border/40">
              {starter.icon}
            </div>
            <span className="text-[11.5px] font-bold text-foreground truncate">
              {starter.label}
            </span>
          </div>

          {starter.badge && starter.badgeVariant && (
            <Badge
              variant="outline"
              className={cn(
                "text-[8px] font-bold px-1 py-0 uppercase tracking-wider shrink-0 rounded-[3px]",
                BADGE_STYLES[starter.badgeVariant]
              )}
            >
              {starter.badge}
            </Badge>
          )}
        </div>

        <p className="text-[10px] text-muted-foreground line-clamp-1 leading-tight">
          {starter.description}
        </p>

        {/* Hover Action Link */}
        <div className="pt-1.5 mt-auto border-t border-border/40 flex items-center justify-between text-[9.5px] font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
          <span>{isBlank ? "Blank canvas" : "Use blueprint"}</span>
          <ArrowRight className="h-2.5 w-2.5 transform group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
}

export function EmailThumbnailSkeleton() {
  return (
    <div className="flex flex-col rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs overflow-hidden">
      <div className="p-2 pb-0 bg-[#f6f6f7] dark:bg-zinc-950/60 border-b border-border/40">
        <div className="w-full bg-white dark:bg-zinc-900 rounded-t-[5px] border border-border/60 p-2 space-y-1.5 h-[62px]">
          <Skeleton className="h-4 w-full rounded-[3px]" />
          <Skeleton className="h-1 w-full rounded-full" />
          <Skeleton className="h-1 w-3/4 rounded-full" />
        </div>
      </div>
      <div className="p-2.5 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-5 w-5 rounded-[4px]" />
            <Skeleton className="h-3 w-16 rounded-[2px]" />
          </div>
          <Skeleton className="h-3 w-8 rounded-[2px]" />
        </div>
        <Skeleton className="h-2 w-full rounded-[2px]" />
        <div className="pt-1.5 border-t border-border/40 flex justify-between">
          <Skeleton className="h-2 w-12 rounded-[2px]" />
          <Skeleton className="h-2 w-3 rounded-[2px]" />
        </div>
      </div>
    </div>
  );
}
