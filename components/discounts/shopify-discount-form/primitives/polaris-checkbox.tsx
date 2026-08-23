"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface PolarisCheckboxProps {
  id?: string;
  name?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function PolarisCheckbox({
  id,
  name,
  checked,
  onChange,
  label,
  description,
  disabled,
  children,
  className,
}: PolarisCheckboxProps) {
  const checkboxId = id || (name ? `checkbox-${name}` : undefined);

  return (
    <div className={cn("w-full", className)}>
      <label
        htmlFor={checkboxId}
        className={cn(
          "group flex items-start gap-2.5 py-1.5 px-1 rounded-[8px] cursor-pointer transition-colors duration-150 select-none min-h-[32px]",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none"
        )}
      >
        {/* 18px Checkbox Box */}
        <div className="relative flex items-center justify-center h-[20px] shrink-0 mt-[1px]">
          <input
            type="checkbox"
            id={checkboxId}
            name={name}
            checked={checked}
            disabled={disabled}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only"
          />
          <div
            className={cn(
              "w-[18px] h-[18px] rounded-[5px] border transition-all duration-150 flex items-center justify-center",
              checked
                ? "border-[#005bd3] dark:border-blue-500 bg-[#005bd3] dark:bg-blue-500 text-white"
                : "border-[#8c9196] dark:border-zinc-600 bg-white dark:bg-zinc-800 group-hover:border-[#303030] dark:group-hover:border-zinc-400"
            )}
          >
            {checked && <Check className="h-3 w-3 stroke-[3]" />}
          </div>
        </div>

        {/* Label & Description */}
        <div className="flex-1 min-w-0">
          <span className="text-[14px] font-normal text-[#303030] dark:text-zinc-200 leading-[20px] block">
            {label}
          </span>
          {description && (
            <span className="text-[12.5px] text-[#616161] dark:text-zinc-400 mt-0.5 block leading-[18px]">
              {description}
            </span>
          )}
        </div>
      </label>

      {/* Progressive Disclosure Children */}
      {checked && children && (
        <div className="pl-[28px] pr-1 pb-2 pt-1.5 animate-in fade-in-50 slide-in-from-top-1 duration-150">
          {children}
        </div>
      )}
    </div>
  );
}
