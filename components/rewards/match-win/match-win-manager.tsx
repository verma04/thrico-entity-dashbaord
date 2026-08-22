"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import {
  Sparkles,
  Plus,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  Zap,
  Eye,
  Percent,
  Coins,
  Layers,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CtaButton } from "@/components/ui/cta-button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";

import {
  useGetMatchWinData,
  useUpdateMatchWinConfig,
  useDeleteMatchWinCombination,
  useUpsertMatchWinCombination,
  useInitializeMatchWinConfig,
} from "@/graphql/actions/rewards";
import { useGetEntityCurrencyConfig } from "@/graphql/actions/currency";

import {
  MatchWinCombination,
  MatchWinSymbol,
  DEFAULT_SLOT_SYMBOLS,
  resolveGameRewardType,
} from "./types";
import {
  STATUS_TABS,
  REWARD_TYPE_FILTER_OPTIONS,
  getRewardTypeFilterOptions,
  SORT_OPTIONS,
  SectionHeader,
  ContentArea,
} from "./match-win-manage-ui";
import { MatchWinPreviewModal } from "./match-win-preview-modal";
import { SymbolsSheet } from "./symbols-sheet";
import { getMatchWinTableColumns } from "./match-win-list";

interface MatchWinManagerProps {
  initialStatus?: string;
}

