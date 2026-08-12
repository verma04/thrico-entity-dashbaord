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
import { CtaButton } from "@/components/ui/cta-button";
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

  const [search, setSearch] = useState("");

  const filteredRanks = React.useMemo(() => {
    if (!search) return ranks;
    return ranks.filter((r: Rank) =>
      r.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [ranks, search]);

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
    const sortedRanks = [...filteredRanks].sort((a, b) => a.order - b.order);
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
        description="Set point thresholds for each rank level."
        icon={Crown}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Ranks" },
        ]}
        actions={
          <EcosystemActionBar
            shadow="none"
            className="p-0 border-none bg-transparent gap-2"
          >
            <EcosystemActionBar.Group align="right">
              <EcosystemActionBar.Item>
                <CtaButton onClick={() => handleOpenDialog()}>
                  <Plus className="h-3 w-3" />
                  Add Rank
                </CtaButton>
              </EcosystemActionBar.Item>
            </EcosystemActionBar.Group>
          </EcosystemActionBar>
        }
      />
      <EcosystemActionBar shadow="sm" className="">
        <EcosystemActionBar.Item grow className="max-w-sm">
          <EcosystemActionBar.Search
            value={search}
            onChange={setSearch}
            placeholder="Search ranks..."
          />
        </EcosystemActionBar.Item>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 space-y-6">
        <div className="px-6 py-4">
          <StatsCards ranks={ranks} />
        </div>

        <div className="px-6">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50/50 dark:bg-neutral-900/50 border border-zinc-200 dark:border-neutral-800 mb-6 font-medium">
            <div className="h-8 w-8 rounded-full bg-white dark:bg-neutral-900 flex items-center justify-center shadow-sm shrink-0 border border-zinc-200 dark:border-neutral-800">
              <Info className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
            </div>
            <p className="text-[13px] text-zinc-700 dark:text-zinc-300 leading-relaxed">
              Reordering ranks will automatically adjust the order property of
              each level. Member eligibility is calculated in real-time based on
              these thresholds.
            </p>
          </div>

          <RankList
            ranks={filteredRanks}
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
