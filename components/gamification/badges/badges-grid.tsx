"use client";

import React from "react";
import { Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/graphql/actions";
import { BadgeCardCompact } from "./badge-card-compact";

interface BadgesGridProps {
  badges: Badge[];
  modules: { id: string; name: string; icon: string; type?: "MODULE" | "INTEGRATION" }[];
  onEdit: (badge: Badge) => void;
  onToggleActive: (id: string) => void;
  toggling?: boolean;
}

export function BadgesGrid({
  badges,
  modules,
  onEdit,
  onToggleActive,
  toggling,
}: BadgesGridProps) {
  if (!badges || badges.length === 0) {
    return (
      <Card className="border border-dashed border-border/70 shadow-none bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-3 text-muted-foreground/50">
            <Award className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            No badges defined
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Badges motivate community participation. Create your first credential to reward member loyalty and milestones.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5">
      {badges.map((badge) => (
        <BadgeCardCompact
          key={badge.id}
          badge={badge}
          modules={modules}
          onEdit={onEdit}
          onToggleActive={onToggleActive}
          toggling={toggling}
        />
      ))}
    </div>
  );
}

export default BadgesGrid;
