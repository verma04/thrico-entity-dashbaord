import React from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ScratchCardPreview() {
  return (
    <div className="relative group mx-auto max-w-[340px]">
      {/* Glowing ambient background shadow */}
      <div className="absolute -inset-0.5 bg-gradient-to-b from-indigo-500/20 to-purple-500/20 rounded-[36px] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Mock Phone Frame */}
      <div className="relative flex flex-col w-full bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl border border-zinc-200/50 dark:border-white/5 overflow-hidden text-zinc-900 dark:text-zinc-100 p-2">
        <div className="flex-1 rounded-[24px] bg-indigo-950 overflow-hidden flex flex-col relative border border-indigo-900/50 shadow-inner">
          {/* Game Header */}
          <div className="p-5 text-center relative z-10 space-y-1 bg-gradient-to-b from-indigo-900 to-transparent">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-2">
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-200">
                Daily Scratch
              </span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Scratch & Win
            </h3>
            <p className="text-[10px] text-indigo-300">
              Reveal hidden symbols for a chance to win.
            </p>
          </div>

          {/* Canvas / Scratch Area */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 min-h-[220px]">
            {/* Subtle backglow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/30 rounded-full blur-2xl" />

            {/* The Card */}
            <div className="relative w-full aspect-[4/3] rounded-xl bg-zinc-300 dark:bg-zinc-800 border-2 border-dashed border-zinc-400 dark:border-zinc-600 flex items-center justify-center overflow-hidden group/card cursor-crosshair">
              {/* Silver foil texture simulation */}
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-300 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-800 opacity-90" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] opacity-30 mix-blend-overlay" />

              <div className="relative flex flex-col items-center gap-2">
                <Sparkles className="h-8 w-8 text-zinc-500 dark:text-zinc-400 group-hover/card:animate-pulse" />
                <span className="text-xs font-black text-zinc-600 dark:text-zinc-300 tracking-widest uppercase">
                  Scratch Here
                </span>
              </div>
            </div>
          </div>

          {/* Game Bottom Bar */}
          <div className="p-6 relative z-10 mt-auto bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">
                Live Preview
              </span>
            </div>
            <Button
              disabled
              className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(245,158,11,0.4)] border-none"
            >
              Get Free Card
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
