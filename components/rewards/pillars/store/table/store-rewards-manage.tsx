"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import {
  ShoppingBag,
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
  Zap,
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
import {
  STORE_STATUS_TABS,
  StoreStatusValue,
  SectionHeader,
  ContentArea,
} from "./store-manage-ui";
import {
  StoreRewardItem,
  StoreDiscountType,
  useGetStoreDiscountRules,
  useDeleteStoreDiscountRule,
} from "@/graphql/actions/rewards/store";
import { StoreRewardGrid } from "./store-reward-grid";
import { StoreRewardList } from "./store-reward-list";
import { ExportStoreRewardsModal } from "./export-store-rewards-modal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface StoreRewardsManageProps {
  onCreateClick?: () => void;
}

export const StoreRewardsManage: React.FC<StoreRewardsManageProps> = ({
  onCreateClick,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Helper: update URL query params seamlessly
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

  // Derive state from URL or fallbacks
  const view = (searchParams.get("view") as "grid" | "list") || "list";
  const status = (searchParams.get("status") as StoreStatusValue) || "ALL";
  const page = Number(searchParams.get("page") || "1");
  const limit = 12;

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [debouncedSearch] = useDebounce(search, 300);

  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (debouncedSearch.trim() !== currentQ) {
      updateParams({ q: debouncedSearch.trim() || null, page: null });
    }
  }, [debouncedSearch, searchParams, updateParams]);

  // Table Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    serial: true,
    offer: true,
    discount: true,
    mechanism: true,
    minCart: true,
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

  // GraphQL Live Query & Delete Mutation
  const { data, loading, refetch } = useGetStoreDiscountRules({
    page,
    limit,
    search: debouncedSearch.trim() || undefined,
  });
  const [deleteRule] = useDeleteStoreDiscountRule();

  const rules: StoreRewardItem[] = useMemo(() => {
    return data?.getStoreDiscountRules?.items || [];
  }, [data]);

  const totalCount = data?.getStoreDiscountRules?.total || 0;
  const totalPages = data?.getStoreDiscountRules?.totalPages || 1;

  // Filter rules by status tabs on client if needed
  const filteredRewards = useMemo(() => {
    return rules.filter((r) => {
      if (status === "FIXED" && r.discountType !== StoreDiscountType.FIXED_AMOUNT) {
        return false;
      }
      if (status === "PERCENTAGE" && r.discountType !== StoreDiscountType.PERCENTAGE) {
        return false;
      }
      if (status === "ACTIVE" && !r.isActive) {
        return false;
      }
      if (status === "INACTIVE" && r.isActive) {
        return false;
      }
      return true;
    });
  }, [rules, status]);

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      ALL: rules.length,
      FIXED: rules.filter((r) => r.discountType === StoreDiscountType.FIXED_AMOUNT).length,
      PERCENTAGE: rules.filter((r) => r.discountType === StoreDiscountType.PERCENTAGE).length,
      ACTIVE: rules.filter((r) => r.isActive).length,
      INACTIVE: rules.filter((r) => !r.isActive).length,
    };
  }, [rules]);

  const handleSimulateWin = (reward: StoreRewardItem) => {
    const suffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const code = `${reward.codePrefix || "SHOP-"}${suffix}`;
    navigator.clipboard.writeText(code);
    toast.success(`🎡 Member Win: Generated ${code}`, {
      description: `Synthesized on-demand via ${reward.storeProvider} PriceRules API with single-use customer lock.`,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRule({ variables: { id } });
      toast.success("Store discount rule deleted successfully.");
      refetch();
    } catch (err: any) {
      toast.error("Failed to delete store discount rule", {
        description: err.message || "An unexpected error occurred.",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* ── Action / Filter Bar ──────────────────────────────────────── */}
      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search store discount rules by title or prefix..."
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group>
          {/* Status Dropdown Selector */}
          <Select
            value={status}
            onValueChange={(val) => updateParams({ status: val, page: null })}
          >
            <SelectTrigger className="h-8 text-xs font-semibold bg-card border-border shadow-2xs w-[160px]">
              <SelectValue placeholder="All Rules" />
            </SelectTrigger>
            <SelectContent>
              {STORE_STATUS_TABS.map((tab) => (
                <SelectItem key={tab.value} value={tab.value} className="text-xs">
                  <div className="flex items-center gap-2">
                    {tab.dot && (
                      <span className={cn("h-2 w-2 rounded-full", tab.dot)} />
                    )}
                    <span>{tab.label}</span>
                    <span className="text-[10px] text-muted-foreground ml-auto">
                      ({tabCounts[tab.value as keyof typeof tabCounts] || 0})
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Columns Visibility Selector (List View Only) */}
          {view === "list" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs font-bold text-muted-foreground">
                  Visible Columns
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.discount}
                  onCheckedChange={() => toggleColumn("discount")}
                  className="text-xs font-medium cursor-pointer"
                >
                  Discount Value
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.mechanism}
                  onCheckedChange={() => toggleColumn("mechanism")}
                  className="text-xs font-medium cursor-pointer"
                >
                  Emission Rule
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={visibleColumns.minCart}
                  onCheckedChange={() => toggleColumn("minCart")}
                  className="text-xs font-medium cursor-pointer"
                >
                  Min. Cart Spend
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
            className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5"
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
            Showing {filteredRewards.length} of {totalCount} Rules
          </EcosystemActionBar.Status>

          {/* Create CTA Button */}
          {onCreateClick && (
            <Button
              onClick={onCreateClick}
              className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 text-xs font-semibold h-8 shadow-xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Create Store Reward
            </Button>
          )}
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Quick Filter Tabs Bar with Status Counts ───────────────── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {STORE_STATUS_TABS.map((tab) => {
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
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                  : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border-border/70"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
              <span
                className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px] font-bold",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Section Header ─────────────────────────────────────────── */}
      <SectionHeader
        count={filteredRewards.length}
        label="Store Discount Rule"
        isFiltered={status !== "ALL" || !!debouncedSearch}
      />

      {/* ── Content Area: Grid or List View ────────────────────────── */}
      <ContentArea loading={loading} viewMode={view}>
        {view === "grid" ? (
          <StoreRewardGrid
            rewards={filteredRewards}
            onCreateClick={onCreateClick}
            onSimulateWin={handleSimulateWin}
            onDelete={handleDelete}
          />
        ) : (
          <StoreRewardList
            rewards={filteredRewards}
            visibleColumns={visibleColumns}
            onSimulateWin={handleSimulateWin}
            onDelete={handleDelete}
          />
        )}
      </ContentArea>

      {/* ── Bottom Pagination Bar ──────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalCount}
            pageSize={limit}
            onPageChange={(p) => {
              updateParams({ page: String(p) });
            }}
          />
        </div>
      )}

      {/* ── Export CSV Modal ───────────────────────────────────────── */}
      <ExportStoreRewardsModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        rewards={filteredRewards}
      />
    </div>
  );
};
