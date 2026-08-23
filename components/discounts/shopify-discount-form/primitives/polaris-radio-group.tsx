"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface PolarisRadioOption<T extends string = string> {
  value: T;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  children?: React.ReactNode;
}

export interface PolarisRadioGroupProps<T extends string = string> {
  name: string;
  value: T;
  onChange: (value: T) => void;
  options: PolarisRadioOption<T>[];
  className?: string;
}

export function PolarisRadioGroup<T extends string = string>({
  name,
  value,
  onChange,
  options,
  className,
}: PolarisRadioGroupProps<T>) {
  return (
    <div role="radiogroup" className={cn("space-y-1.5", className)}>
      {options.map((opt) => {
        const isSelected = opt.value === value;
        const optId = `${name}-${opt.value}`;

        return (
          <div key={opt.value} className="w-full">
            <label
              htmlFor={optId}
              className={cn(
                "group flex items-start gap-2.5 py-2 px-1 rounded-[8px] cursor-pointer transition-colors duration-150 select-none",
                opt.disabled && "opacity-50 cursor-not-allowed pointer-events-none"
              )}
            >
              {/* 18px Radio Disc */}
              <div className="relative flex items-center justify-center h-[20px] shrink-0 mt-[1px]">
                <input
                  type="radio"
                  id={optId}
                  name={name}
                  value={opt.value}
                  checked={isSelected}
                  disabled={opt.disabled}
                  onChange={() => onChange(opt.value)}
                  className="sr-only"
                />
                <div
                  className={cn(
                    "w-[18px] h-[18px] rounded-full border transition-all duration-150 flex items-center justify-center",
                    isSelected
                      ? "border-[#005bd3] dark:border-blue-500 bg-[#005bd3] dark:bg-blue-500"
                      : "border-[#8c9196] dark:border-zinc-600 bg-white dark:bg-zinc-800 group-hover:border-[#303030] dark:group-hover:border-zinc-400"
                  )}
                >
                  {isSelected && (
                    <div className="w-[6px] h-[6px] rounded-full bg-white dark:bg-zinc-950" />
                  )}
                </div>
              </div>

              {/* Label & Description */}
              <div className="flex-1 min-w-0">
                <span className="text-[14px] font-normal text-[#303030] dark:text-zinc-200 leading-[20px] block">
                  {opt.label}
                </span>
                {opt.description && (
                  <span className="text-[12.5px] text-[#616161] dark:text-zinc-400 mt-0.5 block leading-[18px]">
                    {opt.description}
                  </span>
                )}
              </div>
            </label>

            {/* Progressive Disclosure Children */}
            {isSelected && opt.children && (
              <div className="pl-[28px] pr-1 pb-2 pt-1 animate-in fade-in-50 slide-in-from-top-1 duration-150">
                {opt.children}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
