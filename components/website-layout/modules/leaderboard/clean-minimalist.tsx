"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";
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

export type { LeaderboardEntry } from "./shared";

const MEDAL: Record<number, string> = {
  1: "bg-amber-400 text-amber-950",
  2: "bg-zinc-300 text-zinc-900 dark:bg-zinc-400",
  3: "bg-orange-300 text-orange-950 dark:bg-orange-400",
};

/**
 * Clean Minimalist — editorial ranking table.
 * Container-query driven so it adapts to sidebars, preview frames and full pages.
 */
export const CleanMinimalist = ({ content }: LeaderboardVariantProps) => {
  const entries = content.entries ?? [];
  if (!entries.length) return <EmptyBoard />;
  const leader = entries[0];

  return (
    <div className="@container mx-auto w-full max-w-4xl">
      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-2xs">
        {/* Column header (wide containers only) */}
        <div className="hidden grid-cols-[3rem_1fr_8rem_7rem] items-center gap-4 border-b border-border/60 bg-muted/30 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground @xl:grid">
          <span className="text-center">#</span>
          <span>Member</span>
          <span className="text-center">Tier</span>
          <span className="text-right">Points</span>
        </div>

        <ol className="divide-y divide-border/50">
          {entries.map((entry, idx) => {
            const rank = rankOf(entry, idx);
            const pct = percentOfLeader(entry, leader);
            const sub = subtitleOf(entry);
            const anim = enter(idx);

            return (
              <li
                key={`${entry.name}-${rank}`}
                style={anim.style}
                className={cn(
                  anim.className,
                  "group grid grid-cols-[2.25rem_1fr_auto] items-center gap-3 px-3.5 py-3 transition-colors hover:bg-muted/40 @sm:px-5 @xl:grid-cols-[3rem_1fr_8rem_7rem] @xl:gap-4",
                  rank === 1 && "bg-amber-500/[0.04]",
                )}
              >
                {/* Rank */}
                <div className="flex justify-center">
                  {rank <= 3 ? (
                    <span
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold tabular-nums shadow-2xs",
                        MEDAL[rank],
                      )}
                    >
                      {rank}
                    </span>
                  ) : (
                    <span className="text-sm font-semibold tabular-nums text-muted-foreground">
                      {rank}
                    </span>
                  )}
                </div>

                {/* Identity + progress rail */}
                <div className="flex min-w-0 items-center gap-3">
                  <LbAvatar
                    src={entry.avatar}
                    name={entry.name}
                    className="h-9 w-9 rounded-full ring-1 ring-border @sm:h-10 @sm:w-10"
                    fallbackClassName="text-xs"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-sm font-semibold text-foreground">
                        {entry.name}
                      </span>
                      {!!entry.streak && entry.streak > 0 && (
                        <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-orange-500/10 px-1.5 text-[10px] font-semibold text-orange-600 dark:text-orange-400">
                          <Flame className="h-2.5 w-2.5" />
                          {entry.streak}
                        </span>
                      )}
                    </div>
                    {sub && (
                      <p className="truncate text-xs text-muted-foreground">{sub}</p>
                    )}
                    <div className="mt-1.5 h-1 w-full max-w-56 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full transition-[width] duration-700",
                          rank === 1 ? "bg-amber-400" : "bg-foreground/25",
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Tier (wide only) */}
                <div className="hidden justify-center @xl:flex">
                  {entry.tier || entry.level ? (
                    <span className="max-w-full truncate rounded-full border border-border/60 bg-muted/50 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {entry.tier || `Level ${entry.level}`}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground/50">—</span>
                  )}
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <TrendIcon change={entry.change} className="h-3 w-3" />
                    <span className="text-sm font-bold tabular-nums text-foreground">
                      {formatScore(entry.score)}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    pts
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};
