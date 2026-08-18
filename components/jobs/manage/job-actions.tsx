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
  ExternalLink,
  Copy,
  CheckCircle2,
  Clock,
  Ban,
  XCircle,
  PauseCircle,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  Settings,
  Users2,
  BarChart3,
  History,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  Job,
  useChangeJobStatus,
  useChangeJobVerification,
} from "@/graphql/actions/jobs";
import { useModuleStore } from "@/store/useModuleStore";

export interface JobActionsProps {
  job: Job;
  trigger?: React.ReactNode;
}

export function JobActions({ job, trigger }: JobActionsProps) {
  const router = useRouter();
  const singularName = useModuleStore((state) => state.jobSingularName);

  const [changeStatus, { loading: statusLoading }] = useChangeJobStatus({
    onCompleted: () => {
      toast.success(`${singularName} status updated successfully`);
    },
    onError: (err: any) => {
      toast.error("Failed to update status", { description: err.message });
    },
  });

  const [changeVerification, { loading: verifyLoading }] =
    useChangeJobVerification({
      onCompleted: () => {
        toast.success("Verification status updated");
      },
      onError: (err: any) => {
        toast.error("Failed to update verification", { description: err.message });
      },
    });

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/jobs/${job.id}/manage`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard", {
      description: `Copied link for "${job.title}"`,
    });
  };

  const handleStatusChange = async (status: string) => {
    try {
      await changeStatus({
        variables: {
          input: {
            jobId: job.id,
            action: status,
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
      const isVerified = !!job.verification?.isVerified;
      await changeVerification({
        variables: {
          input: {
            jobId: job.id,
            action: isVerified ? "UNVERIFY" : "VERIFY",
            reason: "",
          },
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const isLoading = statusLoading || verifyLoading;

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
            onClick={() => router.push(`/jobs/${job.id}/manage`)}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5"
          >
            <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
            Manage & Analytics
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/jobs/${job.id}/applicants`)}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5"
          >
            <Users2 className="h-3.5 w-3.5 text-muted-foreground" />
            View Applicants
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/jobs/${job.id}/settings`)}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5"
          >
            <Settings className="h-3.5 w-3.5 text-muted-foreground" />
            Job Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/jobs/${job.id}/audit-log`)}
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
                onClick={() => handleStatusChange("APPROVE")}
                className="text-xs font-medium cursor-pointer gap-2 text-emerald-600 dark:text-emerald-400"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("PENDING")}
                className="text-xs font-medium cursor-pointer gap-2 text-amber-600 dark:text-amber-400"
              >
                <Clock className="h-3.5 w-3.5" />
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("DISABLE")}
                className="text-xs font-medium cursor-pointer gap-2 text-orange-600 dark:text-orange-400"
              >
                <Ban className="h-3.5 w-3.5" />
                Disable
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("REJECT")}
                className="text-xs font-medium cursor-pointer gap-2 text-rose-600 dark:text-rose-400"
              >
                <XCircle className="h-3.5 w-3.5" />
                Reject
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("PAUSE")}
                className="text-xs font-medium cursor-pointer gap-2 text-slate-600 dark:text-slate-400"
              >
                <PauseCircle className="h-3.5 w-3.5" />
                Pause
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Verification Toggle */}
          <DropdownMenuItem
            onClick={handleVerificationChange}
            className="text-xs font-medium cursor-pointer gap-2 py-1.5"
          >
            {job.verification?.isVerified ? (
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
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default JobActions;
