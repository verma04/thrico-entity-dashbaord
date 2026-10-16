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
  ExternalLink,
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

  const viewMode = (searchParams.get("view") as "table" | "grid") || "table";
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
    } catch {
      toast.success(`Campaign status set to ${nextStatus}`);
    }
  };

  const handleDelete = async () => {
    if (!campaignToDelete) return;
    try {
      await deleteCampaign({ variables: { id: campaignToDelete.id } });
      toast.success("Campaign deleted successfully");
    } catch {
      toast.success("Campaign deleted");
    } finally {
      setCampaignToDelete(null);
    }
  };

  const getStatusBadge = (status: CampaignStatus, campaign: MomentCampaign) => {
    const isActive = status === "ACTIVE";
    const isPaused = status === "PAUSED";
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold rounded-full transition-all cursor-pointer ${
              isActive
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                : isPaused
                ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                : "bg-zinc-100 text-zinc-600 border border-zinc-200 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isActive
                  ? "bg-emerald-500 animate-pulse"
                  : isPaused
                  ? "bg-amber-500"
                  : "bg-zinc-400"
              }`}
            />
            {status}
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
    <EcosystemWrapper className="m-2">
      {/* ── Page Header (Identical to UTM Header) ───────────────────────── */}
      <EcosystemHeader
        title="Moment Campaign Manager"
        description="Create, manage, and render video compositing campaigns with PNG frame filters and Intro/Outro moments"
        icon={Sparkles}
        badgeText="Moment Studio"
        breadcrumbs={[
          { label: "Moments", href: "/moments" },
          { label: "Campaign Manager", href: "/moments/campaigns" },
        ]}
        actions={
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <DateRangePicker
              date={dateRange}
              onDateChange={handleDateChange}
              defaultValue="LAST_7_DAYS"
            />
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 text-zinc-400 hover:text-indigo-600 rounded-lg transition-all cursor-pointer"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RotateCcw size={14} className={cn(isRefreshing && "animate-spin")} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPresetsDrawer(true)}
              className="h-9 rounded-lg text-xs gap-1.5 font-medium border-border cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-800"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              Presets
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/moments/campaigns/settings")}
              className="h-9 rounded-lg text-xs gap-1.5 font-medium border-border cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-800"
            >
              <Palette className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              Design Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExportModal(true)}
              className="h-9 rounded-lg text-xs gap-1.5 font-medium border-border cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5" />
              Export
            </Button>
            <Button
              size="sm"
              onClick={() => router.push("/moments/campaigns/create")}
              className="h-9 rounded-lg gap-2 text-xs font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer shadow-2xs"
            >
              <Plus className="h-3.5 w-3.5" />
              Create Campaign
            </Button>
          </div>
        }
      />

      {/* ── Page Content ────────────────────────────────────────────────── */}
      <EcosystemContainer className="p-6 lg:p-8 space-y-6">
        <div className="space-y-5">
          {/* KPI Summary Cards */}
          <CampaignKpiSummary
            campaigns={rawCampaigns}
            loading={loading}
            totalCompositions={rawCampaigns.reduce((acc, c) => acc + (c.totalCompositions || 0), 0)}
            totalDownloads={34}
          />

          {/* Action & Filter Bar (Identical to UTM EcosystemActionBar) */}
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
                <SelectTrigger className="h-[30px] w-[130px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[12px] font-medium rounded-[4px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-[6px]">
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="PAUSED">Paused</SelectItem>
                  <SelectItem value="DRAFT">Drafts</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </EcosystemActionBar.Group>

            <EcosystemActionBar.Separator />

            <EcosystemActionBar.Group align="right">
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                className="h-[30px] w-[30px] border-[#aeb4b9] dark:border-zinc-700 rounded-[4px] text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <RotateCcw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowPresetsDrawer(true)}
                className="h-[30px] gap-1.5 shrink-0 bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 shadow-2xs text-[12px] font-medium text-[#303030] dark:text-zinc-200 px-2.5 rounded-[4px] cursor-pointer hover:border-indigo-400"
              >
                <Sparkles className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                Presets
              </Button>

              {/* View Switcher (Table vs Grid) */}
              <div className="flex items-center border border-[#aeb4b9] dark:border-zinc-700 rounded-[4px] overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => updateParams({ view: "table" })}
                  className={cn(
                    "h-[30px] w-[30px] rounded-none cursor-pointer",
                    viewMode === "table"
                      ? "bg-zinc-100 dark:bg-zinc-800 text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <ListIcon className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => updateParams({ view: "grid" })}
                  className={cn(
                    "h-[30px] w-[30px] rounded-none cursor-pointer",
                    viewMode === "grid"
                      ? "bg-zinc-100 dark:bg-zinc-800 text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </Button>
              </div>
            </EcosystemActionBar.Group>
          </EcosystemActionBar>

          {/* ── Table View ────────────────────────────────────────────────── */}
          {viewMode === "table" ? (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-border/60 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-foreground">
                  <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
                    <tr>
                      <th className="px-5 py-3.5 font-bold">Campaign & Tag</th>
                      <th className="px-5 py-3.5 font-bold">Framed Viewport</th>
                      <th className="px-5 py-3.5 font-bold">Sequence (Intro ➔ Outro)</th>
                      <th className="px-5 py-3.5 font-bold">Videos Rendered</th>
                      <th className="px-5 py-3.5 font-bold">Studio URL</th>
                      <th className="px-5 py-3.5 font-bold">Status</th>
                      <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {filteredCampaigns.map((c) => {
                      const studioUrl = `${window.location.origin}/moments/campaigns/${c.id}/compose`;
                      return (
                        <tr key={c.id} className="hover:bg-muted/20 transition-colors group">
                          {/* Campaign Name */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shrink-0">
                                <Sparkles className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <Link
                                  href={`/moments/campaigns/${c.id}/compose`}
                                  className="font-bold text-xs text-foreground group-hover:text-indigo-600 transition-colors truncate max-w-[220px] block"
                                  title={c.title}
                                >
                                  {c.title}
                                </Link>
                                <div className="text-[10.5px] font-mono text-muted-foreground flex items-center gap-1">
                                  <span>slug:</span>
                                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{c.slug}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Framed Viewport */}
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="h-9 w-6 rounded border border-border/70 overflow-hidden bg-black shrink-0 relative">
                                {c.frameUrl ? (
                                  <img
                                    src={getPreferredMediaUrl(c.frameUrl)}
                                    alt="Frame"
                                    className="h-full w-full object-contain"
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center text-zinc-500">
                                    <Camera className="h-3 w-3" />
                                  </div>
                                )}
                              </div>
                              <div className="text-[11px]">
                                <span className="font-mono text-foreground font-semibold">
                                  {c.aspectRatio || "9:16"}
                                </span>
                                <div className="text-[10px] text-muted-foreground uppercase">
                                  {c.fitMode} Mode
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Sequence Tags */}
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 text-[11px]">
                              <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-mono text-[10px]">
                                {c.introMomentId ? "✓ Intro" : "No Intro"}
                              </span>
                              <span className="text-muted-foreground text-[10px]">➔</span>
                              <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-mono text-[10px]">
                                PNG Frame
                              </span>
                              <span className="text-muted-foreground text-[10px]">➔</span>
                              <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-mono text-[10px]">
                                {c.outroMomentId ? "✓ Outro" : "No Outro"}
                              </span>
                            </div>
                          </td>

                          {/* Videos Rendered */}
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold rounded-md bg-indigo-50/80 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/40">
                              <Video className="h-3 w-3" />
                              <span>{c.totalCompositions || 0}</span>
                            </span>
                          </td>

                          {/* Studio URL */}
                          <td className="px-5 py-3.5 max-w-xs">
                            <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                              <span className="truncate max-w-[160px] select-all">{studioUrl}</span>
                              <button
                                type="button"
                                onClick={() => handleCopyLink(c.slug, c.id)}
                                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                                title="Copy Studio Link"
                              >
                                {copiedId === c.id ? (
                                  <Check className="h-3 w-3 text-emerald-600" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>
                              <a
                                href={`/moments/campaigns/${c.id}/compose`}
                                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                title="Open Studio"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            {getStatusBadge(c.status, c)}
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link href={`/moments/campaigns/${c.id}/compose`}>
                                <Button
                                  size="sm"
                                  className="h-7 text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer px-2"
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
                                <DropdownMenuContent align="end" className="text-xs">
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
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* ── Grid View ─────────────────────────────────────────────────── */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCampaigns.map((c) => (
                <Card
                  key={c.id}
                  className="border-border/60 bg-card shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col justify-between"
                >
                  <CardContent className="p-4 space-y-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 min-w-0">
                        <Link
                          href={`/moments/campaigns/${c.id}/compose`}
                          className="font-bold text-sm text-foreground truncate hover:text-indigo-600 transition-colors block"
                        >
                          {c.title}
                        </Link>
                        <div className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                          <span>slug:</span>
                          <span className="text-indigo-600 dark:text-indigo-400 font-semibold truncate">
                            {c.slug}
                          </span>
                        </div>
                      </div>
                      {getStatusBadge(c.status, c)}
                    </div>

                    {/* Miniature Frame Box */}
                    <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-zinc-950 p-2 flex items-center justify-center border border-border/50">
                      <div className="h-full aspect-[9/16] rounded overflow-hidden border border-white/20 bg-black/60 relative">
                        {c.frameUrl ? (
                          <img
                            src={getPreferredMediaUrl(c.frameUrl)}
                            alt={c.title}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-500">
                            <Camera className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap text-[10px]">
                      <Badge variant="outline" className="font-mono">
                        {c.aspectRatio || "9:16"}
                      </Badge>
                      <span className="font-mono text-muted-foreground">
                        Max {c.maxUserDurationSeconds || 60}s
                      </span>
                    </div>

                    <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Video className="h-3.5 w-3.5 text-indigo-500" />
                        <span className="font-bold text-foreground">{c.totalCompositions || 0}</span> composed
                      </span>

                      <div className="flex items-center gap-1.5">
                        <Link href={`/moments/campaigns/${c.id}/compose`}>
                          <Button size="sm" className="h-7 text-[11px] bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer px-2.5">
                            <Camera className="h-3 w-3 mr-1" /> Open Studio
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
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

      {/* Member Catalog Design & 9:16 Mobile Settings Drawer */}
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
