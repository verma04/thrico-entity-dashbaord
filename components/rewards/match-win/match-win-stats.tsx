"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dices, Coins, Trophy, Zap } from "lucide-react";

interface MatchWinStatsProps {
  statsData: any;
}

export const MatchWinStats = ({ statsData }: MatchWinStatsProps) => {
  if (!statsData?.getSpinScratchStats) return null;

  const stats = statsData.getSpinScratchStats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-blue-50/50 border-blue-100">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                Total Plays
              </p>
              <p className="text-2xl font-black">{stats.totalMatchWins}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Dices className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-amber-50/50 border-amber-100">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                TC Burned
              </p>
              <p className="text-2xl font-black">
                {stats.matchWinStatsToday.tcBurned}{" "}
                <span className="text-xs font-normal">Today</span>
              </p>
            </div>
            <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
              <Coins className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-green-50/50 border-green-100">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-green-600">
                TC Rewarded
              </p>
              <p className="text-2xl font-black">
                {stats.matchWinStatsToday.tcRewarded}{" "}
                <span className="text-xs font-normal">Today</span>
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <Trophy className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-slate-50/50 border-slate-200">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Net Revenue
              </p>
              <p className="text-2xl font-black text-slate-900">
                {stats.matchWinStatsToday.tcBurned -
                  stats.matchWinStatsToday.tcRewarded}
              </p>
            </div>
            <div className="p-2 bg-slate-200 rounded-lg text-slate-600">
              <Zap className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
