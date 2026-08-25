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

export type PolarisLabelActionObject = {
  text?: string;
  content?: string;
  onClick?: () => void;
  onAction?: () => void;
  className?: string;
};

export type PolarisLabelAction = React.ReactNode | PolarisLabelActionObject;

export function renderPolarisLabelAction(
  action?: PolarisLabelAction,
): React.ReactNode {
  if (!action) return null;
  if (React.isValidElement(action)) {
    return <div className="text-[11.5px]">{action}</div>;
  }
  if (typeof action === "string" || typeof action === "number") {
    return <div className="text-[11.5px]">{action}</div>;
  }
  if (typeof action === "object" && action !== null) {
    const act = action as PolarisLabelActionObject;
    const label = act.text || act.content;
    const onClick = act.onClick || act.onAction;
    if (label) {
      return (
        <button
          type="button"
          onClick={onClick}
          className={cn(
            "text-[11.5px] font-semibold text-[#616161] hover:text-[#303030] dark:text-zinc-400 dark:hover:text-zinc-200 cursor-pointer transition-colors",
            act.className,
          )}
        >
          {label}
        </button>
      );
    }
  }
  return null;
}

