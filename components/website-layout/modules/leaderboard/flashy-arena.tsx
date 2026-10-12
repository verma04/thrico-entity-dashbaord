/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Crown, Flame, Award } from "lucide-react";
import { LeaderboardEntry } from "./clean-minimalist";

interface FlashyArenaProps {
  content: {
    title?: string;
    description?: string;
    entries: LeaderboardEntry[];
  };
}

export const FlashyArena = ({ content }: FlashyArenaProps) => {
  const { entries = [] } = content;

  const topThree = entries.slice(0, 3);
  const remaining = entries.slice(3);

  const getTierBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return { label: "MYTHIC LEGEND", color: "from-amber-400 to-rose-500 text-amber-950" };
      case 2:
        return { label: "GRANDMASTER", color: "from-slate-200 to-indigo-300 text-slate-900" };
      case 3:
        return { label: "IMMORTAL", color: "from-amber-700 to-amber-500 text-white" };
      default:
        return { label: "DIAMOND ELITE", color: "from-indigo-400 to-cyan-400 text-slate-950" };
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Top 3 VIP Arena Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {topThree.map((entry, idx) => {
          const rank = entry.rank || idx + 1;
          const isWinner = rank === 1;
          const tier = getTierBadge(rank);

          return (
            <div
              key={entry.name + idx}
              className={cn(
                "relative rounded-3xl p-[2px] transition-all duration-500 group hover:-translate-y-2 hover:shadow-2xl",
                isWinner
                  ? "bg-linear-to-r from-amber-400 via-rose-500 to-indigo-500 shadow-[0_0_40px_rgba(245,158,11,0.25)] order-1 md:order-2 md:-mt-4"
                  : rank === 2
                  ? "bg-linear-to-r from-slate-400 via-indigo-300 to-slate-200 order-2 md:order-1"
                  : "bg-linear-to-r from-amber-600 via-orange-400 to-amber-700 order-3"
              )}
            >
              {/* Inner Card */}
              <div className="relative h-full rounded-[22px] bg-slate-950/90 backdrop-blur-xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden text-white border border-white/10">
                {/* Background Hologram Mesh */}
                <div
                  className={cn(
                    "absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[70px] pointer-events-none",
                    isWinner
                      ? "bg-amber-400/25"
                      : rank === 2
                      ? "bg-indigo-400/20"
                      : "bg-orange-500/20"
                  )}
                />

                {/* Top Badge: Rank & Tier */}
                <div className="relative z-10 flex items-center justify-between mb-6">
                  <span
                    className={cn(
                      "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-linear-to-r shadow-xs font-mono",
                      tier.color
                    )}
                  >
                    {tier.label}
                  </span>

                  <div className="flex items-center gap-1">
                    <span className="font-mono text-xs font-black text-white/50">RANK</span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/10 border border-white/20 font-black text-sm">
                      #{rank}
                    </span>
                  </div>
                </div>

                {/* Center Avatar & Crown */}
                <div className="relative z-10 flex flex-col items-center text-center my-4">
                  <div className="relative mb-4">
                    {isWinner && (
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center justify-center animate-bounce">
                        <Crown className="h-8 w-8 text-amber-400 fill-amber-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]" />
                      </div>
                    )}

                    <div
                      className={cn(
                        "rounded-3xl overflow-hidden p-1 bg-linear-to-b shadow-xl",
                        isWinner
                          ? "w-24 h-24 from-amber-300 via-rose-400 to-indigo-500 ring-4 ring-amber-400/30"
                          : rank === 2
                          ? "w-20 h-20 from-slate-200 to-indigo-400"
                          : "w-20 h-20 from-amber-500 to-orange-600"
                      )}
                    >
                      <div className="w-full h-full rounded-[20px] overflow-hidden bg-slate-900 border border-white/20">
                        {entry.avatar ? (
                          <img
                            src={entry.avatar}
                            alt={entry.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-xl text-white">
                            {entry.name?.slice(0, 2).toUpperCase() || "VIP"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-black tracking-tight text-white group-hover:text-amber-300 transition-colors">
                    {entry.name}
                  </h3>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">
                    {entry.role || entry.category || "Community Champion"}
                  </p>
                </div>

                {/* Score & Achievements Banner */}
                <div className="relative z-10 mt-4 pt-5 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                      SCORE MATRIX
                    </span>
                    <span className="text-xl font-black font-mono text-transparent bg-clip-text bg-linear-to-r from-white via-amber-200 to-white">
                      {typeof entry.score === "number" ? entry.score.toLocaleString() : entry.score}
                    </span>
                  </div>

                  {entry.streak && entry.streak > 0 ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-300 font-mono text-xs font-bold">
                      <Flame className="h-4 w-4 fill-amber-400 text-amber-400 animate-pulse" />
                      <span>{entry.streak}d Streak</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                      <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ranks 4+ Metallic Tier List */}
      {remaining.length > 0 && (
        <div className="rounded-3xl border border-white/10 bg-slate-950/80 backdrop-blur-xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-indigo-400" />
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-300 font-mono">
                HALL OF FAME CONTENDERS
              </h4>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {remaining.length} CONTENDERS
            </span>
          </div>

          <div className="divide-y divide-white/5">
            {remaining.map((entry, idx) => {
              const rank = entry.rank || 4 + idx;

              return (
                <div
                  key={entry.name + idx}
                  className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-white/5 transition-colors duration-150 group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="font-mono text-xs font-black text-slate-500 w-8 text-center">
                      #{rank}
                    </span>

                    <div className="h-10 w-10 rounded-xl overflow-hidden bg-slate-800 border border-white/10 shrink-0">
                      {entry.avatar ? (
                        <img
                          src={entry.avatar}
                          alt={entry.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center font-bold text-xs text-slate-400">
                          {entry.name?.slice(0, 2).toUpperCase() || "U"}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                        {entry.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {entry.role || entry.category || "Elite Contender"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {entry.streak && entry.streak > 0 && (
                      <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        <Flame className="h-3 w-3 fill-amber-400" />
                        {entry.streak}d
                      </span>
                    )}

                    <div className="text-right font-mono">
                      <span className="text-sm font-black text-white">
                        {typeof entry.score === "number" ? entry.score.toLocaleString() : entry.score}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-1">pts</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
