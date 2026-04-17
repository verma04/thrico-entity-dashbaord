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
import { Loader2 } from "lucide-react";
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
                Label
              </Label>
              <Input
                placeholder="e.g. 50 TC"
                value={editingSegment?.label || ""}
                onChange={(e) =>
                  setEditingSegment((p) =>
                    p ? { ...p, label: e.target.value } : null,
                  )
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Reward Type
              </Label>
              <Select
                value={editingSegment?.rewardType}
                onValueChange={(v) =>
                  setEditingSegment((p) =>
                    p ? { ...p, rewardType: v as RewardType } : null,
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TC">Coins</SelectItem>
                  <SelectItem value="VOUCHER">Voucher</SelectItem>
                  <SelectItem value="NOTHING">No Rewards</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {editingSegment?.rewardType === "VOUCHER" && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Select Voucher
              </Label>
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
                  <SelectValue
                    placeholder={
                      vouchersLoading
                        ? "Loading vouchers..."
                        : "Select a voucher reward..."
                    }
                  />
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
                        {reward.title}
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
                Reward Value
              </Label>
              <Input
                type="number"
                value={editingSegment?.rewardValue || 0}
                onChange={(e) =>
                  setEditingSegment((p) =>
                    p
                      ? { ...p, rewardValue: parseInt(e.target.value) || 0 }
                      : null,
                  )
                }
              />
            </div>
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
