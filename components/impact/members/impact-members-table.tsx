"use client";

import React from "react";
import {
  AdminTable,
  AdminTableItem,
  AdminTableTag,
  AdminTableMetric,
  AdminTableDate,
} from "@/components/shared/admin-table/admin-table";
import {
  UserProfileHoverCard,
  UserProfileHoverData,
} from "@/components/shared/user-profile-hover-card";
import {
  Trophy,
  Activity,
  MessageSquare,
  Handshake,
  Network,
  CalendarCheck,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type ImpactUserNode = {
  id: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  score: number;
  engagementScore: number;
  contributionScore: number;
  trustScore: number;
  networkScore: number;
  consistencyScore: number;
  tier: string;
  lastCalculatedAt: string;
};

interface ImpactMembersTableProps {
  users: ImpactUserNode[];
  isLoading: boolean;
}

export function ImpactMembersTable({
  users,
  isLoading,
}: ImpactMembersTableProps) {
  const getTierVariant = (tier: string): "purple" | "indigo" | "emerald" | "amber" | "default" => {
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

  const columns = [
    {
      key: "rank",
      header: "Rank",
      headerClassName: "w-10 text-center",
      className: "text-center",
      cell: (_user: ImpactUserNode, index: number) => (
        <span className="font-mono text-[11px] text-muted-foreground font-semibold">
          #{index + 1}
        </span>
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
        return (
          <UserProfileHoverCard user={hoverUser}>
            <div>
              <AdminTableItem
                avatar={user.avatarUrl}
                title={`${user.firstName || ""} ${user.lastName || ""}`}
                subtitle={`ID: ${user.id.substring(0, 8)}`}
                fallbackText={user.firstName?.substring(0, 2).toUpperCase()}
                onClick={() => {}}
              />
            </div>
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
  ];

  return (
    <AdminTable
      columns={columns}
      data={users || []}
      loading={isLoading}
      keyExtractor={(node) => node.id}
      emptyTitle="No members found"
      emptyDescription="No impact scores have been recorded for members yet."
      size="sm"
    />
  );
}
