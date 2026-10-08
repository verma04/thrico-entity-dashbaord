"use client";

import React from "react";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { Settings, Menu, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const NavigationManager = () => {
  const { globalHeader, selectModule, selectedModuleId } =
    useWebsiteBuilderStore();

  const isSelected = selectedModuleId === globalHeader.id;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between px-0.5">
        <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#616161] dark:text-zinc-400">
          Global Navigation
        </span>
        <Badge
          variant="outline"
          className="text-[9.5px] px-1.5 py-0 rounded-md border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7] dark:bg-zinc-800/60 text-muted-foreground"
        >
          All Pages
        </Badge>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => selectModule(globalHeader.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") selectModule(globalHeader.id);
        }}
        className={cn(
          "group relative flex items-center gap-2.5 p-2 rounded-xl border transition-all cursor-pointer shadow-2xs",
          isSelected
            ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 ring-1 ring-indigo-500/20"
            : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-indigo-300 dark:hover:border-zinc-700 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/60",
        )}
      >
        <div
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-lg border transition-colors shrink-0",
            isSelected
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200/80 dark:border-indigo-800/80",
          )}
        >
          <Menu className="h-3.5 w-3.5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "text-xs font-semibold truncate",
                isSelected
                  ? "text-indigo-950 dark:text-indigo-100"
                  : "text-[#303030] dark:text-zinc-100",
              )}
            >
              Navbar Header
            </span>
          </div>
          <div className="text-[10px] text-muted-foreground truncate capitalize">
            {globalHeader.layout || "Standard"} Layout
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Settings
            className={cn(
              "h-3.5 w-3.5 transition-colors",
              isSelected
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-muted-foreground/60 group-hover:text-muted-foreground",
            )}
          />
          <ChevronRight
            className={cn(
              "h-3 w-3 transition-colors",
              isSelected
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-muted-foreground/40 group-hover:text-muted-foreground/70",
            )}
          />
        </div>
      </div>
    </div>
  );
};
