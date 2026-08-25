"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, AlertCircle, X } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import {
  type PolarisLabelAction,
  renderPolarisLabelAction,
} from "./polaris-label";

export interface PolarisDatePickerProps {
  id?: string;
  label?: React.ReactNode;
  labelAction?: PolarisLabelAction;
  helperText?: React.ReactNode;
  error?: string | boolean | null;
  value: Date | null | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
  fromYear?: number;
  toYear?: number;
  defaultMonth?: Date;
  captionLayout?: "buttons" | "dropdown" | "dropdown-months" | "dropdown-years";
  allowClear?: boolean;
}

export function PolarisDatePicker({
  id,
  label,
  labelAction,
  helperText,
  error,
  value,
  onChange,
  placeholder = "Pick date",
  required,
  disabled,
  className,
  containerClassName,
  fromYear = 1930,
  toYear = new Date().getFullYear() + 10,
  defaultMonth,
  captionLayout = "dropdown",
  allowClear = false,
}: PolarisDatePickerProps) {
  const [open, setOpen] = useState(false);
  const selectId =
    id ||
    (typeof label === "string"
      ? label.toLowerCase().replace(/\s+/g, "-")
      : undefined);
  const hasError = Boolean(error);
  const errorMessage = typeof error === "string" ? error : null;

  return (
    <div className={cn("w-full space-y-1", containerClassName)}>
      {(label || labelAction) && (
        <div className="flex items-center justify-between gap-2 mb-[4px]">
          {label && (
            <label
              htmlFor={selectId}
              className="text-[12px] font-medium text-[#303030] dark:text-zinc-200 leading-[16px] select-none"
            >
              {label}
              {required && <span className="text-[#d72c0d] ml-0.5">*</span>}
            </label>
          )}
          {renderPolarisLabelAction(labelAction)}
        </div>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            id={selectId}
            type="button"
            disabled={disabled}
            className={cn(
              "w-full h-[34px] px-2.5 text-[12.5px] bg-white dark:bg-zinc-900 border rounded-[6px] flex items-center justify-between gap-2 transition-all duration-150 outline-none hover:border-[#8c9196] focus:border-[#005bd3] focus:ring-1 focus:ring-[#005bd3] text-left cursor-pointer",
              hasError
                ? "border-[#d72c0d] dark:border-rose-500 focus:ring-1 focus:ring-[#d72c0d]"
                : "border-[#aeb4b9] dark:border-zinc-700",
              disabled &&
                "bg-[#f1f2f3] dark:bg-zinc-800 text-[#8c9196] cursor-not-allowed",
              className,
            )}
          >
            <div className="flex items-center gap-2 truncate">
              <CalendarIcon className="h-3.5 w-3.5 text-[#616161] dark:text-zinc-400 shrink-0" />
              {value ? (
                <span className="text-[#303030] dark:text-zinc-100 font-medium truncate">
                  {format(value, "PPP")}
                </span>
              ) : (
                <span className="text-[#8c9196] dark:text-zinc-500 truncate">
                  {placeholder}
                </span>
              )}
            </div>

            {allowClear && value && !disabled && (
              <X
                className="h-3.5 w-3.5 text-[#616161] hover:text-[#d72c0d] shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(undefined);
                }}
              />
            )}
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto p-0 shadow-md border-[#d2d5d9] dark:border-zinc-700 rounded-[8px]"
          align="start"
        >
          <Calendar
            mode="single"
            selected={value || undefined}
            onSelect={(date) => {
              onChange(date);
              setOpen(false);
            }}
            initialFocus
            captionLayout={captionLayout}
            fromYear={fromYear}
            toYear={toYear}
            defaultMonth={value || defaultMonth || new Date(2000, 0, 1)}
          />
        </PopoverContent>
      </Popover>

      {hasError && errorMessage && (
        <p className="text-[11px] text-[#d72c0d] dark:text-rose-400 mt-1 flex items-center gap-1 font-normal leading-[15px]">
          <AlertCircle className="h-3 w-3 shrink-0" />
          <span>{errorMessage}</span>
        </p>
      )}

      {!hasError && helperText && (
        <p className="text-[11px] text-[#616161] dark:text-zinc-400 mt-1 leading-[15px]">
          {helperText}
        </p>
      )}
    </div>
  );
}
