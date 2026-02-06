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
import { ShopHeader } from "@/components/shop/shop-header";
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
    <div className="p-6 space-y-6">
      <ShopHeader
        search={search}
        onSearchChange={setSearch}
        onAddProduct={handleCreate}
      />

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

      <ProductSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        loading={creating}
        onSubmit={handleSubmit}
        categories={categories}
        entityName={entityData?.getEntity?.name || "Store"}
        mode="create"
      />
    </div>
  );
}
