/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useMemo } from "react";
import { useDebounce } from "use-debounce";
import Link from "next/link";
import {
  Sparkles,
  Plus,
  RotateCcw,
  LayoutGrid,
  List as ListIcon,
  Copy,
  Check,
  MoreHorizontal,
  Trash2,
  PauseCircle,
  PlayCircle,
  Archive,
  Edit3,
  Radio,
  Smartphone,
  Layers,
  Image as ImageIcon,
} from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getPreferredMediaUrl } from "@/lib/media-utils";

import {
  useGetFeedCampaigns,
  useAdminDeleteFeedCampaign,
  useAdminUpdateFeedCampaign,
  FeedCampaign,
  CampaignStatus,
} from "@/graphql/actions/feed/campaigns";
import { FeedCampaignKpiSummary } from "./feed-campaign-kpi-summary";
import { FeedCampaignsTable } from "./feed-campaigns-table";

export function FeedCampaignManagerDashboard() {
  // Filters & State
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 300);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [placementFilter, setPlacementFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Deletion dialog state
  const [campaignToDelete, setCampaignToDelete] = useState<FeedCampaign | null>(null);

  // GraphQL Queries & Mutations
  const { data, loading, refetch } = useGetFeedCampaigns({
    status: statusFilter === "ALL" ? undefined : statusFilter,
    search: debouncedSearch || undefined,
  });

  const { deleteCampaign } = useAdminDeleteFeedCampaign();
  const [updateCampaign] = useAdminUpdateFeedCampaign();

  const allCampaigns = useMemo(() => {
    return data?.getFeedCampaigns?.data || [];
  }, [data]);

  // Client-side placement filter
  const campaigns = useMemo(() => {
    if (placementFilter === "ALL") return allCampaigns;
    return allCampaigns.filter((c) => {
      if (placementFilter === "FEED") return c.placements.includes("FEED");
      if (placementFilter === "STORIES") return c.placements.includes("STORIES");
      if (placementFilter === "BOTH")
        return (
          c.placements.includes("BOTH") ||
          (c.placements.includes("FEED") && c.placements.includes("STORIES"))
        );
      return true;
    });
  }, [allCampaigns, placementFilter]);

  const stats = data?.getFeedCampaigns?.stats || {
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalPosts: 0,
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success("Campaign metrics refreshed");
    } catch {
      toast.info("Refreshed");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCopyLink = (campaign: FeedCampaign) => {
    const url = `${window.location.origin}/feed?campaign=${campaign.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(campaign.id);
    toast.success("Campaign link copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleStatus = async (campaign: FeedCampaign, nextStatus?: CampaignStatus) => {
    const statusToSet: CampaignStatus =
      nextStatus || (campaign.status === "ACTIVE" ? "PAUSED" : "ACTIVE");
    try {
      await updateCampaign({
        variables: {
          id: campaign.id,
          input: { status: statusToSet },
        },
      });
      toast.success(`Campaign status updated to ${statusToSet}`);
      refetch();
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to update campaign status");
    }
  };

  const handleDelete = async () => {
    if (!campaignToDelete) return;
    try {
      await deleteCampaign({ variables: { id: campaignToDelete.id } });
      toast.success("Feed Campaign deleted successfully");
      setCampaignToDelete(null);
      refetch();
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to delete campaign");
    }
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
              "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-semibold rounded-full transition-all cursor-pointer border",
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
          <DropdownMenuItem onClick={() => handleToggleStatus(campaign, "ACTIVE")}>
            <PlayCircle className="h-3.5 w-3.5 mr-2 text-emerald-600" />
            Active
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleToggleStatus(campaign, "PAUSED")}>
            <PauseCircle className="h-3.5 w-3.5 mr-2 text-amber-600" />
            Paused
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleToggleStatus(campaign, "ARCHIVED")}>
            <Archive className="h-3.5 w-3.5 mr-2 text-zinc-500" />
            Archived
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <EcosystemWrapper>
      {/* Page Header matching Thrico standard */}
      <EcosystemHeader
        title="Feed & Story Campaigns"
        description="Design branded transparent PNG frame overlays for member posts in community feeds and vertical stories."
        icon={Sparkles}
        badgeText="Feed Studio"
        breadcrumbs={[
          { label: "Feed", href: "/feed" },
          { label: "Campaigns", href: "/feed/campaigns" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="h-9 gap-1.5 text-xs rounded-lg border-border/70 hover:border-indigo-400 cursor-pointer"
              disabled={isRefreshing}
            >
              <RotateCcw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
              Refresh
            </Button>

            <Link href="/feed/campaigns/create">
              <Button
                size="sm"
                className="h-9 gap-2 text-xs font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer shadow-2xs rounded-lg px-3.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Create Campaign
              </Button>
            </Link>
          </div>
        }
      />

      <EcosystemContainer className="space-y-6 py-6">
        {/* KPI Summary Cards */}
        <FeedCampaignKpiSummary
          campaigns={allCampaigns}
          loading={loading}
          totalPosts={stats.totalPosts}
        />

        {/* Action & Filter Bar */}
        <EcosystemActionBar shadow="none">
          <EcosystemActionBar.Group>
            <EcosystemActionBar.Item grow className="max-w-xs">
              <EcosystemActionBar.Search
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search campaigns by name, slug, or theme…"
              />
            </EcosystemActionBar.Item>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-[130px] text-xs font-medium rounded-lg border-border/70">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="ACTIVE">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                </SelectItem>
                <SelectItem value="DRAFT">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                    Draft
                  </span>
                </SelectItem>
                <SelectItem value="PAUSED">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    Paused
                  </span>
                </SelectItem>
                <SelectItem value="ARCHIVED">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                    Archived
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Placement Filter */}
            <Select value={placementFilter} onValueChange={setPlacementFilter}>
              <SelectTrigger className="h-8 w-[145px] text-xs font-medium rounded-lg border-border/70">
                <SelectValue placeholder="Placement" />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                <SelectItem value="ALL">All Destinations</SelectItem>
                <SelectItem value="FEED">
                  <span className="flex items-center gap-1.5">
                    <Radio className="h-3 w-3 text-indigo-500" />
                    Feed Posts
                  </span>
                </SelectItem>
                <SelectItem value="STORIES">
                  <span className="flex items-center gap-1.5">
                    <Smartphone className="h-3 w-3 text-purple-500" />
                    Stories Only
                  </span>
                </SelectItem>
                <SelectItem value="BOTH">
                  <span className="flex items-center gap-1.5">
                    <Layers className="h-3 w-3 text-emerald-500" />
                    Feed & Stories
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </EcosystemActionBar.Group>

          <EcosystemActionBar.Group align="right">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-border/70 bg-muted/30 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-1.5 rounded-md text-muted-foreground transition-all cursor-pointer",
                  viewMode === "grid" && "bg-background text-foreground shadow-2xs font-semibold"
                )}
                title="Grid View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={cn(
                  "p-1.5 rounded-md text-muted-foreground transition-all cursor-pointer",
                  viewMode === "table" && "bg-background text-foreground shadow-2xs font-semibold"
                )}
                title="Table View"
              >
                <ListIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          </EcosystemActionBar.Group>
        </EcosystemActionBar>

        {/* Campaign Listings */}
        {campaigns.length === 0 && !loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-border/80 bg-card/40 p-8">
            <div className="h-12 w-12 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 shadow-2xs">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">No Feed Campaigns Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">
              {searchTerm || statusFilter !== "ALL" || placementFilter !== "ALL"
                ? "No campaigns match your selected filters. Try resetting search or filter options."
                : "Get started by creating your first photo frame campaign for member posts and stories."}
            </p>
            <Link href="/feed/campaigns/create">
              <Button
                size="sm"
                className="h-8 text-xs font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer shadow-2xs"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Create Feed Campaign
              </Button>
            </Link>
          </div>
        ) : viewMode === "table" ? (
          <FeedCampaignsTable
            campaigns={campaigns}
            onDelete={(id) => {
              const target = campaigns.find((c) => c.id === id);
              if (target) setCampaignToDelete(target);
            }}
            onToggleStatus={handleToggleStatus}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {campaigns.map((campaign) => {
              const frameSrc = getPreferredMediaUrl(campaign.frameUrl);
              const isBoth =
                campaign.placements.includes("BOTH") ||
                (campaign.placements.includes("FEED") &&
                  campaign.placements.includes("STORIES"));

              return (
                <Card
                  key={campaign.id}
                  className="group border-border/70 bg-card hover:border-indigo-500/40 hover:shadow-md transition-all shadow-2xs rounded-xl overflow-hidden flex flex-col justify-between"
                >
                  <CardContent className="p-0 flex flex-col h-full justify-between">
                    <div>
                      {/* Visual Frame Thumbnail Container */}
                      <div className="relative aspect-video w-full bg-gradient-to-b from-zinc-900 via-zinc-950 to-indigo-950/30 border-b border-border/50 flex items-center justify-center overflow-hidden p-3">
                        {frameSrc ? (
                          <div className="h-full aspect-square relative rounded overflow-hidden flex items-center justify-center">
                            <img
                              src={frameSrc}
                              alt={campaign.title}
                              className="h-full w-full object-contain pointer-events-none transition-transform group-hover:scale-105 duration-300"
                            />
                          </div>
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-zinc-600">
                            <Sparkles className="h-8 w-8" />
                          </div>
                        )}

                        {/* Top Left Status Badge */}
                        <div className="absolute top-2.5 left-2.5">
                          {getStatusBadge(campaign.status, campaign)}
                        </div>

                        {/* Top Right Placement Badge */}
                        <div className="absolute top-2.5 right-2.5">
                          {isBoth ? (
                            <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] px-1.5 py-0 font-bold backdrop-blur-md">
                              Both
                            </Badge>
                          ) : campaign.placements.includes("STORIES") ? (
                            <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[9px] px-1.5 py-0 font-bold backdrop-blur-md">
                              Stories
                            </Badge>
                          ) : (
                            <Badge className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[9px] px-1.5 py-0 font-bold backdrop-blur-md">
                              Feed
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Card Content Details */}
                      <div className="p-4 space-y-2.5">
                        <div>
                          <Link
                            href={`/feed/campaigns/${campaign.id}/edit`}
                            className="font-bold text-sm text-foreground group-hover:text-indigo-600 transition-colors block truncate"
                            title={campaign.title}
                          >
                            {campaign.title}
                          </Link>
                          <div className="text-[11px] font-mono text-muted-foreground flex items-center gap-1 mt-0.5">
                            <span>slug:</span>
                            <span className="text-indigo-600 dark:text-indigo-400 font-semibold truncate">
                              {campaign.slug}
                            </span>
                          </div>
                        </div>

                        {campaign.description && (
                          <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                            {campaign.description}
                          </p>
                        )}

                        {/* Format & Posts Counts */}
                        <div className="flex items-center justify-between text-[11px] pt-1">
                          <Badge variant="outline" className="font-mono text-[10px] px-1.5 py-0">
                            {campaign.aspectRatio || "1:1"} Canvas
                          </Badge>

                          <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                            <ImageIcon className="h-3 w-3 text-indigo-500" />
                            <span className="font-bold text-foreground">
                              {(campaign.totalPosts || 0).toLocaleString()}
                            </span>{" "}
                            posts
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="p-3 bg-muted/20 border-t border-border/50 flex items-center justify-between gap-2">
                      <Link
                        href={`/feed/campaigns/${campaign.id}/edit`}
                        className="flex-1"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full h-8 text-xs font-semibold border-border/70 hover:border-indigo-400 text-foreground flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <Edit3 className="h-3.5 w-3.5 text-indigo-500" />
                          <span>Edit Campaign</span>
                        </Button>
                      </Link>

                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopyLink(campaign)}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                          title="Copy Feed Link"
                        >
                          {copiedId === campaign.id ? (
                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 text-xs">
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
                              <Copy className="h-3.5 w-3.5" />
                              <span>Copy Link</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                handleToggleStatus(
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
                              onClick={() => setCampaignToDelete(campaign)}
                              className="flex items-center gap-2 text-destructive cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Delete Campaign</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </EcosystemContainer>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={Boolean(campaignToDelete)}
        onOpenChange={(open) => {
          if (!open) setCampaignToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Feed Campaign?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {campaignToDelete?.title}
              </span>
              ? This action cannot be undone. Members will no longer be able to use this frame overlay when posting to Feed or Stories.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCampaignToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground cursor-pointer"
            >
              Delete Campaign
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </EcosystemWrapper>
  );
}
