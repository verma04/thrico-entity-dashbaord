import React from "react";
import { cn } from "@/lib/utils";

export interface DashboardSectionHeadingProps {
  title: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  titleClassName?: string;
  className?: string;
  description?: string;
}

export function DashboardSectionHeading({ 
  title, 
  icon, 
  rightElement, 
  titleClassName,
  className,
  description
}: DashboardSectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      <div className="flex items-center gap-3 w-full">
        {/* Left accent bar */}
        <div className="w-[3px] h-4 rounded-full bg-gradient-to-b from-primary to-primary/40 shrink-0" />
        <div className="flex items-center gap-2 shrink-0">
          {icon && <div className="shrink-0">{icon}</div>}
          <h2 className={cn(
            "text-[10px] font-bold text-foreground/70 uppercase tracking-[0.22em] m-0 leading-none",
            titleClassName
          )}>
            {title}
          </h2>
        </div>
        <div className="h-px bg-gradient-to-r from-border/80 to-transparent flex-1 min-w-[2rem]" />
        {rightElement && <div className="shrink-0">{rightElement}</div>}
      </div>
      {description && (
        <p className="text-[11px] text-muted-foreground/70 max-w-[300px] pl-6">
          {description}
        </p>
      )}
    </div>
  );
}
