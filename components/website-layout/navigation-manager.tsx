"use client";

import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { Settings, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export const NavigationManager = () => {
  const { globalHeader, selectModule, selectedModuleId } = useWebsiteBuilderStore();
  
  const isSelected = selectedModuleId === globalHeader.id;


  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase">
          Global Navigation
        </h3>
      </div>
      
      <div
        onClick={() => selectModule(globalHeader.id)}
        className={cn(
          "cursor-pointer hover:bg-muted/50 p-3 rounded-lg border transition-all",
          isSelected && "bg-primary/10 border-primary ring-2 ring-primary/20"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-md">
            <Menu className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-sm">{globalHeader.name}</div>
            <div className="text-xs text-muted-foreground">
              Layout: {globalHeader.layout} • {globalHeader.visibility}
            </div>
          </div>
          <Settings className={cn(
            "h-4 w-4 transition-colors",
            isSelected ? "text-primary" : "text-muted-foreground"
          )} />
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground px-1">
        This navigation appears on all pages
      </p>
    </div>
  );
};
