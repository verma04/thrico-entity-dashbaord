import React from "react";
import { Dices, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WheelPreview } from "./wheel-preview";
import { WheelSegment } from "./types";
import { PolarisSidebarCard } from "@/components/gamification/shared/polaris-form-ui";

export function GamePreviewMockup({
  segments,
  costPerSpin,
  maxSpinsPerDay,
  currencyName = "Points",
}: {
  segments: WheelSegment[];
  costPerSpin: number;
  maxSpinsPerDay: number;
  currencyName?: string;
}) {
  return (
    <PolarisSidebarCard
      title="Member Experience Preview"
      badge="Live Wheel"
      icon={Dices}
    >
      <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-950 text-white overflow-hidden flex flex-col p-2 relative shadow-md">
        {/* Subtle background gradient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 bg-[#008060]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 p-4 flex flex-col items-center relative z-10 space-y-3">
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[9px] font-bold uppercase tracking-widest text-[#95BF47]">
              <Sparkles className="h-2.5 w-2.5" />
              Daily Spin
            </div>
            <h4 className="text-sm font-bold text-white tracking-tight">
              Test Your Luck
            </h4>
            <p className="text-[10px] text-zinc-400">
              Spin to win points and exclusive vouchers
            </p>
          </div>

          {/* Wheel Canvas Container */}
          <div className="py-2 flex items-center justify-center scale-95">
            <WheelPreview segments={segments} />
          </div>

          {/* Bottom Call to Action */}
          <div className="w-full space-y-2 pt-2">
            <Button
              disabled
              className="w-full h-10 rounded-xl bg-white text-zinc-950 font-bold text-xs shadow-sm border-none cursor-default opacity-95"
            >
              Spin for {costPerSpin} {currencyName}
            </Button>
            <p className="text-center text-[10px] text-zinc-400 font-medium">
              {maxSpinsPerDay > 0
                ? `${maxSpinsPerDay} spins per member / day`
                : "Unlimited spins per day"}
            </p>
          </div>
        </div>
      </div>
    </PolarisSidebarCard>
  );
}
