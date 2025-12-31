import {
  CheckCircle,
  ThumbsDown,
  Edit,
  Eye,
  MoreHorizontal,
  ListOrdered,
  Settings,
  StopCircle,
  Undo,
  UserX,
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";

import { communityEntity } from "./ts-types";
import { getModalDescription, getModalTitle } from "./utils";
import Manage from "./settings/Manage";
import { useRouter } from "next/navigation";
import {
  changeDiscussionCommunityStatus,
  changeDiscussionCommunityVerification,
} from "../../graphql/actions/group";

const Actions = (record: communityEntity) => {
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isEdit, setEditOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] =
    useState<communityEntity | null>(null);

  const [dialogAction, setDialogAction] = useState<
    | "APPROVE"
    | "DISABLE"
    | "ENABLE"
    | "REJECT"
    | "VERIFY"
    | "UNVERIFY"
    | "REAPPROVE"
    | "PAUSE"
  >();

  const handleAction = (
    action:
      | "APPROVE"
      | "DISABLE"
      | "ENABLE"
      | "REJECT"
      | "VERIFY"
      | "UNVERIFY"
      | "REAPPROVE"
      | "PAUSE",
    user: communityEntity | null
  ) => {
    setSelectedCommunity(user);
    setDialogAction(action);
    setIsModalOpen(true);
  };

  const handleViewDetails = (user: communityEntity) => {
    router.push(`/communities/${user.id}/discussion`);
  };
  const router = useRouter();

  const handleViewSettings = (user: communityEntity) => {
    router.push(`/communities/${user.id}/manage`);
  };

  const handleEdit = (user: communityEntity) => {
    setSelectedCommunity(user);
    setEditOpen(true);
  };

  const [actionReason, setActionReason] = useState("");

  const onCompleted = () => {
    setIsModalOpen(false);
    setActionReason("");
    setSelectedCommunity(null);
    setIsDrawerOpen(false);
  };

  const [action, { loading }] = changeDiscussionCommunityStatus({
    onCompleted,
  });
  const [changeVerification, { loading: verifyBtn }] =
    changeDiscussionCommunityVerification({
      onCompleted,
    });
  const confirmAction = () => {
    if (dialogAction === "VERIFY" || dialogAction === "UNVERIFY") {
      return changeVerification({
        variables: {
          input: {
            reason: actionReason,
            communityId: selectedCommunity?.id,
            action: dialogAction,
          },
        },
      });
    } else {
      action({
        variables: {
          input: {
            communityId: selectedCommunity?.id,
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

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleViewDetails(record)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsAuditModalOpen(true)}>
            <ListOrdered className="mr-2 h-4 w-4" />
            Audit Log
          </DropdownMenuItem>

          {record?.status === "PENDING" && (
            <>
              <DropdownMenuItem onClick={() => handleAction("APPROVE", record)}>
                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                Approve Community
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("REJECT", record)}>
                <ThumbsDown className="mr-2 h-4 w-4 text-purple-600" />
                Reject Community
              </DropdownMenuItem>
            </>
          )}

          {record?.status === "REJECTED" && (
            <DropdownMenuItem onClick={() => handleAction("REAPPROVE", record)}>
              <Undo className="mr-2 h-4 w-4" />
              Re-approve Community
            </DropdownMenuItem>
          )}

          {record?.status === "APPROVED" && (
            <>
              <DropdownMenuItem onClick={() => handleAction("DISABLE", record)}>
                <UserX className="mr-2 h-4 w-4 text-yellow-600" />
                Disable Community
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("PAUSE", record)}>
                <StopCircle className="mr-2 h-4 w-4 text-yellow-600" />
                Pause Community
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleViewSettings(record)}>
                <Settings className="mr-2 h-4 w-4" />
                Manage Settings
              </DropdownMenuItem>
            </>
          )}

          {record?.status === "DISABLED" && (
            <DropdownMenuItem onClick={() => handleAction("ENABLE", record)}>
              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
              Enable Community
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
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={
                dialogAction === "DISABLE" ||
                dialogAction === "REJECT" ||
                dialogAction === "PAUSE"
                  ? "destructive"
                  : "default"
              }
              onClick={confirmAction}
              disabled={isReasonRequired && !actionReason.trim()}
            >
              {dialogAction === "APPROVE" && "Approve Community"}
              {dialogAction === "DISABLE" && "Disable Community"}
              {dialogAction === "ENABLE" && "Enable Community"}
              {dialogAction === "REJECT" && "Reject Community"}
              {dialogAction === "VERIFY" && "Verify Community"}
              {dialogAction === "UNVERIFY" && "Remove Verification"}
              {dialogAction === "REAPPROVE" && "Re-approve Community"}
              {dialogAction === "PAUSE" && "Pause Community"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Actions;
