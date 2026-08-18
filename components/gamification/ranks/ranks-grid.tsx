"use client";

import React from "react";
import { Crown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Rank } from "@/graphql/actions";
import { RankCardCompact } from "./rank-card-compact";

interface RanksGridProps {
  ranks: Rank[];
  onEdit: (rank: Rank) => void;
  onOpenNotifications: (rank: Rank) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  refetch?: () => void;
}

export function RanksGrid({
  ranks,
  onEdit,
  onOpenNotifications,
  onMoveUp,
  onMoveDown,
  refetch,
}: RanksGridProps) {
  if (!ranks || ranks.length === 0) {
    return (
      <Card className="border border-dashed border-border/70 shadow-none bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-3 text-muted-foreground/50">
            <Crown className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            No hierarchy levels defined
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Create progression ranks with point requirements to incentivize user loyalty and status.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5">
      {ranks.map((rank, index) => (
        <RankCardCompact
          key={rank.id}
          rank={rank}
          index={index}
          totalRanks={ranks.length}
          onEdit={onEdit}
          onOpenNotifications={onOpenNotifications}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          refetch={refetch}
        />
      ))}
    </div>
  );
}

export default RanksGrid;
