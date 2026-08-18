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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  UserProfileHoverCard,
  UserProfileHoverData,
} from "@/components/shared/user-profile-hover-card";
import {
  AdminTableTag,
  AdminTableDate,
} from "@/components/shared/admin-table/admin-table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ImpactMemberCardCompactProps {
  node: ImpactUserNode;
  rankIndex: number;
}

export function ImpactMemberCardCompact({
  node,
  rankIndex,
}: ImpactMemberCardCompactProps) {
  const user = node.user;
  const hoverUser: UserProfileHoverData = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: user.avatarUrl || "",
  };

  const getTierColor = (tier: string) => {
    switch (tier.toUpperCase()) {
      case "LEGENDARY":
        return "#a855f7";
      case "MASTER":
        return "#6366f1";
      case "EXPERT":
        return "#10b981";
      case "CONTRIBUTOR":
        return "#f59e0b";
      default:
        return "#71717a";
    }
  };

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

  const avatarSrc = user?.avatarUrl?.startsWith("http")
    ? user.avatarUrl
    : user?.avatarUrl
      ? `https://cdn.thrico.network/${user.avatarUrl}`
      : "";

  return (
    <div className="relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xs hover:shadow-md hover:border-primary/40 transition-all duration-200 flex flex-col justify-between group">
      {/* Top rank tier accent bar */}
      <div
        className="absolute top-0 left-0 h-1 w-full opacity-90 group-hover:opacity-100 transition-opacity z-10"
        style={{ backgroundColor: getTierColor(node.tier) }}
      />

      {/* ── Card Header ─────────────────────────────────────────────────── */}
      <div className="p-3 pb-0 flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-muted text-muted-foreground border border-border">
            #{rankIndex}
          </span>

          <AdminTableTag variant={getTierVariant(node.tier)}>
            {node.tier}
          </AdminTableTag>
        </div>

        <div className="bg-background/80 hover:bg-background rounded-md transition-colors shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-md transition-colors"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-44 rounded-lg shadow-md border-border p-1"
            >
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
      </div>

      {/* ── Card Content Body ───────────────────────────────────────────── */}
      <div className="p-3 space-y-2.5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Member info with hover card */}
          <div className="flex items-center gap-2.5 pt-0.5">
            <UserProfileHoverCard user={hoverUser}>
              <div className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer">
                <Avatar className="h-9 w-9 border border-border shadow-2xs shrink-0">
                  <AvatarImage
                    src={avatarSrc}
                    alt={`${user?.firstName || ""} ${user?.lastName || ""}`}
                  />
                  <AvatarFallback className="text-xs font-semibold bg-muted text-foreground">
                    {user?.firstName?.substring(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col min-w-0 flex-1">
                  <h3
                    className="text-xs sm:text-sm font-semibold text-foreground leading-snug truncate hover:text-primary transition-colors"
                    title={`${user?.firstName || ""} ${user?.lastName || ""}`}
                  >
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <span className="text-[10px] text-muted-foreground font-mono truncate">
                    ID: {user?.id?.substring(0, 8)}
                  </span>
                </div>
              </div>
            </UserProfileHoverCard>
          </div>

          {/* Total Impact Score */}
          <div className="flex items-center justify-between pt-1 border-t border-border/30">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">
              <Trophy className="h-3.5 w-3.5 text-amber-500" />
              <span>{node.score?.toLocaleString() ?? 0}</span>
              <span className="text-[9px] text-muted-foreground font-medium uppercase">
                Score
              </span>
            </div>
          </div>

          {/* Subscore breakdown */}
          <TooltipProvider delayDuration={100}>
            <div className="flex items-center justify-between gap-1 pt-1 border-t border-border/20 text-[10px] text-muted-foreground">
              <Tooltip>
                <TooltipTrigger className="flex items-center gap-1 hover:text-foreground transition-colors">
                  <Activity className="h-3 w-3 text-muted-foreground/70" />
                  <span className="font-mono font-medium">{node.engagementScore}</span>
                </TooltipTrigger>
                <TooltipContent className="text-[11px]">Engagement Score</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger className="flex items-center gap-1 hover:text-foreground transition-colors">
                  <MessageSquare className="h-3 w-3 text-muted-foreground/70" />
                  <span className="font-mono font-medium">{node.contributionScore}</span>
                </TooltipTrigger>
                <TooltipContent className="text-[11px]">Contribution Score</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger className="flex items-center gap-1 hover:text-foreground transition-colors">
                  <Handshake className="h-3 w-3 text-muted-foreground/70" />
                  <span className="font-mono font-medium">{node.trustScore}</span>
                </TooltipTrigger>
                <TooltipContent className="text-[11px]">Trust Score</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger className="flex items-center gap-1 hover:text-foreground transition-colors">
                  <Network className="h-3 w-3 text-muted-foreground/70" />
                  <span className="font-mono font-medium">{node.networkScore}</span>
                </TooltipTrigger>
                <TooltipContent className="text-[11px]">Network Score</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger className="flex items-center gap-1 hover:text-foreground transition-colors">
                  <CalendarCheck className="h-3 w-3 text-muted-foreground/70" />
                  <span className="font-mono font-medium">{node.consistencyScore}</span>
                </TooltipTrigger>
                <TooltipContent className="text-[11px]">Consistency Score</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>

        {/* ── Card Footer ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[10px] text-muted-foreground">
          <span>Updated</span>
          <AdminTableDate date={node.lastCalculatedAt} />
        </div>
      </div>
    </div>
  );
}

export default ImpactMemberCardCompact;
