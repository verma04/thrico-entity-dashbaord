"use client";

import React, { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Check,
  FileText,
  BarChart3,
  MessageSquare,
  Copy,
  Share,
  ClipboardList,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Survey } from "@/graphql/surveys/survey-queries";

import {
  AdminTable,
  AdminStatusBadge,
  AdminTableColumn,
} from "@/components/shared/admin-table/admin-table";

interface SurveysTableProps {
  surveys: Survey[];
  loading: boolean;
  onEditDetails: (survey: Survey) => void;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
  onDraft: (id: string) => void;
  onShare: (survey: Survey) => void;
  shareSurveyAsFeed?: boolean;
}

export function SurveysTable({
  surveys,
  loading,
  onEditDetails,
  onDelete,
  onPublish,
  onDraft,
  onShare,
  shareSurveyAsFeed,
}: SurveysTableProps) {
  const columns = useMemo<AdminTableColumn<Survey>[]>(
    () => [
      {
        key: "title",
        header: "Survey",
        cell: (row) => {
          const survey = row;
          return (
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                <ClipboardList className="h-5 w-5 text-indigo-500" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-foreground leading-tight truncate max-w-[250px]">
                  {survey.title}
                </span>
                <span className="text-[11px] text-muted-foreground line-clamp-1 max-w-[300px] mt-0.5">
                  {survey.description || "No description"}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        key: "status",
        header: "Status",
        cell: (row) => <AdminStatusBadge status={row.status} />,
      },
      {
        key: "dates",
        header: "Duration",
        cell: (row) => {
          const startDate = row.startDate;
          const endDate = row.endDate;
          return (
            <div className="flex flex-col text-[11px] font-medium text-muted-foreground gap-0.5">
              <span>
                Start: {startDate ? format(new Date(startDate), "MMM d, yyyy") : "—"}
              </span>
              <span>
                End: {endDate ? format(new Date(endDate), "MMM d, yyyy") : "—"}
              </span>
            </div>
          );
        },
      },
      {
        key: "createdAt",
        header: "Created",
        cell: (row) => {
          const date = row.createdAt;
          return (
            <span className="text-[12px] font-semibold text-foreground">
              {date ? format(new Date(date), "MMM d, yyyy") : "-"}
            </span>
          );
        },
      },
      {
        key: "actions",
        header: "",
        headerClassName: "w-12 text-right",
        className: "text-right",
        cell: (row) => {
          const survey = row;
          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px] rounded-xl">
                  <DropdownMenuLabel className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                    Actions
                  </DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => onEditDetails(survey)}
                    className="gap-2 cursor-pointer font-medium text-[13px]"
                  >
                    <Pencil className="h-4 w-4 text-slate-500" />
                    Edit Details
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="gap-2 cursor-pointer font-medium text-[13px]">
                    <Link
                      href={`/surveys/${survey.formId}`}
                      className="w-full flex items-center"
                    >
                      <Pencil className="h-4 w-4 text-slate-500" />
                      Edit Form
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(survey.id)}
                    className="gap-2 cursor-pointer font-medium text-[13px]"
                  >
                    <Copy className="h-4 w-4 text-slate-500" />
                    Copy survey ID
                  </DropdownMenuItem>
                  {!shareSurveyAsFeed && (
                    <DropdownMenuItem
                      onClick={() => onShare(survey)}
                      className="gap-2 cursor-pointer font-medium text-[13px]"
                    >
                      <Share className="h-4 w-4 text-slate-500" />
                      Share to Feed
                    </DropdownMenuItem>
                  )}
                  {survey.status === "DRAFT" ? (
                    <DropdownMenuItem
                      className="gap-2 cursor-pointer font-medium text-[13px] text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50"
                      onClick={() => onPublish(survey.id)}
                    >
                      <Check className="h-4 w-4" />
                      Publish Survey
                    </DropdownMenuItem>
                  ) : survey.status === "PUBLISHED" ? (
                    <DropdownMenuItem
                      className="gap-2 cursor-pointer font-medium text-[13px] text-amber-600 focus:text-amber-700 focus:bg-amber-50"
                      onClick={() => onDraft(survey.id)}
                    >
                      <FileText className="h-4 w-4" />
                      Move to Draft
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuItem asChild className="gap-2 cursor-pointer font-medium text-[13px]">
                    <Link
                      href={`/surveys/${survey.id}/results`}
                      className="w-full flex items-center text-indigo-600 hover:text-indigo-700 focus:text-indigo-700"
                    >
                      <BarChart3 className="h-4 w-4" />
                      View Results
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="gap-2 cursor-pointer font-medium text-[13px]">
                    <Link
                      href={`/surveys/${survey.id}/responses`}
                      className="w-full flex items-center"
                    >
                      <MessageSquare className="h-4 w-4 text-slate-500" />
                      View Responses
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-rose-600 focus:text-rose-700 focus:bg-rose-50 cursor-pointer font-medium text-[13px] gap-2 mt-1 border-t border-slate-100"
                    onClick={() => onDelete(survey.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete survey
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [onEditDetails, onPublish, onDraft, onShare, onDelete, shareSurveyAsFeed]
  );

  return (
    <AdminTable<Survey>
      columns={columns}
      data={surveys}
      loading={loading}
      keyExtractor={(s) => s.id}
      emptyIcon={ClipboardList}
      emptyTitle="No surveys found"
      emptyDescription="Create a new survey to start collecting feedback."
    />
  );
}
