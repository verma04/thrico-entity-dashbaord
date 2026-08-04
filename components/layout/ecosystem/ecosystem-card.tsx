import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, Activity, Plus } from "lucide-react";

export interface EcosystemCardProps {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  icon?: LucideIcon;
  decorationIcon?: LucideIcon;
  decorationColor?: string;
  className?: string;
  innerClassName?: string;

  // New props for the "skill" card design variant
  variant?: "default" | "skill";
  colorScheme?:
    | "indigo"
    | "sky"
    | "lime"
    | "rose"
    | "purple"
    | "orange"
    | "slate";
  onActionClick?: () => void;
  actionLabel?: string;
}

const colorStyles = {
  indigo: {
    bg: "bg-gradient-to-b from-[#f3f5ff] to-[#f9faff] dark:from-indigo-950/20 dark:to-indigo-950/5 border-transparent dark:border-indigo-900/30",
    iconBg: "bg-gradient-to-br from-indigo-500 to-indigo-600",
  },
  sky: {
    bg: "bg-gradient-to-b from-[#f0fafe] to-[#f7fcff] dark:from-sky-950/20 dark:to-sky-950/5 border-transparent dark:border-sky-900/30",
    iconBg: "bg-gradient-to-br from-sky-400 to-sky-500",
  },
  lime: {
    bg: "bg-gradient-to-b from-[#f4fdf4] to-[#f9fef9] dark:from-lime-950/20 dark:to-lime-950/5 border-transparent dark:border-lime-900/30",
    iconBg: "bg-gradient-to-br from-[#a3d95b] to-[#8ac93b]", // Matching the yellow-green from the image
  },
  rose: {
    bg: "bg-gradient-to-b from-[#fff4f5] to-[#fff9f9] dark:from-rose-950/20 dark:to-rose-950/5 border-transparent dark:border-rose-900/30",
    iconBg: "bg-gradient-to-br from-rose-400 to-rose-500",
  },
  purple: {
    bg: "bg-gradient-to-b from-[#fbf4ff] to-[#fdf9ff] dark:from-purple-950/20 dark:to-purple-950/5 border-transparent dark:border-purple-900/30",
    iconBg: "bg-gradient-to-br from-purple-400 to-purple-500",
  },
  orange: {
    bg: "bg-gradient-to-b from-[#fff5f0] to-[#fffaf7] dark:from-orange-950/20 dark:to-orange-950/5 border-transparent dark:border-orange-900/30",
    iconBg: "bg-gradient-to-br from-orange-400 to-orange-500",
  },
  slate: {
    bg: "bg-muted/30 border-transparent",
    iconBg: "bg-slate-500",
  },
};

export function EcosystemCard({
  children,
  title,
  description,
  icon: Icon = Activity,
  decorationIcon: _DecoIcon,
  decorationColor,
  className,
  innerClassName,
  variant = "default",
  colorScheme = "slate",
  onActionClick,
  actionLabel = "Create skill",
}: EcosystemCardProps) {
  // We use the beautiful soft design for ALL cards now!
  const currentStyle = colorStyles[colorScheme] || colorStyles.slate;
  const isSkill = variant === "skill";

  return (
    <div
      className={cn(
        "relative flex flex-col p-5 rounded-[20px] border transition-all duration-300 hover:shadow-sm overflow-hidden",
        currentStyle.bg,
        className,
      )}
    >
      {Icon && (
        <div
          className={cn(
            "h-8 w-8 rounded-[10px] flex items-center justify-center shadow-sm shrink-0",
            currentStyle.iconBg,
          )}
        >
          <Icon className="h-4 w-4 text-white" />
        </div>
      )}

      {(title || description) && (
        <div className="mt-6 relative z-10">
          {title && (
            <h3 className="text-[14.5px] font-semibold text-foreground mb-1 leading-tight tracking-tight">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-[12.5px] text-muted-foreground leading-snug">
              {description}
            </p>
          )}
        </div>
      )}

      {children && (
        <div className={cn("mt-6 flex-1 relative z-10", innerClassName)}>
          {children}
        </div>
      )}

      {(isSkill || onActionClick) && (
        <button
          onClick={onActionClick}
          className="mt-6 flex items-center justify-center gap-1.5 w-full py-2 px-4 rounded-[10px] bg-background border border-border/50 text-[13px] font-medium text-foreground hover:bg-muted/50 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] relative z-10"
        >
          <Plus className="h-3.5 w-3.5 text-muted-foreground" /> {actionLabel}
        </button>
      )}
    </div>
  );
}
