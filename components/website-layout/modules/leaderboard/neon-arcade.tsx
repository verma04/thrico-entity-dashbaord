/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Gamepad2, Zap, Flame, Crown } from "lucide-react";
import { LeaderboardEntry } from "./clean-minimalist";

interface NeonArcadeProps {
  content: {
    title?: string;
    description?: string;
    entries: LeaderboardEntry[];
  };
}

export const NeonArcade = ({ content }: NeonArcadeProps) => {
  const { entries = [] } = content;

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Outer Cyber Arcade Frame */}
      <div className="relative rounded-3xl border border-cyan-500/30 bg-[#090d16] text-white p-5 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Arcade Status Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-cyan-500/20">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <Gamepad2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-cyan-400">
                  {"// ARCADE RANKINGS SYSTEM"}
                </span>
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <h4 className="text-base font-black tracking-wider uppercase text-white font-mono">
                COMPETITIVE ARENA
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
              ACTIVE PLAYERS: <strong className="text-cyan-400">{entries.length}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-300 flex items-center gap-1">
              <Zap className="h-3 w-3 fill-fuchsia-400" /> 2X XP LIVE
            </span>
          </div>
        </div>

        {/* Players Stream */}
        <div className="relative z-10 space-y-3">
          {entries.map((entry, idx) => {
            const rank = entry.rank || idx + 1;
            const isChampion = rank === 1;
            const isTop3 = rank <= 3;
            const xpPercent = Math.max(15, Math.min(100, 100 - (rank - 1) * 12));

            return (
              <div
                key={entry.name + idx}
                className={cn(
                  "group relative rounded-2xl p-4 transition-all duration-300 border flex flex-col md:flex-row md:items-center justify-between gap-4",
                  isChampion
                    ? "bg-linear-to-r from-cyan-950/40 via-[#0e1628] to-fuchsia-950/30 border-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.2)] hover:border-cyan-300"
                    : isTop3
                    ? "bg-[#0c1220]/80 border-slate-700/80 hover:border-cyan-500/40 hover:bg-[#0f172a]"
                    : "bg-[#090d16]/80 border-white/5 hover:border-white/20 hover:bg-[#0d1322]"
                )}
              >
                {/* Left: Rank + Avatar + Identity */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  {/* Neon Rank Badge */}
                  <div className="shrink-0 flex items-center justify-center">
                    <span
                      className={cn(
                        "font-mono font-black text-xs px-2.5 py-1 rounded-xl border flex items-center justify-center min-w-[38px]",
                        isChampion
                          ? "bg-cyan-500 text-slate-950 border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                          : rank === 2
                          ? "bg-slate-200 text-slate-900 border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                          : rank === 3
                          ? "bg-amber-600 text-white border-amber-400 shadow-[0_0_10px_rgba(217,119,6,0.3)]"
                          : "bg-white/5 text-slate-400 border-white/10"
                      )}
                    >
                      {isChampion ? (
                        <Crown className="h-3.5 w-3.5 fill-slate-950" />
                      ) : (
                        `#${rank}`
                      )}
                    </span>
                  </div>

                  {/* Avatar with Neon Halo */}
                  <div className="relative shrink-0">
                    <div
                      className={cn(
                        "h-12 w-12 rounded-xl overflow-hidden border-2 bg-slate-900",
                        isChampion
                          ? "border-cyan-400 ring-2 ring-cyan-400/40"
                          : isTop3
                          ? "border-fuchsia-400/80"
                          : "border-slate-700"
                      )}
                    >
                      {entry.avatar ? (
                        <img
                          src={entry.avatar}
                          alt={entry.name}
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center font-mono font-bold text-xs text-cyan-400">
                          {entry.name?.slice(0, 2).toUpperCase() || "PX"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Player Name + Gamertag / Role */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white truncate group-hover:text-cyan-300 transition-colors">
                        {entry.name}
                      </span>
                      {entry.streak && entry.streak > 0 && (
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded">
                          <Flame className="h-3 w-3 fill-amber-400" />
                          {entry.streak}x
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-mono text-cyan-400/80 uppercase">
                        {entry.role || entry.category || (isChampion ? "APEX CHAMPION" : "CONTRIBUTOR")}
                      </span>
                      <span className="text-[10px] text-slate-500">•</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        LVL {entry.level || 40 - rank * 2}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: XP Bar & Score */}
                <div className="flex flex-col md:items-end justify-center min-w-[200px]">
                  <div className="flex items-center justify-between md:justify-end gap-3 w-full mb-1.5">
                    <span className="text-[10px] font-mono uppercase text-slate-400">
                      XP PROGRESS
                    </span>
                    <div className="flex items-center gap-1 font-mono">
                      <span className="text-base font-black text-cyan-300">
                        {typeof entry.score === "number" ? entry.score.toLocaleString() : entry.score}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">XP</span>
                    </div>
                  </div>

                  {/* Cyber Meter */}
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden border border-white/5">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        isChampion
                          ? "bg-linear-to-r from-cyan-400 via-fuchsia-400 to-amber-300 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                          : isTop3
                          ? "bg-linear-to-r from-cyan-400 to-fuchsia-500"
                          : "bg-cyan-500/60"
                      )}
                      style={{ width: `${xpPercent}%` }}
                    />
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
