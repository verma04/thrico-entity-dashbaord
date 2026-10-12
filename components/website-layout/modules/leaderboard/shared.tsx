/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

/**
 * Shared primitives for every leaderboard style variant.
 * NOTE: This folder is mirrored 1:1 in thrico-user-website
 * (components/website/leaderboard). Keep both copies identical.
 */

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

export interface LeaderboardVariantProps {
  content: {
    title?: string;
    description?: string;
    entries: LeaderboardEntry[];
    /** Hide ranks 4+ in podium / arena layouts. Defaults to true. */
    showHonorableMentions?: boolean;
  };
}

/** Numeric value of a score that may arrive as "12,450" or 12450. */
export const scoreValue = (score: string | number): number => {
  if (typeof score === "number") return score;
  const n = Number(String(score).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

export const formatScore = (score: string | number): string =>
  scoreValue(score).toLocaleString();

export const formatCompact = (score: string | number): string => {
  const v = scoreValue(score);
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (v >= 10_000) return `${(v / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return v.toLocaleString();
};

export const initials = (name?: string) =>
  (name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

/** Percent of the leader's score, used for progress rails. */
export const percentOfLeader = (
  entry: LeaderboardEntry,
  leader?: LeaderboardEntry,
) => {
  const top = leader ? scoreValue(leader.score) : 0;
  if (!top) return 0;
  return Math.max(
    4,
    Math.min(100, Math.round((scoreValue(entry.score) / top) * 100)),
  );
};

export const rankOf = (entry: LeaderboardEntry, idx: number) =>
  entry.rank || idx + 1;

export const ordinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
};

/** Secondary line under a member's name — only real data, never invented. */
export const subtitleOf = (entry: LeaderboardEntry) =>
  entry.role || entry.category || entry.tier || "";

interface AvatarProps {
  src?: string;
  name?: string;
  className?: string;
  fallbackClassName?: string;
}

/** Avatar with initials fallback (also covers broken image URLs). */
export const LbAvatar = ({
  src,
  name,
  className,
  fallbackClassName,
}: AvatarProps) => {
  const [failed, setFailed] = useState(false);
  return (
    <div className={cn("relative shrink-0 overflow-hidden bg-muted", className)}>
      {src && !failed ? (
        <img
          src={src}
          alt={name || "Member"}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          className={cn(
            "flex h-full w-full items-center justify-center font-semibold text-muted-foreground",
            fallbackClassName,
          )}
        >
          {initials(name)}
        </div>
      )}
    </div>
  );
};

export const TrendIcon = ({
  change,
  className,
}: {
  change?: LeaderboardEntry["change"];
  className?: string;
}) => {
  if (!change) return null;
  if (change === "up")
    return (
      <ArrowUpRight
        aria-label="Moving up"
        className={cn("h-3.5 w-3.5 text-emerald-500", className)}
      />
    );
  if (change === "down")
    return (
      <ArrowDownRight
        aria-label="Moving down"
        className={cn("h-3.5 w-3.5 text-rose-500", className)}
      />
    );
  return (
    <Minus
      aria-label="No change"
      className={cn("h-3.5 w-3.5 text-muted-foreground", className)}
    />
  );
};

export const EmptyBoard = ({ dark = false }: { dark?: boolean }) => (
  <div
    className={cn(
      "rounded-2xl border border-dashed px-6 py-12 text-center",
      dark ? "border-white/15 text-white/60" : "border-border text-muted-foreground",
    )}
  >
    <p className="text-sm font-semibold">No rankings yet</p>
    <p className="mt-1 text-xs opacity-80">
      Earn points to claim the first spot on the board.
    </p>
  </div>
);

/** Staggered entrance helper (tw-animate-css). */
export const enter = (i: number) => ({
  className:
    "animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both",
  style: { animationDelay: `${Math.min(i, 12) * 45}ms` },
});
