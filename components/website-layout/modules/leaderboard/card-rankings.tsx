"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Crown, Flame, Sparkles } from "lucide-react";
import {
  EmptyBoard,
  LbAvatar,
  LeaderboardVariantProps,
  TrendIcon,
  enter,
  formatScore,
  percentOfLeader,
  rankOf,
  subtitleOf,
} from "./shared";

const ACCENT: Record<number, { ring: string; chip: string; bar: string }> = {
  1: { ring: "ring-amber-400/60", chip: "bg-amber-400 text-amber-950", bar: "bg-amber-400" },
  2: { ring: "ring-zinc-300/70 dark:ring-zinc-500/60", chip: "bg-zinc-300 text-zinc-900", bar: "bg-zinc-400" },
  3: { ring: "ring-orange-300/70 dark:ring-orange-500/50", chip: "bg-orange-300 text-orange-950", bar: "bg-orange-400" },
};

/**
 * Bento Cards — the leader gets a hero tile, everyone else a compact card.
 * 1 col → 2 cols → 3 cols based on the container width.
 */
export const CardRankings = ({ content }: LeaderboardVariantProps) => {
  const entries = content.entries ?? [];
  if (!entries.length) return <EmptyBoard />;
  const [leader, ...rest] = entries;
  const leaderSub = subtitleOf(leader);

  return (
    <div className="@container mx-auto w-full max-w-6xl">
      <div className="grid grid-cols-1 gap-3 @lg:grid-cols-2 @4xl:grid-cols-3">
        {/* Hero tile */}
        <article
          style={enter(0).style}
          className={cn(
            enter(0).className,
            "relative overflow-hidden rounded-2xl border border-amber-400/40 bg-card p-5 shadow-2xs @lg:col-span-2 @4xl:row-span-2 @4xl:col-span-1",
          )}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-400/20 blur-3xl"
          />
          <div className="relative flex h-full flex-col gap-5 @lg:flex-row @lg:items-center @4xl:flex-col @4xl:items-start @4xl:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <LbAvatar
                  src={leader.avatar}
                  name={leader.name}
                  className="h-16 w-16 rounded-2xl ring-2 ring-amber-400/70 @sm:h-20 @sm:w-20"
                  fallbackClassName="text-lg"
                />
                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-amber-950 shadow-md">
                  <Crown className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-600 dark:text-amber-400">
                  Rank #{rankOf(leader, 0)} · Leader
                </p>
                <h4 className="truncate text-lg font-bold text-foreground @sm:text-xl">
                  {leader.name}
                </h4>
                {leaderSub && (
                  <p className="truncate text-xs text-muted-foreground">{leaderSub}</p>
                )}
              </div>
            </div>

            <div className="@lg:ml-auto @4xl:ml-0 @4xl:w-full">
              <div className="flex items-end gap-1.5">
                <span className="text-3xl font-black tabular-nums tracking-tight text-foreground @sm:text-4xl">
                  {formatScore(leader.score)}
                </span>
                <span className="pb-1 text-xs font-medium text-muted-foreground">pts</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {!!leader.streak && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-2 py-0.5 text-[11px] font-semibold text-orange-600 dark:text-orange-400">
                    <Flame className="h-3 w-3" /> {leader.streak} day streak
                  </span>
                )}
                {!!leader.level && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                    <Sparkles className="h-3 w-3" /> Level {leader.level}
                  </span>
                )}
                {leader.tier && leader.tier !== leaderSub && (
                  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                    {leader.tier}
                  </span>
                )}
              </div>
            </div>
          </div>
        </article>

        {/* Remaining cards */}
        {rest.map((entry, i) => {
          const idx = i + 1;
          const rank = rankOf(entry, idx);
          const accent = ACCENT[rank];
          const sub = subtitleOf(entry);
          const anim = enter(idx);

          return (
            <article
              key={`${entry.name}-${rank}`}
              style={anim.style}
              className={cn(
                anim.className,
                "group flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-3.5 shadow-2xs transition-all hover:-translate-y-0.5 hover:border-border hover:shadow-sm",
              )}
            >
              <div className="relative">
                <LbAvatar
                  src={entry.avatar}
                  name={entry.name}
                  className={cn("h-11 w-11 rounded-xl ring-1 ring-border", accent?.ring && `ring-2 ${accent.ring}`)}
                  fallbackClassName="text-xs"
                />
                <span
                  className={cn(
                    "absolute -bottom-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold tabular-nums ring-2 ring-card",
                    accent?.chip ?? "bg-muted text-muted-foreground",
                  )}
                >
                  {rank}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-foreground">
                    {entry.name}
                  </span>
                  <span className="flex shrink-0 items-center gap-0.5 text-sm font-bold tabular-nums text-foreground">
                    <TrendIcon change={entry.change} className="h-3 w-3" />
                    {formatScore(entry.score)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs text-muted-foreground">
                    {sub || (entry.level ? `Level ${entry.level}` : "")}
                  </span>
                  {!!entry.streak && (
                    <span className="inline-flex shrink-0 items-center gap-0.5 text-[10px] font-semibold text-orange-600 dark:text-orange-400">
                      <Flame className="h-2.5 w-2.5" />
                      {entry.streak}
                    </span>
                  )}
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full", accent?.bar ?? "bg-foreground/25")}
                    style={{ width: `${percentOfLeader(entry, leader)}%` }}
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
