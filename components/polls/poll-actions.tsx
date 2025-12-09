"use client";

import React, { useState } from "react";
import {
  CheckCircle,
  Trash2,
  MoreHorizontal,
  List,
  UserX,
  BarChart3,
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

import { getModalDescription, getModalTitle } from "./utils";
import { poll } from "./ts-types";
import Edit from "./edit-poll";
import { Pencil } from "lucide-react";
import { changePollStatus, deletePoll } from "../../graphql/actions/polls";
import PollResultsPage from "./result/poll-result";

const Actions = (record: poll) => {
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isResult, setIsResult] = useState(false);
  const [isEdit, setEditOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState<poll | null>(null);
  const [dialogAction, setDialogAction] = useState<
    "DISABLE" | "ENABLE" | "DELETE"
  >();
  const [actionReason, setActionReason] = useState("");

  const handleAction = (
    action: "DISABLE" | "ENABLE" | "DELETE",
    user: poll | null
  ) => {
    setSelectedPoll(user);
    setDialogAction(action);
    setIsModalOpen(true);
  };

  const handleViewDetails = (user: poll) => {
    setSelectedPoll(user);
    setIsDrawerOpen(true);
  };

  const handleEdit = (user: poll) => {
    setSelectedPoll(user);
    setEditOpen(true);
  };

  const handleViewResult = (user: poll) => {
    setSelectedPoll(user);
    setIsResult(true);
  };

  const onCompleted = () => {
    setIsModalOpen(false);
    setActionReason("");
    setSelectedPoll(null);
    setIsDrawerOpen(false);
  };

  const [action, { loading }] = deletePoll({
    onCompleted,
  });

  const [changeStatus, { loading: verifyBtn }] = changePollStatus({
    onCompleted,
  });

  const confirmAction = () => {
    if (dialogAction === "ENABLE" || dialogAction === "DISABLE") {
      return changeStatus({
        variables: {
          input: {
            reason: actionReason,
            pollId: selectedPoll?.id,
            action: dialogAction,
          },
        },
      });
    } else {
      action({
        variables: {
          input: {
            pollId: selectedPoll?.id,
            reason: actionReason,
          },
        },
      });
    }
  };

  const isReasonRequired =
    dialogAction === "ENABLE" ||
    dialogAction === "DISABLE" ||
    dialogAction === "DELETE";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleViewResult(record)}>
            <BarChart3 className="mr-2 h-4 w-4" />
            View Result
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleEdit(record)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setIsAuditModalOpen(true)}>
            <List className="mr-2 h-4 w-4" />
            Audit Log
          </DropdownMenuItem>

          {record?.status === "DISABLED" && (
            <DropdownMenuItem onClick={() => handleAction("ENABLE", record)}>
              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
              Enable Poll
            </DropdownMenuItem>
          )}

          {record?.status === "APPROVED" && (
            <DropdownMenuItem onClick={() => handleAction("DISABLE", record)}>
              <UserX className="mr-2 h-4 w-4 text-yellow-600" />
              Disable Poll
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => handleAction("DELETE", record)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Poll
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
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={
                dialogAction === "DISABLE" || dialogAction === "DELETE"
                  ? "destructive"
                  : "default"
              }
              onClick={confirmAction}
              disabled={isReasonRequired && !actionReason.trim()}
            >
              {loading || verifyBtn ? (
                "Processing..."
              ) : (
                <>
                  {dialogAction === "DELETE" && "Delete Poll"}
                  {dialogAction === "DISABLE" && "Disable Poll"}
                  {dialogAction === "ENABLE" && "Enable Poll"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedPoll && (
        <Edit
          poll={selectedPoll}
          open={isEdit}
          onClose={() => setEditOpen(false)}
        />
      )}

      {selectedPoll && isResult && (
        <PollResultsPage
          selectedPoll={selectedPoll}
          open={isResult}
          onClose={() => setIsResult(false)}
        />
      )}
    </>
  );
};

export default Actions;
