"use client";

import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  Sparkles,
  Users,
  ShieldCheck,
  ArrowRight,
  Zap,
  Sliders,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImpactBannerProps {
  avgScore?: number;
  totalUsers?: number;
  totalRules?: number;
  loading?: boolean;
}

export const ImpactBanner: React.FC<ImpactBannerProps> = ({
  avgScore = 320,
  totalUsers = 148,
  totalRules = 12,
  loading = false,
}) => {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/40 p-3.5 sm:p-4 shadow-xs">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-1/3 -bottom-16 h-36 w-36 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.04] dark:opacity-[0.08]" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="h-2.5 w-2.5" />
              Impact Engine
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2 py-0.5 text-[9px] font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <ShieldCheck className="h-2.5 w-2.5" />
              Dynamic Decay Active
            </span>
          </div>

          <div>
            <h2 className="text-sm sm:text-base lg:text-lg font-extrabold tracking-tight text-foreground leading-tight">
              Member Impact &amp; Multi-Dimensional Reputation
            </h2>
            <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed max-w-xl">
              Synthesize community, learning, event, and mentorship engagement into
              a standardized reputation metric with weekly decay.
            </p>
          </div>

          {/* Quick jump navigation chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <Link href="/gamification/impact-score/members">
              <div className="group flex items-center gap-1.5 rounded-lg bg-background/80 hover:bg-emerald-500/10 border border-border/80 hover:border-emerald-500/30 px-2 py-0.5 transition-all cursor-pointer shadow-2xs">
                <div className="h-3.5 w-3.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Users className="h-2 w-2" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 block leading-tight">
                    Members
                  </span>
                </div>
                <ArrowRight className="h-2 w-2 text-muted-foreground group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all ml-0.5" />
              </div>
            </Link>

            <Link href="/gamification/impact-score/rules">
              <div className="group flex items-center gap-1.5 rounded-lg bg-background/80 hover:bg-indigo-500/10 border border-border/80 hover:border-indigo-500/30 px-2 py-0.5 transition-all cursor-pointer shadow-2xs">
                <div className="h-3.5 w-3.5 rounded bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Sliders className="h-2 w-2" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block leading-tight">
                    Rules
                  </span>
                </div>
                <ArrowRight className="h-2 w-2 text-muted-foreground group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all ml-0.5" />
              </div>
            </Link>

            <Link href="/gamification/impact-score/settings">
              <div className="group flex items-center gap-1.5 rounded-lg bg-background/80 hover:bg-purple-500/10 border border-border/80 hover:border-purple-500/30 px-2 py-0.5 transition-all cursor-pointer shadow-2xs">
                <div className="h-3.5 w-3.5 rounded bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Award className="h-2 w-2" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] font-bold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 block leading-tight">
                    Templates
                  </span>
                </div>
                <ArrowRight className="h-2 w-2 text-muted-foreground group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all ml-0.5" />
              </div>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1.5 min-w-[180px] shrink-0">
          <div className="rounded-lg border border-border/70 bg-background/60 backdrop-blur-xs p-1.5 px-2 flex items-center gap-2 shadow-2xs">
            <div className="h-6 w-6 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <TrendingUp className="h-3 w-3" />
            </div>
            <div>
              <span className="text-[8px] uppercase font-bold text-muted-foreground tracking-wider block">
                Avg Score
              </span>
              <span className="text-xs font-extrabold text-foreground tabular-nums">
                {avgScore} pts
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-border/70 bg-background/60 backdrop-blur-xs p-1.5 px-2 flex items-center gap-2 shadow-2xs">
            <div className="h-6 w-6 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Zap className="h-3 w-3" />
            </div>
            <div>
              <span className="text-[8px] uppercase font-bold text-muted-foreground tracking-wider block">
                Latency
              </span>
              <span className="text-xs font-extrabold text-foreground tabular-nums">
                Real-Time Delta
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
