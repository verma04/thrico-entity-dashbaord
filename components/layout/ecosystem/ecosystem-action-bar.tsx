"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { CtaButton } from "@/components/ui/cta-button";

interface EcosystemActionBarProps {
  children: React.ReactNode;
  className?: string;
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
}

/**
 * EcosystemActionBar
 * Clean, minimal toolbar for filters, actions, and status indicators.
 * Uses theme-aware CSS variables for light/dark mode support.
 */
export function EcosystemActionBar({
  children,
  className,
  shadow = "sm",
}: EcosystemActionBarProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col sm:flex-row sm:items-center gap-2 w-full",
        "px-3 py-2 bg-white dark:bg-transparent border-b border-border/60",
        shadow !== "none" && "shadow-2xs",
        className,
      )}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Group Component
// ---------------------------------------------------------------------------
export function EcosystemActionBarGroup({
  children,
  className,
  align = "left",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 min-w-0",
        align === "right" && "sm:ml-auto justify-end",
        align === "center" && "justify-center mx-auto",
        className,
      )}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Separator Component
// ---------------------------------------------------------------------------
export function EcosystemActionBarSeparator({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "hidden sm:block w-px h-5 bg-border mx-0.5 shrink-0",
        className,
      )}
    />
  );
}

// ---------------------------------------------------------------------------
// Item Component
// ---------------------------------------------------------------------------
export function EcosystemActionBarItem({
  children,
  className,
  grow,
}: {
  children: React.ReactNode;
  className?: string;
  grow?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5",
        grow ? "flex-1 min-w-0" : "shrink-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Status Component
// ---------------------------------------------------------------------------
export function EcosystemActionBarStatus({
  children,
  active = true,
  className,
}: {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 h-8 px-2.5 bg-muted border border-border rounded-md text-[10px] uppercase font-bold tracking-wider text-muted-foreground whitespace-nowrap",
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full shrink-0",
          active ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/30",
        )}
      />
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Search Component
// ---------------------------------------------------------------------------
export function EcosystemActionBarSearch({
  value,
  onChange,
  placeholder = "Search...",
  className,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative w-full group", className)}>
      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
        <Search className="h-3.5 w-3.5 text-muted-foreground/60 group-focus-within:text-foreground transition-colors" />
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-8 h-8 bg-background border-border rounded-md text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/20 transition-all shadow-2xs"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// ViewToggle Component
// ---------------------------------------------------------------------------
export interface EcosystemViewOption {
  id: string;
  label?: string;
  icon: React.ElementType;
}

export function EcosystemActionBarViewToggle({
  value,
  onChange,
  options,
  compact = false,
}: {
  value: string;
  onChange: (val: string) => void;
  options: EcosystemViewOption[];
  compact?: boolean;
}) {
  return (
    <Tabs
      value={value}
      onValueChange={onChange}
      className="bg-muted p-0.5 rounded-md border border-border shrink-0 h-8 flex items-center"
    >
      <TabsList className="bg-transparent border-none h-full p-0 gap-0.5 items-center">
        {options.map((opt) => {
          const Icon = opt.icon;
          return (
            <TabsTrigger
              key={opt.id}
              value={opt.id}
              className={cn(
                "h-6.5 rounded data-[state=active]:bg-card data-[state=active]:shadow-2xs data-[state=active]:text-foreground text-muted-foreground transition-all text-[11px] font-medium flex items-center justify-center",
                compact ? "w-6.5 px-0" : "px-2.5 gap-1.5",
              )}
              title={compact ? opt.label : undefined}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              {!compact && opt.label}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}

// ---------------------------------------------------------------------------
// Select Component
// ---------------------------------------------------------------------------
export interface EcosystemSelectOption {
  value: string;
  label: string;
  dot?: string;
  icon?: React.ElementType;
}

export function EcosystemActionBarSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  className,
}: {
  value: string;
  onValueChange: (val: string) => void;
  options: EcosystemSelectOption[];
  placeholder?: string;
  className?: string;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={cn(
          "w-auto min-w-[130px] h-8 px-2.5 rounded-md border-border bg-background text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring transition-all whitespace-nowrap gap-1.5",
          className,
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[150px]">
        {options.map((opt) => (
          <SelectItem
            key={opt.value}
            value={opt.value}
            className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer focus:bg-accent focus:text-accent-foreground"
          >
            <div className="flex items-center gap-1.5">
              {opt.dot && (
                <span
                  className={cn("h-1.5 w-1.5 rounded-full shrink-0", opt.dot)}
                />
              )}
              {opt.icon && (
                <opt.icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              )}
              {opt.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ---------------------------------------------------------------------------
// Action Bar Sub-components Attachment
// ---------------------------------------------------------------------------

EcosystemActionBar.Group = EcosystemActionBarGroup;
EcosystemActionBar.Separator = EcosystemActionBarSeparator;
EcosystemActionBar.Item = EcosystemActionBarItem;
EcosystemActionBar.Status = EcosystemActionBarStatus;
EcosystemActionBar.Search = EcosystemActionBarSearch;
EcosystemActionBar.ViewToggle = EcosystemActionBarViewToggle;
EcosystemActionBar.Select = EcosystemActionBarSelect;
EcosystemActionBar.ThemeToggle = ThemeToggle;
EcosystemActionBar.CtaButton = CtaButton;
