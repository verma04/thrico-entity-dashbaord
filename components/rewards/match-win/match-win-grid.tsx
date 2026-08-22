"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MatchWinCardCompact } from "./match-win-card-compact";
import { MatchWinCombination } from "./types";

interface MatchWinGridProps {
  combinations: MatchWinCombination[];
  currencyName?: string;
  onEdit?: (combination: MatchWinCombination) => void;
  onDelete: (id: string) => void;
}

export function MatchWinGrid({
  combinations,
  currencyName = "Points",
  onEdit,
  onDelete,
}: MatchWinGridProps) {
  if (!combinations || combinations.length === 0) {
    return (
      <Card className="border border-dashed border-border/70 shadow-none bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-3 text-muted-foreground/50">
            <Sparkles className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            No winning combinations found
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Add your first 3-reel matching pattern rule to configure slot combinations, points, gift cards, or vouchers.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5">
      {combinations.map((comb) => (
        <MatchWinCardCompact
          key={comb.id || comb.key}
          combination={comb}
          currencyName={currencyName}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default MatchWinGrid;
