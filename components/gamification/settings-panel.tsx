"use client";

import React from "react";
import { useGamificationStore } from "@/store/useGamificationStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Shield, Zap, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function SettingsPanel() {
  const { settings, updateSettings } = useGamificationStore();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Master Switch Section */}
      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">
          System Control
        </h3>
        <Card className={cn(
          "transition-all duration-500 rounded-3xl overflow-hidden border-2",
          settings.isEnabled 
            ? "border-emerald-500/20 bg-emerald-50/5 shadow-lg shadow-emerald-500/5 focus-within:border-emerald-500/40" 
            : "border-slate-200 bg-white grayscale opacity-80"
        )}>
          <CardContent className="p-8">
            <div className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className={cn(
                  "h-16 w-16 rounded-2xl flex items-center justify-center transition-all duration-500",
                  settings.isEnabled ? "bg-emerald-500 shadow-xl shadow-emerald-500/30 scale-110" : "bg-slate-200"
                )}>
                  <Settings className={cn(
                    "h-8 w-8 transition-all",
                    settings.isEnabled ? "text-white rotate-90" : "text-slate-400"
                  )} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    Gamification Framework
                    {settings.isEnabled && (
                      <Badge className="bg-emerald-500 text-white border-none font-black text-[9px] h-5 uppercase tracking-widest px-2 group-hover:animate-pulse">
                        Active
                      </Badge>
                    )}
                  </h3>
                  <p className="text-sm font-semibold text-slate-500 max-w-md leading-relaxed">
                    {settings.isEnabled
                      ? "The system is currently orchestrating points, badges, and progression tracking across all modules."
                      : "The gamification engine is paused. All tracking and reward distribution is suspended."}
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.isEnabled}
                onCheckedChange={(v) => updateSettings({ isEnabled: v })}
                className="scale-150 data-[state=checked]:bg-emerald-500"
              />
            </div>
          </CardContent>
        </Card>
      </section>

      <div className={cn(
        "space-y-10 transition-all duration-700",
        !settings.isEnabled && "opacity-40 pointer-events-none blur-[2px]"
      )}>
        {/* Global Protection & Limits */}
        <section className="space-y-6">
          <div className="px-1 space-y-1">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-3 italic tracking-tight">
              <Shield className="h-5 w-5 text-indigo-500" />
              Sybil Protection & Caps
            </h2>
            <p className="text-sm font-semibold text-slate-400">Establish ceiling limits to maintain the platform economy and prevent grinding exploit.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Daily Threshold", key: "dailyPointsCap", desc: "Reset every 24h" },
              { label: "Weekly Ceiling", key: "weeklyPointsCap", desc: "Reset every Monday" },
              { label: "Monthly Max", key: "monthlyPointsCap", desc: "Reset every 1st" }
            ].map((cap) => (
              <Card key={cap.key} className="bg-white border-slate-200/60 shadow-sm rounded-2xl overflow-hidden group hover:border-indigo-300 transition-all">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      {cap.label}
                    </Label>
                    <Zap className="h-3.5 w-3.5 text-indigo-400 group-hover:text-indigo-500 transition-colors" />
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      min={0}
                      className="h-12 rounded-xl border-slate-100 bg-slate-50/50 font-black text-slate-900 pr-12 text-xl focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all"
                      value={(settings as any)[cap.key]}
                      onChange={(e) => updateSettings({ [cap.key]: Number(e.target.value) })}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-tight">PTS</div>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 italic">
                    {cap.desc} (Set 0 for unlimited)
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Dynamic Point Decay */}
        <section className="space-y-6">
          <Card className={cn(
            "rounded-3xl border border-slate-200/60 overflow-hidden transition-all duration-500",
            settings.pointDecayEnabled ? "bg-white shadow-xl shadow-indigo-500/5 ring-1 ring-indigo-500/5" : "bg-slate-50/50"
          )}>
            <CardHeader className="p-8 border-b border-slate-50">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-3 tracking-tight italic">
                    <div className="p-2.5 rounded-xl bg-orange-500/10">
                      <TrendingDown className="h-5 w-5 text-orange-600" />
                    </div>
                    Economy Balancing (Decay)
                  </CardTitle>
                  <CardDescription className="text-sm font-semibold text-slate-500">
                    Control point inflation by slowly reducing balances of inactive community members.
                  </CardDescription>
                </div>
                <Switch
                  checked={settings.pointDecayEnabled}
                  onCheckedChange={(v) => updateSettings({ pointDecayEnabled: v })}
                  className="scale-125 data-[state=checked]:bg-orange-500"
                />
              </div>
            </CardHeader>
            
            {settings.pointDecayEnabled && (
              <CardContent className="p-8 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-black text-slate-500 uppercase tracking-widest">Reduction Factor</Label>
                      <Badge className="bg-orange-100 text-orange-700 font-bold border-none text-[10px]">INACTIVE ONLY</Badge>
                    </div>
                    <div className="relative group">
                      <Input
                        type="number"
                        min={1}
                        max={50}
                        className="h-14 rounded-2xl border-slate-200 bg-white font-black text-slate-900 pr-12 text-2xl group-hover:border-orange-200 transition-all"
                        value={settings.pointDecayPercentage}
                        onChange={(e) => updateSettings({ pointDecayPercentage: Number(e.target.value) })}
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-xl font-black text-slate-300">%</div>
                    </div>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      This percentage of the total balance will be deducted every cycle once the inactivity threshold is reached.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-xs font-black text-slate-500 uppercase tracking-widest leading-none">Inactivity Threshold</Label>
                    <div className="relative group">
                      <Input
                        type="number"
                        min={7}
                        className="h-14 rounded-2xl border-slate-200 bg-white font-black text-slate-900 pr-16 text-2xl group-hover:border-indigo-200 transition-all"
                        value={settings.pointDecayPeriodDays}
                        onChange={(e) => updateSettings({ pointDecayPeriodDays: Number(e.target.value) })}
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-widest">DAYS</div>
                    </div>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      The countdown starts from the user&apos;s last tracked interaction. Once it hits zero, the reduction factor applies.
                    </p>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </section>

        {/* Real-time Config Overview */}
        <section className="pt-4">
          <div className="rounded-4xl bg-slate-900 p-8 shadow-2xl shadow-indigo-500/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-1000">
               <Zap className="h-32 w-32 text-indigo-400" />
            </div>
            
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-12">
              {[
                { l: "Daily Cap", v: settings.dailyPointsCap || "∞", u: "PTS" },
                { l: "Weekly Cap", v: settings.weeklyPointsCap || "∞", u: "PTS" },
                { l: "Monthly Cap", v: settings.monthlyPointsCap || "∞", u: "PTS" },
                { 
                  l: "Decay Engine", 
                  v: settings.pointDecayEnabled ? `${settings.pointDecayPercentage}%` : "OFF", 
                  u: settings.pointDecayEnabled ? `per ${settings.pointDecayPeriodDays}d` : "" 
                }
              ].map((item, i) => (
                <div key={i} className="space-y-2 border-l border-white/10 pl-6 first:border-none first:pl-0">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">{item.l}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-black text-white tracking-tighter">{item.v}</p>
                    <span className="text-[10px] font-black text-slate-500 uppercase">{item.u}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
