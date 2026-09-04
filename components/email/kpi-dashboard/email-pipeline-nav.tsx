"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  ShieldCheck,
  BarChart3,
  TrendingUp,
  Send,
  Globe,
  Zap,
} from "lucide-react";

const emailStages = [
  { key: "deliverability", label: "Deliverability", icon: ShieldCheck, color: "from-emerald-500 to-teal-500" },
  { key: "quota", label: "Quota & Credits", icon: BarChart3, color: "from-blue-500 to-indigo-500" },
  { key: "engagement", label: "Engagement", icon: TrendingUp, color: "from-indigo-500 to-violet-500" },
  { key: "campaigns", label: "Recent Campaigns", icon: Send, color: "from-violet-500 to-purple-500" },
  { key: "automations", label: "Automations", icon: Zap, color: "from-purple-500 to-pink-500" },
  { key: "infrastructure", label: "Domain DNS", icon: Globe, color: "from-pink-500 to-rose-500" },
];

interface EmailPipelineNavProps {
  activeSection?: string;
  onSectionClick?: (key: string) => void;
}

export function EmailPipelineNav({ activeSection, onSectionClick }: EmailPipelineNavProps) {
  return (
    <div className="relative">
      {/* Pipeline connector line */}
      <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/20 via-indigo-500/20 to-rose-500/20 -translate-y-1/2 hidden md:block" />

      <div className="flex flex-wrap md:flex-nowrap items-center gap-1.5 md:gap-0 md:justify-between relative z-10">
        {emailStages.map((stage, i) => {
          const Icon = stage.icon;
          const isActive = activeSection === stage.key;
          return (
            <React.Fragment key={stage.key}>
              <button
                type="button"
                onClick={() => onSectionClick?.(stage.key)}
                className={cn(
                  "group flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-300 text-[10px] font-bold uppercase tracking-[0.12em] shrink-0 cursor-pointer",
                  isActive
                    ? "bg-foreground text-background border-foreground shadow-lg scale-105"
                    : "bg-card border-border/50 text-muted-foreground hover:border-foreground/30 hover:text-foreground hover:shadow-xs"
                )}
              >
                <div
                  className={cn(
                    "h-4 w-4 rounded-full flex items-center justify-center bg-gradient-to-br",
                    stage.color,
                    !isActive && "opacity-60 group-hover:opacity-100"
                  )}
                >
                  <Icon className="h-2.5 w-2.5 text-white" />
                </div>
                {stage.label}
              </button>

              {/* Arrow connector (desktop only) */}
              {i < emailStages.length - 1 && (
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
