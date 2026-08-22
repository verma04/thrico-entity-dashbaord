"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  TrendingUp,
  Percent,
  Coins,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCw,
} from "lucide-react";
import { MatchWinCombination, MatchWinSymbol } from "./types";
import { cn } from "@/lib/utils";

interface MatchWinPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  combinations: MatchWinCombination[];
  symbols: MatchWinSymbol[];
  costPerPlay: number;
  maxPlaysPerDay: number;
  currencyName?: string;
  isActive?: boolean;
}

export function MatchWinPreviewModal({
  open,
  onOpenChange,
  combinations,
  symbols,
  costPerPlay,
  maxPlaysPerDay,
  currencyName = "Points",
  isActive = true,
}: MatchWinPreviewModalProps) {
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState<[string, string, string]>(["🍒", "🍒", "🍒"]);
  const [lastWin, setLastWin] = useState<MatchWinCombination | null>(null);

  // Economic calculations
  const totalProbability = combinations.reduce(
    (sum, c) => sum + (c.probability || 0),
    0,
  );
  const isProbBalanced = Math.abs(totalProbability - 100) < 0.1;

  const avgPayout = combinations.reduce((sum, c) => {
    const p = (c.probability || 0) / (totalProbability || 100);
    const val = (c.type === "COINS" || c.type === "TC") ? (c.value || 0) : 0;
    return sum + val * p;
  }, 0);

  const profitMargin =
    costPerPlay === 0 ? 0 : ((costPerPlay - avgPayout) / costPerPlay) * 100;
  const isHealthy = profitMargin >= 15 && profitMargin <= 45;

  const handleTestSpin = () => {
    if (spinning || combinations.length === 0) return;
    setSpinning(true);
    setLastWin(null);

    // Pick winning combination based on weighted probability
    const rand = Math.random() * 100;
    let cum = 0;
    let picked = combinations[0];
    for (const c of combinations) {
      cum += c.probability || 0;
      if (rand <= cum) {
        picked = c;
        break;
      }
    }

    // Interval animation for reels
    const allEmojis = symbols.length > 0 ? symbols.map((s) => s.icon) : ["🍒", "🍋", "🍊", "🔔", "⭐", "💎", "7️⃣"];
    let ticks = 0;
    const interval = setInterval(() => {
      ticks++;
      setReels([
        allEmojis[Math.floor(Math.random() * allEmojis.length)],
        allEmojis[Math.floor(Math.random() * allEmojis.length)],
        allEmojis[Math.floor(Math.random() * allEmojis.length)],
      ]);

      if (ticks >= 15) {
        clearInterval(interval);
        setSpinning(false);
        const finalReels: [string, string, string] = [
          picked?.symbol1?.icon || "🍒",
          picked?.symbol2?.icon || "🍒",
          picked?.symbol3?.icon || "🍒",
        ];
        setReels(finalReels);
        setLastWin(picked);
      }
    }, 80);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-2xl border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-border bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                Match & Win Live Simulator & Economics
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Simulate 3-reel matching spins, verify house edge profitability, and audit odds distribution.
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Modal Body Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
          {/* Left: 3-Reel Slot Simulator (7 Cols) */}
          <div className="md:col-span-7 p-6 flex flex-col items-center justify-between gap-6 bg-gradient-to-b from-card to-muted/20">
            {/* Slot Machine Chassis */}
            <div className="w-full max-w-sm rounded-2xl border-4 border-zinc-800 bg-zinc-950 p-4 shadow-2xl space-y-4">
              {/* Top Banner */}
              <div className="flex items-center justify-between px-2 py-1 bg-zinc-900 rounded-lg border border-zinc-800 text-white">
                <span className="text-[10px] font-mono font-bold tracking-wider text-amber-400">
                  MATCH & WIN 3-REEL
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  COST: {costPerPlay} {currencyName}
                </span>
              </div>

              {/* 3-Reel Windows */}
              <div className="grid grid-cols-3 gap-2 bg-black p-3 rounded-xl border-2 border-zinc-800 shadow-inner">
                {reels.map((emoji, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "h-24 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-4xl shadow-inner select-none transition-all",
                      spinning && "animate-pulse blur-[1px]",
                    )}
                  >
                    <span>{emoji}</span>
                  </div>
                ))}
              </div>

              {/* Spin Trigger Button */}
              <Button
                onClick={handleTestSpin}
                disabled={spinning || combinations.length === 0}
                className="w-full h-11 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white font-black text-sm tracking-wide uppercase rounded-xl shadow-lg border-b-4 border-red-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                {spinning ? (
                  <>
                    <RotateCw className="h-4 w-4 animate-spin" /> Spinning Reels...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-white" /> Spin Reels (Test)
                  </>
                )}
              </Button>
            </div>

            {/* Simulated Spin Result */}
            {lastWin && (
              <div className="w-full max-w-sm p-3 rounded-xl border border-primary/30 bg-primary/5 text-center space-y-1">
                <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">
                  Simulated Outcome
                </span>
                <p className="text-xs font-bold text-foreground">
                  {lastWin.type === "NO_REWARDS" ? (
                    <span className="text-zinc-500">No Win (Try Again)</span>
                  ) : (
                    <span className="text-primary">
                      Matched: {lastWin.key} ({lastWin.value} {lastWin.type})
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Right: Economic Health & Payout Odds (5 Cols) */}
          <div className="md:col-span-5 p-6 space-y-5 bg-card">
            {/* Probability Health */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-muted-foreground">Total Probability</span>
                <span
                  className={cn(
                    "font-bold font-mono px-2 py-0.5 rounded-full border text-[11px]",
                    isProbBalanced
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
                  )}
                >
                  {totalProbability.toFixed(1)}%
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {isProbBalanced ? (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    Probabilities are perfectly calibrated to 100%.
                  </span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    Total odds sum to {totalProbability.toFixed(1)}% (Target: 100%).
                  </span>
                )}
              </p>
            </div>

            {/* Economic Metrics */}
            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-border/60">
              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                <span className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1">
                  <Coins className="h-3 w-3 text-amber-500" />
                  Avg. Points Payout
                </span>
                <p className="text-base font-black text-foreground font-mono">
                  {avgPayout.toFixed(1)} <span className="text-[10px] text-muted-foreground font-normal">{currencyName}</span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                <span className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                  House Margin
                </span>
                <p
                  className={cn(
                    "text-base font-black font-mono",
                    isHealthy ? "text-emerald-600" : "text-amber-600",
                  )}
                >
                  {profitMargin.toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Payout Distribution Table */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <span className="text-xs font-bold text-foreground flex items-center justify-between">
                <span>Combinations Breakdown</span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {combinations.length} rules
                </span>
              </span>

              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {combinations.map((c) => (
                  <div
                    key={c.id || c.key}
                    className="p-2 rounded-lg bg-muted/30 border border-border/40 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-sm">
                        {c.symbol1?.icon || "🍒"}
                        {c.symbol2?.icon || "🍒"}
                        {c.symbol3?.icon || "🍒"}
                      </span>
                      <span className="font-semibold text-foreground truncate max-w-[110px]">
                        {c.key}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-muted-foreground">
                      {c.probability}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default MatchWinPreviewModal;
