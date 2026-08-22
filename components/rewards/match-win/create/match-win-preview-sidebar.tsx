"use client";

import React from "react";
import {
  Sparkles,
  Percent,
  TrendingUp,
  Coins,
  ShieldCheck,
  Layers,
  Infinity as InfinityIcon,
} from "lucide-react";
import { DEFAULT_SLOT_SYMBOLS, MatchWinSymbol, REWARD_BADGE, REWARD_ICON, REWARD_LABELS } from "../types";
import { cn } from "@/lib/utils";

interface MatchWinPreviewSidebarProps {
  formik: any;
  currencyName?: string;
  symbols?: MatchWinSymbol[];
}

export function MatchWinPreviewSidebar({
  formik,
  currencyName = "Points",
  symbols = DEFAULT_SLOT_SYMBOLS,
}: MatchWinPreviewSidebarProps) {
  const { values } = formik;
  const availableSymbols = symbols.length > 0 ? symbols : DEFAULT_SLOT_SYMBOLS;

  const s1 = availableSymbols.find((s: any) => (s.id || s.key) === values.symbol1Id) || availableSymbols[0];
  const s2 = availableSymbols.find((s: any) => (s.id || s.key) === values.symbol2Id) || availableSymbols[0];
  const s3 = availableSymbols.find((s: any) => (s.id || s.key) === values.symbol3Id) || availableSymbols[0];

  const isLoss = values.rewardType === "NO_REWARDS" || values.rewardType === "NOTHING";

  const getPrizeText = () => {
    switch (values.rewardType) {
      case "COINS":
      case "TC":
        return `${values.rewardValue || 50} ${currencyName}`;
      case "DIGITAL_GIFT_CARD":
      case "GIFT_CARD":
        return `₹${values.giftCardDenomination || values.rewardValue || 100} Gift Card`;
      case "STORE_DISCOUNT":
      case "ECOMMERCE":
        return `${values.ecommerceDiscountValue || values.rewardValue || 20}% Store Off`;
      case "INTERNAL_VOUCHER":
      case "VOUCHER":
        return values.title || values.label || "Voucher Pass";
      case "NO_REWARDS":
      default:
        return "Try Again (Loss)";
    }
  };

  return (
    <div className="space-y-4">
      {/* ── Live Preview Card Mockup ───────────────────────────────────────── */}
      <div className="p-4 rounded-2xl border border-border bg-card shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Live Pattern Preview
          </span>
          <span className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded-full border">
            {values.probability || 10}% Odds
          </span>
        </div>

        {/* 3-Reel Slots Preview Box */}
        <div
          className="rounded-xl p-4 text-white flex flex-col items-center justify-between gap-3 shadow-md"
          style={{
            background: isLoss
              ? "linear-gradient(135deg, #334155, #1e293b)"
              : `linear-gradient(135deg, ${s1?.color || "#4F46E5"}dd, ${s2?.color || "#7c3aed"}aa 60%, #18181bee)`,
          }}
        >
          <div className="flex items-center justify-center gap-2">
            {[s1, s2, s3].map((sym, idx) => (
              <div
                key={idx}
                className="h-12 w-12 rounded-xl bg-black/40 backdrop-blur-md border border-white/30 flex items-center justify-center text-2xl shadow-inner select-none"
              >
                <span>{sym?.icon || "❓"}</span>
              </div>
            ))}
          </div>

          <div className="text-center space-y-0.5">
            <h4 className="text-xs font-mono font-bold tracking-wider text-white">
              {values.key || "triple_match"}
            </h4>
            <p className="text-[11px] font-bold text-white/90">
              {getPrizeText()}
            </p>
          </div>
        </div>

        {/* Pattern Summary Pills */}
        <div className="space-y-1.5 pt-1 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-border/40">
            <span className="text-muted-foreground">Reward Type</span>
            <span className="font-semibold text-foreground flex items-center gap-1">
              {REWARD_ICON[values.rewardType]}
              {REWARD_LABELS[values.rewardType] || values.rewardType}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-border/40">
            <span className="text-muted-foreground">Hit Probability</span>
            <span className="font-mono font-bold text-foreground">
              {values.probability || 10}%
            </span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-muted-foreground">Lifetime Cap</span>
            <span className="font-mono text-muted-foreground">
              {values.maxWins ? `Max ${values.maxWins} wins` : "Unlimited"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Economic Advisory Card ─────────────────────────────────────────── */}
      <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 space-y-2.5 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-primary">
          <TrendingUp className="h-4 w-4" />
          <span>Slot Economics Recommendation</span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Jackpots (3 matching diamonds or 7s) typically carry odds between <strong>0.5% – 2.5%</strong>, while common fruit rewards (cherries, lemons) are calibrated between <strong>10% – 25%</strong> for optimal engagement.
        </p>
      </div>
    </div>
  );
}

export default MatchWinPreviewSidebar;
