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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Flag, ExternalLink, MoreVertical, Filter, RotateCcw, ShieldAlert, CheckCircle, Clock } from "lucide-react";
import {
  useGetContentReports,
  useResolveReport,
  useDismissReport,
} from "@/graphql/moderation/hooks";
import { useChangeUserStatus } from "@/graphql/actions";
import { ContentReport, ReportStatus, ModerationContentType } from "@/graphql/moderation/types";
import { toast } from "sonner";
import { Lock, Unlock } from "lucide-react";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";

export function ReportedContentManager() {
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "ALL">(
    "PENDING",
  );
  const [typeFilter, setTypeFilter] = useState<ModerationContentType | "ALL">("ALL");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data, loading, error, refetch } = useGetContentReports({
    status: statusFilter === "ALL" ? undefined : statusFilter,
    contentType: typeFilter === "ALL" ? undefined : typeFilter,
    limit: pageSize,
    offset: pageIndex * pageSize,
  });

  const [resolveReport] = useResolveReport();
  const [dismissReport] = useDismissReport();
  const [changeUserStatus] = useChangeUserStatus({});

  const handleResolve = async (id: string, action: string) => {
    try {
      await resolveReport({ variables: { id, action } });
      toast.success(`Report resolved with action: ${action}`);
      refetch();
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
      await resolveReport({ variables: { id: reportId, action } });
      toast.success(
        `User ${action === "BLOCK" ? "blocked" : "unblocked"} and report resolved`,
      );
      refetch();
    } catch (err) {
      toast.error(`Failed to ${action.toLowerCase()} user`);
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      await dismissReport({ variables: { id } });
      toast.success("Report dismissed");
      refetch();
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
        <Badge variant="outline" className="capitalize text-[10px] h-4 font-bold border-muted-foreground/20">
          {row.original.contentType.toLowerCase()}
        </Badge>
      ),
    },
    {
      accessorKey: "contentId",
      header: "Content Preview",
      cell: ({ row }) => (
        <div className="max-w-[240px] truncate text-sm font-semibold text-foreground">
          {row.original.contentPreview || row.original.contentId}
        </div>
      ),
    },
    {
      accessorKey: "reason",
      header: "Reason",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-rose-600 bg-rose-50 border-rose-100 text-[9px] font-bold uppercase h-4 px-1.5">
           {row.original.reason}
        </Badge>
      ),
    },
    {
      accessorKey: "reportedBy",
      header: "Reporter",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6 border border-border">
            <AvatarFallback className="text-[10px] font-bold text-muted-foreground bg-muted">
              {row.original.reportedBy.firstName[0]}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-foreground">
            {row.original.reportedBy.firstName} {row.original.reportedBy.lastName}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs font-medium">
          {new Date(parseInt(row.original.createdAt)).toLocaleDateString()}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
         const isPending = row.original.status === "PENDING";
         const isResolved = row.original.status === "RESOLVED";
         return (
            <div className="flex items-center gap-1.5">
               <div className={cn("h-1.5 w-1.5 rounded-full", 
                  isPending ? "bg-amber-500 animate-pulse" : 
                  isResolved ? "bg-emerald-500" : "bg-muted-foreground"
               )} />
               <span className={cn("text-[10px] font-bold uppercase tracking-wider",
                  isPending ? "text-amber-700" : 
                  isResolved ? "text-emerald-700" : "text-muted-foreground"
               )}>
                  {row.original.status}
               </span>
            </div>
         );
      }
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          {row.original.status === "PENDING" ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 px-2 text-[11px] font-bold gap-1">
                    Take Action
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => handleResolve(row.original.id, "DELETE")}>
                    Delete Content
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleResolve(row.original.id, "WARN")}>
                    Warn User
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleResolve(row.original.id, "HIDE")}>
                    Hide Activity
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => handleUserStatusChange(row.original.reportedUser.id, "BLOCK", row.original.id)}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Block User
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="sm" className="h-7 text-[11px] font-semibold" onClick={() => handleDismiss(row.original.id)}>
                Dismiss
              </Button>
            </>
          ) : (
             <Button variant="ghost" size="sm" className="h-7 text-[11px] font-semibold text-muted-foreground cursor-default">
                Processed
             </Button>
          )}
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
       <EcosystemHeader
        title="Report Queue"
        description="Manual review center for posts, comments, and users flagged for policy violations."
        badgeText="Moderation"
        icon={Flag}
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
            <div className="flex items-center gap-2">
               <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Filters</span>
               <Select
                value={statusFilter}
                onValueChange={(v) => {
                  setStatusFilter(v as any);
                  setPageIndex(0);
                }}
              >
                <SelectTrigger className="h-8 w-[130px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="DISMISSED">Dismissed</SelectItem>
                </SelectContent>
              </Select>
               <Select
                value={typeFilter}
                onValueChange={(v) => {
                  setTypeFilter(v);
                  setPageIndex(0);
                }}
              >
                <SelectTrigger className="h-8 w-[130px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  {[
                    "POST", "COMMENT", "MARKETPLACE", "COMMUNITY", "EVENT", 
                    "SHOP", "OFFER", "JOB", "DISCUSSION_FORUM", "DISCUSSION_FORUM_COMMENT", "MESSAGE"
                  ].map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <EcosystemActionBar.Separator />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
               <Clock className="h-3.5 w-3.5 text-amber-500" />
               {totalCount} total reports
            </div>
        </EcosystemActionBar.Group>
        <EcosystemActionBar.Group align="right">
          <Button variant="outline" size="sm" onClick={() => refetch()} className="h-8 gap-1.5">
             <RotateCcw className="h-3.5 w-3.5" />
             Refresh
          </Button>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6">
         <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-muted/20 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                   <ShieldAlert className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                   <p className="text-sm font-semibold text-foreground">Pending Investigations</p>
                   <p className="text-xs text-muted-foreground">Action content flagged by community members or AI</p>
                </div>
             </div>
          </div>
          <div className="p-1">
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
          </div>
        </div>
      </EcosystemContainer>
    </div>
  );
}
