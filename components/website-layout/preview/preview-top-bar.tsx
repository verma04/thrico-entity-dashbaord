import React from "react";
import { Badge } from "@/components/ui/badge";
import { Palette, Radio } from "lucide-react";

interface PreviewTopBarProps {
  currentTheme: string;
  children: React.ReactNode;
}

export const PreviewTopBar = ({
  currentTheme,
  children,
}: PreviewTopBarProps) => {
  return (
    <div className="h-11 border-b border-[#d2d5d9] dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md flex items-center justify-between px-3.5 sticky top-0 z-20 shrink-0 shadow-2xs">
      {children}
      <div className="flex items-center gap-2 shrink-0">
        <Badge
          variant="outline"
          className="text-[10px] capitalize font-medium border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7] dark:bg-zinc-800 text-[#616161] dark:text-zinc-300 gap-1 hidden sm:inline-flex"
        >
          <Palette className="h-3 w-3 text-muted-foreground" />
          {currentTheme} Theme
        </Badge>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10.5px] font-medium border border-emerald-200/80 dark:border-emerald-800/80 shadow-2xs">
          <Radio className="h-3 w-3 animate-pulse text-emerald-600 dark:text-emerald-400" />
          <span>Interactive Canvas</span>
        </span>
      </div>
    </div>
  );
};
