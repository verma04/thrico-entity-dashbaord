import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Rank } from "@/graphql/actions";
import { RankCard } from "./rank-card";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

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
      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-6 flex items-center justify-between border border-border/50 bg-white rounded-xl shadow-sm">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <Skeleton className="h-9 w-9 rounded-lg" />
                <Skeleton className="h-9 w-20 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </EcosystemContainer>
    );
  }

  return (
    <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
      <div className="space-y-3">
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
        {sortedRanks.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
            <Trophy className="h-16 w-16 mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-medium">
              No ranks defined. Create your first rank!
            </p>
          </div>
        )}
      </div>
    </EcosystemContainer>
  );
}
