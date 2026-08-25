"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronsUpDown, Check, AlertCircle } from "lucide-react";
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
import {
  type PolarisLabelAction,
  renderPolarisLabelAction,
} from "./polaris-label";

export interface PolarisComboboxOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: string;
  disabled?: boolean;
}

export interface PolarisComboboxProps {
  id?: string;
  label?: React.ReactNode;
  labelAction?: PolarisLabelAction;
  helperText?: React.ReactNode;
  error?: string | boolean | null;
  placeholder?: string;
  searchPlaceholder?: string;
  options: PolarisComboboxOption[];
  value: string | null | undefined;
  onChange: (value: string) => void;
  onClear?: () => void;
  allowClear?: boolean;
  clearLabel?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
  icon?: React.ReactNode;
}

export function PolarisCombobox({
  id,
  label,
  labelAction,
  helperText,
  error,
  placeholder = "Select option...",
  searchPlaceholder = "Search options...",
  options = [],
  value,
  onChange,
  onClear,
  allowClear = false,
  clearLabel = "None",
  required,
  disabled,
  className,
  containerClassName,
  icon,
}: PolarisComboboxProps) {
  const [open, setOpen] = useState(false);
  const selectId =
    id ||
    (typeof label === "string"
      ? label.toLowerCase().replace(/\s+/g, "-")
      : undefined);
  const hasError = Boolean(error);
  const errorMessage = typeof error === "string" ? error : null;

  const selectedOption = options.find((o) => o.value === value);

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
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full h-[34px] px-2.5 text-[12.5px] bg-white dark:bg-zinc-900 border rounded-[6px] flex items-center justify-between transition-all duration-150 outline-none text-left cursor-pointer",
              hasError
                ? "border-[#d72c0d] dark:border-rose-500 focus:ring-1 focus:ring-[#d72c0d]"
                : "border-[#aeb4b9] dark:border-zinc-700 hover:border-[#8c9196] focus:border-[#005bd3] focus:ring-1 focus:ring-[#005bd3]",
              disabled &&
                "bg-[#f1f2f3] dark:bg-zinc-800 text-[#8c9196] cursor-not-allowed",
              className,
            )}
          >
            <div className="flex items-center gap-2 truncate min-w-0">
              {icon && (
                <div className="text-[#616161] dark:text-zinc-400 shrink-0 text-[12px]">
                  {icon}
                </div>
              )}
              {selectedOption?.icon && (
                <div className="shrink-0 text-[12px]">
                  {selectedOption.icon}
                </div>
              )}
              {selectedOption ? (
                <span className="font-medium text-[#303030] dark:text-zinc-100 truncate">
                  {selectedOption.label}
                </span>
              ) : (
                <span className="text-[#8c9196] dark:text-zinc-500 truncate">
                  {placeholder}
                </span>
              )}
            </div>
            <ChevronsUpDown className="h-3.5 w-3.5 text-[#616161] shrink-0 ml-2" />
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
                No options found.
              </CommandEmpty>
              <CommandGroup>
                {allowClear && (
                  <CommandItem
                    onSelect={() => {
                      if (onClear) onClear();
                      else onChange("");
                      setOpen(false);
                    }}
                    className="text-[12.5px] font-medium py-1.5 px-2 cursor-pointer text-[#8c9196]"
                  >
                    <span>{clearLabel}</span>
                  </CommandItem>
                )}
                {options.map((option) => {
                  const isSelected = value === option.value;
                  return (
                    <CommandItem
                      key={option.value}
                      value={`${option.label} ${option.value}`}
                      disabled={option.disabled}
                      onSelect={() => {
                        onChange(option.value);
                        setOpen(false);
                      }}
                      className="flex items-center justify-between text-[12.5px] font-medium py-1.5 px-2 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 truncate">
                        {option.icon && <div>{option.icon}</div>}
                        <span className="truncate">{option.label}</span>
                        {option.badge && (
                          <span className="text-[9.5px] text-[#616161] bg-[#f6f6f7] px-1 py-0.2 rounded border border-[#d2d5d9]">
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
