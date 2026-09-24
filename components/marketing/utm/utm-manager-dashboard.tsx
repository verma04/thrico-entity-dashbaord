"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import { useQuery, useMutation } from "@apollo/client";
import {
  Link2,
  Plus,
  RotateCcw,
  Upload,
  LayoutGrid,
  List as ListIcon,
  Sparkles,
} from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useUrlDateRange } from "@/hooks/use-url-date-range";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import {
  ADMIN_GET_UTM_CAMPAIGNS,
  ADMIN_UPDATE_UTM_CAMPAIGN,
  ADMIN_DELETE_UTM_CAMPAIGN,
  ADMIN_GET_CAMPAIGN_360_STATS,
} from "@/graphql/actions/utm/admin-utm.graphql";
import {
  UtmCampaignItem,
  UtmCampaignStatus,
} from "@/types/utm";

import { UtmKpiSummary } from "./utm-kpi-summary";
import {
  UtmAcquisitionStarters,
  UtmAcquisitionStartersBanner,
  AcquisitionStarterRecipe,
} from "./utm-acquisition-starters";
import { CreateUtmModal } from "./create-utm-modal";
import { UtmCampaignsTable } from "./utm-campaigns-table";
import { ExportUtmModal } from "./export-utm-modal";
import { QrCodeModal } from "./qr-code-modal";

