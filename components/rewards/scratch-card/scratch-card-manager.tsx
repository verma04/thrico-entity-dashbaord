"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import {
  RectangleHorizontal,
  Plus,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  Sparkles,
  Zap,
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
import { Button } from "@/components/ui/button";
import { CtaButton } from "@/components/ui/cta-button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useModuleStore } from "@/store/useModuleStore";

import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { Pagination } from "@/components/shared/admin-table/admin-table";
import { InlineAlert } from "@/components/ui/inline-alert";
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
  useGetScratchCardConfig,
  useGetScratchCardPrizes,
  useUpdateScratchCardConfig,
  useCreateScratchCardPrize,
  useUpdateScratchCardPrize,
  useDeleteScratchCardPrize,
  useLazyGetVouchersByRewardMechanism,
} from "@/graphql/actions/rewards";
import { useGetEntityCurrencyConfig } from "@/graphql/actions/currency";

import {
  STATUS_TABS,
  REWARD_TYPE_FILTER_OPTIONS,
  getRewardTypeFilterOptions,
  ELIGIBILITY_FILTER_OPTIONS,
  SORT_OPTIONS,
  SectionHeader,
  ContentArea,
} from "./scratch-card-manage-ui";
import { getScratchCardTableColumns } from "./scratch-card-list";
import { ScratchRewardTier, resolveGameRewardType } from "./types";
import { TierDialog } from "./tier-dialog";

export interface ScratchCardManagerProps {
  status?: string;
}

