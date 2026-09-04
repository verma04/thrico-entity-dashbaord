"use client";

import React from "react";
import { ShieldCheck, Send, CheckCircle2, AlertOctagon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface EmailDeliverabilityHealthProps {
  loading: boolean;
  emailsSent: number;
}

export function EmailDeliverabilityHealth({ loading, emailsSent }: EmailDeliverabilityHealthProps) {
  const cards = [
    {
      title: "Total Broadcasts",
      value: emailsSent.toLocaleString(),
      change: "+14.2%",
      badge: "Active",
      badgeColor: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200",
      description: "Delivered to valid subscriber inboxes",
      icon: Send,
    },
    {
      title: "Delivery Rate",
      value: "99.4%",
      change: "+0.3%",
      badge: "Optimal (>98%)",
      badgeColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200",
      description: "Ratio of emails successfully received",
      icon: CheckCircle2,
    },
    {
      title: "Bounce Rate",
      value: "0.42%",
      change: "-0.15%",
      badge: "Healthy (<2%)",
      badgeColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200",
      description: "Hard & soft bounces combined",
      icon: ShieldCheck,
    },
    {
      title: "Spam Complaint Rate",
      value: "0.01%",
      change: "0.00%",
      badge: "Target (<0.1%)",
      badgeColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200",
      description: "Member spam markings reported",
      icon: AlertOctagon,
    },
  ];

  return (
    <div id="kpi-section-deliverability" className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              1. Deliverability & Transmission Health
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Core email transport reliability and reputation telemetry
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
              return (
                <Card
                  key={idx}
                  className="border-border/60 bg-card shadow-2xs hover:border-border transition-all"
                >
                  <CardContent className="p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                        {card.title}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn("text-[9px] px-1.5 py-0 font-bold rounded-[4px]", card.badgeColor)}
                      >
                        {card.badge}
                      </Badge>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-extrabold text-foreground tracking-tight tabular-nums">
                        {card.value}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        {card.change}
                      </span>
                    </div>

                    <p className="text-[10.5px] text-muted-foreground line-clamp-1">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
      </div>
    </div>
  );
}
