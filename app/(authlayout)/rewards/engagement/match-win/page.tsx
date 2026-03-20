"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatchWinManager } from "@/components/rewards/match-win/match-win-manager";
import { MatchWinGame } from "@/components/rewards/match-win/match-win-game";
import { Settings2, PlayCircle, Trophy, Gamepad2, LayoutDashboard } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

export default function MatchWinPage() {
  return (
    <EcosystemWrapper anonymized-1="match-win-system">
      <EcosystemHeader
        title="Artifact Matcher"
        badgeText="Core Mechanics"
        description="Administer the 3-column symbol alignment system. Configure manifestation probabilities and reward yields."
        icon={Trophy}
      />

      <Tabs defaultValue="manage" className="w-full">
        <EcosystemActionBar shadow="none">
          <div className="flex items-center justify-between w-full">
            <TabsList className="bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/60 flex items-center gap-1">
              <TabsTrigger 
                value="manage" 
                className="rounded-xl px-6 py-2.5 font-black text-[10px] uppercase tracking-wider gap-2 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-lg shadow-slate-200 transition-all"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Manifest Manager
              </TabsTrigger>
              <TabsTrigger 
                value="play" 
                className="rounded-xl px-6 py-2.5 font-black text-[10px] uppercase tracking-wider gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg shadow-indigo-100 transition-all"
              >
                <Gamepad2 className="h-3.5 w-3.5" />
                Live Preview
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-4 px-2">
               <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Stable Invariants</span>
            </div>
          </div>
        </EcosystemActionBar>

        <EcosystemContainer className="p-0">
          <TabsContent value="manage" className="m-0 focus-visible:outline-hidden">
            <MatchWinManager />
          </TabsContent>

          <TabsContent value="play" className="m-0 focus-visible:outline-hidden p-8">
            <div className="max-w-[1000px] mx-auto p-12 rounded-[4rem] bg-slate-900 shadow-2xl shadow-indigo-900/10 border border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-45 transition-transform duration-[2000ms]">
                  <Trophy className="h-64 w-64 text-indigo-500" />
               </div>
               <div className="relative z-10">
                  <div className="text-center mb-12">
                     <h2 className="text-2xl font-black italic text-white tracking-tight uppercase">Manifestation Chamber</h2>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">Real-time Frontend Interaction Protocol</p>
                  </div>
                  <MatchWinGame />
               </div>
            </div>
          </TabsContent>
        </EcosystemContainer>
      </Tabs>
    </EcosystemWrapper>
  );
}
