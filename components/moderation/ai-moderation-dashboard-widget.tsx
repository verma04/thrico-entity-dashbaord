"use client";

import React from "react";
import { useGetAiModerationDashboard } from "@/graphql/moderation/hooks";
import { Bot, FileText, CheckCircle, XCircle, AlertCircle, History, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { TimeRange, DateRangeInput } from "@/graphql/moderation/hooks";

interface AiModerationWidgetProps {
  timeRange?: TimeRange;
  dateRange?: DateRangeInput;
}

export function AiModerationDashboardWidget({ timeRange, dateRange }: AiModerationWidgetProps) {
  const { data, loading, error } = useGetAiModerationDashboard(timeRange, dateRange);

  if (error) {
    return (
      <div className="p-6 rounded-xl border border-rose-200 bg-rose-50 text-rose-600">
        <p className="text-sm font-medium">Failed to load AI metrics.</p>
      </div>
    );
  }

  const aiStats = data?.getAiModerationDashboard;

  const totalPosts = aiStats?.totalPosts || 0;
  const flagged = aiStats?.flaggedContent || 0;
  const pending = aiStats?.pendingModeration || 0;
  const rejected = aiStats?.rejectedPosts || 0;
  const autoApproved = totalPosts - flagged - pending - rejected;

  const getPercentage = (value: number) => {
    return totalPosts > 0 ? Math.round((value / totalPosts) * 100) : 0;
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden h-full flex flex-col">
       <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
            <Bot className="h-4 w-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">AI Content Gateway</p>
            <p className="text-xs text-muted-foreground font-medium">Autonomous pipeline status</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 font-bold h-5 px-2">
           ACTIVE
        </Badge>
      </div>

      <div className="p-5 flex-1 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Analyzed", value: totalPosts, icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Flagged", value: flagged, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Rejected", value: rejected, icon: XCircle, color: "text-rose-600", bg: "bg-rose-50" },
            { label: "Pending", value: pending, icon: Bot, color: "text-blue-600", bg: "bg-blue-50" },
          ].map((stat) => (
            <div key={stat.label} className="p-3 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                <stat.icon className={cn("h-3 w-3", stat.color)} />
                {stat.label}
              </div>
              <p className="text-lg font-bold text-foreground font-mono">
                {loading ? <Skeleton className="h-6 w-12" /> : stat.value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {!loading && totalPosts > 0 && (
          <div className="space-y-4 pt-1">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground flex items-center gap-2">
                  Auto-Approval Trust
                </span>
                <span className="font-bold text-emerald-600 font-mono">
                  {getPercentage(autoApproved)}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${getPercentage(autoApproved)}%` }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground mr-1">
                  <span>Flagged Rate</span>
                  <span className="text-amber-600 font-mono">{getPercentage(flagged)}%</span>
                </div>
                <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${getPercentage(flagged)}%` }}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground mr-1">
                  <span>Rejection Rate</span>
                  <span className="text-rose-600 font-mono">{getPercentage(rejected)}%</span>
                </div>
                <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-rose-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${getPercentage(rejected)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-2 pt-2">
          <Link href="/moderation/settings" className="flex-1">
            <Button variant="ghost" size="sm" className="w-full h-8 text-xs font-semibold gap-1.5">
              <History className="h-3.5 w-3.5" />
              Audit Logs
            </Button>
          </Link>
          <Link href="/moderation/reported-content" className="flex-1">
            <Button size="sm" className="w-full h-8 text-xs font-semibold gap-1.5">
              Review Queue
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
