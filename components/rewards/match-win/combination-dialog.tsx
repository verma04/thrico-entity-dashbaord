"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MatchWinCombination, MatchWinSymbol, PrizeType } from "./types";

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

export const CombinationDialog = ({
  open,
  onOpenChange,
  editingCombination,
  setEditingCombination,
  onSave,
  saving,
  rewardsData,
  symbols,
  currencyName = "Tokens",
}: CombinationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Combination Rule</DialogTitle>
        </DialogHeader>
        {editingCombination ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Rule Key (e.g. 3_cherry)</Label>
              <Input
                value={editingCombination.key ?? ""}
                onChange={(e) =>
                  setEditingCombination({
                    ...editingCombination,
                    key: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Symbols Selection</Label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <Select
                    key={i}
                    value={
                      (editingCombination as any)[`symbol${i}Id`] || "none"
                    }
                    onValueChange={(v) =>
                      setEditingCombination({
                        ...editingCombination,
                        [`symbol${i}Id`]: v === "none" ? undefined : v,
                      } as any)
                    }
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder={`Symbol ${i}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Empty</SelectItem>
                      {symbols.map((s) => (
                        <SelectItem key={s.id} value={s.id!}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Reward Type</Label>
                <Select
                  value={editingCombination.type}
                  onValueChange={(v) =>
                    setEditingCombination({
                      ...editingCombination,
                      type: v as PrizeType,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COINS">{currencyName}</SelectItem>
                    <SelectItem value="VOUCHER">Voucher</SelectItem>
                    <SelectItem value="NO_REWARDS">No Rewards</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Value</Label>
                <Input
                  type="number"
                  value={editingCombination.value ?? 0}
                  onChange={(e) =>
                    setEditingCombination({
                      ...editingCombination,
                      value: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Winning Probability (0 to 1)</Label>
              <Input
                type="number"
                step="0.001"
                value={editingCombination.probability ?? 0}
                onChange={(e) =>
                  setEditingCombination({
                    ...editingCombination,
                    probability: Number(e.target.value),
                  })
                }
              />
              <p className="text-[10px] text-muted-foreground">
                Example: 0.05 = 5% chance
              </p>
            </div>
            <div className="space-y-2">
              <Label>Max Lifetime Wins (0 for Uncapped)</Label>
              <Input
                type="number"
                value={editingCombination.maxWins ?? 0}
                onChange={(e) =>
                  setEditingCombination({
                    ...editingCombination,
                    maxWins: Number(e.target.value),
                  })
                }
              />
            </div>
            {(editingCombination.type === "VOUCHER" ||
              editingCombination.type === "PREMIUM") && (
              <div className="space-y-2">
                <Label>Link to Reward</Label>
                <Select
                  value={editingCombination.rewardId || "none"}
                  onValueChange={(v) =>
                    setEditingCombination({
                      ...editingCombination,
                      rewardId: v === "none" ? undefined : v,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select Reward...</SelectItem>
                    {rewardsData?.getRewards?.map((r: any) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Loading combination...
          </div>
        )}
        <DialogFooter>
          <Button onClick={onSave} disabled={saving}>
            Save Combination
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
