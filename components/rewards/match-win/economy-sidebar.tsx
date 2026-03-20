"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface EconomySidebarProps {
  costPerPlay: number;
  setCostPerPlay: (v: number) => void;
  maxPlaysPerDay: number;
  setMaxPlaysPerDay: (v: number) => void;
  festivalMode: boolean;
  setFestivalMode: (v: boolean) => void;
  avgPayout: number;
  profitMargin: number;
}

export const EconomySidebar = ({
  costPerPlay,
  setCostPerPlay,
  maxPlaysPerDay,
  setMaxPlaysPerDay,
  festivalMode,
  setFestivalMode,
  avgPayout,
  profitMargin,
}: EconomySidebarProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="py-3 px-4 bg-slate-50/50 border-b">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Economy Protection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Play Cost</span>
            <span className="font-bold">{costPerPlay} TC</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Expected Payout</span>
            <span className="font-bold text-blue-600">
              {avgPayout.toFixed(1)} TC
            </span>
          </div>
          <div
            className={cn(
              "p-3 rounded-lg border",
              profitMargin > 20 ? "bg-green-50" : "bg-amber-50",
            )}
          >
            <div className="flex justify-between mb-1">
              <span className="text-[10px] font-bold uppercase">
                Profit Margin
              </span>
              <span className="text-sm font-bold">
                {profitMargin.toFixed(1)}%
              </span>
            </div>
            <div className="h-1.5 bg-white rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${Math.max(5, profitMargin)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Game Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Cost per Play (TC)</Label>
            <Input
              type="number"
              value={costPerPlay}
              onChange={(e) => setCostPerPlay(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Max Plays / Day</Label>
            <Input
              type="number"
              value={maxPlaysPerDay}
              onChange={(e) => setMaxPlaysPerDay(Number(e.target.value))}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Festival Animations</Label>
            <Switch checked={festivalMode} onCheckedChange={setFestivalMode} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
