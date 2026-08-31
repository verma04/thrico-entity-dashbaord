"use client";

import React from "react";
import { useConversionFunnel } from "@/graphql/analytics/conversionFunnel";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Filter, ArrowDownRight, Users, CheckCircle } from "lucide-react";

interface ConversionFunnelCardProps {
  funnelType?: "EVENT_REGISTRATION" | "ONBOARDING" | "COMMERCE" | string;
  entityId?: string;
  className?: string;
}

export function ConversionFunnelCard({
  funnelType = "EVENT_REGISTRATION",
  entityId,
  className,
}: ConversionFunnelCardProps) {
  const { data, loading, error } = useConversionFunnel(funnelType, entityId);

  if (loading) {
    return (
      <Card className="p-6 space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="space-y-3 pt-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </Card>
    );
  }

  if (error || !data?.getConversionFunnel) {
    return (
      <Card className="p-6 border-dashed text-center text-muted-foreground text-sm">
        {error ? `Failed to load funnel data: ${error.message}` : "No conversion funnel data available."}
      </Card>
    );
  }

  const funnel = data.getConversionFunnel;
  const steps = funnel.steps || [];

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-bold capitalize">
                {(funnel.funnelType || "Conversion").replace(/_/g, " ").toLowerCase()} Funnel
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              {funnel.totalStarted || 0} started · {funnel.totalCompleted || 0} completed
            </CardDescription>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-primary">
              {funnel.overallConversionRate ?? 0}%
            </span>
            <span className="block text-[10px] text-muted-foreground uppercase font-semibold">
              Conversion Rate
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {steps.map((step, idx) => (
          <div key={step.stepIndex || idx} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                  {idx + 1}
                </span>
                {step.name}
              </span>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="font-medium text-foreground">{step.count}</span>
                <span>({step.conversionRate}%)</span>
                {step.dropOffRate > 0 && (
                  <Badge variant="outline" className="text-[10px] text-rose-500 border-rose-200">
                    <ArrowDownRight className="h-2.5 w-2.5 mr-0.5" />
                    {step.dropOffRate}% drop
                  </Badge>
                )}
              </div>
            </div>
            <Progress value={step.conversionRate} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
