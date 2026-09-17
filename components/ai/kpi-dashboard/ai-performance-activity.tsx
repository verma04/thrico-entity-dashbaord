"use client";

import React from "react";
import { TrendingUp, Users, ShieldAlert, FileText, UserCheck, Search, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface AIPerformanceActivityProps {
  loading: boolean;
}

export function AIPerformanceActivity({ loading }: AIPerformanceActivityProps) {
  const categories = [
    {
      label: "Community & Discussion Copilot",
      percentage: 38,
      invocations: "5,631",
      icon: Users,
      color: "bg-blue-500",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Content Moderation Sentinel",
      percentage: 27,
      invocations: "4,001",
      icon: ShieldAlert,
      color: "bg-emerald-500",
      textColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Surveys & Feedback Synthesis",
      percentage: 16,
      invocations: "2,371",
      icon: FileText,
      color: "bg-purple-500",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      label: "Member Retention & Onboarding",
      percentage: 12,
      invocations: "1,778",
      icon: UserCheck,
      color: "bg-amber-500",
      textColor: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Deep Research & Digest Generation",
      percentage: 7,
      invocations: "1,039",
      icon: Search,
      color: "bg-rose-500",
      textColor: "text-rose-600 dark:text-rose-400",
    },
  ];

  return (
    <div id="kpi-section-performance" className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <TrendingUp className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              3. Intelligence Activity & Workload Distribution
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Invocations across agent specialties, autonomous decisioning, and accuracy
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Category Distribution Breakdown */}
        <Card className="lg:col-span-2 border-border/60 bg-card shadow-2xs">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Workload Volume by Specialty
              </span>
              <span className="text-[10px] text-muted-foreground font-medium">
                Last 30 days
              </span>
            </div>

            <div className="space-y-3">
              {categories.map((cat, idx) => {
                const Icon = cat.icon;
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-3.5 w-3.5 ${cat.textColor}`} />
                        <span className="font-semibold text-foreground">{cat.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground tabular-nums text-[11px]">{cat.invocations} runs</span>
                        <span className="font-bold text-foreground tabular-nums w-8 text-right">{cat.percentage}%</span>
                      </div>
                    </div>
                    <Progress value={cat.percentage} className="h-1.5 bg-muted" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Inference Quality Card */}
        <Card className="border-border/60 bg-card shadow-2xs">
          <CardContent className="p-5 space-y-4">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Inference Quality & Accuracy
            </span>

            <div className="space-y-3 pt-1">
              <div className="p-3 rounded-lg bg-muted/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-muted-foreground font-medium">Generation Speed</span>
                  <p className="text-lg font-black text-foreground tabular-nums">74.2 <span className="text-xs font-normal text-muted-foreground">tok/sec</span></p>
                </div>
                <Sparkles className="h-4 w-4 text-indigo-500" />
              </div>

              <div className="p-3 rounded-lg bg-muted/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-muted-foreground font-medium">Tool Call Precision</span>
                  <p className="text-lg font-black text-foreground tabular-nums">99.8%</p>
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>

              <div className="p-3 rounded-lg bg-muted/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-muted-foreground font-medium">Auto-Resolution Rate</span>
                  <p className="text-lg font-black text-foreground tabular-nums">94.6%</p>
                </div>
                <div className="h-2 w-2 rounded-full bg-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
