"use client";

import React from "react";
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
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Copy,
  Loader2,
  CheckCircle2,
  Clock,
  Ban,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  History,
  Settings,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import {
  changeDiscussionForumStatus,
  changeDiscussionForumVerification,
} from "@/graphql/actions/discussion-form";
import { discussionForm } from "../ts-types";
import { useModuleStore } from "@/store/useModuleStore";

export interface ForumActionsProps {
  forum: discussionForm;
  refetch?: () => void;
  trigger?: React.ReactNode;
}

export function ForumActions({ forum, refetch, trigger }: ForumActionsProps) {
  const router = useRouter();
  const singularName = useModuleStore((state) => state.forumSingularName);

  const [changeStatus, { loading: isChangingStatus }] =
    changeDiscussionForumStatus({
      onCompleted: () => {
        toast.success(`${singularName} status updated successfully`);
        refetch?.();
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to update status");
      },
    });

  const [changeVerification, { loading: isVerifying }] =
    changeDiscussionForumVerification({
      onCompleted: (data: any) => {
        toast.success(
          data?.changeDiscussionForumVerification?.isVerified
            ? `${singularName} verified successfully`
            : `${singularName} unverified`,
        );
        refetch?.();
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to update verification status");
      },
    });

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/forums/${forum.id}/manage`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard", {
      description: `Copied link for "${forum.title}"`,
    });
  };

  const handleStatusChange = async (status: string) => {
    try {
      await changeStatus({
        variables: {
          input: {
            id: forum.id,
            status,
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
      const isVerified = !!forum.verification?.isVerified;
      await changeVerification({
        variables: {
          input: {
            id: forum.id,
            isVerified: !isVerified,
            verificationReason: "",
          },
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const isLoading = isChangingStatus || isVerifying;

  return (
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
          onClick={() => router.push(`/forums/${forum.id}/manage`)}
          className="text-xs font-medium cursor-pointer gap-2 py-1.5"
        >
          <Settings className="h-3.5 w-3.5 text-muted-foreground" />
          Manage {singularName}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push(`/forums/${forum.id}/comments`)}
          className="text-xs font-medium cursor-pointer gap-2 py-1.5"
        >
          <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
          View Comments
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push(`/forums/${forum.id}/audit-log`)}
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
              onClick={() => handleStatusChange("APPROVED")}
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
              onClick={() => handleStatusChange("DISABLED")}
              className="text-xs font-medium cursor-pointer gap-2 text-orange-600 dark:text-orange-400"
            >
              <Ban className="h-3.5 w-3.5" />
              Disable
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange("REJECTED")}
              className="text-xs font-medium cursor-pointer gap-2 text-rose-600 dark:text-rose-400"
            >
              <XCircle className="h-3.5 w-3.5" />
              Reject
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Verification Toggle */}
        <DropdownMenuItem
          onClick={handleVerificationChange}
          className="text-xs font-medium cursor-pointer gap-2 py-1.5"
        >
          {forum.verification?.isVerified ? (
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
  );
}

export default ForumActions;
