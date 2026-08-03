"use client";

import React from "react";
import { AdminTable } from "@/components/shared/admin-table/admin-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  UserProfileHoverCard,
  UserProfileHoverData,
} from "@/components/shared/user-profile-hover-card";
import { Trophy, Activity, MessageSquare, Handshake, Network, CalendarCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

export function ImpactMembersTable({ users, isLoading }: ImpactMembersTableProps) {
  const getTierColor = (tier: string) => {
    switch (tier.toUpperCase()) {
      case "LEGENDARY": return "bg-purple-100 text-purple-700 border-purple-200";
      case "MASTER": return "bg-blue-100 text-blue-700 border-blue-200";
      case "EXPERT": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "CONTRIBUTOR": return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-zinc-100 text-zinc-700 border-zinc-200";
    }
  };

  const columns = [
    {
      key: "rank",
      header: "Rank",
      cell: (user: ImpactUserNode, index: number) => (
        <span className="font-mono text-xs text-muted-foreground font-semibold">
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
            <div className="flex items-center gap-3 cursor-pointer">
              <Avatar className="h-8 w-8 border border-border shrink-0">
                <AvatarImage
                  src={`${process.env.NEXT_PUBLIC_CDN_URL}/${user.avatarUrl}`}
                  alt={user.firstName}
                  className="object-cover"
                />
                <AvatarFallback className="text-[10px] bg-muted text-muted-foreground font-medium">
                  {user.firstName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-foreground leading-tight hover:underline">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  ID: {user.id.substring(0, 8)}
                </span>
              </div>
            </div>
          </UserProfileHoverCard>
        );
      },
    },
    {
      key: "tier",
      header: "Tier",
      cell: (node: ImpactUserNode) => (
        <Badge variant="outline" className={`font-medium text-[10px] capitalize ${getTierColor(node.tier)}`}>
          {node.tier.toLowerCase()}
        </Badge>
      ),
    },
    {
      key: "subscores",
      header: "Breakdown",
      cell: (node: ImpactUserNode) => (
        <TooltipProvider delayDuration={100}>
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1">
                <Activity size={12} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{node.engagementScore}</span>
              </TooltipTrigger>
              <TooltipContent>Engagement Score</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1">
                <MessageSquare size={12} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{node.contributionScore}</span>
              </TooltipTrigger>
              <TooltipContent>Contribution Score</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1">
                <Handshake size={12} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{node.trustScore}</span>
              </TooltipTrigger>
              <TooltipContent>Trust Score</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1">
                <Network size={12} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{node.networkScore}</span>
              </TooltipTrigger>
              <TooltipContent>Network Score</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1">
                <CalendarCheck size={12} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{node.consistencyScore}</span>
              </TooltipTrigger>
              <TooltipContent>Consistency Score</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      ),
    },
    {
      key: "score",
      header: "Total Score",
      cell: (node: ImpactUserNode) => (
        <div className="flex items-center gap-1.5">
          <Trophy size={14} className="text-amber-500" />
          <span className="font-mono text-sm font-bold text-foreground">
            {node.score.toLocaleString()}
          </span>
        </div>
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
    />
  );
}
