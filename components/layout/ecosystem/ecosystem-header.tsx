"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EcosystemHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  badgeText?: string;
  showLiveIndicator?: boolean;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  iconClassName?: string;
  headerClassName?: string;
}

export function EcosystemHeader({
  title,
  description,
  icon: Icon,
  badgeText = "Ecosystem Hub",
  showLiveIndicator = true,
  actions,
  children,
  iconClassName,
  headerClassName,
}: EcosystemHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-4 animate-in fade-in duration-500",
        headerClassName,
      )}
    >
      {/* Left: Icon + Text */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Icon */}
        <div className="relative shrink-0">
          <div
            className={cn(
              "h-11 w-11 rounded-2xl bg-zinc-900 flex items-center justify-center shadow-lg ring-1 ring-black/5",
              iconClassName,
            )}
          >
            <Icon className="h-5 w-5 text-white" strokeWidth={1.5} />
          </div>
          {showLiveIndicator && (
            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
            </span>
          )}
        </div>

        {/* Title + Badge + Description */}
        <div className="min-w-0">
          <div className="flex items-baseline gap-2.5 flex-wrap">
            <h1 className="text-[22px] font-black text-zinc-900 tracking-tight leading-none">
              {title}
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-100 border border-zinc-200/80 text-[10px] font-bold uppercase tracking-widest text-zinc-500 leading-none">
              <span className="w-1 h-1 rounded-full bg-zinc-400 inline-block" />
              {badgeText}
            </span>
          </div>
          <p className="mt-1 text-[13px] text-zinc-400 font-medium leading-snug truncate max-w-sm">
            {description}
          </p>
        </div>
      </div>

      {/* Right: Children + Actions */}
      {(children || actions) && (
        <div className="flex items-center gap-3 shrink-0">
          {children}
          {actions && (
            <div className="flex items-center gap-2">{actions}</div>
          )}
        </div>
      )}
    </div>
  );
}
