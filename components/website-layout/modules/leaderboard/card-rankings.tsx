/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Trophy, Medal, Star, Zap, Shield, Target, Flame, ArrowUpRight } from "lucide-react";
import { LeaderboardEntry } from "./clean-minimalist";

interface CardRankingsProps {
  content: {
    title?: string;
    description?: string;
    entries: LeaderboardEntry[];
  };
}

export const CardRankings = ({ content }: CardRankingsProps) => {
  const { entries = [] } = content;

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {entries.map((entry, idx) => {
          const rank = entry.rank || idx + 1;
          const isGold = rank === 1;
          const isSilver = rank === 2;
          const isBronze = rank === 3;

          return (
            <div
              key={entry.name + idx}
              className={cn(
                "group relative rounded-2xl border p-5 bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-md shadow-2xs flex flex-col justify-between",
                isGold
                  ? "border-amber-400/60 dark:border-amber-500/40 bg-linear-to-b from-amber-500/[0.04] to-card"
                  : isSilver
                  ? "border-slate-300 dark:border-zinc-700 bg-linear-to-b from-slate-200/[0.05] to-card"
                  : isBronze
                  ? "border-amber-700/30 dark:border-amber-700/40 bg-linear-to-b from-amber-700/[0.03] to-card"
                  : "border-border/70 hover:border-border"
              )}
            >
              {/* Top Watermark Rank */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5">
                {isGold ? (
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-white shadow-2xs">
                    <Trophy className="h-4 w-4 fill-white" />
                  </span>
                ) : isSilver ? (
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-300 dark:bg-zinc-700 text-slate-800 dark:text-zinc-100 shadow-2xs">
                    <Medal className="h-4 w-4" />
                  </span>
                ) : isBronze ? (
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-800/80 text-white shadow-2xs">
                    <Medal className="h-4 w-4" />
                  </span>
                ) : (
                  <span className="font-mono text-sm font-black text-muted-foreground/60 select-none">
                    #{rank}
                  </span>
                )}
              </div>

              {/* Avatar + Main Identity */}
              <div>
                <div className="flex items-center gap-3.5 mb-4 pr-10">
                  <div className="relative shrink-0">
                    <div
                      className={cn(
                        "h-13 w-13 rounded-2xl overflow-hidden border-2 bg-muted shadow-2xs",
                        isGold
                          ? "border-amber-400 ring-2 ring-amber-400/20"
                          : isSilver
                          ? "border-slate-300 dark:border-zinc-600"
                          : isBronze
                          ? "border-amber-700/50"
                          : "border-border"
                      )}
                    >
                      {entry.avatar ? (
                        <img
                          src={entry.avatar}
                          alt={entry.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-sm font-bold text-muted-foreground">
                          {entry.name?.slice(0, 2).toUpperCase() || "U"}
                        </div>
                      )}
                    </div>

                    {isGold && (
                      <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-xs">
                        1
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                      {entry.name}
                    </h4>
                    <span className="inline-block text-[10px] font-semibold text-primary uppercase tracking-wider mt-0.5">
                      {entry.role || entry.category || "Contributor"}
                    </span>
                  </div>
                </div>

                {/* Score Banner */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/60">
                  <div className="flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold font-mono text-foreground">
                      {typeof entry.score === "number" ? entry.score.toLocaleString() : entry.score}
                    </span>
                    <span className="text-[10px] text-muted-foreground">pts</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {entry.tier || (entry.level ? `Tier ${entry.level}` : `Rank #${rank}`)}
                  </span>
                </div>
              </div>

              {/* Badges / Micro Stats Footer */}
              <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Shield className="h-3 w-3" />
                  </div>
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Zap className="h-3 w-3" />
                  </div>
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Target className="h-3 w-3" />
                  </div>
                </div>

                {entry.streak && entry.streak > 0 ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-300/40">
                    <Flame className="h-2.5 w-2.5 fill-amber-500" />
                    {entry.streak}d streak
                  </span>
                ) : (
                  <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-0.5">
                    <ArrowUpRight className="h-2.5 w-2.5" />
                    Active
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
