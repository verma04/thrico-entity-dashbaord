"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import {
  useGetEnterpriseClient,
  useGetEnterpriseLeaderboards,
  useUpdateEnterpriseLeaderboard,
  useDeleteEnterpriseLeaderboard,
  EnterpriseLeaderboardConfig,
  EnterpriseLeaderboardStatus,
  EnterpriseClient,
} from "@/graphql/actions/enterprise-leaderboard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Trophy,
  KeyRound,
  Globe,
  Code2,
  Plus,
  RotateCcw,
  Upload,
  LayoutGrid,
  List as ListIcon,
  Sparkles,
} from "lucide-react";

import { EnterpriseLeaderboardKpiSummary } from "./enterprise-leaderboard-kpi-summary";
import {
  LeaderboardBlueprintsBanner,
  LeaderboardBlueprintsDrawer,
} from "./leaderboard-blueprints";
import { EnterpriseLeaderboardsTable } from "./enterprise-leaderboards-table";
import { CreateLeaderboardDialog, BlueprintPreset } from "./create-leaderboard-dialog";
import { EditLeaderboardDialog } from "./edit-leaderboard-dialog";
import { LeaderboardDetailsModal } from "./leaderboard-details-modal";
import { ExportEnterpriseLeaderboardModal } from "./export-enterprise-leaderboard-modal";
import { ApiCredentialsCard } from "./api-credentials-card";
import { AllowedDomainsCard } from "./allowed-domains-card";
import { EmbedCodeCard } from "./embed-code-card";

export interface EnterpriseLeaderboardHubProps {
  className?: string;
}

