"use client";

import React, { useState } from "react";
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
  PlaySquare,
  Copy,
  Trash2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Moment, useAdminDeleteMoment } from "@/graphql/actions/moments";
import { useModuleStore } from "@/store/useModuleStore";

export interface MomentActionsProps {
  moment: Moment;
  onPreview?: () => void;
  onDelete?: (id: string) => void;
  trigger?: React.ReactNode;
}

export function MomentActions({
  moment,
  onPreview,
  onDelete,
  trigger,
}: MomentActionsProps) {
  const singularName = useModuleStore((state) => state.momentSingularName);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { deleteMoment, loading: deleteLoading } = useAdminDeleteMoment();

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = moment.videoUrl || `${window.location.origin}/moments/all`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard", {
      description: `Copied media link for ${singularName.toLowerCase()}`,
    });
  };

  const handleDelete = async () => {
    if (onDelete) {
      onDelete(moment.id);
      setDeleteOpen(false);
      return;
    }

    try {
      const { data } = await deleteMoment({
        variables: { adminDeleteMomentId: moment.id },
      });
      if (data?.adminDeleteMoment) {
        toast.success(`${singularName} deleted successfully`);
        setDeleteOpen(false);
      } else {
        toast.error(`Failed to delete ${singularName.toLowerCase()}`);
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred while deleting");
    }
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
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <MoreHorizontal className="h-3.5 w-3.5" />
              )}
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

          {onPreview && (
            <DropdownMenuItem
              onClick={onPreview}
              className="text-xs font-medium cursor-pointer gap-2 py-1.5"
            >
              <PlaySquare className="h-3.5 w-3.5 text-muted-foreground" />
              Play {singularName}
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={handleCopyLink}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5"
          >
            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
            Copy Media Link
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1" />

          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5 text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete {singularName}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {singularName}?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this {singularName.toLowerCase()}?
              This action cannot be undone and will remove the video media from feeds.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteLoading ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default MomentActions;
