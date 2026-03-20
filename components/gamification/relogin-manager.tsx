"use client";

import React, { useState } from "react";
import { useGamificationStore } from "@/store/useGamificationStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Trash2, Calendar, Flame, Gift, Trophy, Settings2, Info, ShieldCheck, Zap, Activity, RotateCcw, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

export function ReloginManager() {
  const {
    reloginConfig,
    updateReloginConfig,
    addStreakBonus,
    removeStreakBonus,
  } = useGamificationStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBonus, setNewBonus] = useState({
    days: 0,
    bonusPoints: 0,
    isMilestone: false,
  });

  const handleAddBonus = () => {
    if (newBonus.days > 0 && newBonus.bonusPoints > 0) {
      addStreakBonus(newBonus);
      setIsDialogOpen(false);
      setNewBonus({ days: 0, bonusPoints: 0, isMilestone: false });
    }
  };

  return (
    <EcosystemWrapper anonymized-1="streak-calibration">
      <EcosystemHeader
        title="Continuity Protocol"
        badgeText="Gamification"
        description="Establish automated engagement loops. Configure streak bonuses and daily issuance to drive systematic community retention."
        icon={Flame}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full gap-6">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                 <div className={cn(
                    "h-3 w-3 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]",
                    reloginConfig.isEnabled ? "bg-emerald-500" : "bg-slate-400"
                 )} />
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Continuity {reloginConfig.isEnabled ? "Energized" : "Static"}
                 </span>
              </div>
              <div className="h-4 w-px bg-slate-200" />
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                 <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
                 <span>Stability Locked</span>
              </div>
           </div>

           <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200/60 shadow-sm">
             <div className="flex flex-col items-end">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 Emission Switch
               </span>
               <span className={cn(
                 "text-[9px] font-bold uppercase",
                 reloginConfig.isEnabled ? "text-emerald-600" : "text-slate-400"
               )}>
                 {reloginConfig.isEnabled ? "Live" : "Standby"}
               </span>
             </div>
             <div className="h-8 w-px bg-slate-200" />
             <Switch
               checked={reloginConfig.isEnabled}
               onCheckedChange={(v) => updateReloginConfig({ isEnabled: v })}
               className="data-[state=checked]:bg-emerald-500 scale-110"
             />
           </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-12 p-8 lg:p-12">
        <div className={cn(
          "space-y-12 transition-all duration-700",
          !reloginConfig.isEnabled && "opacity-40 grayscale pointer-events-none blur-[2px] scale-[0.98]"
        )}>
           {/* Invariant Constants Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="p-10 rounded-[3rem] bg-indigo-600 shadow-2xl shadow-indigo-100 group transition-all duration-500 overflow-hidden relative border-none">
                 <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                    <Gift className="h-32 w-32 text-white" />
                 </div>
                 <div className="relative z-10 space-y-8">
                    <div className="flex items-center gap-3">
                       <Zap className="h-5 w-5 text-indigo-200" />
                       <h3 className="text-xl font-black text-white tracking-tight italic uppercase">Daily Emission</h3>
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase text-indigo-100/60 tracking-widest ml-1">Base Point Yield</Label>
                       <div className="relative">
                          <Input
                             type="number"
                             min={1}
                             className="h-16 rounded-2xl border-white/20 bg-white/10 text-white font-black text-3xl pr-20 focus:ring-4 focus:ring-white/5 transition-all outline-none"
                             value={reloginConfig.dailyLoginPoints}
                             onChange={(e) => updateReloginConfig({ dailyLoginPoints: Number(e.target.value) })}
                          />
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-indigo-200 uppercase tracking-widest">PTS / DAY</div>
                       </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-bold text-indigo-100 uppercase tracking-tight italic">
                       Inbound entities receive this yield on initial manifestation cycle.
                    </div>
                 </div>
              </div>

              <div className="p-10 rounded-[3rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 group transition-all duration-500 overflow-hidden relative">
                 <div className="absolute top-0 right-0 p-8 opacity-5 scale-150 -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                    <Settings2 className="h-32 w-32 text-slate-900" />
                 </div>
                 <div className="relative z-10 space-y-8">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <Activity className="h-5 w-5 text-indigo-600" />
                          <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Temporal Rules</h3>
                       </div>
                       <Badge variant="outline" className="border-slate-100 bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest">Timezone Agnostic</Badge>
                    </div>

                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Manifest Grace Window</Label>
                       <div className="relative">
                          <Input
                             type="number"
                             min={0}
                             max={24}
                             className="h-16 rounded-2xl border-slate-100 bg-slate-50/50 font-black text-3xl pr-24 focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-900"
                             value={reloginConfig.gracePeriodHours}
                             onChange={(e) => updateReloginConfig({ gracePeriodHours: Number(e.target.value) })}
                          />
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-widest">HOURS RESET</div>
                       </div>
                    </div>

                    <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-lg transition-all">
                       <div className="space-y-1">
                          <Label className="text-[11px] font-black text-slate-900 uppercase tracking-tight italic">Streak Recovery</Label>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Retroactive progress buy-back</p>
                       </div>
                       <Switch
                          checked={reloginConfig.streakRecoveryEnabled}
                          onCheckedChange={(v) => updateReloginConfig({ streakRecoveryEnabled: v })}
                          className="data-[state=checked]:bg-indigo-600"
                       />
                    </div>
                 </div>
              </div>
           </div>

           {/* Milestone Progression Section */}
           <div className="space-y-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
                 <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-[1.5rem] bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200">
                       <Trophy className="h-6 w-6" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Continuity Milestones</h3>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-none mt-1">Multi-cycle achievement yield bonuses</p>
                    </div>
                 </div>

                 <Button 
                    onClick={() => setIsDialogOpen(true)}
                    className="h-12 px-8 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-[11px] uppercase tracking-wider gap-3 shadow-xl shadow-slate-200 transition-all active:scale-95 group"
                 >
                    <Plus className="h-4 w-4 transition-transform group-hover:scale-125" />
                    Instantiate Milestone
                 </Button>
              </div>

              <div className="relative pl-12">
                 {/* Timeline line */}
                 <div className="absolute left-6 top-0 bottom-0 w-1 bg-linear-to-b from-indigo-500 via-purple-500 to-transparent rounded-full opacity-10" />

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...reloginConfig.streakBonuses]
                      .sort((a, b) => a.days - b.days)
                      .map((bonus, index) => (
                      <div key={bonus.days} className="relative group">
                         {/* Connection to line */}
                         <div className="absolute -left-[25px] top-1/2 -translate-y-1/2 w-6 h-1 bg-slate-100 group-hover:bg-indigo-200 transition-colors" />
                         <div className={cn(
                            "absolute left-[-29px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 bg-white transition-all duration-500 group-hover:scale-150 group-hover:bg-indigo-600",
                            bonus.isMilestone ? "border-amber-400" : "border-slate-300"
                         )} />

                         <div className={cn(
                            "p-8 rounded-[3rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/30 transition-all duration-500 group-hover:shadow-2xl group-hover:translate-y-[-8px] group-hover:border-slate-200 relative overflow-hidden",
                            bonus.isMilestone && "border-amber-100 bg-amber-50/10"
                         )}>
                            {bonus.isMilestone && (
                               <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                                  <Sparkles className="h-16 w-16 text-amber-500" />
                               </div>
                            )}
                            
                            <div className="flex items-center justify-between mb-8">
                               <div className={cn(
                                  "h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg",
                                  bonus.isMilestone ? "bg-amber-100 text-amber-600 shadow-amber-100" : "bg-indigo-50 text-indigo-600 shadow-indigo-50"
                               )}>
                                  <Flame className="h-7 w-7" />
                               </div>
                               <Button
                                 variant="ghost"
                                 size="icon"
                                 className="h-10 w-10 text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all rounded-xl opacity-0 group-hover:opacity-100"
                                 onClick={() => removeStreakBonus(bonus.days)}
                               >
                                 <Trash2 className="h-5 w-5" />
                               </Button>
                            </div>

                            <div className="space-y-4">
                               <div className="flex items-baseline gap-2">
                                  <span className="text-4xl font-black text-slate-900 tracking-tighter">{bonus.days}</span>
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Days Continuous</span>
                               </div>
                               <div className={cn(
                                  "p-4 rounded-2xl flex items-center justify-between",
                                  bonus.isMilestone ? "bg-amber-100/50" : "bg-slate-50"
                               )}>
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Yield Bonus</span>
                                  <div className="flex items-center gap-1.5 font-black text-slate-900">
                                     <Plus className="h-3 w-3 text-emerald-500" />
                                     {bonus.bonusPoints}
                                     <span className="text-[9px] text-slate-400 font-bold ml-0.5">PTS</span>
                                  </div>
                               </div>
                            </div>

                            {bonus.isMilestone && (
                               <div className="mt-6 flex items-center gap-2">
                                  <div className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 font-black text-[9px] uppercase tracking-widest flex items-center gap-1.5">
                                     <Star className="h-2.5 w-2.5 fill-amber-700" />
                                     Critical Milestone
                                  </div>
                               </div>
                            )}
                         </div>
                      </div>
                    ))}

                    {reloginConfig.streakBonuses.length === 0 && (
                      <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-24 bg-white/50 border border-dashed border-slate-200 rounded-[3rem] opacity-60">
                        <div className="h-24 w-24 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                          <Flame className="h-10 w-10 text-slate-200" />
                        </div>
                        <p className="font-black text-slate-400 text-lg uppercase tracking-tight italic">No milestones defined yet.</p>
                        <p className="text-[10px] font-extrabold text-slate-300 uppercase tracking-[0.2em] mt-2">Initialize the continuation loop to proceed.</p>
                      </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      </EcosystemContainer>

      {/* Milestone Dialog - Refactored for Premium Look */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-xl rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-slate-900 p-10 text-white relative">
             <div className="absolute top-0 right-0 p-10 opacity-10">
                <Trophy className="h-24 w-24" />
             </div>
             <DialogHeader>
                <DialogTitle className="text-3xl font-black italic tracking-tight uppercase">Instantiate Milestone</DialogTitle>
                <div className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Define a new temporal achievement yield</div>
             </DialogHeader>
          </div>

          <div className="p-12 space-y-10">
             <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                   <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Manifest Cycle (Day)</Label>
                   <Input
                     type="number"
                     min={1}
                     className="h-16 rounded-2xl border-slate-100 bg-slate-50 font-black text-3xl px-6 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
                     placeholder="7"
                     value={newBonus.days || ""}
                     onChange={(e) => setNewBonus({ ...newBonus, days: Number(e.target.value) })}
                   />
                </div>
                <div className="space-y-3">
                   <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Bonus Yield (PTS)</Label>
                   <Input
                     type="number"
                     min={1}
                     className="h-16 rounded-2xl border-slate-100 bg-slate-50 font-black text-3xl px-6 text-indigo-600 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
                     placeholder="50"
                     value={newBonus.bonusPoints || ""}
                     onChange={(e) => setNewBonus({ ...newBonus, bonusPoints: Number(e.target.value) })}
                   />
                </div>
             </div>

             <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-white transition-colors">
                <div className="space-y-1">
                   <Label className="text-[11px] font-black text-slate-900 uppercase tracking-tight italic">Major Milestone Invariant</Label>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Enable special manifestation priority status</p>
                </div>
                <Switch
                  checked={newBonus.isMilestone}
                  onCheckedChange={(v) => setNewBonus({ ...newBonus, isMilestone: v })}
                  className="data-[state=checked]:bg-indigo-600 scale-110"
                />
             </div>
          </div>

          <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-4">
             <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl font-bold h-12 px-8 uppercase text-[11px] tracking-widest">Abort</Button>
             <Button 
                onClick={handleAddBonus} 
                className="rounded-2xl font-black h-14 px-10 bg-slate-900 hover:bg-black text-white shadow-2xl shadow-slate-200 transition-all active:scale-95 uppercase text-[11px] tracking-widest"
             >
                Commit Milestone
             </Button>
          </div>
        </DialogContent>
      </Dialog>
    </EcosystemWrapper>
  );
}
