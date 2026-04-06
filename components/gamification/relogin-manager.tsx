"use client";

import React, { useState } from "react";
import { useGamificationStore } from "@/store/useGamificationStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Trash2, Flame, Trophy, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

export function ReloginManager() {
  const {
    reloginConfig,
    updateReloginConfig,
    addStreakBonus,
    removeStreakBonus,
  } = useGamificationStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBonus, setNewBonus] = useState({
    days: 0,
    bonusPoints: 0,
    isMilestone: false,
  });

  const handleAddBonus = () => {
    if (newBonus.days > 0 && newBonus.bonusPoints > 0) {
      addStreakBonus(newBonus);
      setIsDialogOpen(false);
      setNewBonus({ days: 0, bonusPoints: 0, isMilestone: false });
    }
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Daily Login Rewards"
        badgeText="Gamification"
        description="Configure streak bonuses and daily login rewards to encourage regular community participation."
        icon={Flame}
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                reloginConfig.isEnabled ? "bg-emerald-500 animate-pulse" : "bg-slate-300",
              )}
            />
            <span className="text-xs font-medium text-muted-foreground">
              {reloginConfig.isEnabled ? "Daily rewards active" : "Daily rewards paused"}
            </span>
          </div>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg border border-border bg-card">
            <span className="text-xs font-medium text-muted-foreground">Enable rewards</span>
            <Switch
              checked={reloginConfig.isEnabled}
              onCheckedChange={(v) => updateReloginConfig({ isEnabled: v })}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 space-y-8">
        <div className={cn(
          "space-y-8 transition-all duration-500",
          !reloginConfig.isEnabled && "opacity-40 pointer-events-none",
        )}>

          {/* Configuration */}
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-4">Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Daily Points */}
              <div className="p-5 rounded-xl border border-border bg-card space-y-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">Daily Login Points</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Points awarded each day a member logs in</p>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    min={1}
                    className="pr-16 font-semibold text-lg"
                    value={reloginConfig.dailyLoginPoints}
                    onChange={(e) =>
                      updateReloginConfig({ dailyLoginPoints: Number(e.target.value) })
                    }
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    pts/day
                  </span>
                </div>
              </div>

              {/* Grace Period */}
              <div className="p-5 rounded-xl border border-border bg-card space-y-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">Grace Period</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Hours before daily streak resets</p>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    min={0}
                    max={24}
                    className="pr-16 font-semibold text-lg"
                    value={reloginConfig.gracePeriodHours}
                    onChange={(e) =>
                      updateReloginConfig({ gracePeriodHours: Number(e.target.value) })
                    }
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    hours
                  </span>
                </div>

                {/* Streak Recovery Toggle */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div>
                    <p className="text-xs font-semibold text-foreground">Streak Recovery</p>
                    <p className="text-[11px] text-muted-foreground">Allow members to recover missed days</p>
                  </div>
                  <Switch
                    checked={reloginConfig.streakRecoveryEnabled}
                    onCheckedChange={(v) =>
                      updateReloginConfig({ streakRecoveryEnabled: v })
                    }
                    className="data-[state=checked]:bg-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Streak Milestones */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Streak Milestones</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Bonus points awarded at specific streak lengths
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsDialogOpen(true)}
                className="gap-2"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Milestone
              </Button>
            </div>

            {reloginConfig.streakBonuses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-dashed border-border bg-muted/30">
                <Flame className="h-8 w-8 text-muted-foreground/30 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">No streak milestones yet</p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Add milestones to reward long streaks
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[...reloginConfig.streakBonuses]
                  .sort((a, b) => a.days - b.days)
                  .map((bonus) => (
                    <div
                      key={bonus.days}
                      className={cn(
                        "group p-4 rounded-xl border bg-card flex items-start justify-between gap-3 transition-all",
                        bonus.isMilestone
                          ? "border-amber-200 bg-amber-50/30"
                          : "border-border",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
                            bonus.isMilestone ? "bg-amber-100" : "bg-muted",
                          )}
                        >
                          <Flame
                            className={cn(
                              "h-4 w-4",
                              bonus.isMilestone ? "text-amber-600" : "text-muted-foreground",
                            )}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-foreground">
                              Day {bonus.days}
                            </p>
                            {bonus.isMilestone && (
                              <Badge className="bg-amber-100 text-amber-700 border-none text-[10px] px-1.5 py-0.5 font-semibold">
                                Milestone
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            +{bonus.bonusPoints} bonus pts
                          </p>
                        </div>
                      </div>
                      <button
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-rose-50 text-muted-foreground hover:text-rose-500"
                        onClick={() => removeStreakBonus(bonus.days)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </EcosystemContainer>

      {/* Add Milestone Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Streak Milestone</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Day Number
                </Label>
                <Input
                  type="number"
                  min={1}
                  placeholder="7"
                  className="font-semibold"
                  value={newBonus.days || ""}
                  onChange={(e) =>
                    setNewBonus({ ...newBonus, days: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Bonus Points
                </Label>
                <Input
                  type="number"
                  min={1}
                  placeholder="50"
                  className="font-semibold"
                  value={newBonus.bonusPoints || ""}
                  onChange={(e) =>
                    setNewBonus({ ...newBonus, bonusPoints: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
              <div>
                <p className="text-sm font-semibold text-foreground">Major Milestone</p>
                <p className="text-xs text-muted-foreground">Highlighted with special badge styling</p>
              </div>
              <Switch
                checked={newBonus.isMilestone}
                onCheckedChange={(v) =>
                  setNewBonus({ ...newBonus, isMilestone: v })
                }
                className="data-[state=checked]:bg-amber-500"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddBonus}
              disabled={!newBonus.days || !newBonus.bonusPoints}
            >
              Add Milestone
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </EcosystemWrapper>
  );
}
