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
import { Loader2, RefreshCw, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import { RewardType, WheelSegment } from "./types";

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
  currencyName = "Tokens",
}: SegmentDialogProps) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingSegment?.id ? "Edit Segment" : "Add Segment"}
          </DialogTitle>
          <DialogDescription>
            Configure label, reward type, value, and probability weight.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
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
                <SelectTrigger>
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COINS">{currencyName}</SelectItem>
                  <SelectItem value="VOUCHER">Voucher</SelectItem>
                  <SelectItem value="NO_REWARDS">No Rewards</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Label
              </Label>
              <Input
                placeholder="e.g. 50 Coins"
                value={editingSegment?.label || ""}
                onChange={(e) =>
                  setEditingSegment((p) =>
                    p ? { ...p, label: e.target.value } : null,
                  )
                }
              />
            </div>
          </div>

          {editingSegment?.rewardType === "VOUCHER" && (
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
                <SelectTrigger>
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
                                className="h-5 w-5 rounded object-cover border border-border/40 shrink-0"
                              />
                            ) : (
                              <div className="h-5 w-5 rounded bg-muted flex items-center justify-center border border-border/40 shrink-0">
                                <Ticket className="h-3 w-3 text-muted-foreground" />
                              </div>
                            )}
                            <span className="text-xs font-medium text-foreground truncate max-w-[150px]">
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
                    <div className="flex flex-col items-center justify-center p-4 space-y-3">
                      <span className="text-sm text-muted-foreground">
                        No vouchers found
                      </span>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                      >
                        <Link href="/rewards/coupons/create">
                          Add Vouchers to Spin & Wheel
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
                              className="h-6 w-6 rounded object-cover border border-border/40 shrink-0"
                            />
                          ) : (
                            <div className="h-6 w-6 rounded bg-muted flex items-center justify-center border border-border/40 shrink-0">
                              <Ticket className="h-3.5 w-3.5 text-muted-foreground" />
                            </div>
                          )}
                          <span className="text-xs font-medium text-foreground truncate">
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

          <div
            className={cn(
              "grid gap-4",
              editingSegment?.rewardType === "COINS"
                ? "grid-cols-2"
                : "grid-cols-1",
            )}
          >
            {editingSegment?.rewardType === "COINS" && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  Reward Value
                </Label>
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
                                ? `${val} Coins`
                                : p.label,
                          }
                        : null,
                    );
                  }}
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Probability Weight
              </Label>
              <Input
                type="number"
                value={editingSegment?.probability || 0}
                onChange={(e) =>
                  setEditingSegment((p) =>
                    p
                      ? { ...p, probability: parseInt(e.target.value) || 0 }
                      : null,
                  )
                }
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveSegment}
            disabled={creatingSegment || updatingSegment}
            className="gap-2"
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
