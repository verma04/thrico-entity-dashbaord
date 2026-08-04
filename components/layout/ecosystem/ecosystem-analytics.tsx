"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  LucideIcon,
  TrendingUp,
  TrendingDown,
  Activity,
  Info,
  Plus,
} from "lucide-react";
import { formatNumber } from "@/lib/formatNumber";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ---------------------------------------------------------------------------
// KPI Stat Card
// ---------------------------------------------------------------------------
export { EcosystemKPI } from "./ecosystem-kpi";
export type { EcosystemKPIProps } from "./ecosystem-kpi";

// ---------------------------------------------------------------------------
// Section Header
// ---------------------------------------------------------------------------
interface EcosystemSectionHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  actions?: React.ReactNode;
  className?: string;
}

export function EcosystemSectionHeader({
  title,
  description,
  icon: Icon,
  actions,
  className,
}: EcosystemSectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground shrink-0">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground leading-none">
            {title}
          </h3>
          <p className="text-[11px] text-muted-foreground mt-1 leading-none">
            {description}
          </p>
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------
export { EcosystemCard } from "./ecosystem-card";
export type { EcosystemCardProps } from "./ecosystem-card";

// ---------------------------------------------------------------------------
// Grid utility
// ---------------------------------------------------------------------------
export function EcosystemGrid({
  children,
  cols = 3,
  className,
}: {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 12;
  className?: string;
}) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    12: "grid-cols-1 lg:grid-cols-12",
  };

  return (
    <div className={cn("grid gap-4", gridCols[cols], className)}>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Status badge / indicator
// ---------------------------------------------------------------------------
export function EcosystemStatusIndicator({
  status,
  label,
}: {
  status: "active" | "inactive" | "pending";
  label: string;
}) {
  const dotColors = {
    active: "bg-emerald-500",
    inactive: "bg-muted-foreground/30",
    pending: "bg-amber-400",
  };
  const textColors = {
    active: "text-emerald-700 dark:text-emerald-400",
    inactive: "text-muted-foreground",
    pending: "text-amber-700 dark:text-amber-400",
  };
  const bgColors = {
    active:
      "bg-emerald-50 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20",
    inactive: "bg-muted border-border",
    pending:
      "bg-amber-50 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border",
        bgColors[status],
        textColors[status],
      )}
    >
      <span
        className={cn("h-1 w-1 rounded-full shrink-0", dotColors[status])}
      />
      {label}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Progress bar
// ---------------------------------------------------------------------------
export function EcosystemProgress({
  label,
  value,
  max = 100,
  color = "bg-primary",
  showValue = true,
  className,
}: {
  label: string;
  value: number;
  max?: number;
  color?: string;
  showValue?: boolean;
  className?: string;
}) {
  const percentage = Math.min(100, (value / max) * 100);

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
        {showValue && (
          <span className="text-[11px] font-semibold text-foreground tabular-nums">
            {value}%
          </span>
        )}
      </div>
      <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            color,
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Summary / list item
// ---------------------------------------------------------------------------
export function EcosystemSummaryItem({
  title,
  subtitle,
  value,
  icon: Icon,
  avatar,
  timestamp,
  className,
}: {
  title: string;
  subtitle?: string;
  value?: string | number | React.ReactNode;
  icon?: LucideIcon;
  avatar?: string;
  timestamp?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg border border-transparent hover:bg-muted/50 hover:border-border transition-colors duration-150 group/item",
        className,
      )}
    >
      {/* Avatar / icon */}
      <div className="h-8 w-8 rounded-lg bg-muted border border-border flex items-center justify-center text-[11px] font-semibold text-muted-foreground shrink-0 overflow-hidden">
        {avatar ? (
          <img
            src={avatar}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : Icon ? (
          <Icon className="h-4 w-4" />
        ) : (
          title.charAt(0).toUpperCase()
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-foreground truncate leading-none">
          {title}
        </p>
        {subtitle && (
          <p className="text-[11px] text-muted-foreground truncate mt-1 leading-none">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right slot */}
      <div className="text-right shrink-0">
        {value !== undefined && (
          <p className="text-[12px] font-semibold text-foreground tabular-nums leading-none">
            {value}
          </p>
        )}
        {timestamp && (
          <p className="text-[10px] text-muted-foreground mt-1 leading-none">
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skill Card
// ---------------------------------------------------------------------------
interface EcosystemSkillCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  colorScheme?: "indigo" | "sky" | "lime" | "rose" | "purple" | "orange";
  onClick?: () => void;
  className?: string;
}

export function EcosystemSkillCard({
  title,
  description,
  icon: Icon,
  colorScheme = "indigo",
  onClick,
  className,
}: EcosystemSkillCardProps) {
  const colorStyles = {
    indigo: {
      bg: "bg-gradient-to-b from-[#f3f5ff] to-[#f9faff] dark:from-indigo-950/20 dark:to-indigo-950/5 border-transparent dark:border-indigo-900/30",
      iconBg: "bg-gradient-to-br from-indigo-500 to-indigo-600",
    },
    sky: {
      bg: "bg-gradient-to-b from-[#f0fafe] to-[#f7fcff] dark:from-sky-950/20 dark:to-sky-950/5 border-transparent dark:border-sky-900/30",
      iconBg: "bg-gradient-to-br from-sky-400 to-sky-500",
    },
    lime: {
      bg: "bg-gradient-to-b from-[#f4fdf4] to-[#f9fef9] dark:from-lime-950/20 dark:to-lime-950/5 border-transparent dark:border-lime-900/30",
      iconBg: "bg-gradient-to-br from-lime-400 to-lime-500",
    },
    rose: {
      bg: "bg-gradient-to-b from-[#fff4f5] to-[#fff9f9] dark:from-rose-950/20 dark:to-rose-950/5 border-transparent dark:border-rose-900/30",
      iconBg: "bg-gradient-to-br from-rose-400 to-rose-500",
    },
    purple: {
      bg: "bg-gradient-to-b from-[#fbf4ff] to-[#fdf9ff] dark:from-purple-950/20 dark:to-purple-950/5 border-transparent dark:border-purple-900/30",
      iconBg: "bg-gradient-to-br from-purple-400 to-purple-500",
    },
    orange: {
      bg: "bg-gradient-to-b from-[#fff5f0] to-[#fffaf7] dark:from-orange-950/20 dark:to-orange-950/5 border-transparent dark:border-orange-900/30",
      iconBg: "bg-gradient-to-br from-orange-400 to-orange-500",
    },
  };

  const currentStyle = colorStyles[colorScheme] || colorStyles.indigo;

  return (
    <div
      className={cn(
        "relative flex flex-col p-5 rounded-[20px] border transition-all duration-300 min-h-[230px] hover:shadow-md hover:-translate-y-0.5",
        currentStyle.bg,
        className,
      )}
    >
      <div
        className={cn(
          "h-8 w-8 rounded-[10px] flex items-center justify-center mb-auto shadow-sm",
          currentStyle.iconBg,
        )}
      >
        <Icon className="h-4 w-4 text-white" />
      </div>

      <div className="mt-8">
        <h3 className="text-[14px] font-semibold text-foreground mb-1.5 leading-tight">
          {title}
        </h3>
        <p className="text-[12px] text-muted-foreground leading-snug">
          {description}
        </p>
      </div>

      <button
        onClick={onClick}
        className="mt-5 flex items-center justify-center gap-1.5 w-full py-2 px-4 rounded-[10px] bg-background border border-border/60 text-[13px] font-medium text-foreground hover:bg-muted/50 transition-colors shadow-sm"
      >
        <Plus className="h-3.5 w-3.5 text-muted-foreground" /> Create skill
      </button>
    </div>
  );
}
