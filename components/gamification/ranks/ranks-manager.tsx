"use client";

import React, { useState, useMemo } from "react";
import {
  useGetRanks,
  useCreateRank,
  useUpdateRank,
  useUpdateRankOrder,
  Rank,
} from "@/graphql/actions";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { StatsCards } from "./stats-cards";
import { RankList } from "./rank-list";
import { RankDialog } from "./rank-dialog";
import { Crown, Plus, LayoutGrid, Info, ShieldCheck, Activity, RotateCcw, Save, TrendingUp } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";

export function RanksManager() {
  const { data: ranksData, refetch, loading } = useGetRanks();
  const ranks = ranksData?.getRanks || [];

  const [createRank, { loading: creating }] = useCreateRank({
    onCompleted: () => refetch(),
  });
  const [updateRank, { loading: updating }] = useUpdateRank({
    onCompleted: () => refetch(),
  });
  const [updateRankOrder] = useUpdateRankOrder({
    onCompleted: () => refetch(),
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRank, setEditingRank] = useState<Rank | null>(null);

  const handleOpenDialog = (rank?: Rank) => {
    setEditingRank(rank || null);
    setIsDialogOpen(true);
  };

  const handleSave = async (formData: any) => {
    try {
      if (editingRank) {
        await updateRank({
          variables: {
            id: editingRank.id,
            input: formData,
          },
        });
      } else {
        await createRank({
          variables: {
            input: formData,
          },
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving rank:", error);
    }
  };

  const handleMoveRank = async (index: number, direction: "up" | "down") => {
    const sortedRanks = [...ranks].sort((a, b) => a.order - b.order);
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= sortedRanks.length) return;

    const rankOrders = [
      { id: sortedRanks[index].id, order: sortedRanks[targetIndex].order },
      { id: sortedRanks[targetIndex].id, order: sortedRanks[index].order },
    ];

    try {
      await updateRankOrder({
        variables: { rankOrders },
      });
    } catch (error) {
      console.error("Error updating rank order:", error);
    }
  };

  return (
    <EcosystemWrapper anonymized-1="prestige-hierarchy">
      <EcosystemHeader
        title="Rank Hierarchy"
        badgeText="Gamification Protocol"
        description="Define the archetypal progression path. Configure point thresholds and prestige levels for community member advancement."
        icon={Crown}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                 <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Hierarchy Live
                 </span>
              </div>
              <div className="h-4 w-px bg-slate-200" />
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                 <ShieldCheck className="h-3.5 w-3.5 text-orange-500" />
                 <span>Stable Invariants</span>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => refetch()}
                className="h-10 px-4 rounded-xl border-slate-200 font-bold text-slate-600 gap-2 hover:bg-slate-50 transition-all"
              >
                <RotateCcw className={cn("h-4 w-4", loading && "animate-spin")} />
                Resync
              </Button>
              <Button
                onClick={() => handleOpenDialog()}
                className="h-10 px-8 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-[11px] uppercase tracking-wider gap-3 shadow-xl transition-all active:scale-95 group"
              >
                <Plus className="h-4 w-4 transition-transform group-hover:scale-110" />
                Instantiate Rank
              </Button>
           </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-10 p-8 lg:p-12">
        <div className="p-6 rounded-3xl bg-orange-50/50 border border-orange-100/50 flex items-start gap-4">
           <Info className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
           <div className="space-y-1">
              <h4 className="text-[11px] font-black text-orange-900 uppercase tracking-tight">System Policy: Progression Integrity</h4>
              <p className="text-[11px] font-bold text-orange-700/80 uppercase leading-relaxed tracking-tight italic">
                 Ranks represent long-term entity standing. Reordering affects all participant manifest positions.
              </p>
           </div>
        </div>

        {/* Stats Section */}
        <StatsCards ranks={ranks} />

        {/* Rank List Section */}
        <div className="space-y-6">
           <div className="flex items-center gap-3 px-1">
              <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                 <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                 <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Progression Matrix</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Foundational standing levels</p>
              </div>
           </div>

           <RankList
             ranks={ranks}
             onMoveUp={(index) => handleMoveRank(index, "up")}
             onMoveDown={(index) => handleMoveRank(index, "down")}
             onEdit={handleOpenDialog}
             refetch={refetch}
             isLoading={loading}
           />
        </div>
      </EcosystemContainer>

      <RankDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingRank={editingRank}
        onSave={handleSave}
        isLoading={creating || updating}
        nextOrder={ranks.length + 1}
      />
    </EcosystemWrapper>
  );
}
