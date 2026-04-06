import React from "react";
import { Crown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Rank } from "@/graphql/actions";
import { RankCard } from "./rank-card";

interface RankListProps {
  ranks: Rank[];
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onEdit: (rank: Rank) => void;
  refetch: () => void;
  isLoading?: boolean;
}

export function RankList({
  ranks,
  onMoveUp,
  onMoveDown,
  onEdit,
  refetch,
  isLoading,
}: RankListProps) {
  const sortedRanks = [...ranks].sort((a, b) => a.order - b.order);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border border-border rounded-xl bg-card">
            <Skeleton className="h-11 w-11 rounded-xl" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-6 w-10 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (sortedRanks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-dashed border-border bg-muted/30">
        <Crown className="h-8 w-8 text-muted-foreground/30 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">No ranks defined yet</p>
        <p className="text-xs text-muted-foreground/70 mt-1">Create your first rank to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sortedRanks.map((rank, index) => (
        <RankCard
          key={rank.id}
          rank={rank}
          index={index}
          totalRanks={sortedRanks.length}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onEdit={onEdit}
          refetch={refetch}
        />
      ))}
    </div>
  );
}