export function ScratchCardManager({ status: initialStatus }: ScratchCardManagerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rewardsModuleName = useModuleStore((state) => state.rewardsModuleName || "Rewards");

  // ── GraphQL Hooks ─────────────────────────────────────────────────────────
  const {
    data: configData,
    refetch: refetchConfig,
    loading: configLoading,
  } = useGetScratchCardConfig();
  const {
    data: prizesData,
    refetch: refetchPrizes,
    loading: prizesLoading,
  } = useGetScratchCardPrizes();
  const { data: currencyConfig } = useGetEntityCurrencyConfig();
  const currencyName =
    currencyConfig?.getEntityCurrencyConfig?.currencyName || "Points";

  const [updateConfig, { loading: savingConfig }] = useUpdateScratchCardConfig();
  const [createTier, { loading: creatingTier }] = useCreateScratchCardPrize();
  const [updateTier, { loading: updatingTier }] = useUpdateScratchCardPrize();
  const [deleteTier, { loading: deletingTier }] = useDeleteScratchCardPrize();

  const [getVouchers, { data: vouchersData, loading: vouchersLoading }] =
    useLazyGetVouchersByRewardMechanism();

  const uniqueVoucherRewards = useMemo(() => {
    if (!vouchersData?.getVouchersByRewardMechanism) return [];
    const map = new Map();
    vouchersData.getVouchersByRewardMechanism.forEach((v: any) => {
      if (v.reward && !map.has(v.reward.id)) {
        map.set(v.reward.id, v.reward);
      }
    });
    return Array.from(map.values());
  }, [vouchersData]);

  // Master Engine status
  const config = configData?.getScratchCardConfig;
  const [isEnabled, setIsEnabled] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (config && !initialized) {
      setIsEnabled(config.isActive ?? true);
      setInitialized(true);
    }
  }, [config, initialized]);

  // ── Update URL parameters helper ──────────────────────────────────────────
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
  const page = Number(searchParams.get("page") || "1");
  const limit = 24;
  const offset = (page - 1) * limit;

  const status =
    searchParams.get("status") ||
    initialStatus ||
    "ALL";

  const rewardType = searchParams.get("type") || "ALL";
  const eligibility = searchParams.get("eligibility") || "ALL";
  const sortBy = searchParams.get("sort") || "newest";
  const view = (searchParams.get("view") as "grid" | "list") || "grid";

  // Search input state with debounce
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  // Sync debounced search to URL
  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (debouncedSearch.trim() !== currentQ) {
      updateParams({ q: debouncedSearch.trim() || null, page: null });
    }
  }, [debouncedSearch, searchParams, updateParams]);

  // Modal and Dialog States
  const [editingTier, setEditingTier] = useState<ScratchRewardTier | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingTierId, setDeletingTierId] = useState<string | null>(null);

  // Column visibility for List view
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    serial: true,
    tier: true,
    rewardType: true,
    value: true,
    eligibility: true,
    status: true,
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
    updateParams({ status: v === "ALL" ? null : v, page: null });

  const setRewardType = (v: string) =>
    updateParams({ type: v === "ALL" ? null : v, page: null });

  const setSortBy = (v: string) =>
    updateParams({ sort: v === "newest" ? null : v, page: null });

  const setView = (v: "grid" | "list") =>
    updateParams({ view: v === "grid" ? null : v });

  const setPage = (p: number) =>
    updateParams({ page: p <= 1 ? null : String(p) });

  // ── Parse raw prizes into formatted tiers ─────────────────────────────────
  const rawTiers: ScratchRewardTier[] = useMemo(() => {
    if (!prizesData?.getScratchCardPrizes) return [];
    return prizesData.getScratchCardPrizes.map((p: any) => {
      const uiType = resolveGameRewardType(p);
      const ruleId =
        p.storeDiscountRuleId ||
        p.manualBatchId ||
        p.digitalCardRuleId ||
        p.mechanism?.ruleId ||
        null;
      return {
        id: p.id,
        configId: p.configId,
        label: p.label,
        rewardType: uiType,
        rewardValue: p.value ?? 0,
        coinsAmount: p.coinsAmount,
        tryAgainMessage: p.tryAgainMessage,
        cardColor: "#4F46E5",
        isActive: p.isActive !== false,
        rewardId: ruleId,
        minAccountAge: p.minAccountAge || 0,
        minActivity: p.minActivity || 0,
        eligibilityDescription: p.eligibilityDescription || "",
        storeDiscountRuleId: p.storeDiscountRuleId,
        manualBatchId: p.manualBatchId,
        digitalCardRuleId: p.digitalCardRuleId,
        eligibilityRuleId: p.eligibilityRuleId,
        storeDiscountRule: p.storeDiscountRule,
        manualBatch: p.manualBatch,
        digitalCardRule: p.digitalCardRule,
        mechanism: p.mechanism,
        eligibility: p.eligibility,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      };
    });
  }, [prizesData]);

  // ── Filter and Sort Tiers ─────────────────────────────────────────────────
  const filteredTiers = useMemo(() => {
    let list = [...rawTiers];

    // Status filter
    if (status === "ACTIVE") {
      list = list.filter((t) => t.isActive !== false);
    } else if (status === "INACTIVE") {
      list = list.filter((t) => t.isActive === false);
    }

    // Reward Type filter
    if (rewardType !== "ALL") {
      list = list.filter((t) => {
        if (rewardType === "COINS") return t.rewardType === "COINS";
        if (rewardType === "GIFT_CARD") return t.rewardType === "GIFT_CARD";
        if (rewardType === "ECOMMERCE") return t.rewardType === "ECOMMERCE";
        if (rewardType === "INTERNAL_VOUCHER")
          return (
            t.rewardType === "INTERNAL_VOUCHER" || t.rewardType === "VOUCHER"
          );
        if (rewardType === "NO_REWARDS") return t.rewardType === "NO_REWARDS";
        return true;
      });
    }

    // Eligibility filter
    if (eligibility !== "ALL") {
      list = list.filter(
        (t) => (t.eligibility?.memberEligibility || "ALL") === eligibility,
      );
    }

    // Search filter
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.label?.toLowerCase().includes(q) ||
          t.tryAgainMessage?.toLowerCase().includes(q) ||
          t.storeDiscountRule?.title?.toLowerCase().includes(q) ||
          t.manualBatch?.name?.toLowerCase().includes(q) ||
          t.digitalCardRule?.title?.toLowerCase().includes(q) ||
          t.id?.toLowerCase().includes(q),
      );
    }

    // Sorting
    return list.sort((a: any, b: any) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime()
          );
        case "label":
          return (a.label || "").localeCompare(b.label || "");
        case "value-desc":
          return (b.rewardValue ?? 0) - (a.rewardValue ?? 0);
        case "value-asc":
          return (a.rewardValue ?? 0) - (b.rewardValue ?? 0);
        default:
          return 0;
      }
    });
  }, [rawTiers, status, rewardType, eligibility, debouncedSearch, sortBy]);

  // Paginated slice for current page
  const paginatedTiers = useMemo(() => {
    return filteredTiers.slice(offset, offset + limit);
  }, [filteredTiers, offset, limit]);

  // ── Engine Toggle Handler ─────────────────────────────────────────────────
  const handleToggleEngine = async (active: boolean) => {
    setIsEnabled(active);
    try {
      await updateConfig({
        variables: {
          input: {
            isActive: active,
          },
        },
      });
      toast.success(
        active
          ? "Scratch Card Game is now LIVE"
          : "Scratch Card Game is PAUSED",
      );
      refetchConfig();
    } catch (err: any) {
      setIsEnabled(!active);
      toast.error(err?.message || "Failed to update engine status");
    }
  };

  // ── Tier Management Handlers ──────────────────────────────────────────────
  const handleCreate = () => {
    router.push("/gamification/rewards/engagement-games/scratch-card/create");
  };

  const handleEditTier = (tier: ScratchRewardTier) => {
    setEditingTier(tier);
    setIsDialogOpen(true);
  };

  const handleSaveTier = async () => {
    if (!editingTier) return;

    const baseInput: any = {
      label: editingTier.label,
      minAccountAge: Number(editingTier.minAccountAge || 0),
      minActivity: Number(editingTier.minActivity || 0),
      eligibilityDescription: editingTier.eligibilityDescription || "",
    };

    if (editingTier.rewardType === "COINS") {
      baseInput.type = "COINS";
      baseInput.value = Number(editingTier.rewardValue);
      baseInput.coinsAmount = Number(editingTier.rewardValue);
    } else if (editingTier.rewardType === "NO_REWARDS") {
      baseInput.type = "NO_REWARDS";
      baseInput.value = 0;
      baseInput.tryAgainMessage =
        editingTier.label || "Better Luck Next Time";
    } else if (editingTier.rewardType === "GIFT_CARD") {
      baseInput.type = "VOUCHER";
      baseInput.value = Number(
        editingTier.giftCardDenomination ||
          editingTier.rewardValue ||
          100,
      );
      baseInput.mechanism = {
        type: "DIGITAL_GIFT_CARD",
        ruleId:
          editingTier.rewardId ||
          editingTier.digitalCardRuleId ||
          null,
        digitalCardRuleId:
          editingTier.rewardId ||
          editingTier.digitalCardRuleId ||
          null,
      };
    } else if (editingTier.rewardType === "ECOMMERCE") {
      baseInput.type = "VOUCHER";
      baseInput.value = Number(
        editingTier.ecommerceDiscountValue ||
          editingTier.rewardValue ||
          20,
      );
      baseInput.mechanism = {
        type: "STORE_DISCOUNT",
        ruleId:
          editingTier.rewardId ||
          editingTier.storeDiscountRuleId ||
          null,
        storeDiscountRuleId:
          editingTier.rewardId ||
          editingTier.storeDiscountRuleId ||
          null,
      };
    } else {
      // INTERNAL_VOUCHER or VOUCHER
      baseInput.type = "VOUCHER";
      baseInput.value = Number(editingTier.rewardValue || 0);
      baseInput.mechanism = {
        type: "INTERNAL_VOUCHER",
        ruleId:
          editingTier.rewardId ||
          editingTier.manualBatchId ||
          null,
        manualBatchId:
          editingTier.rewardId ||
          editingTier.manualBatchId ||
          null,
      };
    }

    try {
      if (editingTier.id) {
        await updateTier({ variables: { id: editingTier.id, input: baseInput } });
        toast.success("Tier updated successfully");
      } else {
        await createTier({ variables: { input: baseInput } });
        toast.success("Tier added successfully");
      }
      setIsDialogOpen(false);
      setEditingTier(null);
      refetchPrizes();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save tier");
    }
  };

  const handleDeleteTier = async () => {
    if (!deletingTierId) return;
    try {
      await deleteTier({ variables: { id: deletingTierId } });
      toast.success("Tier deleted successfully");
      refetchPrizes();
      setDeletingTierId(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete tier");
    }
  };

  const handleToggleActive = async (id: string, v: boolean) => {
    try {
      await updateTier({
        variables: { id, input: { isActive: v } },
      });
      toast.success(v ? "Tier activated" : "Tier deactivated");
      refetchPrizes();
    } catch {
      toast.error("Failed to update tier status");
    }
  };

  const availableColumns = useMemo(
    () =>
      getScratchCardTableColumns(
        handleEditTier,
        (id) => setDeletingTierId(id),
        handleToggleActive,
        currencyName,
      ),
    [currencyName],
  );

  const pageTitle =
    status === "ALL"
      ? "Scratch & Win"
      : `${status.charAt(0) + status.slice(1).toLowerCase()} Scratch Cards`;

  const isLoading = prizesLoading || configLoading;

  return (
    <EcosystemWrapper className="gap-6">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <EcosystemHeader
        title={pageTitle}
        badgeText="Engagement Game"
        description="Configure scratch card tiers, winning odds, prize distribution, and member qualification rules."
        icon={RectangleHorizontal}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification/points-and-badges" },
          { label: "Rewards", href: "/gamification/rewards" },
          {
            label: "Engagement Games",
            href: "/gamification/rewards/engagement-games",
          },
          { label: "Scratch Card" },
        ]}
        actions={
          <CtaButton onClick={handleCreate}>
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Reward Tier
          </CtaButton>
        }
      />

      {/* ── Master Engine Status & Alert Banner ────────────────────────────── */}
      <div className="space-y-4 px-3">
        <div className="rounded-xl border border-border bg-card p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors",
                isEnabled
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                  : "bg-muted text-muted-foreground border-border",
              )}
            >
              <Zap className="h-4 w-4" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">
                  Scratch Card Engine
                </span>
                <span
                  className={cn(
                    "text-[10px] font-bold px-1.5 py-0.2 rounded border uppercase tracking-wider",
                    isEnabled
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800"
                      : "bg-muted text-muted-foreground border-border",
                  )}
                >
                  {isEnabled ? "Live" : "Paused"}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {isEnabled
                  ? "Members can actively scratch cards and claim rewards based on active tier rules."
                  : "The scratch card game is currently paused. Members cannot scratch new cards."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <span className="text-xs font-semibold text-muted-foreground">
              {isEnabled ? "Enabled" : "Disabled"}
            </span>
            <Switch
              checked={isEnabled}
              onCheckedChange={handleToggleEngine}
              disabled={savingConfig}
              className="data-[state=checked]:bg-emerald-600"
            />
          </div>
        </div>
      </div>

      {/* ── Action / Filter Bar ───────────────────────────────────────────── */}
      <EcosystemActionBar shadow="none">
        {/* Search */}
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="w-full sm:w-60">
            <EcosystemActionBar.Search
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by label, prize, rule…"
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        {/* Filters Group */}
        <EcosystemActionBar.Group>
          {/* Reward Type / Mechanism Filter */}
          <EcosystemActionBar.Item>
            <Select
              value={rewardType}
              onValueChange={(v) => setRewardType(v)}
            >
              <SelectTrigger className="w-[145px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                <SelectValue placeholder="Reward Type" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[165px]">
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
            <Select
              value={status}
              onValueChange={(v) => setStatus(v)}
            >
              <SelectTrigger className="w-[125px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
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
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[140px]">
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

          {/* Eligibility Filter */}
          <EcosystemActionBar.Item>
            <Select
              value={eligibility}
              onValueChange={(v) => updateParams({ eligibility: v, page: null })}
            >
              <SelectTrigger className="w-[135px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                <SelectValue placeholder="Eligibility" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[160px]">
                {ELIGIBILITY_FILTER_OPTIONS.map((opt) => (
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

          {/* Sort Filter */}
          <EcosystemActionBar.Item>
            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v)}
            >
              <SelectTrigger className="w-[130px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[170px]">
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
          {view === "list" && (
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
            value={view}
            onChange={(v) => setView(v as "grid" | "list")}
            options={[
              { id: "grid", label: "Grid", icon: LayoutGrid },
              { id: "list", label: "List", icon: ListIcon },
            ]}
          />

          <EcosystemActionBar.Separator />

          {/* Live Status Count */}
          <EcosystemActionBar.Status active={filteredTiers.length > 0}>
            Showing {filteredTiers.length} of {rawTiers.length} Tiers
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Content Container ─────────────────────────────────────────────── */}
      <EcosystemContainer className="p-0 m-3 mt-0 border-none bg-transparent shadow-none ring-0 space-y-3">
        {/* Section Header (appears when filtered by non-ALL status) */}
        <SectionHeader
          status={status}
          count={filteredTiers.length}
          loading={isLoading}
        />

        {/* Content Area (Grid vs List with Motion) */}
        <ContentArea
          view={view}
          loading={isLoading}
          tiers={paginatedTiers}
          currencyName={currencyName}
          onEdit={handleEditTier}
          onDelete={(id) => setDeletingTierId(id)}
          onToggleActive={handleToggleActive}
          visibleColumns={visibleColumns}
          offset={offset}
        />

        {/* Pagination Controls */}
        {!isLoading && filteredTiers.length > limit && (
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(filteredTiers.length / limit)}
              totalItems={filteredTiers.length}
              pageSize={limit}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </EcosystemContainer>

      {/* ── Quick Edit Tier Dialog ────────────────────────────────────────── */}
      <TierDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingTier={editingTier}
        setEditingTier={setEditingTier}
        onSave={handleSaveTier}
        isSaving={creatingTier || updatingTier}
        currencyName={currencyName}
        uniqueVoucherRewards={uniqueVoucherRewards}
        vouchersLoading={vouchersLoading}
        getVouchers={getVouchers}
      />

      {/* ── Delete Confirmation Alert ─────────────────────────────────────── */}
      <AlertDialog
        open={!!deletingTierId}
        onOpenChange={(open) => !open && setDeletingTierId(null)}
      >
        <AlertDialogContent className="rounded-2xl border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold">
              Delete Reward Tier?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to delete this reward tier? Members will no longer be able to scratch or claim prizes from this tier.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deletingTier}
              className="rounded-lg text-xs"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTier}
              disabled={deletingTier}
              className="rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
            >
              {deletingTier ? "Deleting..." : "Delete Tier"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </EcosystemWrapper>
  );
}

export default ScratchCardManager;
