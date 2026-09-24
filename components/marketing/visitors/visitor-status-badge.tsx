"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Ghost,
  Fingerprint,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Clock,
  AlertTriangle,
  UserX,
  Link2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VisitorIntelligenceStatus } from "@/types/utm";

interface VisitorStatusBadgeProps {
  status: VisitorIntelligenceStatus | string;
  label?: string;
  className?: string;
  size?: "sm" | "default";
}

export function VisitorStatusBadge({
  status,
  label,
  className,
  size = "default",
}: VisitorStatusBadgeProps) {
  const normStatus = (status || "").toUpperCase();

  switch (normStatus) {
    case "ANONYMOUS":
      return (
        <Badge
          variant="outline"
          className={cn(
            "gap-1 border-slate-300 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-medium",
            size === "sm" ? "text-[10px] px-1.5 py-0" : "text-[11px] px-2 py-0.5",
            className
          )}
        >
          <Ghost className={size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3 text-slate-500"} />
          <span>{label || "Ghost Visitor"}</span>
        </Badge>
      );

    case "IDENTIFIED":
      return (
        <Badge
          variant="outline"
          className={cn(
            "gap-1 border-sky-300 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 font-medium",
            size === "sm" ? "text-[10px] px-1.5 py-0" : "text-[11px] px-2 py-0.5",
            className
          )}
        >
          <Fingerprint className={size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3 text-sky-500"} />
          <span>{label || "Identified Lead"}</span>
        </Badge>
      );

    case "CONNECTED":
      return (
        <Badge
          variant="outline"
          className={cn(
            "gap-1 border-indigo-300 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-medium",
            size === "sm" ? "text-[10px] px-1.5 py-0" : "text-[11px] px-2 py-0.5",
            className
          )}
        >
          <CheckCircle2 className={size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3 text-indigo-500"} />
          <span>{label || "Connected Member"}</span>
        </Badge>
      );

    case "RECENTLY_ACTIVE":
      return (
        <Badge
          variant="outline"
          className={cn(
            "gap-1 border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-medium",
            size === "sm" ? "text-[10px] px-1.5 py-0" : "text-[11px] px-2 py-0.5",
            className
          )}
        >
          <Zap className={size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3 text-emerald-500"} />
          <span>{label || "Recently Active"}</span>
        </Badge>
      );

    case "ACTIVE":
      return (
        <Badge
          variant="outline"
          className={cn(
            "gap-1 border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300 font-medium",
            size === "sm" ? "text-[10px] px-1.5 py-0" : "text-[11px] px-2 py-0.5",
            className
          )}
        >
          <ShieldCheck className={size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3 text-green-500"} />
          <span>{label || "Active Member"}</span>
        </Badge>
      );

    case "DORMANT":
      return (
        <Badge
          variant="outline"
          className={cn(
            "gap-1 border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-medium",
            size === "sm" ? "text-[10px] px-1.5 py-0" : "text-[11px] px-2 py-0.5",
            className
          )}
        >
          <Clock className={size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3 text-amber-500"} />
          <span>{label || "Dormant"}</span>
        </Badge>
      );

    case "AT_RISK":
      return (
        <Badge
          variant="outline"
          className={cn(
            "gap-1 border-orange-300 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 font-medium",
            size === "sm" ? "text-[10px] px-1.5 py-0" : "text-[11px] px-2 py-0.5",
            className
          )}
        >
          <AlertTriangle className={size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3 text-orange-500"} />
          <span>{label || "Churn Risk"}</span>
        </Badge>
      );

    case "CHURNED":
      return (
        <Badge
          variant="outline"
          className={cn(
            "gap-1 border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 font-medium",
            size === "sm" ? "text-[10px] px-1.5 py-0" : "text-[11px] px-2 py-0.5",
            className
          )}
        >
          <UserX className={size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3 text-rose-500"} />
          <span>{label || "Churned"}</span>
        </Badge>
      );

    case "UTM_ATTRIBUTED":
      return (
        <Badge
          variant="outline"
          className={cn(
            "gap-1 border-purple-300 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 font-medium",
            size === "sm" ? "text-[10px] px-1.5 py-0" : "text-[11px] px-2 py-0.5",
            className
          )}
        >
          <Link2 className={size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3 text-purple-500"} />
          <span>{label || "Campaign Attributed"}</span>
        </Badge>
      );

    case "CONVERTED":
      return (
        <Badge
          variant="outline"
          className={cn(
            "gap-1 border-emerald-300 dark:border-emerald-800 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 text-emerald-700 dark:text-emerald-300 font-medium shadow-2xs",
            size === "sm" ? "text-[10px] px-1.5 py-0" : "text-[11px] px-2 py-0.5",
            className
          )}
        >
          <Sparkles className={size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3 text-emerald-500"} />
          <span>{label || "Converted Member"}</span>
        </Badge>
      );

    default:
      return (
        <Badge
          variant="secondary"
          className={cn(
            "font-medium",
            size === "sm" ? "text-[10px] px-1.5 py-0" : "text-[11px] px-2 py-0.5",
            className
          )}
        >
          {label || normStatus}
        </Badge>
      );
  }
}
