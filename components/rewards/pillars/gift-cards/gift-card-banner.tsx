"use client";

import React from "react";
import Link from "next/link";
import { Plus, Wallet, HelpCircle, Gift, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface GiftCardBannerProps {
  walletBalance: number;
  onTopUpClick: () => void;
  onCreateClick?: () => void;
  onHowItWorksClick?: () => void;
}

export const GiftCardBanner: React.FC<GiftCardBannerProps> = ({
  walletBalance,
  onTopUpClick,
  onCreateClick,
  onHowItWorksClick,
}) => {
  return (
    <div className="rounded-xl border border-violet-200/80 dark:border-violet-900/60 bg-gradient-to-r from-violet-500/10 via-violet-500/5 to-transparent p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-violet-600 text-white font-bold px-2 py-0.2 text-[9px] uppercase tracking-wider">
              Pillar 3 • Digital Gift Cards
            </Badge>

            {/* Wallet Balance Pill */}
            <div
              onClick={onTopUpClick}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-violet-100 dark:bg-violet-950/80 text-violet-900 dark:text-violet-200 border border-violet-300 dark:border-violet-800 cursor-pointer hover:bg-violet-200/80 dark:hover:bg-violet-900/90 transition-colors shadow-2xs"
            >
              <Wallet className="h-3 w-3 text-violet-600 dark:text-violet-400" />
              <span>Reward Wallet:</span>
              <span className="font-mono text-emerald-700 dark:text-emerald-300">
                ₹{walletBalance.toLocaleString("en-IN")}
              </span>
              <span className="text-[9px] font-semibold text-violet-600 dark:text-violet-400 underline ml-0.5">
                + Top Up
              </span>
            </div>
          </div>

          <h3 className="text-lg font-bold tracking-tight text-foreground">
            Digital Brand Gift Cards
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Fulfill instant Amazon, Flipkart, Swiggy & lifestyle gift cards on-demand. Cards are purchased from the digital provider API only when a member wins, protected by 2-phase reservation and idempotency.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onHowItWorksClick && (
            <Button
              variant="outline"
              onClick={onHowItWorksClick}
              className="text-xs font-semibold h-8 gap-1.5 border-violet-300 dark:border-violet-800 bg-background/80 hover:bg-violet-50 dark:hover:bg-violet-950/40 text-violet-800 dark:text-violet-300 cursor-pointer"
            >
              <HelpCircle className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
              How Gift Cards Work
            </Button>
          )}

          <Button
            variant="outline"
            onClick={onTopUpClick}
            className="text-xs font-semibold h-8 gap-1.5 border-violet-300 dark:border-violet-800 text-violet-800 dark:text-violet-300 cursor-pointer"
          >
            <Wallet className="h-3.5 w-3.5 text-violet-600" />
            Top-Up Wallet
          </Button>

          {onCreateClick && (
            <Button
              onClick={onCreateClick}
              className="bg-violet-600 hover:bg-violet-700 text-white gap-1.5 text-xs font-semibold h-8 shadow-xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Configure Gift Card
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
