"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import {
  ShoppingBag,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  Upload,
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
import { useModuleStore } from "@/store/useModuleStore";

import {
  useShopProducts,
  useCreateShopProduct,
} from "@/graphql/actions/shop";
import { useGetEntity } from "@/graphql/actions";
import { ProductSheet } from "@/components/shop/product-sheet";
import { ProductFormValues } from "@/components/shop/product-form";
import {
  STATUS_TABS,
  STOCK_OPTIONS,
  SORT_OPTIONS,
  ShopStatusValue,
  SectionHeader,
  ContentArea,
} from "./shop-manage-ui";
import { getProductTableColumns } from "./products-list";
import { ExportProductsModal } from "./export-products-modal";

export interface ShopManageProps {
  status?: string;
}

export function ShopManage({ status: initialStatus }: ShopManageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const moduleName = useModuleStore((state) => state.shopModuleName);
  const singularName = useModuleStore((state) => state.shopSingularName);

  // ── Update URL parameters helper ──────────────────────────────────────────
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (
          value === null ||
          value === "" ||
          value === "ALL" ||
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

  const selectedStock = searchParams.get("stock") || "ALL";
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

  // ProductSheet & Export Modal state
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Column visibility for List view
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    serial: true,
    product: true,
    price: true,
    variants: true,
    stock: true,
    views: true,
    status: true,
    link: true,
    created: true,
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

  const setSelectedStock = (v: string) =>
    updateParams({ stock: v === "ALL" ? null : v, page: null });

  const setSortBy = (v: string) =>
    updateParams({ sort: v === "newest" ? null : v, page: null });

  const setView = (v: "grid" | "list") =>
    updateParams({ view: v === "grid" ? null : v });

  const setPage = (p: number) =>
    updateParams({ page: p <= 1 ? null : String(p) });

  // ── Fetch Products & Entity ───────────────────────────────────────────────
  const { data, loading, refetch } = useShopProducts({
    pagination: { limit: 200 },
  });

  const { data: entityData } = useGetEntity();

  const [createProduct, { loading: creating }] = useCreateShopProduct({
    onCompleted: () => {
      toast.success(`${singularName} created successfully!`);
      setIsSheetOpen(false);
      refetch();
    },
    onError: (err) => {
      toast.error(`Failed to create ${singularName.toLowerCase()}: ` + err.message);
    },
  });

  const allProducts = data?.getShopProducts || [];
  const totalCount = allProducts.length;

  const handleSubmit = async (values: ProductFormValues) => {
    const imageList =
      values.images && values.images.length > 0
        ? values.images
        : values.image
          ? [values.image]
          : [];

    const media = imageList.map((url, index) => ({
      url,
      sortOrder: index,
    }));

    await createProduct({
      variables: {
        input: {
          title: values.title,
          price: values.price,
          description: values.description,
          category: values.category,
          sku: values.variants?.[0]?.sku || "",
          media: media,
          currency: values.currency,
          isOutOfStock: values.isOutOfStock,
          externalLink: values.externalLink,
          hasVariants: values.hasVariants,
          options: values.options,
        },
      },
    });
  };

  // ── Filter and Sort Products ──────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    let list = [...allProducts];

    // Status filter
    if (status !== "ALL") {
      if (status === "OUT_OF_STOCK") {
        list = list.filter((p) => p.isOutOfStock);
      } else {
        list = list.filter(
          (p) =>
            p.status?.toUpperCase() === status.toUpperCase() ||
            (!p.status && status === "DRAFT"),
        );
      }
    }

    // Stock filter
    if (selectedStock === "IN_STOCK") {
      list = list.filter((p) => !p.isOutOfStock);
    } else if (selectedStock === "OUT_OF_STOCK") {
      list = list.filter((p) => p.isOutOfStock);
    }

    // Search filter
    if (debouncedSearch) {
      const term = debouncedSearch.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term) ||
          p.category?.toLowerCase().includes(term) ||
          p.sku?.toLowerCase().includes(term),
      );
    }

    // Sorting
    return list.sort((a, b) => {
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
        case "title":
          return (a.title || "").localeCompare(b.title || "");
        case "price_high":
          return Number(b.price || 0) - Number(a.price || 0);
        case "price_low":
          return Number(a.price || 0) - Number(b.price || 0);
        case "views":
          return (b.numberOfViews || 0) - (a.numberOfViews || 0);
        case "variants":
          return (
            (b.variants?.length || b.numberOfVariants || 0) -
            (a.variants?.length || a.numberOfVariants || 0)
          );
        default:
          return 0;
      }
    });
  }, [allProducts, status, selectedStock, debouncedSearch, sortBy]);

  // Paginated slice for current page
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(offset, offset + limit);
  }, [filteredProducts, offset, limit]);

  const pageTitle =
    status === "ALL"
      ? moduleName
      : `${status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, " ")} ${moduleName}`;

  const availableColumns = useMemo(
    () => getProductTableColumns(singularName, refetch),
    [singularName, refetch],
  );

  const categories = [
    { id: "clothing", name: "Clothing" },
    { id: "electronics", name: "Electronics" },
    { id: "digital", name: "Digital Goods" },
    { id: "services", name: "Services" },
    { id: "merch", name: "Merchandise" },
  ];

  return (
    <EcosystemWrapper className="gap-6">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <EcosystemHeader
        title={pageTitle}
        badgeText="Storefront"
        description={
          loading
            ? `Loading ${moduleName.toLowerCase()}…`
            : `${totalCount} total ${moduleName.toLowerCase()} in your store inventory.`
        }
        icon={ShoppingBag}
        breadcrumbs={[
          { label: moduleName, href: "/shop/all" },
          { label: pageTitle },
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
              placeholder={`Search ${moduleName.toLowerCase()}…`}
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
              <SelectTrigger className="w-[140px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
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
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[150px]">
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

          {/* Stock Filter */}
          <EcosystemActionBar.Item>
            <Select
              value={selectedStock}
              onValueChange={(v) => setSelectedStock(v)}
            >
              <SelectTrigger className="w-[125px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                <SelectValue placeholder="Stock" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[135px]">
                {STOCK_OPTIONS.map((opt) => (
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
              <SelectTrigger className="w-[140px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[145px]">
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

          {/* Create CTA Button */}
          <CtaButton onClick={() => setIsSheetOpen(true)}>
            <Plus className="h-3.5 w-3.5" />
            Add {singularName}
          </CtaButton>

          <EcosystemActionBar.Separator />

          {/* Live Status Count */}
          <EcosystemActionBar.Status active={filteredProducts.length > 0}>
            Showing {filteredProducts.length} of {totalCount} {moduleName}
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Content Container ─────────────────────────────────────────────── */}
      <EcosystemContainer className="p-0 m-3 mt-0 border-none bg-transparent shadow-none ring-0 space-y-3">
        {/* Section Header (appears when filtered by non-ALL status) */}
        <SectionHeader
          status={status}
          count={filteredProducts.length}
          loading={loading}
        />

        {/* Content Area (Grid vs List with Motion) */}
        <ContentArea
          view={view}
          loading={loading}
          products={paginatedProducts}
          refetch={refetch}
          visibleColumns={visibleColumns}
          offset={offset}
        />

        {/* Pagination Controls */}
        {!loading && filteredProducts.length > limit && (
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(filteredProducts.length / limit)}
              totalItems={filteredProducts.length}
              pageSize={limit}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </EcosystemContainer>

      {/* ── Product Creation Sheet ────────────────────────────────────────── */}
      <ProductSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        loading={creating}
        onSubmit={handleSubmit}
        categories={categories}
        entityName={entityData?.getEntity?.name || "Store"}
        mode="create"
      />

      {/* ── Export Modal ─────────────────────────────────────────────────── */}
      <ExportProductsModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        products={filteredProducts}
        totalCount={totalCount}
        matchingCount={
          debouncedSearch.trim() ||
          status !== "ALL" ||
          selectedStock !== "ALL"
            ? filteredProducts.length
            : undefined
        }
      />
    </EcosystemWrapper>
  );
}

export default ShopManage;
