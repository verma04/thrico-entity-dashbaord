"use client";

import React, { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Star, GraduationCap, Check, X, Clock, FileText } from "lucide-react";
import { MentorActions } from "./mentor-actions";
import {
  AdminTable,
  AdminStatusBadge,
  AdminTableColumn,
} from "@/components/shared/admin-table/admin-table";
import { Button } from "@/components/ui/button";
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
import { useUpdateMentorshipStatus } from "@/graphql/mentorship/mentorship-quiries";
import { toast } from "sonner";
import { safeFormat, safeFormatDistanceToNow } from "@/lib/date-utils";
import { useModuleStore } from "@/store/useModuleStore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RequestsTableProps {
  requests: any[];
  isLoading: boolean;
  onEdit: (request: any) => void;
  onRefetch: () => void;
}

export function RequestsTable({
  requests,
  isLoading,
  onEdit,
  onRefetch,
}: RequestsTableProps) {
  const moduleName = useModuleStore((state) => state.mentorshipModuleName);
  const singularName = useModuleStore((state) => state.mentorshipSingularName);

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "APPROVE" | "REJECT";
    request: any | null;
    reason: string;
  }>({
    isOpen: false,
    type: "APPROVE",
    request: null,
    reason: "",
  });

  const [updateStatus, { loading: statusLoading }] = useUpdateMentorshipStatus({
    onCompleted: () => {
      const actionText = confirmDialog.type === "APPROVE" ? "approved" : "rejected";
      toast.success(`${singularName} request ${actionText} successfully`);
      setConfirmDialog({ isOpen: false, type: "APPROVE", request: null, reason: "" });
      onRefetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update request status");
    },
  });

  const handleQuickAction = (type: "APPROVE" | "REJECT", request: any) => {
    setConfirmDialog({
      isOpen: true,
      type,
      request,
      reason: "",
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.request) return;

    await updateStatus({
      variables: {
        input: {
          mentorshipId: confirmDialog.request.id,
          status: confirmDialog.type === "APPROVE" ? "APPROVED" : "REJECTED",
          reason: confirmDialog.reason.trim() || undefined,
        },
      },
    });
  };

  const columns = useMemo<AdminTableColumn<any>[]>(
    () => [
      {
        key: "name",
        header: `Applicant (${singularName})`,
        cell: (row) => {
          return (
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10 border border-border shadow-sm group-hover:scale-105 transition-transform shrink-0">
                <AvatarImage
                  src={
                    row.avatar
                      ? `https://cdn.thrico.network/${row.avatar}`
                      : undefined
                  }
                  alt={row.name}
                />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {row.name ? row.name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground leading-tight truncate max-w-[170px]">
                    {row.name}
                  </span>
                  {row.isTopMentor && (
                    <div className="flex gap-1 shrink-0">
                      <Star className="h-3 w-3 text-amber-400 fill-amber-400 animate-pulse" />
                    </div>
                  )}
                </div>
                <span className="text-[11px] text-muted-foreground truncate max-w-[170px]">
                  {row.email || row.title}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        key: "categoryName",
        header: "Category",
        cell: (row) => (
          <Badge
            variant="outline"
            className="font-bold bg-muted border-transparent text-foreground text-[10px] uppercase tracking-tighter"
          >
            {row.categoryName || "Uncategorized"}
          </Badge>
        ),
      },
      {
        key: "about",
        header: "About / Intro",
        cell: (row) => {
          const text = row.intro || row.about || row.whyDoWantBecomeMentor || "—";
          return (
            <div className="max-w-[220px] truncate text-xs text-muted-foreground" title={text}>
              {text}
            </div>
          );
        },
      },
      {
        key: "expertise",
        header: "Expertise",
        cell: (row) => {
          const expertise = row.expertise || row.skills || [];
          if (!expertise.length) return <span className="text-muted-foreground text-xs">—</span>;
          return (
            <div className="flex flex-wrap gap-1.5 max-w-[180px]">
              {expertise.slice(0, 2).map((item: string, idx: number) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="text-[10px] font-bold px-2 py-0 h-4 rounded-md"
                >
                  {item}
                </Badge>
              ))}
              {expertise.length > 2 && (
                <Badge
                  variant="ghost"
                  className="text-[10px] font-bold text-muted-foreground px-1"
                >
                  +{expertise.length - 2}
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        key: "submittedAt",
        header: "Submitted",
        cell: (row) => {
          const date = row.createdAt;
          if (!date) return <span className="text-muted-foreground text-xs">—</span>;
          return (
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-foreground">
                {safeFormat(date, "MMM d, yyyy", "—")}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap">
                {safeFormatDistanceToNow(date, { addSuffix: true })}
              </span>
            </div>
          );
        },
      },
      {
        key: "status",
        header: "Status",
        cell: (row) => <AdminStatusBadge status={row.status} />,
      },
      {
        key: "actions",
        header: "",
        headerClassName: "w-32 text-right",
        className: "text-right",
        cell: (row) => {
          const isPending = row.status === "pending" || (!row.isApproved && row.isRequested);

          return (
            <div className="flex items-center justify-end gap-1.5">
              {isPending && (
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleQuickAction("APPROVE", row)}
                        className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200 shadow-2xs"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-xs">Approve Application</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleQuickAction("REJECT", row)}
                        className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 shadow-2xs"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-xs">Reject Application</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              <MentorActions
                mentor={row}
                onView={() => onEdit(row)}
                refetch={onRefetch}
              />
            </div>
          );
        },
      },
    ],
    [singularName, onEdit, onRefetch],
  );

  return (
    <>
      <AdminTable<any>
        columns={columns}
        data={requests}
        loading={isLoading}
        keyExtractor={(r) => r.id}
        emptyIcon={Clock}
        emptyTitle={`No ${singularName.toLowerCase()} requests found`}
        emptyDescription="There are currently no applications matching your filter criteria."
      />

      <Dialog
        open={confirmDialog.isOpen}
        onOpenChange={(open) =>
          setConfirmDialog((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.type === "APPROVE"
                ? `Approve ${singularName} Application`
                : `Reject ${singularName} Application`}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.type === "APPROVE"
                ? `Are you sure you want to approve ${confirmDialog.request?.name || "this applicant"}? They will be granted ${singularName.toLowerCase()} status and added to the expert network.`
                : `Are you sure you want to reject ${confirmDialog.request?.name || "this applicant"}? Please provide feedback or a reason below.`}
            </DialogDescription>
          </DialogHeader>

          {confirmDialog.type === "REJECT" && (
            <div className="space-y-2 py-2">
              <Label htmlFor="reject-reason" className="text-sm font-semibold">
                Reason for Rejection <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="reject-reason"
                rows={3}
                placeholder="Specify the reason for rejecting this application..."
                value={confirmDialog.reason}
                onChange={(e) =>
                  setConfirmDialog((prev) => ({
                    ...prev,
                    reason: e.target.value,
                  }))
                }
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
              }
              disabled={statusLoading}
            >
              Cancel
            </Button>
            <Button
              variant={confirmDialog.type === "APPROVE" ? "default" : "destructive"}
              onClick={handleConfirmAction}
              disabled={
                statusLoading ||
                (confirmDialog.type === "REJECT" && !confirmDialog.reason.trim())
              }
              className={confirmDialog.type === "APPROVE" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}
            >
              {statusLoading
                ? "Processing..."
                : confirmDialog.type === "APPROVE"
                ? "Approve Application"
                : "Reject Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
