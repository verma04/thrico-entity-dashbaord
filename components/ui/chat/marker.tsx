"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MarkerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "status" | "tool" | "note";
  role?: string;
}

export const Marker = React.forwardRef<HTMLDivElement, MarkerProps>(
  ({ className, variant = "status", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role={props.role || (variant === "status" ? "status" : undefined)}
        aria-live={variant === "status" ? "polite" : undefined}
        className={cn(
          "flex items-center gap-2 text-[11px] text-muted-foreground py-1 px-2.5 rounded-lg w-fit transition-all",
          variant === "status" && "bg-muted/40 border border-border/50",
          variant === "tool" && "bg-indigo-500/5 border border-indigo-500/15 text-indigo-700 dark:text-indigo-300 font-mono",
          variant === "note" && "bg-amber-500/5 border border-amber-500/20 text-amber-800 dark:text-amber-200",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Marker.displayName = "Marker";

export const MarkerIcon = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-center shrink-0 h-3.5 w-3.5", className)}
        {...props}
      >
        {children || <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
      </div>
    );
  }
);
MarkerIcon.displayName = "MarkerIcon";

interface MarkerContentProps extends React.HTMLAttributes<HTMLSpanElement> {
  shimmer?: boolean;
}

export const MarkerContent = React.forwardRef<HTMLSpanElement, MarkerContentProps>(
  ({ className, shimmer = false, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn("leading-none", shimmer && "shimmer font-medium", className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);
MarkerContent.displayName = "MarkerContent";

export const MarkerSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex items-center justify-center w-full my-3 select-none text-[10px] text-muted-foreground/70",
          className
        )}
        {...props}
      >
        <div className="absolute inset-x-0 h-px bg-border/60" />
        <span className="relative bg-background px-3 font-medium uppercase tracking-wider">
          {children}
        </span>
      </div>
    );
  }
);
MarkerSeparator.displayName = "MarkerSeparator";
