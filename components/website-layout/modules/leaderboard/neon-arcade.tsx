"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  EmptyBoard,
  LbAvatar,
  LeaderboardVariantProps,
  enter,
  formatScore,
  ordinal,
  percentOfLeader,
  rankOf,
  subtitleOf,
} from "./shared";

const PLACE_COLOR: Record<number, string> = {
  1: "text-yellow-300 [text-shadow:0_0_12px_rgba(253,224,71,0.7)]",
  2: "text-cyan-300 [text-shadow:0_0_12px_rgba(103,232,249,0.6)]",
  3: "text-fuchsia-300 [text-shadow:0_0_12px_rgba(240,171,252,0.6)]",
};

/**
 * Cyber Arcade — a dark CRT "HIGH SCORES" cabinet. Always dark by design,
 * with scanlines, neon place numbers and XP rails.
 */
export const NeonArcade = ({ content }: LeaderboardVariantProps) => {
  const entries = content.entries ?? [];
  if (!entries.length) return <EmptyBoard />;
  const leader = entries[0];

  return (
    <div className="@container mx-auto w-full max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl border border-cyan-400/25 bg-[#07060f] p-3 font-mono text-white shadow-[0_0_0_1px_rgba(34,211,238,0.08),0_20px_60px_-20px_rgba(217,70,239,0.35)] @md:p-6">
        {/* Scanlines + glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07] [background:repeating-linear-gradient(0deg,#fff_0px,#fff_1px,transparent_1px,transparent_3px)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-48 w-3/4 -translate-x-1/2 rounded-full bg-fuchsia-500/25 blur-3xl"
        />

        <div className="relative mb-4 flex items-center justify-between gap-3 border-b border-dashed border-cyan-400/25 pb-3">
          <h4 className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-300 [text-shadow:0_0_10px_rgba(103,232,249,0.6)] @md:text-base">
            High Scores
          </h4>
          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-fuchsia-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-fuchsia-400 shadow-[0_0_8px_rgba(232,121,249,0.9)]" />
            Live
          </span>
        </div>

        <ol className="relative space-y-1.5">
          {entries.map((entry, idx) => {
            const rank = rankOf(entry, idx);
            const sub = subtitleOf(entry);
            const anim = enter(idx);
            return (
              <li
                key={`${entry.name}-${rank}`}
                style={anim.style}
                className={cn(
                  anim.className,
                  "grid grid-cols-[2.75rem_1fr_auto] items-center gap-2.5 rounded-lg border border-white/5 bg-white/[0.03] px-2.5 py-2 transition-colors hover:border-cyan-400/30 hover:bg-cyan-400/[0.05] @md:grid-cols-[3.5rem_1fr_auto] @md:gap-4 @md:px-4",
                  rank === 1 && "border-yellow-300/30 bg-yellow-300/[0.05]",
                )}
              >
                <span
                  className={cn(
                    "text-sm font-black uppercase tabular-nums @md:text-base",
                    PLACE_COLOR[rank] ?? "text-white/45",
                  )}
                >
                  {ordinal(rank)}
                </span>

                <div className="flex min-w-0 items-center gap-2.5">
                  <LbAvatar
                    src={entry.avatar}
                    name={entry.name}
                    className="hidden h-8 w-8 rounded-md bg-white/10 ring-1 ring-white/15 @xs:block"
                    fallbackClassName="text-[10px] text-white/70"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-xs font-bold uppercase tracking-wider text-white @md:text-sm">
                        {entry.name}
                      </span>
                      {!!entry.level && (
                        <span className="hidden shrink-0 rounded border border-cyan-400/40 px-1 text-[9px] font-bold text-cyan-300 @sm:inline">
                          LV{entry.level}
                        </span>
                      )}
                      {!!entry.streak && (
                        <span className="hidden shrink-0 rounded border border-fuchsia-400/40 px-1 text-[9px] font-bold text-fuchsia-300 @sm:inline">
                          x{entry.streak}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-1 flex-1 overflow-hidden rounded-sm bg-white/10">
                        <div
                          className="h-full bg-linear-to-r from-cyan-400 via-fuchsia-400 to-yellow-300 shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                          style={{ width: `${percentOfLeader(entry, leader)}%` }}
                        />
                      </div>
                      {sub && (
                        <span className="hidden max-w-32 truncate text-[10px] uppercase text-white/40 @lg:inline">
                          {sub}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <span className="text-right text-sm font-bold tabular-nums text-yellow-200 [text-shadow:0_0_10px_rgba(253,224,71,0.45)] @md:text-lg">
                  {formatScore(entry.score)}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};
