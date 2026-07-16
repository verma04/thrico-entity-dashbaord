"use client";

import {
  CheckCircle,
  XCircle,
  Eye,
  MoreHorizontal,
  Clock,
  Sparkles,
  Trash2,
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
import { useFeatureMentor, useMarkTopMentor, useRemoveMentor } from "@/graphql/mentorship/mentoship-muation";
import { Star, StarOff, MessageSquare } from "lucide-react";
import { MentorDetailsDialog } from "./mentor-details-dialog";
import { AddTestimonialDialog } from "./add-testimonial-dialog";
import { MentorTestimonialsDialog } from "./mentor-testimonials-dialog";

interface Mentor {
  id: string;
  displayName: string;
  isApproved: boolean;
  isRequested: boolean;
  isTopMentor?: boolean;
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
  | "MARK_TOP"
  | "REMOVE_TOP"
  | "ADD_TESTIMONIAL"
  | "MANAGE_TESTIMONIALS"
  | "REMOVE";

export function MentorActions({ mentor, onView, refetch }: MentorActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isTestimonialOpen, setIsTestimonialOpen] = useState(false);
  const [isManageTestimonialsOpen, setIsManageTestimonialsOpen] = useState(false);
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


  const [markTopMentor, { loading: topLoading }] = useMarkTopMentor({
    onCompleted: (data) => {
      toast.success(
        `Mentor ${data.markTopMentor.isTopMentor ? "marked as top" : "removed from top"} successfully`,
      );
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Action failed");
    },
  });

  const [removeMentor, { loading: removeLoading }] = useRemoveMentor({
    onCompleted: () => {
      toast.success("Mentor removed successfully");
      setIsModalOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Removal failed");
    },
  });

  const isLoading = statusLoading || topLoading || removeLoading;

  const handleAction = (action: ActionType) => {
    if (action === "VIEW_DETAILS") {
      setIsDetailsOpen(true);
      return;
    }
    if (action === "ADD_TESTIMONIAL") {
      setIsTestimonialOpen(true);
      return;
    }
    if (action === "MANAGE_TESTIMONIALS") {
      setIsManageTestimonialsOpen(true);
      return;
    }
    setDialogAction(action);
    setIsModalOpen(true);
  };

  const confirmAction = async () => {
    if (!dialogAction || dialogAction === "VIEW_DETAILS" || dialogAction === "ADD_TESTIMONIAL" || dialogAction === "MANAGE_TESTIMONIALS") return;


    if (dialogAction === "MARK_TOP" || dialogAction === "REMOVE_TOP") {
      await markTopMentor({
        variables: {
          input: {
            mentorshipId: mentor.id,
            isTopMentor: dialogAction === "MARK_TOP",
          },
        },
      });
      setIsModalOpen(false);
      return;
    }

    if (dialogAction === "REMOVE") {
      await removeMentor({
        variables: {
          id: mentor.id,
        },
      });
      return;
    }

    const statusMap = {
      APPROVE: "APPROVED",
      REJECT: "REJECTED",
    } as const;

    await updateStatus({
      variables: {
        input: {
          mentorshipId: mentor.id,
          status: statusMap[
            dialogAction as "APPROVE" | "REJECT"
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
      case "REMOVE":
        return "Remove Mentor";
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
      case "REMOVE":
        return "Are you sure you want to permanently remove this mentor? This action cannot be undone.";
      default:
        return "Please confirm this action.";
    }
  };

  const isReasonRequired = ["REJECT"].includes(dialogAction || "");

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

          {!mentor.isApproved && (
            <DropdownMenuItem
              onClick={() => handleAction("REJECT")}
              className="cursor-pointer text-rose-600"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={() =>
              handleAction(mentor.isTopMentor ? "REMOVE_TOP" : "MARK_TOP")
            }
            className="cursor-pointer"
          >
            {mentor.isTopMentor ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 text-indigo-500 fill-indigo-500" />
                Remove Top Mentor
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4 text-indigo-500" />
                Mark Top Mentor
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleAction("ADD_TESTIMONIAL")}
            className="cursor-pointer"
          >
            <Star className="mr-2 h-4 w-4" />
            Add Testimonial
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleAction("MANAGE_TESTIMONIALS")}
            className="cursor-pointer"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Manage Testimonials
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => handleAction("REMOVE")}
            className="cursor-pointer text-rose-600 font-bold"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove Mentor
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
                ["REJECT", "REMOVE"].includes(dialogAction || "")
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

      <AddTestimonialDialog
        mentorId={mentor.id}
        mentorName={mentor.displayName || mentor.name || "Mentor"}
        open={isTestimonialOpen}
        onOpenChange={setIsTestimonialOpen}
      />

      <MentorTestimonialsDialog
        mentorId={mentor.id}
        mentorName={mentor.displayName || mentor.name || "Mentor"}
        open={isManageTestimonialsOpen}
        onOpenChange={setIsManageTestimonialsOpen}
      />
    </>
  );
}
