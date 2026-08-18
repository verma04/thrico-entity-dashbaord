"use client";

import React from "react";
import { Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Job } from "@/graphql/actions/jobs";
import { JobCardCompact } from "./job-card-compact";
import { useModuleStore } from "@/store/useModuleStore";

interface JobGridProps {
  jobs: Job[];
}

export function JobGrid({ jobs }: JobGridProps) {
  const moduleName = useModuleStore((state) => state.jobModuleName);
  const singularName = useModuleStore((state) => state.jobSingularName);

  if (!jobs || jobs.length === 0) {
    return (
      <Card className="border border-dashed border-border/70 shadow-none bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-3 text-muted-foreground/50">
            <Briefcase className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            No {moduleName.toLowerCase()} found
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            No {moduleName.toLowerCase()} match your current filter or search criteria.
            Try adjusting filters or create a new {singularName.toLowerCase()}.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5">
      {jobs.map((job) => (
        <JobCardCompact key={job.id} job={job} />
      ))}
    </div>
  );
}

export default JobGrid;
