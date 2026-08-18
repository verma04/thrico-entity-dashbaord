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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Settings,
  CheckCircle,
  XCircle,
  ThumbsDown,
  Undo,
  Sparkles,
  Trash2,
  Copy,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  AdminOpportunity,
  OpportunityStatus,
  useAdminChangeOpportunityStatus,
  useAdminDeleteOpportunity,
  useAdminToggleOpportunityFeatured,
} from "@/graphql/actions/opportunities";

export interface OpportunityActionsProps {
  opportunity: AdminOpportunity;
  refetch?: () => void;
  trigger?: React.ReactNode;
}

export function OpportunityActions({
  opportunity,
  refetch,
  trigger,
}: OpportunityActionsProps) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<
    "APPROVED" | "REJECTED" | "PENDING"
  >();
  const [actionReason, setActionReason] = useState("");

  const [changeStatus, { loading: isChangingStatus }] =
    useAdminChangeOpportunityStatus({
      onCompleted: () => {
        toast.success(`Opportunity status updated successfully`);
        setStatusModalOpen(false);
        setActionReason("");
        refetch?.();
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to update status");
      },
    });

  const [deleteOpportunity, { loading: isDeleting }] =
    useAdminDeleteOpportunity({
      onCompleted: () => {
        toast.success("Opportunity deleted successfully");
        setDeleteOpen(false);
        refetch?.();
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to delete opportunity");
      },
    });

  const [toggleFeatured, { loading: isTogglingFeatured }] =
    useAdminToggleOpportunityFeatured({
      onCompleted: () => {
        toast.success(
          `Opportunity ${opportunity.isFeatured ? "removed from" : "marked as"} featured`,
        );
        refetch?.();
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to update featured status");
      },
    });

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/opportunities/${opportunity.id}/manage`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard", {
      description: `Copied link for "${opportunity.title}"`,
    });
  };

  const handleStatusClick = (action: "APPROVED" | "REJECTED" | "PENDING") => {
    setDialogAction(action);
    setStatusModalOpen(true);
  };

  const confirmStatusChange = () => {
    if (!dialogAction) return;
    changeStatus({
      variables: {
        input: {
          id: opportunity.id,
          status: dialogAction,
          reason: actionReason,
        },
      },
    });
  };

  const handleDelete = () => {
    deleteOpportunity({
      variables: {
        id: opportunity.id,
      },
    });
  };

  const handleToggleFeatured = () => {
    toggleFeatured({
      variables: {
        id: opportunity.id,
      },
    });
  };

  const isLoading = isChangingStatus || isDeleting || isTogglingFeatured;
  const isReasonRequired = dialogAction === "REJECTED";

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
            onClick={() => router.push(`/opportunities/${opportunity.id}/manage`)}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5"
          >
            <Settings className="h-3.5 w-3.5 text-muted-foreground" />
            Manage Opportunity
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleToggleFeatured}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            {opportunity.isFeatured ? "Remove Featured" : "Mark as Featured"}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleCopyLink}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5"
          >
            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
            Copy Link
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1" />

          {opportunity.status === "PENDING" && (
            <>
              <DropdownMenuItem
                onClick={() => handleStatusClick("APPROVED")}
                className="text-xs font-medium cursor-pointer gap-2 py-1.5 text-emerald-600 dark:text-emerald-400"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusClick("REJECTED")}
                className="text-xs font-medium cursor-pointer gap-2 py-1.5 text-rose-600 dark:text-rose-400"
              >
                <ThumbsDown className="h-3.5 w-3.5" />
                Reject
              </DropdownMenuItem>
            </>
          )}

          {opportunity.status === "REJECTED" && (
            <DropdownMenuItem
              onClick={() => handleStatusClick("APPROVED")}
              className="text-xs font-medium cursor-pointer gap-2 py-1.5 text-emerald-600 dark:text-emerald-400"
            >
              <Undo className="h-3.5 w-3.5" />
              Re-approve
            </DropdownMenuItem>
          )}

          {opportunity.status === "APPROVED" && (
            <DropdownMenuItem
              onClick={() => handleStatusClick("PENDING")}
              className="text-xs font-medium cursor-pointer gap-2 py-1.5 text-amber-600 dark:text-amber-400"
            >
              <XCircle className="h-3.5 w-3.5" />
              Mark as Pending
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator className="my-1" />

          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5 text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete Opportunity
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Status Confirmation Modal */}
      <Dialog open={statusModalOpen} onOpenChange={setStatusModalOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === "APPROVED" && "Approve Opportunity"}
              {dialogAction === "REJECTED" && "Reject Opportunity"}
              {dialogAction === "PENDING" && "Mark Opportunity as Pending"}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {dialogAction?.toLowerCase()} this opportunity?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">
                Reason for action {isReasonRequired && <span className="text-destructive">*</span>}
              </Label>
              <Textarea
                id="reason"
                rows={4}
                placeholder="Enter reason for this action..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setStatusModalOpen(false)}
              disabled={isChangingStatus}
            >
              Cancel
            </Button>
            <Button
              variant={
                dialogAction === "REJECTED"
                  ? "destructive"
                  : "default"
              }
              onClick={confirmStatusChange}
              disabled={
                (isReasonRequired && !actionReason.trim()) ||
                isChangingStatus
              }
            >
              {isChangingStatus ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                dialogAction === "APPROVED" ? "Approve" : dialogAction === "REJECTED" ? "Reject" : "Mark Pending"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Opportunity?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete <strong>{opportunity.title}</strong>?
              This action cannot be undone.
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

export default OpportunityActions;
