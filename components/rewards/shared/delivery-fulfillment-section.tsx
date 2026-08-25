"use client";

import React, { useMemo } from "react";
import {
  Coins,
  RotateCcw,
  Ticket,
  ShoppingBag,
  Gift,
  CheckCircle2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PolarisFormCard,
  PolarisPresetChips,
} from "@/components/gamification/shared/polaris-form-ui";
import { PillarManualSection } from "@/components/rewards/coupons/form/sections/pillars/pillar-manual-section";
import { PillarStoreSection } from "@/components/rewards/coupons/form/sections/pillars/pillar-store-section";
import { PillarGiftCardSection } from "@/components/rewards/coupons/form/sections/pillars/pillar-gift-card-section";
import { useGetManualVouchers } from "@/graphql/actions/rewards/manual";
import { useGetStoreDiscountRules } from "@/graphql/actions/rewards/store";
import {
  useGetDigitalCardRules,
  useGetEntityRewardWallet,
} from "@/graphql/actions/rewards/gift-cards";
import { TRY_AGAIN_PRESETS } from "@/components/rewards/shared/engagement-game-reward-types";
import { cn } from "@/lib/utils";

const POINT_VALUE_PRESETS = [10, 25, 50, 100, 250, 500];

export type MechanismOptionId =
  | "COINS"
  | "NO_REWARDS"
  | "INTERNAL"
  | "ECOMMERCE"
  | "DIGITAL_GIFT_CARD";

export interface DeliveryFulfillmentSectionProps {
  /** Formik instance — component reads/writes fields on it */
  formik: any;
  /** Optional reward ID for existing reward editing */
  rewardId?: string;
  /** Step number displayed in the card header (default: 3) */
  step?: number;
  /** Card title override */
  title?: string;
  /** Card description override */
  description?: string;
  /** Card badge override */
  badge?: string;
  /** Whether to show supply/limits inputs at the bottom (default: true) */
  showSupplyLimits?: boolean;
  /** Override the field used to track the active pillar (default: "mechanism") */
  pillarField?: string;
  /** Whether to show Points / Coins reward option (default: false, for game prizes) */
  allowPoints?: boolean;
  /** Whether to show Try Again / No Rewards option (default: false, for game prizes) */
  allowTryAgain?: boolean;
  /** Currency name for points payout (default: "Points") */
  currencyName?: string;
  /** Error renderer function */
  err?: (field: string) => React.ReactNode;
}

/**
 * Unified "Reward Mechanism & Delivery" card:
 * - Single, non-duplicate selector grid
 * - In Game Mode: Points, Try Again, Pillar 1 (Vouchers), Pillar 2 (Shopify), Pillar 3 (Gift Cards)
 * - In Coupon Mode: Pillar 1, Pillar 2, Pillar 3 + Supply Limits (Points & Try Again hidden)
 */
