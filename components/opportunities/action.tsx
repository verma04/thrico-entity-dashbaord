"use client";

import {
  CheckCircle,
  ThumbsDown,
  Eye,
  MoreHorizontal,
  Settings,
  XCircle,
  Undo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AdminOpportunity,
  useAdminChangeOpportunityStatus,
} from "@/graphql/actions/opportunities";

const Actions = (record: AdminOpportunity) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<AdminOpportunity | null>(null);
  const [dialogAction, setDialogAction] = useState<
    "APPROVED" | "REJECTED" | "PENDING"
  >();
  const [actionReason, setActionReason] = useState("");

  const router = useRouter();

  const handleAction = (
    action: "APPROVED" | "REJECTED" | "PENDING",
    item: AdminOpportunity,
  ) => {
    setActiveItem(item);
    setDialogAction(action);
    setIsModalOpen(true);
  };

  const handleViewSettings = (item: AdminOpportunity) => {
    router.push(`/opportunities/${item.id}/manage`);
  };

  const onCompleted = () => {
    setIsModalOpen(false);
    setActionReason("");
    setActiveItem(null);
  };

  const [changeStatus, { loading }] = useAdminChangeOpportunityStatus({
    onCompleted,
  });

  const confirmAction = () => {
    changeStatus({
      variables: {
        input: {
          id: activeItem?.id,
          status: dialogAction,
          reason: actionReason,
        },
      },
    });
  };

  const isReasonRequired =
    dialogAction === "REJECTED";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleViewSettings(record)}>
            <Settings className="mr-2 h-4 w-4" />
            Manage
          </DropdownMenuItem>

          {record?.status === "PENDING" && (
            <>
              <DropdownMenuItem onClick={() => handleAction("APPROVED", record)}>
                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("REJECTED", record)}>
                <ThumbsDown className="mr-2 h-4 w-4 text-purple-600" />
                Reject
              </DropdownMenuItem>
            </>
          )}

          {record?.status === "REJECTED" && (
            <DropdownMenuItem onClick={() => handleAction("APPROVED", record)}>
              <Undo className="mr-2 h-4 w-4" />
              Re-approve
            </DropdownMenuItem>
          )}

          {record?.status === "APPROVED" && (
            <>
              <DropdownMenuItem onClick={() => handleAction("PENDING", record)}>
                <XCircle className="mr-2 h-4 w-4 text-amber-600" />
                Mark as Pending
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
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
                Reason for action {isReasonRequired && "*"}
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
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={
                dialogAction === "REJECTED"
                  ? "destructive"
                  : "default"
              }
              onClick={confirmAction}
              disabled={
                (isReasonRequired && !actionReason.trim()) ||
                loading
              }
            >
              {dialogAction === "APPROVED" && "Approve"}
              {dialogAction === "REJECTED" && "Reject"}
              {dialogAction === "PENDING" && "Mark Pending"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Actions;
