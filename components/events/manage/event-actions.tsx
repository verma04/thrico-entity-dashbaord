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
  ExternalLink,
  Copy,
  Trash2,
  CheckCircle2,
  Clock,
  Ban,
  ShieldCheck,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  Event,
  useChangeEventStatus,
  useChangeEventVerification,
  useDeleteEvent,
} from "@/graphql/actions/events";

interface EventActionsProps {
  event: Event;
  trigger?: React.ReactNode;
}

export function EventActions({ event, trigger }: EventActionsProps) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [changeStatus, { loading: statusLoading }] = useChangeEventStatus({
    onCompleted: () => {
      toast.success("Event status updated successfully");
    },
    onError: (err) => {
      toast.error("Failed to update status", { description: err.message });
    },
  });

  const [changeVerification, { loading: verifyLoading }] =
    useChangeEventVerification({
      onCompleted: () => {
        toast.success("Verification status updated");
      },
      onError: (err) => {
        toast.error("Failed to update verification", { description: err.message });
      },
    });

  const [deleteEventMutation, { loading: deleteLoading }] = useDeleteEvent({
    onCompleted: () => {
      toast.success("Event deleted successfully");
      setDeleteOpen(false);
    },
    onError: (err) => {
      toast.error("Failed to delete event", { description: err.message });
    },
  });

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/events/${event.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard", {
      description: `Copied link for "${event.title}"`,
    });
  };

  const handleStatusChange = async (status: string) => {
    try {
      await changeStatus({
        variables: {
          input: {
            eventId: event.id,
            status,
          },
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleVerificationChange = async () => {
    try {
      await changeVerification({
        variables: {
          input: {
            eventId: event.id,
            isVerified: !event.verification?.isVerified,
          },
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEventMutation({
        variables: {
          eventId: event.id,
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
            onClick={() => router.push(`/events/${event.id}`)}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5"
          >
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            View Event
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
                onClick={() => handleStatusChange("APPROVED")}
                className="text-xs font-medium cursor-pointer gap-2 text-emerald-600"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("PENDING")}
                className="text-xs font-medium cursor-pointer gap-2 text-amber-600"
              >
                <Clock className="h-3.5 w-3.5" />
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("DISABLED")}
                className="text-xs font-medium cursor-pointer gap-2 text-orange-600"
              >
                <Ban className="h-3.5 w-3.5" />
                Disable
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("REJECTED")}
                className="text-xs font-medium cursor-pointer gap-2 text-rose-600"
              >
                <Ban className="h-3.5 w-3.5" />
                Reject
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Verification Toggle */}
          <DropdownMenuItem
            onClick={handleVerificationChange}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5"
          >
            {event.verification?.isVerified ? (
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
            Delete Event
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete &quot;{event.title}&quot;?
              This action cannot be undone and will remove all registrations and event data.
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
