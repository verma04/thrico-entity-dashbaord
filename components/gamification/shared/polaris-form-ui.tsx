"use client";

import React from "react";
import {
  Zap,
  Layers,
  Boxes,
  ShoppingBag,
  ShieldCheck,
  Calendar,
  MessageSquare,
  Users,
  TrendingUp,
  Sparkles,
  Info,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/* ─── PolarisFormCard ─── */
interface PolarisFormCardProps {
  step?: number;
  icon?: LucideIcon;
  title: string;
  description?: string;
  badge?: string;
  badgeVariant?: "default" | "outline" | "emerald";
  children: React.ReactNode;
  className?: string;
}

export function PolarisFormCard({
  step,
  icon: Icon,
  title,
  description,
  badge,
  badgeVariant = "outline",
  children,
  className,
}: PolarisFormCardProps) {
  return (
    <div
      className={cn(
        "rounded-[10px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-3.5 transition-all duration-150",
        className,
      )}
    >
      <div className="mb-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {Icon && (
              <Icon className="h-3.5 w-3.5 text-[#616161] dark:text-zinc-400 shrink-0" />
            )}
            <h3 className="text-[13px] font-semibold text-[#303030] dark:text-zinc-100 leading-[18px]">
              {title}
            </h3>
            {badge && (
              <Badge
                variant="outline"
                className="bg-[#f6f6f7] dark:bg-zinc-800 text-[#303030] dark:text-zinc-200 border-[#d2d5d9] dark:border-zinc-700 text-[10.5px] font-medium px-1.5 py-0.2 rounded-[4px]"
              >
                {badge}
              </Badge>
            )}
          </div>
        </div>
        {description && (
          <p className="text-[11.5px] text-[#616161] dark:text-zinc-400 mt-0.5 leading-[16px]">
            {description}
          </p>
        )}
      </div>
      <div className="space-y-3.5">{children}</div>
    </div>
  );
}

/* ─── PolarisInfoBanner ─── */
interface PolarisInfoBannerProps {
  title?: string;
  description: string;
  icon?: LucideIcon;
  variant?: "default" | "warning" | "success" | "info";
  tips?: string[];
  className?: string;
}

