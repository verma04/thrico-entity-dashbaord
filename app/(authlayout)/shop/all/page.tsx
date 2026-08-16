"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import React, { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import {
  useShopProducts,
  useCreateShopProduct,
  useUpdateShopProduct,
  useDeleteShopProduct,
} from "@/graphql/actions/shop";
import { useGetEntity } from "@/graphql/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Plus, Search, Filter, LayoutGrid, List as ListIcon, Tag, RefreshCw, Upload } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { ProductTable } from "@/components/shop/product-table";
import { ProductCard } from "@/components/shop/product-card";
import { ProductSheet } from "@/components/shop/product-sheet";
import { ProductFormValues } from "@/components/shop/product-form";
import { toast } from "sonner";
import { CtaButton } from "@/components/ui/cta-button";
import { motion, AnimatePresence } from "framer-motion";
import TableLoading from "@/components/layout/table-loading";
import { useModuleStore } from "@/store/useModuleStore";
import { cn } from "@/lib/utils";

function ShopPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  const moduleName = useModuleStore((state) => state.shopModuleName);
  const singularName = useModuleStore((state) => state.shopSingularName);

  const view = (searchParams.get("view") as "grid" | "table") || "grid";
  const setView = (v: "grid" | "table") =>
    updateParams({ view: v === "grid" ? null : v });

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [debouncedSearch] = useDebounce(search, 500);

  // Sync debounced search to URL
  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (debouncedSearch.trim() !== currentQ) {
      updateParams({ q: debouncedSearch.trim() || null });
    }
  }, [debouncedSearch, searchParams, updateParams]);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (searchParams.get("action") === "create") {
      setIsSheetOpen(true);
    }
  }, [searchParams]);

  // Reset to first page when search changes
  useEffect(() => {
    setPageIndex(0);
  }, [debouncedSearch]);

  const { data, loading, error, refetch } = useShopProducts({
    pagination: {
      limit: pageSize,
      offset: pageIndex * pageSize,
    },
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

  const products = data?.getShopProducts || [];

  const filteredProducts = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
    if (!q) return products;
    return products.filter((product) =>
      product.title?.toLowerCase().includes(q) ||
      product.category?.toLowerCase().includes(q) ||
      product.sku?.toLowerCase().includes(q),
    );
  }, [products, debouncedSearch]);

  const handleCreate = () => {
    setIsSheetOpen(true);
  };

  const handleSubmit = async (values: ProductFormValues) => {
    // Determine images array
    const imageList =
      values.images && values.images.length > 0
        ? values.images
        : values.image
          ? [values.image]
          : [];

    // Construct media object for GraphQL
    const media = imageList.map((url, index) => ({
      url,
      sortOrder: index,
    }));

    // Create
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

  const categories = [
    { id: "clothing", name: "Clothing" },
    { id: "electronics", name: "Electronics" },
    { id: "digital", name: "Digital Goods" },
    { id: "services", name: "Services" },
    { id: "merch", name: "Merchandise" },
  ];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={moduleName}
        badgeText="Shop Directory"
        description={`Manage your ${moduleName.toLowerCase()}, inventory, and variants.`}
        icon={ShoppingBag}
        breadcrumbs={[
          { label: moduleName, href: "/shop" },
          { label: "All" }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch?.()}
              className="h-9 w-9 rounded-lg border-border text-muted-foreground hover:text-foreground transition-all"
            >
              <RefreshCw
                className={cn("h-3.5 w-3.5", loading && "animate-spin")}
              />
            </Button>
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
          <EcosystemActionBar.Item>
            <CtaButton
              onClick={handleCreate}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add {singularName}
            </CtaButton>
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Status active={filteredProducts.length > 0}>
            Showing {filteredProducts.length} of {products.length} {moduleName}
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <AnimatePresence mode="wait">
          {loading ? (
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
                  {filteredProducts.map((product: any) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      refetch={refetch} 
                    />
                  ))}
                  {filteredProducts.length === 0 && (
                    <div className="col-span-full py-20 text-center border border-dashed border-border rounded-xl bg-muted/20">
                      <div className="h-12 w-12 bg-muted rounded-xl flex items-center justify-center mx-auto mb-3 text-muted-foreground/40">
                        <Tag className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">No {moduleName.toLowerCase()} found</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Try adjusting your search or filters, or create a new {singularName.toLowerCase()}.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <ProductTable
                  products={filteredProducts}
                  loading={loading}
                  refetch={refetch}
                  pageIndex={pageIndex}
                  pageSize={pageSize}
                  onPageChange={setPageIndex}
                  onPageSizeChange={(size: number) => {
                    setPageSize(size);
                    setPageIndex(0); // Reset to first page when page size changes
                  }}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </EcosystemContainer>

      <ProductSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        loading={creating}
        onSubmit={handleSubmit}
        categories={categories}
        entityName={entityData?.getEntity?.name || "Store"}
        mode="create"
      />

      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName={moduleName.toLowerCase()}
        description={`Export shop products as CSV. Includes product title, description, price, stock, and categories.`}
        totalCount={products.length}
        matchingCount={debouncedSearch.trim() ? filteredProducts.length : undefined}
        onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
          const rows = filteredProducts;
          if (rows.length === 0) {
            toast.error("Nothing to export", { description: `No ${moduleName.toLowerCase()} found.` });
            return;
          }
          const csv = buildCsv(rows, [
            { header: "Title", getValue: (p) => p.title || "" },
            { header: "Description", getValue: (p) => p.description || "" },
            { header: "Price", getValue: (p) => p.price ?? "" },
            { header: "Stock", getValue: (p) => p.stock ?? "" },
            { header: "Category", getValue: (p) => p.category?.name || p.categoryName || "" },
            { header: "Status", getValue: (p) => p.status || (p.isPublished ? "Published" : "Draft") },
          ]);
          downloadCsv(csv, `shop-products-${new Date().toISOString().slice(0, 10)}`, format);
          toast.success("Export ready", { description: `${rows.length} ${singularName.toLowerCase()}${rows.length !== 1 ? "s" : ""} exported.` });
        }}
      />
    </EcosystemWrapper>
  );
}

export default withSubscriptionCheck(
  withModulePermission(ShopPage, "SHOP", "canRead"),
  "shop"
);
