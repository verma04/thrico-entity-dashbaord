import React from "react";
import Link from "next/link";
import {
  Loader2,
  RefreshCw,
  Ticket,
  Sparkles,
  Coins,
  RotateCcw,
  Gift,
  ShoppingBag,
  Check,
  Percent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input as UiInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ScratchRewardTier, RewardType } from "./types";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { PolarisPresetChips } from "@/components/gamification/shared/polaris-form-ui";
import {
  GIFT_CARD_BRANDS,
  GIFT_CARD_DENOMINATIONS,
  TRY_AGAIN_PRESETS,
  ECOMMERCE_PERCENT_PRESETS,
  ECOMMERCE_FIXED_PRESETS,
  GAME_REWARD_TYPE_OPTIONS,
} from "./types";

interface TierDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingTier: ScratchRewardTier | null;
  setEditingTier: React.Dispatch<React.SetStateAction<ScratchRewardTier | null>>;
  onSave: () => Promise<void>;
  isSaving: boolean;
  currencyName: string;
  uniqueVoucherRewards: any[];
  vouchersLoading: boolean;
  getVouchers: (options?: any) => void;
}

const POINT_VALUE_PRESETS = [10, 25, 50, 100, 250, 500];

export function TierDialog({
  isOpen,
  onOpenChange,
  editingTier,
  setEditingTier,
  onSave,
  isSaving,
  currencyName = "Points",
  uniqueVoucherRewards,
  vouchersLoading,
  getVouchers,
}: TierDialogProps) {
  if (!editingTier) return null;

  const activeType: RewardType =
    editingTier.rewardType === "VOUCHER"
      ? "INTERNAL_VOUCHER"
      : editingTier.rewardType || "COINS";

  const handleTypeChange = (newType: RewardType) => {
    let updatedLabel = editingTier.label;
    let updatedValue = editingTier.rewardValue;

    if (newType === "COINS") {
      updatedValue = updatedValue || 50;
      updatedLabel = `${updatedValue} ${currencyName} Scratch Card`;
    } else if (newType === "NO_REWARDS") {
      updatedValue = 0;
      updatedLabel = "Better Luck Next Time";
    } else if (newType === "INTERNAL_VOUCHER") {
      updatedLabel = "Special Reward Voucher";
      getVouchers({
        variables: {
          mechanism: "SCRATCH_CARD",
          pagination: { page: 1, limit: 100 },
        },
      });
    } else if (newType === "GIFT_CARD") {
      const brand = editingTier.giftCardBrand || "Amazon Pay";
      const denom = editingTier.giftCardDenomination || 100;
      updatedValue = denom;
      updatedLabel = `₹${denom} ${brand} Gift Card`;
    } else if (newType === "ECOMMERCE") {
      const discType = editingTier.ecommerceDiscountType || "PERCENTAGE";
      const discVal = editingTier.ecommerceDiscountValue || 20;
      updatedValue = discVal;
      updatedLabel =
        discType === "PERCENTAGE"
          ? `${discVal}% Off Store Voucher`
          : `₹${discVal} Off Store Voucher`;
    }

    setEditingTier((p) =>
      p
        ? {
            ...p,
            rewardType: newType,
            label: updatedLabel,
            rewardValue: updatedValue,
          }
        : null,
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-zinc-200 dark:border-zinc-800 p-6">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-7 w-7 rounded-lg bg-[#008060]/10 text-[#008060] flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <DialogTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {editingTier?.id ? "Edit Reward Tier" : "Add Reward Tier"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-zinc-500">
            Configure the prize type, value, and member qualification rules.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* 1. Reward Type Selection - Visual Card Grid */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Reward Type
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {GAME_REWARD_TYPE_OPTIONS.map((opt) => {
                const isSelected = activeType === opt.value;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleTypeChange(opt.value)}
                    className={cn(
                      "flex flex-col text-left p-2.5 rounded-xl border text-xs transition-all relative",
                      isSelected
                        ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900/[0.03] dark:bg-zinc-100/[0.06] ring-1 ring-zinc-900 dark:ring-zinc-100 shadow-xs"
                        : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700",
                    )}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <div
                        className="h-6 w-6 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${opt.accentColor}18` }}
                      >
                        <Icon
                          className="h-3.5 w-3.5"
                          style={{ color: opt.accentColor }}
                        />
                      </div>
                      {isSelected && (
                        <span className="h-4 w-4 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center text-[10px]">
                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 text-[11px] truncate">
                      {opt.shortLabel}
                    </span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 line-clamp-1 mt-0.5">
                      {opt.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Type Specific Panels */}

          {/* 2A. Points / Currency */}
          {activeType === "COINS" && (
            <div className="p-4 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 space-y-3">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                <Coins className="h-4 w-4" />
                <span className="text-xs font-bold">Points Payout</span>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Amount of {currencyName}
                </Label>
                <UiInput
                  type="number"
                  min={1}
                  value={editingTier.rewardValue || ""}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setEditingTier((p) =>
                      p
                        ? {
                            ...p,
                            rewardValue: val,
                            label: `${val} ${currencyName} Scratch Card`,
                          }
                        : null,
                    );
                  }}
                  className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-sm font-bold shadow-none"
                />
                <PolarisPresetChips
                  presets={POINT_VALUE_PRESETS}
                  currentValue={Number(editingTier.rewardValue || 0)}
                  onSelect={(val) => {
                    setEditingTier((p) =>
                      p
                        ? {
                            ...p,
                            rewardValue: val,
                            label: `${val} ${currencyName} Scratch Card`,
                          }
                        : null,
                    );
                  }}
                  prefix="+"
                />
              </div>
            </div>
          )}

          {/* 2B. Try Again */}
          {activeType === "NO_REWARDS" && (
            <div className="p-4 rounded-xl bg-zinc-100/70 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-3">
              <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                <RotateCcw className="h-4 w-4" />
                <span className="text-xs font-bold">Try Again (Loss)</span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Card yields no prize. Choose a supportive message.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {TRY_AGAIN_PRESETS.map((preset) => (
                  <Button
                    key={preset}
                    type="button"
                    variant={editingTier.label === preset ? "default" : "outline"}
                    size="sm"
                    className="h-7 text-[11px] rounded-lg"
                    onClick={() =>
                      setEditingTier((p) => (p ? { ...p, label: preset } : null))
                    }
                  >
                    {preset}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* 2C. Internal Voucher */}
          {activeType === "INTERNAL_VOUCHER" && (
            <div className="p-4 rounded-xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
                  <Ticket className="h-4 w-4" />
                  <span className="text-xs font-bold">Select Reward Voucher</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 text-[11px] gap-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100/50 px-2 rounded-md"
                  onClick={() =>
                    getVouchers({
                      variables: {
                        mechanism: "SCRATCH_CARD",
                        pagination: { page: 1, limit: 100 },
                      },
                    })
                  }
                  disabled={vouchersLoading}
                >
                  <RefreshCw
                    className={cn("h-3 w-3", vouchersLoading && "animate-spin")}
                  />
                  Refresh
                </Button>
              </div>

              <Select
                value={editingTier.rewardId || ""}
                onValueChange={(v) => {
                  const selectedReward = uniqueVoucherRewards.find(
                    (r: any) => r.id === v,
                  );
                  setEditingTier((p) =>
                    p
                      ? {
                          ...p,
                          rewardId: v,
                          label: selectedReward ? selectedReward.title : p.label,
                          rewardValue:
                            selectedReward?.discountValue || p.rewardValue,
                        }
                      : null,
                  );
                }}
              >
                <SelectTrigger className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs shadow-none">
                  {editingTier.rewardId ? (
                    (() => {
                      const selectedReward = uniqueVoucherRewards.find(
                        (r: any) => r.id === editingTier.rewardId,
                      );
                      if (selectedReward) {
                        return (
                          <div className="flex items-center gap-2">
                            <Ticket className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                            <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate">
                              {selectedReward.title}
                            </span>
                          </div>
                        );
                      }
                      return (
                        <SelectValue placeholder="Select a voucher reward..." />
                      );
                    })()
                  ) : (
                    <SelectValue
                      placeholder={
                        vouchersLoading
                          ? "Loading vouchers..."
                          : "Select a voucher reward..."
                      }
                    />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {uniqueVoucherRewards.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-4 space-y-2">
                      <span className="text-xs text-zinc-500">
                        No vouchers configured for Scratch Card
                      </span>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full text-xs font-semibold"
                      >
                        <Link href="/gamification/rewards/coupons/create">
                          Create Reward Coupon
                        </Link>
                      </Button>
                      <SelectItem value="none" disabled className="hidden">
                        None
                      </SelectItem>
                    </div>
                  ) : (
                    uniqueVoucherRewards.map((reward: any) => (
                      <SelectItem key={reward.id} value={reward.id}>
                        <div className="flex items-center gap-2 py-0.5">
                          <Ticket className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                          <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate">
                            {reward.title}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* 2D. Digital Gift Card */}
          {activeType === "GIFT_CARD" && (
            <div className="p-4 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-200/70 dark:border-purple-900/40 space-y-4">
              <div className="flex items-center gap-2 text-purple-800 dark:text-purple-300">
                <Gift className="h-4 w-4" />
                <span className="text-xs font-bold">Brand Digital Gift Card</span>
              </div>

              {/* Direct Brand & Value Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Brand / Provider Name
                  </Label>
                  <UiInput
                    value={editingTier.giftCardBrand || ""}
                    onChange={(e) => {
                      const b = e.target.value;
                      const denom = editingTier.giftCardDenomination || editingTier.rewardValue || 100;
                      setEditingTier((p) =>
                        p
                          ? {
                              ...p,
                              giftCardBrand: b,
                              label: `₹${denom} ${b} Gift Card`,
                            }
                          : null
                      );
                    }}
                    placeholder="e.g. Amazon Pay, Swiggy, Flipkart"
                    className="h-9 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs shadow-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Gift Card Denomination (₹)
                  </Label>
                  <UiInput
                    type="number"
                    min={1}
                    value={editingTier.giftCardDenomination || editingTier.rewardValue || ""}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      const brand = editingTier.giftCardBrand || "Gift Card";
                      setEditingTier((p) =>
                        p
                          ? {
                              ...p,
                              giftCardDenomination: val,
                              rewardValue: val,
                              label: `₹${val} ${brand}`,
                            }
                          : null
                      );
                    }}
                    placeholder="e.g. 100, 500, 1000"
                    className="h-9 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs font-bold shadow-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2E. Ecommerce / Shopify */}
          {activeType === "ECOMMERCE" && (
            <div className="p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/40 space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                <ShoppingBag className="h-4 w-4" />
                <span className="text-xs font-bold">Shopify / Store Discount</span>
              </div>

              {/* Discount Type Toggle */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const val = editingTier.ecommerceDiscountValue || 20;
                    setEditingTier((p) =>
                      p
                        ? {
                            ...p,
                            ecommerceDiscountType: "PERCENTAGE",
                            rewardValue: val,
                            label: `${val}% Off Store Voucher`,
                          }
                        : null,
                    );
                  }}
                  className={cn(
                    "flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all",
                    (editingTier.ecommerceDiscountType || "PERCENTAGE") ===
                      "PERCENTAGE"
                      ? "border-emerald-600 bg-emerald-100/60 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100 shadow-xs"
                      : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 hover:border-zinc-300",
                  )}
                >
                  <Percent className="h-3.5 w-3.5" /> Percentage Discount (%)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const val = editingTier.ecommerceDiscountValue || 100;
                    setEditingTier((p) =>
                      p
                        ? {
                            ...p,
                            ecommerceDiscountType: "FIXED_AMOUNT",
                            rewardValue: val,
                            label: `₹${val} Off Store Voucher`,
                          }
                        : null,
                    );
                  }}
                  className={cn(
                    "flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all",
                    editingTier.ecommerceDiscountType === "FIXED_AMOUNT"
                      ? "border-emerald-600 bg-emerald-100/60 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100 shadow-xs"
                      : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 hover:border-zinc-300",
                  )}
                >
                  <span>₹ Fixed Amount Off</span>
                </button>
              </div>

              {/* Discount Value */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Discount Value{" "}
                  {(editingTier.ecommerceDiscountType || "PERCENTAGE") ===
                  "PERCENTAGE"
                    ? "(%)"
                    : "(₹)"}
                </Label>
                <UiInput
                  type="number"
                  min={1}
                  value={
                    editingTier.ecommerceDiscountValue ||
                    editingTier.rewardValue ||
                    20
                  }
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    const isPct =
                      (editingTier.ecommerceDiscountType || "PERCENTAGE") ===
                      "PERCENTAGE";
                    setEditingTier((p) =>
                      p
                        ? {
                            ...p,
                            ecommerceDiscountValue: val,
                            rewardValue: val,
                            label: isPct
                              ? `${val}% Off Store Voucher`
                              : `₹${val} Off Store Voucher`,
                          }
                        : null,
                    );
                  }}
                  className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-sm font-bold shadow-none"
                />
                <PolarisPresetChips
                  presets={
                    (editingTier.ecommerceDiscountType || "PERCENTAGE") ===
                    "PERCENTAGE"
                      ? ECOMMERCE_PERCENT_PRESETS
                      : ECOMMERCE_FIXED_PRESETS
                  }
                  currentValue={Number(
                    editingTier.ecommerceDiscountValue ||
                      editingTier.rewardValue ||
                      20,
                  )}
                  onSelect={(val) => {
                    const isPct =
                      (editingTier.ecommerceDiscountType || "PERCENTAGE") ===
                      "PERCENTAGE";
                    setEditingTier((p) =>
                      p
                        ? {
                            ...p,
                            ecommerceDiscountValue: val,
                            rewardValue: val,
                            label: isPct
                              ? `${val}% Off Store Voucher`
                              : `₹${val} Off Store Voucher`,
                          }
                        : null,
                    );
                  }}
                  prefix={
                    (editingTier.ecommerceDiscountType || "PERCENTAGE") ===
                    "PERCENTAGE"
                      ? ""
                      : "₹"
                  }
                />
              </div>
            </div>
          )}

          {/* 3. Tier Label */}
          <div className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Tier Display Label *
            </Label>
            <UiInput
              placeholder="e.g. Gold Scratch Prize"
              value={editingTier.label || ""}
              onChange={(e) =>
                setEditingTier((p) => (p ? { ...p, label: e.target.value } : null))
              }
              className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs font-semibold shadow-none"
            />
          </div>

          {/* 4. Eligibility & Gating Criteria */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Min Account Age (Days)
              </Label>
              <UiInput
                type="number"
                min={0}
                value={editingTier.minAccountAge || 0}
                onChange={(e) =>
                  setEditingTier((p) =>
                    p
                      ? { ...p, minAccountAge: parseInt(e.target.value) || 0 }
                      : null,
                  )
                }
                className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs shadow-none"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Min Activity Points
              </Label>
              <UiInput
                type="number"
                min={0}
                value={editingTier.minActivity || 0}
                onChange={(e) =>
                  setEditingTier((p) =>
                    p
                      ? { ...p, minActivity: parseInt(e.target.value) || 0 }
                      : null,
                  )
                }
                className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs shadow-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Eligibility Description (Optional)
            </Label>
            <RichTextEditor
              value={editingTier.eligibilityDescription || ""}
              onChange={(v) =>
                setEditingTier((p) =>
                  p ? { ...p, eligibilityDescription: v } : null,
                )
              }
              minHeight="110px"
              placeholder="Describe who is eligible to win this tier..."
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="rounded-lg text-xs font-semibold"
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={isSaving || !editingTier.label}
            className="rounded-lg text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 gap-2"
          >
            {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {editingTier?.id ? "Save Changes" : "Add Tier"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
