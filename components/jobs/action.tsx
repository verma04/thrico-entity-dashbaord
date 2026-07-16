"use client";

import {
  CheckCircle,
  ThumbsDown,
  Eye,
  MoreHorizontal,
  List,
  Settings,
  XCircle,
  Undo,
  BarChart3,
  Users2,
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
  Job,
  useChangeJobStatus,
  useChangeJobVerification,
} from "../../graphql/actions/jobs";
import { getModalDescription, getModalTitle } from "./utils";
import Details from "./details";
import ApplicantsDrawer from "./applicants-drawer";
import { useModuleStore } from "@/store/useModuleStore";

const Actions = (record: Job) => {
  const singularName = useModuleStore((state) => state.jobSingularName);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isAnalytics, setIsAnalytics] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isApplicantsDrawerOpen, setIsApplicantsDrawerOpen] = useState(false);
  const [activeJob, setActiveJob] = useState<Job | null>(null);
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
  const [actionReason, setActionReason] = useState("");

  const router = useRouter();

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
    listing: Job | null,
  ) => {
    setActiveJob(listing);
    setDialogAction(action);
    setIsModalOpen(true);
  };

  const handleViewDetails = (user: Job) => {
    setActiveJob(user);
    setIsDrawerOpen(true);
    setIsModalOpen(false);
  };

  const handleViewApplicants = (job: Job) => {
    router.push(`/jobs/${job.id}/applicants`);
  };

  const handleViewSettings = (job: Job) => {
    router.push(`/jobs/${job.id}/settings`);
  };

  const handleAnalytics = (job: Job) => {
    router.push(`/jobs/${job.id}/manage`);
  };

  const handleAuditLog = (job: Job) => {
    router.push(`/jobs/${job.id}/audit-log`);
  };

  const onCompleted = () => {
    setIsModalOpen(false);
    setActionReason("");
    setActiveJob(null);
    setIsDrawerOpen(false);
    setIsApplicantsDrawerOpen(false);
  };

  const [action, { loading }] = useChangeJobStatus({
    onCompleted,
  });

  const [changeVerification, { loading: verifyBtn }] = useChangeJobVerification(
    {
      onCompleted,
    },
  );

  const confirmAction = () => {
    if (dialogAction === "VERIFY" || dialogAction === "UNVERIFY") {
      return changeVerification({
        variables: {
          input: {
            reason: actionReason,
            jobId: activeJob?.id,
            action: dialogAction,
          },
        },
      });
    } else {
      action({
        variables: {
          input: {
            jobId: activeJob?.id,
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
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleViewSettings(record)}>
            <Settings className="mr-2 h-4 w-4" />
            Manage
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleViewApplicants(record)}>
            <Users2 className="mr-2 h-4 w-4" />
            View Applicants
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAnalytics(record)}>
            <BarChart3 className="mr-2 h-4 w-4" />
            View Analytics
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAuditLog(record)}>
            <List className="mr-2 h-4 w-4" />
            Audit Log
          </DropdownMenuItem>

          {record?.status === "PENDING" && (
            <>
              <DropdownMenuItem onClick={() => handleAction("APPROVE", record)}>
                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                Approve {singularName}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("REJECT", record)}>
                <ThumbsDown className="mr-2 h-4 w-4 text-purple-600" />
                Reject {singularName}
              </DropdownMenuItem>
            </>
          )}

          {record?.status === "REJECTED" && (
            <DropdownMenuItem onClick={() => handleAction("REAPPROVE", record)}>
              <Undo className="mr-2 h-4 w-4" />
              Re-approve {singularName}
            </DropdownMenuItem>
          )}

          {record?.status === "APPROVED" && (
            <>
              <DropdownMenuItem onClick={() => handleAction("DISABLE", record)}>
                <XCircle className="mr-2 h-4 w-4 text-amber-600" />
                Disable {singularName}
              </DropdownMenuItem>
            </>
          )}

          {record?.status === "DISABLED" && (
            <DropdownMenuItem onClick={() => handleAction("ENABLE", record)}>
              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
              Enable {singularName}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getModalTitle(singularName, dialogAction)}</DialogTitle>
            <DialogDescription>
              {getModalDescription(singularName, dialogAction)}
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
                dialogAction === "DISABLE" || dialogAction === "REJECT"
                  ? "destructive"
                  : "default"
              }
              onClick={confirmAction}
              disabled={
                (isReasonRequired && !actionReason.trim()) ||
                loading ||
                verifyBtn
              }
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

      {activeJob && (
        <Details
          job={activeJob}
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          handleAction={handleAction}
        />
      )}

      {activeJob && (
        <ApplicantsDrawer
          job={activeJob}
          isOpen={isApplicantsDrawerOpen}
          setIsOpen={setIsApplicantsDrawerOpen}
        />
      )}
    </>
  );
};

export default Actions;
