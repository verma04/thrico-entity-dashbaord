"use client";

import React, { useState } from "react";
import { useGetLeaderboard } from "@/graphql/actions";
import { LeaderboardTable } from "./leaderboard-table";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Users, Star } from "lucide-react";

export function LeaderboardManager() {
  const [pagination] = useState({ limit: 20, offset: 0 });
  const { data, loading } = useGetLeaderboard({
    variables: { pagination },
    notifyOnNetworkStatusChange: true,
  });

  console.log(data);
  const leaderboard = data?.getLeaderboard;
  const entries = leaderboard?.entries || [];

  return (
    <div className="space-y-8">
      {/* Hero Section / Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-none shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Participants
              </p>
              <h3 className="text-2xl font-bold">
                {leaderboard?.totalUsers || 0}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-none shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-purple-500/20 flex items-center justify-center">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Competition Type
              </p>
              <h3 className="text-2xl font-bold">Global</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard Table */}
      <LeaderboardTable entries={entries} isLoading={loading} />
    </div>
  );
}
