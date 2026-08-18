"use client";

import React from "react";
import { GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MentorCardCompact } from "./mentor-card-compact";
import { useModuleStore } from "@/store/useModuleStore";

interface MentorGridProps {
  mentors: any[];
  onEdit?: (mentor: any) => void;
  refetch?: () => void;
}

export function MentorGrid({ mentors, onEdit, refetch }: MentorGridProps) {
  const moduleName = useModuleStore((state) => state.mentorshipModuleName);
  const singularName = useModuleStore((state) => state.mentorshipSingularName);

  if (!mentors || mentors.length === 0) {
    return (
      <Card className="border border-dashed border-border/70 shadow-none bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-3 text-muted-foreground/50">
            <GraduationCap className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            No {singularName.toLowerCase()}s found
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            No {singularName.toLowerCase()}s match your current filter or search criteria.
            Try adjusting filters or onboard a new {singularName.toLowerCase()}.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5">
      {mentors.map((mentor) => (
        <MentorCardCompact
          key={mentor.id}
          mentor={mentor}
          onEdit={onEdit}
          refetch={refetch}
        />
      ))}
    </div>
  );
}

export default MentorGrid;
