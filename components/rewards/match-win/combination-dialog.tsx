"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MatchWinCombination, MatchWinSymbol, PrizeType } from "./types";
import { PrizeIcon } from "./prize-icon";
import {
  Sparkles,
  Loader2,
  Coins,
  RotateCcw,
  Ticket,
  Gift,
  ShoppingBag,
  Check,
  Percent,
} from "lucide-react";
import { PolarisPresetChips } from "@/components/gamification/shared/polaris-form-ui";
import { cn } from "@/lib/utils";
import {
  GIFT_CARD_BRANDS,
  GIFT_CARD_DENOMINATIONS,
  TRY_AGAIN_PRESETS,
  ECOMMERCE_PERCENT_PRESETS,
  ECOMMERCE_FIXED_PRESETS,
  GAME_REWARD_TYPE_OPTIONS,
} from "./types";

interface CombinationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCombination: MatchWinCombination | null;
  setEditingCombination: (c: MatchWinCombination) => void;
  onSave: () => void;
  saving: boolean;
  rewardsData: any;
  symbols: MatchWinSymbol[];
  currencyName?: string;
}

const POINT_VALUE_PRESETS = [25, 50, 100, 250, 500];

export const CombinationDialog = ({
  open,
  onOpenChange,
  editingCombination,
  setEditingCombination,
  onSave,
  saving,
  rewardsData,
  symbols,
  currencyName = "Points",
}: CombinationDialogProps) => {
  if (!editingCombination) return null;

  const activeType: PrizeType =
    editingCombination.type === "VOUCHER"
      ? "INTERNAL_VOUCHER"
      : editingCombination.type || "COINS";

  const handleTypeChange = (newType: PrizeType) => {
    let updatedValue = editingCombination.value;

    if (newType === "COINS") {
      updatedValue = updatedValue || 50;
    } else if (newType === "NO_REWARDS") {
      updatedValue = 0;
    } else if (newType === "GIFT_CARD") {
      updatedValue =
        editingCombination.giftCardDenomination ||
        editingCombination.value ||
        100;
    } else if (newType === "ECOMMERCE") {
      updatedValue =
        editingCombination.ecommerceDiscountValue ||
        editingCombination.value ||
        20;
    }

    setEditingCombination({
      ...editingCombination,
      type: newType,
      value: updatedValue,
    });
  };

  const isNoRewards = activeType === "NO_REWARDS";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border-zinc-200 dark:border-zinc-800 p-6">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-7 w-7 rounded-lg bg-[#008060]/10 text-[#008060] flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <DialogTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Combination Rule
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-zinc-500">
            Define winning reel patterns, reward values, and payout odds.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Rule Key */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Rule Identifier Key * (e.g. 3_cherry, big_win)
            </Label>
            <Input
              value={editingCombination.key ?? ""}
              onChange={(e) =>
                setEditingCombination({
                  ...editingCombination,
                  key: e.target.value,
                })
              }
              className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs shadow-none font-mono"
            />
          </div>

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

          {/* Reel Pattern Selection (for winning combinations) */}
          {!isNoRewards && (
            <div className="space-y-3 p-3.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block">
                Reel Pattern Selection (3 Slots)
              </Label>

              {/* Live Reels Visual Preview */}
              <div className="flex items-center justify-center gap-3 p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xs">
                {[1, 2, 3].map((i) => {
                  const symId =
                    (editingCombination as any)[`symbol${i}Id`] ||
                    (editingCombination as any)[`symbol${i}`]?.id;
                  const sym = symbols.find((s) => s.id === symId);
                  return (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-xs flex flex-col items-center justify-center text-[10px] font-bold text-zinc-400 relative transition-all"
                      title={sym?.label || `Slot ${i}`}
                    >
                      {sym ? (
                        <PrizeIcon
                          iconName={sym.icon}
                          color={sym.color}
                          className="h-6 w-6"
                        />
                      ) : (
                        <span className="opacity-40 text-xs">?</span>
                      )}
                      <span className="absolute bottom-0.5 text-[8px] opacity-40 font-mono">
                        #{i}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <Select
                    key={i}
                    value={
                      (editingCombination as any)[`symbol${i}Id`] ||
                      (editingCombination as any)[`symbol${i}`]?.id ||
                      "none"
                    }
                    onValueChange={(v) =>
                      setEditingCombination({
                        ...editingCombination,
                        [`symbol${i}Id`]: v === "none" ? undefined : v,
                      } as any)
                    }
                  >
                    <SelectTrigger className="h-9 text-xs bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-none">
                      <SelectValue placeholder={`Symbol ${i}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" className="text-xs">
                        Empty
                      </SelectItem>
                      {symbols.map((s) => (
                        <SelectItem key={s.id} value={s.id!} className="text-xs">
                          <div className="flex items-center gap-2">
                            <PrizeIcon
                              iconName={s.icon}
                              color={s.color}
                              className="h-3.5 w-3.5"
                            />
                            <span className="text-xs font-medium">
                              {s.label}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ))}
              </div>
            </div>
          )}

          {/* 2. Type Specific Panels */}

          {/* 2A. Points */}
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
                <Input
                  type="number"
                  min={1}
                  value={editingCombination.value || ""}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setEditingCombination({
                      ...editingCombination,
                      value: val,
                    });
                  }}
                  className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-sm font-bold shadow-none"
                />
                <PolarisPresetChips
                  presets={POINT_VALUE_PRESETS}
                  currentValue={Number(editingCombination.value || 0)}
                  onSelect={(val) => {
                    setEditingCombination({
                      ...editingCombination,
                      value: val,
                    });
                  }}
                  prefix="+"
                />
              </div>
            </div>
          )}

          {/* 2B. Internal Voucher */}
          {activeType === "INTERNAL_VOUCHER" && (
            <div className="p-4 rounded-xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-900/40 space-y-3">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
                <Ticket className="h-4 w-4" />
                <span className="text-xs font-bold">Link to Reward Voucher</span>
              </div>
              <Select
                value={editingCombination.rewardId || "none"}
                onValueChange={(v) =>
                  setEditingCombination({
                    ...editingCombination,
                    rewardId: v === "none" ? undefined : v,
                  })
                }
              >
                <SelectTrigger className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs shadow-none">
                  <SelectValue placeholder="Select Reward Voucher..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" className="text-xs">
                    Select Reward...
                  </SelectItem>
                  {rewardsData?.getRewards?.map((r: any) => (
                    <SelectItem key={r.id} value={r.id} className="text-xs">
                      {r.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* 2C. Digital Gift Card */}
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
                  <Input
                    value={editingCombination.giftCardBrand || ""}
                    onChange={(e) => {
                      const b = e.target.value;
                      setEditingCombination({
                        ...editingCombination,
                        giftCardBrand: b,
                      });
                    }}
                    placeholder="e.g. Amazon Pay, Swiggy, Flipkart"
                    className="h-9 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs shadow-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Gift Card Denomination (₹)
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    value={
                      editingCombination.giftCardDenomination ||
                      editingCombination.value ||
                      ""
                    }
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setEditingCombination({
                        ...editingCombination,
                        giftCardDenomination: val,
                        value: val,
                      });
                    }}
                    placeholder="e.g. 100, 500, 1000"
                    className="h-9 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs font-bold shadow-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2D. Ecommerce / Shopify */}
          {activeType === "ECOMMERCE" && (
            <div className="p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/40 space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                <ShoppingBag className="h-4 w-4" />
                <span className="text-xs font-bold">Shopify / Store Discount</span>
              </div>

              {/* Type Toggle */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const val =
                      editingCombination.ecommerceDiscountValue || 20;
                    setEditingCombination({
                      ...editingCombination,
                      ecommerceDiscountType: "PERCENTAGE",
                      value: val,
                    });
                  }}
                  className={cn(
                    "flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all",
                    (editingCombination.ecommerceDiscountType ||
                      "PERCENTAGE") === "PERCENTAGE"
                      ? "border-emerald-600 bg-emerald-100/60 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100 shadow-xs"
                      : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 hover:border-zinc-300",
                  )}
                >
                  <Percent className="h-3.5 w-3.5" /> Percentage Discount (%)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const val =
                      editingCombination.ecommerceDiscountValue || 100;
                    setEditingCombination({
                      ...editingCombination,
                      ecommerceDiscountType: "FIXED_AMOUNT",
                      value: val,
                    });
                  }}
                  className={cn(
                    "flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all",
                    editingCombination.ecommerceDiscountType === "FIXED_AMOUNT"
                      ? "border-emerald-600 bg-emerald-100/60 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100 shadow-xs"
                      : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 hover:border-zinc-300",
                  )}
                >
                  <span>₹ Fixed Amount Off</span>
                </button>
              </div>

              {/* Value */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Discount Value{" "}
                  {(editingCombination.ecommerceDiscountType ||
                    "PERCENTAGE") === "PERCENTAGE"
                    ? "(%)"
                    : "(₹)"}
                </Label>
                <Input
                  type="number"
                  min={1}
                  value={
                    editingCombination.ecommerceDiscountValue ||
                    editingCombination.value ||
                    20
                  }
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setEditingCombination({
                      ...editingCombination,
                      ecommerceDiscountValue: val,
                      value: val,
                    });
                  }}
                  className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-sm font-bold shadow-none"
                />
                <PolarisPresetChips
                  presets={
                    (editingCombination.ecommerceDiscountType ||
                      "PERCENTAGE") === "PERCENTAGE"
                      ? ECOMMERCE_PERCENT_PRESETS
                      : ECOMMERCE_FIXED_PRESETS
                  }
                  currentValue={Number(
                    editingCombination.ecommerceDiscountValue ||
                      editingCombination.value ||
                      20,
                  )}
                  onSelect={(val) => {
                    setEditingCombination({
                      ...editingCombination,
                      ecommerceDiscountValue: val,
                      value: val,
                    });
                  }}
                  prefix={
                    (editingCombination.ecommerceDiscountType ||
                      "PERCENTAGE") === "PERCENTAGE"
                      ? ""
                      : "₹"
                  }
                />
              </div>
            </div>
          )}

          {/* 3. Odds & Limits */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Winning Probability (%) *
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={editingCombination.probability ?? 0}
                  onChange={(e) =>
                    setEditingCombination({
                      ...editingCombination,
                      probability: Number(e.target.value),
                    })
                  }
                  className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs shadow-none pr-8 font-mono"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-zinc-400 text-xs">%</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Max Lifetime Wins
              </Label>
              <Input
                type="number"
                placeholder="0 = Unlimited"
                value={editingCombination.maxWins ?? 0}
                onChange={(e) =>
                  setEditingCombination({
                    ...editingCombination,
                    maxWins: Number(e.target.value),
                  })
                }
                className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs shadow-none"
              />
            </div>
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
            disabled={saving || !editingCombination.key}
            className="rounded-lg text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 gap-2"
          >
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Save Combination
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
