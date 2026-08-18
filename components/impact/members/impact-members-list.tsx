"use client";

import React from "react";
import Link from "next/link";
import {
  Trophy,
  Activity,
  MessageSquare,
  Handshake,
  Network,
  CalendarCheck,
  MoreHorizontal,
  ExternalLink,
  Copy,
} from "lucide-react";
import { ImpactUserNode } from "./impact-members-table";
import {
  UserProfileHoverCard,
  UserProfileHoverData,
} from "@/components/shared/user-profile-hover-card";
import {
  AdminTable,
  AdminTableColumn,
  AdminTableItem,
  AdminTableTag,
  AdminTableMetric,
  AdminTableDate,
} from "@/components/shared/admin-table/admin-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// ─────────────────────────────────────────────────────────────────────────────
// Column definitions
// ─────────────────────────────────────────────────────────────────────────────

export const getImpactMemberTableColumns = (
  offset: number = 0,
): AdminTableColumn<ImpactUserNode>[] => {
  const getTierVariant = (
    tier: string,
  ): "purple" | "indigo" | "emerald" | "amber" | "default" => {
    switch (tier.toUpperCase()) {
      case "LEGENDARY":
        return "purple";
      case "MASTER":
        return "indigo";
      case "EXPERT":
        return "emerald";
      case "CONTRIBUTOR":
        return "amber";
      default:
        return "default";
    }
  };

  return [
    {
      key: "rank",
      header: "Rank",
      headerClassName: "w-12 text-center",
      className: "text-center text-[11px] font-medium text-muted-foreground",
      cell: (_, index) => (
        <span className="font-mono font-semibold">#{offset + index + 1}</span>
      ),
    },
    {
      key: "member",
      header: "Member",
      cell: (node: ImpactUserNode) => {
        const user = node.user;
        const hoverUser: UserProfileHoverData = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatarUrl || "",
        };

        const avatarSrc = user?.avatarUrl?.startsWith("http")
          ? user.avatarUrl
          : user?.avatarUrl
            ? `https://cdn.thrico.network/${user.avatarUrl}`
            : "";

        return (
          <UserProfileHoverCard user={hoverUser}>
            <Link href={`/members/${user?.id}`} className="block">
              <AdminTableItem
                avatar={avatarSrc}
                title={`${user.firstName || ""} ${user.lastName || ""}`}
                subtitle={`ID: ${user.id.substring(0, 8)}`}
                fallbackText={user.firstName?.substring(0, 2).toUpperCase()}
              />
            </Link>
          </UserProfileHoverCard>
        );
      },
    },
    {
      key: "tier",
      header: "Tier",
      cell: (node: ImpactUserNode) => (
        <AdminTableTag variant={getTierVariant(node.tier)}>
          {node.tier}
        </AdminTableTag>
      ),
    },
    {
      key: "subscores",
      header: "Breakdown",
      cell: (node: ImpactUserNode) => (
        <TooltipProvider delayDuration={100}>
          <div className="flex items-center gap-2.5">
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1">
                <Activity className="h-3 w-3 text-muted-foreground" />
                <span className="text-[11px] font-mono text-muted-foreground">
                  {node.engagementScore}
                </span>
              </TooltipTrigger>
              <TooltipContent className="text-[11px]">Engagement Score</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3 text-muted-foreground" />
                <span className="text-[11px] font-mono text-muted-foreground">
                  {node.contributionScore}
                </span>
              </TooltipTrigger>
              <TooltipContent className="text-[11px]">Contribution Score</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1">
                <Handshake className="h-3 w-3 text-muted-foreground" />
                <span className="text-[11px] font-mono text-muted-foreground">
                  {node.trustScore}
                </span>
              </TooltipTrigger>
              <TooltipContent className="text-[11px]">Trust Score</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1">
                <Network className="h-3 w-3 text-muted-foreground" />
                <span className="text-[11px] font-mono text-muted-foreground">
                  {node.networkScore}
                </span>
              </TooltipTrigger>
              <TooltipContent className="text-[11px]">Network Score</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1">
                <CalendarCheck className="h-3 w-3 text-muted-foreground" />
                <span className="text-[11px] font-mono text-muted-foreground">
                  {node.consistencyScore}
                </span>
              </TooltipTrigger>
              <TooltipContent className="text-[11px]">Consistency Score</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      ),
    },
    {
      key: "score",
      header: "Total Score",
      cell: (node: ImpactUserNode) => (
        <AdminTableMetric
          icon={Trophy}
          value={node.score.toLocaleString()}
          variant="amber"
        />
      ),
    },
    {
      key: "lastUpdated",
      header: "Last Updated",
      cell: (node: ImpactUserNode) => (
        <AdminTableDate date={node.lastCalculatedAt} />
      ),
    },
    {
      key: "actions",
      header: "Action",
      headerClassName: "w-10 text-right",
      className: "text-right",
      isFixedRight: true,
      cell: (node: ImpactUserNode) => {
        const user = node.user;
        return (
          <div className="flex justify-end items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                  <span className="sr-only">Open actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1 truncate">
                  {user?.firstName} {user?.lastName}
                </DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/members/${user?.id}`}
                    className="text-xs font-medium cursor-pointer gap-2 py-1.5"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                    View Member Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(user?.id);
                    toast.success("Member ID copied to clipboard");
                  }}
                  className="text-xs font-medium cursor-pointer gap-2 py-1.5"
                >
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  Copy Member ID
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
};

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export interface ImpactMembersListProps {
  users: ImpactUserNode[];
  visibleColumns?: Record<string, boolean>;
  offset?: number;
}

export function ImpactMembersList({
  users,
  visibleColumns,
  offset = 0,
}: ImpactMembersListProps) {
  const baseColumns = React.useMemo(
    () => getImpactMemberTableColumns(offset),
    [offset],
  );

  const activeColumns = React.useMemo(() => {
    if (!visibleColumns) return baseColumns;
    return baseColumns.filter((col) => visibleColumns[col.key] !== false);
  }, [baseColumns, visibleColumns]);

  return (
    <div className="space-y-3">
      <AdminTable<ImpactUserNode>
        columns={activeColumns}
        data={users}
        keyExtractor={(u) => u.id}
        emptyTitle="No impact members found"
        emptyDescription="No impact scores have been recorded for members yet."
        pageSize={100}
        baseIndex={offset}
      />
    </div>
  );
}

export default ImpactMembersList;
