import React from "react";
import { EyeOff } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center py-20 space-y-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60 border border-border/80">
        <EyeOff className="h-6 w-6 text-muted-foreground/70" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">
          All sections are currently hidden
        </p>
        <p className="text-xs text-muted-foreground max-w-sm">
          Enable or add sections from the left panel to preview them live on your
          page canvas.
        </p>
      </div>
    </div>
  );
};
