"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { formatNumber } from "@/lib/formatNumber";

// ---------------------------------------------------------------------------
// KPI Stat Card
// ---------------------------------------------------------------------------
interface EcosystemKPIProps {
  title: string;
  value: string | number | React.ReactNode;
  trend?: number;
  icon: LucideIcon;
  color?: string;
  bg?: string;
  trendLabel?: string;
}

export function EcosystemKPI({
  title,
  value,
  trend,
  icon: Icon,
  color = "text-foreground/70",
  bg = "bg-muted",
  trendLabel = "vs last period",
}: EcosystemKPIProps) {
  const isPositive = trend !== undefined && trend > 0;
  const isNegative = trend !== undefined && trend < 0;

  const formattedValue =
    typeof value === "number" ? formatNumber(value) : value;

  return (
    <div className="group relative flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-border/80 hover:shadow-sm overflow-hidden">
      {/* Top row — label + icon */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider leading-none">
          {title}
        </span>
        <div
          className={cn(
            "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border border-border/50",
            bg,
          )}
        >
          <Icon className={cn("h-4 w-4", color)} />
        </div>
      </div>

      {/* Main value */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl font-semibold text-foreground tracking-tight tabular-nums">
            {formattedValue}
          </span>
          {trend !== undefined && trend !== 0 && (
            <div
              className={cn(
                "inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md",
                isPositive && "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
                isNegative && "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {Math.abs(trend)}%
            </div>
          )}
        </div>

        {/* Bottom label */}
        {trendLabel && (
          <p className="text-[11px] text-muted-foreground/70">
            {trendLabel}
          </p>
        )}
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
    active: "bg-emerald-50 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20",
    inactive: "bg-muted border-border",
    pending: "bg-amber-50 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20",
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
