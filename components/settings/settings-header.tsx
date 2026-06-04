"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsHeaderProps {
  title: string;
  description: string;
  breadcrumb: string;
  icon: LucideIcon;
  statusText?: string;
  status?: "operational" | "warning" | "error";
  className?: string;
}

export function SettingsHeader({
  title,
  description,
  breadcrumb,
  icon: Icon,
  statusText = "Operational",
  status = "operational",
  className,
}: SettingsHeaderProps) {
  const statusColors = {
    operational: "text-green-600 bg-green-600",
    warning: "text-amber-600 bg-amber-600",
    error: "text-destructive bg-destructive",
  };

  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-border w-full", className)}>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <Icon className="h-3 w-3" />
          {breadcrumb}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          {description}
        </p>
      </div>
      <div className="flex items-center gap-3 pt-1">
        <div className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground border border-border">
          <Icon className="h-5 w-5" />
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Status</p>
          <p className={cn(
            "text-xs font-semibold flex items-center gap-1 justify-end",
            statusColors[status].split(" ")[0]
          )}>
            <span className={cn("h-1 w-1 rounded-full", statusColors[status].split(" ")[1])} />
            {statusText}
          </p>
        </div>
      </div>
    </div>
  );
}
