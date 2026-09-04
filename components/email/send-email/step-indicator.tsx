"use client";

import React from "react";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
  onStepClick?: (stepIndex: number) => void;
}

export function StepIndicator({
  currentStep,
  steps,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
      {steps.map((stepName, i) => {
        const isCurrent = i === currentStep;
        const isCompleted = i < currentStep;
        const isClickable = isCompleted && onStepClick;

        return (
          <React.Fragment key={stepName}>
            <button
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onStepClick(i)}
              className={cn(
                "flex items-center gap-2 px-2.5 py-1.5 rounded-[4px] text-[11.5px] font-medium transition-all text-left shrink-0",
                isCurrent &&
                  "bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs font-semibold",
                isCompleted &&
                  "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/50 cursor-pointer",
                !isCurrent &&
                  !isCompleted &&
                  "bg-transparent text-muted-foreground/80 hover:text-foreground cursor-default"
              )}
            >
              <div
                className={cn(
                  "h-4.5 w-4.5 rounded-[3px] flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors",
                  isCurrent &&
                    "bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900",
                  isCompleted &&
                    "bg-emerald-600 dark:bg-emerald-500 text-white",
                  !isCurrent &&
                    !isCompleted &&
                    "bg-[#f1f1f2] dark:bg-zinc-800 text-muted-foreground border border-border/60"
                )}
              >
                {isCompleted ? <Check className="h-3 w-3 stroke-[2.5]" /> : i + 1}
              </div>
              <span className="truncate">{stepName}</span>
            </button>

            {i < steps.length - 1 && (
              <ChevronRight className="h-3 w-3 text-muted-foreground/40 shrink-0 mx-0.5" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

