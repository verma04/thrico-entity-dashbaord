"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  UserPlus,
  Zap,
  MessageSquare,
  Heart,
  Megaphone,
  DollarSign,
} from "lucide-react";

const stages = [
  { key: "membership", label: "Acquire", icon: UserPlus, color: "from-cyan-500 to-blue-500" },
  { key: "growth", label: "Activate", icon: Zap, color: "from-blue-500 to-indigo-500" },
  { key: "engagement", label: "Engage", icon: MessageSquare, color: "from-indigo-500 to-violet-500" },
  { key: "health", label: "Retain", icon: Heart, color: "from-violet-500 to-purple-500" },
  { key: "advocacy", label: "Advocate", icon: Megaphone, color: "from-purple-500 to-pink-500" },
  { key: "monetisation", label: "Monetize", icon: DollarSign, color: "from-pink-500 to-rose-500" },
];

interface KPIPipelineNavProps {
  activeSection?: string;
  onSectionClick?: (key: string) => void;
}

export function KPIPipelineNav({ activeSection, onSectionClick }: KPIPipelineNavProps) {
  return (
    <div className="relative">
      {/* Pipeline connector line */}
      <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-rose-500/20 -translate-y-1/2 hidden md:block" />

      <div className="flex flex-wrap md:flex-nowrap items-center gap-1.5 md:gap-0 md:justify-between relative z-10">
        {stages.map((stage, i) => {
          const Icon = stage.icon;
          const isActive = activeSection === stage.key;
          return (
            <React.Fragment key={stage.key}>
              <button
                onClick={() => onSectionClick?.(stage.key)}
                className={cn(
                  "group flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-300 text-[10px] font-bold uppercase tracking-[0.12em] shrink-0",
                  isActive
                    ? "bg-foreground text-background border-foreground shadow-lg scale-105"
                    : "bg-card border-border/50 text-muted-foreground hover:border-foreground/30 hover:text-foreground hover:shadow-sm"
                )}
              >
                <div className={cn(
                  "h-4 w-4 rounded-full flex items-center justify-center bg-gradient-to-br",
                  stage.color,
                  !isActive && "opacity-60 group-hover:opacity-100"
                )}>
                  <Icon className="h-2.5 w-2.5 text-white" />
                </div>
                {stage.label}
              </button>

              {/* Arrow connector (desktop only) */}
              {i < stages.length - 1 && (
                <div className="hidden md:flex items-center flex-1 min-w-[12px] max-w-[60px] mx-0.5">
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-border/60 to-border/30" />
                  <div className="h-0 w-0 border-l-[4px] border-l-border/40 border-y-[3px] border-y-transparent shrink-0" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
