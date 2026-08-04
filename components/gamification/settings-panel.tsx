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
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Shield,
  Zap,
  TrendingDown,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function SettingsPanel() {
  const { settings, updateSettings } = useGamificationStore();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Master Toggle */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-0.5">
          Engine Control
        </h3>
        <Card
          className={cn(
            "rounded-xl border transition-all duration-300",
            settings.isEnabled
              ? "border-emerald-200 bg-emerald-50/20 shadow-sm"
              : "border-border bg-card opacity-90",
          )}
        >
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "h-11 w-11 rounded-xl flex items-center justify-center transition-all duration-300",
                    settings.isEnabled
                      ? "bg-emerald-500 shadow-sm"
                      : "bg-muted",
                  )}
                >
                  <Settings
                    className={cn(
                      "h-5 w-5 transition-all",
                      settings.isEnabled
                        ? "text-white rotate-45"
                        : "text-muted-foreground",
                    )}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">
                      Gamification Engine
                    </h3>
                    {settings.isEnabled && (
                      <Badge className="bg-emerald-500 text-white border-none text-[10px] font-semibold h-4 px-1.5">
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 max-w-sm">
                    {settings.isEnabled
                      ? "Points, badges, and rank tracking are active across all modules."
                      : "Gamification is paused. All tracking and rewards are suspended."}
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.isEnabled}
                onCheckedChange={(v) => updateSettings({ isEnabled: v })}
                className="shrink-0 data-[state=checked]:bg-emerald-500"
              />
            </div>
          </CardContent>
        </Card>
      </section>

      <div
        className={cn(
          "space-y-8 transition-all duration-500",
          !settings.isEnabled && "opacity-40 pointer-events-none",
        )}
      >
        {/* Point Caps */}
        <section className="space-y-3">
          <div className="px-0.5 space-y-0.5">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Shield className="h-4 w-4 text-indigo-500" />
              Point Caps
            </h2>
            <p className="text-xs text-muted-foreground">
              Limit points per user to prevent farming and maintain a fair
              economy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                label: "Daily Cap",
                key: "dailyPointsCap",
                desc: "Resets every 24h",
              },
              {
                label: "Weekly Cap",
                key: "weeklyPointsCap",
                desc: "Resets every Monday",
              },
              {
                label: "Monthly Cap",
                key: "monthlyPointsCap",
                desc: "Resets on the 1st",
              },
            ].map((cap) => (
              <Card
                key={cap.key}
                className="rounded-xl border border-border bg-card shadow-none"
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-foreground">
                      {cap.label}
                    </Label>
                    <Zap className="h-3.5 w-3.5 text-muted-foreground/50" />
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      min={0}
                      className="h-10 pr-10 font-semibold"
                      value={(settings as any)[cap.key]}
                      onChange={(e) =>
                        updateSettings({ [cap.key]: Number(e.target.value) })
                      }
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-muted-foreground uppercase">
                      pts
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {cap.desc} · 0 = unlimited
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Point Decay */}
        <section className="space-y-3">
          <Card
            className={cn(
              "rounded-xl border shadow-none transition-all duration-300",
              settings.pointDecayEnabled
                ? "border-orange-200 bg-orange-50/20"
                : "border-border bg-card",
            )}
          >
            <CardHeader className="p-5 pb-0">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-orange-100">
                      <TrendingDown className="h-3.5 w-3.5 text-orange-600" />
                    </div>
                    Point Decay
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Gradually reduce points for inactive members to control
                    inflation.
                  </CardDescription>
                </div>
                <Switch
                  checked={settings.pointDecayEnabled}
                  onCheckedChange={(v) =>
                    updateSettings({ pointDecayEnabled: v })
                  }
                  className="shrink-0 data-[state=checked]:bg-orange-500"
                />
              </div>
            </CardHeader>

            {settings.pointDecayEnabled && (
              <CardContent className="p-5 pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold text-foreground">
                        Reduction %
                      </Label>
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-medium"
                      >
                        Inactive only
                      </Badge>
                    </div>
                    <div className="relative">
                      <Input
                        type="number"
                        min={1}
                        max={50}
                        className="h-10 pr-8 font-semibold"
                        value={settings.pointDecayPercentage}
                        onChange={(e) =>
                          updateSettings({
                            pointDecayPercentage: Number(e.target.value),
                          })
                        }
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                        %
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      % deducted per cycle after the inactivity threshold is
                      reached.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-foreground">
                      Inactivity Threshold
                    </Label>
                    <div className="relative">
                      <Input
                        type="number"
                        min={7}
                        className="h-10 pr-12 font-semibold"
                        value={settings.pointDecayPeriodDays}
                        onChange={(e) =>
                          updateSettings({
                            pointDecayPeriodDays: Number(e.target.value),
                          })
                        }
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                        days
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Days since last activity before decay begins.
                    </p>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </section>

        {/* Config Summary */}
        <section>
          <div className="rounded-xl border border-border bg-muted/30 p-5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <p className="text-xs font-semibold text-foreground">
                Current Configuration
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: "Daily Cap",
                  value: settings.dailyPointsCap || "∞",
                  unit: "pts",
                },
                {
                  label: "Weekly Cap",
                  value: settings.weeklyPointsCap || "∞",
                  unit: "pts",
                },
                {
                  label: "Monthly Cap",
                  value: settings.monthlyPointsCap || "∞",
                  unit: "pts",
                },
                {
                  label: "Decay",
                  value: settings.pointDecayEnabled
                    ? `${settings.pointDecayPercentage}%`
                    : "Off",
                  unit: settings.pointDecayEnabled
                    ? `per ${settings.pointDecayPeriodDays}d`
                    : "",
                },
              ].map((item) => (
                <div key={item.label} className="space-y-0.5">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    {item.label}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-lg font-bold text-foreground tracking-tight">
                      {item.value}
                    </p>
                    {item.unit && (
                      <span className="text-[11px] text-muted-foreground">
                        {item.unit}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