export function EnterpriseLeaderboardHub({ className }: EnterpriseLeaderboardHubProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  const activeTab = searchParams.get("tab") || "leaderboards";
  const viewMode = (searchParams.get("view") as "table" | "grid") || "table";
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "ALL");
  const [periodFilter, setPeriodFilter] = useState(searchParams.get("period") || "ALL");
  const [debouncedSearch] = useDebounce(search, 300);

  // Modals & Drawers state
  const [showBlueprintsDrawer, setShowBlueprintsDrawer] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedBlueprint, setSelectedBlueprint] = useState<BlueprintPreset | null>(null);
  const [selectedLeaderboardForEdit, setSelectedLeaderboardForEdit] =
    useState<EnterpriseLeaderboardConfig | null>(null);
  const [selectedLeaderboardForDetails, setSelectedLeaderboardForDetails] =
    useState<EnterpriseLeaderboardConfig | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedEmbedCode, setSelectedEmbedCode] = useState<string | undefined>(undefined);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Queries & Mutations
  const {
    data: clientData,
    loading: clientLoading,
    refetch: refetchClient,
  } = useGetEnterpriseClient({
    notifyOnNetworkStatusChange: true,
  });

  const {
    data: leaderboardsData,
    loading: leaderboardsLoading,
    refetch: refetchLeaderboards,
  } = useGetEnterpriseLeaderboards({
    notifyOnNetworkStatusChange: true,
  });

  const [updateLeaderboardMutation] = useUpdateEnterpriseLeaderboard();
  const [deleteLeaderboardMutation] = useDeleteEnterpriseLeaderboard();

  const client = (clientData?.getEnterpriseClient || null) as EnterpriseClient | null;
  const rawLeaderboards = useMemo(() => {
    return (leaderboardsData?.getEnterpriseLeaderboards ||
      []) as EnterpriseLeaderboardConfig[];
  }, [leaderboardsData]);

  // Local state to support optimistic updates
  const [localLeaderboards, setLocalLeaderboards] =
    useState<EnterpriseLeaderboardConfig[]>([]);

  useEffect(() => {
    if (rawLeaderboards) {
      setLocalLeaderboards(rawLeaderboards);
    }
  }, [rawLeaderboards]);

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
      await Promise.all([refetchClient(), refetchLeaderboards()]);
      toast.success("Leaderboard telemetry refreshed");
    } catch {
      toast.success("Data refreshed");
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // Status toggle handler
  const handleToggleStatus = async (
    lb: EnterpriseLeaderboardConfig,
    nextStatus: EnterpriseLeaderboardStatus
  ) => {
    try {
      await updateLeaderboardMutation({
        variables: {
          id: lb.id,
          input: { status: nextStatus },
        },
      });
      refetchLeaderboards();
      setLocalLeaderboards((prev) =>
        prev.map((item) => (item.id === lb.id ? { ...item, status: nextStatus } : item))
      );
      toast.success(`Leaderboard "${lb.name}" marked as ${nextStatus.toLowerCase()}`);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to update status");
    }
  };

  // Delete handler
  const handleDeleteLeaderboard = async (lb: EnterpriseLeaderboardConfig) => {
    try {
      await deleteLeaderboardMutation({
        variables: { id: lb.id },
      });
      refetchLeaderboards();
      setLocalLeaderboards((prev) => prev.filter((item) => item.id !== lb.id));
      toast.success(`Leaderboard "${lb.name}" archived`);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to delete leaderboard");
    }
  };

  // Filtered leaderboards
  const filteredLeaderboards = useMemo(() => {
    return localLeaderboards.filter((lb) => {
      if (debouncedSearch.trim()) {
        const q = debouncedSearch.toLowerCase().trim();
        const nameMatch = (lb.name || "").toLowerCase().includes(q);
        const codeMatch = (lb.code || "").toLowerCase().includes(q);
        const descMatch = (lb.description || "").toLowerCase().includes(q);
        if (!nameMatch && !codeMatch && !descMatch) return false;
      }
      if (statusFilter !== "ALL") {
        if (lb.status !== statusFilter) return false;
      }
      if (periodFilter !== "ALL") {
        if (lb.periodType !== periodFilter) return false;
      }
      return true;
    });
  }, [localLeaderboards, debouncedSearch, statusFilter, periodFilter]);

  const handleSelectEmbed = (code: string) => {
    setSelectedEmbedCode(code);
    updateParams({ tab: "embed" });
  };

  const handleSelectBlueprint = (blueprint: BlueprintPreset) => {
    setShowBlueprintsDrawer(false);
    setTimeout(() => {
      setSelectedBlueprint(blueprint);
      setShowCreateDialog(true);
    }, 150);
  };

  return (
    <div className={cn("space-y-5", className)}>
      {/* ── KPI Summary Cards ──────────────────────────────────────────────── */}
      <EnterpriseLeaderboardKpiSummary
        leaderboards={localLeaderboards}
        client={client}
        loading={clientLoading || leaderboardsLoading}
        onNavigateTab={(tab) => updateParams({ tab: tab === "leaderboards" ? null : tab })}
      />

      {/* ── Sub Navigation Tabs ────────────────────────────────────────────── */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => updateParams({ tab: val === "leaderboards" ? null : val })}
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
          <TabsList className="bg-muted p-0.5 rounded-lg border border-border h-9">
            <TabsTrigger
              value="leaderboards"
              className="text-xs h-8 px-3.5 gap-2 font-medium"
            >
              <Trophy className="h-3.5 w-3.5" />
              Leaderboards & Engine
              {localLeaderboards.length > 0 && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                  {localLeaderboards.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="credentials"
              className="text-xs h-8 px-3.5 gap-2 font-medium"
            >
              <KeyRound className="h-3.5 w-3.5" />
              API Credentials
            </TabsTrigger>
            <TabsTrigger
              value="domains"
              className="text-xs h-8 px-3.5 gap-2 font-medium"
            >
              <Globe className="h-3.5 w-3.5" />
              Allowed Domains
              {client?.allowedDomains && client.allowedDomains.length > 0 && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                  {client.allowedDomains.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="embed"
              className="text-xs h-8 px-3.5 gap-2 font-medium"
            >
              <Code2 className="h-3.5 w-3.5" />
              Embed & SDK
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer rounded-lg"
              title="Refresh data"
            >
              <RotateCcw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setSelectedBlueprint(null);
                setShowCreateDialog(true);
              }}
              className="h-8 gap-1.5 text-xs font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer shadow-2xs rounded-lg"
            >
              <Plus className="h-3.5 w-3.5" />
              Create Leaderboard
            </Button>
          </div>
        </div>

        {/* ── Tab 1: Leaderboards Hub (Styled like /marketing/utm) ─────────── */}
        <TabsContent value="leaderboards" className="p-0 m-0 space-y-4">
          {/* Action & Filter Bar */}
          <EcosystemActionBar shadow="none">
            <EcosystemActionBar.Group>
              <EcosystemActionBar.Item grow className="max-w-xs">
                <EcosystemActionBar.Search
                  value={search}
                  onChange={setSearch}
                  placeholder="Search by name, code slug, or description…"
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
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>

              {/* Period Filter */}
              <Select
                value={periodFilter}
                onValueChange={(val) => {
                  setPeriodFilter(val);
                  updateParams({ period: val === "ALL" ? null : val });
                }}
              >
                <SelectTrigger className="h-[30px] w-[140px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[12px] font-medium rounded-[4px]">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent className="rounded-[6px]">
                  <SelectItem value="ALL">All Periods</SelectItem>
                  <SelectItem value="DAILY">Daily Blitz</SelectItem>
                  <SelectItem value="WEEKLY">Weekly Sprint</SelectItem>
                  <SelectItem value="MONTHLY">Monthly League</SelectItem>
                  <SelectItem value="QUARTERLY">Quarterly OKR</SelectItem>
                  <SelectItem value="YEARLY">Annual Cup</SelectItem>
                  <SelectItem value="ALL_TIME">Hall of Fame</SelectItem>
                  <SelectItem value="CUSTOM">Custom Dates</SelectItem>
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
                title="Refresh leaderboards"
              >
                <RotateCcw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowBlueprintsDrawer(true)}
                className="h-[30px] gap-1.5 shrink-0 bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 shadow-2xs text-[12px] font-medium text-[#303030] dark:text-zinc-200 px-2.5 rounded-[4px] cursor-pointer hover:border-amber-400"
              >
                <Sparkles className="h-3 w-3 text-amber-500" />
                Blueprints
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
                onClick={() => {
                  setSelectedBlueprint(null);
                  setShowCreateDialog(true);
                }}
                className="h-[30px] gap-1.5 shrink-0 bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs text-[12px] font-semibold px-2.5 rounded-[4px] cursor-pointer hover:bg-[#202020]"
              >
                <Plus className="h-3 w-3" />
                Create Leaderboard
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

              <EcosystemActionBar.Status
                active={leaderboardsLoading || filteredLeaderboards.length > 0}
              >
                {leaderboardsLoading
                  ? "Fetching leaderboards…"
                  : `Showing ${filteredLeaderboards.length} of ${localLeaderboards.length} Leaderboards`}
              </EcosystemActionBar.Status>
            </EcosystemActionBar.Group>
          </EcosystemActionBar>

          {/* Quick Access Blueprint Banner */}
          <LeaderboardBlueprintsBanner onClick={() => setShowBlueprintsDrawer(true)} />

          {/* Table or Grid View */}
          <EnterpriseLeaderboardsTable
            leaderboards={filteredLeaderboards}
            client={client}
            loading={leaderboardsLoading}
            viewMode={viewMode}
            onCreateNew={() => {
              setSelectedBlueprint(null);
              setShowCreateDialog(true);
            }}
            onSelectEmbed={handleSelectEmbed}
            onInspectLeaderboard={(lb) => setSelectedLeaderboardForDetails(lb)}
            onEditLeaderboard={(lb) => setSelectedLeaderboardForEdit(lb)}
            onToggleStatus={handleToggleStatus}
            onDeleteLeaderboard={handleDeleteLeaderboard}
          />
        </TabsContent>

        {/* ── Tab 2: API Credentials & Security ───────────────────────────── */}
        <TabsContent value="credentials" className="p-0 m-0">
          <ApiCredentialsCard client={client} loading={clientLoading} />
        </TabsContent>

        {/* ── Tab 3: Allowed Domains (CORS) ───────────────────────────────── */}
        <TabsContent value="domains" className="p-0 m-0">
          <AllowedDomainsCard client={client} loading={clientLoading} />
        </TabsContent>

        {/* ── Tab 4: Embed & Headless SDK ─────────────────────────────────── */}
        <TabsContent value="embed" className="p-0 m-0">
          <EmbedCodeCard
            client={client}
            leaderboards={localLeaderboards}
            selectedCode={selectedEmbedCode}
          />
        </TabsContent>
      </Tabs>

      {/* ── Drawers & Modals ──────────────────────────────────────────────── */}
      {/* 1. Blueprints Drawer */}
      <LeaderboardBlueprintsDrawer
        open={showBlueprintsDrawer}
        onOpenChange={setShowBlueprintsDrawer}
        onSelectBlueprint={handleSelectBlueprint}
      />

      {/* 2. Create Leaderboard Modal */}
      <CreateLeaderboardDialog
        open={showCreateDialog}
        onOpenChange={(open) => {
          setShowCreateDialog(open);
          if (!open) setSelectedBlueprint(null);
        }}
        initialBlueprintId={selectedBlueprint?.id}
        onSuccess={() => refetchLeaderboards()}
      />

      {/* 3. Edit Leaderboard Modal */}
      <EditLeaderboardDialog
        leaderboard={selectedLeaderboardForEdit}
        open={!!selectedLeaderboardForEdit}
        onOpenChange={(open) => !open && setSelectedLeaderboardForEdit(null)}
        onSuccess={() => refetchLeaderboards()}
      />

      {/* 4. Leaderboard Details & Preview Modal */}
      <LeaderboardDetailsModal
        leaderboard={selectedLeaderboardForDetails}
        client={client}
        open={!!selectedLeaderboardForDetails}
        onOpenChange={(open) => !open && setSelectedLeaderboardForDetails(null)}
        onEdit={(lb) => {
          setSelectedLeaderboardForDetails(null);
          setSelectedLeaderboardForEdit(lb);
        }}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDeleteLeaderboard}
        onSelectEmbed={handleSelectEmbed}
      />

      {/* 5. Export Leaderboards Modal */}
      <ExportEnterpriseLeaderboardModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        leaderboards={filteredLeaderboards}
      />
    </div>
  );
}

export default EnterpriseLeaderboardHub;
