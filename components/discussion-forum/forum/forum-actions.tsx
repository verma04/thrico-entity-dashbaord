"use client";

import { useState } from "react";
import {
  CheckCircle,
  X,
  Edit,
  Eye,
  MoreHorizontal,
  ListOrdered,
  Undo2,
  UserX,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getModalDescription, getModalTitle } from "../utils";
import Details from "./forum-details";
import { discussionForm } from "../ts-types";
import {
  changeDiscussionForumStatus,
  changeDiscussionForumVerification,
} from "../../../graphql/actions/discussion-form";
import EditForum from "../post/forum-edit";

const Actions = (record: discussionForm) => {
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isEdit, setEditOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedForum, setSelectedForum] = useState<discussionForm | null>(
    null
  );
  const [dialogAction, setDialogAction] = useState<
    | "APPROVE"
    | "DISABLE"
    | "ENABLE"
    | "REJECT"
    | "VERIFY"
    | "UNVERIFY"
    | "REAPPROVE"
  >();
  const [actionReason, setActionReason] = useState("");

  const handleAction = (
    action:
      | "APPROVE"
      | "DISABLE"
      | "ENABLE"
      | "REJECT"
      | "VERIFY"
      | "UNVERIFY"
      | "REAPPROVE",
    user: discussionForm | null
  ) => {
    setSelectedForum(user);
    setDialogAction(action);
    setIsModalOpen(true);
  };

  const handleViewDetails = (user: discussionForm) => {
    setSelectedForum(user);
    setIsDrawerOpen(true);
  };

  const handleEdit = (user: discussionForm) => {
    setSelectedForum(user);
    setEditOpen(true);
  };

  const onCompleted = () => {
    setIsModalOpen(false);
    setActionReason("");
    setSelectedForum(null);
    setIsDrawerOpen(false);
  };

  const [action, { loading }] = changeDiscussionForumStatus({
    onCompleted,
  });

  const [changeVerification, { loading: verifyBtn }] =
    changeDiscussionForumVerification({
      onCompleted,
    });

  const confirmAction = () => {
    if (dialogAction === "VERIFY" || dialogAction === "UNVERIFY") {
      return changeVerification({
        variables: {
          input: {
            reason: actionReason,
            discussionForumId: selectedForum?.id,
            action: dialogAction,
          },
        },
      });
    } else {
      action({
        variables: {
          input: {
            discussionForumId: selectedForum?.id,
            action: dialogAction,
            reason: actionReason,
          },
        },
      });
    }
  };

  const isReasonRequired =
    dialogAction === "APPROVE" ||
    dialogAction === "REJECT" ||
    dialogAction === "VERIFY" ||
    dialogAction === "REAPPROVE";

  const getActionButtonText = () => {
    switch (dialogAction) {
      case "APPROVE":
        return "Approve Forum";
      case "DISABLE":
        return "Disable Forum";
      case "ENABLE":
        return "Enable Forum";
      case "REJECT":
        return "Reject Forum";
      case "VERIFY":
        return "Verify Forum";
      case "UNVERIFY":
        return "Remove Verification";
      case "REAPPROVE":
        return "Re-approve Forum";
      default:
        return "Confirm";
    }
  };

  const getActionVariant = () => {
    if (dialogAction === "DISABLE" || dialogAction === "REJECT") {
      return "destructive";
    }
    return "default";
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => handleViewDetails(record)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleEdit(record)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsAuditModalOpen(true)}>
            <ListOrdered className="mr-2 h-4 w-4" />
            Audit Log
          </DropdownMenuItem>

          {(record?.status === "PENDING" ||
            record?.status === "REJECTED" ||
            record?.status === "APPROVED" ||
            record?.status === "DISABLED") && <DropdownMenuSeparator />}

          {record?.status === "PENDING" && (
            <>
              <DropdownMenuItem onClick={() => handleAction("APPROVE", record)}>
                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                Approve Forum
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("REJECT", record)}>
                <X className="mr-2 h-4 w-4 text-purple-600" />
                Reject Forum
              </DropdownMenuItem>
            </>
          )}

          {record?.status === "REJECTED" && (
            <DropdownMenuItem onClick={() => handleAction("REAPPROVE", record)}>
              <Undo2 className="mr-2 h-4 w-4" />
              Re-approve Forum
            </DropdownMenuItem>
          )}

          {record?.status === "APPROVED" && (
            <>
              {record?.verification?.isVerified ? (
                <DropdownMenuItem
                  onClick={() => handleAction("UNVERIFY", record)}
                >
                  <ShieldOff className="mr-2 h-4 w-4 text-amber-600" />
                  Remove Verification
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => handleAction("VERIFY", record)}
                >
                  <ShieldCheck className="mr-2 h-4 w-4 text-blue-600" />
                  Verify Forum
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => handleAction("DISABLE", record)}>
                <UserX className="mr-2 h-4 w-4 text-amber-600" />
                Disable Forum
              </DropdownMenuItem>
            </>
          )}

          {record?.status === "DISABLED" && (
            <DropdownMenuItem onClick={() => handleAction("ENABLE", record)}>
              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
              Enable Forum
            </DropdownMenuItem>
          )}
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
                Reason for action
                {isReasonRequired && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </Label>
              <Textarea
                id="reason"
                rows={4}
                placeholder="Enter reason for this action..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className={
                  isReasonRequired && !actionReason.trim()
                    ? "border-red-500"
                    : ""
                }
              />
              {isReasonRequired && !actionReason.trim() && (
                <p className="text-sm text-red-500">Please enter a reason</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={getActionVariant()}
              onClick={confirmAction}
              disabled={
                (isReasonRequired && !actionReason.trim()) ||
                loading ||
                verifyBtn
              }
            >
              {loading || verifyBtn ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Processing...
                </>
              ) : (
                getActionButtonText()
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Details
        selectedForum={selectedForum}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        handleAction={handleAction}
      />

      {selectedForum && (
        <EditForum
          forum={selectedForum}
          open={isEdit}
          onClose={() => setEditOpen(false)}
        />
      )}

      {/* <AuditLogSidebar
        isAuditModalOpen={isAuditModalOpen}
        userId={selectedLog?.id}
        onViewAll={handleViewAllLogs}
        onViewDetails={handleViewAuditLog}
        setIsAuditModalOpen={setIsAuditModalOpen}
      />  */}
    </>
  );
};

export default Actions;
