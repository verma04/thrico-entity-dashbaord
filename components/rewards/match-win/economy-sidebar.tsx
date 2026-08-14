"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  Trophy,
  Shield,
  Info,
  Dices,
  Gift,
  Star,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import {
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
} from "@/components/gamification/shared/polaris-form-ui";

interface EconomySidebarProps {
  costPerPlay: number;
  maxPlaysPerDay: number;
  avgPayout: number;
  profitMargin: number;
  currencyName?: string;
}

export const EconomySidebar = ({
  costPerPlay,
  maxPlaysPerDay,
  avgPayout,
  profitMargin,
  currencyName = "Points",
}: EconomySidebarProps) => {
  const isHealthy = profitMargin >= 20 && profitMargin <= 40;

  return (
    <div className="space-y-6">
      {/* Live Member Experience Preview */}
      <PolarisSidebarCard
        title="Member Experience Preview"
        badge="Live Slot"
        icon={Trophy}
      >
        <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-950 text-white overflow-hidden flex flex-col p-2 relative shadow-md">
          {/* Subtle glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 bg-[#008060]/20 rounded-full blur-2xl pointer-events-none" />

          <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 p-4 flex flex-col items-center relative z-10 space-y-3">
            {/* Header */}
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[9px] font-bold uppercase tracking-widest text-[#95BF47]">
                <Trophy className="h-2.5 w-2.5" />
                Daily Match
              </div>
              <h4 className="text-sm font-bold text-white tracking-tight">
                Match & Win
              </h4>
              <p className="text-[10px] text-zinc-400">
                Match 3 symbols across the reels to claim the jackpot
              </p>
            </div>

            {/* Slot Machine Display */}
            <div className="w-full py-2 flex items-center justify-center">
              <div className="relative w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-3 flex justify-between gap-2 shadow-inner">
                {[Dices, Star, Gift].map((Icon, idx) => (
                  <div
                    key={idx}
                    className="flex-1 aspect-square bg-zinc-800 rounded-lg border border-zinc-700 flex items-center justify-center shadow-xs overflow-hidden relative"
                  >
                    <Icon className="h-6 w-6 text-[#95BF47] animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Button */}
            <div className="w-full space-y-2 pt-1">
              <button
                disabled
                className="w-full h-10 rounded-xl bg-white text-zinc-950 font-bold text-xs shadow-sm border-none flex items-center justify-center cursor-default opacity-95"
              >
                Play for {costPerPlay} {currencyName}
              </button>
              <p className="text-center text-[10px] text-zinc-400 font-medium">
                {maxPlaysPerDay > 0
                  ? `${maxPlaysPerDay} plays per member / day`
                  : "Unlimited plays per day"}
              </p>
            </div>
          </div>
        </div>
      </PolarisSidebarCard>

      {/* Economy Health Monitor */}
      <PolarisSidebarCard
        title="Game Economy Monitor"
        badge={isHealthy ? "Healthy Margin" : "Attention"}
        icon={Shield}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <PolarisSummaryRow
              label="Avg. Payout / Play"
              value={`${avgPayout.toFixed(1)} ${currencyName}`}
            />
            <PolarisSummaryRow
              label="Target House Margin"
              value="20% – 40%"
              isLast
            />
          </div>

          {/* Profit Margin Gauge Card */}
          <div
            className={cn(
              "p-4 rounded-xl border transition-all",
              isHealthy
                ? "bg-[#008060]/[0.03] border-[#008060]/20 dark:bg-[#008060]/10"
                : "bg-rose-50/60 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/20",
            )}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span
                className={cn(
                  "text-[10px] font-bold uppercase tracking-wider",
                  isHealthy ? "text-[#008060]" : "text-rose-600 dark:text-rose-400",
                )}
              >
                Simulated House Margin
              </span>
              {isHealthy ? (
                <CheckCircle2 className="h-4 w-4 text-[#008060]" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-rose-500" />
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span
                className={cn(
                  "text-2xl font-black font-mono tracking-tight",
                  isHealthy
                    ? "text-[#008060]"
                    : "text-rose-700 dark:text-rose-400",
                )}
              >
                {profitMargin.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  isHealthy ? "bg-[#008060]" : "bg-rose-500",
                )}
                style={{ width: `${Math.min(Math.max(profitMargin, 0), 100)}%` }}
              />
            </div>
          </div>

          {!isHealthy && (
            <div className="flex gap-2.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200/80 dark:border-rose-500/20 items-start">
              <Info className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
              <p className="text-[11px] font-medium text-rose-700 dark:text-rose-300 leading-relaxed">
                {profitMargin < 20
                  ? "Margin is below target. Increase spin cost or lower high-tier combo probabilities to balance payouts."
                  : "Margin is very high. Consider improving winning odds to ensure gameplay feels rewarding."}
              </p>
            </div>
          )}
        </div>
      </PolarisSidebarCard>

      {/* Strategic Tip */}
      <PolarisTipCard title="Slot Rule Strategy">
        Ensure the sum of all winning combination probabilities stays well under 100% (typically 30–50% total win rate). The unallocated percentage serves as the fallback loss outcome.
      </PolarisTipCard>
    </div>
  );
};
