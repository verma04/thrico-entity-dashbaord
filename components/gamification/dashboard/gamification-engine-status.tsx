"use client";

import React from "react";
import Link from "next/link";
import { Settings, Zap, Sliders, ChevronRight, Activity, Repeat } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GamificationEngineStatusProps {
  settings: any;
  reloginConfig: any;
}

export function GamificationEngineStatus({
  settings,
  reloginConfig,
}: GamificationEngineStatusProps) {
  const statusItems = [
    {
      label: "Master Status",
      value: settings.isEnabled ? "Active & Running" : "Paused",
      icon: Activity,
      color: settings.isEnabled
        ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40 border-emerald-500/20"
        : "text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40 border-amber-500/20",
    },
    {
      label: "Daily Member Cap",
      value: settings.dailyPointsCap ? `${settings.dailyPointsCap} pts / day` : "Unlimited",
      icon: Zap,
      color: "text-indigo-700 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/40 border-indigo-500/20",
    },
    {
      label: "Login Streaks",
      value: reloginConfig.isEnabled ? "Enabled (+25 pts)" : "Disabled",
      icon: Repeat,
      color: reloginConfig.isEnabled
        ? "text-purple-700 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/40 border-purple-500/20"
        : "text-muted-foreground bg-muted border-border",
    },
    {
      label: "Point Decay",
      value: settings.pointDecayEnabled ? "Quarterly" : "Never Expire",
      icon: Sliders,
      color: settings.pointDecayEnabled
        ? "text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40 border-amber-500/20"
        : "text-muted-foreground bg-muted border-border",
    },
  ];

  return (
    <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-xs relative flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/40 px-3 sm:px-5 pt-3 sm:pt-4">
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold text-foreground flex items-center gap-1">
            <Sliders className="h-3 w-3 text-primary" />
            Parameters &amp; Guardrails
          </span>
          <p className="text-[10px] text-muted-foreground">
            System thresholds, daily caps, decay schedules &amp; login incentives
          </p>
        </div>

        <Link href="/gamification/points-and-badges/settings">
          <Button
            variant="ghost"
            size="sm"
            className="text-[11px] text-primary font-bold h-6 px-2 rounded hover:bg-muted"
          >
            <Settings className="h-2.5 w-2.5 mr-0.5" />
            Configure <ChevronRight className="h-2.5 w-2.5 ml-0.5" />
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {statusItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="p-2.5 rounded-lg border border-border/60 bg-card hover:bg-muted/30 transition-colors flex flex-col justify-between gap-2"
            >
              <div className="flex items-center gap-1.5">
                <div className="h-5 w-5 rounded bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                  <Icon className="h-3 w-3" />
                </div>
                <span className="text-[11px] font-bold text-foreground truncate">
                  {item.label}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider border",
                    item.color
                  )}
                >
                  {item.value}
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
