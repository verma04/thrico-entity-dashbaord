"use client";

import React from "react";
import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { UserDetail } from "@/graphql/actions";
import { MemberCardCompact } from "./member-card-compact";

interface MemberGridProps {
  users: UserDetail[];
  emptyTitle?: string;
  emptyDescription?: string;
}

export function MemberGrid({
  users,
  emptyTitle = "No members found",
  emptyDescription = "No members match your current filter or search criteria. Try adjusting your filters.",
}: MemberGridProps) {
  if (!users || users.length === 0) {
    return (
      <Card className="border border-dashed border-border/70 shadow-none bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-3 text-muted-foreground/50">
            <Users className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-foreground">{emptyTitle}</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            {emptyDescription}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5">
      {users.map((user) => (
        <MemberCardCompact key={user.id} member={user} />
      ))}
    </div>
  );
}

export default MemberGrid;
