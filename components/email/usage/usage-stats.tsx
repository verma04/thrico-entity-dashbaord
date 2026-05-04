"use client";

import React from "react";
import { Mail, Layers, Activity, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  className?: string;
}

function StatItem({ label, value, icon: Icon, className }: StatProps) {
  return (
    <Card className="border-border shadow-none bg-background">
      <CardContent className="p-4 flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </p>
          <p className={cn("text-lg font-semibold tracking-tight", className)}>
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

interface UsageStatsProps {
  emailsSent: number;
  monthlyQuota: number;
  remaining: number;
  daysToReset: number;
}

export function UsageStats({ emailsSent, monthlyQuota, remaining, daysToReset }: UsageStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatItem 
        label="Emails Sent" 
        value={emailsSent.toLocaleString()} 
        icon={Mail} 
      />
      <StatItem 
        label="Monthly Quota" 
        value={monthlyQuota.toLocaleString()} 
        icon={Layers} 
      />
      <StatItem 
        label="Remaining" 
        value={remaining.toLocaleString()} 
        icon={Activity}
        className="text-emerald-600"
      />
      <StatItem 
        label="Days to Reset" 
        value={daysToReset} 
        icon={Clock}
        className="text-amber-600"
      />
    </div>
  );
}
