"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, AlertCircle } from "lucide-react";

export interface PolarisSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface PolarisSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  label?: React.ReactNode;
  labelAction?: React.ReactNode;
  helperText?: React.ReactNode;
  error?: string | boolean | null;
  options: PolarisSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  containerClassName?: string;
  required?: boolean;
}

export function PolarisSelect({
  id,
  label,
  labelAction,
  helperText,
  error,
  options,
  value,
  onChange,
  placeholder,
  className,
  containerClassName,
  required,
  disabled,
  ...props
}: PolarisSelectProps) {
  const selectId = id || (typeof label === "string" ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
  const hasError = Boolean(error);
  const errorMessage = typeof error === "string" ? error : null;

  return (
    <div className={cn("w-full space-y-1.5", containerClassName)}>
      {(label || labelAction) && (
        <div className="flex items-center justify-between gap-2 mb-[6px]">
          {label && (
            <label
              htmlFor={selectId}
              className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none"
            >
              {label}
              {required && <span className="text-[#d72c0d] ml-0.5">*</span>}
            </label>
          )}
          {labelAction && <div className="text-[13px]">{labelAction}</div>}
        </div>
      )}

      <div className="relative">
        <select
          id={selectId}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={hasError}
          className={cn(
            "w-full h-[40px] pl-3 pr-9 text-[14px] text-[#303030] dark:text-zinc-100 bg-white dark:bg-zinc-900 border rounded-[8px] appearance-none cursor-pointer transition-all duration-150 outline-none",
            hasError
              ? "border-[#d72c0d] dark:border-rose-500 focus:border-[#d72c0d] focus:ring-1 focus:ring-[#d72c0d]"
              : "border-[#aeb4b9] dark:border-zinc-700 hover:border-[#8c9196] dark:hover:border-zinc-600 focus:border-[#005bd3] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#005bd3] dark:focus:ring-blue-500",
            disabled && "bg-[#f1f2f3] dark:bg-zinc-800 text-[#8c9196] cursor-not-allowed",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className="bg-white dark:bg-zinc-900 text-[#303030] dark:text-zinc-100 py-1"
            >
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#616161] dark:text-zinc-400">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>

      {hasError && errorMessage && (
        <p className="text-[12.5px] text-[#d72c0d] dark:text-rose-400 mt-1 flex items-center gap-1 font-normal leading-[18px]">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </p>
      )}

      {!hasError && helperText && (
        <p className="text-[12.5px] text-[#616161] dark:text-zinc-400 mt-1 leading-[18px]">
          {helperText}
        </p>
      )}
    </div>
  );
}
