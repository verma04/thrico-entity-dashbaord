"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAnalytics360Funnel,
  ConversionFunnelResponse,
} from "@/graphql/analytics/analytics360";
import {
  Filter,
  ArrowDown,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  Users,
  Target,
  RefreshCw,
  ShoppingBag,
  UserCheck,
  CalendarCheck,
} from "lucide-react";

interface Customer360FunnelsTabProps {
  initialFunnel?: ConversionFunnelResponse;
}

export function Customer360FunnelsTab({
  initialFunnel,
}: Customer360FunnelsTabProps) {
  const [funnelType, setFunnelType] = useState<
    "ONBOARDING" | "COMMERCE" | "EVENT_REGISTRATION"
  >("ONBOARDING");

  const { data, loading, error, refetch } = useAnalytics360Funnel({
    funnelType,
  });

  const funnel = data?.getAnalytics360Funnel || initialFunnel;
  const steps = funnel?.steps || [];

  const funnelOptions = [
    {
      type: "ONBOARDING" as const,
      label: "Member Onboarding",
      icon: UserCheck,
      description: "Sign-up to profile activation",
    },
    {
      type: "COMMERCE" as const,
      label: "Commerce & Checkout",
      icon: ShoppingBag,
      description: "Product view to completed purchase",
    },
    {
      type: "EVENT_REGISTRATION" as const,
      label: "Event Attendance",
      icon: CalendarCheck,
      description: "Invitation to check-in confirmation",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Funnel Type Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {funnelOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = funnelType === opt.type;
          return (
            <div
              key={opt.type}
              onClick={() => setFunnelType(opt.type)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? "bg-primary/5 border-primary shadow-sm"
                  : "bg-card border-border/80 hover:border-border hover:bg-muted/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">
                    {opt.label}
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    {opt.description}
                  </p>
                </div>
              </div>
              {isSelected && (
                <div className="w-2 h-2 rounded-full bg-primary" />
              )}
            </div>
          );
        })}
      </div>

      {/* Main Funnel Visualization Card */}
      <Card className="border-border/80 bg-card">
        <CardHeader className="pb-4 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm font-semibold capitalize">
                  {funnelType.replace(/_/g, " ").toLowerCase()} Conversion Funnel
                </CardTitle>
              </div>
              <CardDescription className="text-xs">
                Stage-by-stage drop-off analytics and completion metrics
              </CardDescription>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-muted/40 px-3 py-1.5 rounded-lg border border-border/40 font-mono text-xs">
                <div>
                  <span className="text-muted-foreground text-[10px] block">
                    Started
                  </span>
                  <span className="font-bold text-foreground">
                    {(funnel?.totalStarted ?? 0).toLocaleString()}
                  </span>
                </div>
                <div className="h-5 w-px bg-border" />
                <div>
                  <span className="text-muted-foreground text-[10px] block">
                    Completed
                  </span>
                  <span className="font-bold text-foreground">
                    {(funnel?.totalCompleted ?? 0).toLocaleString()}
                  </span>
                </div>
                <div className="h-5 w-px bg-border" />
                <div>
                  <span className="text-muted-foreground text-[10px] block">
                    Conversion Rate
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {funnel?.overallConversionRate ?? 0}%
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => refetch()}
                disabled={loading}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {loading && !funnel ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          ) : error && steps.length === 0 ? (
            <div className="py-12 text-center text-sm text-destructive">
              Failed to load conversion funnel: {error.message}
            </div>
          ) : steps.length === 0 ? (
            <div className="py-16 text-center text-xs text-muted-foreground">
              No conversion steps recorded for {funnelType.toLowerCase()}.
            </div>
          ) : (
            <div className="space-y-3 max-w-4xl mx-auto">
              {steps.map((step, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === steps.length - 1;
                const widthPercent = Math.max(
                  20,
                  Math.min(
                    100,
                    funnel?.totalStarted
                      ? (step.count / funnel.totalStarted) * 100
                      : 100 - idx * 15
                  )
                );

                return (
                  <React.Fragment key={step.stepIndex ?? idx}>
                    {/* Intermediate Drop-off Indicator */}
                    {!isFirst && (
                      <div className="flex items-center justify-center gap-2 py-1 text-[11px] font-mono text-muted-foreground">
                        <ArrowDown className="w-3.5 h-3.5 text-muted-foreground/50" />
                        <span className="text-rose-500/90 font-medium">
                          -{step.dropOffRate}% Drop-off
                        </span>
                        <span className="text-muted-foreground/40">·</span>
                        <span className="text-muted-foreground/70">
                          {step.conversionRate}% Step Conversion
                        </span>
                      </div>
                    )}

                    {/* Step Card */}
                    <div className="border border-border/80 bg-muted/20 hover:bg-muted/40 transition-all rounded-xl p-4 space-y-2.5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary font-mono font-bold text-xs flex items-center justify-center">
                            {idx + 1}
                          </div>
                          <div>
                            <h5 className="font-semibold text-xs text-foreground">
                              {step.name}
                            </h5>
                            <span className="font-mono text-[10px] text-muted-foreground uppercase">
                              Event: {step.eventType}
                            </span>
                          </div>
                        </div>

                        <div className="text-right font-mono">
                          <span className="font-bold text-sm text-foreground">
                            {step.count.toLocaleString()}
                          </span>
                          <span className="block text-[10px] text-muted-foreground">
                            users ({step.conversionRate}% rate)
                          </span>
                        </div>
                      </div>

                      {/* Visual Funnel Bar */}
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${widthPercent}%` }}
                        />
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
