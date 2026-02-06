"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
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
  const columns: ColumnDef<Survey>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">
            {row.getValue("title")}
          </span>
          <span className="text-xs text-muted-foreground line-clamp-1">
            {row.original.description || "No description"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge
            variant={
              status === "PUBLISHED"
                ? "default"
                : status === "DRAFT"
                  ? "secondary"
                  : "outline"
            }
            className="capitalize"
          >
            {status.toLowerCase()}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const date = row.original.createdAt;
        return (
          <span className="text-sm text-muted-foreground">
            {date ? format(new Date(date), "MMM d, yyyy") : "-"}
          </span>
        );
      },
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => {
        const date = row.getValue("startDate");
        return (
          <span className="text-sm text-muted-foreground">
            {date ? format(new Date(date as string), "PPP") : "No start date"}
          </span>
        );
      },
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }) => {
        const date = row.getValue("endDate");
        return (
          <span className="text-sm text-muted-foreground">
            {date ? format(new Date(date as string), "PPP") : "No end date"}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const survey = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => onEditDetails(survey)}
                className="gap-2"
              >
                <Pencil className="h-4 w-4" />
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/surveys/${survey.formId}`}
                  className="w-full flex items-center gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Edit Form
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(survey.id)}
                className="gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy survey ID
              </DropdownMenuItem>
              {!shareSurveyAsFeed && (
                <DropdownMenuItem
                  onClick={() => onShare(survey)}
                  className="gap-2"
                >
                  <Share className="h-4 w-4" />
                  Share to Feed
                </DropdownMenuItem>
              )}
              {survey.status === "DRAFT" ? (
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => onPublish(survey.id)}
                >
                  <Check className="h-4 w-4" />
                  Publish Survey
                </DropdownMenuItem>
              ) : survey.status === "PUBLISHED" ? (
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => onDraft(survey.id)}
                >
                  <FileText className="h-4 w-4" />
                  Move to Draft
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuItem asChild>
                <Link
                  href={`/surveys/${survey.id}/results`}
                  className="w-full flex items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  View Results
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/surveys/${survey.id}/responses`}
                  className="w-full flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  View Responses
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive gap-2"
                onClick={() => onDelete(survey.id)}
              >
                <Trash2 className="h-4 w-4" />
                Delete survey
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={surveys}
      isLoading={loading}
      skeletonCount={5}
    />
  );
}
