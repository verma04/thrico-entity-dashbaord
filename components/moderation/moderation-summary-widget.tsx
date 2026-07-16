"use client";

import React from "react";
import { ShieldAlert, AlertTriangle, Link2, Flag, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ModerationSummaryProps {
  statsData?: any;
  loading?: boolean;
}

export function ModerationSummaryWidget({ statsData, loading }: ModerationSummaryProps) {
  const stats = statsData?.getModerationStats;


  const items = [
    {
      label: "Pending Reports",
      value: stats?.pendingReports,
      icon: Flag,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      label: "Resolved",
      value: stats?.resolvedReports,
      icon: CheckCircle,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Banned Words",
      value: stats?.bannedWordsCount,
      icon: AlertTriangle,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
    },
    {
      label: "Blocked Links",
      value: stats?.blockedLinksCount,
      icon: Link2,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
  ];

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
            <ShieldAlert className="h-4 w-4 text-slate-600" />
          </div>
          <p className="text-sm font-semibold text-foreground">Safety Overview</p>
        </div>
        <Link href="/moderation/settings">
          <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
            Settings
          </Button>
        </Link>
      </div>
      <div className="p-5 flex-1 flex items-center">
        <div className="grid grid-cols-2 gap-4 w-full">
          {items.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border border-border bg-muted/30 flex items-center gap-4 transition-all hover:bg-muted/50"
            >
              <div className={item.iconBg + " p-2 rounded-lg shrink-0"}>
                <item.icon className={`h-4 w-4 ${item.iconColor}`} />
              </div>
              <div className="space-y-0.5">
                <p className="text-xl font-bold tracking-tight text-foreground">
                  {loading ? <Skeleton className="h-6 w-12" /> : (item.value ?? 0).toLocaleString()}
                </p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
