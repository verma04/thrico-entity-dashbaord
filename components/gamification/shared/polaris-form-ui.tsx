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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ─── PolarisFormCard ─── */
interface PolarisFormCardProps {
  step?: number;
  icon?: LucideIcon;
  title: string;
  description: string;
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
    <Card
      className={cn(
        "border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm rounded-lg overflow-hidden",
        className,
      )}
    >
      <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/80 px-4 py-3 bg-zinc-50/50 dark:bg-zinc-900/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {step !== undefined && (
              <div className="h-5 w-5 rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center font-bold text-[11px] shadow-xs">
                {step}
              </div>
            )}
            {Icon && !step && (
              <div className="h-6 w-6 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 flex items-center justify-center">
                <Icon className="h-3.5 w-3.5" />
              </div>
            )}
            <div>
              <CardTitle className="text-xs font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {title}
              </CardTitle>
              {description && (
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {description}
                </p>
              )}
            </div>
          </div>
          {badge && (
            <Badge
              variant="outline"
              className="bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 text-[10px] font-bold"
            >
              {badge}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">{children}</CardContent>
    </Card>
  );
}

/* ─── PolarisInfoBanner ─── */
interface PolarisInfoBannerProps {
  title?: string;
  description: string;
  icon?: LucideIcon;
}

export function PolarisInfoBanner({
  title,
  description,
  icon: Icon = Info,
}: PolarisInfoBannerProps) {
  return (
    <div className="flex items-start gap-2.5 p-3 rounded-lg bg-zinc-50/80 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-300">
      <Icon className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-100 mt-0.5 shrink-0" />
      <div className="space-y-0.5 leading-relaxed">
        {title && (
          <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">
            {title}
          </p>
        )}
        <p className="text-[11px]">{description}</p>
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
    <div className="space-y-2">
      <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
        Origin Channel
      </Label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Platform Module Option */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSelect("MODULE")}
          className={cn(
            "relative flex items-start gap-3 p-3 rounded-lg border text-left transition-all cursor-pointer",
            sourceType === "MODULE"
              ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900/[0.04] dark:bg-zinc-100/10 ring-2 ring-zinc-900/20 dark:ring-zinc-100/20 shadow-xs"
              : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 hover:border-zinc-300 dark:hover:border-zinc-700",
            disabled && "opacity-60 cursor-not-allowed",
          )}
        >
          <div
            className={cn(
              "h-7 w-7 rounded-md flex items-center justify-center shrink-0 border transition-colors",
              sourceType === "MODULE"
                ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700",
            )}
          >
            <Layers className="h-3.5 w-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                {moduleLabel}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                {modulesCount} Active
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
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
            "relative flex items-start gap-3 p-3 rounded-lg border text-left transition-all cursor-pointer",
            sourceType === "INTEGRATION"
              ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900/[0.04] dark:bg-zinc-100/10 ring-2 ring-zinc-900/20 dark:ring-zinc-100/20 shadow-xs"
              : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 hover:border-zinc-300 dark:hover:border-zinc-700",
            disabled && "opacity-60 cursor-not-allowed",
          )}
        >
          <div
            className={cn(
              "h-7 w-7 rounded-md flex items-center justify-center shrink-0 border transition-colors",
              sourceType === "INTEGRATION"
                ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700",
            )}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                {integrationLabel}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                {integrationsCount} Apps
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
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
}

export function PolarisPresetChips({
  presets,
  currentValue,
  onSelect,
  prefix = "+",
}: PolarisPresetChipsProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {presets.map((preset) => (
        <button
          key={preset}
          type="button"
          onClick={() => onSelect(preset)}
          className={cn(
            "h-7 px-2.5 rounded-md text-xs font-medium border transition-all cursor-pointer",
            Number(currentValue) === preset
              ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 font-bold shadow-xs"
              : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700",
          )}
        >
          {prefix}
          {preset}
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
    <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/40 space-y-1.5">
      <div className="flex items-center justify-between">
        <Label
          htmlFor={id}
          className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
        >
          {label}
        </Label>
        <button
          type="button"
          onClick={onClear}
          className="text-[10px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
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
          className="h-8 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-700 text-xs font-medium shadow-none"
        />
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 font-medium">
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
        "flex items-center justify-between py-1 text-xs",
        !isLast && "border-b border-zinc-100 dark:border-zinc-800",
      )}
    >
      <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
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
  icon: Icon = Sparkles,
  children,
  className,
}: PolarisSidebarCardProps) {
  return (
    <Card
      className={cn(
        "border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm rounded-lg overflow-hidden",
        className,
      )}
    >
      <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/80 px-4 py-2.5 bg-zinc-50/50 dark:bg-zinc-900/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-100" />
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
              {title}
            </CardTitle>
          </div>
          {badge && (
            <Badge
              variant="outline"
              className="bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700 text-[10px] font-bold"
            >
              {badge}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">{children}</CardContent>
    </Card>
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
  icon: Icon = TrendingUp,
  children,
  className,
}: PolarisTipCardProps) {
  return (
    <Card
      className={cn(
        "border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 rounded-lg overflow-hidden",
        className,
      )}
    >
      <CardHeader className="p-3 pb-1.5">
        <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
          <Icon className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-100" />
          <CardTitle className="text-xs font-semibold uppercase tracking-wider">
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {children}
        </div>
      </CardContent>
    </Card>
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
        "max-w-[1040px] mx-auto w-full px-4 sm:px-6 py-5 space-y-6 pb-24",
        className,
      )}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">{children}</div>
        {sidebar && (
          <div className="lg:col-span-4 space-y-4">
            <div className="sticky top-20 space-y-4">{sidebar}</div>
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
    return <ShoppingBag className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />;
  }
  if (lower.includes("feed") || lower.includes("post")) {
    return (
      <MessageSquare className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
    );
  }
  if (
    lower.includes("member") ||
    lower.includes("community") ||
    lower.includes("user")
  ) {
    return <Users className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />;
  }
  if (lower.includes("event")) {
    return <Calendar className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />;
  }
  if (type === "Integration") {
    return <Boxes className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />;
  }
  return <Layers className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />;
}
