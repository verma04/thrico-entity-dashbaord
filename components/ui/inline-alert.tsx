"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type InlineAlertVariant = "alert" | "error" | "success";

interface InlineAlertProps {
  variant?: InlineAlertVariant;
  title?: string;
  message: React.ReactNode;
  /** Allow the user to dismiss the alert. Defaults to false. */
  dismissible?: boolean;
  className?: string;
}

const variantConfig: Record<
  InlineAlertVariant,
  {
    border: string;
    bg: string;
    text: string;
    titleColor: string;
    icon: React.ReactNode;
  }
> = {
  alert: {
    border: "border-[#584824]",
    bg: "bg-[#221f15]",
    text: "text-[#dcd1b3]",
    titleColor: "text-white",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M7.11116 1.77778C7.50658 1.0927 8.4934 1.0927 8.88882 1.77778L15.698 13.5654C16.0827 14.2312 15.6022 15.1111 14.8091 15.1111H1.19082C0.397732 15.1111 -0.0827563 14.2312 0.301931 13.5654L7.11116 1.77778Z"
          fill="#F5A623"
        />
        <path
          d="M8 5.77777V10.2222"
          stroke="#221f15"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="8" cy="12.4444" r="0.888889" fill="#221f15" />
      </svg>
    ),
  },
  error: {
    border: "border-[#5c2323]",
    bg: "bg-[#1e1212]",
    text: "text-[#e2b8b8]",
    titleColor: "text-white",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="8" cy="8" r="7.5" fill="#E53E3E" />
        <path
          d="M5 5L11 11M11 5L5 11"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  success: {
    border: "border-[#1f4d2e]",
    bg: "bg-[#111c14]",
    text: "text-[#b8d9c2]",
    titleColor: "text-white",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="8" cy="8" r="7.5" fill="#38A169" />
        <path
          d="M4.5 8.5L6.8 10.8L11.5 5.5"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
};

/**
 * InlineAlert — a reusable inline banner for alert (warning), error, and success states.
 *
 * @example
 * <InlineAlert variant="alert" title="Warning:" message="This action cannot be undone." dismissible />
 * <InlineAlert variant="error" title="Error:" message="Something went wrong." />
 * <InlineAlert variant="success" title="Done!" message="Your changes have been saved." />
 */
export function InlineAlert({
  variant = "alert",
  title,
  message,
  dismissible = false,
  className,
}: InlineAlertProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const config = variantConfig[variant];

  return (
    <div
      role="alert"
      className={cn(
        "relative flex items-start gap-3 rounded-[3px] border p-4 text-[13px] leading-5 shadow-sm",
        config.border,
        config.bg,
        config.text,
        className
      )}
    >
      {/* Icon */}
      <div className="mt-0.5 shrink-0">{config.icon}</div>

      {/* Content */}
      <div className={cn("flex-1", dismissible && "pr-6")}>
        {title && (
          <span className={cn("font-bold", config.titleColor)}>{title} </span>
        )}
        {message}
      </div>

      {/* Dismiss button */}
      {dismissible && (
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Dismiss alert"
          className="absolute right-4 top-4 text-[#71717a] hover:text-[#a1a1aa] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
