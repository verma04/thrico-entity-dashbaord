"use client";

import React, { useState } from "react";
import {
  useGetRanks,
  useCreateRank,
  useUpdateRank,
  useUpdateRankOrder,
  Rank,
} from "@/graphql/actions";
import { Button } from "@/components/ui/button";
import { StatsCards } from "./stats-cards";
import { RankList } from "./rank-list";
import { RankDialog } from "./rank-dialog";
import { Crown, Plus, Info, RotateCcw } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";

export function RanksManager() {
  const { data: ranksData, refetch, loading: ranksLoading } = useGetRanks();
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
          variables: { id: editingRank.id, input: formData },
        });
      } else {
        await createRank({ variables: { input: formData } });
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
      await updateRankOrder({ variables: { rankOrders } });
    } catch (error) {
      console.error("Error updating rank order:", error);
    }
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Ranks"
        badgeText="Hierarchy"
        description="Define the progression hierarchy. Set point thresholds for each rank level to visualize member status."
        icon={Crown}
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <div className="flex items-center gap-3 px-1">
             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
             <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]"> System Logic Node Active</span>
          </div>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Item>
             <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 border-border rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
                onClick={() => refetch()}
              >
                <RotateCcw className={cn(ranksLoading && "animate-spin")} size={14} />
              </Button>
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Item>
             <Button
                size="sm"
                onClick={() => handleOpenDialog()}
                className="h-9 px-4 rounded-xl gap-2 shadow-sm font-semibold"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Rank
              </Button>
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Status active={ranks.length > 0}>
             {ranks.length} Defined Tiers
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 space-y-6">
        <div className="px-6 py-4">
           <StatsCards ranks={ranks} />
        </div>

        <div className="px-6">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-indigo-50/30 border border-indigo-100/50 mb-6 font-medium">
            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0 border border-indigo-100">
              <Info className="h-4 w-4 text-indigo-500" />
            </div>
            <p className="text-[13px] text-indigo-700/80 leading-relaxed">
              Reordering ranks will automatically adjust the order property of each level. Member eligibility is calculated in real-time based on these thresholds.
            </p>
          </div>

          <RankList
            ranks={ranks}
            onMoveUp={(index) => handleMoveRank(index, "up")}
            onMoveDown={(index) => handleMoveRank(index, "down")}
            onEdit={handleOpenDialog}
            refetch={refetch}
            isLoading={ranksLoading}
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
