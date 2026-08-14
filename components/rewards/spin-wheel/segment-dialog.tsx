import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2, RefreshCw, Ticket, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { RewardType, WheelSegment } from "./types";
import { PolarisPresetChips } from "@/components/gamification/shared/polaris-form-ui";

interface SegmentDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  editingSegment: WheelSegment | null;
  setEditingSegment: React.Dispatch<React.SetStateAction<WheelSegment | null>>;
  handleSaveSegment: () => void;
  creatingSegment: boolean;
  updatingSegment: boolean;
  uniqueVoucherRewards: any[];
  vouchersLoading: boolean;
  getVouchers: (options?: any) => void;
  currencyName?: string;
}

const SEGMENT_VALUE_PRESETS = [10, 25, 50, 100, 250];

export function SegmentDialog({
  isDialogOpen,
  setIsDialogOpen,
  editingSegment,
  setEditingSegment,
  handleSaveSegment,
  creatingSegment,
  updatingSegment,
  uniqueVoucherRewards,
  vouchersLoading,
  getVouchers,
  currencyName = "Points",
}: SegmentDialogProps) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-md rounded-2xl border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-7 w-7 rounded-lg bg-[#008060]/10 text-[#008060] flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <DialogTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {editingSegment?.id ? "Edit Wheel Segment" : "Add Wheel Segment"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-zinc-500">
            Configure the prize type, value, and probability weight.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Reward Type
              </Label>
              <Select
                value={editingSegment?.rewardType}
                onValueChange={(v) => {
                  setEditingSegment((p) =>
                    p ? { ...p, rewardType: v as RewardType } : null,
                  );
                  if (v === "VOUCHER") {
                    getVouchers({
                      variables: {
                        mechanism: "SPIN_WHEEL",
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
                Display Label
              </Label>
              <Input
                placeholder="e.g. 50 Points, 20% Off"
                value={editingSegment?.label || ""}
                onChange={(e) =>
                  setEditingSegment((p) =>
                    p ? { ...p, label: e.target.value } : null,
                  )
                }
                className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs shadow-none"
              />
            </div>
          </div>

          {editingSegment?.rewardType === "VOUCHER" && (
            <div className="space-y-2 p-3 rounded-xl bg-zinc-50/50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700">
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
                        mechanism: "SPIN_WHEEL",
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
                value={editingSegment?.rewardId || ""}
                onValueChange={(v) => {
                  const selectedReward = uniqueVoucherRewards.find(
                    (r: any) => r.id === v,
                  );
                  setEditingSegment((p) =>
                    p
                      ? {
                          ...p,
                          rewardId: v,
                          label: selectedReward
                            ? selectedReward.title
                            : p.label,
                        }
                      : null,
                  );
                }}
              >
                <SelectTrigger className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs shadow-none">
                  {editingSegment?.rewardId ? (
                    (() => {
                      const selectedReward = uniqueVoucherRewards.find(
                        (r: any) => r.id === editingSegment.rewardId,
                      );
                      if (selectedReward) {
                        return (
                          <div className="flex items-center gap-2">
                            {selectedReward.image ? (
                              <img
                                src={selectedReward.image}
                                alt={selectedReward.title}
                                className="h-5 w-5 rounded object-cover border border-zinc-200 shrink-0"
                              />
                            ) : (
                              <div className="h-5 w-5 rounded bg-zinc-100 flex items-center justify-center shrink-0">
                                <Ticket className="h-3 w-3 text-zinc-500" />
                              </div>
                            )}
                            <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-[180px]">
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
                        No vouchers configured for Spin Wheel
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
                          {reward.image ? (
                            <img
                              src={reward.image}
                              alt={reward.title}
                              className="h-5 w-5 rounded object-cover border border-zinc-200 shrink-0"
                            />
                          ) : (
                            <div className="h-5 w-5 rounded bg-zinc-100 flex items-center justify-center shrink-0">
                              <Ticket className="h-3 w-3 text-zinc-500" />
                            </div>
                          )}
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

          {editingSegment?.rewardType === "COINS" && (
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Reward Value ({currencyName})
              </Label>
              <div className="flex flex-col gap-2">
                <Input
                  type="number"
                  value={editingSegment?.rewardValue || 0}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setEditingSegment((p) =>
                      p
                        ? {
                            ...p,
                            rewardValue: val,
                            label:
                              p.rewardType === "COINS"
                                ? `${val} ${currencyName}`
                                : p.label,
                          }
                        : null,
                    );
                  }}
                  className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs font-bold shadow-none"
                />
                <PolarisPresetChips
                  presets={SEGMENT_VALUE_PRESETS}
                  currentValue={Number(editingSegment?.rewardValue || 0)}
                  onSelect={(val) => {
                    setEditingSegment((p) =>
                      p
                        ? {
                            ...p,
                            rewardValue: val,
                            label: `${val} ${currencyName}`,
                          }
                        : null,
                    );
                  }}
                  prefix="+"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Probability Weight
              </Label>
              <span className="text-[11px] text-zinc-400">
                Relative odds ratio
              </span>
            </div>
            <Input
              type="number"
              min={1}
              value={editingSegment?.probability || 0}
              onChange={(e) =>
                setEditingSegment((p) =>
                  p
                    ? { ...p, probability: parseInt(e.target.value) || 0 }
                    : null,
                )
              }
              className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs shadow-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDialogOpen(false)}
            className="rounded-lg text-xs font-semibold"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveSegment}
            disabled={creatingSegment || updatingSegment}
            className="rounded-lg text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 gap-2"
          >
            {(creatingSegment || updatingSegment) && (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            )}
            {editingSegment?.id ? "Save Changes" : "Add Segment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
