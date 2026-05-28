"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  LucideIcon,
  TrendingUp,
  TrendingDown,
  Activity,
  Info,
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
interface EcosystemKPIProps {
  title: string;
  value: string | number | React.ReactNode;
  trend?: number;
  trendData?: number[];
  icon?: LucideIcon;
  color?: string;
  bg?: string;
  trendLabel?: string;
  tooltip?: string;
  suffix?: string;
}

export function EcosystemKPI({
  title,
  value,
  trend,
  trendData,
  icon: Icon,
  color = "text-foreground",
  bg = "bg-primary",
  trendLabel = "vs last period",
  tooltip,
  suffix = "",
}: EcosystemKPIProps) {
  const isPositive = trend !== undefined && trend >= 0;
  const isNegative = trend !== undefined && trend < 0;
  
  // Create dummy flat trend if none provided but we want the aesthetic
  const chartData = (trendData ?? [0, 0, 0, 0, 0, 0, 0]).map((val, i) => ({ value: val, id: i }));

  const formattedValue = typeof value === "number" ? formatNumber(value) : value;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:shadow-md flex flex-col justify-between">
      {/* Colored top accent strip */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary/60 to-primary/20 opacity-80" />
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_90%_10%,hsl(var(--primary)/0.06),transparent_50%)]" />

      {/* Top Header */}
      <div className="relative p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold text-muted-foreground/70 uppercase tracking-[0.22em] leading-none">
              {title}
            </span>
            {tooltip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground/40 cursor-help hover:text-muted-foreground/70 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[200px] bg-background border border-border/60 text-foreground shadow-xl">
                    <p className="font-mono text-[10px] text-muted-foreground">{tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          {Icon ? (
            <div className="h-7 w-7 rounded-lg border border-border/50 bg-muted/60 flex items-center justify-center group-hover:bg-muted transition-colors">
              <Icon className={cn("h-3 w-3", color)} />
            </div>
          ) : (
            <div className="h-7 w-7 rounded-lg border border-border/50 bg-muted/60 flex items-center justify-center">
              <div className={cn("h-2 w-2 rounded-full", bg)} />
            </div>
          )}
        </div>

        {/* Main Value & Change */}
        <div className="mb-3">
          <h3 className="text-[1.4rem] font-bold text-foreground tracking-tight leading-none mb-1.5 tabular-nums">
            {formattedValue}{suffix}
          </h3>

          <div className="flex items-center gap-1.5">
            {trend !== undefined && trend !== 0 ? (
              <div
                className={cn(
                  "flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-semibold",
                  isPositive
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400",
                )}
              >
                {isPositive ? (
                  <TrendingUp className="h-2 w-2" />
                ) : (
                  <TrendingDown className="h-2 w-2" />
                )}
                {isPositive ? "+" : ""}
                {typeof trend === "number" ? trend.toFixed(1) : trend}%
              </div>
            ) : (
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-muted text-muted-foreground">
                <Activity className="h-2 w-2" />
                0%
              </div>
            )}
            {trendLabel && (
              <span className="text-[9px] font-medium text-muted-foreground/50 uppercase tracking-wider">
                {trendLabel}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Sparkline — flush to bottom */}
      <div className="relative h-9 mt-auto pointer-events-none">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient
                id={`gradient-${title.replace(/\s+/g, "")}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={isPositive ? "#10b981" : isNegative ? "#f43f5e" : "#8b5cf6"}
                  stopOpacity={0.15}
                />
                <stop
                  offset="95%"
                  stopColor={isPositive ? "#10b981" : isNegative ? "#f43f5e" : "#8b5cf6"}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={isPositive ? "#10b981" : isNegative ? "#f43f5e" : "#8b5cf6"}
              strokeWidth={1.5}
              fillOpacity={1}
              fill={`url(#gradient-${title.replace(/\s+/g, "")})`}
              isAnimationActive={true}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

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
interface EcosystemCardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  icon?: LucideIcon;
  decorationIcon?: LucideIcon;
  decorationColor?: string;
  className?: string;
  innerClassName?: string;
}

export function EcosystemCard({
  children,
  title,
  description,
  icon: Icon = Activity,
  decorationIcon: _DecoIcon,
  decorationColor,
  className,
  innerClassName,
}: EcosystemCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card shadow-sm overflow-hidden",
        className,
      )}
    >
      {title && (
        <div className="px-5 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground leading-none tracking-tight">
                  {title}
                </h3>
                {description && (
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={cn("p-5", innerClassName)}>{children}</div>
    </div>
  );
}

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
