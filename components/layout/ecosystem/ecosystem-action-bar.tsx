"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

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
        "px-3 py-2 rounded-xl bg-card border border-border",
        shadow !== "none" && "shadow-sm",
        className
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
        className
      )}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Separator Component
// ---------------------------------------------------------------------------
export function EcosystemActionBarSeparator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "hidden sm:block w-px h-6 bg-border mx-0.5 shrink-0",
        className
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
        "flex items-center gap-2 px-3 py-1.5 bg-muted border border-border rounded-lg text-[11px] font-medium text-muted-foreground whitespace-nowrap",
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full shrink-0",
          active ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/30"
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
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground/60 group-focus-within:text-foreground transition-colors" />
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 h-9 bg-muted border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-ring/20 transition-all"
      />
    </div>
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
