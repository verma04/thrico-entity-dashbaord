import React from "react";
import { Plus, Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { StarterEntry, BADGE_STYLES } from "./template-data";

interface EmailThumbnailProps {
  starter: StarterEntry;
  selected: boolean;
  onSelect: () => void;
}

export function EmailThumbnail({
  starter,
  selected,
  onSelect,
}: EmailThumbnailProps) {
  const isBlank = starter.key === "blank";

  return (
    <div
      onClick={onSelect}
      className={cn(
        "group relative flex flex-col rounded-2xl border transition-all duration-300 hover:shadow-xl cursor-pointer overflow-hidden h-full bg-white",
        selected
          ? "border-primary ring-2 ring-primary/20 shadow-lg"
          : "border-slate-200/60 hover:border-slate-300"
      )}
    >
      {!isBlank && (
        <div className={cn("h-1.5 w-full bg-linear-to-r", starter.headerGradient)} />
      )}
      <div className="flex flex-col flex-1 p-5 pt-6">
        <div className="flex items-start justify-between mb-5">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl shadow-sm border",
              isBlank
                ? "bg-slate-50 border-slate-200 text-slate-400"
                : "bg-white border-slate-100"
            )}
          >
            {isBlank ? (
              <Plus className="h-6 w-6" strokeWidth={2} />
            ) : (
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br",
                  starter.headerGradient
                )}
              >
                {React.cloneElement(starter.icon as React.ReactElement, {
                  className: "text-white",
                  size: 20,
                  strokeWidth: 2,
                })}
              </div>
            )}
          </div>
          {selected ? (
            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center shadow-sm">
              <Check className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={3} />
            </div>
          ) : (
            <div className="h-6 w-6 rounded-full border border-slate-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-50">
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mb-1.5">
          <h3 className="font-bold text-slate-900 text-[15px] leading-tight tracking-tight">
            {starter.label}
          </h3>
          {starter.badge && starter.badgeVariant && (
            <span
              className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                BADGE_STYLES[starter.badgeVariant]
              )}
            >
              {starter.badge}
            </span>
          )}
        </div>
        <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2 mt-auto">
          {starter.description}
        </p>
      </div>
    </div>
  );
}
