/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Edit3,
  Trash2,
  Copy,
  MoreHorizontal,
  Check,
  Radio,
  Smartphone,
  Layers,
  PauseCircle,
  PlayCircle,
  Archive,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FeedCampaign, CampaignStatus } from "@/graphql/actions/feed/campaigns";
import { getPreferredMediaUrl } from "@/lib/media-utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FeedCampaignsTableProps {
  campaigns: FeedCampaign[];
  onDelete: (id: string) => void;
  onToggleStatus: (campaign: FeedCampaign, nextStatus?: CampaignStatus) => void;
}

export function FeedCampaignsTable({
  campaigns,
  onDelete,
  onToggleStatus,
}: FeedCampaignsTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (campaign: FeedCampaign) => {
    const url = `${window.location.origin}/feed?campaign=${campaign.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(campaign.id);
    toast.success("Campaign link copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: CampaignStatus, campaign: FeedCampaign) => {
    const isActive = status === "ACTIVE";
    const isPaused = status === "PAUSED";
    const isDraft = status === "DRAFT";

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold rounded-full transition-all cursor-pointer border",
              isActive &&
                "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20",
              isPaused &&
                "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20",
              isDraft &&
                "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20 hover:bg-zinc-500/20",
              !isActive &&
                !isPaused &&
                !isDraft &&
                "bg-muted text-muted-foreground border-border hover:bg-muted/80"
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                isActive && "bg-emerald-500 animate-pulse",
                isPaused && "bg-amber-500",
                isDraft && "bg-zinc-400",
                !isActive && !isPaused && !isDraft && "bg-muted-foreground"
              )}
            />
            <span>{status}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-36 text-xs">
          <DropdownMenuItem onClick={() => onToggleStatus(campaign, "ACTIVE")}>
            <PlayCircle className="h-3.5 w-3.5 mr-2 text-emerald-600" />
            Active
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onToggleStatus(campaign, "PAUSED")}>
            <PauseCircle className="h-3.5 w-3.5 mr-2 text-amber-600" />
            Paused
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onToggleStatus(campaign, "ARCHIVED")}>
            <Archive className="h-3.5 w-3.5 mr-2 text-zinc-500" />
            Archived
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-2xs">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/70">
            <TableHead className="w-[84px] text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Frame
            </TableHead>
            <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Campaign & Slug
            </TableHead>
            <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Destination
            </TableHead>
            <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Ratio
            </TableHead>
            <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Posts
            </TableHead>
            <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Status
            </TableHead>
            <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Created
            </TableHead>
            <TableHead className="w-[80px] text-right text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((campaign) => {
            const frameSrc = getPreferredMediaUrl(campaign.frameUrl);
            const isBoth =
              campaign.placements.includes("BOTH") ||
              (campaign.placements.includes("FEED") && campaign.placements.includes("STORIES"));

            return (
              <TableRow
                key={campaign.id}
                className="hover:bg-muted/20 transition-colors border-b border-border/50 group"
              >
                {/* Frame Preview Thumbnail */}
                <TableCell className="p-3">
                  <div className="h-12 w-12 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center overflow-hidden p-1 shadow-2xs relative">
                    {frameSrc ? (
                      <img
                        src={frameSrc}
                        alt={campaign.title}
                        className="h-full w-full object-contain pointer-events-none group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <Sparkles className="h-5 w-5 text-zinc-600" />
                    )}
                  </div>
                </TableCell>

                {/* Campaign Title & Slug */}
                <TableCell className="p-3">
                  <div>
                    <Link
                      href={`/feed/campaigns/${campaign.id}/edit`}
                      className="text-xs font-bold text-foreground group-hover:text-indigo-600 transition-colors block truncate max-w-[240px]"
                      title={campaign.title}
                    >
                      {campaign.title}
                    </Link>
                    <div className="text-[10.5px] font-mono text-muted-foreground flex items-center gap-1 mt-0.5">
                      <span>slug:</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold truncate max-w-[180px]">
                        {campaign.slug}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Placements */}
                <TableCell className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {isBoth ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[9px] px-1.5 py-0 font-semibold flex items-center gap-1">
                        <Layers className="h-2.5 w-2.5" /> Both
                      </Badge>
                    ) : (
                      campaign.placements.map((plc) => (
                        <Badge
                          key={plc}
                          variant="secondary"
                          className={cn(
                            "text-[9px] px-1.5 py-0 font-semibold flex items-center gap-1",
                            plc === "FEED" &&
                              "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
                            plc === "STORIES" &&
                              "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                          )}
                        >
                          {plc === "FEED" && (
                            <>
                              <Radio className="h-2.5 w-2.5" /> Feed
                            </>
                          )}
                          {plc === "STORIES" && (
                            <>
                              <Smartphone className="h-2.5 w-2.5" /> Stories
                            </>
                          )}
                        </Badge>
                      ))
                    )}
                  </div>
                </TableCell>

                {/* Aspect Ratio */}
                <TableCell className="p-3">
                  <Badge variant="outline" className="font-mono text-[10px] px-1.5 py-0">
                    {campaign.aspectRatio || "1:1"}
                  </Badge>
                </TableCell>

                {/* Total Posts */}
                <TableCell className="p-3">
                  <span className="text-xs font-semibold text-foreground">
                    {(campaign.totalPosts || 0).toLocaleString()}
                  </span>
                </TableCell>

                {/* Status */}
                <TableCell className="p-3">
                  {getStatusBadge(campaign.status, campaign)}
                </TableCell>

                {/* Created Date */}
                <TableCell className="p-3 text-[11px] text-muted-foreground whitespace-nowrap">
                  {new Date(campaign.createdAt).toLocaleDateString()}
                </TableCell>

                {/* Actions Dropdown */}
                <TableCell className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/feed/campaigns/${campaign.id}/edit`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-[11px] font-semibold border-border/70 hover:border-indigo-400 px-2 cursor-pointer"
                      >
                        <Edit3 className="h-3 w-3 mr-1 text-indigo-500" />
                        Edit
                      </Button>
                    </Link>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 text-xs">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/feed/campaigns/${campaign.id}/edit`}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                            <span>Edit Campaign</span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleCopyLink(campaign)}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          {copiedId === campaign.id ? (
                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                          <span>Copy Feed Link</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() =>
                            onToggleStatus(
                              campaign,
                              campaign.status === "ACTIVE" ? "PAUSED" : "ACTIVE"
                            )
                          }
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          {campaign.status === "ACTIVE" ? (
                            <>
                              <PauseCircle className="h-3.5 w-3.5 text-amber-500" />
                              <span>Pause Campaign</span>
                            </>
                          ) : (
                            <>
                              <PlayCircle className="h-3.5 w-3.5 text-emerald-500" />
                              <span>Activate Campaign</span>
                            </>
                          )}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => onDelete(campaign.id)}
                          className="flex items-center gap-2 text-destructive cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
