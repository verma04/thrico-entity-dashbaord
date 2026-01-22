"use client";

import React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import UserActions from "./user-actions";
import { DataTable } from "@/components/ui/data-table";
import { format } from "date-fns";
import { Mail, MapPin } from "lucide-react";
import { UserDetail } from "@/graphql/actions";

const getStatusColor = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "bg-green-500/10 text-green-600 border-none shadow-none font-semibold";
    case "PENDING":
      return "bg-yellow-500/10 text-yellow-600 border-none shadow-none font-semibold";
    case "BLOCKED":
      return "bg-red-500/10 text-red-600 border-none shadow-none font-semibold";
    case "REJECTED":
      return "bg-purple-500/10 text-purple-600 border-none shadow-none font-semibold";
    case "DISABLED":
      return "bg-orange-500/10 text-orange-600 border-none shadow-none font-semibold";
    default:
      return "bg-gray-500/10 text-gray-600 border-none shadow-none font-semibold";
  }
};

export function UserList({ users }: { users: UserDetail[] }) {
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
          <div className="flex flex-col">
            <p className="font-semibold text-sm leading-tight">
              {row.original.user?.firstName} {row.original.user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground leading-tight mt-0.5">
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
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Mail className="h-3 w-3" />
            <span>{row.original.user?.email}</span>
          </div>
          <div className="text-[10px] text-muted-foreground/70 pl-4.5">
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
        <Badge className={getStatusColor(row.original.status)}>
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
          className="text-[10px] h-5"
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
      <DataTable
        columns={columns}
        data={users || []}
        rowClassName="hover:bg-muted/30 transition-colors"
      />
    </div>
  );
}
