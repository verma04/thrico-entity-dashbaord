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
        "rounded-[12px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-4 transition-all duration-150",
        className,
      )}
    >
      <div className="mb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {Icon && (
              <Icon className="h-4 w-4 text-[#616161] dark:text-zinc-400 shrink-0" />
            )}
            <h3 className="text-[14px] font-semibold text-[#303030] dark:text-zinc-100 leading-[20px]">
              {title}
            </h3>
            {badge && (
              <Badge
                variant="outline"
                className="bg-[#f6f6f7] dark:bg-zinc-800 text-[#303030] dark:text-zinc-200 border-[#d2d5d9] dark:border-zinc-700 text-[11px] font-medium px-2 py-0.5 rounded-[6px]"
              >
                {badge}
              </Badge>
            )}
          </div>
        </div>
        {description && (
          <p className="text-[12.5px] text-[#616161] dark:text-zinc-400 mt-1 leading-[18px]">
            {description}
          </p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

/* ─── PolarisInfoBanner ─── */
interface PolarisInfoBannerProps {
  title?: string;
  description: string;
  icon?: LucideIcon;
  className?: string;
}

export function PolarisInfoBanner({
  title,
  description,
  icon: Icon = Info,
  className,
}: PolarisInfoBannerProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 p-3 rounded-[8px] bg-[#f6f6f7] dark:bg-zinc-800/50 border border-[#d2d5d9] dark:border-zinc-700 text-[12.5px] text-[#616161] dark:text-zinc-300",
        className,
      )}
    >
      <Icon className="h-4 w-4 text-[#616161] dark:text-zinc-400 mt-0.5 shrink-0" />
      <div className="space-y-0.5 leading-[18px]">
        {title && (
          <p className="font-semibold text-[#303030] dark:text-zinc-100 text-[13px]">
            {title}
          </p>
        )}
        <p className="text-[12.5px] text-[#616161] dark:text-zinc-400">{description}</p>
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
    <div className="space-y-1.5">
      <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none">
        Origin Channel
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Platform Module Option */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelect("MODULE")}
          className={cn(
            "relative flex items-start gap-3 p-3.5 rounded-[8px] border text-left transition-all cursor-pointer",
            sourceType === "MODULE"
              ? "border-[#005bd3] dark:border-blue-500 ring-1 ring-[#005bd3] dark:ring-blue-500 bg-blue-50/20 dark:bg-blue-950/20"
              : "border-[#aeb4b9] dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-[#8c9196] dark:hover:border-zinc-600",
            disabled && "opacity-60 cursor-not-allowed",
          )}
        >
          <div
            className={cn(
              "h-8 w-8 rounded-[6px] flex items-center justify-center shrink-0 border transition-colors",
              sourceType === "MODULE"
                ? "bg-[#303030] text-white border-[#303030] dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                : "bg-[#f6f6f7] dark:bg-zinc-800 text-[#616161] dark:text-zinc-400 border-[#d2d5d9] dark:border-zinc-700",
            )}
          >
            <Layers className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[13.5px] font-semibold text-[#303030] dark:text-zinc-100">
                {moduleLabel}
              </span>
              <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-[4px] bg-[#e4e5e7] dark:bg-zinc-800 text-[#616161] dark:text-zinc-400">
                {modulesCount} Active
              </span>
            </div>
            <p className="text-[12px] text-[#616161] dark:text-zinc-400 mt-0.5 leading-[16px]">
              {moduleDescription}
            </p>
          </div>
        </button>

        {/* Third-party Integration Option */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelect("INTEGRATION")}
          className={cn(
            "relative flex items-start gap-3 p-3.5 rounded-[8px] border text-left transition-all cursor-pointer",
            sourceType === "INTEGRATION"
              ? "border-[#005bd3] dark:border-blue-500 ring-1 ring-[#005bd3] dark:ring-blue-500 bg-blue-50/20 dark:bg-blue-950/20"
              : "border-[#aeb4b9] dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-[#8c9196] dark:hover:border-zinc-600",
            disabled && "opacity-60 cursor-not-allowed",
          )}
        >
          <div
            className={cn(
              "h-8 w-8 rounded-[6px] flex items-center justify-center shrink-0 border transition-colors",
              sourceType === "INTEGRATION"
                ? "bg-[#303030] text-white border-[#303030] dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                : "bg-[#f6f6f7] dark:bg-zinc-800 text-[#616161] dark:text-zinc-400 border-[#d2d5d9] dark:border-zinc-700",
            )}
          >
            <ShoppingBag className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[13.5px] font-semibold text-[#303030] dark:text-zinc-100">
                {integrationLabel}
              </span>
              <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-[4px] bg-[#e4e5e7] dark:bg-zinc-800 text-[#616161] dark:text-zinc-400">
                {integrationsCount} Apps
              </span>
            </div>
            <p className="text-[12px] text-[#616161] dark:text-zinc-400 mt-0.5 leading-[16px]">
              {integrationDescription}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}

/* ─── PolarisPresetChips ─── */
interface PolarisPresetChipsProps {
  presets: number[];
  currentValue: number;
  onSelect: (value: number) => void;
  prefix?: string;
  suffix?: string;
}

export function PolarisPresetChips({
  presets,
  currentValue,
  onSelect,
  prefix = "+",
  suffix = "",
}: PolarisPresetChipsProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {presets.map((preset) => (
        <button
          key={preset}
          type="button"
          onClick={() => onSelect(preset)}
          className={cn(
            "h-[32px] px-3 rounded-[6px] text-[13px] font-medium border transition-all cursor-pointer",
            Number(currentValue) === preset
              ? "bg-[#303030] text-white border-[#303030] dark:bg-zinc-100 dark:text-zinc-900 shadow-xs font-semibold"
              : "bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-300 hover:border-[#8c9196] dark:hover:border-zinc-600",
          )}
        >
          {prefix}
          {preset}
          {suffix}
        </button>
      ))}
    </div>
  );
}

/* ─── PolarisCapInput ─── */
interface PolarisCapInputProps {
  id: string;
  label: string;
  periodSuffix: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

export function PolarisCapInput({
  id,
  label,
  periodSuffix,
  value,
  onChange,
  onBlur,
  onClear,
}: PolarisCapInputProps) {
  return (
    <div className="p-3 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-[13px] font-medium text-[#303030] dark:text-zinc-200"
        >
          {label}
        </label>
        <button
          type="button"
          onClick={onClear}
          className="text-[11px] font-medium text-[#005bd3] dark:text-blue-400 hover:underline cursor-pointer"
        >
          Unlimited
        </button>
      </div>
      <div className="relative">
        <input
          id={id}
          type="number"
          placeholder="No limit"
          name={id}
          value={value ?? ""}
          onChange={onChange}
          onBlur={onBlur}
          className="w-full h-[40px] pl-3 pr-16 text-[14px] text-[#303030] dark:text-zinc-100 bg-white dark:bg-zinc-900 border border-[#aeb4b9] dark:border-zinc-700 rounded-[8px] transition-all outline-none placeholder:text-[#8c9196] focus:border-[#005bd3] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#005bd3] dark:focus:ring-blue-500"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[#616161] dark:text-zinc-400 font-medium pointer-events-none">
          {periodSuffix}
        </span>
      </div>
    </div>
  );
}

/* ─── PolarisSummaryRow ─── */
interface PolarisSummaryRowProps {
  label: string;
  value: React.ReactNode;
  isLast?: boolean;
}

export function PolarisSummaryRow({
  label,
  value,
  isLast,
}: PolarisSummaryRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between py-1 text-[12.5px]",
        !isLast && "border-b border-[#e1e3e5] dark:border-zinc-800 pb-1.5",
      )}
    >
      <span className="text-[#616161] dark:text-zinc-400 font-medium">{label}</span>
      <span className="font-medium text-[#303030] dark:text-zinc-200">
        {value}
      </span>
    </div>
  );
}

/* ─── PolarisSidebarCard ─── */
interface PolarisSidebarCardProps {
  title: string;
  badge?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export function PolarisSidebarCard({
  title,
  badge,
  icon: Icon,
  children,
  className,
}: PolarisSidebarCardProps) {
  return (
    <div
      className={cn(
        "rounded-[12px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-4 transition-all duration-150",
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {Icon && (
            <Icon className="h-4 w-4 text-[#616161] dark:text-zinc-400 shrink-0" />
          )}
          <h3 className="text-[14px] font-semibold text-[#303030] dark:text-zinc-100 leading-[20px]">
            {title}
          </h3>
        </div>
        {badge && (
          <Badge
            variant="outline"
            className="bg-[#f6f6f7] dark:bg-zinc-800 text-[#303030] dark:text-zinc-200 border-[#d2d5d9] dark:border-zinc-700 text-[11px] font-medium px-2 py-0.5 rounded-[6px]"
          >
            {badge}
          </Badge>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

/* ─── PolarisTipCard ─── */
interface PolarisTipCardProps {
  title?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export function PolarisTipCard({
  title = "Merchant Economy Tip",
  icon: Icon = Info,
  children,
  className,
}: PolarisTipCardProps) {
  return (
    <div
      className={cn(
        "rounded-[12px] border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-4",
        className,
      )}
    >
      <div className="flex items-start gap-2">
        <Icon className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <div>
          <h4 className="text-[13px] font-semibold text-amber-800 dark:text-amber-300 leading-[18px]">
            {title}
          </h4>
          <p className="text-[12.5px] text-amber-700 dark:text-amber-400 mt-1 leading-[18px]">
            {children}
          </p>
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
        "max-w-[1280px] mx-auto w-full px-0 sm:px-0 py-2 space-y-4 pb-28",
        className,
      )}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start relative">
        <div className="lg:col-span-8 space-y-4 min-w-0">{children}</div>
        {sidebar && (
          <div className="lg:col-span-4 space-y-4 self-start sticky top-6 z-20">
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
    return <ShoppingBag className="h-4 w-4 text-[#303030] dark:text-zinc-100" />;
  }
  if (lower.includes("feed") || lower.includes("post")) {
    return (
      <MessageSquare className="h-4 w-4 text-[#303030] dark:text-zinc-100" />
    );
  }
  if (
    lower.includes("member") ||
    lower.includes("community") ||
    lower.includes("user")
  ) {
    return <Users className="h-4 w-4 text-[#303030] dark:text-zinc-100" />;
  }
  if (lower.includes("event")) {
    return <Calendar className="h-4 w-4 text-[#303030] dark:text-zinc-100" />;
  }
  if (type === "Integration") {
    return <Boxes className="h-4 w-4 text-[#303030] dark:text-zinc-100" />;
  }
  return <Layers className="h-4 w-4 text-[#616161] dark:text-zinc-400" />;
}

export { PolarisEligibilityCard, toArray } from "./polaris-eligibility-card";
