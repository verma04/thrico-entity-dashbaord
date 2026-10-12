"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Crown, Flame } from "lucide-react";
import {
  EmptyBoard,
  LbAvatar,
  LeaderboardEntry,
  LeaderboardVariantProps,
  TrendIcon,
  enter,
  formatCompact,
  formatScore,
  rankOf,
  subtitleOf,
} from "./shared";

const STEP: Record<
  number,
  { height: string; avatar: string; ring: string; block: string; numeral: string; label: string }
> = {
  1: {
    height: "h-28 @md:h-36 @2xl:h-44",
    avatar: "h-16 w-16 @md:h-20 @md:w-20 @2xl:h-24 @2xl:w-24",
    ring: "ring-amber-400",
    block:
      "from-amber-300/60 via-amber-200/30 to-amber-100/0 dark:from-amber-400/35 dark:via-amber-500/10 border-amber-400/60",
    numeral: "text-amber-600/80 dark:text-amber-300/80",
    label: "Champion",
  },
  2: {
    height: "h-20 @md:h-28 @2xl:h-32",
    avatar: "h-12 w-12 @md:h-16 @md:w-16 @2xl:h-20 @2xl:w-20",
    ring: "ring-zinc-300 dark:ring-zinc-500",
    block:
      "from-zinc-300/60 via-zinc-200/30 to-zinc-100/0 dark:from-zinc-400/25 dark:via-zinc-500/10 border-zinc-300/70 dark:border-zinc-600",
    numeral: "text-zinc-500/80 dark:text-zinc-300/70",
    label: "Runner-up",
  },
  3: {
    height: "h-16 @md:h-20 @2xl:h-24",
    avatar: "h-12 w-12 @md:h-16 @md:w-16 @2xl:h-20 @2xl:w-20",
    ring: "ring-orange-300 dark:ring-orange-500",
    block:
      "from-orange-300/55 via-orange-200/25 to-orange-100/0 dark:from-orange-500/25 dark:via-orange-600/10 border-orange-300/70 dark:border-orange-700/60",
    numeral: "text-orange-600/70 dark:text-orange-300/70",
    label: "Third",
  },
};

const Pedestal = ({ entry, place }: { entry: LeaderboardEntry; place: 1 | 2 | 3 }) => {
  const s = STEP[place];
  const anim = enter(place === 1 ? 0 : place);
  return (
    <div
      style={anim.style}
      className={cn(anim.className, "flex min-w-0 flex-col items-center")}
    >
      <div className="relative mb-2">
        {place === 1 && (
          <Crown className="absolute -top-6 left-1/2 h-5 w-5 -translate-x-1/2 fill-amber-400 text-amber-500 @md:-top-7 @md:h-6 @md:w-6" />
        )}
        <LbAvatar
          src={entry.avatar}
          name={entry.name}
          className={cn("rounded-full ring-[3px] ring-offset-2 ring-offset-card", s.avatar, s.ring)}
          fallbackClassName="text-sm"
        />
      </div>
      <p className="w-full truncate px-1 text-center text-xs font-semibold text-foreground @md:text-sm">
        {entry.name}
      </p>
      <p className="mb-2 text-center text-[11px] font-bold tabular-nums text-muted-foreground @md:text-xs">
        <span className="@md:hidden">{formatCompact(entry.score)}</span>
        <span className="hidden @md:inline">{formatScore(entry.score)}</span> pts
      </p>
      <div
        className={cn(
          "relative flex w-full items-start justify-center overflow-hidden rounded-t-xl border-x border-t bg-linear-to-b pt-2",
          s.height,
          s.block,
        )}
      >
        <span className={cn("text-3xl font-black tabular-nums leading-none @md:text-5xl", s.numeral)}>
          {place}
        </span>
        <span className="absolute bottom-2 hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/50 @md:block">
          {s.label}
        </span>
      </div>
    </div>
  );
};

/**
 * Podium — 2nd · 1st · 3rd pedestals that stay side-by-side on every width
 * (scaled down on phones), followed by a list for everyone else.
 */
export const PodiumView = ({ content }: LeaderboardVariantProps) => {
  const entries = content.entries ?? [];
  if (!entries.length) return <EmptyBoard />;
  const [first, second, third] = entries;
  const rest = entries.slice(3);
  const showRest = content.showHonorableMentions !== false && rest.length > 0;

  return (
    <div className="@container mx-auto w-full max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card px-3 pt-10 shadow-2xs @md:px-8 @md:pt-12">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-56 w-[28rem] max-w-full -translate-x-1/2 rounded-full bg-amber-400/15 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-2xl grid-cols-3 items-end gap-2 @md:gap-4">
          <div>{second && <Pedestal entry={second} place={2} />}</div>
          <div>{first && <Pedestal entry={first} place={1} />}</div>
          <div>{third && <Pedestal entry={third} place={3} />}</div>
        </div>
      </div>

      {showRest && (
        <ol className="mt-3 divide-y divide-border/50 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-2xs">
          {rest.map((entry, i) => {
            const idx = i + 3;
            const rank = rankOf(entry, idx);
            const sub = subtitleOf(entry);
            const anim = enter(idx);
            return (
              <li
                key={`${entry.name}-${rank}`}
                style={anim.style}
                className={cn(
                  anim.className,
                  "flex items-center gap-3 px-3.5 py-2.5 transition-colors hover:bg-muted/40 @md:px-5",
                )}
              >
                <span className="w-6 text-center text-sm font-semibold tabular-nums text-muted-foreground">
                  {rank}
                </span>
                <LbAvatar
                  src={entry.avatar}
                  name={entry.name}
                  className="h-9 w-9 rounded-full ring-1 ring-border"
                  fallbackClassName="text-xs"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{entry.name}</p>
                  {sub && <p className="truncate text-xs text-muted-foreground">{sub}</p>}
                </div>
                {!!entry.streak && (
                  <span className="hidden items-center gap-0.5 text-[11px] font-semibold text-orange-600 @sm:inline-flex dark:text-orange-400">
                    <Flame className="h-3 w-3" />
                    {entry.streak}
                  </span>
                )}
                <span className="flex items-center gap-1 text-sm font-bold tabular-nums text-foreground">
                  <TrendIcon change={entry.change} className="h-3 w-3" />
                  {formatScore(entry.score)}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};
