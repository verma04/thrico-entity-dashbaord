"use client";

import React from "react";
import { RectangleHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScratchCardCardCompact } from "./scratch-card-card-compact";
import { ScratchRewardTier } from "./types";

interface ScratchCardGridProps {
  tiers: ScratchRewardTier[];
  currencyName?: string;
  onEdit: (tier: ScratchRewardTier) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => Promise<void>;
}

export function ScratchCardGrid({
  tiers,
  currencyName = "Points",
  onEdit,
  onDelete,
  onToggleActive,
}: ScratchCardGridProps) {
  if (!tiers || tiers.length === 0) {
    return (
      <Card className="border border-dashed border-border/70 shadow-none bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-3 text-muted-foreground/50">
            <RectangleHorizontal className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            No scratch card tiers configured
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Add your first scratch card reward tier to configure prizes, point amounts, and member qualification rules.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5">
      {tiers.map((tier) => (
        <ScratchCardCardCompact
          key={tier.id}
          tier={tier}
          currencyName={currencyName}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
        />
      ))}
    </div>
  );
}

export default ScratchCardGrid;
