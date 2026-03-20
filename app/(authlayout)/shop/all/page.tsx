"use client";

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
import { ShoppingBag, Plus, Search, Filter } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { ProductTable } from "@/components/shop/product-table";
import { ProductSheet } from "@/components/shop/product-sheet";
import { ProductFormValues } from "@/components/shop/product-form";
import { toast } from "sonner";

export default function ShopPage() {
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
      toast.success("Product created successfully!");
      setIsSheetOpen(false);
      refetch();
    },
    onError: (err) => {
      toast.error("Failed to create product: " + err.message);
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
        title="Products"
        badgeText="Shop Directory"
        description="Manage your shop products, inventory, and variants."
        icon={ShoppingBag}
        actions={
          <Button onClick={handleCreate} className="font-semibold text-xs px-6 h-10 rounded-lg shadow-sm gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        }
      />

      <EcosystemActionBar>
        <div className="relative w-full md:max-w-[400px] group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-12 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-4 focus-visible:ring-indigo-500/5 transition-all font-medium text-slate-700 placeholder:text-slate-400 border shadow-sm"
          />
        </div>

        <div className="flex items-center gap-4 pr-4 ml-auto">
           <Button variant="outline" size="icon" className="h-10 w-10 rounded-lg border border-slate-200 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 shadow-sm">
              <Filter className="h-4 w-4" />
           </Button>
           <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 uppercase tracking-wide whitespace-nowrap">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {filteredProducts.length} Products
           </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">

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
