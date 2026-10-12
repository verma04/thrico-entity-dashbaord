/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { Crown, Trophy, Medal, Star } from "lucide-react";
import { LeaderboardEntry } from "./clean-minimalist";

interface PodiumViewProps {
  content: {
    title?: string;
    description?: string;
    entries: LeaderboardEntry[];
  };
}

export const PodiumView = ({ content }: PodiumViewProps) => {
  const { entries = [] } = content;

  const first = entries.find((e) => e.rank === 1) || entries[0];
  const second = entries.find((e) => e.rank === 2) || entries[1];
  const third = entries.find((e) => e.rank === 3) || entries[2];
  const runnersUp = entries.filter((e) => e.rank > 3).slice(0, 7);

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Top 3 Podium Stage */}
      <div className="flex flex-col md:flex-row items-end justify-center gap-6 md:gap-4 pt-10 pb-6">
        {/* 2nd Place (Left) */}
        {second && (
          <div className="w-full md:w-60 flex flex-col items-center order-2 md:order-1">
            <div className="mb-4 text-center px-2 w-full">
              <div className="relative mx-auto mb-3 w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-300 dark:border-zinc-600 bg-muted shadow-md group">
                {second.avatar ? (
                  <img
                    src={second.avatar}
                    alt={second.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg font-bold text-muted-foreground">
                    {second.name?.slice(0, 2).toUpperCase() || "2"}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 px-1.5 py-0.5 rounded-tl-lg bg-slate-300 dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 font-mono text-[10px] font-bold">
                  #2
                </span>
              </div>
              <div className="text-xs font-bold text-foreground truncate w-full">
                {second.name}
              </div>
              <div className="text-[11px] font-semibold text-muted-foreground font-mono mt-0.5">
                {typeof second.score === "number" ? second.score.toLocaleString() : second.score} pts
              </div>
            </div>

            {/* Pedestal Block */}
            <div className="w-full h-36 rounded-t-2xl border-t-2 border-x border-slate-300 dark:border-zinc-700 bg-linear-to-b from-slate-200/50 via-slate-100/30 to-muted/20 dark:from-zinc-800/80 dark:to-zinc-900/60 flex flex-col items-center justify-center relative shadow-sm">
              <Medal className="h-8 w-8 text-slate-400 dark:text-zinc-500 mb-1" />
              <span className="text-sm font-extrabold uppercase tracking-widest text-slate-600 dark:text-zinc-400">
                2nd
              </span>
            </div>
          </div>
        )}

        {/* 1st Place (Center, Tallest) */}
        {first && (
          <div className="w-full md:w-72 flex flex-col items-center order-1 md:order-2 -mt-6 md:-mt-10 z-10">
            <div className="mb-4 text-center px-2 w-full relative">
              {/* Crown Badge */}
              <div className="inline-flex items-center justify-center mb-1 text-amber-500 animate-bounce">
                <Crown className="h-7 w-7 fill-amber-400 drop-shadow-sm" />
              </div>

              <div className="relative mx-auto mb-3 w-24 h-24 rounded-3xl overflow-hidden border-3 border-amber-400 bg-muted shadow-lg ring-4 ring-amber-400/20 group">
                {first.avatar ? (
                  <img
                    src={first.avatar}
                    alt={first.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl font-bold text-amber-700 dark:text-amber-300">
                    {first.name?.slice(0, 2).toUpperCase() || "1"}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 px-2 py-0.5 rounded-tl-lg bg-amber-500 text-white font-mono text-[11px] font-bold shadow-xs">
                  #1 Winner
                </span>
              </div>

              <div className="text-sm font-extrabold text-foreground tracking-tight truncate w-full">
                {first.name}
              </div>
              <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 font-mono mt-0.5 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-300/40">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                {typeof first.score === "number" ? first.score.toLocaleString() : first.score} pts
              </div>
            </div>

            {/* Pedestal Block */}
            <div className="w-full h-48 rounded-t-3xl border-t-2 border-x border-amber-400/80 bg-linear-to-b from-amber-400/20 via-amber-300/10 to-card dark:from-amber-500/20 dark:via-amber-950/40 dark:to-zinc-900/80 flex flex-col items-center justify-center relative shadow-md">
              <Trophy className="h-10 w-10 text-amber-500 mb-1" />
              <span className="text-base font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
                Champion
              </span>
            </div>
          </div>
        )}

        {/* 3rd Place (Right) */}
        {third && (
          <div className="w-full md:w-60 flex flex-col items-center order-3">
            <div className="mb-4 text-center px-2 w-full">
              <div className="relative mx-auto mb-3 w-18 h-18 rounded-2xl overflow-hidden border-2 border-amber-700/50 bg-muted shadow-md group">
                {third.avatar ? (
                  <img
                    src={third.avatar}
                    alt={third.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-base font-bold text-muted-foreground">
                    {third.name?.slice(0, 2).toUpperCase() || "3"}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 px-1.5 py-0.5 rounded-tl-lg bg-amber-800 text-white font-mono text-[10px] font-bold">
                  #3
                </span>
              </div>
              <div className="text-xs font-bold text-foreground truncate w-full">
                {third.name}
              </div>
              <div className="text-[11px] font-semibold text-muted-foreground font-mono mt-0.5">
                {typeof third.score === "number" ? third.score.toLocaleString() : third.score} pts
              </div>
            </div>

            {/* Pedestal Block */}
            <div className="w-full h-28 rounded-t-2xl border-t-2 border-x border-amber-700/40 bg-linear-to-b from-amber-800/10 via-amber-900/5 to-card dark:from-amber-950/40 dark:to-zinc-900/60 flex flex-col items-center justify-center relative shadow-sm">
              <Medal className="h-7 w-7 text-amber-700 dark:text-amber-600 mb-1" />
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-800 dark:text-amber-500">
                3rd
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Runners-up List */}
      {runnersUp.length > 0 && (
        <div className="mt-8 pt-6 border-t border-border/70">
          <div className="flex items-center justify-between mb-4 px-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Honorable Mentions
            </h5>
            <span className="text-[11px] text-muted-foreground font-medium">
              Ranks 4 – {3 + runnersUp.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {runnersUp.map((runner, rIdx) => (
              <div
                key={runner.name + rIdx}
                className="flex items-center gap-3 p-2.5 rounded-xl border border-border/60 bg-card hover:bg-muted/30 transition-colors shadow-2xs group"
              >
                <span className="font-mono text-xs font-bold text-muted-foreground w-6 text-center">
                  #{runner.rank || 4 + rIdx}
                </span>

                <div className="h-8 w-8 rounded-full overflow-hidden bg-muted border border-border shrink-0">
                  {runner.avatar ? (
                    <img
                      src={runner.avatar}
                      alt={runner.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                      {runner.name?.slice(0, 2).toUpperCase() || "U"}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {runner.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    {runner.role || runner.category || "Contributor"}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold font-mono text-foreground">
                    {typeof runner.score === "number" ? runner.score.toLocaleString() : runner.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
