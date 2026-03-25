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
  color?: string; // e.g. "text-indigo-600"
  bg?: string; // e.g. "bg-indigo-50"
  trendLabel?: string;
}

export function EcosystemKPI({
  title,
  value,
  trend,
  icon: Icon,
  color = "text-slate-700",
  bg = "bg-slate-100",
  trendLabel = "vs last period",
}: EcosystemKPIProps) {
  const isPositive = trend !== undefined && trend > 0;
  const isNegative = trend !== undefined && trend < 0;

  const formattedValue =
    typeof value === "number" ? formatNumber(value) : value;

  return (
    <div className="group relative flex flex-col gap-6 rounded-4xl border border-slate-100 bg-white/50 backdrop-blur-xl px-6 py-7 shadow-sm transition-all duration-500 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.06)] hover:-translate-y-1 overflow-hidden ring-1 ring-slate-100/50">
      {/* Background Glow */}
      <div
        className={cn(
          "absolute -right-4 -top-4 h-24 w-24 rounded-full blur-2xl opacity-[0.03] transition-opacity duration-500 group-hover:opacity-[0.08]",
          bg,
        )}
      />

      {/* Top row — label + icon */}
      <div className="flex items-center justify-between relative z-10">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
          {title}
        </span>
        <div
          className={cn(
            "h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-white/50 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
            bg,
          )}
        >
          <Icon className={cn("h-4.5 w-4.5", color)} />
        </div>
      </div>

      {/* Main value */}
      <div className="flex flex-col gap-1 relative z-10">
        <div className="flex items-center gap-3">
          <span className="text-[32px] font-black text-slate-900 leading-tight tracking-tight tabular-nums group-hover:text-indigo-600 transition-colors duration-300">
            {formattedValue}
          </span>
          {trend !== undefined && trend !== 0 && (
            <div
              className={cn(
                "inline-flex items-center gap-1 text-[11px] font-black px-2 py-1 rounded-full shadow-xs ring-1 ring-inset",
                isPositive &&
                  "bg-emerald-50 text-emerald-600 ring-emerald-100/50",
                isNegative && "bg-rose-50 text-rose-600 ring-rose-100/50",
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
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 opacity-70 group-hover:opacity-100 transition-opacity">
            {trendLabel}
          </p>
        )}
      </div>

      {/* Static Indicator Bar */}
      <div
        className={cn(
          "absolute bottom-0 left-6 right-6 h-1 rounded-t-full opacity-20 transition-all duration-500 group-hover:h-1.5 group-hover:opacity-100",
          bg,
        )}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section Header (used inside cards / tables)
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
        <div className="h-8 w-8 rounded-md bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-600 shrink-0">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-[14px] font-semibold text-slate-900 leading-none tracking-tight">
            {title}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1 leading-none">
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
// Card (wraps charts, tables, lists)
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
        "rounded-[2.5rem] border border-slate-100 bg-white/40 backdrop-blur-md shadow-sm transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.06)] overflow-hidden ring-1 ring-slate-100/50",
        className,
      )}
    >
      {(title || Icon) && (
        <div className="px-8 py-6 border-b border-slate-50/80 bg-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-2xl bg-slate-900 shadow-lg shadow-slate-200 flex items-center justify-center text-white shrink-0">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-[16px] font-black text-slate-900 leading-none tracking-tight uppercase italic italic-none">
                  {title}
                </h3>
                <p className="text-[11px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={cn("p-8", innerClassName)}>{children}</div>
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
    inactive: "bg-slate-300",
    pending: "bg-amber-400",
  };
  const textColors = {
    active: "text-emerald-700",
    inactive: "text-slate-500",
    pending: "text-amber-700",
  };
  const bgColors = {
    active: "bg-emerald-50 border-emerald-100",
    inactive: "bg-slate-50 border-slate-200",
    pending: "bg-amber-50 border-amber-100",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider border",
        bgColors[status],
        textColors[status],
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full shrink-0", dotColors[status])}
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
  color = "bg-slate-800",
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
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          {label}
        </span>
        {showValue && (
          <span className="text-[11px] font-semibold text-slate-700 tabular-nums">
            {value}%
          </span>
        )}
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
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
        "flex items-center gap-3 px-4 py-3 rounded-lg border border-transparent hover:bg-slate-50 hover:border-slate-100 transition-colors duration-150 group/item",
        className,
      )}
    >
      {/* Avatar / icon */}
      <div className="h-8 w-8 rounded-md bg-slate-100 border border-slate-200/60 flex items-center justify-center text-[12px] font-semibold text-slate-500 shrink-0 overflow-hidden">
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
        <p className="text-[13px] font-medium text-slate-800 truncate leading-none">
          {title}
        </p>
        {subtitle && (
          <p className="text-[11px] text-slate-400 truncate mt-1 leading-none">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right slot */}
      <div className="text-right shrink-0">
        {value !== undefined && (
          <p className="text-[12px] font-semibold text-slate-800 tabular-nums leading-none">
            {value}
          </p>
        )}
        {timestamp && (
          <p className="text-[10px] text-slate-400 mt-1 leading-none">
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
}
