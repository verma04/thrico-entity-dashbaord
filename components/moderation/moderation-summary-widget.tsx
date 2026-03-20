"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetModerationStats } from "@/graphql/moderation/hooks";
import { ShieldAlert, AlertTriangle, Link2, Flag, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ModerationSummaryWidget() {
  const { data, loading, error } = useGetModerationStats();

  if (error) {
    return (
      <Card className="border-red-100 bg-red-50/50">
        <CardContent className="pt-6">
          <p className="text-red-500">Failed to load moderation stats.</p>
        </CardContent>
      </Card>
    );
  }

  const stats = data?.getModerationStats;

  const items = [
    {
      label: "Pending Reports",
      value: stats?.pendingReports,
      icon: Flag,
      color: "text-amber-500",
      bgColor: "bg-amber-100",
    },
    {
      label: "Resolved Reports",
      value: stats?.resolvedReports,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-100",
    },
    {
      label: "Banned Words",
      value: stats?.bannedWordsCount,
      icon: AlertTriangle,
      color: "text-red-500",
      bgColor: "bg-red-100",
    },
    {
      label: "Blocked Links",
      value: stats?.blockedLinksCount,
      icon: Link2,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      label: "Auto-Moderated Today",
      value: stats?.autoModeratedToday,
      icon: ShieldAlert,
      color: "text-purple-500",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <Card className="col-span-1 border-none shadow-md bg-white/50 backdrop-blur-sm group/main">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
            <ShieldAlert className="h-5 w-5" />
          </div>
          Moderation Overview
        </CardTitle>
        <Link href="/settings/moderation">
          <Button variant="ghost" size="sm" className="text-xs font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
            Manage Settings
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex-1 min-w-[140px] flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center group cursor-pointer"
            >
              <div className={`p-3 rounded-2xl ${item.bgColor} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <div className="text-3xl font-black mb-1 bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-600">
                {loading ? <Skeleton className="h-9 w-12" /> : (item.value ?? 0).toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
