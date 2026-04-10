"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trophy, TrendingUp, AlertTriangle, Shield, Info, Dices, Gift, Star } from "lucide-react";

interface EconomySidebarProps {
  costPerPlay: number;
  setCostPerPlay: (v: number) => void;
  maxPlaysPerDay: number;
  setMaxPlaysPerDay: (v: number) => void;
  festivalMode: boolean;
  setFestivalMode: (v: boolean) => void;
  avgPayout: number;
  profitMargin: number;
}

export const EconomySidebar = ({
  costPerPlay,
  setCostPerPlay,
  maxPlaysPerDay,
  setMaxPlaysPerDay,
  festivalMode,
  setFestivalMode,
  avgPayout,
  profitMargin,
}: EconomySidebarProps) => {
  const isHealthy = profitMargin >= 20 && profitMargin <= 40;

  return (
    <div className="space-y-6">
      {/* Vibe Check: Live Preview (Mobile Mockup) */}
      <div className="relative group mx-auto max-w-[340px]">
        {/* Glowing ambient background shadow */}
        <div className="absolute -inset-0.5 bg-gradient-to-b from-indigo-500/20 to-purple-500/20 rounded-[36px] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Mock Phone Frame */}
        <div className="relative flex flex-col w-full bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl border border-zinc-200/50 dark:border-white/5 overflow-hidden text-zinc-900 dark:text-zinc-100 p-2">
          <div className="flex-1 rounded-[24px] bg-indigo-950 overflow-hidden flex flex-col relative border border-indigo-900/50 shadow-inner">
            
            {/* Game Header */}
            <div className="p-5 text-center relative z-10 space-y-1 bg-gradient-to-b from-indigo-900 to-transparent">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-2">
                <Trophy className="h-3 w-3 text-amber-400" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-200">Daily Match</span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Match & Win</h3>
              <p className="text-[10px] text-indigo-300">Align 3 symbols to claim the jackpot.</p>
            </div>

            {/* Canvas / Game Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 min-h-[220px]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/30 rounded-full blur-2xl" />
              
              {/* Slot Machine Display */}
              <div className="relative w-full bg-indigo-900/50 border-4 border-indigo-500/30 rounded-2xl p-4 flex justify-between gap-3 shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)]">
                {[Dices, Star, Gift].map((Icon, idx) => (
                  <div key={idx} className="flex-1 aspect-square bg-white dark:bg-zinc-800 rounded-xl flex items-center justify-center shadow-md border-b-4 border-zinc-300 dark:border-zinc-900 overflow-hidden relative group/slot">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5" />
                    <Icon className="h-8 w-8 text-indigo-500 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            {/* Game Bottom Bar */}
            <div className="p-6 relative z-10 mt-auto bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Live Preview</span>
              </div>
              <Button disabled className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(245,158,11,0.4)] border-none">
                Play For {costPerPlay} TC
              </Button>
              <p className="text-center text-[9px] text-indigo-400/70 mt-3 font-medium">
                {maxPlaysPerDay} Plays Remaining Today
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Economy Monitor */}
      <div className="rounded-[24px] border border-border bg-card p-5 max-w-[340px] mx-auto shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
            <Shield className="h-4 w-4 text-orange-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground leading-none">Economy Monitor</h4>
            <p className="text-[10px] font-medium text-muted-foreground mt-1 uppercase tracking-wider">Health Check</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/50">
            <span className="text-xs font-semibold text-muted-foreground">Avg. Payout</span>
            <span className="text-sm font-bold font-mono text-foreground">{avgPayout.toFixed(1)} <span className="text-[10px]">TC</span></span>
          </div>
          
          <div className={cn(
            "p-4 rounded-2xl border transition-colors",
            isHealthy ? "bg-emerald-50/50 border-emerald-200" : "bg-rose-50/50 border-rose-200"
          )}>
            <div className="flex items-center justify-between mb-1">
              <p className={cn("text-xs font-bold uppercase tracking-wider", isHealthy ? "text-emerald-600" : "text-rose-600")}>Profit Margin</p>
              {isHealthy ? <TrendingUp className="h-4 w-4 text-emerald-500" /> : <AlertTriangle className="h-4 w-4 text-rose-500" />}
            </div>
            <div className="flex items-baseline gap-2">
              <p className={cn("text-3xl font-black font-mono tracking-tighter", isHealthy ? "text-emerald-700" : "text-rose-700")}>
                {profitMargin.toFixed(1)}%
              </p>
            </div>
            <p className={cn("text-[10px] font-bold mt-1 uppercase tracking-wider", isHealthy ? "text-emerald-600/70" : "text-rose-600/70")}>Target: 20–40%</p>
          </div>

          {!isHealthy && (
            <div className="flex gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 items-start">
              <Info className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
              <p className="text-[11px] font-medium text-rose-700 leading-relaxed">
                {profitMargin < 20 ? "Margin too low. Increase play cost or adjust combo probabilities." : "Margin too high. Game may feel unrewarding; consider better payouts."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Game Constants Configuration */}
      <div className="rounded-[24px] border border-border bg-card p-5 max-w-[340px] mx-auto shadow-sm">
        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-5">Core Values</h4>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground">Play Cost (TC)</Label>
            <Input
              type="number"
              value={costPerPlay}
              onChange={(e) => setCostPerPlay(Number(e.target.value))}
              className="bg-muted/30"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground">Max Plays / Day</Label>
            <Input
              type="number"
              value={maxPlaysPerDay}
              onChange={(e) => setMaxPlaysPerDay(Number(e.target.value))}
              className="bg-muted/30"
            />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border mt-2">
            <Label className="text-xs font-semibold text-muted-foreground">Jackpot Animations</Label>
            <Switch checked={festivalMode} onCheckedChange={setFestivalMode} className="data-[state=checked]:bg-amber-500" />
          </div>
        </div>
      </div>
    </div>
  );
};
