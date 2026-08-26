"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import {
  Ticket,
  Plus,
  Upload,
  Layers,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { Pagination } from "@/components/shared/admin-table/admin-table";
import { useGetEntityCurrencyConfig } from "@/graphql/actions/currency";
import {
  ManualCouponType,
  useGetManualVouchers,
  useGetManualVoucherBatches,
} from "@/graphql/actions/rewards/manual";
import {
  MANUAL_STATUS_TABS,
  ManualStatusValue,
  SectionHeader,
  ContentArea,
} from "./manual-manage-ui";
import { ManualRewardItem } from "./manual-reward-card";
import { ExportManualRewardsModal } from "./export-manual-rewards-modal";
import { InternalRewardDrawer } from "../drawer";
import { ManualPoolDrawer } from "../drawer/manual-pool-drawer";
import { ManualVoucherCodesTable } from "./manual-voucher-codes-table";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ManualRewardsManageProps {
  onCreateClick?: () => void;
  onEditClick?: (reward: ManualRewardItem) => void;
}

export function ManualRewardsManage({
  onCreateClick,
  onEditClick,
}: ManualRewardsManageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: currencyData } = useGetEntityCurrencyConfig();
  const currencyName =
    currencyData?.getEntityCurrencyConfig?.currencyName || "Thrico Coins";

  // Helper: update URL query params seamlessly
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (
          value === null ||
          value === "" ||
          value === "ALL" ||
          (key === "page" && value === "1")
        ) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  // Tab mode: 'campaigns' (overview/cards) vs 'ledger' (individual voucher codes table)
  const tabFromUrl = (searchParams.get("tab") as "campaigns" | "ledger") || "campaigns";
  const [tabMode, setTabMode] = useState<"campaigns" | "ledger">(tabFromUrl);

  useEffect(() => {
    const currentTab = (searchParams.get("tab") as "campaigns" | "ledger") || "campaigns";
    if (currentTab !== tabMode) {
      setTabMode(currentTab);
    }
  }, [searchParams]);

  // Derive state from URL or fallbacks
  const view = (searchParams.get("view") as "grid" | "list") || "list";
  const status: ManualStatusValue =
    (searchParams.get("status") as ManualStatusValue) || "ALL";
  const rawPage = Number(searchParams.get("page") || "1");
  const limit = 12;

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [debouncedSearch] = useDebounce(search, 300);

  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (debouncedSearch.trim() !== currentQ) {
      updateParams({ q: debouncedSearch.trim() || null, page: null });
    }
  }, [debouncedSearch, searchParams, updateParams]);

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    serial: true,
    reward: true,
    architecture: true,
    code: true,
    inventory: true,
    redeemed: true,
    validity: true,
    status: true,
    created: true,
    actions: true,
  });

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<ManualRewardItem | null>(null);
  const [selectedRewardForPool, setSelectedRewardForPool] =
    useState<ManualRewardItem | null>(null);

  // Live GraphQL Queries
  const {
    data: batchesData,
    loading: batchesLoading,
    refetch: refetchBatches,
  } = useGetManualVoucherBatches();
  const { data: vouchersData } = useGetManualVouchers({ filter: { limit: 1 } });
  const totalVouchersCount = vouchersData?.getManualVouchers?.total || 0;

  // Transform live manual voucher batches into reward items (no fake/dummy fallback)
  const allRewards: ManualRewardItem[] = useMemo(() => {
    const batchItems = batchesData?.getManualVoucherBatches?.items || [];

    return batchItems.map((b: any) => {
      let calculatedValidityDays = 30;
      if (b.expiryDate) {
        const expiry = new Date(b.expiryDate);
        const created = b.createdAt ? new Date(b.createdAt) : new Date();
        const diffDays = Math.round(
          (expiry.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
        );
        calculatedValidityDays =
          diffDays > 0
            ? diffDays
            : Math.max(
                Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
                1
              );
      }

      let parsedMeta: any = {};
      try {
        if (b.metadata) {
          parsedMeta =
            typeof b.metadata === "string"
              ? JSON.parse(b.metadata)
              : b.metadata;
        }
      } catch {
        parsedMeta = {};
      }

      const isOneToMany =
        b.couponType === ManualCouponType.ONE_TO_MANY ||
        b.couponType === "ONE_TO_MANY";
      const couponCode =
        parsedMeta.couponCode ||
        b.couponCode ||
        (isOneToMany ? b.name : "");
      const codePrefix =
        parsedMeta.prefix ||
        b.prefix ||
        (!isOneToMany && b.name && b.name.length <= 8 && !b.name.includes(" ")
          ? b.name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
          : "VCH");

      return {
        id: b.id,
        title: b.name,
        description:
          b.description ||
          b.reward?.description ||
          (b.couponType === ManualCouponType.ONE_TO_ONE
            ? "Unique serial pool batch."
            : "Shared promotional coupon campaign."),
        image: b.image || b.reward?.image || "",
        url: b.url || "",
        couponType: b.couponType || ManualCouponType.ONE_TO_ONE,
        couponCode: couponCode || b.name,
        codePrefix: codePrefix || "VCH",
        faceValue: b.faceValue || 0,
        currency: b.currency || "TC",
        totalInventory: b.totalCount || 0,
        allocatedCount: b.allocatedCount || 0,
        redeemedCount: b.redeemedCount || 0,
        remainingCount: b.remainingCount || 0,
        isActive: b.status === "ACTIVE",
        validityDays: b.expiryDate ? calculatedValidityDays : 30,
        expiryDate: b.expiryDate || undefined,
        createdAt: b.createdAt || new Date().toISOString(),
      };
    });
  }, [batchesData]);

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      ALL: allRewards.length,
      ONE_TO_ONE: allRewards.filter(
        (r) => r.couponType === ManualCouponType.ONE_TO_ONE
      ).length,
      ONE_TO_MANY: allRewards.filter(
        (r) => r.couponType === ManualCouponType.ONE_TO_MANY
      ).length,
      ACTIVE: allRewards.filter((r) => r.isActive).length,
      DRAFT: allRewards.filter((r) => !r.isActive).length,
    };
  }, [allRewards]);

  // Filter & Search
  const filteredRewards = useMemo(() => {
    return allRewards.filter((r) => {
      // Status filter
      if (status === "ONE_TO_ONE" && r.couponType !== ManualCouponType.ONE_TO_ONE) {
        return false;
      }
      if (status === "ONE_TO_MANY" && r.couponType !== ManualCouponType.ONE_TO_MANY) {
        return false;
      }
      if (status === "ACTIVE" && !r.isActive) {
        return false;
      }
      if (status === "DRAFT" && r.isActive) {
        return false;
      }

      // Search filter
      if (debouncedSearch.trim()) {
        const q = debouncedSearch.toLowerCase();
        const matchTitle = r.title.toLowerCase().includes(q);
        const matchDesc = r.description?.toLowerCase().includes(q);
        const matchCode = r.couponCode?.toLowerCase().includes(q);
        const matchPrefix = r.codePrefix?.toLowerCase().includes(q);
        return matchTitle || matchDesc || matchCode || matchPrefix;
      }

      return true;
    });
  }, [allRewards, status, debouncedSearch]);

  const totalPages = Math.max(1, Math.ceil(filteredRewards.length / limit));
  const safePage = Math.min(Math.max(1, isNaN(rawPage) ? 1 : rawPage), totalPages);
  const offset = (safePage - 1) * limit;

  // Pagination slice
  const paginatedRewards = useMemo(() => {
    return filteredRewards.slice(offset, offset + limit);
  }, [filteredRewards, offset, limit]);

  const handleSimulateWin = (reward: ManualRewardItem) => {
    toast.success(`Win Simulated: ${reward.title}`, {
      description: "Allocated 1 voucher code from pool. Saturation updated.",
    });
  };

  const handleManagePool = (reward: ManualRewardItem) => {
    setSelectedRewardForPool(reward);
  };

  const handleOpenCreate = () => {
    if (onCreateClick) {
      onCreateClick();
    } else {
      router.push("/gamification/rewards/pillars/manual/add");
    }
  };

  const handleOpenEdit = (reward: ManualRewardItem) => {
    if (onEditClick) {
      onEditClick(reward);
    } else {
      router.push(`/gamification/rewards/pillars/manual/${reward.id}/edit`);
    }
  };

  return (
    <div className="space-y-4">
      {/* ── Top Level View Switcher (Campaigns vs Voucher Codes Ledger) ── */}
      <div className="flex items-center justify-between border-b border-border/80 pb-2">
        <div className="flex items-center gap-1.5 bg-muted/50 p-1 rounded-xl border border-border/60">
          <button
            onClick={() => {
              setTabMode("campaigns");
              updateParams({ tab: "campaigns" });
            }}
            className={cn(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              tabMode === "campaigns"
                ? "bg-card text-foreground shadow-xs border border-border/60"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Ticket className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Voucher Campaigns</span>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
              {allRewards.length}
            </Badge>
          </button>

          <button
            onClick={() => {
              setTabMode("ledger");
              updateParams({ tab: "ledger" });
            }}
            className={cn(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              tabMode === "ledger"
                ? "bg-card text-foreground shadow-xs border border-border/60"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Voucher Codes Ledger</span>
            {totalVouchersCount > 0 && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                {totalVouchersCount}
              </Badge>
            )}
          </button>
        </div>
      </div>

      {tabMode === "ledger" ? (
        /* ── Individual Voucher Codes Table (Directly powered by useGetManualVouchers) ── */
        <ManualVoucherCodesTable />
      ) : (
        /* ── Campaigns / Offers View ────────────────────────────────────────── */
        <>
          {/* ── Action / Filter Bar ── */}
          <EcosystemActionBar shadow="none">
            <EcosystemActionBar.Group>
              <EcosystemActionBar.Item grow className="max-w-xs">
                <EcosystemActionBar.Search
                  value={search}
                  onChange={setSearch}
                  placeholder="Search manual vouchers by title, code or prefix..."
                />
              </EcosystemActionBar.Item>
            </EcosystemActionBar.Group>

            <EcosystemActionBar.Separator />

            {/* Primary Status / Type filter */}
            <EcosystemActionBar.Group>
              <EcosystemActionBar.Item>
                <Select
                  value={status}
                  onValueChange={(v) => updateParams({ status: v, page: null })}
                >
                  <SelectTrigger className="w-[145px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                    <div className="flex items-center gap-2">
                      {MANUAL_STATUS_TABS.find((t) => t.value === status)?.dot && (
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full shrink-0",
                            MANUAL_STATUS_TABS.find((t) => t.value === status)?.dot
                          )}
                        />
                      )}
                      <SelectValue placeholder="Status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[155px]">
                    {MANUAL_STATUS_TABS.map((opt) => (
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
                                opt.dot
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
            </EcosystemActionBar.Group>

            <EcosystemActionBar.Group align="right">
              {/* Column Visibility Menu (Visible in List mode) */}
              {view === "list" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5 cursor-pointer"
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
                    <DropdownMenuCheckboxItem
                      checked={visibleColumns.serial}
                      onCheckedChange={() => toggleColumn("serial")}
                      className="text-xs font-medium cursor-pointer"
                    >
                      S.No
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={visibleColumns.reward}
                      onCheckedChange={() => toggleColumn("reward")}
                      className="text-xs font-medium cursor-pointer"
                    >
                      Voucher Offer
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={visibleColumns.architecture}
                      onCheckedChange={() => toggleColumn("architecture")}
                      className="text-xs font-medium cursor-pointer"
                    >
                      Architecture
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={visibleColumns.code}
                      onCheckedChange={() => toggleColumn("code")}
                      className="text-xs font-medium cursor-pointer"
                    >
                      Code / Template
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={visibleColumns.inventory}
                      onCheckedChange={() => toggleColumn("inventory")}
                      className="text-xs font-medium cursor-pointer"
                    >
                      Pool Capacity
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={visibleColumns.redeemed}
                      onCheckedChange={() => toggleColumn("redeemed")}
                      className="text-xs font-medium cursor-pointer"
                    >
                      Redeemed
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={visibleColumns.validity}
                      onCheckedChange={() => toggleColumn("validity")}
                      className="text-xs font-medium cursor-pointer"
                    >
                      Validity
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={visibleColumns.status}
                      onCheckedChange={() => toggleColumn("status")}
                      className="text-xs font-medium cursor-pointer"
                    >
                      Status
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={visibleColumns.created}
                      onCheckedChange={() => toggleColumn("created")}
                      className="text-xs font-medium cursor-pointer"
                    >
                      Created Date
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Export CSV Button */}
              <Button
                variant="outline"
                onClick={() => setIsExportOpen(true)}
                className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5 cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5" />
                Export
              </Button>

              {/* ViewToggle: Grid / List */}
              <EcosystemActionBar.ViewToggle
                value={view}
                onChange={(v) => updateParams({ view: v })}
                options={[
                  { id: "grid", label: "Grid", icon: LayoutGrid },
                  { id: "list", label: "List", icon: ListIcon },
                ]}
              />

              <EcosystemActionBar.Separator />

              {/* Status Indicator */}
              <EcosystemActionBar.Status active={filteredRewards.length > 0}>
                Showing{" "}
                {filteredRewards.length === 0
                  ? 0
                  : `${offset + 1}–${Math.min(
                      offset + limit,
                      filteredRewards.length
                    )}`}{" "}
                of {filteredRewards.length} Offers
              </EcosystemActionBar.Status>
            </EcosystemActionBar.Group>
          </EcosystemActionBar>

          {/* ── Quick Filter Tabs Bar with Status Counts ───────────────── */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {MANUAL_STATUS_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = status === tab.value;
              const count = tabCounts[tab.value as keyof typeof tabCounts] || 0;

              return (
                <button
                  key={tab.value}
                  onClick={() => updateParams({ status: tab.value, page: null })}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer border",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border-border/70"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                  <span
                    className={cn(
                      "px-1.5 py-0.2 rounded-full text-[10px] font-bold",
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── Section Header Bar ────────────────────────────────────── */}
          <SectionHeader
            status={status}
            count={filteredRewards.length}
            loading={batchesLoading}
          />

          {/* ── Animated Content Area ───────────────────────────────── */}
          <ContentArea
            view={view}
            loading={batchesLoading}
            rewards={paginatedRewards}
            currencyName={currencyName}
            visibleColumns={visibleColumns}
            offset={offset}
            onSimulateWin={handleSimulateWin}
            onManagePool={handleManagePool}
            onEdit={handleOpenEdit}
            onCreateClick={handleOpenCreate}
          />

          {/* ── Bottom Pagination ────────────────────────────────────── */}
          {!batchesLoading && totalPages > 1 && (
            <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-xs">
              <Pagination
                currentPage={safePage}
                totalPages={totalPages}
                totalItems={filteredRewards.length}
                pageSize={limit}
                onPageChange={(p) => updateParams({ page: String(p) })}
              />
            </div>
          )}
        </>
      )}

      {/* ── Export CSV Modal ──────────────────────────────────────── */}
      <ExportManualRewardsModal
        open={isExportOpen}
        onOpenChange={setIsExportOpen}
        rewards={filteredRewards}
        totalCount={allRewards.length}
        matchingCount={filteredRewards.length}
      />

      {/* ── Live Voucher Pool Inspector Drawer ────────────────────────── */}
      <ManualPoolDrawer
        reward={selectedRewardForPool}
        isOpen={Boolean(selectedRewardForPool)}
        onClose={() => setSelectedRewardForPool(null)}
        onAddCodes={() => setIsDrawerOpen(true)}
      />

      {/* ── Internal Voucher Creation Drawer ────────────────────────── */}
      <InternalRewardDrawer
        isOpen={isDrawerOpen}
        initialItem={editingReward}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingReward(null);
        }}
        onSuccess={() => {
          refetchBatches();
          setIsDrawerOpen(false);
          setEditingReward(null);
        }}
      />
    </div>
  );
}
