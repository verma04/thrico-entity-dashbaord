/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Video,
  Plus,
  Search,
  MoreVertical,
  Camera,
  Edit,
  Trash2,
  Copy,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPreferredMediaUrl } from "@/lib/media-utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  MomentCampaign,
  useAdminDeleteMomentCampaign,
} from "@/graphql/actions/moments/campaigns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CampaignsTableProps {
  campaigns: MomentCampaign[];
  stats?: {
    totalCampaigns: number;
    activeCampaigns: number;
    totalCompositions: number;
    totalDownloads: number;
  };
}

export function CampaignsTable({
  campaigns,
  stats,
}: CampaignsTableProps) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const { deleteCampaign, loading: deleting } = useAdminDeleteMomentCampaign();

  // Filter campaigns
  const filtered = campaigns.filter((c) => {
    const matchStatus = activeTab === "ALL" || c.status === activeTab;
    const matchSearch =
      !search.trim() ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteCampaign({ variables: { id: deleteTargetId } });
      toast.success("Campaign deleted successfully.");
      setDeleteTargetId(null);
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to delete campaign.");
    }
  };

  const copyShareLink = (slug: string) => {
    const link = `${window.location.origin}/moments/campaigns/${slug}/compose`;
    navigator.clipboard.writeText(link);
    toast.success("Campaign Studio link copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      {/* 1. KPI Analytics Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Total Campaigns
          </p>
          <p className="text-xl font-bold text-foreground mt-1">
            {stats?.totalCampaigns ?? campaigns.length}
          </p>
        </div>

        <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Active Campaigns
          </p>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {stats?.activeCampaigns ?? campaigns.filter((c) => c.status === "ACTIVE").length}
          </p>
        </div>

        <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Videos Rendered
          </p>
          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
            {stats?.totalCompositions ?? campaigns.reduce((acc, c) => acc + (c.totalCompositions || 0), 0)}
          </p>
        </div>

        <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Total Downloads
          </p>
          <p className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-1">
            {stats?.totalDownloads ?? 0}
          </p>
        </div>
      </div>

      {/* 2. Search, Status Tabs & Create CTA Header */}
      <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full sm:w-auto"
          >
            <TabsList className="h-9 bg-muted/40 p-1">
              <TabsTrigger value="ALL" className="text-xs">
                All
              </TabsTrigger>
              <TabsTrigger value="ACTIVE" className="text-xs">
                Active
              </TabsTrigger>
              <TabsTrigger value="DRAFT" className="text-xs">
                Drafts
              </TabsTrigger>
              <TabsTrigger value="PAUSED" className="text-xs">
                Paused
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9 text-xs"
              />
            </div>

            <Link href="/moments/campaigns/create">
              <Button
                size="sm"
                className="h-9 text-xs font-medium bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Create Campaign
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Campaign List Table / Cards */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center bg-card/40 flex flex-col items-center justify-center gap-3">
          <div className="h-12 w-12 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              No Moment Campaigns Found
            </h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Create your first branded campaign to give members a custom PNG frame filter and merged intro/outro videos.
            </p>
          </div>
          <Link href="/moments/campaigns/create">
            <Button
              size="sm"
              className="text-xs mt-2 bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Create Campaign
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((campaign) => {
            return (
              <div
                key={campaign.id}
                className="group rounded-2xl border border-border/70 bg-card hover:border-indigo-500/50 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Visual Top Preview Header */}
                <div className="relative aspect-[16/9] bg-gradient-to-br from-zinc-900 via-zinc-950 to-indigo-950/40 p-4 flex items-center justify-between border-b border-border/40">
                  {/* Miniature Frame Preview */}
                  <div className="relative h-24 aspect-[9/16] rounded-lg overflow-hidden border border-white/20 bg-black/60 shadow-lg">
                    {campaign.frameUrl ? (
                      <img
                        src={getPreferredMediaUrl(campaign.frameUrl)}
                        alt={campaign.title}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-500">
                        <Video className="h-4 w-4" />
                      </div>
                    )}
                  </div>

                  {/* Status Badge & Actions */}
                  <div className="flex flex-col items-end justify-between h-full">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] font-semibold uppercase tracking-wider",
                        campaign.status === "ACTIVE"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {campaign.status}
                    </Badge>

                    <div className="flex items-center gap-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/10 rounded-full cursor-pointer"
                          >
                            <MoreVertical className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="text-xs">
                          <DropdownMenuItem
                            onClick={() => copyShareLink(campaign.slug)}
                            className="cursor-pointer"
                          >
                            <Copy className="h-3.5 w-3.5 mr-2" /> Copy Studio Link
                          </DropdownMenuItem>
                          <Link href={`/moments/campaigns/${campaign.id}/edit`}>
                            <DropdownMenuItem className="cursor-pointer">
                              <Edit className="h-3.5 w-3.5 mr-2" /> Edit Campaign
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeleteTargetId(campaign.id)}
                            className="text-destructive cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete Campaign
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>

                {/* Campaign Body Info */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-foreground tracking-tight line-clamp-1">
                      {campaign.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      /{campaign.slug}
                    </p>
                    {campaign.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 pt-1">
                        {campaign.description}
                      </p>
                    )}
                  </div>

                  {/* Sequence Tags */}
                  <div className="space-y-2 pt-2 border-t border-border/50">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <span className="p-1 rounded bg-muted/40 font-mono">
                        {campaign.introMomentId ? "✓ Intro Moment" : "No Intro"}
                      </span>
                      <span>➔</span>
                      <span className="p-1 rounded bg-indigo-500/10 text-indigo-500 font-mono font-semibold">
                        PNG Frame
                      </span>
                      <span>➔</span>
                      <span className="p-1 rounded bg-muted/40 font-mono">
                        {campaign.outroMomentId ? "✓ Outro Moment" : "No Outro"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Video className="h-3.5 w-3.5 text-indigo-500" />
                        <span className="font-semibold text-foreground">
                          {campaign.totalCompositions || 0}
                        </span>{" "}
                        composed
                      </span>

                      <span className="font-mono text-muted-foreground text-[10px]">
                        Max {campaign.maxUserDurationSeconds || 60}s
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-3 bg-muted/15 border-t border-border/50 flex items-center gap-2">
                  <Link
                    href={`/moments/campaigns/${campaign.id}/compose`}
                    className="flex-1"
                  >
                    <Button
                      size="sm"
                      className="w-full h-8 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Camera className="h-3.5 w-3.5" />
                      Open Studio / Record
                    </Button>
                  </Link>

                  <Link href={`/moments/campaigns/${campaign.id}/edit`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs cursor-pointer px-2.5"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={Boolean(deleteTargetId)}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-sm font-semibold">
              Delete Moment Campaign?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to delete this campaign? This action cannot be undone and will disable the frame filter for users.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-8 text-xs">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="h-8 text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete Campaign"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
