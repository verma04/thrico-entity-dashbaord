"use client";

import React from "react";
import {
  Coins,
  Ticket,
  RotateCcw,
  Gift,
  ShoppingBag,
  Sparkles,
  Percent,
} from "lucide-react";
import {
  PolarisSidebarCard,
  PolarisTipCard,
  PolarisSummaryRow,
} from "@/components/gamification/shared/polaris-form-ui";
import { cn } from "@/lib/utils";

interface SpinSegmentPreviewSidebarProps {
  formik: any;
  currencyName?: string;
}

export function SpinSegmentPreviewSidebar({
  formik,
  currencyName = "Points",
}: SpinSegmentPreviewSidebarProps) {
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
      tag: `+${values.rewardValue || 20} ${currencyName}`,
      color: "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300",
      icon: Coins,
    };
  };

  const pillarBadge = getPillarBadge();
  const PillarIcon = pillarBadge.icon;

  return (
    <div className="space-y-6">
      {/* ── Live Member Wheel Segment Preview ────────────────────────────── */}
      <PolarisSidebarCard title="Segment Preview" badge="Wheel Slice">
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
            {/* Slice Color Header */}
            <div
              className="h-2.5 w-full transition-all duration-300"
              style={{ backgroundColor: values.color || "#4F46E5" }}
            />

            {/* Visual Slice Preview Card */}
            <div className="p-5 flex flex-col items-center text-center relative bg-muted/20">
              {/* Top Floating Badges */}
              <div className="w-full flex items-center justify-between mb-4">
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                    pillarBadge.color,
                  )}
                >
                  {pillarBadge.label}
                </span>

                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-background border border-border text-foreground">
                  {values.probability || 10}% Odds
                </span>
              </div>

              {/* Prize Icon / Value */}
              <div
                className="h-16 w-16 rounded-2xl flex items-center justify-center mb-3 shadow-md border-2 border-white/20"
                style={{ backgroundColor: values.color || "#4F46E5" }}
              >
                <PillarIcon className="h-8 w-8 text-white drop-shadow-sm" />
              </div>

              <h4 className="text-sm font-bold text-foreground max-w-[200px] truncate">
                {values.label || "Wheel Segment"}
              </h4>

              <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-primary">
                <span>{pillarBadge.tag}</span>
              </div>
            </div>

            {/* Quick Summary Rows */}
            <div className="p-4 bg-card border-t border-border/60 space-y-2">
              <PolarisSummaryRow
                label="Fulfillment"
                value={pillarBadge.label}
              />
              <PolarisSummaryRow
                label="Win Probability"
                value={`${values.probability || 10}%`}
              />
              <PolarisSummaryRow
                label="Wheel Position"
                value={`Order #${values.sortOrder || 1}`}
              />
              <PolarisSummaryRow
                label="Status"
                value={values.isActive ? "Active on Wheel" : "Disabled"}
                isLast
              />
            </div>
          </div>
        </div>
      </PolarisSidebarCard>

      {/* ── Strategic Advice ────────────────────────────────────────────── */}
      <PolarisTipCard title="Strategic Probability Advice">
        Distribute slice probabilities to achieve your desired target margin. Higher payout prizes (like high value Gift Cards) should have lower probabilities (1%–5%), while smaller point prizes keep members engaged with frequent wins.
      </PolarisTipCard>
    </div>
  );
}

export default SpinSegmentPreviewSidebar;
