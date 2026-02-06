"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Flag, ExternalLink } from "lucide-react";
import {
  useGetContentReports,
  useResolveReport,
  useDismissReport,
} from "@/graphql/moderation/hooks";
import { useChangeUserStatus } from "@/graphql/actions";
import { ContentReport, ReportStatus } from "@/graphql/moderation/types";
import { toast } from "sonner";
import { Lock, Unlock } from "lucide-react";

export function ReportedContentManager() {
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "ALL">(
    "PENDING",
  );
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data, loading, error } = useGetContentReports({
    status: statusFilter === "ALL" ? undefined : statusFilter,
    contentType: typeFilter === "ALL" ? undefined : typeFilter,
    limit: pageSize,
    offset: pageIndex * pageSize,
  });

  const [resolveReport] = useResolveReport();
  const [dismissReport] = useDismissReport();
  const [changeUserStatus] = useChangeUserStatus({
    onCompleted: () => {
      // Re-fetching happens automatically via refetchQueries in the hook
    },
  });

  const handleResolve = async (id: string, action: string) => {
    try {
      await resolveReport({ variables: { id, action } });
      toast.success(`Report resolved with action: ${action}`);
    } catch (err) {
      toast.error("Failed to resolve report");
    }
  };

  const handleUserStatusChange = async (
    userId: string,
    action: string,
    reportId: string,
  ) => {
    try {
      await changeUserStatus({
        variables: {
          input: {
            userId,
            action,
            reason: `Action taken via moderation report #${reportId}`,
          },
        },
      });
      // Also resolve the report if we block the user?
      await resolveReport({ variables: { id: reportId, action } });
      toast.success(
        `User ${action === "BLOCK" ? "blocked" : "unblocked"} and report resolved`,
      );
    } catch (err) {
      toast.error(`Failed to ${action.toLowerCase()} user`);
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      await dismissReport({ variables: { id } });
      toast.success("Report dismissed");
    } catch (err) {
      toast.error("Failed to dismiss report");
    }
  };

  const reports = data?.getContentReports.items || [];
  const totalCount = data?.getContentReports.totalCount || 0;
  const pageCount = Math.ceil(totalCount / pageSize);

  const columns: ColumnDef<ContentReport>[] = [
    {
      accessorKey: "contentType",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize text-[10px]">
          {row.original.contentType.toLowerCase()}
        </Badge>
      ),
    },
    {
      accessorKey: "contentId",
      header: "Content",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate font-medium">
          {row.original.contentPreview || row.original.contentId}
        </div>
      ),
    },
    {
      accessorKey: "reason",
      header: "Reason",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.reason}</span>
      ),
    },
    {
      accessorKey: "reportedBy",
      header: "Reported By",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-[10px]">
              {row.original.reportedBy.firstName[0]}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm">
            {row.original.reportedBy.firstName}{" "}
            {row.original.reportedBy.lastName}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {new Date(parseInt(row.original.createdAt)).toLocaleDateString()}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.status === "PENDING"
              ? "destructive"
              : row.original.status === "RESOLVED"
                ? "default"
                : "secondary"
          }
          className="text-[10px] uppercase font-bold"
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          {row.original.status === "PENDING" && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Resolve
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleResolve(row.original.id, "DELETE")}
                  >
                    Delete Content
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleResolve(row.original.id, "WARN")}
                  >
                    Warn User
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleResolve(row.original.id, "HIDE")}
                  >
                    Hide Activity
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() =>
                      handleUserStatusChange(
                        row.original.reportedUser.id,
                        "BLOCK",
                        row.original.id,
                      )
                    }
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Block User
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      handleUserStatusChange(
                        row.original.reportedUser.id,
                        "UNBLOCK",
                        row.original.id,
                      )
                    }
                  >
                    <Unlock className="h-4 w-4 mr-2" />
                    Unblock User
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDismiss(row.original.id)}
              >
                Dismiss
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (error) return <div>Error loading reported content.</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5 text-red-500" />
                Reported Content
              </CardTitle>
              <CardDescription>
                Review and take action on content reported by users
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground ml-1">
                Status
              </span>
              <Select
                value={statusFilter}
                onValueChange={(v) => {
                  setStatusFilter(v as any);
                  setPageIndex(0);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="DISMISSED">Dismissed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground ml-1">
                Content Type
              </span>
              <Select
                value={typeFilter}
                onValueChange={(v) => {
                  setTypeFilter(v);
                  setPageIndex(0);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value="POST">Posts</SelectItem>
                  <SelectItem value="COMMENT">Comments</SelectItem>
                  <SelectItem value="USER">User Profiles</SelectItem>
                  <SelectItem value="IMAGE">Images</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={reports}
            isLoading={loading}
            manualPagination
            totalRows={totalCount}
            pageCount={pageCount}
            pageIndex={pageIndex}
            onPageChange={setPageIndex}
            pageSize={pageSize}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPageIndex(0);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
