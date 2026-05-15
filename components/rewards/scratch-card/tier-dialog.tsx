import React from "react";
import { Loader2, RefreshCw, Ticket } from "lucide-react";
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

export function TierDialog({
  isOpen,
  onOpenChange,
  editingTier,
  setEditingTier,
  onSave,
  isSaving,
  currencyName,
  uniqueVoucherRewards,
  vouchersLoading,
  getVouchers,
}: TierDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingTier?.id ? "Edit Tier" : "Add Reward Tier"}
          </DialogTitle>
          <DialogDescription>
            Configure the label, reward type, and eligibility for this tier.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
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
                <SelectTrigger>
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COINS">{currencyName}</SelectItem>
                  <SelectItem value="VOUCHER">Voucher</SelectItem>
                  <SelectItem value="NO_REWARDS">No Reward</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Label
              </Label>
              <UiInput
                placeholder="e.g. Gold Scratch"
                value={editingTier?.label || ""}
                onChange={(e) =>
                  setEditingTier((p) =>
                    p ? { ...p, label: e.target.value } : null,
                  )
                }
              />
            </div>
          </div>

          {editingTier?.rewardType === "VOUCHER" && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Select Voucher
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs gap-1 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
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
                <SelectTrigger>
                  {editingTier?.rewardId ? (
                    (() => {
                      const selectedReward = uniqueVoucherRewards.find(
                        (r: any) => r.id === editingTier.rewardId,
                      );
                      return (
                        <div className="flex items-center gap-2">
                          <Ticket className="h-3.5 w-3.5 text-indigo-500" />
                          <span className="truncate">
                            {selectedReward?.title || "Unknown Voucher"}
                          </span>
                        </div>
                      );
                    })()
                  ) : (
                    <span className="text-muted-foreground">
                      Select a voucher campaign
                    </span>
                  )}
                </SelectTrigger>
                <SelectContent>
                  {uniqueVoucherRewards.length === 0 ? (
                    <div className="p-4 text-center text-xs text-muted-foreground">
                      No vouchers found for this mechanism
                    </div>
                  ) : (
                    uniqueVoucherRewards.map((reward: any) => (
                      <SelectItem key={reward.id} value={reward.id}>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">
                            {reward.title}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Reward Value (for Coins)
              </Label>
              <UiInput
                type="number"
                disabled={editingTier?.rewardType === "VOUCHER"}
                value={editingTier?.rewardValue || 0}
                onChange={(e) =>
                  setEditingTier((p) =>
                    p
                      ? { ...p, rewardValue: parseInt(e.target.value) || 0 }
                      : null,
                  )
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
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
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">
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
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">
              Eligibility Description
            </Label>
            <RichTextEditor
              value={editingTier?.eligibilityDescription || ""}
              onChange={(v) =>
                setEditingTier((p) =>
                  p ? { ...p, eligibilityDescription: v } : null,
                )
              }
              minHeight="150px"
              placeholder="Describe who can win this prize..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={isSaving}
            className="gap-2"
          >
            {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {editingTier?.id ? "Save Changes" : "Add Tier"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
