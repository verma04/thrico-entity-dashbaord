"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface PlatformHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  badge?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PlatformHeader({
  title,
  description,
  icon: Icon,
  badge,
  actions,
  className,
}: PlatformHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-zinc-100",
        className
      )}
    >
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="w-10 h-10 rounded-[12px] bg-zinc-50 border border-zinc-200/50 flex items-center justify-center text-zinc-600 shrink-0 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
            <Icon size={18} strokeWidth={2} />
          </div>
        )}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
              {title}
            </h1>
            {badge && (
              <span className="px-2 py-0.5 rounded-[6px] bg-zinc-100 border border-zinc-200/50 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="text-[13px] text-zinc-500 font-medium">
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
}

export function PlatformActionBar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "px-6 py-4 border-b border-zinc-100 bg-zinc-50/20 backdrop-blur-sm",
        className
      )}
    >
      {children}
    </div>
  );
}
