"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Gift,
  Wallet,
  Search,
  ExternalLink,
  RotateCw,
  AlertCircle,
  Plus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface PillarGiftCardSectionProps {
  formik: any;
  digitalCardRules: any[];
  digitalCardsLoading: boolean;
  walletBalance: number;
}

export function PillarGiftCardSection({
  formik,
  digitalCardRules,
  digitalCardsLoading,
  walletBalance,
}: PillarGiftCardSectionProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectRule = (rule: any) => {
    formik.setFieldValue("selectedRuleId", rule.id);
    formik.setFieldValue("title", rule.title);
    formik.setFieldValue("description", rule.description || formik.values.description);
    formik.setFieldValue("giftCardBrand", rule.brandName || "Amazon Pay");
    formik.setFieldValue("giftCardValue", Number(rule.faceValue || 500));
    formik.setFieldValue("giftCardFee", Number(rule.serviceFee || (rule.faceValue * 0.05)));
    formik.setFieldValue("discountValue", String(rule.faceValue || 500));
    formik.setFieldValue("validityDays", rule.validityDays || 365);
    if (rule.image && !formik.values.image) {
      formik.setFieldValue("image", rule.image);
    }
    toast({
      title: "Gift Card Linked",
      description: `Selected ${rule.title} (Cost: ₹${rule.totalCost || (rule.faceValue * 1.05)}/win).`,
    });
  };

  const isLowBalance = walletBalance < 5000;

  return (
    <div className="space-y-3 pt-3 border-t border-border/70 animate-in fade-in-50 duration-200">
      {/* Compact Prepaid Wallet Banner */}
      <div className="p-2.5 rounded-lg border border-violet-200 dark:border-violet-900/60 bg-violet-50/30 dark:bg-violet-950/20 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Wallet className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400 shrink-0" />
          <span className="text-xs font-bold text-violet-950 dark:text-violet-200 truncate">
            Prepaid Reward Wallet Engine
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            className={cn(
              "font-bold text-[10px] px-2 py-0.5 font-mono",
              isLowBalance
                ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300"
                : "bg-violet-600 text-white"
            )}
          >
            ₹{walletBalance.toLocaleString("en-IN")} Available
          </Badge>

          <Link
            href="/gamification/rewards/pillars/gift-cards"
            target="_blank"
            className="text-[10px] font-bold text-violet-700 dark:text-violet-300 hover:underline flex items-center gap-0.5 bg-card border border-violet-200 dark:border-violet-800 px-2 py-0.5 rounded shadow-2xs"
          >
            <span>Top Up</span>
            <ExternalLink className="h-2.5 w-2.5" />
          </Link>
        </div>
      </div>

      {isLowBalance && (
        <div className="p-2 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-[11px] text-amber-800 dark:text-amber-200">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-600" />
          <span>
            Low wallet balance. Ensure sufficient funds to avoid fulfillment timeouts.
          </span>
        </div>
      )}

      {/* ── 1. Select from Configured Gift Card Rules ──────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2.5">
          <Label className="text-xs font-bold text-foreground block">
            Select Configured Digital Card Blueprint ({digitalCardRules.length})
          </Label>
          <Link
            href="/gamification/rewards/pillars/gift-cards"
            target="_blank"
            className="text-[11px] font-semibold text-violet-700 dark:text-violet-400 hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Manage All Gift Cards</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        <div className="relative max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Filter gift card offers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 text-xs bg-card border-border"
          />
        </div>

        {digitalCardsLoading ? (
          <div className="p-4 text-center border border-border/70 rounded-lg bg-card">
            <RotateCw className="h-4 w-4 animate-spin mx-auto text-muted-foreground mb-1" />
            <p className="text-xs text-muted-foreground">Loading digital card rules...</p>
          </div>
        ) : digitalCardRules.length === 0 ? (
          <div className="p-3 text-center border border-dashed border-border/80 rounded-lg bg-muted/10">
            <p className="text-xs text-muted-foreground">
              No digital card rules found. Configure one in Pillar 3 below.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
            {digitalCardRules
              .filter((r: any) =>
                !searchQuery ||
                r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.brandName?.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((rule: any) => {
                const isSelected = formik.values.selectedRuleId === rule.id;
                return (
                  <div
                    key={rule.id}
                    onClick={() => handleSelectRule(rule)}
                    className={cn(
                      "p-2 rounded-lg border text-left transition-all cursor-pointer space-y-1 flex flex-col justify-between",
                      isSelected
                        ? "border-violet-600 bg-violet-50/40 dark:bg-violet-950/30 ring-1 ring-violet-600/30 shadow-xs"
                        : "border-border/70 bg-card hover:bg-muted/30"
                    )}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <h5 className="text-xs font-bold text-foreground truncate block">
                        {rule.title}
                      </h5>
                      <span className="font-mono text-xs font-bold text-violet-700 dark:text-violet-300">
                        ₹{rule.faceValue}
                      </span>
                    </div>

                    <div className="pt-1 border-t border-border/40 flex items-center justify-between text-[9px] text-muted-foreground">
                      <span className="truncate max-w-[90px]">{rule.brandName}</span>
                      <span>Total: <strong className="text-violet-600 dark:text-violet-400 font-mono">₹{rule.totalCost || (rule.faceValue * 1.05)}</strong></span>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* Compact Financial Ledger Breakdown for Selected Gift Card */}
        {formik.values.giftCardValue && (
          <div className="p-2.5 rounded-lg border border-border/70 bg-card space-y-1.5 text-xs">
            <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-bold block">
              Net Cost Per Win ({formik.values.giftCardBrand || "Selected Card"})
            </span>
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Voucher Face Value:</span>
                <span className="text-foreground font-mono font-bold">
                  ₹{formik.values.giftCardValue || 500}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Provider Service Fee (5%):</span>
                <span className="text-muted-foreground font-mono">
                  +₹{Number(formik.values.giftCardValue || 500) * 0.05}
                </span>
              </div>
              <div className="pt-1 border-t border-border flex items-center justify-between font-bold text-violet-700 dark:text-violet-300 text-xs">
                <span>Total Deducted from Wallet:</span>
                <span className="font-mono">
                  ₹{Number(formik.values.giftCardValue || 500) * 1.05}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── 2. Bottom: Configure New Gift Card Action Box ─────────────────── */}
      <div className="p-3 rounded-xl border border-border/80 bg-muted/20 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <Plus className="h-3.5 w-3.5 text-violet-600" />
          <span className="text-xs font-bold text-foreground">
            Need a Different Brand or Denomination?
          </span>
        </div>

        <Button
          asChild
          size="sm"
          variant="outline"
          className="h-7 px-2.5 text-[10px] font-semibold gap-1"
        >
          <Link href="/gamification/rewards/pillars/gift-cards" target="_blank">
            <Gift className="h-3 w-3 mr-1 text-violet-600" />
            Configure New Blueprint in Pillar 3
            <ExternalLink className="h-2.5 w-2.5 ml-0.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
