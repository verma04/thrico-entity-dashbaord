"use client";

import React from "react";
import { useGetAllReferrals } from "@/graphql/actions";
import {
  AdminTable,
  AdminTableColumn,
} from "@/components/shared/admin-table/admin-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { safeLocaleDateString } from "@/lib/date-utils";
import { Badge } from "@/components/ui/badge";

export default function ReferralsPage() {
  const { data, loading } = useGetAllReferrals({ limit: 100, offset: 0 });
  const referrals = data?.getAllReferrals?.data || [];

  const columns: AdminTableColumn<any>[] = [
    {
      key: "referrer",
      header: "Referrer",
      cell: (row) => {
        const user = row.referrer?.user;
        const initials =
          `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase();
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={`https://cdn.thrioc.network/${user?.avatar}`}
                alt={user?.firstName}
              />
              <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="font-medium text-sm text-foreground truncate">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-[11px] text-muted-foreground truncate">
                {user?.email}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "referralsCount",
      header: "Total Referrals",
      cell: (row) => (
        <Badge variant="secondary" className="font-mono text-[10px] h-5">
          {row?.referrer?.referralsCount}
        </Badge>
      ),
    },
    {
      key: "referee",
      header: "Referee (Invited)",
      cell: (row) => {
        const user = row?.referee?.user;
        const initials =
          `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase();
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={`https://cdn.thrioc.network/${user?.avatar}`}
                alt={user?.firstName}
              />
              <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="font-medium text-sm text-foreground truncate">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-[11px] text-muted-foreground truncate">
                Joined {safeLocaleDateString(user?.createdAt)}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => (
        <Badge
          className={
            row?.referee?.isApproved
              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200 text-[10px] py-0 px-2 uppercase tracking-tight"
              : "bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200 text-[10px] py-0 px-2 uppercase tracking-tight"
          }
          variant="outline"
        >
          {row?.referee?.isApproved ? "Approved" : "Pending"}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Referral Network
        </h1>
        <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
          The Referral Network provides a comprehensive view of the invitation
          connections within the ecosystem. Monitor who is actively referring
          new members and track the approval status of invited users.
        </p>
      </div>

      <AdminTable
        columns={columns}
        data={referrals}
        loading={loading}
        keyExtractor={(row, index) =>
          `${row.referrer?.user?.email}-${row?.referee?.user?.email}-${index}`
        }
        pageSize={12}
        emptyTitle="No referrals found"
        emptyDescription="The referral network is currently empty. Connections will appear here as members invite others."
      />
    </div>
  );
}
