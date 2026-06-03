"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
      {steps.map((step, i) => (
        <React.Fragment key={step}>
          <div className="flex items-center gap-3 shrink-0">
            <div
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all border",
                i < currentStep
                  ? "bg-emerald-50 dark:bg-emerald-500/100 text-white dark:text-slate-900 border-emerald-500"
                  : i === currentStep
                    ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900"
                    : "bg-card text-muted-foreground/80 border-border/50"
              )}
            >
              {i < currentStep ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={cn(
                "text-sm font-medium hidden sm:block transition-colors",
                i === currentStep ? "text-foreground" : i < currentStep ? "text-muted-foreground" : "text-muted-foreground/80"
              )}
            >
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "flex-1 h-px min-w-[24px] transition-colors",
                i < currentStep ? "bg-emerald-300" : "bg-slate-200"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
