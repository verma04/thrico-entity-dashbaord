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
  Pencil,
  Copy,
  Trash2,
  Loader2,
  CheckCircle2,
  Clock,
  Ban,
  ShieldCheck,
  ShieldAlert,
  History,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import {
  Offer,
  useDeleteOffer,
  useVerifyOffer,
  useChangeOfferStatus,
} from "@/graphql/actions/offers";
import { useModuleStore } from "@/store/useModuleStore";

export interface OfferActionsProps {
  offer: Offer;
  onEdit?: (offer: Offer) => void;
  refetch?: (variables?: any) => Promise<any> | void;
  trigger?: React.ReactNode;
}

export function OfferActions({
  offer,
  onEdit,
  refetch,
  trigger,
}: OfferActionsProps) {
  const router = useRouter();
  const singularName = useModuleStore((state) => state.offerSingularName);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [deleteOffer, { loading: isDeleting }] = useDeleteOffer({
    onCompleted: () => {
      toast.success(`${singularName} deleted successfully`);
      setDeleteOpen(false);
      refetch?.();
    },
    onError: (err) => {
      toast.error(err.message || `Failed to delete ${singularName.toLowerCase()}`);
    },
  });

  const [verifyOffer, { loading: isVerifying }] = useVerifyOffer({
    onCompleted: (data) => {
      toast.success(
        data.verifyOffer.isVerified
          ? `${singularName} verified successfully`
          : `${singularName} unverified`,
      );
      refetch?.();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update verification status");
    },
  });

  const [changeStatus, { loading: isChangingStatus }] = useChangeOfferStatus({
    onCompleted: () => {
      toast.success(`${singularName} status updated successfully`);
      refetch?.();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update status");
    },
  });

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/offers/${offer.id}/manage`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard", {
      description: `Copied link for "${offer.title}"`,
    });
  };

  const handleDelete = async () => {
    try {
      await deleteOffer({ variables: { id: offer.id } });
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusChange = async (action: "APPROVE" | "ACTIVATE" | "DEACTIVATE" | "EXPIRE") => {
    try {
      await changeStatus({
        variables: {
          input: {
            id: offer.id,
            action,
            reason: "",
          },
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleVerificationChange = async () => {
    try {
      const isVerified = !!offer.verification?.isVerified;
      await verifyOffer({
        variables: {
          input: {
            offerId: offer.id,
            isVerified: !isVerified,
            verificationReason: "",
          },
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const isLoading = isDeleting || isVerifying || isChangingStatus;

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
            onClick={() => router.push(`/offers/${offer.id}/manage`)}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5"
          >
            <Settings className="h-3.5 w-3.5 text-muted-foreground" />
            Manage {singularName}
          </DropdownMenuItem>

          {onEdit && (
            <DropdownMenuItem
              onClick={() => onEdit(offer)}
              className="text-xs font-medium cursor-pointer gap-2 py-1.5"
            >
              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
              Edit Details
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={() => router.push(`/offers/${offer.id}/audit-log`)}
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
                onClick={() => handleStatusChange("ACTIVATE")}
                className="text-xs font-medium cursor-pointer gap-2 text-emerald-600 dark:text-emerald-400"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Active
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("DEACTIVATE")}
                className="text-xs font-medium cursor-pointer gap-2 text-amber-600 dark:text-amber-400"
              >
                <Clock className="h-3.5 w-3.5" />
                Inactive
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("EXPIRE")}
                className="text-xs font-medium cursor-pointer gap-2 text-rose-600 dark:text-rose-400"
              >
                <Ban className="h-3.5 w-3.5" />
                Expire
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Verification Toggle */}
          <DropdownMenuItem
            onClick={handleVerificationChange}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5"
          >
            {offer.verification?.isVerified ? (
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

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {singularName}?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete <strong>{offer.title}</strong>?
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

export default OfferActions;
