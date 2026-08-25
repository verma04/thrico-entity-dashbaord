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
import { Badge } from "@/components/ui/badge";
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
        color:
          "bg-violet-100 dark:bg-violet-950/80 text-violet-800 dark:text-violet-300",
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
        color:
          "bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300",
        icon: ShoppingBag,
      };
    }
    if (rewardType === "INTERNAL_VOUCHER") {
      return {
        label: "Internal Voucher",
        tag: "Promo Code",
        color:
          "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300",
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
      color:
        "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300",
      icon: Coins,
    };
  };

  const pillarBadge = getPillarBadge();
  const PillarIcon = pillarBadge.icon;

  return (
    <div className="space-y-4">
      {/* ── Live Member Wheel Segment Preview ────────────────────────────── */}
      <PolarisSidebarCard title="Segment Preview" badge="Wheel Slice">
        <div className="space-y-3">
          <div className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs overflow-hidden flex flex-col">
            {/* Slice Color Header Bar */}
            <div
              className="h-2 w-full transition-all duration-300"
              style={{ backgroundColor: values.color || "#4F46E5" }}
            />

            {/* Visual Slice Preview Card */}
            <div className="p-4 flex flex-col items-center text-center relative bg-[#f6f6f7]/60 dark:bg-zinc-800/40">
              {/* Top Badges */}
              <div className="w-full flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider bg-[#303030] text-white">
                  {pillarBadge.label}
                </span>
                <span className="text-[11px] font-mono font-bold text-[#303030] dark:text-zinc-100 flex items-center gap-1">
                  <Percent className="h-3 w-3 text-[#616161]" />
                  {values.probability || 10}% Win Chance
                </span>
              </div>

              {/* Central Slice Graphic Simulation */}
              <div className="relative my-2">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-sm transition-transform duration-300"
                  style={{ backgroundColor: values.color || "#4F46E5" }}
                >
                  <PillarIcon className="h-8 w-8 text-white drop-shadow-xs" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-[#303030] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-white dark:border-zinc-800">
                  {values.sortOrder || 1}
                </div>
              </div>

              {/* Label & Value */}
              <h4 className="text-[15px] font-bold text-[#303030] dark:text-zinc-100 mt-2 tracking-tight">
                {values.label || "Untitled Slice"}
              </h4>
              <p className="text-[12px] font-medium text-[#616161] dark:text-zinc-400 mt-0.5">
                {pillarBadge.tag}
              </p>
            </div>

            {/* Structured Summary Rows */}
            <div className="p-3 border-t border-[#e1e3e5] dark:border-zinc-800 space-y-1">
              <PolarisSummaryRow
                label="Prize Type"
                value={pillarBadge.label}
              />
              <PolarisSummaryRow
                label="Probability"
                value={`${values.probability || 10}%`}
              />
              <PolarisSummaryRow
                label="Slice Theme"
                value={
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-3 w-3 rounded-full border border-[#d2d5d9]"
                      style={{ backgroundColor: values.color || "#4F46E5" }}
                    />
                    <span className="font-mono text-[11px] uppercase">
                      {values.color || "#4F46E5"}
                    </span>
                  </div>
                }
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

      {/* Strategic Guidance */}
      <PolarisTipCard title="Wheel Economy Optimization">
        Ensure the sum of all slice probabilities on the wheel equals 100%. High-value
        prizes (e.g. gift cards) should ideally have a 0.5% - 2% probability.
      </PolarisTipCard>
    </div>
  );
}
