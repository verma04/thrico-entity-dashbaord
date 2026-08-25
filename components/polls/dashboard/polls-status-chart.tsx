"use client";

import React from "react";
import { Sparkles, CheckCircle2, Clock, FileEdit } from "lucide-react";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { Card, CardContent } from "@/components/ui/card";

interface RegistryStats {
  closedPolls?: number;
  activePolls?: number;
  drafts?: number;
  responseRate?: number;
}

interface PollsStatusChartProps {
  loading?: boolean;
  registry: RegistryStats;
}

export function PollsStatusChart({ loading = false, registry }: PollsStatusChartProps) {
  if (loading) {
    return (
      <section className="space-y-3 flex flex-col h-full">
        <DashboardSectionHeading
          title="Poll Lifecycle & Registry"
          icon={<Sparkles className="h-3.5 w-3.5 text-muted-foreground" />}
        />
        <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-sm relative flex-1 flex flex-col rounded-xl">
          <CardContent className="p-5 flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Loading Poll Registry...
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }
  const items = [
    {
      label: "Active Polls",
      value: registry.activePolls ?? 0,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      barColor: "bg-emerald-500",
    },
    {
      label: "Closed / Completed",
      value: registry.closedPolls ?? 0,
      icon: Clock,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      barColor: "bg-indigo-500",
    },
    {
      label: "Draft Polls",
      value: registry.drafts ?? 0,
      icon: FileEdit,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      barColor: "bg-amber-500",
    },
  ];

  const total = (registry.activePolls ?? 0) + (registry.closedPolls ?? 0) + (registry.drafts ?? 0);

  return (
    <section className="space-y-3 flex flex-col h-full">
      <DashboardSectionHeading
        title="Poll Lifecycle & Registry"
        icon={<Sparkles className="h-3.5 w-3.5 text-muted-foreground" />}
      />
      <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-sm relative flex-1 flex flex-col rounded-xl">
        <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/40">
            <div>
              <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
                {total}
              </span>
              <p className="text-[10px] text-muted-foreground uppercase font-medium mt-0.5">
                Total Registered Polls
              </p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-foreground tabular-nums">
                {registry.responseRate ?? 0}%
              </span>
              <p className="text-[10px] text-muted-foreground uppercase font-medium mt-0.5">
                Average Engagement
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {items.map((item, i) => {
              const Icon = item.icon;
              const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;

              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded-md ${item.bg}`}>
                        <Icon className={`h-3 w-3 ${item.color}`} />
                      </div>
                      <span className="font-medium text-foreground/80">
                        {item.label}
                      </span>
                    </div>
                    <span className="font-semibold text-foreground tabular-nums">
                      {item.value}{" "}
                      <span className="text-[10px] text-muted-foreground font-normal">
                        ({percentage}%)
                      </span>
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-muted/60 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${item.barColor}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
