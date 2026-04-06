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
        badgeText="Gamification"
        description="Define the progression hierarchy for your community. Set point thresholds for each rank level."
        icon={Crown}
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground">
              {ranks.length} rank{ranks.length !== 1 ? "s" : ""} configured
            </span>
          </div>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-2"
          >
            <RotateCcw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => handleOpenDialog()}
            className="gap-2"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Rank
          </Button>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 space-y-6">
        {/* Info Banner */}
        <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
          <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            Reordering ranks affects all existing member positions. Changes are applied immediately across the platform.
          </p>
        </div>

        {/* Stats */}
        <StatsCards ranks={ranks} />

        {/* Rank List */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Rank Levels</h2>
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
