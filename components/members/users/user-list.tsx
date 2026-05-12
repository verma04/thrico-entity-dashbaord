"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import UserActions from "./user-actions";
import { safeFormat } from "@/lib/date-utils";
import { Mail, MapPin, Smartphone, Users } from "lucide-react";
import { UserDetail, useBulkChangeUserStatus } from "@/graphql/actions";
import { AdminTable, AdminStatusBadge, AdminVerifiedBadge, AdminTableColumn } from "@/components/shared/admin-table/admin-table";

// ─────────────────────────────────────────────────────────────────────────────
// Column definitions
// ─────────────────────────────────────────────────────────────────────────────

const columns: AdminTableColumn<UserDetail>[] = [
  {
    key: "member",
    header: "Member",
    cell: (row) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9 rounded-lg border border-border/60 shrink-0">
          <AvatarImage
            src={`https://cdn.thrico.network/${row.user?.avatar}`}
            alt={row.user?.firstName}
          />
          <AvatarFallback className="rounded-lg bg-muted text-muted-foreground text-xs font-semibold">
            {row.user?.firstName?.[0]}
            {row.user?.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <p className="text-[13px] font-semibold text-foreground leading-tight truncate">
            {row.user?.firstName} {row.user?.lastName}
          </p>
          <p className="text-[11px] text-muted-foreground leading-tight mt-0.5 truncate">
            {row.user?.about?.currentPosition || "Community Member"}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "contact",
    header: "Contact",
    cell: (row) => (
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1.5 text-[12px] text-foreground/80">
          <Mail className="h-3 w-3 text-muted-foreground/50 shrink-0" />
          <span className="truncate max-w-[180px]">{row.user?.email}</span>
        </div>
        {row.user?.profile?.phone?.phoneNumber && (
          <span className="text-[11px] text-muted-foreground pl-4">
            +{row.user?.profile?.phone?.countryCode}-{row.user?.profile?.phone?.phoneNumber}
          </span>
        )}
      </div>
    ),
  },
  {
    key: "location",
    header: "Location",
    cell: (row) => (
      <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
        <MapPin className="h-3 w-3 shrink-0" />
        <span className="truncate max-w-[120px]">{row.user?.location?.name || "—"}</span>
      </div>
    ),
  },
  {
    key: "industries",
    header: "Industries",
    cell: (row) => (
      <div className="flex flex-wrap gap-1 max-w-[200px]">
        {row.industries && row.industries.length > 0 ? (
          row.industries.slice(0, 2).map((ind: any) => (
            <span
              key={ind.id}
              className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-tight bg-indigo-50 text-indigo-700 border border-indigo-100/50"
            >
              {ind.title}
            </span>
          ))
        ) : (
          <span className="text-[11px] text-muted-foreground/50">—</span>
        )}
        {row.industries && row.industries.length > 2 && (
          <span className="text-[9px] font-bold text-muted-foreground bg-muted/50 px-1 rounded">
            +{row.industries.length - 2}
          </span>
        )}
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => <AdminStatusBadge status={row.status} />,
  },
  {
    key: "verification",
    header: "Verification",
    cell: (row) => <AdminVerifiedBadge verified={!!row.verification?.isVerified} />,
  },
  {
    key: "joined",
    header: "Joined",
    cell: (row) => (
      <span className="text-[12px] text-muted-foreground whitespace-nowrap">
        {safeFormat(row.user?.createdAt, "MMM d, yyyy", "—")}
      </span>
    ),
  },
  {
    key: "referrer",
    header: "Referrer",
    cell: (row: any) => (
      <div className="flex items-center gap-1.5 text-[12px] text-foreground/80">
        {row.referrer?.user ? (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6 rounded-full border border-border/60 shrink-0">
              <AvatarImage
                src={`https://cdn.thrico.network/${row.referrer.user.avatar}`}
                alt={row.referrer.user.firstName}
              />
              <AvatarFallback className="rounded-full bg-muted text-muted-foreground text-[10px] font-semibold">
                {row.referrer.user.firstName?.[0]}
                {row.referrer.user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <span className="truncate max-w-[120px]">
              {row.referrer.user.firstName} {row.referrer.user.lastName}
            </span>
          </div>
        ) : (
          <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            Direct Join
          </span>
        )}
      </div>
    ),
  },
  {
    key: "lastSession",
    header: "Last Session",
    cell: (row) => (
      <div className="flex flex-col gap-0.5">
        {row.lastSession ? (
          <>
            <div className="flex items-center gap-1.5 text-[12px] text-foreground/80">
              <Smartphone className="h-3 w-3 text-muted-foreground/50 shrink-0" />
              <span className="truncate max-w-[150px] font-medium">
                {row.lastSession.deviceName || "Unknown Device"}
              </span>
              {row.lastSession.isActive && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" title="Active now" />
              )}
            </div>
            <span className="text-[11px] text-muted-foreground">
              {safeFormat(row.lastSession.lastUsed, "MMM d, h:mm a", "Never")}
            </span>
          </>
        ) : (
          <span className="text-[11px] text-muted-foreground/50">—</span>
        )}
      </div>
    ),
  },
  {
    key: "actions",
    header: "",
    headerClassName: "w-12",
    className: "text-right",
    cell: (row) => <UserActions user={row} />,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function UserList({ users }: { users: UserDetail[] }) {
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});

  const [bulkChangeStatus, { loading: bulkLoading }] = useBulkChangeUserStatus({
    onCompleted: () => setRowSelection({}),
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

  return (
    <div className="space-y-3">
      {/* Bulk Action Bar */}
      {selectedRowsIds.length > 0 && (
        <div className="flex items-center gap-2 p-2.5 bg-primary/5 border border-primary/10 rounded-xl animate-in fade-in slide-in-from-top-2">
          <span className="text-xs font-semibold text-foreground px-2.5 py-1 bg-primary/10 rounded-lg">
            {selectedRowsIds.length} selected
          </span>
          <div className="h-3.5 w-px bg-border mx-1" />
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs font-medium border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            onClick={() => handleBulkAction("APPROVE")}
            disabled={bulkLoading}
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs font-medium border-rose-200 text-rose-700 hover:bg-rose-50"
            onClick={() => handleBulkAction("BLOCK")}
            disabled={bulkLoading}
          >
            Block
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs font-medium border-border text-muted-foreground hover:bg-muted"
            onClick={() => handleBulkAction("REJECT")}
            disabled={bulkLoading}
          >
            Reject
          </Button>
        </div>
      )}

      <AdminTable<UserDetail>
        columns={columns}
        data={users}
        keyExtractor={(u) => u.id}
        emptyIcon={Users}
        emptyTitle="No members found"
        emptyDescription="Try adjusting your search or filter criteria."
        pageSize={100}
      />
    </div>
  );
}