export function PolarisInfoBanner({
  title,
  description,
  icon: Icon = Info,
  variant = "default",
  tips,
  className,
}: PolarisInfoBannerProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 p-2.5 rounded-[6px] bg-[#f6f6f7] dark:bg-zinc-800/50 border border-[#d2d5d9] dark:border-zinc-700 text-[11.5px] text-[#616161] dark:text-zinc-300",
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5 text-[#616161] dark:text-zinc-400 mt-0.5 shrink-0" />
      <div className="space-y-0.5 leading-[16px]">
        {title && (
          <p className="font-semibold text-[#303030] dark:text-zinc-100 text-[12px]">
            {title}
          </p>
        )}
        <p className="text-[11.5px] text-[#616161] dark:text-zinc-400">
          {description}
        </p>
        {tips && tips.length > 0 && (
          <ul className="list-disc pl-3.5 space-y-0.5 mt-1 text-[11px] text-[#616161] dark:text-zinc-400">
            {tips.map((t, idx) => (
              <li key={idx}>{t}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ─── PolarisOriginPicker ─── */
interface PolarisOriginPickerProps {
  sourceType: "MODULE" | "INTEGRATION";
  onSelect: (type: "MODULE" | "INTEGRATION") => void;
  modulesCount: number;
  integrationsCount: number;
  disabled?: boolean;
  moduleLabel?: string;
  moduleDescription?: string;
  integrationLabel?: string;
  integrationDescription?: string;
}

export function PolarisOriginPicker({
  sourceType,
  onSelect,
  modulesCount,
  integrationsCount,
  disabled,
  moduleLabel = "Core Platform Modules",
  moduleDescription = "Community feed, forums, events, and member actions",
  integrationLabel = "Connected Apps & Store",
  integrationDescription = "Shopify orders, retail checkouts, and external webhooks",
}: PolarisOriginPickerProps) {
  if (integrationsCount === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onSelect("MODULE")}
        className={cn(
          "flex items-start gap-2.5 p-3 rounded-[6px] border text-left transition-all cursor-pointer",
          sourceType === "MODULE"
            ? "border-[#303030] bg-[#f6f6f7] dark:border-zinc-100 dark:bg-zinc-800 ring-1 ring-[#303030] dark:ring-zinc-100 shadow-xs"
            : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#aeb4b9]",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <div
          className={cn(
            "p-1.5 rounded-[5px] shrink-0 border",
            sourceType === "MODULE"
              ? "bg-[#303030] text-white border-[#303030] dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
              : "bg-[#f6f6f7] text-[#616161] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700",
          )}
        >
          <Layers className="h-3.5 w-3.5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] font-semibold text-[#303030] dark:text-zinc-100">
              {moduleLabel}
            </span>
            <Badge
              variant="outline"
              className="text-[9.5px] h-3.5 px-1 font-bold bg-white dark:bg-zinc-900 text-[#616161] border-[#d2d5d9] rounded-[3px]"
            >
              {modulesCount}
            </Badge>
          </div>
          <p className="text-[11px] text-[#616161] dark:text-zinc-400 mt-0.5 leading-[15px]">
            {moduleDescription}
          </p>
        </div>
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onSelect("INTEGRATION")}
        className={cn(
          "flex items-start gap-2.5 p-3 rounded-[6px] border text-left transition-all cursor-pointer",
          sourceType === "INTEGRATION"
            ? "border-[#303030] bg-[#f6f6f7] dark:border-zinc-100 dark:bg-zinc-800 ring-1 ring-[#303030] dark:ring-zinc-100 shadow-xs"
            : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#aeb4b9]",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <div
          className={cn(
            "p-1.5 rounded-[5px] shrink-0 border",
            sourceType === "INTEGRATION"
              ? "bg-[#303030] text-white border-[#303030] dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
              : "bg-[#f6f6f7] text-[#616161] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700",
          )}
        >
          <Boxes className="h-3.5 w-3.5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] font-semibold text-[#303030] dark:text-zinc-100">
              {integrationLabel}
            </span>
            <Badge
              variant="outline"
              className="text-[9.5px] h-3.5 px-1 font-bold bg-white dark:bg-zinc-900 text-[#616161] border-[#d2d5d9] rounded-[3px]"
            >
              {integrationsCount}
            </Badge>
          </div>
          <p className="text-[11px] text-[#616161] dark:text-zinc-400 mt-0.5 leading-[15px]">
            {integrationDescription}
          </p>
        </div>
      </button>
    </div>
  );
}

/* ─── PolarisPresetChips ─── */
export interface PolarisPresetChipsProps {
  presets: number[];
  currentValue?: number;
  value?: number;
  onSelect?: (value: number) => void;
  onChange?: (value: number) => void;
  prefix?: string;
  suffix?: string;
  unit?: string;
  className?: string;
}

export function PolarisPresetChips({
  presets,
  currentValue,
  value,
  onSelect,
  onChange,
  prefix = "+",
  suffix,
  unit,
  className,
}: PolarisPresetChipsProps) {
  const activeValue = currentValue !== undefined ? currentValue : value;
  const handleSelect = onSelect || onChange || (() => {});
  const displaySuffix = suffix ?? unit ?? "";

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {presets.map((preset) => (
        <button
          key={preset}
          type="button"
          onClick={() => handleSelect(preset)}
          className={cn(
            "h-6 px-2 rounded-[5px] text-[11px] font-medium border transition-all cursor-pointer",
            Number(activeValue) === preset
              ? "bg-[#303030] text-white border-[#303030] dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100 font-bold shadow-xs"
              : "bg-[#f6f6f7] dark:bg-zinc-800 border-[#d2d5d9] dark:border-zinc-700 text-[#303030] dark:text-zinc-300 hover:bg-[#e4e5e7] dark:hover:bg-zinc-700",
          )}
        >
          {prefix}
          {preset}
          {displaySuffix}
        </button>
      ))}
    </div>
  );
}

/* ─── PolarisCapInput ─── */
export interface PolarisCapInputProps {
  id: string;
  label: string;
  periodSuffix: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onClear: () => void;
  className?: string;
}

export function PolarisCapInput({
  id,
  label,
  periodSuffix,
  value,
  onChange,
  onBlur,
  onClear,
  className,
}: PolarisCapInputProps) {
  return (
    <div
      className={cn(
        "p-2.5 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-800/40 space-y-1",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-[10px] font-semibold uppercase tracking-wider text-[#616161] dark:text-zinc-400 select-none cursor-pointer"
        >
          {label}
        </label>
        <button
          type="button"
          onClick={onClear}
          className="text-[10px] text-[#616161] hover:text-[#303030] dark:text-zinc-400 dark:hover:text-zinc-200 cursor-pointer font-medium"
        >
          Unlimited
        </button>
      </div>
      <div className="relative">
        <Input
          id={id}
          type="number"
          placeholder="No limit"
          name={id}
          value={value ?? ""}
          onChange={onChange}
          onBlur={onBlur}
          className="h-[32px] bg-[#f6f6f7] dark:bg-zinc-900/50 border-[#d2d5d9] dark:border-zinc-700 text-[12px] font-medium shadow-none rounded-[5px] focus-visible:ring-1 focus-visible:ring-[#005bd3] dark:focus-visible:ring-blue-500 pr-12"
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[#616161] dark:text-zinc-400 font-medium pointer-events-none">
          {periodSuffix}
        </span>
      </div>
    </div>
  );
}

/* ─── PolarisSidebarCard ─── */
interface PolarisSidebarCardProps {
  title: string;
  badge?: string;
  badgeVariant?: "default" | "outline" | "emerald";
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export function PolarisSidebarCard({
  title,
  badge,
  badgeVariant = "outline",
  icon: Icon,
  children,
  className,
}: PolarisSidebarCardProps) {
  return (
    <div
      className={cn(
        "rounded-[10px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-3.5 space-y-2.5",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-[#e1e3e5] dark:border-zinc-800 pb-2">
        <div className="flex items-center gap-1.5">
          {Icon && (
            <Icon className="h-3.5 w-3.5 text-[#616161] dark:text-zinc-400 shrink-0" />
          )}
          <h4 className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100 leading-[16px]">
            {title}
          </h4>
        </div>
        {badge && (
          <Badge
            variant="outline"
            className="bg-[#f6f6f7] dark:bg-zinc-800 text-[#303030] dark:text-zinc-200 border-[#d2d5d9] dark:border-zinc-700 text-[10px] font-semibold px-1.5 py-0.2 rounded-[4px]"
          >
            {badge}
          </Badge>
        )}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

/* ─── PolarisSummaryRow ─── */
interface PolarisSummaryRowProps {
  label: string;
  value: React.ReactNode;
  isLast?: boolean;
  highlight?: boolean;
  className?: string;
}

export function PolarisSummaryRow({
  label,
  value,
  isLast = false,
  highlight = false,
  className,
}: PolarisSummaryRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between py-1 text-[11.5px]",
        !isLast && "border-b border-[#f1f2f3] dark:border-zinc-800/80",
        className,
      )}
    >
      <span className="text-[#616161] dark:text-zinc-400 font-medium">
        {label}
      </span>
      <span
        className={cn(
          "font-semibold text-[#303030] dark:text-zinc-100 text-right truncate max-w-[170px]",
          highlight && "text-emerald-700 dark:text-emerald-400",
        )}
      >
        {value}
      </span>
    </div>
  );
}

/* ─── PolarisTipCard ─── */
interface PolarisTipCardProps {
  title?: string;
  icon?: LucideIcon;
  tips?: string[];
  children?: React.ReactNode;
  className?: string;
}

export function PolarisTipCard({
  title = "Configuration Tip",
  icon: Icon = Info,
  tips,
  children,
  className,
}: PolarisTipCardProps) {
  return (
    <div
      className={cn(
        "rounded-[10px] border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-3",
        className,
      )}
    >
      <div className="flex items-start gap-2">
        <Icon className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <div>
          <h4 className="text-[12px] font-semibold text-amber-800 dark:text-amber-300 leading-[16px]">
            {title}
          </h4>
          {children && (
            <div className="text-[11.5px] text-amber-700 dark:text-amber-400 mt-0.5 leading-[16px]">
              {children}
            </div>
          )}
          {tips && tips.length > 0 && (
            <ul className="list-disc pl-3.5 space-y-0.5 mt-1 text-[11px] text-amber-700 dark:text-amber-400">
              {tips.map((t, idx) => (
                <li key={idx}>{t}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── PolarisFormLayout ─── */
interface PolarisFormLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

export function PolarisFormLayout({
  children,
  sidebar,
  className,
}: PolarisFormLayoutProps) {
  return (
    <div
      className={cn(
        "max-w-[1280px] mx-auto w-full px-0 sm:px-0 py-2 space-y-3.5 pb-28",
        className,
      )}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start relative">
        <div className="lg:col-span-8 space-y-3.5 min-w-0">{children}</div>
        {sidebar && (
          <div className="lg:col-span-4 space-y-3.5 self-start sticky top-6 z-20">
            {sidebar}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── getSourceIcon helper ─── */
export function getSourceIcon(name?: string, type?: string) {
  const lower = (name || "").toLowerCase();
  if (
    lower.includes("shopify") ||
    lower.includes("store") ||
    lower.includes("order")
  ) {
    return (
      <ShoppingBag className="h-3.5 w-3.5 text-[#303030] dark:text-zinc-100" />
    );
  }
  if (lower.includes("feed") || lower.includes("post")) {
    return (
      <MessageSquare className="h-3.5 w-3.5 text-[#303030] dark:text-zinc-100" />
    );
  }
  if (
    lower.includes("member") ||
    lower.includes("community") ||
    lower.includes("user")
  ) {
    return <Users className="h-3.5 w-3.5 text-[#303030] dark:text-zinc-100" />;
  }
  if (lower.includes("event")) {
    return (
      <Calendar className="h-3.5 w-3.5 text-[#303030] dark:text-zinc-100" />
    );
  }
  if (type === "Integration") {
    return <Boxes className="h-3.5 w-3.5 text-[#303030] dark:text-zinc-100" />;
  }
  return <Layers className="h-3.5 w-3.5 text-[#616161] dark:text-zinc-400" />;
}

export { PolarisEligibilityCard, toArray } from "./polaris-eligibility-card";

/* ─── Primitives Re-Exports ─── */
export {
  PolarisCard,
  PolarisLabel,
  PolarisInput,
  PolarisTextarea,
  PolarisSelect,
  PolarisMultiSelect,
  PolarisCombobox,
  PolarisFormSkeleton,
} from "@/components/ui/platform/polaris-primitives";
export type {
  PolarisCardProps,
  PolarisLabelProps,
  PolarisInputProps,
  PolarisTextareaProps,
  PolarisSelectProps,
  PolarisMultiSelectProps,
  PolarisComboboxProps,
  PolarisFormSkeletonProps,
} from "@/components/ui/platform/polaris-primitives";
