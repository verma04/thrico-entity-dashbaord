"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Percent,
  Infinity as InfinityIcon,
  Layers,
} from "lucide-react";
import { MatchWinCombination, REWARD_BADGE, REWARD_ICON, REWARD_LABELS } from "./types";
import { MatchWinActions } from "./match-win-actions";
import { cn } from "@/lib/utils";

export interface MatchWinCardCompactProps {
  combination: MatchWinCombination;
  currencyName: string;
  onEdit?: (combination: MatchWinCombination) => void;
  onDelete: (id: string) => void;
}

export function MatchWinCardCompact({
  combination,
  currencyName,
  onEdit,
  onDelete,
}: MatchWinCardCompactProps) {
  const isLoss = combination.type === "NO_REWARDS" || combination.type === "NOTHING";

  const getFormattedPrize = () => {
    switch (combination.type) {
      case "COINS":
      case "TC":
        return `${combination.value?.toLocaleString() || 0} ${currencyName}`;
      case "GIFT_CARD":
        return `₹${combination.value || combination.giftCardDenomination || 100} Gift Card`;
      case "ECOMMERCE":
        return `${combination.value || combination.ecommerceDiscountValue || 20}% Off`;
      case "INTERNAL_VOUCHER":
      case "VOUCHER":
        return (
          combination.manualBatch?.name ||
          combination.storeDiscountRule?.title ||
          combination.digitalCardRule?.title ||
          "Voucher Pass"
        );
      case "NO_REWARDS":
      case "NOTHING":
      default:
        return "Try Again";
    }
  };

  const symbols = [combination.symbol1, combination.symbol2, combination.symbol3].filter(
    Boolean,
  );

  return (
    <div className="relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xs hover:shadow-md hover:border-primary/40 transition-all duration-200 flex flex-col justify-between group">
      {/* Top status accent bar */}
      <div
        className="absolute top-0 left-0 h-1 w-full opacity-90 group-hover:opacity-100 transition-opacity z-10"
        style={{
          backgroundColor: isLoss
            ? "#64748b"
            : combination.symbol1?.color || "#4F46E5",
        }}
      />

      {/* ── 3-Reel Pattern Preview Box Header ────────────────────────── */}
      <div
        className="relative h-28 w-full overflow-hidden p-3 flex flex-col justify-between text-white shrink-0 border-b border-border/30"
        style={{
          background: isLoss
            ? "linear-gradient(135deg, #334155, #1e293b)"
            : `linear-gradient(135deg, ${combination.symbol1?.color || "#4F46E5"}dd, ${combination.symbol2?.color || "#7c3aed"}aa 60%, #18181bee)`,
        }}
      >
        {/* Top bar: Probability Badge & Actions */}
        <div className="flex items-center justify-between z-10">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/40 backdrop-blur-md border border-white/20 text-white font-mono shadow-2xs">
            <Percent className="h-2.5 w-2.5 opacity-80" />
            {combination.probability}% Odds
          </span>

          <div className="bg-black/30 backdrop-blur-md rounded-md border border-white/20 p-0.5 flex items-center">
            <MatchWinActions
              combination={combination}
              onEdit={onEdit}
              onDelete={onDelete}
              trigger={
                <button
                  type="button"
                  className="h-5 w-5 flex items-center justify-center text-white/80 hover:text-white rounded transition-colors"
                >
                  <span className="text-xs">•••</span>
                </button>
              }
            />
          </div>
        </div>

        {/* 3-Reel Symbols Display */}
        <div className="flex items-center justify-center gap-2 z-10 my-auto">
          {symbols.length > 0 ? (
            symbols.map((sym, idx) => (
              <div
                key={idx}
                className="h-10 w-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-inner text-lg transform group-hover:scale-105 transition-transform"
                style={{ borderColor: sym?.color ? `${sym.color}80` : undefined }}
                title={sym?.label}
              >
                <span>{sym?.icon || "❓"}</span>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-1 text-xs font-mono text-white/80 bg-black/40 px-3 py-1 rounded-lg border border-white/20">
              <Layers className="h-3.5 w-3.5 mr-1" />
              {isLoss ? "No Match (Loss)" : "Default Pattern"}
            </div>
          )}
        </div>

        {/* Bottom subtle rule key label */}
        <div className="flex items-center justify-between text-[10px] font-mono text-white/70 z-10">
          <span className="truncate max-w-[150px]">{combination.key}</span>
          <span>{combination.maxWins ? `Cap: ${combination.maxWins}` : "Unlimited"}</span>
        </div>
      </div>

      {/* ── Card Content Body ─────────────────────────────────────────── */}
      <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between bg-card">
        {/* Row 1: Reward Type & Title */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-1.5">
            <span
              className={cn(
                "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs truncate",
                REWARD_BADGE[combination.type] || "bg-muted text-muted-foreground border-border",
              )}
            >
              {REWARD_ICON[combination.type] || <Sparkles className="h-3 w-3 shrink-0" />}
              <span>{REWARD_LABELS[combination.type] || combination.type}</span>
            </span>

            {combination.id && (
              <Link
                href={`/gamification/rewards/engagement-games/match-win/${combination.id}`}
                className="text-[11px] font-semibold text-primary hover:underline"
              >
                Edit
              </Link>
            )}
          </div>

          <h3
            className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors"
            title={getFormattedPrize()}
          >
            {getFormattedPrize()}
          </h3>
        </div>

        {/* Row 2: Odds Progress Bar */}
        <div className="space-y-1 pt-1 border-t border-border/40">
          <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
            <span>Win Probability</span>
            <span className="font-bold text-foreground font-mono">
              {combination.probability}%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(combination.probability, 100)}%`,
                backgroundColor: combination.symbol1?.color || "#4F46E5",
              }}
            />
          </div>
        </div>

        {/* Row 3: Footer Metadata */}
        <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1 font-mono">
            {combination.maxWins ? (
              <>Max {combination.maxWins} wins</>
            ) : (
              <>
                <InfinityIcon className="h-3 w-3" /> Unlimited
              </>
            )}
          </span>

          <span className="font-mono text-[10px] bg-muted/60 px-1.5 py-0.5 rounded border border-border/50">
            {combination.key}
          </span>
        </div>
      </div>
    </div>
  );
}

export default MatchWinCardCompact;
