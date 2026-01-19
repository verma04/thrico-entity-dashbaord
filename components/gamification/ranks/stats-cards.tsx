import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { Rank } from "@/graphql/actions";

interface StatsCardsProps {
  ranks: Rank[];
}

export function StatsCards({ ranks }: StatsCardsProps) {
  const pointsBased = ranks.filter(
    (r) => !r.icon || r.minPoints !== undefined || r.maxPoints !== undefined
  ).length;
  // Note: The original logic used rank.type which doesn't exist in the GraphQL Rank interface yet.
  // I will adjust this based on the GraphQL fields or keep it simple.

  // Actually, the GraphQL Rank has color, icon, minPoints, maxPoints.
  // Let's use total, active, and maybe a split by points?

  const totalRanks = ranks.length;
  const activeRanks = ranks.filter((r) => r.isActive).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Ranks</p>
              <p className="text-2xl font-bold">{totalRanks}</p>
            </div>
            <Trophy className="h-8 w-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Ranks</p>
              <p className="text-2xl font-bold">{activeRanks}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="text-2xl font-bold">
                {totalRanks > 0 ? "Configured" : "Empty"}
              </p>
            </div>
            <Badge variant={totalRanks > 0 ? "default" : "secondary"}>
              {totalRanks > 0 ? "Live" : "Setup"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
