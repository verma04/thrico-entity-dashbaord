"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface PolarisLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function PolarisLabel({
  required,
  optional,
  children,
  className,
  ...props
}: PolarisLabelProps) {
  return (
    <label
      className={cn(
        "text-[12px] font-medium text-[#303030] dark:text-zinc-200 leading-[16px] select-none block",
        className,
      )}
      {...props}
    >
      {children}
      {required && <span className="text-[#d72c0d] ml-0.5">*</span>}
      {optional && (
        <span className="text-[#616161] dark:text-zinc-400 font-normal ml-1 text-[11px]">
          (Optional)
        </span>
      )}
    </label>
  );
}
