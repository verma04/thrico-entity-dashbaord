"use client";

import React from "react";
import { Trophy, Timer, Sparkles } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

const CompetitionsPage = () => {
  return (
    <EcosystemWrapper anonymized-1="competitions-overview">
      <EcosystemHeader
        title="Community Competitions"
        badgeText="Beta"
        description="Launch time-bound challenges and seasonal events to drive high-intensity community participation."
        icon={Trophy}
      />

      <EcosystemActionBar>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 italic animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Module in Development</span>
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="py-24 border-none bg-transparent shadow-none ring-0">
        <div className="max-w-xl mx-auto text-center space-y-8">
          <div className="relative inline-block group">
            <div className="absolute -inset-4 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full blur-xl opacity-10 group-hover:opacity-20 transition-opacity" />
            <div className="relative h-32 w-32 bg-white rounded-3xl border border-slate-100 shadow-2xl flex items-center justify-center mx-auto ring-1 ring-slate-200/50 group-hover:scale-105 transition-transform duration-500">
               <Timer className="h-16 w-16 text-indigo-600 animate-in fade-in zoom-in spin-in-12 duration-1000" />
            </div>
            <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-amber-400 rounded-xl border-4 border-white shadow-lg flex items-center justify-center text-xl">
              🚧
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Competitions are Coming</h2>
            <p className="text-slate-500 font-medium leading-relaxed">
              We're building a powerful engine for cross-community challenges, 
              seasonal leaderboards, and exclusive reward tracks.
            </p>
          </div>

          <div className="pt-6 grid grid-cols-2 gap-4 text-left">
            {[
              { label: "Timed Sprints", desc: "Short duration peaks" },
              { label: "Team Battles", desc: "Group vs Group play" },
              { label: "Badge Quest", desc: "Progressive unlocks" },
              { label: "Global Events", desc: "Site-wide seasons" },
            ].map((feature) => (
              <div key={feature.label} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:border-indigo-100 hover:shadow-md group/item">
                <p className="text-xs font-black text-indigo-600 uppercase tracking-[0.15em] mb-1 group-hover/item:text-indigo-500">{feature.label}</p>
                <p className="text-xs font-bold text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
};

export default CompetitionsPage;
