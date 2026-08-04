"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
        "p-3 bg-white ",
        shadow !== "none" && "shadow-sm",
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
        "flex items-center gap-2 min-w-0",
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
        "hidden sm:block w-px h-6 bg-border mx-0.5 shrink-0",
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
    <div className={cn("flex items-center gap-2", grow && "flex-1", className)}>
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
        "flex items-center gap-1.5 px-2.5 py-1.5 bg-muted border border-border rounded-lg text-[10px] uppercase font-bold tracking-wider text-muted-foreground whitespace-nowrap",
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
        className="pl-8 h-6 bg-muted border-border rounded-md text-[11px] text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring/20 transition-all"
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
      className="bg-muted p-0.5 rounded-lg border border-border shrink-0"
    >
      <TabsList className="bg-transparent border-none h-auto p-0 gap-0.5">
        {options.map((opt) => {
          const Icon = opt.icon;
          return (
            <TabsTrigger
              key={opt.id}
              value={opt.id}
              className={cn(
                "h-5 rounded-[4px] data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all text-[11px] font-medium flex items-center justify-center",
                compact ? "w-6 px-0" : "px-2.5 gap-1.5",
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
  const currentOption = options.find((opt) => opt.value === value);

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={cn(
          "w-[120px] h-6 px-2.5 rounded-md border-border bg-muted text-[11px] font-medium text-foreground shadow-none focus:ring-2 focus:ring-ring/20 transition-all",
          className,
        )}
      >
        <div className="flex items-center gap-1.5 truncate">
          {currentOption?.dot && (
            <span
              className={cn("h-1.5 w-1.5 rounded-full shrink-0", currentOption.dot)}
            />
          )}
          {currentOption?.icon && (
            <currentOption.icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          )}
          <span className="truncate">
            <SelectValue placeholder={placeholder} />
          </span>
        </div>
      </SelectTrigger>
      <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[120px]">
        {options.map((opt) => (
          <SelectItem
            key={opt.value}
            value={opt.value}
            className="rounded-md text-[11px] font-medium py-1.5 px-2 cursor-pointer focus:bg-accent focus:text-accent-foreground"
          >
            <div className="flex items-center gap-1.5">
              {opt.dot && (
                <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", opt.dot)} />
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
