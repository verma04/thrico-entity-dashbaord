"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Crown, Flame, Sparkles } from "lucide-react";
import {
  EmptyBoard,
  LbAvatar,
  LeaderboardEntry,
  LeaderboardVariantProps,
  enter,
  formatScore,
  rankOf,
  subtitleOf,
} from "./shared";

const GOLD_TEXT =
  "bg-linear-to-b from-amber-100 via-amber-300 to-amber-600 bg-clip-text text-transparent";

const Contender = ({ entry, rank, i }: { entry: LeaderboardEntry; rank: number; i: number }) => {
  const anim = enter(i);
  const silver = rank === 2;
  return (
    <div
      style={anim.style}
      className={cn(
        anim.className,
        "relative flex items-center gap-3 overflow-hidden rounded-2xl border bg-white/[0.04] p-3.5 backdrop-blur",
        silver ? "border-zinc-300/25" : "border-orange-300/25",
      )}
    >
      <span
        className={cn(
          "absolute -right-2 -top-4 text-7xl font-black italic leading-none opacity-[0.08]",
          silver ? "text-zinc-200" : "text-orange-200",
        )}
      >
        {rank}
      </span>
      <LbAvatar
        src={entry.avatar}
        name={entry.name}
        className={cn("h-12 w-12 rounded-xl ring-2", silver ? "ring-zinc-300/60" : "ring-orange-300/60")}
        fallbackClassName="text-xs text-white/70 bg-white/10"
      />
      <div className="relative min-w-0 flex-1">
        <p className={cn("text-[10px] font-bold uppercase tracking-[0.18em]", silver ? "text-zinc-300" : "text-orange-300")}>
          #{rank}
        </p>
        <p className="truncate text-sm font-semibold text-white">{entry.name}</p>
        <p className="text-xs font-bold tabular-nums text-white/70">{formatScore(entry.score)} pts</p>
      </div>
    </div>
  );
};

/**
 * VIP Arena — black-and-gold hall of fame. The champion gets an animated
 * conic-gradient spotlight card; #2/#3 sit beside it, the rest below.
 */
export const FlashyArena = ({ content }: LeaderboardVariantProps) => {
  const entries = content.entries ?? [];
  if (!entries.length) return <EmptyBoard dark />;
  const [champ, ...others] = entries;
  const contenders = others.slice(0, 2);
  const rest = others.slice(2);
  const showRest = content.showHonorableMentions !== false && rest.length > 0;
  const champSub = subtitleOf(champ);

  return (
    <div className="@container mx-auto w-full max-w-5xl">
      <div className="relative overflow-hidden rounded-3xl bg-[#0b0906] p-3 text-white @md:p-5">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(60%_50%_at_50%_0%,rgba(251,191,36,0.18),transparent_70%)]"
        />

        <div className="relative grid gap-3 @3xl:grid-cols-[1.4fr_1fr]">
          {/* Champion spotlight */}
          <div style={enter(0).style} className={cn(enter(0).className, "relative rounded-2xl p-px")}>
            <div
              aria-hidden
              className="absolute inset-0 overflow-hidden rounded-2xl"
            >
              <div className="absolute left-1/2 top-1/2 aspect-square w-[200%] -translate-x-1/2 -translate-y-1/2 animate-[spin_8s_linear_infinite] [background:conic-gradient(from_0deg,transparent_0deg,#fbbf24_60deg,transparent_120deg,transparent_240deg,#f59e0b_300deg,transparent_360deg)] motion-reduce:animate-none" />
            </div>
            <div className="relative flex h-full flex-col items-center gap-4 rounded-[15px] bg-linear-to-b from-[#1a140a] to-[#0d0a05] p-5 text-center @md:flex-row @md:text-left @3xl:flex-col @3xl:text-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-amber-400/40 blur-xl" />
                <LbAvatar
                  src={champ.avatar}
                  name={champ.name}
                  className="relative h-20 w-20 rounded-full ring-2 ring-amber-300 ring-offset-4 ring-offset-[#120d06] @md:h-24 @md:w-24"
                  fallbackClassName="text-xl text-amber-200 bg-amber-950"
                />
                <span className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-950 shadow-lg">
                  <Crown className="h-3 w-3" /> #{rankOf(champ, 0)}
                </span>
              </div>
              <div className="min-w-0 flex-1 @md:pl-2 @3xl:pl-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-300/80">
                  Champion
                </p>
                <h4 className="truncate text-xl font-bold @md:text-2xl">{champ.name}</h4>
                {champSub && <p className="truncate text-xs text-white/55">{champSub}</p>}
                <p className={cn("mt-2 text-4xl font-black tabular-nums tracking-tight @md:text-5xl", GOLD_TEXT)}>
                  {formatScore(champ.score)}
                </p>
                <div className="mt-2 flex flex-wrap justify-center gap-1.5 @md:justify-start @3xl:justify-center">
                  {!!champ.streak && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/25 bg-amber-300/10 px-2 py-0.5 text-[11px] font-semibold text-amber-200">
                      <Flame className="h-3 w-3" /> {champ.streak} day streak
                    </span>
                  )}
                  {!!champ.level && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-semibold text-white/70">
                      <Sparkles className="h-3 w-3" /> Level {champ.level}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* #2 and #3 */}
          {contenders.length > 0 && (
            <div className="grid gap-3 @md:grid-cols-2 @3xl:grid-cols-1 @3xl:content-center">
              {contenders.map((entry, i) => (
                <Contender key={`${entry.name}-${i}`} entry={entry} rank={rankOf(entry, i + 1)} i={i + 1} />
              ))}
            </div>
          )}
        </div>

        {showRest && (
          <ol className="relative mt-3 grid gap-1.5 @2xl:grid-cols-2">
            {rest.map((entry, i) => {
              const idx = i + 3;
              const rank = rankOf(entry, idx);
              const anim = enter(idx);
              return (
                <li
                  key={`${entry.name}-${rank}`}
                  style={anim.style}
                  className={cn(
                    anim.className,
                    "flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2 transition-colors hover:border-amber-300/25 hover:bg-amber-300/[0.04]",
                  )}
                >
                  <span className="w-6 text-center text-xs font-bold tabular-nums text-amber-200/60">
                    {rank}
                  </span>
                  <LbAvatar
                    src={entry.avatar}
                    name={entry.name}
                    className="h-8 w-8 rounded-full ring-1 ring-white/15"
                    fallbackClassName="text-[10px] text-white/70 bg-white/10"
                  />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-white/90">
                    {entry.name}
                  </span>
                  <span className="text-sm font-bold tabular-nums text-amber-200">
                    {formatScore(entry.score)}
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
};
