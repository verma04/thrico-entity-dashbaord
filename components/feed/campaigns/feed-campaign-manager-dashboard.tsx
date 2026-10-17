/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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
  ExternalLink,
  PauseCircle,
  PlayCircle,
  Edit3,
  Layers,
  Radio,
  Smartphone,
  Search,
} from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const router = useRouter();

  // Filters & State
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 300);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [placementFilter, setPlacementFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Deletion dialog state
  const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null);

  // GraphQL Queries & Mutations
  const { data, loading, refetch } = useGetFeedCampaigns({
    status: statusFilter === "ALL" ? undefined : statusFilter,
    search: debouncedSearch || undefined,
  });

  const { deleteCampaign, loading: isDeleting } = useAdminDeleteFeedCampaign();
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
      if (placementFilter === "BOTH") return c.placements.includes("BOTH") || (c.placements.includes("FEED") && c.placements.includes("STORIES"));
      return true;
    });
  }, [allCampaigns, placementFilter]);

  const stats = data?.getFeedCampaigns?.stats || {
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalPosts: 0,
  };

  const handleCopyLink = (campaign: FeedCampaign) => {
    const url = `${window.location.origin}/feed?campaign=${campaign.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(campaign.id);
    toast.success("Campaign link copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleStatus = async (campaign: FeedCampaign) => {
    const nextStatus: CampaignStatus = campaign.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
    try {
      await updateCampaign({
        variables: {
          id: campaign.id,
          input: { status: nextStatus },
        },
      });
      toast.success(`Campaign status set to ${nextStatus}`);
      refetch();
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to update campaign status");
    }
  };

  const handleDelete = async () => {
    if (!campaignToDelete) return;
    try {
      await deleteCampaign({ variables: { id: campaignToDelete } });
      toast.success("Feed Campaign deleted successfully");
      setCampaignToDelete(null);
      refetch();
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to delete campaign");
    }
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Feed & Story Campaigns"
        description="Design branded transparent PNG frames for your members to apply when posting photos to the Feed or Stories."
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-8 gap-1.5 text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Refresh
          </Button>

          <Button asChild size="sm" className="h-8 gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs">
            <Link href="/feed/campaigns/create">
              <Plus className="h-3.5 w-3.5" />
              New Campaign
            </Link>
          </Button>
        </div>
      </EcosystemHeader>

      <EcosystemContainer className="space-y-6 py-6">
        {/* KPI Cards */}
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
                placeholder="Search campaigns by title or slug..."
              />
            </EcosystemActionBar.Item>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-[125px] text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PAUSED">Paused</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>

            {/* Placement Filter */}
            <Select value={placementFilter} onValueChange={setPlacementFilter}>
              <SelectTrigger className="h-8 w-[135px] text-xs">
                <SelectValue placeholder="Placement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Placements</SelectItem>
                <SelectItem value="FEED">Feed Only</SelectItem>
                <SelectItem value="STORIES">Stories Only</SelectItem>
                <SelectItem value="BOTH">Feed & Stories</SelectItem>
              </SelectContent>
            </Select>
          </EcosystemActionBar.Group>

          <EcosystemActionBar.Group align="right">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-border/60 bg-muted/30 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-1.5 rounded-md text-muted-foreground transition-colors",
                  viewMode === "grid" && "bg-background text-foreground shadow-2xs"
                )}
                title="Grid View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={cn(
                  "p-1.5 rounded-md text-muted-foreground transition-colors",
                  viewMode === "table" && "bg-background text-foreground shadow-2xs"
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
          <div className="py-16 flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-border/80 bg-muted/10 p-8">
            <div className="h-12 w-12 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 shadow-2xs">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">No Feed Campaigns Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">
              {searchTerm || statusFilter !== "ALL" || placementFilter !== "ALL"
                ? "No campaigns match your selected filters. Try resetting search or filter options."
                : "Get started by creating your first photo frame campaign for member posts and stories."}
            </p>
            <Button asChild size="sm" className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white">
              <Link href="/feed/campaigns/create">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Create Feed Campaign
              </Link>
            </Button>
          </div>
        ) : viewMode === "table" ? (
          <FeedCampaignsTable
            campaigns={campaigns}
            onDelete={(id) => setCampaignToDelete(id)}
            onToggleStatus={handleToggleStatus}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {campaigns.map((campaign) => {
              const frameSrc = getPreferredMediaUrl(campaign.frameUrl);
              return (
                <Card
                  key={campaign.id}
                  className="group border-border/60 bg-card hover:border-border transition-all shadow-2xs rounded-xl overflow-hidden flex flex-col justify-between"
                >
                  <CardContent className="p-0">
                    {/* Visual Frame Thumbnail Container */}
                    <div className="relative aspect-video w-full bg-neutral-900/90 border-b border-border/40 flex items-center justify-center overflow-hidden p-3">
                      {frameSrc ? (
                        <img
                          src={frameSrc}
                          alt={campaign.title}
                          className="h-full w-full object-contain pointer-events-none transition-transform group-hover:scale-105 duration-300"
                        />
                      ) : (
                        <Sparkles className="h-8 w-8 text-neutral-600" />
                      )}

                      {/* Top Badges */}
                      <div className="absolute top-2 left-2 flex items-center gap-1.5">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[9px] px-1.5 py-0 font-bold backdrop-blur-md",
                            campaign.status === "ACTIVE"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-black/40 text-neutral-300 border border-white/10"
                          )}
                        >
                          {campaign.status}
                        </Badge>
                      </div>

                      {/* Aspect Ratio Badge */}
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-black/60 backdrop-blur-md text-white text-[9px] px-1.5 py-0 border-white/10">
                          {campaign.aspectRatio || "1:1"}
                        </Badge>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            href={`/feed/campaigns/${campaign.id}/edit`}
                            className="text-sm font-bold text-foreground hover:underline line-clamp-1"
                          >
                            {campaign.title}
                          </Link>
                          <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                            /{campaign.slug}
                          </p>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 -mr-1">
                              <MoreHorizontal className="h-3.5 w-3.5" />
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
                              <span>Copy Member Link</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(campaign)}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              {campaign.status === "ACTIVE" ? (
                                <>
                                  <PauseCircle className="h-3.5 w-3.5" />
                                  <span>Pause Campaign</span>
                                </>
                              ) : (
                                <>
                                  <PlayCircle className="h-3.5 w-3.5" />
                                  <span>Activate Campaign</span>
                                </>
                              )}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() => setCampaignToDelete(campaign.id)}
                              className="flex items-center gap-2 text-destructive cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {campaign.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {campaign.description}
                        </p>
                      )}

                      {/* Placements and Post Count */}
                      <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          {campaign.placements.map((plc) => (
                            <Badge
                              key={plc}
                              variant="outline"
                              className="text-[9px] px-1 py-0 font-medium"
                            >
                              {plc === "FEED" && "Feed"}
                              {plc === "STORIES" && "Stories"}
                              {plc === "BOTH" && "Feed & Stories"}
                            </Badge>
                          ))}
                        </div>
                        <span className="font-semibold text-foreground">
                          {(campaign.totalPosts || 0).toLocaleString()} posts
                        </span>
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
        onOpenChange={(open) => !open && setCampaignToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Feed Campaign?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this frame campaign. Existing posts that used this frame will remain intact in the feed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Campaign"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </EcosystemWrapper>
  );
}
