import React from "react";
import { Dices } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WheelPreview } from "./wheel-preview";
import { WheelSegment } from "./types";

export function GamePreviewMockup({
  segments,
  costPerSpin,
  maxSpinsPerDay,
}: {
  segments: WheelSegment[];
  costPerSpin: number;
  maxSpinsPerDay: number;
}) {
  return (
    <div className="relative group mx-auto max-w-[340px]">
      {/* Glowing ambient background shadow */}
      <div className="absolute -inset-0.5 bg-gradient-to-b from-indigo-500/20 to-purple-500/20 rounded-[36px] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Mock Phone Frame */}
      <div className="relative flex flex-col w-full bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl border border-zinc-200/50 dark:border-white/5 overflow-hidden text-zinc-900 dark:text-zinc-100 p-2">
        <div className="flex-1 rounded-[24px] bg-indigo-950 overflow-hidden flex flex-col relative border border-indigo-900/50 shadow-inner">
          
          {/* Game Header */}
          <div className="p-5 text-center relative z-10 space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-2">
              <Dices className="h-3 w-3 text-amber-400" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-200">Daily Spin</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">Test Your Luck</h3>
            <p className="text-[10px] text-indigo-300">Spin the wheel to win exclusive rewards.</p>
          </div>

          {/* Canvas Container */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
            {/* Subtle backglow behind the wheel */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/30 rounded-full blur-2xl" />
            <div className="relative scale-110 drop-shadow-2xl">
              <WheelPreview segments={segments} />
            </div>
          </div>

          {/* Game Bottom Bar */}
          <div className="p-6 relative z-10 mt-auto bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Live Preview</span>
            </div>
            <Button disabled className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(245,158,11,0.4)] border-none">
              Spin For {costPerSpin} TC
            </Button>
            <p className="text-center text-[9px] text-indigo-400/70 mt-3 font-medium">
              {maxSpinsPerDay} Spins Remaining Today
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
