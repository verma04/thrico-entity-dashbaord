"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import {
  Dices,
  Plus,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  Sparkles,
  Zap,
  Eye,
  Percent,
  Coins,
  ShieldCheck,
  AlertCircle,
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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useModuleStore } from "@/store/useModuleStore";

import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { Pagination } from "@/components/shared/admin-table/admin-table";
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
  useGetSpinWheelConfig,
  useGetSpinWheelPrizes,
  useUpdateSpinWheelConfig,
  useCreateSpinWheelPrize,
  useUpdateSpinWheelPrize,
  useDeleteSpinWheelPrize,
  useLazyGetVouchersByRewardMechanism,
} from "@/graphql/actions/rewards";
import { useGetEntityCurrencyConfig } from "@/graphql/actions/currency";

import {
  STATUS_TABS,
  REWARD_TYPE_FILTER_OPTIONS,
  getRewardTypeFilterOptions,
  SORT_OPTIONS,
  SectionHeader,
  ContentArea,
} from "./spin-wheel-manage-ui";
import { getSpinWheelTableColumns } from "./spin-wheel-list";
import { WheelSegment } from "./types";
import { resolveGameRewardType, SEGMENT_COLORS } from "./constants";
import { SegmentDialog } from "./segment-dialog";
import { SpinWheelPreviewModal } from "./spin-wheel-preview-modal";
import Link from "next/link";

export interface SpinWheelManagerProps {
  status?: string;
}

