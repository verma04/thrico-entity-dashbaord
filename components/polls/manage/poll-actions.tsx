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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
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
  Copy,
  Trash2,
  Loader2,
  CheckCircle2,
  Ban,
  Clock,
  History,
  Settings,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import {
  changePollStatus,
  deletePoll,
} from "@/graphql/actions/polls";
import { poll, Status } from "../ts-types";
import { useModuleStore } from "@/store/useModuleStore";

export interface PollActionsProps {
  poll: poll;
  refetch?: () => void;
  trigger?: React.ReactNode;
}

export function PollActions({ poll, refetch, trigger }: PollActionsProps) {
  const router = useRouter();
  const singularName = useModuleStore((state) => state.pollSingularName);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [deletePollMutation, { loading: isDeleting }] = deletePoll({
    onCompleted: () => {
      toast.success(`${singularName} deleted successfully`);
      setDeleteOpen(false);
      refetch?.();
    },
    onError: (err: any) => {
      toast.error(err.message || `Failed to delete ${singularName.toLowerCase()}`);
    },
  });

  const [changeStatus, { loading: isChangingStatus }] = changePollStatus({
    onCompleted: () => {
      toast.success(`${singularName} status updated successfully`);
      refetch?.();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update status");
    },
  });

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/polls/${poll.id}/manage`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard", {
      description: `Copied link for "${poll.title}"`,
    });
  };

  const handleStatusChange = async (status: Status) => {
    try {
      await changeStatus({
        variables: {
          input: {
            id: poll.id,
            status,
          },
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePollMutation({
        variables: {
          id: poll.id,
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const isLoading = isChangingStatus || isDeleting;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          {trigger || (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-md transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
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
          <DropdownMenuItem
            onClick={() => router.push(`/polls/${poll.id}/manage`)}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5"
          >
            <Settings className="h-3.5 w-3.5 text-muted-foreground" />
            Manage {singularName}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push(`/polls/${poll.id}/results`)}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5"
          >
            <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
            View Results
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push(`/polls/${poll.id}/audit-log`)}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5"
          >
            <History className="h-3.5 w-3.5 text-muted-foreground" />
            Audit Log
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleCopyLink}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5"
          >
            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
            Copy Link
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1" />

          {/* Status Submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="text-xs font-medium cursor-pointer gap-2 py-1.5">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              Change Status
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-36 p-1">
              <DropdownMenuItem
                onClick={() => handleStatusChange(Status.APPROVED)}
                className="text-xs font-medium cursor-pointer gap-2 text-emerald-600 dark:text-emerald-400"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange(Status.DISABLED)}
                className="text-xs font-medium cursor-pointer gap-2 text-orange-600 dark:text-orange-400"
              >
                <Ban className="h-3.5 w-3.5" />
                Disable
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

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
              Are you sure you want to permanently delete <strong>{poll.title}</strong>?
              This action cannot be undone and will remove all recorded votes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default PollActions;
