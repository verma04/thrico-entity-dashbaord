import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
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
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Rank Progression</CardTitle>
      </CardHeader>
      <CardContent>
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
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No ranks defined. Create your first rank!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
