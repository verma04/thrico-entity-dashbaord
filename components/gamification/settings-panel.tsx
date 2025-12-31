"use client";

import React from "react";
import { useGamificationStore } from "@/store/useGamificationStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, Shield, Zap, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function SettingsPanel() {
  const { settings, updateSettings } = useGamificationStore();

  return (
    <div className="space-y-6">
      {/* Master Switch */}
      <Card className={cn(!settings.isEnabled && "border-yellow-500")}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "p-3 rounded-lg",
                  settings.isEnabled ? "bg-green-100" : "bg-yellow-100"
                )}
              >
                <Settings
                  className={cn(
                    "h-6 w-6",
                    settings.isEnabled ? "text-green-600" : "text-yellow-600"
                  )}
                />
              </div>
              <div>
                <h3 className="font-semibold">Gamification System</h3>
                <p className="text-sm text-muted-foreground">
                  {settings.isEnabled
                    ? "System is active and tracking user engagement"
                    : "System is disabled - no points or badges will be awarded"}
                </p>
              </div>
            </div>
            <Switch
              checked={settings.isEnabled}
              onCheckedChange={(v) => updateSettings({ isEnabled: v })}
            />
          </div>
        </CardContent>
      </Card>

      <div
        className={cn(!settings.isEnabled && "opacity-50 pointer-events-none")}
      >
        {/* Global Caps */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" /> Global Point Caps
            </CardTitle>
            <CardDescription>
              Set maximum points users can earn to prevent abuse
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Zap className="h-4 w-4" /> Daily Cap
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={settings.dailyPointsCap}
                  onChange={(e) =>
                    updateSettings({ dailyPointsCap: Number(e.target.value) })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Max points per day (0 = unlimited)
                </p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Zap className="h-4 w-4" /> Weekly Cap
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={settings.weeklyPointsCap}
                  onChange={(e) =>
                    updateSettings({ weeklyPointsCap: Number(e.target.value) })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Max points per week (0 = unlimited)
                </p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Zap className="h-4 w-4" /> Monthly Cap
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={settings.monthlyPointsCap}
                  onChange={(e) =>
                    updateSettings({ monthlyPointsCap: Number(e.target.value) })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Max points per month (0 = unlimited)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Point Decay */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingDown className="h-5 w-5" /> Point Decay
            </CardTitle>
            <CardDescription>
              Optionally reduce inactive users&apos; points over time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Point Decay</Label>
                <p className="text-sm text-muted-foreground">
                  Reduce points for users who haven&apos;t been active
                </p>
              </div>
              <Switch
                checked={settings.pointDecayEnabled}
                onCheckedChange={(v) =>
                  updateSettings({ pointDecayEnabled: v })
                }
              />
            </div>

            {settings.pointDecayEnabled && (
              <>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Decay Percentage</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={1}
                        max={50}
                        value={settings.pointDecayPercentage}
                        onChange={(e) =>
                          updateSettings({
                            pointDecayPercentage: Number(e.target.value),
                          })
                        }
                      />
                      <span className="text-muted-foreground">%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Percentage of points lost each period
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Decay Period (Days)</Label>
                    <Input
                      type="number"
                      min={7}
                      value={settings.pointDecayPeriodDays}
                      onChange={(e) =>
                        updateSettings({
                          pointDecayPeriodDays: Number(e.target.value),
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Days of inactivity before decay starts
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Configuration Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="p-3 bg-background rounded-lg">
                <p className="text-muted-foreground">Daily Limit</p>
                <p className="font-semibold text-lg">
                  {settings.dailyPointsCap || "∞"}
                </p>
              </div>
              <div className="p-3 bg-background rounded-lg">
                <p className="text-muted-foreground">Weekly Limit</p>
                <p className="font-semibold text-lg">
                  {settings.weeklyPointsCap || "∞"}
                </p>
              </div>
              <div className="p-3 bg-background rounded-lg">
                <p className="text-muted-foreground">Monthly Limit</p>
                <p className="font-semibold text-lg">
                  {settings.monthlyPointsCap || "∞"}
                </p>
              </div>
              <div className="p-3 bg-background rounded-lg">
                <p className="text-muted-foreground">Decay</p>
                <p className="font-semibold text-lg">
                  {settings.pointDecayEnabled
                    ? `${settings.pointDecayPercentage}% / ${settings.pointDecayPeriodDays}d`
                    : "Off"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
