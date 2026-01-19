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
import { Plus, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { StatsCards } from "./stats-cards";
import { RankList } from "./rank-list";
import { RankDialog } from "./rank-dialog";

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
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">
          Rank Progression Policy
        </AlertTitle>
        <AlertDescription className="text-blue-700">
          Ranks should be maintained carefully to ensure progression
          consistency. While you can delete them, we recommend only modifying or
          reordering them to preserve user history.
        </AlertDescription>
      </Alert>

      <StatsCards ranks={ranks} />

      <div className="flex justify-end">
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" /> Add Rank
        </Button>
      </div>

      <RankList
        ranks={ranks}
        onMoveUp={(index) => handleMoveRank(index, "up")}
        onMoveDown={(index) => handleMoveRank(index, "down")}
        onEdit={handleOpenDialog}
        refetch={refetch}
        isLoading={loading}
      />

      <RankDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingRank={editingRank}
        onSave={handleSave}
        isLoading={creating || updating}
        nextOrder={ranks.length + 1}
      />
    </div>
  );
}