export function SpinWheelManager({
  status: initialStatus,
}: SpinWheelManagerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rewardsModuleName = useModuleStore(
    (state) => state.rewardsModuleName || "Rewards",
  );

  // ── GraphQL Hooks ─────────────────────────────────────────────────────────
  const {
    data: configData,
    refetch: refetchConfig,
    loading: configLoading,
  } = useGetSpinWheelConfig();
  const {
    data: prizesData,
    refetch: refetchPrizes,
    loading: prizesLoading,
  } = useGetSpinWheelPrizes();
  const { data: currencyConfig } = useGetEntityCurrencyConfig();
  const currencyName =
    currencyConfig?.getEntityCurrencyConfig?.currencyName || "Points";

  const [updateConfig, { loading: savingConfig }] = useUpdateSpinWheelConfig();
  const [createPrize, { loading: creatingSegment }] = useCreateSpinWheelPrize();
  const [updatePrize, { loading: updatingSegment }] = useUpdateSpinWheelPrize();
  const [deletePrize, { loading: deletingSegment }] = useDeleteSpinWheelPrize();

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

  // Master Engine parameters
  const config = configData?.getSpinWheelConfig;
  const [isActive, setIsActive] = useState(true);
  const [costPerSpin, setCostPerSpin] = useState(20);
  const [maxSpinsPerDay, setMaxSpinsPerDay] = useState(3);
  const [maxWheelItems, setMaxWheelItems] = useState(12);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (config && !initialized) {
      setIsActive(config.isActive ?? true);
      setCostPerSpin(config.costPerSpin ?? 20);
      setMaxSpinsPerDay(config.maxSpinsPerDay ?? 3);
      setMaxWheelItems(config.maxWheelItems ?? config.maxItems ?? 12);
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

  const status = searchParams.get("status") || initialStatus || "ALL";

  const rewardType = searchParams.get("type") || "ALL";
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
  const [editingSegment, setEditingSegment] = useState<WheelSegment | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [deletingSegmentId, setDeletingSegmentId] = useState<string | null>(
    null,
  );

  // Column visibility for List view
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    {
      serial: true,
      segment: true,
      rewardType: true,
      value: true,
      probability: true,
      color: true,
      status: true,
      actions: true,
    },
  );

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

  // ── Parse raw prizes into formatted wheel segments ────────────────────────
  const rawSegments: WheelSegment[] = useMemo(() => {
    if (!prizesData?.getSpinWheelPrizes) return [];
    return prizesData.getSpinWheelPrizes.map((p: any, idx: number) => {
      const uiType = resolveGameRewardType(p);
      const ruleId =
        p.storeDiscountRuleId ||
        p.manualBatchId ||
        p.digitalCardRuleId ||
        p.mechanism?.ruleId ||
        null;
      return {
        id: p.id,
        label: p.label,
        rewardType: uiType,
        rewardValue: p.value ?? 0,
        probability: p.probability ?? 10,
        color: p.color || SEGMENT_COLORS[idx % SEGMENT_COLORS.length],
        isActive: p.isActive !== false,
        sortOrder: p.sortOrder ?? idx + 1,
        storeDiscountRuleId: p.storeDiscountRuleId,
        manualBatchId: p.manualBatchId,
        digitalCardRuleId: p.digitalCardRuleId,
        storeDiscountRule: p.storeDiscountRule,
        manualBatch: p.manualBatch,
        digitalCardRule: p.digitalCardRule,
        mechanism: p.mechanism,
        rewardId: ruleId,
        giftCardBrand: p.giftCardBrand,
        giftCardProductId: p.giftCardProductId,
        giftCardDenomination: p.giftCardDenomination,
        ecommerceDiscountType: p.ecommerceDiscountType,
        ecommerceDiscountValue: p.ecommerceDiscountValue,
        ecommerceTitle: p.ecommerceTitle,
      };
    });
  }, [prizesData]);

  // Economic calculations
  const totalProbability = useMemo(() => {
    return rawSegments
      .filter((s) => s.isActive)
      .reduce((sum, s) => sum + (s.probability || 0), 0);
  }, [rawSegments]);

  const isProbBalanced = Math.abs(totalProbability - 100) < 0.1;

  const avgPayout = useMemo(() => {
    if (rawSegments.length === 0) return 0;
    const active = rawSegments.filter((s) => s.isActive);
    const totalP = active.reduce((acc, s) => acc + s.probability, 0);
    if (totalP === 0) return 0;
    return active.reduce((sum, s) => {
      const weight = s.probability / totalP;
      const val = s.rewardType === "COINS" ? s.rewardValue : 0;
      return sum + val * weight;
    }, 0);
  }, [rawSegments]);

  const profitMargin = useMemo(() => {
    if (costPerSpin === 0) return 0;
    return ((costPerSpin - avgPayout) / costPerSpin) * 100;
  }, [costPerSpin, avgPayout]);

  const isHealthy = profitMargin >= 20 && profitMargin <= 40;

  // ── Filter and Sort Segments ──────────────────────────────────────────────
  const filteredSegments = useMemo(() => {
    let list = [...rawSegments];

    // Status filter
    if (status === "ACTIVE") {
      list = list.filter((s) => s.isActive);
    } else if (status === "INACTIVE") {
      list = list.filter((s) => !s.isActive);
    }

    // Reward Type filter
    if (rewardType !== "ALL") {
      list = list.filter((s) => {
        if (rewardType === "COINS") return s.rewardType === "COINS";
        if (rewardType === "GIFT_CARD") return s.rewardType === "GIFT_CARD";
        if (rewardType === "ECOMMERCE") return s.rewardType === "ECOMMERCE";
        if (rewardType === "INTERNAL_VOUCHER")
          return (
            s.rewardType === "INTERNAL_VOUCHER" || s.rewardType === "VOUCHER"
          );
        if (rewardType === "NO_REWARDS") return s.rewardType === "NO_REWARDS";
        return true;
      });
    }

    // Search filter
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.label?.toLowerCase().includes(q) ||
          s.storeDiscountRule?.title?.toLowerCase().includes(q) ||
          s.manualBatch?.name?.toLowerCase().includes(q) ||
          s.digitalCardRule?.title?.toLowerCase().includes(q) ||
          s.id?.toLowerCase().includes(q),
      );
    }

    // Sorting
    return list.sort((a: any, b: any) => {
      switch (sortBy) {
        case "newest":
          return (b.sortOrder ?? 0) - (a.sortOrder ?? 0);
        case "oldest":
          return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
        case "label":
          return (a.label || "").localeCompare(b.label || "");
        case "prob-desc":
          return (b.probability ?? 0) - (a.probability ?? 0);
        case "prob-asc":
          return (a.probability ?? 0) - (b.probability ?? 0);
        case "value-desc":
          return (b.rewardValue ?? 0) - (a.rewardValue ?? 0);
        case "value-asc":
          return (a.rewardValue ?? 0) - (b.rewardValue ?? 0);
        default:
          return 0;
      }
    });
  }, [rawSegments, status, rewardType, debouncedSearch, sortBy]);

  // Paginated slice for current page
  const paginatedSegments = useMemo(() => {
    return filteredSegments.slice(offset, offset + limit);
  }, [filteredSegments, offset, limit]);

  // ── Engine Toggle Handler ─────────────────────────────────────────────────
  const handleToggleEngine = async (active: boolean) => {
    setIsActive(active);
    try {
      await updateConfig({
        variables: {
          input: {
            isActive: active,
            costPerSpin: Number(costPerSpin),
            maxSpinsPerDay: Number(maxSpinsPerDay),
          },
        },
      });
      toast.success(
        active ? "Spin Wheel Game is now LIVE" : "Spin Wheel Game is PAUSED",
      );
      refetchConfig();
    } catch (err: any) {
      setIsActive(!active);
      toast.error(err?.message || "Failed to update engine status");
    }
  };

  const handleUpdateConfigParams = async (
    newCost?: number,
    newMaxSpins?: number,
    newMaxWheelItems?: number,
  ) => {
    const cost = newCost !== undefined ? newCost : costPerSpin;
    const spins = newMaxSpins !== undefined ? newMaxSpins : maxSpinsPerDay;
    const items = newMaxWheelItems !== undefined ? newMaxWheelItems : maxWheelItems;
    try {
      await updateConfig({
        variables: {
          input: {
            isActive,
            costPerSpin: Number(cost),
            maxSpinsPerDay: Number(spins),
            maxItems: Number(items),
            maxWheelItems: Number(items),
          },
        },
      });
      toast.success("Game parameters updated");
      refetchConfig();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update settings");
    }
  };

  const isMaxLimitReached = rawSegments.length >= maxWheelItems;

  // ── Segment Management Handlers ───────────────────────────────────────────
  const handleAddSegment = () => {
    if (isMaxLimitReached) {
      toast.error(
        `Maximum wheel segments limit reached (${maxWheelItems}). Cannot add more segments than wheel size.`,
      );
      return;
    }
    setEditingSegment({
      id: "",
      label: `20 ${currencyName}`,
      rewardType: "COINS",
      rewardValue: 20,
      probability: 10,
      color: SEGMENT_COLORS[rawSegments.length % SEGMENT_COLORS.length],
      isActive: true,
      sortOrder: rawSegments.length + 1,
    });
    setIsDialogOpen(true);
  };

  const handleEditSegment = (segment: WheelSegment) => {
    setEditingSegment(segment);
    setIsDialogOpen(true);
  };

  const handleSaveSegmentFromModal = async () => {
    if (!editingSegment) return;
    const baseInput: any = {
      label: editingSegment.label.trim(),
      probability: Number(editingSegment.probability || 10),
      color: editingSegment.color || "#4F46E5",
      sortOrder: Number(editingSegment.sortOrder || 1),
      isActive: editingSegment.isActive,
    };

    if (editingSegment.rewardType === "COINS") {
      baseInput.type = "COINS";
      baseInput.value = Number(editingSegment.rewardValue || 20);
    } else if (editingSegment.rewardType === "NO_REWARDS") {
      baseInput.type = "NO_REWARDS";
      baseInput.value = 0;
    } else if (editingSegment.rewardType === "GIFT_CARD") {
      baseInput.type = "VOUCHER";
      baseInput.value = Number(
        editingSegment.giftCardDenomination ||
          editingSegment.rewardValue ||
          100,
      );
      baseInput.mechanism = {
        type: "DIGITAL_GIFT_CARD",
        ruleId: editingSegment.rewardId || null,
        digitalCardRuleId: editingSegment.rewardId || null,
      };
    } else if (editingSegment.rewardType === "ECOMMERCE") {
      baseInput.type = "VOUCHER";
      baseInput.value = Number(
        editingSegment.ecommerceDiscountValue ||
          editingSegment.rewardValue ||
          20,
      );
      baseInput.mechanism = {
        type: "STORE_DISCOUNT",
        ruleId: editingSegment.rewardId || null,
        storeDiscountRuleId: editingSegment.rewardId || null,
      };
    } else {
      baseInput.type = "VOUCHER";
      baseInput.value = Number(editingSegment.rewardValue || 0);
      baseInput.mechanism = {
        type: "INTERNAL_VOUCHER",
        ruleId: editingSegment.rewardId || null,
        manualBatchId: editingSegment.rewardId || null,
      };
    }

    if (!editingSegment.id && rawSegments.length >= maxWheelItems) {
      toast.error(
        `Cannot add more than ${maxWheelItems} segments. Wheel capacity is full.`,
      );
      return;
    }

    try {
      if (editingSegment?.id) {
        await updatePrize({
          variables: { id: editingSegment.id, input: baseInput },
        });
        toast.success("Segment updated successfully");
      } else {
        await createPrize({
          variables: { input: baseInput },
        });
        toast.success("Segment added to wheel");
      }
      setIsDialogOpen(false);
      setEditingSegment(null);
      refetchPrizes();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save segment");
    }
  };

  const handleDeleteSegment = async () => {
    if (!deletingSegmentId) return;
    try {
      await deletePrize({ variables: { id: deletingSegmentId } });
      toast.success("Segment deleted successfully");
      refetchPrizes();
      setDeletingSegmentId(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete segment");
    }
  };

  const handleToggleActive = async (id: string, v: boolean) => {
    try {
      await updatePrize({
        variables: { id, input: { isActive: v } },
      });
      toast.success(v ? "Segment activated" : "Segment deactivated");
      refetchPrizes();
    } catch {
      toast.error("Failed to update segment status");
    }
  };

  const availableColumns = useMemo(
    () =>
      getSpinWheelTableColumns(
        handleEditSegment,
        (id) => setDeletingSegmentId(id),
        handleToggleActive,
        currencyName,
      ),
    [currencyName],
  );

  const pageTitle =
    status === "ALL"
      ? "Spin & Win"
      : `${status.charAt(0) + status.slice(1).toLowerCase()} Wheel Segments`;

  const isLoading = prizesLoading || configLoading;

  return (
    <EcosystemWrapper className="gap-6">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <EcosystemHeader
        title={pageTitle}
        badgeText="Engagement Game"
        description="Configure wheel segments, winning probabilities, spin entry costs, and member daily limits."
        icon={Dices}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification/points-and-badges" },
          { label: "Rewards", href: "/gamification/rewards" },
          {
            label: "Engagement Games",
            href: "/gamification/rewards/engagement-games",
          },
          { label: "Spin Wheel" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsPreviewOpen(true)}
              className="h-8 gap-1.5 bg-card border-border shadow-2xs text-xs font-semibold"
            >
              <Eye className="h-3.5 w-3.5" />
              Live Preview & Economics
            </Button>
            {isMaxLimitReached ? (
              <Button
                type="button"
                onClick={() => {
                  toast.error(
                    `Maximum wheel items limit reached (${maxWheelItems}). Cannot add more segments than wheel size.`,
                  );
                }}
                className="h-8 gap-1.5 text-xs font-bold bg-muted text-muted-foreground border border-border/80 hover:bg-muted/80 shadow-2xs cursor-not-allowed"
                title={`Max wheel limit of ${maxWheelItems} reached`}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Wheel Full ({rawSegments.length}/{maxWheelItems})
              </Button>
            ) : (
              <CtaButton asChild>
                <Link href="/gamification/rewards/engagement-games/spin-wheel/create">
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Wheel Segment ({rawSegments.length}/{maxWheelItems})
                </Link>
              </CtaButton>
            )}
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
                  Spin Wheel Engine
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
                  ? "Members can actively spend points to spin the wheel and win prizes."
                  : "The spin wheel game is currently paused for all members."}
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
            >
              <Percent className="h-3 w-3" />
              <span>Total: {totalProbability}%</span>
              {!isProbBalanced && (
                <AlertCircle className="h-3 w-3 text-amber-500" />
              )}
            </div>

            {/* Cost Per Spin */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground font-medium">
                Cost / Spin:
              </span>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  min={0}
                  value={costPerSpin}
                  onChange={(e) => setCostPerSpin(Number(e.target.value))}
                  onBlur={() => handleUpdateConfigParams(costPerSpin)}
                  className="h-7 w-16 text-xs text-center font-bold bg-background border-border font-mono p-1"
                />
                <span className="text-[10px] text-muted-foreground font-medium uppercase">
                  {currencyName}
                </span>
              </div>
            </div>

            {/* Daily Spin Limit */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground font-medium">
                Daily Limit:
              </span>
              <Input
                type="number"
                min={0}
                value={maxSpinsPerDay}
                onChange={(e) => setMaxSpinsPerDay(Number(e.target.value))}
                onBlur={() => handleUpdateConfigParams(undefined, maxSpinsPerDay)}
                className="h-7 w-14 text-xs text-center font-bold bg-background border-border font-mono p-1"
              />
            </div>

            {/* Max Wheel Slices Limit */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground font-medium">
                Max Slices:
              </span>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  min={2}
                  max={30}
                  value={maxWheelItems}
                  onChange={(e) => setMaxWheelItems(Number(e.target.value))}
                  onBlur={() => handleUpdateConfigParams(undefined, undefined, maxWheelItems)}
                  className="h-7 w-14 text-xs text-center font-bold bg-background border-border font-mono p-1"
                />
                <span
                  className={cn(
                    "text-[10px] font-bold font-mono px-1.5 py-0.5 rounded border",
                    isMaxLimitReached
                      ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800"
                      : "bg-muted text-muted-foreground border-border",
                  )}
                >
                  {rawSegments.length}/{maxWheelItems}
                </span>
              </div>
            </div>

            {/* Master Engine Switch */}
            <div className="flex items-center gap-2 pl-2 border-l border-border/60">
              <Switch
                checked={isActive}
                onCheckedChange={handleToggleEngine}
                disabled={savingConfig}
                className="data-[state=checked]:bg-emerald-600"
              />
            </div>
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
            <Select value={rewardType} onValueChange={(v) => setRewardType(v)}>
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
            <Select value={status} onValueChange={(v) => setStatus(v)}>
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
          <EcosystemActionBar.Status active={filteredSegments.length > 0}>
            Showing {filteredSegments.length} of {rawSegments.length} Segments
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Content Container ─────────────────────────────────────────────── */}
      <EcosystemContainer className="p-0 m-3 mt-0 border-none bg-transparent shadow-none ring-0 space-y-3">
        {/* Section Header (appears when filtered by non-ALL status) */}
        <SectionHeader
          status={status}
          count={filteredSegments.length}
          loading={isLoading}
        />

        {/* Content Area (Grid vs List with Motion) */}
        <ContentArea
          view={view}
          loading={isLoading}
          segments={paginatedSegments}
          currencyName={currencyName}
          onEdit={handleEditSegment}
          onDelete={(id) => setDeletingSegmentId(id)}
          onToggleActive={handleToggleActive}
          visibleColumns={visibleColumns}
          offset={offset}
        />

        {/* Pagination Controls */}
        {!isLoading && filteredSegments.length > limit && (
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(filteredSegments.length / limit)}
              totalItems={filteredSegments.length}
              pageSize={limit}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </EcosystemContainer>

      {/* ── Live Wheel Preview Modal ──────────────────────────────────────── */}
      <SpinWheelPreviewModal
        isOpen={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        segments={rawSegments}
        costPerSpin={costPerSpin}
        maxSpinsPerDay={maxSpinsPerDay}
        currencyName={currencyName}
        avgPayout={avgPayout}
        profitMargin={profitMargin}
        isHealthy={isHealthy}
      />

      {/* ── Segment Add / Edit Dialog ─────────────────────────────────────── */}
      <SegmentDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        editingSegment={editingSegment}
        setEditingSegment={setEditingSegment}
        handleSaveSegment={handleSaveSegmentFromModal}
        creatingSegment={creatingSegment}
        updatingSegment={updatingSegment}
        currencyName={currencyName}
        uniqueVoucherRewards={uniqueVoucherRewards}
        vouchersLoading={vouchersLoading}
        getVouchers={getVouchers}
      />

      {/* ── Delete Confirmation Alert ─────────────────────────────────────── */}
      <AlertDialog
        open={!!deletingSegmentId}
        onOpenChange={(open) => !open && setDeletingSegmentId(null)}
      >
        <AlertDialogContent className="rounded-2xl border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold">
              Delete Wheel Segment?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to delete this wheel segment? Members will
              no longer be able to land on or win this slice.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deletingSegment}
              className="rounded-lg text-xs"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSegment}
              disabled={deletingSegment}
              className="rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
            >
              {deletingSegment ? "Deleting..." : "Delete Segment"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </EcosystemWrapper>
  );
}

export default SpinWheelManager;
