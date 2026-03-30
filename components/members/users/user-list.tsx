"use client";

import React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import UserActions from "./user-actions";
import { AppDataTable } from "@/components/ui/app-data-table";
import { format } from "date-fns";
import { Mail, MapPin } from "lucide-react";
import { UserDetail, useBulkChangeUserStatus } from "@/graphql/actions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const getStatusColor = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "text-emerald-700 bg-emerald-50 border-emerald-100 shadow-sm shadow-emerald-50/50";
    case "PENDING":
      return "text-amber-700 bg-amber-50 border-amber-100 shadow-sm shadow-amber-50/50";
    case "BLOCKED":
      return "text-rose-700 bg-rose-50 border-rose-100 shadow-sm shadow-rose-50/50";
    case "REJECTED":
      return "text-slate-700 bg-slate-50 border-slate-100 shadow-sm shadow-slate-50/50";
    case "DISABLED":
      return "text-orange-700 bg-orange-50 border-orange-100 shadow-sm shadow-orange-50/50";
    default:
      return "text-slate-500 bg-slate-50 border-slate-100";
  }
};

export function UserList({ users }: { users: UserDetail[] }) {
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});

  const [bulkChangeStatus, { loading: bulkLoading }] = useBulkChangeUserStatus({
    onCompleted: () => {
      setRowSelection({});
    },
  });

  const selectedRowsIds = Object.keys(rowSelection)
    .filter((key) => rowSelection[key])
    .map((key) => users[Number(key)]?.id)
    .filter(Boolean);

  const handleBulkAction = async (statusAction: string) => {
    if (!selectedRowsIds.length) return;
    try {
      await bulkChangeStatus({
        variables: {
          input: {
            action: statusAction,
            reason: "Bulk action from dashboard",
            userIds: selectedRowsIds,
          },
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const columns: ColumnDef<UserDetail>[] = [
    {
      accessorKey: "user.firstName",
      header: "Member",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-border/50">
            <AvatarImage
              src={`https://cdn.thrico.network/${row.original.user?.avatar}`}
              alt={row.original.user?.firstName}
            />
            <AvatarFallback className="bg-primary/5 text-primary text-xs">
              {row.original.user?.firstName?.[0]}
              {row.original.user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5">
            <p className="font-black text-slate-800 leading-tight tracking-tight text-sm">
              {row.original.user?.firstName} {row.original.user?.lastName}
            </p>
            <p className="text-[10px] font-bold text-slate-400 leading-tight mt-0.5 uppercase tracking-wider">
              {row.original.user?.about?.currentPosition || "Community Member"}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "user.email",
      header: "Contact Info",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <Mail className="h-3 w-3 text-blue-500" />
            <span>{row.original.user?.email}</span>
          </div>
          <div className="text-[10px] text-slate-400 font-bold pl-4.5 italic">
            +{row.original.user?.profile?.phone?.countryCode}-
            {row.original.user?.profile?.phone?.phoneNumber}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "user.location.name",
      header: "Location",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>{row.original.user?.location?.name || "Remote"}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          className={cn(
            "text-[9px] uppercase font-black px-2 py-0.5 h-5 rounded-md border-2",
            getStatusColor(row.original.status),
          )}
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "verification.isVerified",
      header: "Verification",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.verification?.isVerified ? "default" : "secondary"
          }
          className={cn(
            "text-[9px] h-5 px-2 font-black uppercase tracking-tight",
            row.original.verification?.isVerified
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-100"
              : "bg-slate-100 text-slate-400 border-none",
          )}
        >
          {row.original.verification?.isVerified ? "Verified" : "Unverified"}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Joined Date",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {row.original.user?.createdAt
            ? format(
                new Date(Number(row.original.user.createdAt)),
                "MMM d, yyyy",
              )
            : "-"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <UserActions user={row.original} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Bulk action bar */}
      {selectedRowsIds.length > 0 && (
        <div className="flex items-center gap-2 bg-indigo-50/50 p-2.5 border border-indigo-100 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2">
          <span className="text-xs font-bold text-indigo-700 px-3 py-1 bg-indigo-100 rounded-lg">
            {selectedRowsIds.length} selected
          </span>
          <div className="h-4 w-px bg-indigo-200 mx-1" />
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs font-bold border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            onClick={() => handleBulkAction("APPROVE")}
            disabled={bulkLoading}
          >
            Approve Selected
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs font-bold border-rose-200 text-rose-700 hover:bg-rose-50"
            onClick={() => handleBulkAction("BLOCK")}
            disabled={bulkLoading}
          >
            Block Selected
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-50"
            onClick={() => handleBulkAction("REJECT")}
            disabled={bulkLoading}
          >
            Reject Selected
          </Button>
        </div>
      )}

      {/* react-table-craft DataTable */}
      <AppDataTable<UserDetail, unknown>
        columns={columns}
        data={users || []}
        searchableColumns={[
          { id: "user.email" as any, title: "Email" },
          { id: "user.firstName" as any, title: "Name" },
        ]}
        filterableColumns={[
          {
            id: "status" as any,
            title: "Status",
            options: [
              { label: "Approved", value: "APPROVED" },
              { label: "Pending", value: "PENDING" },
              { label: "Blocked", value: "BLOCKED" },
              { label: "Rejected", value: "REJECTED" },
              { label: "Disabled", value: "DISABLED" },
            ],
          },
        ]}
        showFilter
        showPagination
        floatingBar={false}
        isShowExportButtons={{ isShow: true, fileName: "members" }}
        config={{
          features: {
            rowSelection: true,
            columnVisibility: true,
            search: true,
            filter: true,
            pagination: true,
            csvExport: true,
            viewToggle: false,
            floatingBar: false,
            advancedFilter: false,
            sorting: true,
          },
        }}
      />
    </div>
  );
}
