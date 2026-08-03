"use client";

import React, { useState } from "react";
import {
  useGetSurveyResponses,
  useGetSurvey,
  SurveyResponse,
  Respondent,
} from "@/graphql/surveys/survey-queries";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import {
  ArrowLeft,
  MessageSquare,
  User,
  Eye,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface SurveyResponsesViewProps {
  surveyId: string;
}

export const SurveyResponsesView: React.FC<SurveyResponsesViewProps> = ({
  surveyId,
}) => {
  const router = useRouter();
  const [selectedResponse, setSelectedResponse] =
    useState<SurveyResponse | null>(null);

  const { data: surveyData } = useGetSurvey({ variables: { id: surveyId } });
  const {
    data: responsesData,
    loading,
    error,
  } = useGetSurveyResponses({
    variables: {
      surveyId,
      input: { limit: 100, offset: 0 },
    },
  });

  const responses = responsesData?.getSurveyResponses?.responses || [];
  const survey = surveyData?.getSurvey;

  const columns: ColumnDef<SurveyResponse>[] = [
    {
      accessorKey: "respondent",
      header: "Respondent",
      cell: ({ row }) => {
        const respondent = row.original.respondent;

        if (!respondent?.id) {
          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 border border-border">
                <AvatarFallback className="bg-primary/5 text-primary text-xs">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-foreground">
                  Anonymous Respondent
                </span>
                <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-tight">
                  {row.original.respondentId.slice(0, 8)}...
                </span>
              </div>
            </div>
          );
        }

        const avatarUrl = respondent?.avatar 
          ? respondent.avatar.startsWith("http") 
            ? respondent.avatar 
            : `${process.env.NEXT_PUBLIC_CDN_URL}/${respondent.avatar}`
          : "";

        return (
          <UserProfileHoverCard user={respondent}>
            <div className="flex items-center gap-3 cursor-pointer hover:bg-accent/50 p-1.5 -ml-1.5 rounded-md transition-colors">
              <Avatar className="h-9 w-9 border border-border">
                <AvatarImage
                  src={avatarUrl}
                  alt={respondent?.firstName || ""}
                />
                <AvatarFallback className="bg-primary/5 text-primary text-xs">
                  {respondent?.firstName?.[0] || <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-foreground hover:underline">
                  {respondent?.firstName
                    ? `${respondent.firstName} ${respondent.lastName || ""}`
                    : "Anonymous Respondent"}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-tight">
                  {row.original.respondentId.slice(0, 8)}...
                </span>
              </div>
            </div>
          </UserProfileHoverCard>
        );
      },
    },
    {
      accessorKey: "submittedAt",
      header: "Submitted",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span className="text-sm">
            {format(new Date(row.original.submittedAt), "MMM d, yyyy · p")}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end pr-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-primary hover:text-primary hover:bg-primary/5"
            onClick={() => setSelectedResponse(row.original)}
          >
            <Eye className="h-4 w-4" />
            View Answers
          </Button>
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="p-4 rounded-full bg-destructive/10">
          <MessageSquare className="h-8 w-8 text-destructive" />
        </div>
        <p className="text-destructive font-medium">
          Failed to load survey responses.
        </p>
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit pl-0 gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Surveys
        </Button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3 mb-1">
              <Badge
                variant="outline"
                className="rounded-md font-mono text-[10px]"
              >
                RESPONSE LOG
              </Badge>
              {survey?.status && (
                <Badge
                  variant={
                    survey.status === "PUBLISHED" ? "default" : "secondary"
                  }
                  className="capitalize h-5 py-0"
                >
                  {survey.status.toLowerCase()}
                </Badge>
              )}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              {survey?.title || "Survey Responses"}
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Browsing individual submissions and respondent metadata for this
              survey.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-card px-5 py-3 rounded-2xl border border-border shadow-sm flex flex-col">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest leading-none mb-1">
                Total Submissions
              </span>
              <span className="text-3xl font-black tabular-nums">
                {responses.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Separator className="opacity-50" />

      {/* Main Table */}
      <div className="space-y-6">
        <DataTable
          columns={columns}
          data={responses}
          isLoading={loading}
          skeletonCount={8}
          onRowClick={(row) => setSelectedResponse(row)}
        />
      </div>

      {/* Response Detail Drawer */}
      <Sheet
        open={!!selectedResponse}
        onOpenChange={(open) => !open && setSelectedResponse(null)}
      >
        <SheetContent className="w-full sm:max-w-[600px] overflow-y-auto p-0 border-l border-border shadow-2xl">
          <SheetHeader className="px-8 pt-8 pb-6 bg-linear-to-br from-primary/5 to-transparent border-b sticky top-0 z-10 backdrop-blur-md">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-14 w-14 ring-4 ring-background shadow-lg">
                <AvatarImage 
                  src={
                    selectedResponse?.respondent?.avatar
                      ? selectedResponse.respondent.avatar.startsWith("http")
                        ? selectedResponse.respondent.avatar
                        : `${process.env.NEXT_PUBLIC_CDN_URL}/${selectedResponse.respondent.avatar}`
                      : ""
                  } 
                />
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                  {selectedResponse?.respondent?.firstName?.[0] || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <SheetTitle className="text-2xl font-black">
                  {selectedResponse?.respondent?.firstName
                    ? `${selectedResponse.respondent.firstName} ${selectedResponse.respondent.lastName}`
                    : "Anonymous Submission"}
                </SheetTitle>
                <SheetDescription className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5" />
                  Submitted on{" "}
                  {selectedResponse &&
                    format(new Date(selectedResponse.submittedAt), "PPP p")}
                </SheetDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary hover:bg-primary/20 border-none font-mono"
              >
                ID: {selectedResponse?.id.slice(0, 12)}
              </Badge>
            </div>
          </SheetHeader>

          <div className="p-8 space-y-8">
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-[.2em] text-muted-foreground/60 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                Question Responses
                <div className="h-px flex-1 bg-border" />
              </h3>

              <div className="space-y-4">
                {selectedResponse &&
                  Object.entries(selectedResponse.answers || {}).map(
                    ([questionId, answer]: [string, any], idx) => {
                      // This assumes you might have logic to find the question text by ID
                      // For now, displaying it as is or attempting to map if survey data has fields
                      const questionField =
                        survey?.form?.questions?.find(
                          (f: any) => f.id === questionId,
                        ) ||
                        survey?.fields?.find((f: any) => f.id === questionId);

                      return (
                        <Card
                          key={idx}
                          className="border-none bg-accent/20 shadow-none overflow-hidden group"
                        >
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
                          <CardHeader className="p-5 pb-2">
                            <CardTitle className="text-sm font-bold text-muted-foreground flex items-center justify-between">
                              <span>
                                {questionField?.question ||
                                  `Question #${idx + 1}`}
                              </span>
                              <Badge
                                variant="outline"
                                className="text-[9px] h-4 px-1 rounded font-mono border-muted-foreground/30 capitalize"
                              >
                                {questionField?.type
                                  ?.toLowerCase()
                                  .replace(/_/g, " ") || "Input"}
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-5 pt-0">
                            <div className="text-base font-semibold leading-relaxed text-foreground">
                              {Array.isArray(answer) ? (
                                <div className="flex flex-wrap gap-2 pt-1">
                                  {answer.map((a, i) => (
                                    <Badge
                                      key={i}
                                      variant="secondary"
                                      className="rounded-lg px-3 py-1 font-medium bg-background border-border"
                                    >
                                      {a}
                                    </Badge>
                                  ))}
                                </div>
                              ) : typeof answer === "string" ? (
                                answer
                              ) : (
                                JSON.stringify(answer)
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    },
                  )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
