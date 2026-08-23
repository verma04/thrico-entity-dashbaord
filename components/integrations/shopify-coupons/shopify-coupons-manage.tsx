"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import {
  Tag,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  Upload,
  RefreshCw,
  Plus,
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
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { Pagination } from "@/components/shared/admin-table/admin-table";

import {
  useGetShopifyCoupons,
  useGetShopifyConnection,
  ShopifyCoupon,
} from "@/graphql/actions";
import {
  STATUS_TABS,
  SORT_OPTIONS,
  ShopifyCouponStatusValue,
  SectionHeader,
  ContentArea,
} from "./shopify-coupons-ui";
import { getShopifyCouponTableColumns } from "./shopify-coupons-list";
import { ExportShopifyCouponsModal } from "./export-shopify-coupons-modal";

export interface ShopifyCouponsManageProps {
  status?: string;
}

export function ShopifyCouponsManage({
  status: initialStatus,
}: ShopifyCouponsManageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  // Modal states
  const [showExportModal, setShowExportModal] = useState(false);

  // Column visibility for List view
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    serial: true,
    coupon: true,
    code: true,
    discount: true,
    status: true,
    usage: true,
    startsAt: true,
    endsAt: true,
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

  const setSortBy = (v: string) =>
    updateParams({ sort: v === "newest" ? null : v, page: null });

  const setView = (v: "grid" | "list") =>
    updateParams({ view: v === "grid" ? null : v });

  const setPage = (p: number) =>
    updateParams({ page: p <= 1 ? null : String(p) });

  // ── Fetch Shopify Connection & Coupons ────────────────────────────────────
  const { data: connectionData } = useGetShopifyConnection();
  const shopDomain = connectionData?.shopifyConnection?.shopDomain;

  const { data, loading, refetch } = useGetShopifyCoupons({
    input: {
      limit: 100,
      offset: 0,
    },
  });

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success("Refreshed Shopify coupons");
    } catch (err: any) {
      toast.error(err.message || "Failed to refresh coupons");
    }
  };

  const rawCoupons: ShopifyCoupon[] = data?.getShopifyCoupons?.data || [];
  const totalCount = data?.getShopifyCoupons?.total ?? rawCoupons.length;

  // ── Filter and Sort Coupons ───────────────────────────────────────────────
  const filteredCoupons = useMemo(() => {
    let list = [...rawCoupons];

    // Status filter
    if (status !== "ALL") {
      list = list.filter(
        (c) => (c.status || "ACTIVE").toUpperCase() === status.toUpperCase(),
      );
    }

    // Search filter
    if (debouncedSearch) {
      const term = debouncedSearch.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.title?.toLowerCase().includes(term) ||
          c.code?.toLowerCase().includes(term) ||
          c.codes?.some((code) => code.toLowerCase().includes(term)) ||
          c.summary?.toLowerCase().includes(term) ||
          c.id?.toLowerCase().includes(term),
      );
    }

    // Sorting
    return list.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.startsAt || 0).getTime() -
            new Date(a.startsAt || 0).getTime()
          );
        case "oldest":
          return (
            new Date(a.startsAt || 0).getTime() -
            new Date(b.startsAt || 0).getTime()
          );
        case "title":
          return (a.title || a.code || "").localeCompare(b.title || b.code || "");
        case "usage":
          return (b.timesUsed || 0) - (a.timesUsed || 0);
        default:
          return 0;
      }
    });
  }, [rawCoupons, status, debouncedSearch, sortBy]);

  // Paginated slice for current page
  const paginatedCoupons = useMemo(() => {
    return filteredCoupons.slice(offset, offset + limit);
  }, [filteredCoupons, offset, limit]);

  const pageTitle =
    status === "ALL"
      ? "Shopify Coupons"
      : `${status.charAt(0) + status.slice(1).toLowerCase()} Coupons`;

  const availableColumns = useMemo(
    () => getShopifyCouponTableColumns(shopDomain, refetch),
    [shopDomain, refetch],
  );

  return (
    <EcosystemWrapper className="gap-6">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <EcosystemHeader
        title={pageTitle}
        badgeText="Coupon Sync"
        description={
          loading
            ? "Loading coupons…"
            : `${totalCount} total synced coupons from your Shopify store.`
        }
        icon={Tag}
        breadcrumbs={[
          { label: "Integrations", href: "/settings/integrations" },
          { label: "Shopify", href: "/integrations/shopify" },
          { label: "Coupons" },
        ]}
      />

      {/* ── Action / Filter Bar ───────────────────────────────────────────── */}
      <EcosystemActionBar shadow="none">
        {/* Search */}
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by code, title or summary…"
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        {/* Status Filter */}
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v)}
            >
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
            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v)}
            >
              <SelectTrigger className="w-[135px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[140px]">
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

          {/* Export Button */}
          <Button
            variant="outline"
            onClick={() => setShowExportModal(true)}
            className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5"
          >
            <Upload className="h-3.5 w-3.5" />
            Export
          </Button>

          {/* View Toggle */}
          <EcosystemActionBar.ViewToggle
            value={view}
            onChange={(v) => setView(v as "grid" | "list")}
            options={[
              { id: "grid", label: "Grid", icon: LayoutGrid },
              { id: "list", label: "List", icon: ListIcon },
            ]}
          />

          {/* Create Discount Button */}
          <Button
            onClick={() => router.push("/integrations/shopify/coupons/create")}
            className="h-8 gap-1.5 shrink-0 bg-[#005bd3] hover:bg-[#004bb0] text-white text-xs font-semibold px-3 shadow-xs transition-colors rounded-md cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Create discount
          </Button>

          {/* Refresh CTA Button */}
          <CtaButton onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            {loading ? "Refreshing…" : "Refresh"}
          </CtaButton>

          <EcosystemActionBar.Separator />

          {/* Live Status Count */}
          <EcosystemActionBar.Status active={filteredCoupons.length > 0}>
            Showing {filteredCoupons.length} of {totalCount} Coupons
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Content Container ─────────────────────────────────────────────── */}
      <EcosystemContainer className="p-0 m-3 mt-0 border-none bg-transparent shadow-none ring-0 space-y-3">
        {/* Section Header (appears when filtered by non-ALL status) */}
        <SectionHeader
          status={status}
          count={filteredCoupons.length}
          loading={loading}
        />

        {/* Content Area (Grid vs List with Motion) */}
        <ContentArea
          view={view}
          loading={loading}
          coupons={paginatedCoupons}
          shopDomain={shopDomain}
          refetch={refetch}
          visibleColumns={visibleColumns}
          offset={offset}
        />

        {/* Pagination Controls */}
        {!loading && filteredCoupons.length > limit && (
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(filteredCoupons.length / limit)}
              totalItems={filteredCoupons.length}
              pageSize={limit}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </EcosystemContainer>

      {/* ── Export Modal ─────────────────────────────────────────────────── */}
      <ExportShopifyCouponsModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        coupons={filteredCoupons}
        totalCount={totalCount}
        matchingCount={
          debouncedSearch.trim() || status !== "ALL"
            ? filteredCoupons.length
            : undefined
        }
      />
    </EcosystemWrapper>
  );
}

export default ShopifyCouponsManage;
