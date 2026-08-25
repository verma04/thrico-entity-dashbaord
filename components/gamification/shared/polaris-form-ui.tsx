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
        <p className="text-[12.5px] text-[#616161] dark:text-zinc-400">
          {description}
        </p>
        {tips && tips.length > 0 && (
          <ul className="list-disc pl-4 space-y-1 mt-1 text-[12px] text-[#616161] dark:text-zinc-400">
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onSelect("MODULE")}
        className={cn(
          "flex items-start gap-3 p-3.5 rounded-[8px] border text-left transition-all cursor-pointer",
          sourceType === "MODULE"
            ? "border-[#303030] bg-[#f6f6f7] dark:border-zinc-100 dark:bg-zinc-800 ring-1 ring-[#303030] dark:ring-zinc-100 shadow-xs"
            : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#aeb4b9]",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <div
          className={cn(
            "p-2 rounded-[6px] shrink-0 border",
            sourceType === "MODULE"
              ? "bg-[#303030] text-white border-[#303030] dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
              : "bg-[#f6f6f7] text-[#616161] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700",
          )}
        >
          <Layers className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] font-semibold text-[#303030] dark:text-zinc-100">
              {moduleLabel}
            </span>
            <Badge
              variant="outline"
              className="text-[10px] h-4 px-1.5 font-bold bg-white dark:bg-zinc-900 text-[#616161] border-[#d2d5d9] rounded-[4px]"
            >
              {modulesCount}
            </Badge>
          </div>
          <p className="text-[11.5px] text-[#616161] dark:text-zinc-400 mt-0.5 leading-[16px]">
            {moduleDescription}
          </p>
        </div>
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onSelect("INTEGRATION")}
        className={cn(
          "flex items-start gap-3 p-3.5 rounded-[8px] border text-left transition-all cursor-pointer",
          sourceType === "INTEGRATION"
            ? "border-[#303030] bg-[#f6f6f7] dark:border-zinc-100 dark:bg-zinc-800 ring-1 ring-[#303030] dark:ring-zinc-100 shadow-xs"
            : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#aeb4b9]",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <div
          className={cn(
            "p-2 rounded-[6px] shrink-0 border",
            sourceType === "INTEGRATION"
              ? "bg-[#303030] text-white border-[#303030] dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
              : "bg-[#f6f6f7] text-[#616161] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700",
          )}
        >
          <Boxes className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] font-semibold text-[#303030] dark:text-zinc-100">
              {integrationLabel}
            </span>
            <Badge
              variant="outline"
              className="text-[10px] h-4 px-1.5 font-bold bg-white dark:bg-zinc-900 text-[#616161] border-[#d2d5d9] rounded-[4px]"
            >
              {integrationsCount}
            </Badge>
          </div>
          <p className="text-[11.5px] text-[#616161] dark:text-zinc-400 mt-0.5 leading-[16px]">
            {integrationDescription}
          </p>
        </div>
      </button>
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
        "rounded-[12px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-4 space-y-3",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-[#e1e3e5] dark:border-zinc-800 pb-2.5">
        <div className="flex items-center gap-2">
          {Icon && (
            <Icon className="h-4 w-4 text-[#616161] dark:text-zinc-400 shrink-0" />
          )}
          <h4 className="text-[13.5px] font-semibold text-[#303030] dark:text-zinc-100 leading-[18px]">
            {title}
          </h4>
        </div>
        {badge && (
          <Badge
            variant="outline"
            className="bg-[#f6f6f7] dark:bg-zinc-800 text-[#303030] dark:text-zinc-200 border-[#d2d5d9] dark:border-zinc-700 text-[10.5px] font-semibold px-2 py-0.5 rounded-[4px]"
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
        "flex items-center justify-between py-1.5 text-[12.5px]",
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
          {children && (
            <div className="text-[12.5px] text-amber-700 dark:text-amber-400 mt-1 leading-[18px]">
              {children}
            </div>
          )}
          {tips && tips.length > 0 && (
            <ul className="list-disc pl-4 space-y-1 mt-1 text-[12px] text-amber-700 dark:text-amber-400">
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
    return (
      <ShoppingBag className="h-4 w-4 text-[#303030] dark:text-zinc-100" />
    );
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

/* ─── Primitives Re-Exports ─── */
export {
  PolarisCard,
  PolarisLabel,
  PolarisInput,
  PolarisTextarea,
  PolarisSelect,
  PolarisFormSkeleton,
} from "@/components/ui/platform/polaris-primitives";
export type {
  PolarisCardProps,
  PolarisLabelProps,
  PolarisInputProps,
  PolarisTextareaProps,
  PolarisSelectProps,
  PolarisFormSkeletonProps,
} from "@/components/ui/platform/polaris-primitives";
