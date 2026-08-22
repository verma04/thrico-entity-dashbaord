"use client";

import React from "react";
import Link from "next/link";
import {
  Coins,
  Pencil,
  Sparkles,
  Gift,
  ShoppingBag,
  Ticket,
  RotateCcw,
  Percent,
  CircleDot,
} from "lucide-react";
import { SpinWheelActions } from "./spin-wheel-actions";
import {
  WheelSegment,
} from "./types";
import {
  REWARD_BADGE,
  REWARD_ICON,
  REWARD_LABELS,
} from "./constants";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface SpinWheelCardCompactProps {
  segment: WheelSegment;
  currencyName?: string;
  onEdit: (segment: WheelSegment) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => Promise<void>;
}

export function SpinWheelCardCompact({
  segment,
  currencyName = "Points",
  onEdit,
  onDelete,
  onToggleActive,
}: SpinWheelCardCompactProps) {
  const isSegmentActive = segment.isActive;

  const getFormattedPrize = () => {
    switch (segment.rewardType) {
      case "COINS":
        return `${segment.rewardValue} ${currencyName}`;
      case "GIFT_CARD":
        return `₹${segment.rewardValue || segment.giftCardDenomination || 100} Gift Card`;
      case "ECOMMERCE":
        return `${segment.rewardValue || segment.ecommerceDiscountValue || 20}% Off`;
      case "INTERNAL_VOUCHER":
      case "VOUCHER":
        return (
          segment.manualBatch?.name ||
          segment.storeDiscountRule?.title ||
          segment.digitalCardRule?.title ||
          "Voucher Pass"
        );
      case "NO_REWARDS":
      default:
        return "Try Again";
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xs hover:shadow-md hover:border-primary/40 transition-all duration-200 flex flex-col justify-between group">
      {/* Top status accent bar */}
      <div
        className="absolute top-0 left-0 h-1 w-full opacity-90 group-hover:opacity-100 transition-opacity z-10"
        style={{ backgroundColor: isSegmentActive ? "#10b981" : "#f43f5e" }}
      />

      {/* ── Visual Wheel Segment Slice Header ──────────────────────────── */}
      <div
        className="relative h-28 w-full overflow-hidden p-3 flex flex-col justify-between text-white shrink-0 border-b border-border/30"
        style={{
          background: `linear-gradient(135deg, ${segment.color || "#4F46E5"}ee, ${segment.color || "#4F46E5"}99 60%, #18181bee)`,
        }}
      >
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
        <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-white/15 blur-md pointer-events-none" />

        {/* Top Badges & Action Menu */}
        <div className="relative z-10 flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={cn(
                "inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-white shadow-2xs",
                isSegmentActive
                  ? "bg-emerald-600/90 backdrop-blur-xs"
                  : "bg-rose-600/90 backdrop-blur-xs",
              )}
            >
              {isSegmentActive ? "Active" : "Inactive"}
            </span>

            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-black/40 backdrop-blur-xs text-white border border-white/20">
              {REWARD_ICON[segment.rewardType] || <Sparkles className="h-2.5 w-2.5" />}
              {REWARD_LABELS[segment.rewardType] || segment.rewardType}
            </span>
          </div>

          <div className="bg-black/30 hover:bg-black/50 backdrop-blur-xs rounded-md transition-colors text-white">
            <SpinWheelActions
              segment={segment}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleActive={onToggleActive}
            />
          </div>
        </div>

        {/* Bottom Prize & Probability inside Banner */}
        <div className="relative z-10 flex items-end justify-between">
          <div className="flex items-center gap-1.5 font-bold text-white tracking-tight drop-shadow-xs">
            {segment.rewardType === "COINS" && <Coins className="h-4 w-4 text-amber-200" />}
            {segment.rewardType === "GIFT_CARD" && <Gift className="h-4 w-4 text-purple-200" />}
            {segment.rewardType === "ECOMMERCE" && <ShoppingBag className="h-4 w-4 text-emerald-200" />}
            {segment.rewardType === "INTERNAL_VOUCHER" && <Ticket className="h-4 w-4 text-blue-200" />}
            {segment.rewardType === "NO_REWARDS" && <RotateCcw className="h-4 w-4 text-zinc-200" />}
            <span className="text-sm font-extrabold truncate max-w-[150px]">
              {getFormattedPrize()}
            </span>
          </div>

          <span className="text-[10px] font-extrabold text-white bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-xs border border-white/20 font-mono">
            {segment.probability}% Odds
          </span>
        </div>
      </div>

      {/* ── Card Content Body ───────────────────────────────────────────── */}
      <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-1.5">
            <h3
              className="text-xs sm:text-sm font-semibold text-foreground leading-snug truncate group-hover:text-primary transition-colors"
              title={segment.label}
            >
              {segment.label}
            </h3>

            {/* Segment Color Pill */}
            <div className="flex items-center gap-1 shrink-0">
              <span
                className="h-3 w-3 rounded-full border border-border shrink-0 shadow-2xs"
                style={{ backgroundColor: segment.color }}
              />
              <span className="font-mono text-[9px] text-muted-foreground uppercase">
                {segment.color}
              </span>
            </div>
          </div>

          {/* Probability Progress Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1 font-medium">
                <Percent className="h-2.5 w-2.5" />
                Win Probability
              </span>
              <span className="font-mono font-bold text-foreground">
                {segment.probability}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(segment.probability, 100)}%`,
                  backgroundColor: segment.color || "#4F46E5",
                }}
              />
            </div>
          </div>

          {/* Active Switch & Order */}
          <div className="pt-1.5 border-t border-border/30 flex items-center justify-between text-[10px] text-muted-foreground">
            <span className="text-[10px] text-muted-foreground">
              Sort #{segment.sortOrder || 0}
            </span>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] font-medium text-muted-foreground">
                {isSegmentActive ? "Active" : "Paused"}
              </span>
              <Switch
                checked={isSegmentActive}
                onCheckedChange={(v) => onToggleActive(segment.id, v)}
                className="scale-75 data-[state=checked]:bg-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* ── Card Footer Action ────────────────────────────────────────── */}
        <div className="pt-2 border-t border-border/40">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-7 w-full text-[11px] font-semibold gap-1.5 px-2.5 border-border/80 bg-card hover:bg-muted"
          >
            <Link href={`/gamification/rewards/engagement-games/spin-wheel/${segment.id}`}>
              <Pencil className="h-3 w-3 text-muted-foreground" />
              <span>Edit Segment</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SpinWheelCardCompact;
