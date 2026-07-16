import { cn } from "@/lib/utils";

interface PlanToggleProps {
  isYearly: boolean;
  onToggle: (yearly: boolean) => void;
  maxSavings: number;
}

export const PlanToggle = ({ isYearly, onToggle, maxSavings }: PlanToggleProps) => {
  return (
    <div className="flex items-center gap-3">
      {/* Toggle pill */}
      <div className="flex items-center p-0.5 bg-muted rounded-lg border border-border">
        <button
          onClick={() => onToggle(false)}
          className={cn(
            "px-3 py-1.5 rounded-md text-[12px] font-semibold transition-all duration-150",
            !isYearly
              ? "bg-card text-foreground shadow-sm border border-border"
              : "text-muted-foreground hover:text-muted-foreground"
          )}
        >
          Monthly
        </button>
        <button
          onClick={() => onToggle(true)}
          className={cn(
            "px-3 py-1.5 rounded-md text-[12px] font-semibold transition-all duration-150",
            isYearly
              ? "bg-card text-foreground shadow-sm border border-border"
              : "text-muted-foreground hover:text-muted-foreground"
          )}
        >
          Annual
        </button>
      </div>

      {/* Savings badge */}
      {maxSavings > 0 && (
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md">
          Save up to {maxSavings}% annually
        </span>
      )}
    </div>
  );
};
