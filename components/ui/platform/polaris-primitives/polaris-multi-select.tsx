"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronsUpDown, Check, X, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export interface PolarisMultiSelectOption {
  value: string;
  label: string;
  badge?: string;
  disabled?: boolean;
}

export interface PolarisMultiSelectProps {
  id?: string;
  label?: React.ReactNode;
  labelAction?: React.ReactNode;
  helperText?: React.ReactNode;
  error?: string | boolean | null;
  placeholder?: string;
  searchPlaceholder?: string;
  options: PolarisMultiSelectOption[];
  values: string[];
  onChange: (values: string[]) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
  maxDisplayChips?: number;
}

export function PolarisMultiSelect({
  id,
  label,
  labelAction,
  helperText,
  error,
  placeholder = "Select options...",
  searchPlaceholder = "Search options...",
  options = [],
  values = [],
  onChange,
  required,
  disabled,
  className,
  containerClassName,
  maxDisplayChips = 6,
}: PolarisMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const selectId =
    id ||
    (typeof label === "string"
      ? label.toLowerCase().replace(/\s+/g, "-")
      : undefined);
  const hasError = Boolean(error);
  const errorMessage = typeof error === "string" ? error : null;

  const toggleItem = (val: string) => {
    if (values.includes(val)) {
      onChange(values.filter((v) => v !== val));
    } else {
      onChange([...values, val]);
    }
  };

  const removeItem = (val: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(values.filter((v) => v !== val));
  };

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
          {labelAction && <div className="text-[11.5px]">{labelAction}</div>}
        </div>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            id={selectId}
            type="button"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full min-h-[34px] px-2 py-1 text-[12.5px] bg-white dark:bg-zinc-900 border rounded-[6px] flex items-center justify-between gap-2 transition-all duration-150 outline-none text-left cursor-pointer",
              hasError
                ? "border-[#d72c0d] dark:border-rose-500 focus:ring-1 focus:ring-[#d72c0d]"
                : "border-[#aeb4b9] dark:border-zinc-700 hover:border-[#8c9196] focus:border-[#005bd3] focus:ring-1 focus:ring-[#005bd3]",
              disabled &&
                "bg-[#f1f2f3] dark:bg-zinc-800 text-[#8c9196] cursor-not-allowed",
              className,
            )}
          >
            <div className="flex flex-wrap gap-1 items-center min-w-0 flex-1">
              {values.length > 0 ? (
                values.slice(0, maxDisplayChips).map((val) => {
                  const opt = options.find((o) => o.value === val);
                  return (
                    <Badge
                      key={val}
                      variant="secondary"
                      className="bg-[#f6f6f7] dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 border border-[#d2d5d9] dark:border-zinc-700 text-[10.5px] font-medium px-1.5 py-0.2 rounded-[4px] flex items-center gap-1 shrink-0"
                    >
                      <span>{opt?.label || val}</span>
                      {!disabled && (
                        <X
                          className="h-2.5 w-2.5 text-[#616161] hover:text-[#d72c0d] cursor-pointer"
                          onClick={(e) => removeItem(val, e)}
                        />
                      )}
                    </Badge>
                  );
                })
              ) : (
                <span className="text-[#8c9196] dark:text-zinc-500 text-[12px] px-1 select-none">
                  {placeholder}
                </span>
              )}
              {values.length > maxDisplayChips && (
                <Badge
                  variant="outline"
                  className="bg-[#f6f6f7] text-[#616161] border-[#d2d5d9] text-[10px] font-bold px-1 py-0.2 rounded-[4px]"
                >
                  +{values.length - maxDisplayChips} more
                </Badge>
              )}
            </div>
            <ChevronsUpDown className="h-3.5 w-3.5 text-[#616161] shrink-0" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 shadow-md border-[#d2d5d9] dark:border-zinc-700 rounded-[6px]"
          align="start"
        >
          <Command className="rounded-[6px]">
            <CommandInput
              placeholder={searchPlaceholder}
              className="h-9 text-[12.5px]"
            />
            <CommandList className="max-h-[220px]">
              <CommandEmpty className="py-2.5 text-center text-[12px] text-[#616161]">
                No items found.
              </CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = values.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      value={`${option.label} ${option.value}`}
                      disabled={option.disabled}
                      onSelect={() => toggleItem(option.value)}
                      className="flex items-center justify-between text-[12.5px] font-medium py-1.5 px-2 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span>{option.label}</span>
                        {option.badge && (
                          <span className="text-[9.5px] text-[#616161] bg-[#f6f6f7] px-1.5 py-0.2 rounded border border-[#d2d5d9]">
                            {option.badge}
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <Check className="h-3 w-3 text-[#303030] dark:text-zinc-100 shrink-0" />
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
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
