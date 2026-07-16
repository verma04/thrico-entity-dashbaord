import React from "react";
import { Puzzle } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

export const getNavIcon = (icon: string | null, enabled: boolean = true) => {
  if (!icon || typeof icon !== "string" || !(icon in LucideIcons)) {
    return <Puzzle className={cn("h-4 w-4", enabled ? "text-muted-foreground" : "text-muted-foreground/40")} />;
  }
  const IconComponent = (LucideIcons as any)[icon] as React.ElementType;
  return <IconComponent className={cn("h-4 w-4", enabled ? "text-muted-foreground" : "text-muted-foreground/40")} />;
};
