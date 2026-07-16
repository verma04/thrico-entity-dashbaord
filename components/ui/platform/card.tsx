"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PlatformCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  title?: string;
  description?: string;
  icon?: React.ElementType;
}

export function PlatformCard({
  children,
  className,
  padding = "md",
  title,
  description,
  icon: Icon,
}: PlatformCardProps) {
  const paddingStyles = {
    none: "p-0",
    sm: "p-3",
    md: "p-5",
    lg: "p-8",
  };

  return (
    <div
      className={cn(
        "rounded-[14px] border border-border/50 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-200",
        paddingStyles[padding],
        className
      )}
    >
      {(title || Icon) && (
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
          {Icon && (
            <div className="h-8 w-8 rounded-lg bg-muted/50 border border-border flex items-center justify-center text-foreground shrink-0">
              <Icon size={16} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            {title && (
              <h3 className="text-sm font-semibold text-foreground tracking-tight leading-none">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-[11px] text-muted-foreground font-medium mt-1">
                {description}
              </p>
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}


export function PlatformSection({
  title,
  description,
  children,
  className,
  actions,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground tracking-tight">
            {title}
          </h3>
          {description && (
            <p className="text-[12px] text-muted-foreground font-medium">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="rounded-[14px] border border-border/40 bg-muted/50/30 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
