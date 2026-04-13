"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EcosystemHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  badgeText?: string;
  breadcrumb?: string;
  showLiveIndicator?: boolean;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  iconClassName?: string;
  className?: string;
  dark?: boolean;
}

export function EcosystemHeader({
  title,
  description,
  icon: Icon,
  badgeText = "Ecosystem Hub",
  breadcrumb: _breadcrumb,
  showLiveIndicator = true,
  actions,
  children,
  iconClassName,
  className,
  dark = false,
}: EcosystemHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1",
        className,
      )}
    >
      {/* Left: Icon + Text */}
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Icon */}
        <div className="relative shrink-0">
          <div
            className={cn(
              "h-10 w-10 rounded-xl flex items-center justify-center border transition-colors",
              dark
                ? "bg-foreground/10 text-foreground border-foreground/15"
                : "bg-primary text-primary-foreground border-primary/20",
              iconClassName,
            )}
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </div>
          {showLiveIndicator && (
            <span
              className={cn(
                "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2",
                "border-background"
              )}
            >
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-30" />
            </span>
          )}
        </div>

        {/* Title + Badge + Description */}
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1
              className={cn(
                "text-lg font-semibold tracking-tight leading-none",
                dark ? "text-white" : "text-foreground"
              )}
            >
              {title}
            </h1>
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-medium leading-none",
                dark
                  ? "bg-foreground/5 border-foreground/15 text-muted-foreground"
                  : "bg-muted border-border text-muted-foreground"
              )}
            >
              {badgeText}
            </span>
          </div>
          <p
            className={cn(
              "mt-1 text-[13px] leading-relaxed truncate max-w-md",
              dark ? "text-muted-foreground" : "text-muted-foreground"
            )}
          >
            {description}
          </p>
        </div>
      </div>

      {/* Right: Children + Actions */}
      {(children || actions) && (
        <div className="flex items-center gap-2 shrink-0">
          {children}
          {actions && (
            <div className="flex items-center gap-2">{actions}</div>
          )}
        </div>
      )}
    </div>
  );
}
