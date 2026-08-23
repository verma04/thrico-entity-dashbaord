"use client";

import React from "react";
import Link from "next/link";
import {
  Trophy,
  Coins,
  Award,
  Crown,
  Sparkles,
  ArrowRight,
  Zap,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface GamificationBannerProps {
  totalUsers?: number;
  totalPoints?: number;
  totalBadges?: number;
  loading?: boolean;
}

export const GamificationBanner: React.FC<GamificationBannerProps> = ({
  totalUsers = 342,
  totalPoints = 84500,
  totalBadges = 124,
  loading = false,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/40 p-4 sm:p-5 shadow-xs">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-1/3 -bottom-16 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-12 top-1/2 h-36 w-36 rounded-full bg-purple-500/10 blur-2xl" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.04] dark:opacity-[0.08]" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-2.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Trophy className="h-3 w-3" />
              Reputation Engine
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-2.5 w-2.5" />
              Active
            </span>
          </div>

          <div>
            <h2 className="text-base sm:text-lg lg:text-xl font-extrabold tracking-tight text-foreground leading-snug">
              Points, Badges &amp; Progression System
            </h2>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed max-w-xl">
              Drive participation and retention with automated point triggers,
              achievement badges, milestone tiers, and real-time leaderboards.
            </p>
          </div>

          {/* Quick jump navigation chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <Link href="/gamification/points-and-badges/points">
              <div className="group flex items-center gap-1.5 rounded-lg bg-background/80 hover:bg-amber-500/10 border border-border/80 hover:border-amber-500/30 px-2.5 py-1 transition-all cursor-pointer shadow-2xs">
                <div className="h-4 w-4 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Coins className="h-2.5 w-2.5" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] font-bold text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 block leading-tight">
                    Point Rules
                  </span>
                  <span className="text-[8px] text-muted-foreground block leading-none">
                    Triggers
                  </span>
                </div>
                <ArrowRight className="h-2.5 w-2.5 text-muted-foreground group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all ml-0.5" />
              </div>
            </Link>

            <Link href="/gamification/points-and-badges/badges">
              <div className="group flex items-center gap-1.5 rounded-lg bg-background/80 hover:bg-purple-500/10 border border-border/80 hover:border-purple-500/30 px-2.5 py-1 transition-all cursor-pointer shadow-2xs">
                <div className="h-4 w-4 rounded bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Award className="h-2.5 w-2.5" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] font-bold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 block leading-tight">
                    Badges
                  </span>
                  <span className="text-[8px] text-muted-foreground block leading-none">
                    Icons
                  </span>
                </div>
                <ArrowRight className="h-2.5 w-2.5 text-muted-foreground group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all ml-0.5" />
              </div>
            </Link>

            <Link href="/gamification/points-and-badges/ranks">
              <div className="group flex items-center gap-1.5 rounded-lg bg-background/80 hover:bg-indigo-500/10 border border-border/80 hover:border-indigo-500/30 px-2.5 py-1 transition-all cursor-pointer shadow-2xs">
                <div className="h-4 w-4 rounded bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Crown className="h-2.5 w-2.5" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 block leading-tight">
                    Tier Ranks
                  </span>
                  <span className="text-[8px] text-muted-foreground block leading-none">
                    Levels
                  </span>
                </div>
                <ArrowRight className="h-2.5 w-2.5 text-muted-foreground group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all ml-0.5" />
              </div>
            </Link>

            <Link href="/gamification/points-and-badges/leaderboard">
              <div className="group flex items-center gap-1.5 rounded-lg bg-background/80 hover:bg-rose-500/10 border border-border/80 hover:border-rose-500/30 px-2.5 py-1 transition-all cursor-pointer shadow-2xs">
                <div className="h-4 w-4 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <Trophy className="h-2.5 w-2.5" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] font-bold text-foreground group-hover:text-rose-600 dark:group-hover:text-rose-400 block leading-tight">
                    Leaderboard
                  </span>
                  <span className="text-[8px] text-muted-foreground block leading-none">
                    Ranking
                  </span>
                </div>
                <ArrowRight className="h-2.5 w-2.5 text-muted-foreground group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all ml-0.5" />
              </div>
            </Link>
          </div>
        </div>

        {/* Right Metric Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2 min-w-[200px] shrink-0">
          <div className="rounded-lg border border-border/70 bg-background/60 backdrop-blur-xs p-2 px-2.5 flex items-center gap-2 shadow-2xs">
            <div className="h-7 w-7 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Zap className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="text-[8px] uppercase font-bold text-muted-foreground tracking-wider block">
                Points Velocity
              </span>
              <span className="text-xs font-bold text-foreground tabular-nums">
                Instant Trigger
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-border/70 bg-background/60 backdrop-blur-xs p-2 px-2.5 flex items-center gap-2 shadow-2xs">
            <div className="h-7 w-7 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="text-[8px] uppercase font-bold text-muted-foreground tracking-wider block">
                Participation Lift
              </span>
              <span className="text-xs font-bold text-foreground tabular-nums">
                +42.6% DAU
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-border/70 bg-background/60 backdrop-blur-xs p-2 px-2.5 flex items-center gap-2 shadow-2xs col-span-2 sm:col-span-1 lg:col-span-1">
            <div className="h-7 w-7 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="text-[8px] uppercase font-bold text-muted-foreground tracking-wider block">
                Anti-Abuse Guard
              </span>
              <span className="text-xs font-bold text-foreground tabular-nums">
                Rate-Capped
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
