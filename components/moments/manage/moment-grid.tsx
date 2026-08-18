"use client";

import React from "react";
import { PlaySquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Moment } from "@/graphql/actions/moments";
import { MomentCardCompact } from "./moment-card-compact";
import { useModuleStore } from "@/store/useModuleStore";

interface MomentGridProps {
  moments: Moment[];
  onSelectMoment: (moment: Moment) => void;
  onDeleteMoment: (id: string) => void;
}

export function MomentGrid({
  moments,
  onSelectMoment,
  onDeleteMoment,
}: MomentGridProps) {
  const moduleName = useModuleStore((state) => state.momentModuleName);
  const singularName = useModuleStore((state) => state.momentSingularName);

  if (!moments || moments.length === 0) {
    return (
      <Card className="border border-dashed border-border/70 shadow-none bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-3 text-muted-foreground/50">
            <PlaySquare className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            No {moduleName.toLowerCase()} found
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            No {moduleName.toLowerCase()} match your current filter or search criteria.
            Try adjusting filters or broadcast a new {singularName.toLowerCase()}.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5">
      {moments.map((moment) => (
        <MomentCardCompact
          key={moment.id}
          moment={moment}
          onClick={() => onSelectMoment(moment)}
          onDelete={onDeleteMoment}
        />
      ))}
    </div>
  );
}

export default MomentGrid;
