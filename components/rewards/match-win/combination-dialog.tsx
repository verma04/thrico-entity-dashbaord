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
import { Sparkles, Loader2 } from "lucide-react";
import { PolarisPresetChips } from "@/components/gamification/shared/polaris-form-ui";

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

const COMBO_VALUE_PRESETS = [25, 50, 100, 250, 500];

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl border-zinc-200 dark:border-zinc-800">
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

        {editingCombination ? (
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Rule Key (e.g. 3_cherry)
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

            {editingCombination.type !== "NO_REWARDS" && (
              <div className="space-y-3 p-3.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700">
                <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block">
                  Reel Pattern Selection
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
                          <span className="opacity-40">?</span>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Reward Type
                </Label>
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
                  <SelectTrigger className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs shadow-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COINS" className="text-xs">
                      {currencyName} (Points)
                    </SelectItem>
                    <SelectItem value="VOUCHER" className="text-xs">
                      Voucher
                    </SelectItem>
                    <SelectItem value="NO_REWARDS" className="text-xs">
                      No Rewards (Loss)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Reward Value
                </Label>
                <Input
                  type="number"
                  disabled={editingCombination.type === "NO_REWARDS"}
                  value={
                    editingCombination.type === "NO_REWARDS"
                      ? 0
                      : (editingCombination.value ?? 0)
                  }
                  onChange={(e) =>
                    setEditingCombination({
                      ...editingCombination,
                      value: Number(e.target.value),
                    })
                  }
                  className="h-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs shadow-none font-bold"
                />
              </div>
            </div>

            {editingCombination.type === "COINS" && (
              <div className="space-y-1.5">
                <PolarisPresetChips
                  presets={COMBO_VALUE_PRESETS}
                  currentValue={Number(editingCombination.value || 0)}
                  onSelect={(v) =>
                    setEditingCombination({
                      ...editingCombination,
                      value: v,
                    })
                  }
                  prefix="+"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Winning Probability (%)
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

            {(editingCombination.type === "VOUCHER" ||
              editingCombination.type === "PREMIUM") && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Link to Reward Coupon
                </Label>
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
                    <SelectValue placeholder="Select Reward..." />
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
          </div>
        ) : (
          <div className="py-8 text-center text-zinc-400 text-xs">
            Loading combination...
          </div>
        )}

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
            disabled={saving}
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
