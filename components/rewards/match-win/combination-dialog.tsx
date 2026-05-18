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
import { PrizeIcon } from "./prize-icon";

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

            {editingCombination.type !== "NO_REWARDS" && (
              <div className="space-y-3">
                <Label>Symbols Selection</Label>
                
                {/* Live Reels Visual Preview */}
                <div className="flex items-center justify-center gap-3 p-3 bg-slate-50 border border-slate-200/50 rounded-2xl shadow-inner">
                  {[1, 2, 3].map((i) => {
                    const symId = (editingCombination as any)[`symbol${i}Id`] || (editingCombination as any)[`symbol${i}`]?.id;
                    const sym = symbols.find((s) => s.id === symId);
                    return (
                      <div
                        key={i}
                        className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center text-[10px] font-bold text-slate-300 relative group transition-all"
                        title={sym?.label || `Slot ${i}`}
                      >
                        {sym ? (
                          <PrizeIcon iconName={sym.icon} color={sym.color} className="h-6 w-6" />
                        ) : (
                          <span className="opacity-40">?</span>
                        )}
                        <span className="absolute bottom-0.5 text-[8px] opacity-35 font-mono">#{i}</span>
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
                      <SelectTrigger className="text-xs">
                        <SelectValue placeholder={`Symbol ${i}`} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Empty</SelectItem>
                        {symbols.map((s) => (
                          <SelectItem key={s.id} value={s.id!}>
                            <div className="flex items-center gap-2">
                              <PrizeIcon iconName={s.icon} color={s.color} className="h-3.5 w-3.5" />
                              <span className="text-[11px] font-medium">{s.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Reward Type</Label>
                <Select
                  value={editingCombination.type}
                  onValueChange={(v) =>
                    setEditingCombination({
                      ...editingCombination,
                      type: v as PrizeType,
                      value: v === "NO_REWARDS" ? 0 : editingCombination.value,
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
                  disabled={editingCombination.type === "NO_REWARDS"}
                  value={editingCombination.type === "NO_REWARDS" ? 0 : (editingCombination.value ?? 0)}
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
              <Label>Winning Probability (%)</Label>
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
                  className="pr-8"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-muted-foreground sm:text-sm">%</span>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Enter percentage (e.g. 5 for 5% chance)
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