export function DeliveryFulfillmentSection({
  formik,
  rewardId,
  step = 3,
  title,
  description,
  badge,
  showSupplyLimits = true,
  pillarField = "mechanism",
  allowPoints = false,
  allowTryAgain = false,
  currencyName = "Points",
  err = () => null,
}: DeliveryFulfillmentSectionProps) {
  const { values, setFieldValue } = formik;

  // ── Data Fetching ─────────────────────────────────────────────────────────
  const { data: manualVouchersData, loading: manualLoading } =
    useGetManualVouchers();
  const manualVouchers = useMemo(
    () => manualVouchersData?.getManualVouchers?.items || [],
    [manualVouchersData],
  );

  const { data: storeRulesData, loading: storeLoading } =
    useGetStoreDiscountRules({ page: 1, limit: 100 });
  const storeRules = useMemo(
    () => storeRulesData?.getStoreDiscountRules?.items || [],
    [storeRulesData],
  );

  const { data: digitalCardsData, loading: digitalCardsLoading } =
    useGetDigitalCardRules({ page: 1, limit: 100 });
  const digitalCardRules = useMemo(
    () => digitalCardsData?.getDigitalCardRules?.items || [],
    [digitalCardsData],
  );

  const { data: walletData } = useGetEntityRewardWallet();
  const walletBalance = walletData?.getEntityRewardWallet?.balance ?? 0;

  // ── Game vs Coupon Mode ───────────────────────────────────────────────────
  const isGameMode = allowPoints || allowTryAgain;

  // ── Derived Selected Option ───────────────────────────────────────────────
  const currentSelectedId: MechanismOptionId = useMemo(() => {
    if (isGameMode) {
      if (values.rewardType === "COINS") return "COINS";
      if (values.rewardType === "NO_REWARDS") return "NO_REWARDS";
      if (
        values.rewardType === "STORE_DISCOUNT" ||
        values[pillarField] === "ECOMMERCE"
      )
        return "ECOMMERCE";
      if (
        values.rewardType === "DIGITAL_GIFT_CARD" ||
        values[pillarField] === "DIGITAL_GIFT_CARD"
      )
        return "DIGITAL_GIFT_CARD";
      return "INTERNAL";
    }

    const val = values[pillarField];
    if (val === "ECOMMERCE" || val === "STORE_DISCOUNT") return "ECOMMERCE";
    if (val === "DIGITAL_GIFT_CARD") return "DIGITAL_GIFT_CARD";
    return "INTERNAL";
  }, [isGameMode, values.rewardType, values[pillarField], pillarField]);

  // ── Handler for Selecting a Mechanism ─────────────────────────────────────
  const handleSelectMechanism = (id: MechanismOptionId) => {
    if (id === "COINS") {
      setFieldValue("rewardType", "COINS");
      setFieldValue("category", "POINTS");
      setFieldValue("rewardValue", values.rewardValue || 50);
      setFieldValue("inventoryRequired", false);
      if (
        isGameMode &&
        (!values.label ||
          values.label.includes("Scratch Card") ||
          values.label === "Better Luck Next Time")
      ) {
        setFieldValue("label", `${values.rewardValue || 50} ${currencyName}`);
      }
    } else if (id === "NO_REWARDS") {
      setFieldValue("rewardType", "NO_REWARDS");
      setFieldValue("category", "TRY_AGAIN");
      setFieldValue("rewardValue", 0);
      setFieldValue("inventoryRequired", false);
      if (isGameMode) {
        setFieldValue("label", "Better Luck Next Time");
      }
    } else if (id === "INTERNAL") {
      setFieldValue("rewardType", "INTERNAL_VOUCHER");
      setFieldValue(pillarField, "INTERNAL");
      setFieldValue("category", "INTERNAL_VOUCHERS");
      setFieldValue("couponType", "ONE_TO_ONE");
      setFieldValue("inventoryRequired", true);
      if (
        isGameMode &&
        (!values.label ||
          values.label.includes("Scratch Card") ||
          values.label === "Better Luck Next Time")
      ) {
        setFieldValue("label", "Special Reward Voucher");
      }
    } else if (id === "ECOMMERCE") {
      setFieldValue("rewardType", "STORE_DISCOUNT");
      setFieldValue(pillarField, "ECOMMERCE");
      setFieldValue("category", "DISCOUNTS");
      setFieldValue("couponType", "ONE_TO_MANY");
      setFieldValue("inventoryRequired", false);
      if (isGameMode) {
        const discType = values.ecommerceDiscountType || "PERCENTAGE";
        const discVal = values.ecommerceDiscountValue || 20;
        setFieldValue("rewardValue", discVal);
        setFieldValue(
          "label",
          discType === "PERCENTAGE"
            ? `${discVal}% Off Store Voucher`
            : `₹${discVal} Off Store Voucher`,
        );
      }
    } else if (id === "DIGITAL_GIFT_CARD") {
      setFieldValue("rewardType", "DIGITAL_GIFT_CARD");
      setFieldValue(pillarField, "DIGITAL_GIFT_CARD");
      setFieldValue("category", "GIFT_CARDS");
      setFieldValue("couponType", "ONE_TO_ONE");
      setFieldValue("inventoryRequired", false);
      if (isGameMode) {
        const brand = values.giftCardBrand || "Gift Card";
        const denom = values.giftCardDenomination || 100;
        setFieldValue("rewardValue", denom);
        setFieldValue("label", `₹${denom} ${brand} Gift Card`);
      }
    }
  };

  // ── Unified Options List ──────────────────────────────────────────────────
  const options = useMemo(() => {
    const list: {
      id: MechanismOptionId;
      title: string;
      subtitle: string;
      countLabel: string;
      icon: any;
      color: string;
      bgColor: string;
      activeBorder: string;
    }[] = [];

    if (allowPoints) {
      list.push({
        id: "COINS",
        title: "Points / Loyalty",
        subtitle: "Credit wallet points or loyalty coins",
        countLabel: `+${values.rewardValue || 50} ${currencyName}`,
        icon: Coins,
        color: "text-amber-600 dark:text-amber-400",
        bgColor: "bg-amber-500/10",
        activeBorder:
          "border-[#303030] dark:border-zinc-100 bg-[#f6f6f7] dark:bg-zinc-800 ring-1 ring-[#303030] dark:ring-zinc-100 shadow-xs",
      });
    }

    if (allowTryAgain) {
      list.push({
        id: "NO_REWARDS",
        title: "Try Again",
        subtitle: "Non-winning outcome; play again",
        countLabel: "No Payout",
        icon: RotateCcw,
        color: "text-zinc-600 dark:text-zinc-400",
        bgColor: "bg-zinc-500/10",
        activeBorder:
          "border-[#303030] dark:border-zinc-100 bg-[#f6f6f7] dark:bg-zinc-800 ring-1 ring-[#303030] dark:ring-zinc-100 shadow-xs",
      });
    }

    list.push(
      {
        id: "INTERNAL",
        title: "Pillar 1: Internal Vouchers",
        subtitle: "1:1 serial pools or single promo codes",
        countLabel: `${manualVouchers.length} vouchers`,
        icon: Ticket,
        color: "text-emerald-600 dark:text-emerald-400",
        bgColor: "bg-emerald-500/10",
        activeBorder:
          "border-[#303030] dark:border-zinc-100 bg-[#f6f6f7] dark:bg-zinc-800 ring-1 ring-[#303030] dark:ring-zinc-100 shadow-xs",
      },
      {
        id: "ECOMMERCE",
        title: "Pillar 2: Store Discounts",
        subtitle: "On-demand Shopify single-use codes",
        countLabel: `${storeRules.length} rules`,
        icon: ShoppingBag,
        color: "text-indigo-600 dark:text-indigo-400",
        bgColor: "bg-indigo-500/10",
        activeBorder:
          "border-[#303030] dark:border-zinc-100 bg-[#f6f6f7] dark:bg-zinc-800 ring-1 ring-[#303030] dark:ring-zinc-100 shadow-xs",
      },
      {
        id: "DIGITAL_GIFT_CARD",
        title: "Pillar 3: Digital Gift Cards",
        subtitle: "Amazon, Swiggy, Flipkart API cards",
        countLabel: `${digitalCardRules.length} offers`,
        icon: Gift,
        color: "text-violet-600 dark:text-violet-400",
        bgColor: "bg-violet-500/10",
        activeBorder:
          "border-[#303030] dark:border-zinc-100 bg-[#f6f6f7] dark:bg-zinc-800 ring-1 ring-[#303030] dark:ring-zinc-100 shadow-xs",
      },
    );

    return list;
  }, [
    allowPoints,
    allowTryAgain,
    values.rewardValue,
    currencyName,
    manualVouchers.length,
    storeRules.length,
    digitalCardRules.length,
  ]);

  const cardTitle =
    title ||
    (isGameMode
      ? "Reward Mechanism & Fulfillment"
      : "Delivery & Fulfillment");
  const cardDescription =
    description ||
    (isGameMode
      ? "Select the prize fulfillment mechanism and configure payout parameters or link voucher & gift card blueprints."
      : "Select the reward fulfillment pillar and link or configure voucher rules, store discount parameters, or digital brand cards.");
  const cardBadge =
    badge || (isGameMode ? "3-Pillar Engine" : "Pillar Engine");

  return (
    <PolarisFormCard
      step={step}
      title={cardTitle}
      description={cardDescription}
      badge={cardBadge}
    >
      <div className="space-y-4">
        {/* ── 1. Single Unified Selector Grid ─────────────────────────────── */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block">
              Fulfillment Mechanism <span className="text-[#d72c0d] ml-0.5">*</span>
            </label>
            <span className="text-[11.5px] text-[#616161]">
              Click to select prize type
            </span>
          </div>

          <div
            className={cn(
              "grid gap-2.5",
              isGameMode
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 sm:grid-cols-3",
            )}
          >
            {options.map((opt) => {
              const isSelected = currentSelectedId === opt.id;
              const Icon = opt.icon;

              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectMechanism(opt.id)}
                  className={cn(
                    "p-3.5 rounded-[8px] border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 relative overflow-hidden",
                    isSelected
                      ? opt.activeBorder
                      : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#aeb4b9]",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={cn(
                          "h-7 w-7 rounded-[6px] flex items-center justify-center shrink-0",
                          opt.bgColor,
                          opt.color,
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-[13px] font-semibold text-[#303030] dark:text-zinc-100 truncate">
                        {opt.title}
                      </span>
                    </div>

                    {isSelected && (
                      <CheckCircle2
                        className="h-4 w-4 shrink-0 text-[#303030] dark:text-zinc-100"
                      />
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#e1e3e5] dark:border-zinc-800 text-[11.5px]">
                    <span className="text-[#616161] truncate">
                      {opt.subtitle}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 font-medium shrink-0 border-[#d2d5d9]"
                    >
                      {opt.countLabel}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 2. Dynamic Sub-Panels Based on Unified Selection ────────────── */}

        {/* Sub-panel: Points Payout */}
        {currentSelectedId === "COINS" && allowPoints && (
          <div className="p-3.5 rounded-[8px] bg-amber-500/10 border border-amber-500/20 space-y-3 animate-in fade-in-50 duration-200">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
              <Coins className="h-4 w-4" />
              <span className="text-[13px] font-semibold">
                Loyalty Points Payout
              </span>
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-[#303030] dark:text-zinc-200">
                Amount of {currencyName}
              </label>
              <Input
                type="number"
                min={1}
                value={values.rewardValue || ""}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setFieldValue("rewardValue", val);
                  setFieldValue(
                    "label",
                    `${val} ${currencyName} Slice`,
                  );
                }}
                className="h-[40px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[14px] font-semibold"
              />
              <PolarisPresetChips
                presets={POINT_VALUE_PRESETS}
                currentValue={Number(values.rewardValue || 0)}
                onSelect={(val) => {
                  setFieldValue("rewardValue", val);
                  setFieldValue(
                    "label",
                    `${val} ${currencyName} Slice`,
                  );
                }}
                prefix="+"
              />
            </div>
          </div>
        )}

        {/* Sub-panel: Try Again */}
        {currentSelectedId === "NO_REWARDS" && allowTryAgain && (
          <div className="p-3.5 rounded-[8px] bg-[#f6f6f7]/60 dark:bg-zinc-800/40 border border-[#d2d5d9] dark:border-zinc-700 space-y-3 animate-in fade-in-50 duration-200">
            <div className="flex items-center gap-2 text-[#616161]">
              <RotateCcw className="h-4 w-4" />
              <span className="text-[13px] font-semibold text-[#303030] dark:text-zinc-100">
                Try Again (Loss) Prompt
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {TRY_AGAIN_PRESETS.map((preset) => (
                <Button
                  key={preset}
                  type="button"
                  variant={values.label === preset ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "h-8 text-[12px] rounded-[6px] cursor-pointer",
                    values.label === preset
                      ? "bg-[#303030] text-white hover:bg-[#303030]"
                      : "border-[#aeb4b9] bg-white dark:bg-zinc-900",
                  )}
                  onClick={() => setFieldValue("label", preset)}
                >
                  {preset}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Sub-panel: Pillar 1 (Internal Vouchers) */}
        {currentSelectedId === "INTERNAL" && (
          <PillarManualSection
            formik={formik}
            rewardId={rewardId}
            manualVouchers={manualVouchers}
            manualLoading={manualLoading}
            err={err}
          />
        )}

        {/* Sub-panel: Pillar 2 (Shopify Store Discounts) */}
        {currentSelectedId === "ECOMMERCE" && (
          <PillarStoreSection
            formik={formik}
            storeRules={storeRules}
            storeLoading={storeLoading}
          />
        )}

        {/* Sub-panel: Pillar 3 (Digital Gift Cards) */}
        {currentSelectedId === "DIGITAL_GIFT_CARD" && (
          <PillarGiftCardSection
            formik={formik}
            digitalCardRules={digitalCardRules}
            digitalCardsLoading={digitalCardsLoading}
            walletBalance={walletBalance}
          />
        )}

        {/* ── 3. Compact Supply & User Limits (Only if showSupplyLimits=true) ── */}
        {showSupplyLimits && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#e1e3e5] dark:border-zinc-800">
            <div className="p-3.5 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-800/40 space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="totalUsageLimit"
                  className="text-[13px] font-medium text-[#303030] dark:text-zinc-200"
                >
                  Total Supply Limit
                </label>
                <button
                  type="button"
                  onClick={() => formik.setFieldValue("totalUsageLimit", 0)}
                  className="text-[11px] text-[#616161] hover:text-[#303030] cursor-pointer"
                >
                  Unlimited (0)
                </button>
              </div>
              <div className="relative">
                <Input
                  id="totalUsageLimit"
                  type="number"
                  placeholder="0 = Unlimited"
                  className="h-[36px] bg-white dark:bg-zinc-900 border-[#aeb4b9] text-[13px] font-semibold rounded-[6px]"
                  {...formik.getFieldProps("totalUsageLimit")}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#616161]">
                  Units
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-800/40 space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="perUserLimit"
                  className="text-[13px] font-medium text-[#303030] dark:text-zinc-200"
                >
                  Limit Per Member
                </label>
                <button
                  type="button"
                  onClick={() => formik.setFieldValue("perUserLimit", 0)}
                  className="text-[11px] text-[#616161] hover:text-[#303030] cursor-pointer"
                >
                  Unlimited (0)
                </button>
              </div>
              <div className="relative">
                <Input
                  id="perUserLimit"
                  type="number"
                  placeholder="0 = Unlimited"
                  className="h-[36px] bg-white dark:bg-zinc-900 border-[#aeb4b9] text-[13px] font-semibold rounded-[6px]"
                  {...formik.getFieldProps("perUserLimit")}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#616161]">
                  Claims/User
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </PolarisFormCard>
  );
}
