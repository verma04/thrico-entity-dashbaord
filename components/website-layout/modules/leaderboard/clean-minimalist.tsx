/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Flame, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: string | number;
  avatar?: string;
  role?: string;
  category?: string;
  change?: "up" | "down" | "neutral";
  stats?: { label: string; value: string }[];
  streak?: number;
  level?: number;
  tier?: string;
}

interface CleanMinimalistProps {
  content: {
    title?: string;
    description?: string;
    entries: LeaderboardEntry[];
  };
}

export const CleanMinimalist = ({ content }: CleanMinimalistProps) => {
  const { entries = [] } = content;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="rounded-2xl border border-border/70 bg-card shadow-2xs overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[64px_1fr_130px_110px] items-center px-6 py-3.5 border-b border-border/60 bg-muted/30 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <div className="text-center font-mono">Rank</div>
          <div>Contributor</div>
          <div className="text-center hidden sm:block">Activity / Tier</div>
          <div className="text-right">Score</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-border/50">
          {entries.map((entry, idx) => {
            const rank = entry.rank || idx + 1;
            const isTop3 = rank <= 3;

            return (
              <div
                key={entry.name + idx}
                className={cn(
                  "grid grid-cols-[64px_1fr_130px_110px] items-center px-6 py-3.5 transition-colors duration-150 hover:bg-muted/40 group",
                  rank === 1 && "bg-amber-500/[0.03] dark:bg-amber-500/[0.05]"
                )}
              >
                {/* Rank Badge */}
                <div className="flex justify-center">
                  <span
                    className={cn(
                      "font-mono text-xs font-bold px-2 py-0.5 rounded-md",
                      rank === 1
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 ring-1 ring-amber-400/30"
                        : rank === 2
                        ? "bg-slate-200/80 text-slate-800 dark:bg-zinc-800 dark:text-zinc-200 ring-1 ring-slate-300 dark:ring-zinc-700"
                        : rank === 3
                        ? "bg-amber-900/10 text-amber-900 dark:bg-amber-950/40 dark:text-amber-400 ring-1 ring-amber-600/20"
                        : "text-muted-foreground"
                    )}
                  >
                    #{rank < 10 ? `0${rank}` : rank}
                  </span>
                </div>

                {/* Contributor Avatar & Identity */}
                <div className="flex items-center gap-3.5 min-w-0 pr-2">
                  <div className="relative shrink-0">
                    <div className="h-9 w-9 rounded-full overflow-hidden border border-border/80 bg-muted shadow-2xs">
                      {entry.avatar ? (
                        <img
                          src={entry.avatar}
                          alt={entry.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-xs font-bold text-muted-foreground">
                          {entry.name?.slice(0, 2).toUpperCase() || "U"}
                        </div>
                      )}
                    </div>
                    {rank === 1 && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-amber-500 ring-2 ring-card" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {entry.name}
                      </span>
                      {entry.streak && entry.streak > 0 && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.2 rounded">
                          <Flame className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
                          {entry.streak}d
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {entry.role || entry.category || "Community Contributor"}
                    </p>
                  </div>
                </div>

                {/* Activity / Tier Indicator */}
                <div className="text-center hidden sm:flex items-center justify-center gap-1.5">
                  <span className="text-[11px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full border border-border/50 truncate max-w-[110px]">
                    {entry.tier || (entry.level ? `Lvl ${entry.level}` : isTop3 ? "Top Tier" : "Active")}
                  </span>
                </div>

                {/* Points & Delta */}
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="text-xs font-bold text-foreground font-mono">
                      {typeof entry.score === "number" ? entry.score.toLocaleString() : entry.score}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium">pts</span>
                  </div>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    {entry.change === "up" ? (
                      <span className="inline-flex items-center text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <ArrowUpRight className="h-3 w-3" />
                        <span>Up</span>
                      </span>
                    ) : entry.change === "down" ? (
                      <span className="inline-flex items-center text-[10px] font-semibold text-rose-500">
                        <ArrowDownRight className="h-3 w-3" />
                        <span>Down</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[10px] text-muted-foreground">
                        <Minus className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
