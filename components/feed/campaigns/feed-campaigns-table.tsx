/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Edit3,
  Trash2,
  Copy,
  ExternalLink,
  MoreHorizontal,
  Check,
  Radio,
  Smartphone,
  Eye,
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
import { FeedCampaign } from "@/graphql/actions/feed/campaigns";
import { getPreferredMediaUrl } from "@/lib/media-utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FeedCampaignsTableProps {
  campaigns: FeedCampaign[];
  onDelete: (id: string) => void;
  onToggleStatus: (campaign: FeedCampaign) => void;
}

export function FeedCampaignsTable({
  campaigns,
  onDelete,
  onToggleStatus,
}: FeedCampaignsTableProps) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopyLink = (campaign: FeedCampaign) => {
    const url = `${window.location.origin}/feed?campaign=${campaign.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(campaign.id);
    toast.success("Campaign link copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-semibold">
            Active
          </Badge>
        );
      case "DRAFT":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px] font-semibold">
            Draft
          </Badge>
        );
      case "PAUSED":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-[10px] font-semibold">
            Paused
          </Badge>
        );
      default:
        return (
          <Badge className="bg-muted text-muted-foreground border-border text-[10px]">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-2xs">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/60">
            <TableHead className="w-[80px] text-[11px] font-bold text-muted-foreground uppercase">
              Frame
            </TableHead>
            <TableHead className="text-[11px] font-bold text-muted-foreground uppercase">
              Campaign
            </TableHead>
            <TableHead className="text-[11px] font-bold text-muted-foreground uppercase">
              Placements
            </TableHead>
            <TableHead className="text-[11px] font-bold text-muted-foreground uppercase">
              Ratio
            </TableHead>
            <TableHead className="text-[11px] font-bold text-muted-foreground uppercase">
              Posts
            </TableHead>
            <TableHead className="text-[11px] font-bold text-muted-foreground uppercase">
              Status
            </TableHead>
            <TableHead className="text-[11px] font-bold text-muted-foreground uppercase">
              Created
            </TableHead>
            <TableHead className="w-[60px] text-right text-[11px] font-bold text-muted-foreground uppercase">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((campaign) => {
            const frameSrc = getPreferredMediaUrl(campaign.frameUrl);
            return (
              <TableRow
                key={campaign.id}
                className="hover:bg-muted/30 transition-colors border-b border-border/40"
              >
                {/* Frame Preview Thumbnail */}
                <TableCell className="p-3">
                  <div className="h-12 w-12 rounded-lg bg-neutral-900/90 border border-border/60 flex items-center justify-center overflow-hidden p-1">
                    {frameSrc ? (
                      <img
                        src={frameSrc}
                        alt={campaign.title}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <Sparkles className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </TableCell>

                {/* Campaign Title & Slug */}
                <TableCell className="p-3">
                  <div>
                    <Link
                      href={`/feed/campaigns/${campaign.id}/edit`}
                      className="text-xs font-semibold text-foreground hover:underline"
                    >
                      {campaign.title}
                    </Link>
                    <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                      /{campaign.slug}
                    </p>
                  </div>
                </TableCell>

                {/* Placements */}
                <TableCell className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {campaign.placements.map((plc) => (
                      <Badge
                        key={plc}
                        variant="secondary"
                        className="text-[9px] px-1.5 py-0 font-medium"
                      >
                        {plc === "FEED" && "Feed"}
                        {plc === "STORIES" && "Stories"}
                        {plc === "BOTH" && "Feed & Stories"}
                      </Badge>
                    ))}
                  </div>
                </TableCell>

                {/* Aspect Ratio */}
                <TableCell className="p-3">
                  <span className="text-xs text-muted-foreground font-mono">
                    {campaign.aspectRatio || "1:1"}
                  </span>
                </TableCell>

                {/* Total Posts */}
                <TableCell className="p-3">
                  <span className="text-xs font-semibold text-foreground">
                    {(campaign.totalPosts || 0).toLocaleString()}
                  </span>
                </TableCell>

                {/* Status */}
                <TableCell className="p-3">
                  {getStatusBadge(campaign.status)}
                </TableCell>

                {/* Created Date */}
                <TableCell className="p-3 text-[11px] text-muted-foreground whitespace-nowrap">
                  {new Date(campaign.createdAt).toLocaleDateString()}
                </TableCell>

                {/* Actions Dropdown */}
                <TableCell className="p-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
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
                        <span>Copy Link</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => onToggleStatus(campaign)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Radio className="h-3.5 w-3.5" />
                        <span>
                          {campaign.status === "ACTIVE"
                            ? "Pause Campaign"
                            : "Activate Campaign"}
                        </span>
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
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
