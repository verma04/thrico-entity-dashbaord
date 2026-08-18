"use client";

import React from "react";
import { ClipboardList } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Survey } from "@/graphql/surveys/survey-queries";
import { SurveyCardCompact } from "./survey-card-compact";
import { useModuleStore } from "@/store/useModuleStore";

interface SurveyGridProps {
  surveys: Survey[];
  onEditDetails?: (survey: Survey) => void;
  onDelete?: (id: string) => void;
  onPublish?: (id: string) => void;
  onDraft?: (id: string) => void;
  onShare?: (survey: Survey) => void;
  shareSurveyAsFeed?: boolean;
  refetch?: () => void;
}

export function SurveyGrid({
  surveys,
  onEditDetails,
  onDelete,
  onPublish,
  onDraft,
  onShare,
  shareSurveyAsFeed,
  refetch,
}: SurveyGridProps) {
  const moduleName = useModuleStore((state) => state.surveyModuleName);
  const singularName = useModuleStore((state) => state.surveySingularName);

  if (!surveys || surveys.length === 0) {
    return (
      <Card className="border border-dashed border-border/70 shadow-none bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-3 text-muted-foreground/50">
            <ClipboardList className="h-6 w-6" />
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
      {surveys.map((survey) => (
        <SurveyCardCompact
          key={survey.id}
          survey={survey}
          onEditDetails={onEditDetails}
          onDelete={onDelete}
          onPublish={onPublish}
          onDraft={onDraft}
          onShare={onShare}
          shareSurveyAsFeed={shareSurveyAsFeed}
          refetch={refetch}
        />
      ))}
    </div>
  );
}

export default SurveyGrid;
