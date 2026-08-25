"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export interface PolarisTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
  labelAction?: React.ReactNode;
  helperText?: React.ReactNode;
  error?: string | boolean | null;
  containerClassName?: string;
  required?: boolean;
}

export const PolarisTextarea = forwardRef<
  HTMLTextAreaElement,
  PolarisTextareaProps
>(
  (
    {
      id,
      label,
      labelAction,
      helperText,
      error,
      className,
      containerClassName,
      required,
      disabled,
      ...props
    },
    ref,
  ) => {
    const textareaId =
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
                htmlFor={textareaId}
                className="text-[12px] font-medium text-[#303030] dark:text-zinc-200 leading-[16px] select-none"
              >
                {label}
                {required && <span className="text-[#d72c0d] ml-0.5">*</span>}
              </label>
            )}
            {labelAction && <div className="text-[11.5px]">{labelAction}</div>}
          </div>
        )}

        <textarea
          id={textareaId}
          ref={ref}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={
            hasError && textareaId
              ? `${textareaId}-error`
              : helperText && textareaId
                ? `${textareaId}-helper`
                : undefined
          }
          className={cn(
            "w-full min-h-[76px] px-2.5 py-2 text-[12.5px] text-[#303030] dark:text-zinc-100 bg-white dark:bg-zinc-900 border rounded-[6px] transition-all duration-150 outline-none resize-none placeholder:text-[#8c9196] dark:placeholder:text-zinc-500",
            hasError
              ? "border-[#d72c0d] dark:border-rose-500 focus:border-[#d72c0d] focus:ring-1 focus:ring-[#d72c0d] bg-rose-50/20"
              : "border-[#aeb4b9] dark:border-zinc-700 hover:border-[#8c9196] dark:hover:border-zinc-600 focus:border-[#005bd3] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#005bd3] dark:focus:ring-blue-500",
            disabled &&
              "bg-[#f1f2f3] dark:bg-zinc-800 text-[#8c9196] cursor-not-allowed",
            className,
          )}
          {...props}
        />

        {hasError && errorMessage && (
          <p
            id={textareaId ? `${textareaId}-error` : undefined}
            className="text-[11px] text-[#d72c0d] dark:text-rose-400 mt-1 flex items-center gap-1 font-normal leading-[15px]"
          >
            <AlertCircle className="h-3 w-3 shrink-0" />
            <span>{errorMessage}</span>
          </p>
        )}

        {!hasError && helperText && (
          <p
            id={textareaId ? `${textareaId}-helper` : undefined}
            className="text-[11px] text-[#616161] dark:text-zinc-400 mt-1 leading-[15px]"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

PolarisTextarea.displayName = "PolarisTextarea";