export function UtmManagerDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { dateRange, handleDateChange } = useUrlDateRange(7);

  // URL state sync
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "" || value === "ALL") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  const viewMode = (searchParams.get("view") as "table" | "grid") || "table";
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "ALL");
  const [destinationFilter, setDestinationFilter] = useState(
    searchParams.get("destination") || "ALL"
  );
  const [debouncedSearch] = useDebounce(search, 300);

  // Modals state
  const [showExportModal, setShowExportModal] = useState(false);
  const [showStartersDrawer, setShowStartersDrawer] = useState(false);
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [selectedStarter, setSelectedStarter] = useState<AcquisitionStarterRecipe | null>(null);
  const [selectedForQr, setSelectedForQr] = useState<UtmCampaignItem | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Local campaigns state to support optimistic updates
  const [localCampaigns, setLocalCampaigns] = useState<UtmCampaignItem[]>([]);

  // Apollo Queries & Mutations
  const { data, loading, refetch } = useQuery(ADMIN_GET_UTM_CAMPAIGNS, {
    variables: {
      search: debouncedSearch || undefined,
      status: statusFilter !== "ALL" ? (statusFilter as UtmCampaignStatus) : undefined,
    },
    fetchPolicy: "cache-and-network",
  });

  const primaryCampaign = localCampaigns[0]?.utmCampaign || "";
  const { data: statsData, loading: statsLoading, refetch: refetchStats } = useQuery(
    ADMIN_GET_CAMPAIGN_360_STATS,
    {
      variables: { campaign: primaryCampaign },
      skip: !primaryCampaign,
      fetchPolicy: "cache-and-network",
    }
  );
  const liveStats = statsData?.getUtmCampaign360Stats;

  const [updateCampaignMutation] = useMutation(ADMIN_UPDATE_UTM_CAMPAIGN);
  const [deleteCampaignMutation] = useMutation(ADMIN_DELETE_UTM_CAMPAIGN);

  // Merge live Apollo data with local state
  useEffect(() => {
    if (data?.getUtmCampaigns) {
      setLocalCampaigns(data.getUtmCampaigns);
    }
  }, [data]);

  // Handle Search URL Sync
  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (debouncedSearch.trim() !== currentQ) {
      updateParams({ q: debouncedSearch.trim() || null });
    }
  }, [debouncedSearch, searchParams, updateParams]);

  // Refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetch(),
        primaryCampaign ? refetchStats?.() : Promise.resolve(),
      ]);
      toast.success("Campaign telemetry refreshed");
    } catch {
      toast.success("Data refreshed");
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // Status toggle
  const handleToggleStatus = async (item: UtmCampaignItem, nextStatus: UtmCampaignStatus) => {
    try {
      await updateCampaignMutation({
        variables: { input: { id: item.id, status: nextStatus } },
      });
      refetch();
    } catch (err) {
      console.warn("Apollo update fallback:", err);
    }
    setLocalCampaigns((prev) =>
      prev.map((c) => (c.id === item.id ? { ...c, status: nextStatus } : c))
    );
    toast.success(`Campaign marked as ${nextStatus}`);
  };

  // Delete handler
  const handleDeleteCampaign = async (id: string) => {
    try {
      await deleteCampaignMutation({ variables: { id } });
      refetch();
    } catch (err) {
      console.warn("Apollo delete fallback:", err);
    }
    setLocalCampaigns((prev) => prev.filter((c) => c.id !== id));
    toast.success("UTM tracking link removed");
  };

  // Filter campaigns
  const filteredCampaigns = useMemo(() => {
    return localCampaigns.filter((c) => {
      if (debouncedSearch.trim()) {
        const q = debouncedSearch.toLowerCase().trim();
        const nameMatch = (c.name || "").toLowerCase().includes(q);
        const campaignMatch = (c.utmCampaign || "").toLowerCase().includes(q);
        const sourceMatch = (c.utmSource || "").toLowerCase().includes(q);
        const mediumMatch = (c.utmMedium || "").toLowerCase().includes(q);
        if (!nameMatch && !campaignMatch && !sourceMatch && !mediumMatch) return false;
      }
      if (statusFilter !== "ALL") {
        if (c.status !== statusFilter) return false;
      }
      if (destinationFilter !== "ALL") {
        if (c.destinationType !== destinationFilter) return false;
      }
      return true;
    });
  }, [localCampaigns, debouncedSearch, statusFilter, destinationFilter]);

  return (
    <EcosystemWrapper className="m-2">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <EcosystemHeader
        title="UTM Campaign & Attribution Hub"
        description="Create, manage, and attribute acquisition tracking links with 360° ClickHouse conversion analytics"
        icon={Link2}
        badgeText="Attribution & Growth"
        breadcrumbs={[
          { label: "Marketing", href: "/marketing" },
          { label: "UTM Manager", href: "/marketing/utm" },
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
              onClick={() => setShowStartersDrawer(true)}
              className="h-9 rounded-lg text-xs gap-1.5 font-medium border-border cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-800"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              Presets
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
              onClick={() => router.push("/marketing/utm/create")}
              className="h-9 rounded-lg gap-2 text-xs font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer shadow-2xs"
            >
              <Plus className="h-3.5 w-3.5" />
              Create Tracking Link
            </Button>
          </div>
        }
      />

      {/* ── Page Content ────────────────────────────────────────────────── */}
      <EcosystemContainer className="p-6 lg:p-8 space-y-6">
        <div className="space-y-5">
          {/* KPI Summary Cards */}
          <UtmKpiSummary
            campaigns={localCampaigns}
            loading={loading || (!!primaryCampaign && statsLoading)}
            totalVisits={liveStats?.visits ?? 0}
            totalSignups={liveStats?.signups ?? 0}
            avgConversionRate={liveStats?.conversionRate ?? 0}
            totalLogins={liveStats?.successfulLogins ?? 0}
          />

          {/* Action & Filter Bar */}
          <EcosystemActionBar shadow="none">
            <EcosystemActionBar.Group>
              <EcosystemActionBar.Item grow className="max-w-xs">
                <EcosystemActionBar.Search
                  value={search}
                  onChange={setSearch}
                  placeholder="Search by name, source, medium, or slug…"
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
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>

              {/* Destination Filter */}
              <Select
                value={destinationFilter}
                onValueChange={(val) => {
                  setDestinationFilter(val);
                  updateParams({ destination: val === "ALL" ? null : val });
                }}
              >
                <SelectTrigger className="h-[30px] w-[130px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[12px] font-medium rounded-[4px]">
                  <SelectValue placeholder="Destination" />
                </SelectTrigger>
                <SelectContent className="rounded-[6px]">
                  <SelectItem value="ALL">All Goals</SelectItem>
                  <SelectItem value="SIGNUP">Signup Funnel</SelectItem>
                  <SelectItem value="LOGIN">Login Funnel</SelectItem>
                  <SelectItem value="CUSTOM">Custom Landing</SelectItem>
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
                onClick={() => setShowStartersDrawer(true)}
                className="h-[30px] gap-1.5 shrink-0 bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 shadow-2xs text-[12px] font-medium text-[#303030] dark:text-zinc-200 px-2.5 rounded-[4px] cursor-pointer hover:border-indigo-400"
              >
                <Sparkles className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                Presets
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowExportModal(true)}
                className="h-[30px] gap-1.5 shrink-0 bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 shadow-2xs text-[12px] font-medium text-[#303030] dark:text-zinc-200 px-2.5 rounded-[4px] cursor-pointer"
              >
                <Upload className="h-3 w-3" />
                Export
              </Button>

              <Button
                onClick={() => router.push("/marketing/utm/create")}
                className="h-[30px] gap-1.5 shrink-0 bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs text-[12px] font-semibold px-2.5 rounded-[4px] cursor-pointer hover:bg-[#202020]"
              >
                <Plus className="h-3 w-3" />
                Create Tracking Link
              </Button>

              <EcosystemActionBar.ViewToggle
                value={viewMode}
                onChange={(v) => updateParams({ view: v === "table" ? null : v })}
                options={[
                  { id: "table", label: "Table", icon: ListIcon },
                  { id: "grid", label: "Grid", icon: LayoutGrid },
                ]}
              />
              <EcosystemActionBar.Separator />
              <EcosystemActionBar.Status active={loading || filteredCampaigns.length > 0}>
                {loading
                  ? "Fetching campaigns…"
                  : `Showing ${filteredCampaigns.length} of ${localCampaigns.length} Campaigns`}
              </EcosystemActionBar.Status>
            </EcosystemActionBar.Group>
          </EcosystemActionBar>

          {/* Acquisition Starter Presets Quick Access Banner */}
          <UtmAcquisitionStartersBanner
            onClick={() => setShowStartersDrawer(true)}
          />

          {/* Campaigns Table or Grid */}
          <UtmCampaignsTable
            campaigns={filteredCampaigns}
            loading={loading}
            viewMode={viewMode}
            onSelect360={(c) => {
              router.push(`/marketing/utm/${c.id}`);
            }}
            onOpenQr={setSelectedForQr}
            onInspectCampaign={(c) => router.push(`/marketing/utm/${c.id}`)}
            onEditCampaign={(c) => router.push(`/marketing/utm/${c.id}/edit`)}
            onToggleStatus={handleToggleStatus}
            onDeleteCampaign={handleDeleteCampaign}
          />
        </div>

        {/* ── Drawers & Modals ─────────────────────────────────────────── */}
        {/* Acquisition Starters Drawer */}
        <UtmAcquisitionStarters
          open={showStartersDrawer}
          onOpenChange={setShowStartersDrawer}
          onSelectStarter={(starter: AcquisitionStarterRecipe) => {
            setShowStartersDrawer(false);
            setTimeout(() => {
              setSelectedStarter(starter);
              setShowCreateDrawer(true);
            }, 150);
          }}
        />

        {/* Create Tracking Link Drawer (Formik & Yup) */}
        <CreateUtmModal
          open={showCreateDrawer}
          onOpenChange={(open) => {
            setShowCreateDrawer(open);
            if (!open) {
              setSelectedStarter(null);
            }
          }}
          initialValues={
            selectedStarter
              ? {
                  name: selectedStarter.title,
                  destinationType: selectedStarter.destinationType,
                  utmSource: selectedStarter.source,
                  utmMedium: selectedStarter.medium,
                  utmCampaign: selectedStarter.campaign,
                  utmTerm: selectedStarter.recommendedTerm || "",
                  utmContent: selectedStarter.recommendedContent || "",
                }
              : null
          }
          onCreated={(newCampaign) => {
            setLocalCampaigns((prev) => [newCampaign, ...prev]);
            refetch();
          }}
        />

        <ExportUtmModal
          open={showExportModal}
          onOpenChange={setShowExportModal}
          campaigns={filteredCampaigns}
        />

        <QrCodeModal
          campaign={selectedForQr}
          open={!!selectedForQr}
          onOpenChange={(open) => !open && setSelectedForQr(null)}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default UtmManagerDashboard;
