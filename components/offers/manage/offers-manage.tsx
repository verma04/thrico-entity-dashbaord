"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useDebounce } from "use-debounce";
import {
  Tag,
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
import { MemberEligibilitySelect } from "@/components/gamification/shared/member-eligibility-select";

import {
  useGetOffers,
  useGetOfferCategories,
  useCreateOffer,
  useUpdateOffer,
  Offer,
} from "@/graphql/actions/offers";
import { OfferDialog } from "@/components/offers/offer-dialog";
import {
  STATUS_TABS,
  SORT_OPTIONS,
  OfferStatusValue,
  SectionHeader,
  ContentArea,
} from "./offers-manage-ui";
import { getOfferTableColumns } from "./offers-list";
import { ExportOffersModal } from "./export-offers-modal";

export interface OffersManageProps {
  status?: string;
}

export function OffersManage({ status: initialStatus }: OffersManageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const moduleName = useModuleStore((state) => state.offerModuleName);
  const singularName = useModuleStore((state) => state.offerSingularName);

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

  const memberEligibility =
    searchParams.get("memberEligibility") || "ALL";

  const selectedCategory = searchParams.get("category") || "ALL";
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

  // Dialog & Export Modal state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  // Column visibility for List view
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    serial: true,
    offer: true,
    discount: true,
    claims: true,
    views: true,
    status: true,
    verification: true,
    validity: true,
    creator: true,
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

  const setMemberEligibility = (v: string) =>
    updateParams({ memberEligibility: v === "ALL" ? null : v, page: null });

  const setSelectedCategory = (v: string) =>
    updateParams({ category: v === "ALL" ? null : v, page: null });

  const setSortBy = (v: string) =>
    updateParams({ sort: v === "newest" ? null : v, page: null });

  const setView = (v: "grid" | "list") =>
    updateParams({ view: v === "grid" ? null : v });

  const setPage = (p: number) =>
    updateParams({ page: p <= 1 ? null : String(p) });

  // ── Fetch Offers & Categories ─────────────────────────────────────────────
  const { data: offersData, loading, refetch } = useGetOffers(
    {
      categoryId: selectedCategory === "ALL" ? undefined : selectedCategory,
      status: status === "ALL" ? undefined : status,
      memberEligibility:
        memberEligibility === "ALL" ? undefined : (memberEligibility as any),
    },
    {
      fetchPolicy: "network-only",
    },
  );

  const { data: categoriesData } = useGetOfferCategories();
  const categories = categoriesData?.getOfferCategories || [];

  const [createOffer, { loading: isCreating }] = useCreateOffer({
    onCompleted: () => {
      toast.success(`${singularName} created successfully`);
      setIsDialogOpen(false);
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const [updateOffer, { loading: isUpdating }] = useUpdateOffer({
    onCompleted: () => {
      toast.success(`${singularName} updated successfully`);
      setIsDialogOpen(false);
      setEditingOffer(null);
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const allOffers: Offer[] = offersData?.getOffers || [];
  const totalCount = allOffers.length;

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setIsDialogOpen(true);
  };

  // ── Filter and Sort Offers ────────────────────────────────────────────────
  const filteredOffers = useMemo(() => {
    let list = [...allOffers];

    // Status filter
    if (status !== "ALL") {
      list = list.filter((o) => o.status === status);
    }

    // Eligibility filter
    if (memberEligibility !== "ALL") {
      list = list.filter((o) => {
        const elig =
          o.memberEligibility ||
          o.eligibility?.memberEligibility ||
          o.eligibilityRule?.memberEligibility;
        return elig === memberEligibility;
      });
    }

    // Category filter
    if (selectedCategory !== "ALL") {
      list = list.filter(
        (o) => o.category?.id === selectedCategory || o.category?.name === selectedCategory,
      );
    }

    // Search filter
    if (debouncedSearch) {
      const term = debouncedSearch.toLowerCase().trim();
      list = list.filter(
        (o) =>
          o.title?.toLowerCase().includes(term) ||
          o.description?.toLowerCase().includes(term) ||
          o.company?.toLowerCase().includes(term) ||
          o.discount?.toLowerCase().includes(term),
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
        case "claims":
          return (b.claimsCount || 0) - (a.claimsCount || 0);
        case "views":
          return (b.viewsCount || 0) - (a.viewsCount || 0);
        default:
          return 0;
      }
    });
  }, [allOffers, status, selectedCategory, debouncedSearch, sortBy]);

  // Paginated slice for current page
  const paginatedOffers = useMemo(() => {
    return filteredOffers.slice(offset, offset + limit);
  }, [filteredOffers, offset, limit]);

  const pageTitle =
    status === "ALL"
      ? moduleName
      : `${status.charAt(0) + status.slice(1).toLowerCase()} ${moduleName}`;

  const availableColumns = useMemo(
    () => getOfferTableColumns(singularName, handleEdit, refetch),
    [singularName, handleEdit, refetch],
  );

  return (
    <EcosystemWrapper className="gap-6">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <EcosystemHeader
        title={pageTitle}
        badgeText="Deals & Discounts"
        description={
          loading
            ? `Loading ${moduleName.toLowerCase()}…`
            : `${totalCount} total ${moduleName.toLowerCase()} in your directory.`
        }
        icon={Tag}
        breadcrumbs={[
          { label: moduleName, href: "/offers/all" },
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

          {/* Category Filter */}
          <EcosystemActionBar.Item>
            <Select
              value={selectedCategory}
              onValueChange={(v) => setSelectedCategory(v)}
            >
              <SelectTrigger className="w-[140px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[150px]">
                <SelectItem
                  value="ALL"
                  className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                >
                  All Categories
                </SelectItem>
                {categories.map((cat: any) => (
                  <SelectItem
                    key={cat.id}
                    value={cat.id}
                    className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                  >
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>

          {/* Eligibility Filter */}
          <EcosystemActionBar.Item>
            <MemberEligibilitySelect
              value={memberEligibility}
              onValueChange={setMemberEligibility}
              className="w-[145px]"
            />
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

          {/* Create CTA Button */}
          <Link href="/offers/create">
            <CtaButton>
              <Plus className="h-3.5 w-3.5" />
              Create {singularName}
            </CtaButton>
          </Link>

          <EcosystemActionBar.Separator />

          {/* Live Status Count */}
          <EcosystemActionBar.Status active={filteredOffers.length > 0}>
            Showing {filteredOffers.length} of {totalCount} {moduleName}
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Content Container ─────────────────────────────────────────────── */}
      <EcosystemContainer className="p-0 m-3 mt-0 border-none bg-transparent shadow-none ring-0 space-y-3">
        {/* Section Header (appears when filtered by non-ALL status) */}
        <SectionHeader
          status={status}
          count={filteredOffers.length}
          loading={loading}
        />

        {/* Content Area (Grid vs List with Motion) */}
        <ContentArea
          view={view}
          loading={loading}
          offers={paginatedOffers}
          onEdit={handleEdit}
          refetch={refetch}
          visibleColumns={visibleColumns}
          offset={offset}
        />

        {/* Pagination Controls */}
        {!loading && filteredOffers.length > limit && (
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(filteredOffers.length / limit)}
              totalItems={filteredOffers.length}
              pageSize={limit}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </EcosystemContainer>

      {/* ── Create / Edit Dialog ──────────────────────────────────────────── */}
      <OfferDialog
        isOpen={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingOffer(null);
        }}
        editingOffer={editingOffer}
        categories={categories}
        isLoading={isCreating || isUpdating}
        onSave={(values) => {
          if (editingOffer) {
            updateOffer({
              variables: {
                id: editingOffer.id,
                input: values,
              },
            });
          } else {
            createOffer({
              variables: {
                input: values,
              },
            });
          }
        }}
      />

      {/* ── Export Modal ─────────────────────────────────────────────────── */}
      <ExportOffersModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        offers={filteredOffers}
        totalCount={totalCount}
        matchingCount={
          debouncedSearch.trim() ||
          status !== "ALL" ||
          selectedCategory !== "ALL"
            ? filteredOffers.length
            : undefined
        }
      />
    </EcosystemWrapper>
  );
}

export default OffersManage;
