"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface PolarisCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  headerAction?: React.ReactNode;
  description?: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  noPadding?: boolean;
}

export function PolarisCard({
  title,
  headerAction,
  description,
  badge,
  children,
  className,
  bodyClassName,
  noPadding = false,
  ...props
}: PolarisCardProps) {
  return (
    <div
      className={cn(
        "rounded-[10px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-150",
        noPadding ? "p-0" : "p-3.5",
        className,
      )}
      {...props}
    >
      {(title || headerAction || description) && (
        <div className={cn("mb-2.5", noPadding && "px-3.5 pt-3.5")}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {title && (
                <h3 className="text-[13px] font-semibold text-[#303030] dark:text-zinc-100 leading-[18px]">
                  {title}
                </h3>
              )}
              {badge && <div>{badge}</div>}
            </div>
            {headerAction && <div>{headerAction}</div>}
          </div>
          {description && (
            <p className="text-[11.5px] text-[#616161] dark:text-zinc-400 mt-0.5 leading-[16px]">
              {description}
            </p>
          )}
        </div>
      )}
      <div className={cn("space-y-3.5", bodyClassName)}>{children}</div>
    </div>
  );
}
