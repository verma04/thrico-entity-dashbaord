"use client";

import React, { useState } from "react";
import { useGamificationStore } from "@/store/useGamificationStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Settings,
  Shield,
  Zap,
  TrendingDown,
  CheckCircle2,
  Sparkles,
  Flame,
  Clock,
  Layers,
  Bell,
  Mail,
  Award,
  Crown,
  Coins,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
} from "@/components/gamification/shared/polaris-form-ui";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";

export function SettingsPanel() {
  const { settings, updateSettings } = useGamificationStore();
  const [localSettings, setLocalSettings] = useState({ ...settings });
  const [hasChanged, setHasChanged] = useState(false);

  const handleUpdate = (partial: any) => {
    const updated = { ...localSettings, ...partial };
    setLocalSettings(updated);
    setHasChanged(true);
  };

  const handleSave = () => {
    updateSettings(localSettings);
    setHasChanged(false);
    toast.success("Gamification engine configuration saved successfully");
  };

  const handleReset = () => {
    setLocalSettings({ ...settings });
    setHasChanged(false);
  };

  return (
    <div className="space-y-6 max-w-[1040px]">
      <PolarisFormLayout
        sidebar={
          <div className="space-y-6">
            {/* Live Configuration Matrix */}
            <PolarisSidebarCard
              title="Active Parameters"
              badge="Live Engine"
              icon={Sparkles}
            >
              <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    Engine Status
                  </span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold",
                      localSettings.isEnabled
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                        : "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
                    )}
                  >
                    {localSettings.isEnabled ? "Active" : "Paused"}
                  </span>
                </div>
              </div>

              {/* Structured Configuration Breakdown */}
              <div className="space-y-1.5 pt-2">
                <PolarisSummaryRow
                  label="Daily Point Cap"
                  value={
                    localSettings.dailyPointsCap
                      ? `${localSettings.dailyPointsCap.toLocaleString()} pts`
                      : "Unlimited (∞)"
                  }
                />
                <PolarisSummaryRow
                  label="Weekly Point Cap"
                  value={
                    localSettings.weeklyPointsCap
                      ? `${localSettings.weeklyPointsCap.toLocaleString()} pts`
                      : "Unlimited (∞)"
                  }
                />
                <PolarisSummaryRow
                  label="Monthly Point Cap"
                  value={
                    localSettings.monthlyPointsCap
                      ? `${localSettings.monthlyPointsCap.toLocaleString()} pts`
                      : "Unlimited (∞)"
                  }
                />
                <PolarisSummaryRow
                  label="Point Decay"
                  value={
                    localSettings.pointDecayEnabled
                      ? `${localSettings.pointDecayPercentage}% / ${localSettings.pointDecayPeriodDays}d`
                      : "Disabled"
                  }
                />
                <PolarisSummaryRow
                  label="Global Push Alerts"
                  value={
                    <span
                      className={cn(
                        "text-[11px] font-semibold",
                        localSettings.enableGlobalPushNotifications !== false
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-zinc-400 dark:text-zinc-500",
                      )}
                    >
                      {localSettings.enableGlobalPushNotifications !== false
                        ? "Enabled"
                        : "Disabled"}
                    </span>
                  }
                />
                <PolarisSummaryRow
                  label="Global Email Alerts"
                  value={
                    <span
                      className={cn(
                        "text-[11px] font-semibold",
                        localSettings.enableGlobalEmailNotifications !== false
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-zinc-400 dark:text-zinc-500",
                      )}
                    >
                      {localSettings.enableGlobalEmailNotifications !== false
                        ? "Enabled"
                        : "Disabled"}
                    </span>
                  }
                  isLast
                />
              </div>
            </PolarisSidebarCard>

            {/* Economy Health Tip */}
            <PolarisTipCard title="Economy Balance Tip">
              Enforcing daily and weekly point caps mitigates bot farming while ensuring community members remain evenly rewarded over sustained intervals.
            </PolarisTipCard>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Step 1: Engine Master Control */}
          <PolarisFormCard
            step={1}
            title="Gamification Engine Master Control"
            description="Toggle the global point calculation, badge criteria tracking, and leaderboard rankings across all ecosystem modules."
            badge="Master Control"
          >
            <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center shrink-0 shadow-xs">
                  <Settings className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      Gamification Event Processing
                    </span>
                    {localSettings.isEnabled && (
                      <span className="px-2 py-0.5 rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-[9px] font-bold">
                        Online
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 max-w-md leading-relaxed">
                    {localSettings.isEnabled
                      ? "Points, badges, impact scores, and real-time triggers are actively dispatched."
                      : "Gamification engine is paused. All reward calculations and point earnings are suspended."}
                  </p>
                </div>
              </div>
              <Switch
                checked={localSettings.isEnabled}
                onCheckedChange={(v) => handleUpdate({ isEnabled: v })}
              />
            </div>
          </PolarisFormCard>

          {/* Step 2: Rate Limiting & Point Caps */}
          <div
            className={cn(
              "space-y-6 transition-opacity duration-300",
              !localSettings.isEnabled && "opacity-40 pointer-events-none",
            )}
          >
            <PolarisFormCard
              step={2}
              title="Economy Rate Limits & Point Caps"
              description="Establish individual earning ceilings to balance reward liquidity and deter automated action farming."
              badge="Anti-Abuse"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Daily Cap */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dailyCap" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-zinc-400" />
                      Daily Point Cap
                    </Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="dailyCap"
                      type="number"
                      min={0}
                      className="h-10 pr-11 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                      value={localSettings.dailyPointsCap}
                      onChange={(e) =>
                        handleUpdate({ dailyPointsCap: Number(e.target.value) })
                      }
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-400 uppercase">
                      pts
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400">
                    Resets every 24h · 0 for unlimited
                  </p>
                </div>

                {/* Weekly Cap */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="weeklyCap" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                      <Zap className="h-3 w-3 text-zinc-400" />
                      Weekly Point Cap
                    </Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="weeklyCap"
                      type="number"
                      min={0}
                      className="h-10 pr-11 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                      value={localSettings.weeklyPointsCap}
                      onChange={(e) =>
                        handleUpdate({ weeklyPointsCap: Number(e.target.value) })
                      }
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-400 uppercase">
                      pts
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400">
                    Resets weekly on Monday
                  </p>
                </div>

                {/* Monthly Cap */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="monthlyCap" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                      <Layers className="h-3 w-3 text-zinc-400" />
                      Monthly Point Cap
                    </Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="monthlyCap"
                      type="number"
                      min={0}
                      className="h-10 pr-11 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                      value={localSettings.monthlyPointsCap}
                      onChange={(e) =>
                        handleUpdate({ monthlyPointsCap: Number(e.target.value) })
                      }
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-400 uppercase">
                      pts
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400">
                    Resets 1st of each calendar month
                  </p>
                </div>
              </div>
            </PolarisFormCard>

            {/* Step 3: Inactivity Point Decay */}
            <PolarisFormCard
              step={3}
              title="Dormancy Policy & Point Decay"
              description="Automatically decrement points for inactive accounts to manage point balance inflation and sustain engagement."
              badge="Inflation Control"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                      <TrendingDown className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-400" />
                      Enable Automated Point Decay
                    </Label>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                      Progressively deduct a percentage of points from accounts exceeding the inactivity threshold.
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.pointDecayEnabled}
                    onCheckedChange={(v) =>
                      handleUpdate({ pointDecayEnabled: v })
                    }
                  />
                </div>

                {localSettings.pointDecayEnabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="space-y-1.5">
                      <Label htmlFor="decayPct" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Decay Percentage (%)
                      </Label>
                      <div className="relative">
                        <Input
                          id="decayPct"
                          type="number"
                          min={1}
                          max={50}
                          className="h-10 pr-8 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                          value={localSettings.pointDecayPercentage}
                          onChange={(e) =>
                            handleUpdate({
                              pointDecayPercentage: Number(e.target.value),
                            })
                          }
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">
                          %
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400">
                        Percentage deducted per decay cycle.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="decayDays" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Inactivity Threshold (Days)
                      </Label>
                      <div className="relative">
                        <Input
                          id="decayDays"
                          type="number"
                          min={7}
                          className="h-10 pr-12 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                          value={localSettings.pointDecayPeriodDays}
                          onChange={(e) =>
                            handleUpdate({
                              pointDecayPeriodDays: Number(e.target.value),
                            })
                          }
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-400 uppercase">
                          days
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400">
                        Consecutive inactive days before decay initiates.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </PolarisFormCard>

            {/* Step 4: Notification Channels & Alert Settings */}
            <PolarisFormCard
              step={4}
              title="Notification Channels & Alert Settings"
              description="Configure system-level defaults for dispatching Push and Email alerts across Points, Badges, and Ranks."
              badge="Alert Engine"
            >
              <div className="space-y-5">
                {/* Global Master Channel Switches */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <div className="space-y-0.5">
                      <Label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                        <Bell className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-400" />
                        Global Push Notifications
                      </Label>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                        Master switch to allow or suppress push notifications.
                      </p>
                    </div>
                    <Switch
                      checked={
                        localSettings.enableGlobalPushNotifications !== false
                      }
                      onCheckedChange={(v) =>
                        handleUpdate({ enableGlobalPushNotifications: v })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <div className="space-y-0.5">
                      <Label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-400" />
                        Global Email Notifications
                      </Label>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                        Master switch to allow or suppress automated email alerts.
                      </p>
                    </div>
                    <Switch
                      checked={
                        localSettings.enableGlobalEmailNotifications !== false
                      }
                      onCheckedChange={(v) =>
                        handleUpdate({ enableGlobalEmailNotifications: v })
                      }
                    />
                  </div>
                </div>

                {/* Sub-modules: Points, Badges, Ranks */}
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Module Alert Channels
                  </Label>

                  {/* Points Alerts */}
                  <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
                        <Coins className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                          Point Reward Alerts
                        </h4>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          Dispatch alerts when members earn points from triggers.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                          Push
                        </span>
                        <Switch
                          checked={
                            localSettings.pointsPushNotificationEnabled !== false
                          }
                          onCheckedChange={(v) =>
                            handleUpdate({ pointsPushNotificationEnabled: v })
                          }
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                          Email
                        </span>
                        <Switch
                          checked={
                            localSettings.pointsEmailNotificationEnabled !== false
                          }
                          onCheckedChange={(v) =>
                            handleUpdate({ pointsEmailNotificationEnabled: v })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Badges Alerts */}
                  <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
                        <Award className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                          Badge Unlock Alerts
                        </h4>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          Dispatch celebrations when members achieve new badges.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                          Push
                        </span>
                        <Switch
                          checked={
                            localSettings.badgesPushNotificationEnabled !== false
                          }
                          onCheckedChange={(v) =>
                            handleUpdate({ badgesPushNotificationEnabled: v })
                          }
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                          Email
                        </span>
                        <Switch
                          checked={
                            localSettings.badgesEmailNotificationEnabled !== false
                          }
                          onCheckedChange={(v) =>
                            handleUpdate({ badgesEmailNotificationEnabled: v })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Ranks Alerts */}
                  <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                        <Crown className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                          Rank Tier Promotion Alerts
                        </h4>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          Dispatch congratulations when members are promoted to higher tiers.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                          Push
                        </span>
                        <Switch
                          checked={
                            localSettings.ranksPushNotificationEnabled !== false
                          }
                          onCheckedChange={(v) =>
                            handleUpdate({ ranksPushNotificationEnabled: v })
                          }
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                          Email
                        </span>
                        <Switch
                          checked={
                            localSettings.ranksEmailNotificationEnabled !== false
                          }
                          onCheckedChange={(v) =>
                            handleUpdate({ ranksEmailNotificationEnabled: v })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </PolarisFormCard>
          </div>

          {/* Floating Action Bar */}
          <FloatingSavePanel
            hasChanged={hasChanged}
            saved={false}
            isSaving={false}
            onSave={handleSave}
            onReset={handleReset}
            title="Save Engine Settings"
            description="You have unsaved changes to the gamification rules and notification settings."
            buttonText="Save Settings"
          />
        </div>
      </PolarisFormLayout>
    </div>
  );
}
