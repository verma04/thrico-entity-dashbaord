"use client";

import React from "react";
import { Bot, FileText, CheckCircle, XCircle, AlertCircle, History, ExternalLink, Zap, ShieldCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AiModerationWidgetProps {
  aiData?: any;
  loading?: boolean;
}

export function AiModerationDashboardWidget({ aiData, loading }: AiModerationWidgetProps) {
  const aiStats = aiData?.getAiModerationDashboard;

  const totalPosts = aiStats?.totalPosts || 0;
  const flagged = aiStats?.flaggedContent || 0;
  const pending = aiStats?.pendingModeration || 0;
  const rejected = aiStats?.rejectedPosts || 0;
  const totalTokens = aiStats?.totalTokens || 0;
  
  const autoApproved = Math.max(0, totalPosts - flagged - pending - rejected);
  const autoApprovedRate = totalPosts > 0 ? Math.round((autoApproved / totalPosts) * 100) : 100;
  const flaggedRate = totalPosts > 0 ? Math.round((flagged / totalPosts) * 100) : 0;
  const rejectedRate = totalPosts > 0 ? Math.round((rejected / totalPosts) * 100) : 0;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden flex flex-col shadow-sm transition-all duration-300 hover:shadow-md hover:border-border/80">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <Bot className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground leading-none tracking-tight">Automated Core Diagnostics</h3>
            <p className="text-[11px] text-muted-foreground mt-1">Real-time AI filtration and safety metrics</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-bold h-5 px-2 tracking-wider text-[9px] uppercase">
          ACTIVE
        </Badge>
      </div>

      <div className="p-5 flex-1 flex flex-col md:flex-row gap-6 items-stretch justify-between">
        {/* Left Column: Trust Gauge */}
        <div className="flex flex-col items-center justify-center p-6 bg-muted/20 dark:bg-muted/10 rounded-xl border border-border/50 md:w-1/3 shrink-0">
          <div className="relative h-28 w-28 mb-4">
            <svg className="w-full h-full -rotate-90">
              <circle cx="56" cy="56" r="48" fill="transparent" stroke="currentColor" className="text-muted/30" strokeWidth="6" />
              <circle
                cx="56"
                cy="56"
                r="48"
                fill="transparent"
                stroke="url(#gradient-approval)"
                strokeWidth="6"
                strokeDasharray="301.6"
                strokeDashoffset={301.6 * (1 - (loading ? 1 : autoApprovedRate / 100))}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="gradient-approval" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold tracking-tight text-foreground font-mono">
                {loading ? "—" : `${autoApprovedRate}%`}
              </span>
              <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Trust Index</span>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Auto-Approval Rate
            </p>
            <p className="text-[9px] text-muted-foreground/60 mt-1 max-w-[150px] leading-tight">
              Percentage of user posts cleared instantly by AI layers.
            </p>
          </div>
        </div>

        {/* Right Column: Mini Stats and Progress Bars */}
        <div className="flex-1 flex flex-col justify-between space-y-5">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Analyzed", value: totalPosts, icon: FileText, color: "text-indigo-600 dark:text-indigo-400" },
              { label: "Scans Run", value: totalTokens, icon: Zap, color: "text-emerald-600 dark:text-emerald-400" },
              { label: "Pending", value: pending, icon: Bot, color: "text-blue-600 dark:text-blue-400" },
            ].map((stat) => (
              <div key={stat.label} className="p-3 rounded-xl bg-background border border-border flex flex-col justify-between min-h-[68px]">
                <div className="flex items-center gap-1 text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
                  <stat.icon className={cn("h-3 w-3", stat.color)} />
                  {stat.label}
                </div>
                <p className="text-base font-bold text-foreground font-mono mt-1">
                  {loading ? <Skeleton className="h-5 w-12 mt-1" /> : stat.value.toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {/* Flagged Rate bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                <span className="flex items-center gap-1.5"><AlertCircle className="h-3 w-3 text-amber-500" /> Flagged Rate</span>
                <span className="text-amber-600 dark:text-amber-400 font-mono">{loading ? "—" : `${flaggedRate}%`}</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden border border-border/40">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: loading ? "0%" : `${flaggedRate}%` }}
                />
              </div>
            </div>

            {/* Rejection Rate bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                <span className="flex items-center gap-1.5"><XCircle className="h-3 w-3 text-rose-500" /> Rejection Rate</span>
                <span className="text-rose-600 dark:text-rose-400 font-mono">{loading ? "—" : `${rejectedRate}%`}</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden border border-border/40">
                <div 
                  className="h-full bg-gradient-to-r from-rose-500 to-rose-600 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: loading ? "0%" : `${rejectedRate}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <Link href="/moderation/settings" className="flex-1">
              <Button variant="ghost" size="sm" className="w-full h-8 text-[10px] font-bold uppercase tracking-widest gap-1.5 border border-transparent hover:border-border hover:bg-background">
                <History className="h-3.5 w-3.5" />
                Audit Logs
              </Button>
            </Link>
            <Link href="/moderation/reports" className="flex-1">
              <Button size="sm" className="w-full h-8 text-[10px] font-bold uppercase tracking-widest gap-1.5 hover:bg-indigo-700 bg-indigo-600 text-white">
                Review Queue
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
