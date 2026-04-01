import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";
import { PointRule, GamificationStats } from "@/graphql/actions";

interface StatsCardsProps {
  pointRules: PointRule[];
  stats?: GamificationStats;
}

export function StatsCards({ pointRules, stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{stats?.totalUsers?.toLocaleString() ?? 0}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Points Awarded</p>
              <p className="text-2xl font-bold">
                {stats?.totalPointsAwarded?.toLocaleString() ?? 0}
              </p>
            </div>
            <Zap className="h-8 w-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Badges Earned</p>
              <p className="text-2xl font-bold">
                {stats?.totalBadgesEarned?.toLocaleString() ?? 0}
              </p>
            </div>
            <Badge variant="secondary">Earned</Badge>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Rules</p>
              <p className="text-2xl font-bold">
                {(stats?.activePointRules ??
                  pointRules.filter((r) => r.isActive).length).toLocaleString()}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
