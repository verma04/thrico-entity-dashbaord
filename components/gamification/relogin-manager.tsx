"use client";

import React, { useState } from "react";
import { useGamificationStore } from "@/store/useGamificationStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Trash2, Calendar, Flame, Gift, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="space-y-6">
      {/* Master Switch */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Login Rewards</h3>
                <p className="text-sm text-muted-foreground">
                  Enable daily login bonuses and streak rewards
                </p>
              </div>
            </div>
            <Switch
              checked={reloginConfig.isEnabled}
              onCheckedChange={(v) => updateReloginConfig({ isEnabled: v })}
            />
          </div>
        </CardContent>
      </Card>

      <div
        className={cn(
          !reloginConfig.isEnabled && "opacity-50 pointer-events-none"
        )}
      >
        {/* Daily Login Config */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Gift className="h-5 w-5" /> Daily Login
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Points per Login</Label>
                <Input
                  type="number"
                  min={1}
                  value={reloginConfig.dailyLoginPoints}
                  onChange={(e) =>
                    updateReloginConfig({
                      dailyLoginPoints: Number(e.target.value),
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Base points awarded for each daily login
                </p>
              </div>

              <div className="space-y-2">
                <Label>Grace Period (Hours)</Label>
                <Input
                  type="number"
                  min={0}
                  max={24}
                  value={reloginConfig.gracePeriodHours}
                  onChange={(e) =>
                    updateReloginConfig({
                      gracePeriodHours: Number(e.target.value),
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Buffer time before streak breaks (handles timezones)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Flame className="h-5 w-5" /> Streak Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Max Streak Days</Label>
                <Input
                  type="number"
                  min={7}
                  value={reloginConfig.maxStreak}
                  onChange={(e) =>
                    updateReloginConfig({ maxStreak: Number(e.target.value) })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Maximum streak counter limit
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Streak Recovery</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow users to recover broken streaks
                  </p>
                </div>
                <Switch
                  checked={reloginConfig.streakRecoveryEnabled}
                  onCheckedChange={(v) =>
                    updateReloginConfig({ streakRecoveryEnabled: v })
                  }
                />
              </div>

              {reloginConfig.streakRecoveryEnabled && (
                <div className="space-y-2">
                  <Label>Recovery Cost (Points)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={reloginConfig.streakRecoveryCost}
                    onChange={(e) =>
                      updateReloginConfig({
                        streakRecoveryCost: Number(e.target.value),
                      })
                    }
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Streak Bonuses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5" /> Streak Bonuses
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Add Bonus
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Streak Bonus</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Days</Label>
                    <Input
                      type="number"
                      min={1}
                      placeholder="e.g., 7"
                      value={newBonus.days || ""}
                      onChange={(e) =>
                        setNewBonus({
                          ...newBonus,
                          days: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bonus Points</Label>
                    <Input
                      type="number"
                      min={1}
                      placeholder="e.g., 50"
                      value={newBonus.bonusPoints || ""}
                      onChange={(e) =>
                        setNewBonus({
                          ...newBonus,
                          bonusPoints: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Mark as Milestone</Label>
                    <Switch
                      checked={newBonus.isMilestone}
                      onCheckedChange={(v) =>
                        setNewBonus({ ...newBonus, isMilestone: v })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddBonus}>Add Bonus</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Timeline */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

              <div className="space-y-4">
                {reloginConfig.streakBonuses.map((bonus, index) => (
                  <div
                    key={bonus.days}
                    className="relative flex items-center gap-4 pl-12"
                  >
                    <div
                      className={cn(
                        "absolute left-4 w-5 h-5 rounded-full border-2 bg-background",
                        bonus.isMilestone
                          ? "border-yellow-500 bg-yellow-100"
                          : "border-primary"
                      )}
                    >
                      {bonus.isMilestone && (
                        <span className="absolute -top-1 -right-1 text-xs">
                          🌟
                        </span>
                      )}
                    </div>

                    <div className="flex-1 p-4 border rounded-lg bg-card">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">
                              Day {bonus.days}
                            </span>
                            {bonus.isMilestone && (
                              <Badge variant="secondary">Milestone</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            +{bonus.bonusPoints} bonus points
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                          onClick={() => removeStreakBonus(bonus.days)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {reloginConfig.streakBonuses.length === 0 && (
                  <div className="text-center py-8 pl-12">
                    <Flame className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      No streak bonuses defined. Add milestones to reward
                      consistent users!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
