"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { UserGamificationActivityLogEntry } from "@/graphql/actions/gamification/gamification-quiries";
import { Badge } from "@/components/ui/badge";
import { BadgeIcon } from "@/components/gamification/badges/badge-icon";
import { getPreferredMediaUrl } from "@/utils/media";

interface UserActivityLogTableProps {
  logs: UserGamificationActivityLogEntry[];
  isLoading: boolean;
}

export function UserActivityLogTable({
  logs,
  isLoading,
}: UserActivityLogTableProps) {
  const columns: ColumnDef<UserGamificationActivityLogEntry>[] = [
    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }) => {
        const user = row.original.user;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border border-white shadow-sm shrink-0">
              <AvatarImage
                src={getPreferredMediaUrl(user.avatar) || ""}
                alt={user.firstName}
              />
              <AvatarFallback className="text-[10px] bg-primary/5 text-primary">
                {user.firstName?.substring(0, 2).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground leading-tight">
                {user.firstName} {user.lastName}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <span className="text-xs font-medium text-foreground capitalize">
          {row.original.type.replace(/_/g, " ").toLowerCase()}
        </span>
      ),
    },
    {
      accessorKey: "details",
      header: "Details",
      cell: ({ row }) => {
        const {
          ruleAction,
          ruleDescription,
          badgeName,
          badgeDescription,
          badgeIcon,
        } = row.original;
        if (badgeName) {
          return (
            <div className="flex flex-col max-w-[300px]">
              <div className="flex items-center gap-2">
                {badgeIcon && (
                  <BadgeIcon
                    icon={badgeIcon}
                    className="h-4 w-4 shrink-0 text-xs"
                    imageClassName="h-full w-full object-contain"
                  />
                )}
                <span className="text-xs font-bold text-blue-600">
                  {badgeName}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground line-clamp-1">
                {badgeDescription}
              </span>
            </div>
          );
        }
        if (ruleAction) {
          return (
            <div className="flex flex-col max-w-[300px]">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-tight">
                {ruleAction.replace(/_/g, " ")}
              </span>
              <span className="text-[10px] text-muted-foreground line-clamp-1">
                {ruleDescription}
              </span>
            </div>
          );
        }
        return <span className="text-xs text-muted-foreground">-</span>;
      },
    },
    {
      accessorKey: "points",
      header: "Points",
      cell: ({ row }) => {
        const points = row.original.points;
        const isPositive = points > 0;
        return (
          <span
            className={`font-mono text-sm font-bold ${
              isPositive ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {isPositive ? "+" : ""}
            {points}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {format(new Date(row.original.createdAt), "MMM d, yyyy · hh:mm a")}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={logs}
      isLoading={isLoading}
      skeletonCount={8}
      rowClassName="h-16"
    />
  );
}
