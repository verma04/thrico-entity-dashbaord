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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  ExternalLink,
  Copy,
  Trash2,
  CheckCircle2,
  Clock,
  Ban,
  XCircle,
  PauseCircle,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Settings,
  History,
} from "lucide-react";
import { toast } from "sonner";
import type { communityEntity } from "../ts-types";
import {
  changeDiscussionCommunityStatus,
  changeDiscussionCommunityVerification,
  deleteCommunity,
} from "@/graphql/actions/group";
import { useModuleStore } from "@/store/useModuleStore";

export interface CommunityActionsProps {
  record?: communityEntity;
  // If props are passed directly as record fields (backwards compat):
  id?: string;
  title?: string;
  status?: any;
  verification?: any;
  trigger?: React.ReactNode;
}

export function CommunityActions(props: CommunityActionsProps | communityEntity) {
  // Support both { record, trigger } and direct communityEntity prop spreading
  const record: communityEntity =
    "record" in props && props.record
      ? props.record
      : (props as communityEntity);

  const trigger = "trigger" in props ? props.trigger : undefined;

  const router = useRouter();
  const singularName = useModuleStore((state) => state.communitySingularName);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
  const [pendingStatusAction, setPendingStatusAction] = useState<string | null>(null);
  const [actionReason, setActionReason] = useState("");

  const [changeStatus, { loading: statusLoading }] =
    changeDiscussionCommunityStatus({
      onCompleted: () => {
        toast.success(`${singularName} status updated successfully`);
        setReasonDialogOpen(false);
        setActionReason("");
        setPendingStatusAction(null);
      },
      onError: (err: any) => {
        toast.error("Failed to update status", { description: err.message });
      },
    });

  const [changeVerification, { loading: verifyLoading }] =
    changeDiscussionCommunityVerification({
      onCompleted: () => {
        toast.success("Verification status updated");
      },
      onError: (err: any) => {
        toast.error("Failed to update verification", { description: err.message });
      },
    });

  const [deleteCommunityMutation, { loading: deleteLoading }] = deleteCommunity({
    onCompleted: () => {
      toast.success(`${singularName} deleted successfully`);
      setDeleteOpen(false);
    },
    onError: (err: any) => {
      toast.error(`Failed to delete ${singularName.toLowerCase()}`, {
        description: err.message,
      });
    },
  });

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/communities/${record.id}/about`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard", {
      description: `Copied link for "${record.title}"`,
    });
  };

  const handleStatusChange = async (action: string) => {
    // If action is REJECT or DISABLE, optionally ask for reason
    if (action === "REJECT" || action === "DISABLE") {
      setPendingStatusAction(action);
      setReasonDialogOpen(true);
      return;
    }

    try {
      await changeStatus({
        variables: {
          input: {
            communityId: record.id,
            action,
            reason: "",
          },
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const submitStatusWithReason = async () => {
    if (!pendingStatusAction) return;
    try {
      await changeStatus({
        variables: {
          input: {
            communityId: record.id,
            action: pendingStatusAction,
            reason: actionReason,
          },
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleVerificationChange = async () => {
    try {
      const isVerified = !!record.verification?.isVerified;
      await changeVerification({
        variables: {
          input: {
            communityId: record.id,
            action: isVerified ? "UNVERIFY" : "VERIFY",
            reason: "",
          },
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCommunityMutation({
        variables: {
          id: record.id,
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const isLoading = statusLoading || verifyLoading || deleteLoading;

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
            onClick={() => router.push(`/communities/${record.id}/about`)}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5"
          >
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            View {singularName}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleCopyLink}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5"
          >
            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
            Copy Link
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/communities/${record.id}/audit-log`)}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5"
          >
            <History className="h-3.5 w-3.5 text-muted-foreground" />
            Audit Log
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/communities/${record.id}/setting`)}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5"
          >
            <Settings className="h-3.5 w-3.5 text-muted-foreground" />
            Manage Settings
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
                onClick={() => handleStatusChange("APPROVE")}
                className="text-xs font-medium cursor-pointer gap-2 text-emerald-600 dark:text-emerald-400"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("PENDING")}
                className="text-xs font-medium cursor-pointer gap-2 text-amber-600 dark:text-amber-400"
              >
                <Clock className="h-3.5 w-3.5" />
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("DISABLE")}
                className="text-xs font-medium cursor-pointer gap-2 text-orange-600 dark:text-orange-400"
              >
                <Ban className="h-3.5 w-3.5" />
                Disable
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("REJECT")}
                className="text-xs font-medium cursor-pointer gap-2 text-rose-600 dark:text-rose-400"
              >
                <XCircle className="h-3.5 w-3.5" />
                Reject
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("PAUSE")}
                className="text-xs font-medium cursor-pointer gap-2 text-slate-600 dark:text-slate-400"
              >
                <PauseCircle className="h-3.5 w-3.5" />
                Pause
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Verification Toggle */}
          <DropdownMenuItem
            onClick={handleVerificationChange}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5"
          >
            {record.verification?.isVerified ? (
              <>
                <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
                Remove Verification
              </>
            ) : (
              <>
                <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                Mark Verified
              </>
            )}
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

      {/* Optional Reason Dialog for Disable/Reject */}
      <Dialog open={reasonDialogOpen} onOpenChange={setReasonDialogOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>
              {pendingStatusAction === "REJECT" ? "Reject" : "Disable"}{" "}
              {singularName}
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for this action.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                rows={4}
                placeholder="Enter reason..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReasonDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={submitStatusWithReason}
              disabled={statusLoading}
            >
              {statusLoading ? "Saving…" : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {singularName}?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete &quot;{record.title}&quot;?
              This action cannot be undone and will remove all associated data.
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

export default CommunityActions;
