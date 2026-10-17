/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import Link from "next/link";
import {
  Sparkles,
  Plus,
  RotateCcw,
  Upload,
  LayoutGrid,
  List as ListIcon,
  Video,
  Camera,
  Copy,
  Check,
  MoreHorizontal,
  Trash2,
  PauseCircle,
  PlayCircle,
  Archive,
  Edit3,
  Palette,
} from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { Button } from "@/components/ui/button";
import { getPreferredMediaUrl } from "@/lib/media-utils";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useUrlDateRange } from "@/hooks/use-url-date-range";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import {
  useGetMomentCampaigns,
  useAdminDeleteMomentCampaign,
  useAdminUpdateMomentCampaign,
  MomentCampaign,
  CampaignStatus,
} from "@/graphql/actions/moments/campaigns";
import { CampaignKpiSummary } from "./campaign-kpi-summary";
import { CampaignPresetsDrawer } from "./campaign-presets-drawer";
import { CampaignsDesignDrawer } from "./campaigns-design-drawer";
import { ExportCampaignsModal } from "./export-campaigns-modal";

export function CampaignManagerDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { dateRange, handleDateChange } = useUrlDateRange(7);

  // URL state sync modeled after utm-manager-dashboard
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      if (pathname !== "/moments/campaigns") return;
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "" || value === "ALL") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  const viewMode = (searchParams.get("view") as "table" | "grid") || "grid";
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "ALL");
  const [debouncedSearch] = useDebounce(search, 300);

  // Modals state
  const [showExportModal, setShowExportModal] = useState(false);
  const [showPresetsDrawer, setShowPresetsDrawer] = useState(false);
  const [showDesignDrawer, setShowDesignDrawer] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<MomentCampaign | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Queries & Mutations
  const { data, loading, refetch } = useGetMomentCampaigns({
    pagination: { page: 1, limit: 50 },
    status: statusFilter === "ALL" ? undefined : statusFilter,
    search: debouncedSearch || undefined,
  });

  const { deleteCampaign } = useAdminDeleteMomentCampaign();
  const [updateCampaign] = useAdminUpdateMomentCampaign();

  const rawCampaigns = useMemo(() => {
    return data?.getMomentCampaigns?.data || [];
  }, [data]);

  const filteredCampaigns = useMemo(() => {
    return rawCampaigns.filter((c) => {
      if (statusFilter !== "ALL" && c.status !== statusFilter) return false;
      if (debouncedSearch.trim()) {
        const q = debouncedSearch.toLowerCase();
        return (
          c.title.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [rawCampaigns, statusFilter, debouncedSearch]);

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

  const handleCopyLink = (slug: string, id: string) => {
    const url = `${window.location.origin}/moments/campaigns/${id}/compose`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Studio recording link copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleStatus = async (campaign: MomentCampaign, nextStatus: CampaignStatus) => {
    try {
      await updateCampaign({
        variables: {
          id: campaign.id,
          input: { status: nextStatus },
        },
      });
      toast.success(`Campaign status updated to ${nextStatus}`);
      refetch();
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!campaignToDelete) return;
    try {
      await deleteCampaign({ variables: { id: campaignToDelete.id } });
      toast.success("Campaign deleted successfully");
      refetch();
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to delete campaign");
    } finally {
      setCampaignToDelete(null);
    }
  };

  const getStatusBadge = (status: CampaignStatus, campaign: MomentCampaign) => {
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
      {/* ── Page Header ─────────────────────────────────────────── */}
      <EcosystemHeader
        title="Moment Video Campaigns"
        description="Compose branded video challenges with custom intro/outro moments, decorative PNG frame filters, and duration rules."
        icon={Sparkles}
        badgeText="Moment Studio"
        breadcrumbs={[
          { label: "Moments", href: "/moments" },
          { label: "Campaigns", href: "/moments/campaigns" },
        ]}
        actions={
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            <DateRangePicker
              date={dateRange}
              onDateChange={handleDateChange}
              defaultValue="LAST_7_DAYS"
            />
            <div className="h-4 w-px bg-border/70 hidden sm:block" />
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-indigo-600 rounded-lg transition-all cursor-pointer border-border/70"
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh Campaigns"
            >
              <RotateCcw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPresetsDrawer(true)}
              className="h-9 rounded-lg text-xs gap-1.5 font-medium border-border/70 cursor-pointer hover:border-indigo-400"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              Presets
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/moments/campaigns/settings")}
              className="h-9 rounded-lg text-xs gap-1.5 font-medium border-border/70 cursor-pointer hover:border-indigo-400"
            >
              <Palette className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              Design
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExportModal(true)}
              className="h-9 rounded-lg text-xs gap-1.5 font-medium border-border/70 cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5" />
              Export
            </Button>
            <Link href="/moments/campaigns/create">
              <Button
                size="sm"
                className="h-9 rounded-lg gap-2 text-xs font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer shadow-2xs px-3.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Create Campaign
              </Button>
            </Link>
          </div>
        }
      />

      {/* ── Page Content ────────────────────────────────────────── */}
      <EcosystemContainer className="space-y-6 py-6">
        {/* KPI Summary Cards */}
        <CampaignKpiSummary
          campaigns={rawCampaigns}
          loading={loading}
          totalCompositions={rawCampaigns.reduce(
            (acc, c) => acc + (c.totalCompositions || 0),
            0
          )}
        />

        {/* Action & Filter Bar */}
        <EcosystemActionBar shadow="none">
          <EcosystemActionBar.Group>
            <EcosystemActionBar.Item grow className="max-w-xs">
              <EcosystemActionBar.Search
                value={search}
                onChange={setSearch}
                placeholder="Search campaigns by name, slug, or theme…"
              />
            </EcosystemActionBar.Item>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val);
                updateParams({ status: val === "ALL" ? null : val });
              }}
            >
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
                <SelectItem value="PAUSED">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    Paused
                  </span>
                </SelectItem>
                <SelectItem value="DRAFT">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                    Drafts
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
          </EcosystemActionBar.Group>

          <EcosystemActionBar.Group align="right">
            {/* Presets button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPresetsDrawer(true)}
              className="h-8 gap-1.5 text-xs font-medium border-border/70 cursor-pointer hover:border-indigo-400"
            >
              <Sparkles className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
              Presets
            </Button>

            {/* View Switcher (Grid vs Table) */}
            <div className="flex items-center rounded-lg border border-border/70 bg-muted/30 p-0.5">
              <button
                type="button"
                onClick={() => updateParams({ view: "grid" })}
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
                onClick={() => updateParams({ view: "table" })}
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

        {/* ── Empty State ─────────────────────────────────────────── */}
        {filteredCampaigns.length === 0 && !loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-border/80 bg-card/40 p-8">
            <div className="h-12 w-12 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 shadow-2xs">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">No Moment Campaigns Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">
              {search || statusFilter !== "ALL"
                ? "No campaigns match your selected search or filter criteria. Try resetting options."
                : "Create your first branded campaign to give members a custom PNG frame filter and merged intro/outro moments."}
            </p>
            <Link href="/moments/campaigns/create">
              <Button
                size="sm"
                className="h-8 text-xs font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer shadow-2xs"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Create Moment Campaign
              </Button>
            </Link>
          </div>
        ) : viewMode === "table" ? (
          /* ── Table View ─────────────────────────────────────────── */
          <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-2xs">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/70">
                  <TableHead className="w-[84px] text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Viewport
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Campaign & Slug
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Sequence Pipeline
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Rendered
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Studio Compose URL
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="w-[80px] text-right text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((c) => {
                  const studioUrl = `${window.location.origin}/moments/campaigns/${c.id}/compose`;
                  const frameSrc = c.frameUrl ? getPreferredMediaUrl(c.frameUrl) : null;

                  return (
                    <TableRow
                      key={c.id}
                      className="hover:bg-muted/20 transition-colors border-b border-border/50 group"
                    >
                      {/* Frame Viewport Thumbnail */}
                      <TableCell className="p-3">
                        <div className="h-12 w-12 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center overflow-hidden p-1 shadow-2xs relative">
                          {frameSrc ? (
                            <img
                              src={frameSrc}
                              alt={c.title}
                              className="h-full w-full object-contain pointer-events-none group-hover:scale-105 transition-transform duration-200"
                            />
                          ) : (
                            <Camera className="h-5 w-5 text-zinc-600" />
                          )}
                        </div>
                      </TableCell>

                      {/* Title & Slug */}
                      <TableCell className="p-3">
                        <div>
                          <Link
                            href={`/moments/campaigns/${c.id}/compose`}
                            className="text-xs font-bold text-foreground group-hover:text-indigo-600 transition-colors block truncate max-w-[240px]"
                            title={c.title}
                          >
                            {c.title}
                          </Link>
                          <div className="text-[10.5px] font-mono text-muted-foreground flex items-center gap-1 mt-0.5">
                            <span>slug:</span>
                            <span className="text-indigo-600 dark:text-indigo-400 font-semibold truncate max-w-[180px]">
                              {c.slug}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Sequence Pipeline */}
                      <TableCell className="p-3 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-[10px]">
                          <span
                            className={cn(
                              "px-1.5 py-0.5 rounded font-mono border",
                              c.introMomentId
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-semibold"
                                : "bg-muted text-muted-foreground border-border/50"
                            )}
                          >
                            {c.introMomentId ? "✓ Intro" : "No Intro"}
                          </span>
                          <span className="text-muted-foreground text-[10px]">➔</span>
                          <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-mono font-semibold">
                            PNG Frame
                          </span>
                          <span className="text-muted-foreground text-[10px]">➔</span>
                          <span
                            className={cn(
                              "px-1.5 py-0.5 rounded font-mono border",
                              c.outroMomentId
                                ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 font-semibold"
                                : "bg-muted text-muted-foreground border-border/50"
                            )}
                          >
                            {c.outroMomentId ? "✓ Outro" : "No Outro"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Rendered Count */}
                      <TableCell className="p-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                          <Video className="h-3 w-3" />
                          <span>{c.totalCompositions || 0}</span>
                        </span>
                      </TableCell>

                      {/* Studio Compose URL */}
                      <TableCell className="p-3 max-w-xs">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                          <span className="truncate max-w-[150px] select-all">{studioUrl}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyLink(c.slug, c.id)}
                            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                            title="Copy Studio Link"
                          >
                            {copiedId === c.id ? (
                              <Check className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="p-3 whitespace-nowrap">
                        {getStatusBadge(c.status, c)}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="p-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/moments/campaigns/${c.id}/compose`}>
                            <Button
                              size="sm"
                              className="h-7 text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer px-2 shadow-2xs"
                            >
                              <Camera className="h-3 w-3 mr-1" /> Studio
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
                              <Link href={`/moments/campaigns/${c.id}/edit`}>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Edit3 className="h-3.5 w-3.5 mr-2" /> Edit Campaign
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuItem
                                onClick={() => handleCopyLink(c.slug, c.id)}
                                className="cursor-pointer"
                              >
                                <Copy className="h-3.5 w-3.5 mr-2" /> Copy Studio Link
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setCampaignToDelete(c)}
                                className="text-destructive cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete Campaign
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
        ) : (
          /* ── Grid View ──────────────────────────────────────────── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCampaigns.map((c) => {
              const frameSrc = c.frameUrl ? getPreferredMediaUrl(c.frameUrl) : null;

              return (
                <Card
                  key={c.id}
                  className="group border-border/70 bg-card hover:border-indigo-500/40 hover:shadow-md transition-all shadow-2xs rounded-xl overflow-hidden flex flex-col justify-between"
                >
                  <CardContent className="p-0 flex flex-col h-full justify-between">
                    <div>
                      {/* Visual Frame Thumbnail Chassis */}
                      <div className="relative aspect-video w-full bg-gradient-to-b from-zinc-900 via-zinc-950 to-indigo-950/30 border-b border-border/50 flex items-center justify-center overflow-hidden p-3">
                        <div className="h-full aspect-[9/16] rounded overflow-hidden border border-white/20 bg-black/60 shadow-lg relative flex items-center justify-center">
                          {frameSrc ? (
                            <img
                              src={frameSrc}
                              alt={c.title}
                              className="h-full w-full object-contain pointer-events-none transition-transform group-hover:scale-105 duration-300"
                            />
                          ) : (
                            <Camera className="h-4 w-4 text-zinc-500" />
                          )}
                        </div>

                        {/* Top Left Status Badge */}
                        <div className="absolute top-2.5 left-2.5">
                          {getStatusBadge(c.status, c)}
                        </div>

                        {/* Top Right Aspect Badge */}
                        <div className="absolute top-2.5 right-2.5">
                          <Badge className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[9px] px-1.5 py-0 font-bold backdrop-blur-md">
                            {c.aspectRatio || "9:16"}
                          </Badge>
                        </div>
                      </div>

                      {/* Card Details */}
                      <div className="p-4 space-y-2.5">
                        <div>
                          <Link
                            href={`/moments/campaigns/${c.id}/compose`}
                            className="font-bold text-sm text-foreground group-hover:text-indigo-600 transition-colors block truncate"
                            title={c.title}
                          >
                            {c.title}
                          </Link>
                          <div className="text-[11px] font-mono text-muted-foreground flex items-center gap-1 mt-0.5">
                            <span>slug:</span>
                            <span className="text-indigo-600 dark:text-indigo-400 font-semibold truncate">
                              {c.slug}
                            </span>
                          </div>
                        </div>

                        {c.description && (
                          <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                            {c.description}
                          </p>
                        )}

                        {/* Sequence Tag Pipeline */}
                        <div className="pt-2 border-t border-border/50 space-y-2">
                          <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                            <span
                              className={cn(
                                "px-1.5 py-0.5 rounded font-mono border",
                                c.introMomentId
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-semibold"
                                  : "bg-muted text-muted-foreground border-border/50"
                              )}
                            >
                              {c.introMomentId ? "✓ Intro" : "No Intro"}
                            </span>
                            <span>➔</span>
                            <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-mono font-semibold">
                              PNG Frame
                            </span>
                            <span>➔</span>
                            <span
                              className={cn(
                                "px-1.5 py-0.5 rounded font-mono border",
                                c.outroMomentId
                                  ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 font-semibold"
                                  : "bg-muted text-muted-foreground border-border/50"
                              )}
                            >
                              {c.outroMomentId ? "✓ Outro" : "No Outro"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] pt-0.5">
                            <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                              <Video className="h-3 w-3 text-indigo-500" />
                              <span className="font-bold text-foreground">
                                {c.totalCompositions || 0}
                              </span>{" "}
                              composed
                            </span>

                            <span className="font-mono text-muted-foreground text-[10px]">
                              Max {c.maxUserDurationSeconds || 60}s
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="p-3 bg-muted/20 border-t border-border/50 flex items-center justify-between gap-2">
                      <Link
                        href={`/moments/campaigns/${c.id}/compose`}
                        className="flex-1"
                      >
                        <Button
                          size="sm"
                          className="w-full h-8 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Camera className="h-3.5 w-3.5" />
                          <span>Open Studio</span>
                        </Button>
                      </Link>

                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopyLink(c.slug, c.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                          title="Copy Studio Link"
                        >
                          {copiedId === c.id ? (
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
                            <Link href={`/moments/campaigns/${c.id}/edit`}>
                              <DropdownMenuItem className="cursor-pointer">
                                <Edit3 className="h-3.5 w-3.5 mr-2" /> Edit Campaign
                              </DropdownMenuItem>
                            </Link>

                            <DropdownMenuItem
                              onClick={() => handleCopyLink(c.slug, c.id)}
                              className="cursor-pointer"
                            >
                              <Copy className="h-3.5 w-3.5 mr-2" /> Copy Studio Link
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                handleToggleStatus(
                                  c,
                                  c.status === "ACTIVE" ? "PAUSED" : "ACTIVE"
                                )
                              }
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              {c.status === "ACTIVE" ? (
                                <>
                                  <PauseCircle className="h-3.5 w-3.5 text-amber-500 mr-2" />
                                  <span>Pause Campaign</span>
                                </>
                              ) : (
                                <>
                                  <PlayCircle className="h-3.5 w-3.5 text-emerald-500 mr-2" />
                                  <span>Activate Campaign</span>
                                </>
                              )}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() => setCampaignToDelete(c)}
                              className="text-destructive cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete Campaign
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
            <AlertDialogTitle>Delete Moment Campaign?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {campaignToDelete?.title}
              </span>
              ? This action cannot be undone. Members will no longer be able to record or generate videos using this frame.
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

      {/* Presets Drawer */}
      <CampaignPresetsDrawer
        open={showPresetsDrawer}
        onOpenChange={setShowPresetsDrawer}
      />

      {/* Member Catalog Design Settings Drawer */}
      <CampaignsDesignDrawer
        open={showDesignDrawer}
        onOpenChange={setShowDesignDrawer}
      />

      {/* Export Modal */}
      <ExportCampaignsModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        campaigns={rawCampaigns}
      />
    </EcosystemWrapper>
  );
}
