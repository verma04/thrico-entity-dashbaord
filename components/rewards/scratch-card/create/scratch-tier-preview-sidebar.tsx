"use client";

import React from "react";
import {
  Coins,
  Ticket,
  RotateCcw,
  Gift,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import {
  PolarisSidebarCard,
  PolarisTipCard,
  PolarisSummaryRow,
} from "@/components/gamification/shared/polaris-form-ui";
import { cn } from "@/lib/utils";

interface ScratchTierPreviewSidebarProps {
  formik: any;
  currencyName?: string;
}

export function ScratchTierPreviewSidebar({
  formik,
  currencyName = "Points",
}: ScratchTierPreviewSidebarProps) {
  const { values } = formik;
  const rewardType = values.rewardType || "COINS";

  const getPillarBadge = () => {
    if (rewardType === "DIGITAL_GIFT_CARD") {
      return {
        label: "Digital Gift Card",
        tag: values.giftCardBrand || "Brand Card",
        color: "bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300",
        icon: Gift,
      };
    }
    if (rewardType === "STORE_DISCOUNT") {
      return {
        label: "Store Discount",
        tag:
          values.ecommerceDiscountType === "PERCENTAGE"
            ? `${values.ecommerceDiscountValue || 20}% OFF`
            : `₹${values.ecommerceDiscountValue || 100} OFF`,
        color: "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300",
        icon: ShoppingBag,
      };
    }
    if (rewardType === "INTERNAL_VOUCHER") {
      return {
        label: "Internal Voucher",
        tag: "Promo Code",
        color: "bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300",
        icon: Ticket,
      };
    }
    if (rewardType === "NO_REWARDS") {
      return {
        label: "Try Again",
        tag: "No Payout",
        color: "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300",
        icon: RotateCcw,
      };
    }
    return {
      label: "Loyalty Points",
      tag: `+${values.rewardValue || 50} ${currencyName}`,
      color: "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300",
      icon: Coins,
    };
  };

  const pillarBadge = getPillarBadge();
  const PillarIcon = pillarBadge.icon;

  return (
    <div className="space-y-6">
      {/* ── Live Member Scratch Card Preview ─────────────────────────────── */}
      <PolarisSidebarCard title="Scratch Tier Preview" badge="Member View">
        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden flex flex-col">
            {/* Top Accent / Card Color Bar */}
            <div
              className="h-2 w-full transition-all duration-300"
              style={{ backgroundColor: values.cardColor || "#4F46E5" }}
            />

            {/* Simulated Scratch Surface Card */}
            <div className="p-5 flex flex-col items-center text-center relative bg-gradient-to-b from-zinc-50/50 to-zinc-100/30 dark:from-zinc-900/50 dark:to-zinc-950/50">
              {/* Top Floating Status */}
              <div className="w-full flex items-center justify-between mb-4">
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                    pillarBadge.color
                  )}
                >
                  {pillarBadge.label}
                </span>

                <span
                  className={cn(
                    "inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase",
                    values.isActive
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                      : "bg-rose-500/10 text-rose-700 dark:text-rose-300"
                  )}
                >
                  {values.isActive ? "Active" : "Disabled"}
                </span>
              </div>

              {/* Icon Circle */}
              <div className="h-14 w-14 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <PillarIcon className="h-7 w-7 text-primary" />
              </div>

              {/* Title & Payout details */}
              <h4 className="text-sm font-bold text-foreground line-clamp-1 max-w-[220px]">
                {values.label || "Scratch Card Prize"}
              </h4>
              <p className="text-xs font-semibold text-primary mt-0.5 font-mono">
                {pillarBadge.tag}
              </p>

              {/* Prize Details Footer */}
              <div className="mt-4 pt-3 border-t border-border/50 w-full flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>Prize Fulfillment</span>
                </span>
                <span className="font-semibold text-foreground">
                  {pillarBadge.label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </PolarisSidebarCard>

      {/* ── Summary Metrics Card ────────────────────────────────────────── */}
      <PolarisSidebarCard title="Tier Summary" badge="Gating & Limits">
        <div className="space-y-1">
          <PolarisSummaryRow
            label="Mechanism Type"
            value={pillarBadge.label}
          />
          <PolarisSummaryRow
            label="Member Eligibility"
            value={
              values.memberEligibility === "ALL"
                ? "All Customers"
                : values.memberEligibility === "VERIFIED"
                ? "Verified Customers"
                : values.memberEligibility === "TIERS"
                ? `${(values.membershipTierId || values.eligibleTierIds || []).length} Tier(s)`
                : values.memberEligibility === "SPECIFIC_CUSTOMERS"
                ? `${(values.eligibleUserIds || []).length} Customer(s)`
                : "All Customers"
            }
          />
          {values.minAccountAge > 0 && (
            <PolarisSummaryRow
              label="Min Account Age"
              value={`${values.minAccountAge} Days`}
            />
          )}
          {values.minActivity > 0 && (
            <PolarisSummaryRow
              label="Min Activity"
              value={`${values.minActivity} PTS`}
            />
          )}
          <PolarisSummaryRow
            label="Game Status"
            value={values.isActive ? "Active in Game" : "Draft (Disabled)"}
          />
        </div>
      </PolarisSidebarCard>

      {/* ── Strategic Advice Card ──────────────────────────────────────── */}
      <PolarisTipCard title="Reward Optimization Tip">
        Pair high-value digital gift cards and store discounts with member gating criteria to reward your most active community members.
      </PolarisTipCard>
    </div>
  );
}
