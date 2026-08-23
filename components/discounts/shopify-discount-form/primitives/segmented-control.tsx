"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SegmentOption<T extends string = string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  disabled?: boolean;
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  className,
  disabled,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      className={cn(
        "inline-flex items-center p-[2px] rounded-[8px] bg-[#f1f2f3] dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700 h-[32px] w-full sm:w-auto",
        disabled && "opacity-60 pointer-events-none",
        className
      )}
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 h-[26px] text-[13px] font-medium rounded-[6px] transition-all duration-150 cursor-pointer select-none",
              isSelected
                ? "bg-white dark:bg-zinc-900 text-[#303030] dark:text-zinc-100 font-medium shadow-[0_1px_2px_rgba(0,0,0,0.08)] border border-[#d2d5d9]/60 dark:border-zinc-700"
                : "text-[#616161] dark:text-zinc-400 hover:text-[#303030] dark:hover:text-zinc-200"
            )}
          >
            {option.icon && <span className="shrink-0">{option.icon}</span>}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
