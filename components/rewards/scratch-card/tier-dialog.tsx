import React from "react";
import { Loader2, RefreshCw, Ticket, Sparkles } from "lucide-react";
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

const TIER_VALUE_PRESETS = [10, 25, 50, 100, 250];

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
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-zinc-200 dark:border-zinc-800">
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
            Configure the prize type, value, and qualification requirements.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Reward Type
              </Label>
              <Select
                value={editingTier?.rewardType}
                onValueChange={(v) => {
                  setEditingTier((p) =>
                    p ? { ...p, rewardType: v as RewardType } : null,
                  );
                  if (v === "VOUCHER") {
                    getVouchers({
                      variables: {
                        mechanism: "SCRATCH_CARD",
                        pagination: { page: 1, limit: 100 },
                      },
                    });
                  }
                }}
              >
                <SelectTrigger className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs shadow-none">
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COINS" className="text-xs">
                    {currencyName} (Points)
                  </SelectItem>
                  <SelectItem value="VOUCHER" className="text-xs">
                    Voucher Coupon
                  </SelectItem>
                  <SelectItem value="NO_REWARDS" className="text-xs">
                    No Reward (Try Again)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Tier Label
              </Label>
              <UiInput
                placeholder="e.g. Gold Scratch Prize"
                value={editingTier?.label || ""}
                onChange={(e) =>
                  setEditingTier((p) =>
                    p ? { ...p, label: e.target.value } : null,
                  )
                }
                className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs shadow-none"
              />
            </div>
          </div>

          {editingTier?.rewardType === "VOUCHER" && (
            <div className="space-y-2 p-3.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Select Voucher Reward
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 text-[11px] gap-1 text-[#008060] hover:bg-[#008060]/10 px-2 rounded-md"
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
                value={editingTier?.rewardId || ""}
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
                        }
                      : null,
                  );
                }}
              >
                <SelectTrigger className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs shadow-none">
                  {editingTier?.rewardId ? (
                    (() => {
                      const selectedReward = uniqueVoucherRewards.find(
                        (r: any) => r.id === editingTier.rewardId,
                      );
                      return (
                        <div className="flex items-center gap-2">
                          <Ticket className="h-3.5 w-3.5 text-[#008060]" />
                          <span className="truncate text-xs font-medium">
                            {selectedReward?.title || "Unknown Voucher"}
                          </span>
                        </div>
                      );
                    })()
                  ) : (
                    <SelectValue placeholder="Select a voucher campaign..." />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {uniqueVoucherRewards.length === 0 ? (
                    <div className="p-4 text-center text-xs text-zinc-500">
                      No vouchers found for this mechanism
                    </div>
                  ) : (
                    uniqueVoucherRewards.map((reward: any) => (
                      <SelectItem key={reward.id} value={reward.id}>
                        <div className="flex flex-col">
                          <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                            {reward.title}
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            {reward.discountType === "PERCENTAGE"
                              ? `${reward.discountValue}% OFF`
                              : `Flat ${reward.discountValue} OFF`}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {editingTier?.rewardType === "COINS" && (
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Reward Value ({currencyName})
              </Label>
              <div className="flex flex-col gap-2">
                <UiInput
                  type="number"
                  value={editingTier?.rewardValue || 0}
                  onChange={(e) =>
                    setEditingTier((p) =>
                      p
                        ? { ...p, rewardValue: parseInt(e.target.value) || 0 }
                        : null,
                    )
                  }
                  className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs font-bold shadow-none"
                />
                <PolarisPresetChips
                  presets={TIER_VALUE_PRESETS}
                  currentValue={Number(editingTier?.rewardValue || 0)}
                  onSelect={(val) => {
                    setEditingTier((p) =>
                      p ? { ...p, rewardValue: val } : null,
                    );
                  }}
                  prefix="+"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Min Account Age (Days)
              </Label>
              <UiInput
                type="number"
                value={editingTier?.minAccountAge || 0}
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
                value={editingTier?.minActivity || 0}
                onChange={(e) =>
                  setEditingTier((p) =>
                    p ? { ...p, minActivity: parseInt(e.target.value) || 0 } : null,
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
              value={editingTier?.eligibilityDescription || ""}
              onChange={(v) =>
                setEditingTier((p) =>
                  p ? { ...p, eligibilityDescription: v } : null,
                )
              }
              minHeight="120px"
              placeholder="Describe who can win this prize..."
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
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
            disabled={isSaving}
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
