"use client";

import {
  CheckCircle,
  XCircle,
  Eye,
  MoreHorizontal,
  Ban,
  Clock,
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
import { useUpdateMentorshipStatus } from "@/graphql/mentorship/mentorship-quiries";
import { useFeatureMentor } from "@/graphql/mentorship/mentoship-muation";
import { Star, StarOff } from "lucide-react";
import { MentorDetailsDialog } from "./mentor-details-dialog";

interface Mentor {
  id: string;
  displayName: string;
  isApproved: boolean;
  isRequested: boolean;
  isFeatured?: boolean;
  [key: string]: any; // Allow for other fields like about, intro, etc.
}

interface MentorActionsProps {
  mentor: Mentor;
  onView: (mentor: Mentor) => void;
  refetch: () => void;
}

type ActionType =
  | "APPROVE"
  | "REJECT"
  | "BLOCK"
  | "VIEW_DETAILS"
  | "FEATURE"
  | "UNFEATURE";

export function MentorActions({ mentor, onView, refetch }: MentorActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [actionReason, setActionReason] = useState("");
  const [dialogAction, setDialogAction] = useState<ActionType>();

  const [updateStatus, { loading: statusLoading }] = useUpdateMentorshipStatus({
    onCompleted: () => {
      const actionText = dialogAction?.toLowerCase() || "updated";
      toast.success(`Mentor ${actionText} successfully`);
      setIsModalOpen(false);
      setActionReason("");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Action failed");
    },
  });

  const [featureMentor, { loading: featureLoading }] = useFeatureMentor({
    onCompleted: (data) => {
      toast.success(
        `Mentor ${data.featureMentor.isFeatured ? "featured" : "unfeatured"} successfully`,
      );
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Action failed");
    },
  });

  const isLoading = statusLoading || featureLoading;

  const handleAction = (action: ActionType) => {
    if (action === "VIEW_DETAILS") {
      setIsDetailsOpen(true);
      return;
    }
    setDialogAction(action);
    setIsModalOpen(true);
  };

  const confirmAction = async () => {
    if (!dialogAction || dialogAction === "VIEW_DETAILS") return;

    if (dialogAction === "FEATURE" || dialogAction === "UNFEATURE") {
      await featureMentor({
        variables: {
          input: {
            mentorshipId: mentor.id,
            isFeatured: dialogAction === "FEATURE",
          },
        },
      });
      setIsModalOpen(false); // No modal for feature/unfeature but good to be safe
      return;
    }

    const statusMap = {
      APPROVE: "APPROVED",
      REJECT: "REJECTED",
      BLOCK: "BLOCKED",
    } as const;

    await updateStatus({
      variables: {
        input: {
          mentorshipId: mentor.id,
          status: statusMap[
            dialogAction as "APPROVE" | "REJECT" | "BLOCK"
          ] as any,
        },
      },
    });
  };

  const getModalTitle = (action?: ActionType) => {
    switch (action) {
      case "APPROVE":
        return "Approve Mentor";
      case "REJECT":
        return "Reject Mentor";
      case "BLOCK":
        return "Block Mentor";
      default:
        return "Confirm Action";
    }
  };

  const getModalDescription = (action?: ActionType) => {
    switch (action) {
      case "APPROVE":
        return "Are you sure you want to approve this mentor application? They will be able to start mentoring.";
      case "REJECT":
        return "Are you sure you want to reject this mentor application? Please provide a reason.";
      case "BLOCK":
        return "Are you sure you want to block this mentor? This action can be reversed later.";
      default:
        return "Please confirm this action.";
    }
  };

  const isReasonRequired = ["REJECT", "BLOCK"].includes(dialogAction || "");

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
            onClick={() => handleAction("VIEW_DETAILS")}
            className="cursor-pointer"
          >
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {!mentor.isApproved && (
            <DropdownMenuItem
              onClick={() => handleAction("APPROVE")}
              className="cursor-pointer text-emerald-600"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={() => handleAction("REJECT")}
            className="cursor-pointer text-rose-600"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Reject
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              handleAction(mentor.isFeatured ? "UNFEATURE" : "FEATURE")
            }
            className="cursor-pointer"
          >
            {mentor.isFeatured ? (
              <>
                <StarOff className="mr-2 h-4 w-4 text-amber-500" />
                Remove Featured
              </>
            ) : (
              <>
                <Star className="mr-2 h-4 w-4 text-amber-500" />
                Mark Featured
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => handleAction("BLOCK")}
            className="cursor-pointer text-amber-600"
          >
            <Ban className="mr-2 h-4 w-4" />
            Block
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
                Reason{" "}
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
                ["REJECT", "BLOCK"].includes(dialogAction || "")
                  ? "destructive"
                  : "default"
              }
              onClick={confirmAction}
              disabled={isLoading || (isReasonRequired && !actionReason.trim())}
            >
              {isLoading ? "Processing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MentorDetailsDialog
        mentor={mentor}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </>
  );
}
