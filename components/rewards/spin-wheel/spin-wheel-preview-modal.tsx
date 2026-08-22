"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Dices, Sparkles, AlertCircle, CheckCircle2, Shield } from "lucide-react";
import { WheelPreview } from "./wheel-preview";
import { WheelSegment } from "./types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SpinWheelPreviewModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  segments: WheelSegment[];
  costPerSpin: number;
  maxSpinsPerDay: number;
  currencyName?: string;
  avgPayout: number;
  profitMargin: number;
  isHealthy: boolean;
}

export function SpinWheelPreviewModal({
  isOpen,
  onOpenChange,
  segments,
  costPerSpin,
  maxSpinsPerDay,
  currencyName = "Points",
  avgPayout,
  profitMargin,
  isHealthy,
}: SpinWheelPreviewModalProps) {
  const activeSegments = segments.filter((s) => s.isActive);
  const totalProbability = activeSegments.reduce(
    (sum, s) => sum + (s.probability || 0),
    0,
  );
  const isProbBalanced = Math.abs(totalProbability - 100) < 0.1;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-2xl p-6 border-border">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <Dices className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">
                Live Wheel Experience & Economics
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Real-time visual simulation of the player wheel canvas and profit margin analysis.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* ── Left: Wheel Simulation Card ──────────────────────────────── */}
          <div className="rounded-2xl border border-border/80 bg-zinc-950 text-white overflow-hidden flex flex-col p-2 relative shadow-md">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-[#008060]/20 rounded-full blur-2xl pointer-events-none" />

            <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 p-4 flex flex-col items-center relative z-10 space-y-3">
              <div className="text-center space-y-0.5">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-[9px] font-bold uppercase tracking-widest text-[#95BF47]">
                  <Sparkles className="h-2.5 w-2.5" />
                  Live Preview
                </div>
                <h4 className="text-xs font-bold text-white tracking-tight">
                  Member Game View
                </h4>
              </div>

              {/* Wheel Canvas */}
              <div className="py-1 flex items-center justify-center">
                <WheelPreview segments={segments} />
              </div>

              {/* Action Button */}
              <div className="w-full space-y-1.5 pt-1">
                <Button
                  disabled
                  className="w-full h-9 rounded-xl bg-white text-zinc-950 font-bold text-xs shadow-sm border-none cursor-default opacity-95"
                >
                  Spin for {costPerSpin} {currencyName}
                </Button>
                <p className="text-center text-[10px] text-zinc-400 font-medium">
                  {maxSpinsPerDay > 0
                    ? `${maxSpinsPerDay} spins / member / day`
                    : "Unlimited spins / day"}
                </p>
              </div>
            </div>
          </div>

          {/* ── Right: Economics & Probability Balance ──────────────────── */}
          <div className="space-y-4 flex flex-col justify-between">
            {/* Probability Balance Indicator */}
            <div
              className={cn(
                "p-3 rounded-xl border flex items-start gap-2.5",
                isProbBalanced
                  ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                  : "bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300",
              )}
            >
              {isProbBalanced ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5 text-xs">
                <div className="font-bold flex items-center gap-1.5">
                  <span>Total Probability: {totalProbability}%</span>
                  <span className="text-[10px] uppercase font-mono px-1 py-0.2 rounded bg-background/50 border">
                    {isProbBalanced ? "Calibrated" : "Unbalanced"}
                  </span>
                </div>
                <p className="text-[11px] opacity-90 leading-tight">
                  {isProbBalanced
                    ? "Active segment weights equal exactly 100%. Odds are properly balanced."
                    : "Active weights don't sum to 100%. Probabilities will be auto-normalized during spin."}
                </p>
              </div>
            </div>

            {/* Economy Health Gauge */}
            <div className="p-4 rounded-xl border border-border bg-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-primary" />
                  House Margin Simulation
                </span>
                <span
                  className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded border font-mono",
                    isHealthy
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                      : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
                  )}
                >
                  {profitMargin.toFixed(1)}% Margin
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Avg. Payout per Spin:</span>
                  <span className="font-bold font-mono text-foreground">
                    {avgPayout.toFixed(1)} {currencyName}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Entry Spin Cost:</span>
                  <span className="font-bold font-mono text-foreground">
                    {costPerSpin} {currencyName}
                  </span>
                </div>
              </div>

              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    isHealthy ? "bg-emerald-500" : "bg-rose-500",
                  )}
                  style={{ width: `${Math.min(Math.max(profitMargin, 0), 100)}%` }}
                />
              </div>

              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Target house margin is 20%–40% to maintain a rewarding experience without point economy inflation.
              </p>
            </div>

            <div className="text-right pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="text-xs"
              >
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SpinWheelPreviewModal;