export function MatchWinManager({ initialStatus = "ALL" }: MatchWinManagerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    data: gameData,
    loading: configLoading,
    refetch: refetchData,
  } = useGetMatchWinData();

  const { data: currencyConfig } = useGetEntityCurrencyConfig();
  const currencyName =
    currencyConfig?.getEntityCurrencyConfig?.currencyName || "Points";

  const [updateConfig, { loading: savingConfig }] = useUpdateMatchWinConfig();
  const [deleteCombination, { loading: deletingComb }] =
    useDeleteMatchWinCombination();

  // Master Engine parameters
  const config = gameData?.getMatchWinConfig;
  const dbSymbols: MatchWinSymbol[] = config?.symbols || DEFAULT_SLOT_SYMBOLS;
  const dbCombinations: MatchWinCombination[] = config?.combinations || [];

  const [isActive, setIsActive] = useState(false);
  const [costPerPlay, setCostPerPlay] = useState(25);
  const [maxPlaysPerDay, setMaxPlaysPerDay] = useState(3);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (config && !initialized) {
      setIsActive(config.isActive ?? false);
      setCostPerPlay(config.costPerPlay ?? 25);
      setMaxPlaysPerDay(config.maxPlaysPerDay ?? 3);
      setInitialized(true);
    }
  }, [config, initialized]);

  // ── URL parameter updates helper ──────────────────────────────────────────
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (
          value === null ||
          value === "" ||
          value === "ALL" ||
          value === "all" ||
          value === "0" ||
          value === "grid" ||
          value === "newest"
        ) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  // ── Derive state from URL search params ───────────────────────────────────
  // ── Derive state from URL search params ───────────────────────────────────
  const status = searchParams.get("status") || initialStatus || "ALL";
  const rewardType = searchParams.get("type") || "ALL";
  const sortBy = searchParams.get("sort") || "newest";
  const viewMode = (searchParams.get("view") as "grid" | "list") || "grid";

  // Search input state with debounce
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  // Sync debounced search to URL only when changed
  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (debouncedSearch.trim() !== currentQ) {
      updateParams({ q: debouncedSearch.trim() || null });
    }
  }, [debouncedSearch, searchParams, updateParams]);

  // Modals & Sheets
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSymbolsSheetOpen, setIsSymbolsSheetOpen] = useState(false);
  const [deletingCombinationId, setDeletingCombinationId] = useState<string | null>(
    null,
  );

  // Column visibility for List view
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    serial: true,
    combination: true,
    rewardType: true,
    value: true,
    probability: true,
    maxWins: true,
    actions: true,
  });

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ── Setters ───────────────────────────────────────────────────────────────
  const setStatus = (v: string) =>
    updateParams({ status: v === "ALL" ? null : v });

  const setRewardType = (v: string) =>
    updateParams({ type: v === "ALL" ? null : v });

  const setSortBy = (v: string) =>
    updateParams({ sort: v === "newest" ? null : v });

  const setView = (v: "grid" | "list") =>
    updateParams({ view: v === "grid" ? null : v });

  // ── Parse raw combinations ──────────────────────────────────────────────
  const combinations: MatchWinCombination[] = useMemo(() => {
    if (!dbCombinations || !Array.isArray(dbCombinations)) return [];
    return dbCombinations.map((c: any) => {
      const uiType = resolveGameRewardType(c || {});
      return {
        id: c?.id,
        configId: c?.configId,
        key: c?.key || "combination",
        type: uiType as any,
        value: c?.value ?? 0,
        probability: c?.probability ?? 10,
        maxWins: c?.maxWins,
        symbol1Id: c?.symbol1?.id || c?.symbol1Id,
        symbol2Id: c?.symbol2?.id || c?.symbol2Id,
        symbol3Id: c?.symbol3?.id || c?.symbol3Id,
        symbol1: c?.symbol1,
        symbol2: c?.symbol2,
        symbol3: c?.symbol3,
        storeDiscountRuleId: c?.storeDiscountRuleId,
        manualBatchId: c?.manualBatchId,
        digitalCardRuleId: c?.digitalCardRuleId,
        storeDiscountRule: c?.storeDiscountRule,
        manualBatch: c?.manualBatch,
        digitalCardRule: c?.digitalCardRule,
        mechanism: c?.mechanism,
        rewardId: c?.rewardId,
        giftCardBrand: c?.giftCardBrand,
        giftCardProductId: c?.giftCardProductId,
        giftCardDenomination: c?.giftCardDenomination,
        ecommerceDiscountType: c?.ecommerceDiscountType,
        ecommerceDiscountValue: c?.ecommerceDiscountValue,
        ecommerceTitle: c?.ecommerceTitle,
      };
    });
  }, [dbCombinations]);

  // Economic calculations
  const totalProbability = useMemo(() => {
    return combinations.reduce((sum, c) => sum + (c.probability || 0), 0);
  }, [combinations]);

  const isProbBalanced = Math.abs(totalProbability - 100) < 0.1;

  const avgPayout = useMemo(() => {
    if (combinations.length === 0) return 0;
    const totalP = totalProbability || 100;
    return combinations.reduce((sum, c) => {
      const weight = (c.probability || 0) / totalP;
      const val = c.type === "COINS" || c.type === "TC" ? c.value : 0;
      return sum + val * weight;
    }, 0);
  }, [combinations, totalProbability]);

  // ── Filter and Sort Combinations ──────────────────────────────────────────
  const filteredCombinations = useMemo(() => {
    let list = [...combinations];

    // Status filter
    if (status === "ACTIVE") {
      list = list.filter((c) => c.type !== "NO_REWARDS");
    } else if (status === "INACTIVE") {
      list = list.filter((c) => c.type === "NO_REWARDS");
    }

    // Reward Type filter
    if (rewardType !== "ALL") {
      list = list.filter((c) => {
        if (rewardType === "COINS") return c.type === "COINS" || c.type === "TC";
        if (rewardType === "GIFT_CARD") return c.type === "GIFT_CARD";
        if (rewardType === "ECOMMERCE") return c.type === "ECOMMERCE";
        if (rewardType === "INTERNAL_VOUCHER")
          return c.type === "INTERNAL_VOUCHER" || c.type === "VOUCHER";
        if (rewardType === "NO_REWARDS")
          return c.type === "NO_REWARDS" || c.type === "NOTHING";
        return true;
      });
    }

    // Search filter
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.key?.toLowerCase().includes(q) ||
          c.symbol1?.label?.toLowerCase().includes(q) ||
          c.symbol2?.label?.toLowerCase().includes(q) ||
          c.symbol3?.label?.toLowerCase().includes(q) ||
          c.storeDiscountRule?.title?.toLowerCase().includes(q) ||
          c.manualBatch?.name?.toLowerCase().includes(q) ||
          c.digitalCardRule?.title?.toLowerCase().includes(q) ||
          c.id?.toLowerCase().includes(q),
      );
    }

    // Sorting
    return list.sort((a: any, b: any) => {
      switch (sortBy) {
        case "newest":
          return (b.id || "").localeCompare(a.id || "");
        case "oldest":
          return (a.id || "").localeCompare(b.id || "");
        case "key":
          return (a.key || "").localeCompare(b.key || "");
        case "prob-desc":
          return (b.probability ?? 0) - (a.probability ?? 0);
        case "prob-asc":
          return (a.probability ?? 0) - (b.probability ?? 0);
        case "value-desc":
          return (b.value ?? 0) - (a.value ?? 0);
        case "value-asc":
          return (a.value ?? 0) - (b.value ?? 0);
        default:
          return 0;
      }
    });
  }, [combinations, status, rewardType, debouncedSearch, sortBy]);

  // ── Engine Parameters Update Handler ──────────────────────────────────────
  const handleToggleEngineActive = async (active: boolean) => {
    setIsActive(active);
    try {
      await updateConfig({
        variables: {
          input: {
            isActive: active,
            costPerPlay: Number(costPerPlay),
            maxPlaysPerDay: Number(maxPlaysPerDay),
          },
        },
      });
      toast.success(
        active ? "Match & Win Game is now LIVE" : "Match & Win Game is PAUSED",
      );
      refetchData();
    } catch (err: any) {
      setIsActive(!active);
      toast.error(err?.message || "Failed to update engine status");
    }
  };

  const handleUpdateConfigParams = async (
    newCost?: number,
    newMaxPlays?: number,
  ) => {
    const cost = newCost !== undefined ? newCost : costPerPlay;
    const plays = newMaxPlays !== undefined ? newMaxPlays : maxPlaysPerDay;
    try {
      await updateConfig({
        variables: {
          input: {
            isActive,
            costPerPlay: Number(cost),
            maxPlaysPerDay: Number(plays),
          },
        },
      });
      toast.success("Game parameters updated");
      refetchData();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update settings");
    }
  };

  const handleDeleteCombination = async () => {
    if (!deletingCombinationId) return;
    try {
      await deleteCombination({
        variables: { id: deletingCombinationId },
      });
      toast.success("Combination deleted successfully");
      refetchData();
      setDeletingCombinationId(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete combination");
    }
  };

  const availableColumns = useMemo(
    () =>
      getMatchWinTableColumns(
        undefined,
        (id) => setDeletingCombinationId(id),
        currencyName,
      ),
    [currencyName],
  );

  const pageTitle =
    status === "ALL"
      ? "Match & Win Slot Game"
      : `${status.charAt(0) + status.slice(1).toLowerCase()} Combinations`;

  return (
    <EcosystemWrapper className="gap-6">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <EcosystemHeader
        title={pageTitle}
        badgeText="Engagement Game"
        description="Configure 3-reel slot matching combinations, winning probabilities, spin costs, and member daily limits."
        icon={Sparkles}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification/points-and-badges" },
          { label: "Rewards", href: "/gamification/rewards" },
          {
            label: "Engagement Games",
            href: "/gamification/rewards/engagement-games",
          },
          { label: "Match & Win" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsSymbolsSheetOpen(true)}
              className="h-8 gap-1.5 bg-card border-border shadow-2xs text-xs font-semibold"
            >
              <Layers className="h-3.5 w-3.5" />
              Reel Symbols ({dbSymbols.length})
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsPreviewOpen(true)}
              className="h-8 gap-1.5 bg-card border-border shadow-2xs text-xs font-semibold"
            >
              <Eye className="h-3.5 w-3.5" />
              Live Simulation & Odds
            </Button>
            <CtaButton asChild>
              <Link href="/gamification/rewards/engagement-games/match-win/create">
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Combination
              </Link>
            </CtaButton>
          </div>
        }
      />

      {/* ── Master Engine Status & Parameters Strip ───────────────────────── */}
      <div className="space-y-4 px-3">
        <div className="rounded-xl border border-border bg-card p-3.5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-2xs">
          {/* Left: Engine Live status */}
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "h-9 w-9 rounded-lg flex items-center justify-center shrink-0 border transition-colors",
                isActive
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                  : "bg-muted text-muted-foreground border-border",
              )}
            >
              <Zap className="h-4 w-4" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">
                  Match & Win Engine
                </span>
                <span
                  className={cn(
                    "text-[10px] font-bold px-1.5 py-0.2 rounded border uppercase tracking-wider",
                    isActive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800"
                      : "bg-muted text-muted-foreground border-border",
                  )}
                >
                  {isActive ? "Live" : "Paused"}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {isActive
                  ? "Members can actively spend points to spin the 3-reel slot machine and win matching prizes."
                  : "The Match & Win slot game is currently paused for all members."}
              </p>
            </div>
          </div>

          {/* Center & Right: Game Economics & Settings */}
          <div className="flex items-center gap-4 flex-wrap self-stretch lg:self-center justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-border/40">
            {/* Probability Status */}
            <div
              onClick={() => setIsPreviewOpen(true)}
              className={cn(
                "cursor-pointer px-2.5 py-1 rounded-lg border flex items-center gap-1.5 text-xs font-medium transition-colors",
                isProbBalanced
                  ? "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 text-emerald-700 dark:text-emerald-400"
                  : "bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 text-amber-700 dark:text-amber-400",
              )}
              title="Click to view full economic calibration"
            >
              <Percent className="h-3.5 w-3.5" />
              <span className="font-mono font-bold">
                {totalProbability.toFixed(1)}%
              </span>
              <span className="text-[11px] text-muted-foreground hidden sm:inline">
                {isProbBalanced ? "Calibrated" : "Unbalanced"}
              </span>
            </div>

            {/* Cost Per Play */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground font-medium">
                Cost / Spin:
              </span>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  min={0}
                  value={costPerPlay}
                  onChange={(e) => setCostPerPlay(Number(e.target.value))}
                  onBlur={() => handleUpdateConfigParams(costPerPlay)}
                  className="h-7 w-16 text-xs text-center font-bold bg-background border-border font-mono p-1"
                />
                <span className="text-[10px] text-muted-foreground font-medium uppercase">
                  {currencyName}
                </span>
              </div>
            </div>

            {/* Daily Limit */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground font-medium">
                Daily Limit:
              </span>
              <Input
                type="number"
                min={0}
                value={maxPlaysPerDay}
                onChange={(e) => setMaxPlaysPerDay(Number(e.target.value))}
                onBlur={() => handleUpdateConfigParams(undefined, maxPlaysPerDay)}
                className="h-7 w-14 text-xs text-center font-bold bg-background border-border font-mono p-1"
              />
            </div>

            {/* Master Engine Switch */}
            <div className="flex items-center gap-2 pl-2 border-l border-border/60">
              <Switch
                checked={isActive}
                onCheckedChange={handleToggleEngineActive}
                disabled={savingConfig}
                aria-label="Toggle Match & Win Game Status"
              />
              <span className="text-xs font-semibold text-foreground">
                {isActive ? "Engine Active" : "Paused"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Container: Action Bar & Content Area ──────────────────────── */}
      <EcosystemContainer className="space-y-4">
        {/* Action Bar */}
        <EcosystemActionBar shadow="none">
          {/* Search */}
          <EcosystemActionBar.Group>
            <EcosystemActionBar.Item grow className="w-full sm:w-60">
              <EcosystemActionBar.Search
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search by combination key, symbol, rule…"
              />
            </EcosystemActionBar.Item>
          </EcosystemActionBar.Group>

          <EcosystemActionBar.Separator />

          {/* Filters Group */}
          <EcosystemActionBar.Group>
            {/* Reward Type Filter */}
            <EcosystemActionBar.Item>
              <Select value={rewardType} onValueChange={(v) => setRewardType(v)}>
                <SelectTrigger className="w-[155px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                  <SelectValue placeholder="Reward Type" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[170px]">
                  {getRewardTypeFilterOptions(currencyName).map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </EcosystemActionBar.Item>

            {/* Status Filter */}
            <EcosystemActionBar.Item>
              <Select value={status} onValueChange={(v) => setStatus(v)}>
                <SelectTrigger className="w-[130px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                  <div className="flex items-center gap-2">
                    {STATUS_TABS.find((t) => t.value === status)?.dot && (
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full shrink-0",
                          STATUS_TABS.find((t) => t.value === status)?.dot,
                        )}
                      />
                    )}
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[145px]">
                  {STATUS_TABS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        {opt.dot && (
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full shrink-0",
                              opt.dot,
                            )}
                          />
                        )}
                        {opt.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </EcosystemActionBar.Item>

            {/* Sort Filter */}
            <EcosystemActionBar.Item>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v)}>
                <SelectTrigger className="w-[145px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[175px]">
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </EcosystemActionBar.Item>
          </EcosystemActionBar.Group>

          {/* Right controls */}
          <EcosystemActionBar.Group align="right">
            {/* Columns Toggle for List View */}
            {viewMode === "list" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                  <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1.5">
                    Toggle Columns
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {availableColumns
                    .filter((c) => c.key !== "actions")
                    .map((col) => (
                      <DropdownMenuCheckboxItem
                        key={col.key}
                        checked={visibleColumns[col.key] !== false}
                        onCheckedChange={() => toggleColumn(col.key)}
                        className="text-xs font-medium cursor-pointer"
                      >
                        {typeof col.header === "string" ? col.header : col.key}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* View Toggle */}
            <EcosystemActionBar.ViewToggle
              value={viewMode}
              onChange={(v) => setView(v as "grid" | "list")}
              options={[
                { id: "grid", label: "Grid", icon: LayoutGrid },
                { id: "list", label: "List", icon: ListIcon },
              ]}
            />
          </EcosystemActionBar.Group>
        </EcosystemActionBar>

        {/* Status Section Header */}
        <SectionHeader
          status={status}
          count={filteredCombinations.length}
          loading={configLoading}
        />

        {/* Content Area (Grid or List) */}
        <ContentArea
          view={viewMode}
          loading={configLoading}
          combinations={filteredCombinations}
          currencyName={currencyName}
          onDelete={(id) => setDeletingCombinationId(id)}
          visibleColumns={visibleColumns}
        />
      </EcosystemContainer>

      {/* ── Preview Simulator Modal ────────────────────────────────────────── */}
      <MatchWinPreviewModal
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        combinations={combinations}
        symbols={dbSymbols}
        costPerPlay={costPerPlay}
        maxPlaysPerDay={maxPlaysPerDay}
        currencyName={currencyName}
        isActive={isActive}
      />

      {/* ── Symbols Manager Sheet ─────────────────────────────────────────── */}
      <SymbolsSheet
        open={isSymbolsSheetOpen}
        onOpenChange={setIsSymbolsSheetOpen}
        symbols={dbSymbols}
        configId={config?.id}
        onRefetch={refetchData}
      />

      {/* ── Delete Confirmation Dialog ────────────────────────────────────── */}
      <Dialog
        open={Boolean(deletingCombinationId)}
        onOpenChange={(open) => {
          if (!open) setDeletingCombinationId(null);
        }}
      >
        <DialogContent className="max-w-sm rounded-xl border-border bg-card p-5 shadow-lg">
          <DialogHeader className="space-y-2">
            <div className="h-9 w-9 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
              <AlertCircle className="h-5 w-5" />
            </div>
            <DialogTitle className="text-base font-bold text-foreground">
              Delete Combination Rule
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to delete this winning combination? This will permanently remove it from the 3-reel slot machine payout table.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeletingCombinationId(null)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteCombination}
              disabled={deletingComb}
              className="text-xs font-bold"
            >
              {deletingComb ? "Deleting..." : "Delete Combination"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </EcosystemWrapper>
  );
}

export default MatchWinManager;
