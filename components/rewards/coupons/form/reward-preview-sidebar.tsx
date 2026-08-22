import React from "react";
import {
  Zap,
  Gift,
  Ticket,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PolarisSidebarCard,
  PolarisTipCard,
  PolarisSummaryRow,
} from "@/components/gamification/shared/polaris-form-ui";

interface RewardPreviewSidebarProps {
  formik: any;
  showStrategy?: boolean;
}

export function RewardPreviewSidebar({
  formik,
  showStrategy = false,
}: RewardPreviewSidebarProps) {
  const getBannerUrl = () => {
    if (!formik.values.image) return null;
    return formik.values.image.startsWith("http")
      ? formik.values.image
      : `https://cdn.thrico.network/${formik.values.image}`;
  };

  const bannerUrl = getBannerUrl();

  const pillar: "INTERNAL" | "ECOMMERCE" | "DIGITAL_GIFT_CARD" =
    formik.values.rewardPillar ||
    (formik.values.rewardType === "STORE"
      ? "ECOMMERCE"
      : formik.values.rewardType === "GIFT_CARD"
        ? "DIGITAL_GIFT_CARD"
        : "INTERNAL");

  const getPillarBadge = () => {
    if (pillar === "DIGITAL_GIFT_CARD") {
      return {
        label: "Digital Gift Card",
        tag: formik.values.giftCardBrand || "Brand Card",
        color: "bg-violet-100 dark:bg-violet-950/80 text-violet-800 dark:text-violet-300",
      };
    }
    if (pillar === "ECOMMERCE") {
      return {
        label: "Shopify Store",
        tag: "On-Demand Win",
        color: "bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300",
      };
    }
    return {
      label: "Internal Voucher",
      tag: formik.values.couponType === "ONE_TO_ONE" ? "1 Code / User" : "Shared Code",
      color: "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300",
    };
  };

  const pillarBadge = getPillarBadge();

  return (
    <div className="space-y-6">
      {/* Live Member Discovery Preview */}
      <PolarisSidebarCard title="Reward Preview" badge="Member View">
        <div className="space-y-4">
          {/* Card Mockup */}
          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden flex flex-col">
            {/* Banner Image */}
            <div className="h-44 w-full bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden">
              {bannerUrl ? (
                <img
                  src={bannerUrl}
                  alt="Reward banner"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800/60">
                  {pillar === "DIGITAL_GIFT_CARD" ? (
                    <Gift className="h-8 w-8 text-violet-400" />
                  ) : pillar === "ECOMMERCE" ? (
                    <ShoppingBag className="h-8 w-8 text-indigo-400" />
                  ) : (
                    <Ticket className="h-8 w-8 text-emerald-400" />
                  )}
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-2">
                    No Banner Uploaded
                  </p>
                </div>
              )}

              {/* Point Cost Pill */}
              <div className="absolute bottom-3 left-3">
                <div className="bg-zinc-900/90 dark:bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/20 shadow-sm">
                  <Zap className="h-3.5 w-3.5 text-white fill-white" />
                  <span className="text-xs font-bold text-white leading-none">
                    {formik.values.tcCost || 1} Points
                  </span>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-zinc-100">
                  <Zap className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-100 fill-zinc-900 dark:fill-zinc-100" />
                  <span>{formik.values.tcCost || 0}</span>
                  <span className="text-[10px] text-zinc-400 font-medium">
                    Points
                  </span>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-mono">
                  {pillar === "DIGITAL_GIFT_CARD"
                    ? `₹${formik.values.giftCardValue || 500} Card`
                    : pillar === "ECOMMERCE"
                      ? formik.values.storeDiscountType === "PERCENTAGE"
                        ? `${formik.values.discountValue || 15}% Off`
                        : `₹${formik.values.discountValue || 100} Off`
                      : "Special Offer"}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold ${pillarBadge.color}`}>
                  <span>{pillarBadge.label}</span>
                </div>
                <span className="text-[9px] font-bold text-zinc-500 bg-muted px-1.5 py-0.5 rounded">
                  {pillarBadge.tag}
                </span>
              </div>

              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                {formik.values.title || "Your Reward Title"}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                {formik.values.description ||
                  "Enter a description to preview how this reward will appear to members."}
              </p>

              {/* Quick Summary Breakdown */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <PolarisSummaryRow
                  label="Reward Pillar"
                  value={
                    pillar === "DIGITAL_GIFT_CARD"
                      ? "Digital Gift Card"
                      : pillar === "ECOMMERCE"
                        ? "Shopify Store"
                        : "Internal Voucher"
                  }
                />
                <PolarisSummaryRow
                  label="Validity Period"
                  value={`${formik.values.validityDays || 30} Days`}
                />
                <PolarisSummaryRow
                  label="Available Supply"
                  value={
                    formik.values.totalUsageLimit
                      ? `${formik.values.totalUsageLimit} Units`
                      : "Unlimited"
                  }
                />
                <PolarisSummaryRow
                  label="Eligibility"
                  value={
                    formik.values.memberEligibility === "VERIFIED"
                      ? "Verified Only"
                      : formik.values.memberEligibility === "TIERS"
                        ? (formik.values.membershipTierId?.length || formik.values.eligibleTierIds?.length) > 0
                          ? `${formik.values.membershipTierId?.length || formik.values.eligibleTierIds?.length} Tier(s)`
                          : "Specific Tiers"
                        : formik.values.memberEligibility === "SPECIFIC_CUSTOMERS"
                          ? formik.values.eligibleUserIds?.length > 0
                            ? `${formik.values.eligibleUserIds.length} Customer(s)`
                            : "Specific Customers"
                          : "All Customers"
                  }
                  isLast
                />
              </div>

              <div className="pt-2">
                <Button
                  disabled
                  className="w-full h-10 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold text-xs gap-2 shadow-xs cursor-default opacity-95"
                >
                  Claim Reward
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PolarisSidebarCard>

      {/* Strategic Tip Card */}
      {showStrategy && (
        <PolarisTipCard title="Reward Optimization Tip">
          <ul className="space-y-2 text-[11px] text-zinc-600 dark:text-zinc-400">
            <li className="flex items-start gap-1.5">
              <span className="text-zinc-900 dark:text-zinc-100 font-bold">•</span>
              <span>
                Rewards attached to interactive games (Spin Wheel, Scratch Card) see 2.4x higher engagement.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-zinc-900 dark:text-zinc-100 font-bold">•</span>
              <span>
                Setting a minimum account age or activity points threshold prevents throwaway account farming.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-zinc-900 dark:text-zinc-100 font-bold">•</span>
              <span>
                Digital gift cards and Shopify discounts are generated on-demand only when a member wins.
              </span>
            </li>
          </ul>
        </PolarisTipCard>
      )}
    </div>
  );
}
