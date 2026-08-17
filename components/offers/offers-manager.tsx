"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import {
  useGetOffers,
  useGetOfferCategories,
  useCreateOffer,
  useUpdateOffer,
  Offer,
} from "@/graphql/actions/offers";
import { OffersTable } from "./offers-table";
import { OfferCard } from "./offer-card";
import { OfferDialog } from "./offer-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  CtaSelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type {
  ExportCsvScope,
  ExportCsvFormat,
} from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import {
  Plus,
  LayoutGrid,
  List as ListIcon,
  Tag,
  RefreshCw,
  Upload,
} from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import TableLoading from "@/components/layout/table-loading";

import { useModuleStore } from "@/store/useModuleStore";
import { CtaButton } from "@/components/ui/cta-button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function OffersManager() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (
          value === null ||
          value === "" ||
          value === "ALL" ||
          value === "all" ||
          value === "0"
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

  const moduleName = useModuleStore((state) => state.offerModuleName);
  const singularName = useModuleStore((state) => state.offerSingularName);

  const view = (searchParams.get("view") as "grid" | "table") || "table";
  const setView = (v: "grid" | "table") =>
    updateParams({ view: v === "table" ? null : v });

  const selectedCategory = searchParams.get("category") || "all";
  const setSelectedCategory = (v: string) =>
    updateParams({ category: v === "all" ? null : v });

  const selectedStatus = searchParams.get("status") || "all";
  const setSelectedStatus = (v: string) =>
    updateParams({ status: v === "all" ? null : v });

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [debouncedSearch] = useDebounce(search, 500);

  // Sync debounced search to URL
  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (debouncedSearch.trim() !== currentQ) {
      updateParams({ q: debouncedSearch.trim() || null });
    }
  }, [debouncedSearch, searchParams, updateParams]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  // Queries
  const {
    data: offersData,
    loading: offersLoading,
    refetch: refetchOffers,
  } = useGetOffers(
    {
      search: debouncedSearch.trim() || undefined,
      categoryId: selectedCategory === "all" ? undefined : selectedCategory,
      status: selectedStatus === "all" ? undefined : selectedStatus,
    },
    {
      fetchPolicy: "cache-and-network",
    },
  );

  const { data: categoriesData } = useGetOfferCategories();

  // Mutations
  const [createOffer, { loading: isCreating }] = useCreateOffer({
    onCompleted: () => {
      toast.success(`${singularName} created successfully`);
      setIsDialogOpen(false);
      refetchOffers();
    },
    onError: (error) => toast.error(error.message),
  });

  const [updateOffer, { loading: isUpdating }] = useUpdateOffer({
    onCompleted: () => {
      toast.success(`${singularName} updated successfully`);
      setIsDialogOpen(false);
      setEditingOffer(null);
      refetchOffers();
    },
    onError: (error) => toast.error(error.message),
  });

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setIsDialogOpen(true);
  };

  const rawOffers = offersData?.getOffers || [];
  const offers = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
    if (!q) return rawOffers;
    return rawOffers.filter(
      (o: any) =>
        o.title?.toLowerCase().includes(q) ||
        o.description?.toLowerCase().includes(q) ||
        o.code?.toLowerCase().includes(q),
    );
  }, [rawOffers, debouncedSearch]);

  const categories = categoriesData?.getOfferCategories || [];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={`All ${moduleName}`}
        badgeText="Marketing & Discounts"
        description={`Manage all active and inactive ${moduleName.toLowerCase()} across the platform.`}
        icon={Tag}
        breadcrumbs={[{ label: moduleName, href: "/offers" }, { label: "All" }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetchOffers?.()}
              className="h-9 w-9 rounded-lg border-border text-muted-foreground hover:text-foreground transition-all"
            >
              <RefreshCw
                className={cn("h-3.5 w-3.5", offersLoading && "animate-spin")}
              />
            </Button>
            <Link href="/offers/create">
              <CtaButton>
                <Plus className="h-3.5 w-3.5" />
                Create {singularName}
              </CtaButton>
            </Link>
          </div>
        }
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder={`Search ${moduleName.toLowerCase()}…`}
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <CtaSelectTrigger className="w-[140px]">
                <div className="flex items-center gap-1.5">
                  <LayoutGrid className="h-3 w-3 text-muted-foreground" />
                  <SelectValue placeholder="All Categories" />
                </div>
              </CtaSelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[140px]">
                <SelectItem
                  value="all"
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

          <EcosystemActionBar.Item>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <CtaSelectTrigger className="w-[120px]">
                <SelectValue placeholder="All Status" />
              </CtaSelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[120px]">
                <SelectItem
                  value="all"
                  className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                >
                  All Status
                </SelectItem>
                <SelectItem
                  value="ACTIVE"
                  className="rounded-sm text-xs font-medium py-1 px-2 text-emerald-600 cursor-pointer"
                >
                  Active
                </SelectItem>
                <SelectItem
                  value="INACTIVE"
                  className="rounded-sm text-xs font-medium py-1 px-2 text-muted-foreground cursor-pointer"
                >
                  Inactive
                </SelectItem>
                <SelectItem
                  value="EXPIRED"
                  className="rounded-sm text-xs font-medium py-1 px-2 text-rose-600 cursor-pointer"
                >
                  Expired
                </SelectItem>
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Item>
            <Button
              variant="outline"
              onClick={() => setShowExportModal(true)}
              className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5"
            >
              <Upload className="h-3.5 w-3.5" />
              Export
            </Button>
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Item>
            <EcosystemActionBar.ViewToggle
              value={view}
              onChange={(val) => setView(val as "grid" | "table")}
              options={[
                { id: "grid", label: "Grid", icon: LayoutGrid },
                { id: "table", label: "Table", icon: ListIcon },
              ]}
            />
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Status active={offers.length > 0}>
            Showing {offers.length} of {rawOffers.length} {moduleName}
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <AnimatePresence mode="wait">
          {offersLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TableLoading />
            </motion.div>
          ) : (
            <motion.div
              key={view}
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.01 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {view === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {offers.map((offer: Offer) => (
                    <OfferCard
                      key={offer.id}
                      offer={offer}
                      onEdit={handleEdit}
                      refetch={refetchOffers}
                    />
                  ))}
                  {offers.length === 0 && (
                    <div className="col-span-full py-20 text-center border border-dashed border-border rounded-xl bg-muted/20">
                      <div className="h-12 w-12 bg-muted rounded-xl flex items-center justify-center mx-auto mb-3 text-muted-foreground/40">
                        <Tag className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        No {moduleName.toLowerCase()} found
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Try adjusting your search or filters, or create a new{" "}
                        {singularName.toLowerCase()}.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <OffersTable
                  offers={offers}
                  isLoading={offersLoading}
                  onEdit={handleEdit}
                  refetch={refetchOffers}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </EcosystemContainer>

      {/* Create/Edit Dialog */}
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

      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName={moduleName.toLowerCase()}
        description={`Export ${moduleName.toLowerCase()} directory as CSV. Includes title, description, code, discount, category, and status.`}
        totalCount={rawOffers.length}
        matchingCount={
          debouncedSearch.trim() ||
          selectedCategory !== "all" ||
          selectedStatus !== "all"
            ? offers.length
            : undefined
        }
        onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
          const rows = offers;
          if (rows.length === 0) {
            toast.error("Nothing to export", {
              description: `No ${moduleName.toLowerCase()} found.`,
            });
            return;
          }
          const csv = buildCsv(rows, [
            { header: "Title", getValue: (o) => o.title || "" },
            { header: "Description", getValue: (o) => o.description || "" },
            { header: "Promo Code", getValue: (o) => o.code || "" },
            {
              header: "Discount Value",
              getValue: (o) =>
                o.discountValue
                  ? `${o.discountValue}${o.discountType === "PERCENTAGE" ? "%" : ""}`
                  : "",
            },
            { header: "Category", getValue: (o) => o.category?.name || "" },
            { header: "Status", getValue: (o) => o.status || "" },
            {
              header: "Valid Until",
              getValue: (o) =>
                o.endDate ? new Date(o.endDate).toISOString().slice(0, 10) : "",
            },
          ]);
          downloadCsv(
            csv,
            `offers-${new Date().toISOString().slice(0, 10)}`,
            format,
          );
          toast.success("Export ready", {
            description: `${rows.length} ${moduleName.toLowerCase()} exported.`,
          });
        }}
      />
    </EcosystemWrapper>
  );
}
