"use client";

import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { Settings, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export const NavigationManager = () => {
  const { globalHeader, selectModule, selectedModuleId } =
    useWebsiteBuilderStore();

  const isSelected = selectedModuleId === globalHeader.id;

  return (
    <div className="space-y-1">
      <h4 className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wider">
        Navigation
      </h4>

      <div
        onClick={() => selectModule(globalHeader.id)}
        className={cn(
          "cursor-pointer p-2 rounded-lg border transition-all",
          isSelected
            ? "bg-primary/5 border-primary/40 ring-1 ring-primary/20"
            : "hover:bg-muted/40 border-transparent hover:border-border/50",
        )}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "p-1.5 rounded-md",
              isSelected ? "bg-primary/10" : "bg-muted/60",
            )}
          >
            <Menu className="h-3 w-3 text-primary/70" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-xs">Navbar</div>
            <div className="text-[10px] text-muted-foreground/60 truncate">
              {globalHeader.layout} · All pages
            </div>
          </div>
          <Settings
            className={cn(
              "h-3 w-3 shrink-0 transition-colors",
              isSelected ? "text-primary/70" : "text-muted-foreground/40",
            )}
          />
        </div>
      </div>
    </div>
  );
};
