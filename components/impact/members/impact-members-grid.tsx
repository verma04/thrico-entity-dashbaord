"use client";

import React from "react";
import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ImpactUserNode } from "./impact-members-table";
import { ImpactMemberCardCompact } from "./impact-member-card-compact";

interface ImpactMembersGridProps {
  users: ImpactUserNode[];
  offset?: number;
}

export function ImpactMembersGrid({
  users,
  offset = 0,
}: ImpactMembersGridProps) {
  if (!users || users.length === 0) {
    return (
      <Card className="border border-dashed border-border/70 shadow-none bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-3 text-muted-foreground/50">
            <Users className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            No impact members found
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Impact scores are dynamically calculated based on engagement, contributions, and community trust.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5">
      {users.map((node, index) => (
        <ImpactMemberCardCompact
          key={node.id}
          node={node}
          rankIndex={offset + index + 1}
        />
      ))}
    </div>
  );
}

export default ImpactMembersGrid;
