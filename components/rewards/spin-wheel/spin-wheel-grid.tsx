"use client";

import React from "react";
import { Dices } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SpinWheelCardCompact } from "./spin-wheel-card-compact";
import { WheelSegment } from "./types";

interface SpinWheelGridProps {
  segments: WheelSegment[];
  currencyName?: string;
  onEdit: (segment: WheelSegment) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => Promise<void>;
}

export function SpinWheelGrid({
  segments,
  currencyName = "Points",
  onEdit,
  onDelete,
  onToggleActive,
}: SpinWheelGridProps) {
  if (!segments || segments.length === 0) {
    return (
      <Card className="border border-dashed border-border/70 shadow-none bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-3 text-muted-foreground/50">
            <Dices className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            No wheel segments configured
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Add your first spin wheel segment to configure prizes, point amounts, and win probability weights.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5">
      {segments.map((segment) => (
        <SpinWheelCardCompact
          key={segment.id}
          segment={segment}
          currencyName={currencyName}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
        />
      ))}
    </div>
  );
}

export default SpinWheelGrid;
