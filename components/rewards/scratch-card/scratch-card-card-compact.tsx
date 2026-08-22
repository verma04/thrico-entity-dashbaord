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
  ShieldCheck,
  Clock,
  Activity,
  Info,
} from "lucide-react";
import { ScratchCardActions } from "./scratch-card-actions";
import {
  ScratchRewardTier,
  REWARD_BADGE,
  REWARD_ICON,
  REWARD_LABELS,
} from "./types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ScratchCardCardCompactProps {
  tier: ScratchRewardTier;
  currencyName?: string;
  onEdit?: (tier: ScratchRewardTier) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => Promise<void>;
}

export function ScratchCardCardCompact({
  tier,
  currencyName = "Points",
  onEdit,
  onDelete,
  onToggleActive,
}: ScratchCardCardCompactProps) {
  const isTierActive = tier.isActive !== false;

  const getGradientTheme = () => {
    switch (tier.rewardType) {
      case "COINS":
        return "from-amber-600/90 via-amber-500/80 to-amber-700/90";
      case "GIFT_CARD":
        return "from-purple-600/90 via-violet-500/80 to-indigo-700/90";
      case "ECOMMERCE":
        return "from-emerald-600/90 via-teal-500/80 to-emerald-700/90";
      case "INTERNAL_VOUCHER":
      case "VOUCHER":
        return "from-blue-600/90 via-sky-500/80 to-indigo-600/90";
      case "NO_REWARDS":
      default:
        return "from-zinc-600/90 via-zinc-500/80 to-zinc-700/90";
    }
  };

  const getFormattedPrize = () => {
    switch (tier.rewardType) {
      case "COINS":
        return `${tier.rewardValue} ${currencyName}`;
      case "GIFT_CARD":
        return `₹${tier.rewardValue || tier.giftCardDenomination || 100} Gift Card`;
      case "ECOMMERCE":
        return `${tier.rewardValue || tier.ecommerceDiscountValue || 20}% Off`;
      case "INTERNAL_VOUCHER":
      case "VOUCHER":
        return tier.reward?.title || "Voucher Pass";
      case "NO_REWARDS":
      default:
        return "Try Again";
    }
  };

  const eligibilityText =
    tier.eligibility?.memberEligibility ||
    (tier.minAccountAge > 0
      ? `Age > ${tier.minAccountAge}d`
      : tier.minActivity > 0
        ? `Activity > ${tier.minActivity}`
        : "All Members");

  return (
    <div className="relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xs hover:shadow-md hover:border-primary/40 transition-all duration-200 flex flex-col justify-between group">
      {/* Top status accent bar */}
      <div
        className="absolute top-0 left-0 h-1 w-full opacity-90 group-hover:opacity-100 transition-opacity z-10"
        style={{ backgroundColor: isTierActive ? "#10b981" : "#f43f5e" }}
      />

      {/* ── Visual Scratch Card Header ─────────────────────────────────── */}
      <div
        className={cn(
          "relative h-28 w-full overflow-hidden bg-gradient-to-br p-3 flex flex-col justify-between text-white shrink-0 border-b border-border/30",
          getGradientTheme(),
        )}
      >
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff18_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
        <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-white/10 blur-md pointer-events-none" />

        {/* Top Badges & Action Menu */}
        <div className="relative z-10 flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={cn(
                "inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-white shadow-2xs",
                isTierActive
                  ? "bg-emerald-600/90 backdrop-blur-xs"
                  : "bg-rose-600/90 backdrop-blur-xs",
              )}
            >
              {isTierActive ? "Active" : "Inactive"}
            </span>

            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-black/40 backdrop-blur-xs text-white border border-white/20">
              {REWARD_ICON[tier.rewardType] || (
                <Sparkles className="h-2.5 w-2.5" />
              )}
              {REWARD_LABELS[tier.rewardType] || tier.rewardType}
            </span>
          </div>

          <div className="bg-black/30 hover:bg-black/50 backdrop-blur-xs rounded-md transition-colors text-white">
            <ScratchCardActions
              tier={tier}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleActive={onToggleActive}
            />
          </div>
        </div>

        {/* Bottom Prize Display inside Banner */}
        <div className="relative z-10 flex items-end justify-between">
          <div className="flex items-center gap-1.5 font-bold text-white tracking-tight drop-shadow-xs">
            {tier.rewardType === "COINS" && (
              <Coins className="h-4 w-4 text-amber-200" />
            )}
            {tier.rewardType === "GIFT_CARD" && (
              <Gift className="h-4 w-4 text-purple-200" />
            )}
            {tier.rewardType === "ECOMMERCE" && (
              <ShoppingBag className="h-4 w-4 text-emerald-200" />
            )}
            {tier.rewardType === "INTERNAL_VOUCHER" && (
              <Ticket className="h-4 w-4 text-blue-200" />
            )}
            {tier.rewardType === "NO_REWARDS" && (
              <RotateCcw className="h-4 w-4 text-zinc-200" />
            )}
            <span className="text-sm font-extrabold truncate max-w-[170px]">
              {getFormattedPrize()}
            </span>
          </div>

          <span className="text-[10px] font-medium text-white/80 uppercase tracking-widest bg-black/20 px-1.5 py-0.5 rounded backdrop-blur-xs border border-white/10 truncate max-w-[100px]">
            {eligibilityText}
          </span>
        </div>
      </div>

      {/* ── Card Content Body ───────────────────────────────────────────── */}
      <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-1.5">
            <h3
              className="text-xs sm:text-sm font-semibold text-foreground leading-snug truncate group-hover:text-primary transition-colors"
              title={tier.label}
            >
              {tier.label}
            </h3>

            {tier.eligibilityDescription && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground shrink-0 cursor-help mt-0.5" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs p-2.5 text-xs bg-popover text-popover-foreground rounded-xl border border-border shadow-lg">
                    <div
                      className="prose prose-xs dark:prose-invert"
                      dangerouslySetInnerHTML={{
                        __html: tier.eligibilityDescription,
                      }}
                    />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          {tier.tryAgainMessage && tier.rewardType === "NO_REWARDS" && (
            <p className="text-[11px] text-muted-foreground line-clamp-1 italic">
              "{tier.tryAgainMessage}"
            </p>
          )}

          {/* Qualification Criteria & Guardrails */}
          <div className="pt-1.5 border-t border-border/30 flex items-center justify-between text-[10px] text-muted-foreground gap-2">
            <div className="flex items-center gap-1 truncate">
              {tier.minAccountAge > 0 ? (
                <>
                  <Clock className="h-3 w-3 text-muted-foreground/70" />
                  <span>Age: {tier.minAccountAge}d+</span>
                </>
              ) : tier.minActivity > 0 ? (
                <>
                  <Activity className="h-3 w-3 text-muted-foreground/70" />
                  <span>Act: {tier.minActivity}+</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-3 w-3 text-muted-foreground/70" />
                  <span>Open to all</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] font-medium text-muted-foreground">
                {isTierActive ? "Active" : "Paused"}
              </span>
              <Switch
                checked={isTierActive}
                onCheckedChange={(v) => onToggleActive(tier.id, v)}
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
            <Link
              href={`/gamification/rewards/engagement-games/scratch-card/${tier.id}`}
            >
              <Pencil className="h-3 w-3 text-muted-foreground" />
              <span>Edit Tier</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ScratchCardCardCompact;
