import React from "react";
import {
  Zap,
  Gift,
  Ticket,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
        color:
          "bg-violet-100 dark:bg-violet-950/80 text-violet-800 dark:text-violet-300",
      };
    }
    if (pillar === "ECOMMERCE") {
      return {
        label: "Shopify Store",
        tag: "On-Demand Win",
        color:
          "bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300",
      };
    }
    return {
      label: "Internal Voucher",
      tag:
        formik.values.couponType === "ONE_TO_ONE"
          ? "1 Code / User"
          : "Shared Code",
      color:
        "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300",
    };
  };

  const pillarBadge = getPillarBadge();

  return (
    <div className="space-y-4">
      {/* Live Member Discovery Preview */}
      <PolarisSidebarCard title="Reward Preview" badge="Member View">
        <div className="space-y-3">
          {/* Card Mockup */}
          <div className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs overflow-hidden flex flex-col">
            {/* Banner Image */}
            <div className="h-40 w-full bg-[#f6f6f7] dark:bg-zinc-800 relative overflow-hidden">
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
                  <p className="text-[10px] text-[#616161] font-bold uppercase tracking-wider mt-2">
                    No Banner Uploaded
                  </p>
                </div>
              )}

              {/* Point Cost Pill */}
              <div className="absolute bottom-2.5 left-2.5">
                <div className="bg-[#303030]/90 dark:bg-black/90 backdrop-blur-md px-2.5 py-1 rounded-[4px] flex items-center gap-1.5 border border-white/20 shadow-sm">
                  <Zap className="h-3.5 w-3.5 text-white fill-white" />
                  <span className="text-[12px] font-bold text-white leading-none">
                    {formik.values.tcCost || 1} PTS
                  </span>
                </div>
              </div>
            </div>

            {/* Reward Card Body */}
            <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] bg-[#f6f6f7] dark:bg-zinc-800 border border-[#d2d5d9] text-[#303030] dark:text-zinc-100 uppercase tracking-wider">
                    {pillarBadge.label}
                  </span>
                  <span className="text-[10px] text-[#616161] font-semibold">
                    • {pillarBadge.tag}
                  </span>
                </div>

                <h4 className="text-[14px] font-semibold text-[#303030] dark:text-zinc-100 line-clamp-1">
                  {formik.values.title || "Untitled Reward Offer"}
                </h4>

                <p className="text-[12px] text-[#616161] dark:text-zinc-400 line-clamp-2 leading-[16px]">
                  {formik.values.description ||
                    "Enter a description to preview what members see before redeeming."}
                </p>
              </div>

              {/* Action Button */}
              <Button
                size="sm"
                disabled
                className="w-full bg-[#303030] text-white text-[12px] font-semibold h-[34px] rounded-[6px] gap-1 cursor-default opacity-90 shadow-none"
              >
                <span>Redeem for {formik.values.tcCost || 1} PTS</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Quick Specifications */}
          <div className="space-y-1 pt-1 border-t border-[#e1e3e5] dark:border-zinc-800">
            <PolarisSummaryRow
              label="Fulfillment Pillar"
              value={pillarBadge.label}
            />
            <PolarisSummaryRow
              label="Cost"
              value={`${formik.values.tcCost || 1} PTS`}
            />
            <PolarisSummaryRow
              label="Validity"
              value={`${formik.values.validityDays || 30} Days`}
            />
            <PolarisSummaryRow
              label="Audience"
              value={
                formik.values.memberEligibility === "TIERS"
                  ? "Select Tiers"
                  : formik.values.memberEligibility === "SPECIFIC_CUSTOMERS"
                    ? "Specific Members"
                    : "All Members"
              }
              isLast
            />
          </div>
        </div>
      </PolarisSidebarCard>

      {/* Strategic Tip */}
      {showStrategy && (
        <PolarisTipCard title="Reward Optimization">
          Rewards priced between 50 and 200 points achieve the highest redemption
          velocity. Always ensure coupon codes or digital card pools are funded
          before high-volume campaign announcements.
        </PolarisTipCard>
      )}
    </div>
  );
}
