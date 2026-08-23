"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Plus, Minus } from "lucide-react";

export interface PolarisCollapsibleProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  iconType?: "chevron" | "plus";
  children: React.ReactNode;
  className?: string;
}

export function PolarisCollapsible({
  title,
  subtitle,
  badge,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  iconType = "plus",
  children,
  className,
}: PolarisCollapsibleProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;

  const toggle = () => {
    const next = !isOpen;
    if (controlledOpen === undefined) {
      setUncontrolledOpen(next);
    }
    onOpenChange?.(next);
  };

  return (
    <div
      className={cn(
        "rounded-[12px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-150",
        className
      )}
    >
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer select-none"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-semibold text-[#303030] dark:text-zinc-100 leading-[20px]">
              {title}
            </h3>
            {badge && <div>{badge}</div>}
          </div>
          {subtitle && (
            <p className="text-[12.5px] text-[#616161] dark:text-zinc-400 mt-0.5 leading-[18px]">
              {subtitle}
            </p>
          )}
        </div>

        <div className="h-6 w-6 rounded-md flex items-center justify-center text-[#616161] dark:text-zinc-400 hover:text-[#303030] dark:hover:text-zinc-200 transition-colors shrink-0">
          {iconType === "plus" ? (
            isOpen ? (
              <Minus className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )
          ) : (
            <ChevronDown
              className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")}
            />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-1 border-t border-[#f1f2f3] dark:border-zinc-800 animate-in fade-in-50 slide-in-from-top-1 duration-150">
          <div className="space-y-4 pt-2">{children}</div>
        </div>
      )}
    </div>
  );
}
