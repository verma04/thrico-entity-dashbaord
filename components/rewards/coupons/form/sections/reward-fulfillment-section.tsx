"use client";

import React from "react";
import {
  Ticket,
  ShoppingBag,
  Gift,
  CheckCircle2,
  Layers,
  Sparkles,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PolarisFormCard } from "@/components/gamification/shared/polaris-form-ui";
import { PillarManualSection } from "./pillars/pillar-manual-section";
import { PillarStoreSection } from "./pillars/pillar-store-section";
import { PillarGiftCardSection } from "./pillars/pillar-gift-card-section";
import { cn } from "@/lib/utils";

interface RewardFulfillmentSectionProps {
  formik: any;
  rewardId?: string;
  currentPillar: "INTERNAL" | "ECOMMERCE" | "DIGITAL_GIFT_CARD";
  handlePillarChange: (pillar: "INTERNAL" | "ECOMMERCE" | "DIGITAL_GIFT_CARD") => void;
  manualVouchers: any[];
  manualLoading: boolean;
  storeRules: any[];
  storeLoading: boolean;
  digitalCardRules: any[];
  digitalCardsLoading: boolean;
  walletBalance: number;
  err: (field: string) => React.ReactNode;
}

export function RewardFulfillmentSection({
  formik,
  rewardId,
  currentPillar,
  handlePillarChange,
  manualVouchers,
  manualLoading,
  storeRules,
  storeLoading,
  digitalCardRules,
  digitalCardsLoading,
  walletBalance,
  err,
}: RewardFulfillmentSectionProps) {
  const PILLARS = [
    {
      id: "INTERNAL" as const,
      title: "Pillar 1: Internal Vouchers",
      subtitle: "1:1 serial pools or single promo codes",
      countLabel: `${manualVouchers.length} vouchers`,
      icon: Ticket,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10",
      activeBorder: "border-emerald-600 ring-1 ring-emerald-600/30 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-xs",
    },
    {
      id: "ECOMMERCE" as const,
      title: "Pillar 2: Store Discounts",
      subtitle: "On-demand Shopify single-use win codes",
      countLabel: `${storeRules.length} rules`,
      icon: ShoppingBag,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-500/10",
      activeBorder: "border-indigo-600 ring-1 ring-indigo-600/30 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-xs",
    },
    {
      id: "DIGITAL_GIFT_CARD" as const,
      title: "Pillar 3: Digital Gift Cards",
      subtitle: "Amazon, Swiggy, Flipkart API cards",
      countLabel: `${digitalCardRules.length} offers`,
      icon: Gift,
      color: "text-violet-600 dark:text-violet-400",
      bgColor: "bg-violet-500/10",
      activeBorder: "border-violet-600 ring-1 ring-violet-600/30 bg-violet-50/20 dark:bg-violet-950/20 shadow-xs",
    },
  ];

  return (
    <PolarisFormCard
      step={3}
      title="Delivery & Fulfillment"
      description="Select the reward fulfillment pillar and link or configure voucher rules, store discount parameters, or digital brand cards."
      badge="Pillar Engine"
    >
      {/* ── 3.1: Compact Multi-Pillar Selector Cards ─────────────────── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-bold text-foreground block">
            Fulfillment Mechanism *
          </Label>
          <span className="text-[10px] text-muted-foreground">
            Click to switch pillar
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {PILLARS.map((pillar) => {
            const isSelected = currentPillar === pillar.id;
            const Icon = pillar.icon;

            return (
              <div
                key={pillar.id}
                onClick={() => handlePillarChange(pillar.id)}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 relative overflow-hidden",
                  isSelected
                    ? pillar.activeBorder
                    : "border-border/70 bg-card hover:border-border hover:bg-muted/20"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center shrink-0", pillar.bgColor, pillar.color)}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs font-bold text-foreground truncate">
                      {pillar.title}
                    </span>
                  </div>

                  {isSelected && (
                    <CheckCircle2 className={cn("h-4 w-4 shrink-0", pillar.color)} />
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40 text-[10px]">
                  <span className="text-muted-foreground truncate">
                    {pillar.subtitle}
                  </span>
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-medium shrink-0">
                    {pillar.countLabel}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 3.2: Dynamic Sub-Pillar Configuration ────────────────────────── */}
      {currentPillar === "INTERNAL" && (
        <PillarManualSection
          formik={formik}
          rewardId={rewardId}
          manualVouchers={manualVouchers}
          manualLoading={manualLoading}
          err={err}
        />
      )}

      {currentPillar === "ECOMMERCE" && (
        <PillarStoreSection
          formik={formik}
          storeRules={storeRules}
          storeLoading={storeLoading}
        />
      )}

      {currentPillar === "DIGITAL_GIFT_CARD" && (
        <PillarGiftCardSection
          formik={formik}
          digitalCardRules={digitalCardRules}
          digitalCardsLoading={digitalCardsLoading}
          walletBalance={walletBalance}
        />
      )}

      {/* ── 3.3: Compact Supply & User Limits ──────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-border/70">
        <div className="p-3 rounded-xl border border-border/70 bg-card space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="totalUsageLimit"
              className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
            >
              Total Supply Limit
            </Label>
            <button
              type="button"
              onClick={() => formik.setFieldValue("totalUsageLimit", 0)}
              className="text-[10px] text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Unlimited (0)
            </button>
          </div>
          <div className="relative">
            <Input
              id="totalUsageLimit"
              type="number"
              placeholder="0 = Unlimited"
              className="h-9 bg-muted/20 border-border text-xs font-semibold shadow-none"
              {...formik.getFieldProps("totalUsageLimit")}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-medium">
              Units
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl border border-border/70 bg-card space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="perUserLimit"
              className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
            >
              Limit Per Member
            </Label>
            <button
              type="button"
              onClick={() => formik.setFieldValue("perUserLimit", 0)}
              className="text-[10px] text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Unlimited (0)
            </button>
          </div>
          <div className="relative">
            <Input
              id="perUserLimit"
              type="number"
              placeholder="0 = Unlimited"
              className="h-9 bg-muted/20 border-border text-xs font-semibold shadow-none"
              {...formik.getFieldProps("perUserLimit")}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-medium">
              Claims/User
            </span>
          </div>
        </div>
      </div>
    </PolarisFormCard>
  );
}
