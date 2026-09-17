"use client";

import React from "react";
import { ShieldCheck, Zap, CheckCircle2, Cpu, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface AIHealthTelemetryProps {
  loading: boolean;
  totalInvocations: number;
}

export function AIHealthTelemetry({ loading, totalInvocations }: AIHealthTelemetryProps) {
  const cards = [
    {
      title: "Total Invocations",
      value: totalInvocations.toLocaleString(),
      change: "+18.4%",
      badge: "Operational",
      badgeColor: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200",
      description: "Autonomous reasoning and tool calls executed",
      icon: Cpu,
    },
    {
      title: "Task Completion Rate",
      value: "99.2%",
      change: "+0.4%",
      badge: "Optimal (>98%)",
      badgeColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200",
      description: "Requests executed without retry failure",
      icon: CheckCircle2,
    },
    {
      title: "Average Latency",
      value: "320ms",
      change: "-45ms",
      badge: "High Performance",
      badgeColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200",
      description: "Mean time-to-first-token & generation",
      icon: Zap,
    },
    {
      title: "Prompt Cache Efficiency",
      value: "87.5%",
      change: "+5.2%",
      badge: "Cost Optimized",
      badgeColor: "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200",
      description: "KV cache hits reducing latency & token cost",
      icon: Activity,
    },
  ];

  return (
    <div id="kpi-section-health" className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              1. Agent Health & Execution Telemetry
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Core runtime reliability, response latency, and inference efficiency
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {loading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <Card
                key={idx}
                className="border-border/60 bg-card shadow-2xs"
              >
                <CardContent className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3.5 w-24 rounded" />
                    <Skeleton className="h-4 w-16 rounded-[4px]" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <Skeleton className="h-7 w-20 rounded" />
                    <Skeleton className="h-3.5 w-12 rounded" />
                  </div>
                  <Skeleton className="h-3 w-full rounded" />
                </CardContent>
              </Card>
            ))
          : cards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <Card
                  key={idx}
                  className="border-border/60 bg-card shadow-2xs hover:border-border transition-all"
                >
                  <CardContent className="p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-muted-foreground">
                        {card.title}
                      </span>
                      <span
                        className={cn(
                          "text-[9.5px] font-bold px-1.5 py-0.5 rounded border",
                          card.badgeColor
                        )}
                      >
                        {card.badge}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-black text-foreground tracking-tight tabular-nums">
                        {card.value}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          {card.change}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-border/40">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                      <p className="text-[10px] text-muted-foreground leading-snug line-clamp-1">
                        {card.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </div>
    </div>
  );
}
