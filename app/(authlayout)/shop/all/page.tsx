"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  useShopProducts,
  useCreateShopProduct,
  useUpdateShopProduct,
  useDeleteShopProduct,
} from "@/graphql/actions/shop";
import { useGetEntity } from "@/graphql/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Plus, Search, Filter, LayoutGrid, List as ListIcon, Tag } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { ProductTable } from "@/components/shop/product-table";
import { ProductCard } from "@/components/shop/product-card";
import { ProductSheet } from "@/components/shop/product-sheet";
import { ProductFormValues } from "@/components/shop/product-form";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import TableLoading from "@/components/layout/table-loading";
import { useModuleStore } from "@/store/useModuleStore";

function ShopPage() {
  const moduleName = useModuleStore((state) => state.shopModuleName);
  const singularName = useModuleStore((state) => state.shopSingularName);
  const [view, setView] = useState<"grid" | "table">("grid");
  const [search, setSearch] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("action") === "create") {
      setIsSheetOpen(true);
    }
  }, [searchParams]);

  // Reset to first page when search changes
  useEffect(() => {
    setPageIndex(0);
  }, [search]);

  // Debug logging
  useEffect(() => {
    console.log("[Pagination Debug] State:", {
      pageIndex,
      pageSize,
      offset: pageIndex * pageSize,
    });
  }, [pageIndex, pageSize]);

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

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase()),
  );

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
        actions={
          <div className="flex items-center gap-2">
            <Tabs
              value={view}
              onValueChange={(val: string) => setView(val as "grid" | "table")}
              className="bg-muted p-0.5 rounded-lg border border-border mr-2"
            >
              <TabsList className="bg-transparent border-none h-auto p-0 gap-0.5">
                <TabsTrigger
                  value="grid"
                  className="h-8 px-3 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all text-xs font-medium"
                >
                  <LayoutGrid className="h-3.5 w-3.5 mr-1.5" />
                  Grid
                </TabsTrigger>
                <TabsTrigger
                  value="table"
                  className="h-8 px-3 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all text-xs font-medium"
                >
                  <ListIcon className="h-3.5 w-3.5 mr-1.5" />
                  Table
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button onClick={handleCreate} className="font-semibold text-xs px-6 h-10 rounded-lg shadow-sm gap-2">
              <Plus className="h-4 w-4" />
              Add {singularName}
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
              placeholder={`Search ${moduleName.toLowerCase()}...`}
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group>
           <EcosystemActionBar.Item>
             <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg border border-border text-muted-foreground hover:text-foreground">
                <Filter className="h-4 w-4" />
             </Button>
           </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Status active={filteredProducts.length > 0}>
             {filteredProducts.length} {moduleName}
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
    </EcosystemWrapper>
  );
}

export default withSubscriptionCheck(
  withModulePermission(ShopPage, "SHOP", "canRead"),
  "shop"
);
