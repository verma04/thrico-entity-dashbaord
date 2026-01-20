"use client";

import {
  CheckCircle,
  ThumbsDown,
  Edit,
  Eye,
  MoreHorizontal,
  Settings,
  StopCircle,
  Undo,
  UserX,
  Trash2,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
import React, { useState } from "react";
import { toast } from "sonner";
import {
  Offer,
  useChangeOfferStatus,
  useVerifyOffer,
  useDeleteOffer,
} from "@/graphql/actions/offers";
import { GET_OFFERS } from "@/graphql/quries/offers";

interface OfferActionsProps {
  offer: Offer;
  onEdit: (offer: Offer) => void;
  refetch: () => void;
}

export function OfferActions({ offer, onEdit, refetch }: OfferActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionReason, setActionReason] = useState("");
  const [dialogAction, setDialogAction] = useState<
    | "APPROVE"
    | "REJECT"
    | "ACTIVATE"
    | "DEACTIVATE"
    | "EXPIRE"
    | "VERIFY"
    | "UNVERIFY"
    | "DELETE"
  >();

  const [changeStatus, { loading: statusLoading }] = useChangeOfferStatus({
    onCompleted: () => {
      toast.success("Offer status updated successfully");
      setIsModalOpen(false);
      setActionReason("");
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const [verifyOffer, { loading: verifyLoading }] = useVerifyOffer({
    onCompleted: () => {
      toast.success("Offer verification updated");
      setIsModalOpen(false);
      setActionReason("");
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const [deleteOffer, { loading: deleteLoading }] = useDeleteOffer({
    onCompleted: () => {
      toast.success("Offer deleted successfully");
      setIsModalOpen(false);
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const handleAction = (action: any) => {
    setDialogAction(action);
    setIsModalOpen(true);
  };

  const confirmAction = async () => {
    if (dialogAction === "VERIFY" || dialogAction === "UNVERIFY") {
      await verifyOffer({
        variables: {
          input: {
            offerId: offer.id,
            isVerified: dialogAction === "VERIFY",
            verificationReason: actionReason,
          },
        },
      });
    } else if (dialogAction === "DELETE") {
      await deleteOffer({ variables: { id: offer.id } });
    } else if (dialogAction) {
      await changeStatus({
        variables: {
          input: {
            id: offer.id,
            action: dialogAction,
            reason: actionReason,
          },
        },
      });
    }
  };

  const getModalTitle = (action?: string) => {
    switch (action) {
      case "APPROVE":
        return "Approve Offer";
      case "REJECT":
        return "Reject Offer";
      case "ACTIVATE":
        return "Activate Offer";
      case "DEACTIVATE":
        return "Deactivate Offer";
      case "EXPIRE":
        return "Expire Offer";
      case "VERIFY":
        return "Verify Offer";
      case "UNVERIFY":
        return "Remove Verification";
      case "DELETE":
        return "Delete Offer";
      default:
        return "Confirm Action";
    }
  };

  const getModalDescription = (action?: string) => {
    switch (action) {
      case "DELETE":
        return "Are you sure you want to permanently delete this offer? This action cannot be undone.";
      case "VERIFY":
        return "Confirm verification for this offer. Please provide a reason.";
      default:
        return `Are you sure you want to ${action?.toLowerCase()} this offer?`;
    }
  };

  const isReasonRequired = [
    "APPROVE",
    "REJECT",
    "VERIFY",
    "DEACTIVATE",
  ].includes(dialogAction || "");
  const isLoading = statusLoading || verifyLoading || deleteLoading;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuItem
            onClick={() => onEdit(offer)}
            className="cursor-pointer"
          >
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onEdit(offer)}
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4 text-blue-600" />
            Edit Offer
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Conditional Actions based on status */}
          <DropdownMenuItem
            onClick={() => handleAction("VERIFY")}
            className="cursor-pointer"
          >
            <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-600" />
            Verify Offer
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              handleAction(offer.isActive ? "DEACTIVATE" : "ACTIVATE")
            }
            className="cursor-pointer"
          >
            <RefreshCw className="mr-2 h-4 w-4 text-amber-600" />
            {offer.isActive ? "Deactivate" : "Activate"}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => handleAction("DELETE")}
            className="cursor-pointer text-rose-600 focus:text-rose-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Offer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getModalTitle(dialogAction)}</DialogTitle>
            <DialogDescription>
              {getModalDescription(dialogAction)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">
                Reason for action{" "}
                {isReasonRequired && (
                  <span className="text-destructive">*</span>
                )}
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
              onClick={() => setIsModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant={
                ["DELETE", "REJECT", "DEACTIVATE"].includes(dialogAction || "")
                  ? "destructive"
                  : "default"
              }
              onClick={confirmAction}
              disabled={isLoading || (isReasonRequired && !actionReason.trim())}
            >
              {isLoading ? "Processing..." : "Confirm Action"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
