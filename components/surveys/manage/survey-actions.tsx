"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
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
  FileEdit,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import { Survey } from "@/graphql/surveys/survey-queries";
import { useModuleStore } from "@/store/useModuleStore";

export interface SurveyActionsProps {
  survey: Survey;
  onEditDetails?: (survey: Survey) => void;
  onDelete?: (id: string) => void;
  onPublish?: (id: string) => void;
  onDraft?: (id: string) => void;
  onShare?: (survey: Survey) => void;
  shareSurveyAsFeed?: boolean;
  refetch?: () => void;
  trigger?: React.ReactNode;
}

export function SurveyActions({
  survey,
  onEditDetails,
  onDelete,
  onPublish,
  onDraft,
  onShare,
  shareSurveyAsFeed,
  refetch,
  trigger,
}: SurveyActionsProps) {
  const router = useRouter();
  const singularName = useModuleStore((state) => state.surveySingularName);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/surveys/${survey.formId || survey.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard", {
      description: `Copied link for "${survey.title}"`,
    });
  };

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(survey.id);
    toast.success("ID copied to clipboard", {
      description: `Copied survey ID ${survey.id}`,
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          {trigger || (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-md transition-colors"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 rounded-lg shadow-md border-border p-1"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1">
            Actions
          </DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => router.push(`/surveys/${survey.formId || survey.id}`)}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5"
          >
            <FileEdit className="h-3.5 w-3.5 text-muted-foreground" />
            Edit Form
          </DropdownMenuItem>

          {onEditDetails && (
            <DropdownMenuItem
              onClick={() => onEditDetails(survey)}
              className="text-xs font-medium cursor-pointer gap-2 py-1.5"
            >
              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
              Edit Details
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={() => router.push(`/surveys/${survey.id}/results`)}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5"
          >
            <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
            View Results
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push(`/surveys/${survey.id}/responses`)}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5"
          >
            <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
            View Responses
          </DropdownMenuItem>

          {!shareSurveyAsFeed && onShare && (
            <DropdownMenuItem
              onClick={() => onShare(survey)}
              className="text-xs font-medium cursor-pointer gap-2 py-1.5"
            >
              <Share className="h-3.5 w-3.5 text-muted-foreground" />
              Share to Feed
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={handleCopyLink}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5"
          >
            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
            Copy Link
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleCopyId}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5"
          >
            <ClipboardList className="h-3.5 w-3.5 text-muted-foreground" />
            Copy {singularName} ID
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1" />

          {survey.status === "DRAFT" && onPublish && (
            <DropdownMenuItem
              onClick={() => onPublish(survey.id)}
              className="text-xs font-medium cursor-pointer gap-2 py-1.5 text-emerald-600 dark:text-emerald-400"
            >
              <Check className="h-3.5 w-3.5" />
              Publish {singularName}
            </DropdownMenuItem>
          )}

          {survey.status === "PUBLISHED" && onDraft && (
            <DropdownMenuItem
              onClick={() => onDraft(survey.id)}
              className="text-xs font-medium cursor-pointer gap-2 py-1.5 text-amber-600 dark:text-amber-400"
            >
              <FileText className="h-3.5 w-3.5" />
              Move to Draft
            </DropdownMenuItem>
          )}

          {onDelete && (
            <>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem
                onClick={() => setDeleteOpen(true)}
                className="text-xs font-medium cursor-pointer gap-2 py-1.5 text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete {singularName}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {singularName}?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete <strong>{survey.title}</strong>?
              This action cannot be undone and will remove all collected responses.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setDeleteOpen(false);
                onDelete?.(survey.id);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default SurveyActions;
