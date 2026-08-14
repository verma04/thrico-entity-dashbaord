import React from "react";
import { Sparkles, RectangleHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PolarisSidebarCard } from "@/components/gamification/shared/polaris-form-ui";

export function ScratchCardPreview() {
  return (
    <PolarisSidebarCard
      title="Member Experience Preview"
      badge="Live Scratch"
      icon={RectangleHorizontal}
    >
      <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-950 text-white overflow-hidden flex flex-col p-2 relative shadow-md">
        {/* Subtle glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 bg-[#008060]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 p-4 flex flex-col items-center relative z-10 space-y-3">
          {/* Header */}
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[9px] font-bold uppercase tracking-widest text-[#95BF47]">
              <Sparkles className="h-2.5 w-2.5" />
              Daily Scratch
            </div>
            <h4 className="text-sm font-bold text-white tracking-tight">
              Scratch & Win
            </h4>
            <p className="text-[10px] text-zinc-400">
              Reveal hidden symbols for a chance to win prizes
            </p>
          </div>

          {/* Interactive Scratch Foil Area */}
          <div className="w-full py-2 flex items-center justify-center">
            <div className="relative w-full aspect-[16/10] rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden group/card shadow-inner cursor-crosshair">
              {/* Foil Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 via-zinc-600 to-zinc-800 opacity-95" />
              <div className="relative flex flex-col items-center gap-1.5 z-10">
                <Sparkles className="h-6 w-6 text-zinc-400 group-hover/card:text-[#95BF47] group-hover/card:scale-110 transition-all" />
                <span className="text-[10px] font-black text-zinc-300 tracking-widest uppercase">
                  Scratch Area
                </span>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="w-full space-y-2 pt-1">
            <Button
              disabled
              className="w-full h-10 rounded-xl bg-white text-zinc-950 font-bold text-xs shadow-sm border-none cursor-default opacity-95"
            >
              Claim Free Scratch Card
            </Button>
            <p className="text-center text-[10px] text-zinc-400 font-medium">
              1 free card available per qualified member
            </p>
          </div>
        </div>
      </div>
    </PolarisSidebarCard>
  );
}
