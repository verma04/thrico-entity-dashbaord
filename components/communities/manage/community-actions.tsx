"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  ThumbsDown,
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

import type { communityEntity } from "../ts-types";
import { getModalDescription, getModalTitle } from "../utils";
import {
  changeDiscussionCommunityStatus,
  changeDiscussionCommunityVerification,
} from "@/graphql/actions/group";
import { useModuleStore } from "@/store/useModuleStore";

export interface CommunityActionsProps {
  record: communityEntity;
}

export function CommunityActions(record: communityEntity) {
  const singularName = useModuleStore((state) => state.communitySingularName);

  const [isModalOpen, setIsModalOpen] = useState(false);
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
    item: communityEntity | null,
  ) => {
    setSelectedCommunity(item);
    setDialogAction(action);
    setIsModalOpen(true);
  };

  const [actionReason, setActionReason] = useState("");

  const onCompleted = () => {
    setIsModalOpen(false);
    setActionReason("");
    setSelectedCommunity(null);
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
          <DropdownMenuItem asChild>
            <Link
              href={`/communities/${record.id}/about`}
              className="w-full cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Link
              href={`/communities/${record.id}/audit-log`}
              className="w-full cursor-pointer"
            >
              <ListOrdered className="mr-2 h-4 w-4" />
              Audit Log
            </Link>
          </DropdownMenuItem>

          {record?.status === "PENDING" && (
            <>
              <DropdownMenuItem
                onClick={() => handleAction("APPROVE", record)}
                className="cursor-pointer"
              >
                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                Approve {singularName}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAction("REJECT", record)}
                className="cursor-pointer"
              >
                <ThumbsDown className="mr-2 h-4 w-4 text-purple-600" />
                Reject {singularName}
              </DropdownMenuItem>
            </>
          )}

          {record?.status === "REJECTED" && (
            <DropdownMenuItem
              onClick={() => handleAction("REAPPROVE", record)}
              className="cursor-pointer"
            >
              <Undo className="mr-2 h-4 w-4" />
              Re-approve {singularName}
            </DropdownMenuItem>
          )}

          {record?.status === "APPROVED" && (
            <>
              <DropdownMenuItem
                onClick={() => handleAction("DISABLE", record)}
                className="cursor-pointer"
              >
                <UserX className="mr-2 h-4 w-4 text-yellow-600" />
                Disable {singularName}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAction("PAUSE", record)}
                className="cursor-pointer"
              >
                <StopCircle className="mr-2 h-4 w-4 text-yellow-600" />
                Pause {singularName}
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/communities/${record.id}/setting`}
                  className="w-full cursor-pointer"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Manage Settings
                </Link>
              </DropdownMenuItem>
            </>
          )}

          {record?.status === "DISABLED" && (
            <DropdownMenuItem
              onClick={() => handleAction("ENABLE", record)}
              className="cursor-pointer"
            >
              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
              Enable {singularName}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getModalTitle(dialogAction, singularName)}</DialogTitle>
            <DialogDescription>
              {getModalDescription(dialogAction, singularName)}
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
              {dialogAction === "APPROVE" && `Approve ${singularName}`}
              {dialogAction === "DISABLE" && `Disable ${singularName}`}
              {dialogAction === "ENABLE" && `Enable ${singularName}`}
              {dialogAction === "REJECT" && `Reject ${singularName}`}
              {dialogAction === "VERIFY" && `Verify ${singularName}`}
              {dialogAction === "UNVERIFY" && "Remove Verification"}
              {dialogAction === "REAPPROVE" && `Re-approve ${singularName}`}
              {dialogAction === "PAUSE" && `Pause ${singularName}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CommunityActions;
