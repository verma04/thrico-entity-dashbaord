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
    <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-primary text-primary-foreground font-bold px-2 py-0.2 text-[9px] uppercase tracking-wider">
              Pillar 3 • Digital Gift Cards
            </Badge>

            {/* Wallet Balance Pill */}
            <div
              onClick={onTopUpClick}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-foreground border border-border cursor-pointer hover:bg-muted/80 transition-colors shadow-2xs"
            >
              <Wallet className="h-3 w-3 text-muted-foreground" />
              <span>Reward Wallet:</span>
              <span className="font-mono text-emerald-700 dark:text-emerald-300">
                ₹{walletBalance.toLocaleString("en-IN")}
              </span>
              <span className="text-[9px] font-semibold text-primary underline ml-0.5">
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
              className="text-xs font-medium h-8 gap-1.5 cursor-pointer shadow-2xs"
            >
              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
              How Gift Cards Work
            </Button>
          )}

          <Button
            variant="outline"
            onClick={onTopUpClick}
            className="text-xs font-medium h-8 gap-1.5 cursor-pointer shadow-2xs"
          >
            <Wallet className="h-3.5 w-3.5 text-muted-foreground" />
            Top-Up Wallet
          </Button>

          {onCreateClick && (
            <Button
              onClick={onCreateClick}
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-xs font-medium h-8 shadow-2xs cursor-pointer"
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
