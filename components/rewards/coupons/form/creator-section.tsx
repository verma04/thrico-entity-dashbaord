import React from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface CreatorSectionProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  accent?: "indigo" | "amber" | "rose" | "emerald" | "violet";
}

export const CreatorSection = ({
  icon: Icon,
  title,
  subtitle,
  children,
  accent = "indigo",
}: CreatorSectionProps) => {
  const accents = {
    indigo:
      "bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20",
    amber:
      "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    rose: "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
    emerald:
      "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    violet:
      "bg-violet-50 text-violet-600 border-violet-100 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border",
            accents[accent],
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-foreground tracking-tight">
            {title}
          </h2>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="pl-14 space-y-6">{children}</div>
      <Separator className="ml-14 mt-8 bg-border/50" />
    </div>
  );
};
