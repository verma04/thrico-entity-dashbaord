"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useShopProduct,
  useUpdateShopProduct,
  useUpdateShopProductVariant,
  useCreateShopProductVariant,
  useUpdateShopProductMedia,
  useUpdateShopProductOptions,
} from "@/graphql/actions/shop";
import { useGetEntity } from "@/graphql/actions";
import { ProductCreationForm } from "@/components/shop/product-creation-form";
import { ProductFormValues } from "@/components/shop/product-form";
import { useShopStore } from "@/store/useShopStore";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [isSavingVariants, setIsSavingVariants] = useState(false);

  const { data, loading, error, refetch } = useShopProduct(id);
  const { data: entityData } = useGetEntity();
  const { variants, options, hasVariants } = useShopStore();

  const [updateProduct, { loading: updating }] = useUpdateShopProduct({
    onCompleted: () => {
      toast.success("General info updated successfully!");
      refetch();
    },
    onError: (err) => {
      toast.error("Failed to update product: " + err.message);
    },
  });

  const [updateMedia, { loading: updatingMedia }] = useUpdateShopProductMedia({
    onCompleted: () => {
      toast.success("Media updated successfully!");
      refetch();
    },
    onError: (err) => {
      toast.error("Failed to update media: " + err.message);
    },
  });

  const [updateOptions, { loading: updatingOptions }] =
    useUpdateShopProductOptions({
      onCompleted: () => {
        toast.success("Options updated successfully!");
        refetch();
      },
      onError: (err) => {
        toast.error("Failed to update options: " + err.message);
      },
    });

  const [updateVariant] = useUpdateShopProductVariant();

  const product = data?.getShopProduct;

  const initialValues = useMemo(() => {
    if (!product) return undefined;

    const existingImages = product.media?.map((m: any) => m.url) || [];

    return {
      title: product.title,
      price: product.price,
      currency: product.currency || "USD",
      category: product.category,
      image: existingImages[0] || "",
      images: existingImages,
      isOutOfStock: product.isOutOfStock || false,
      externalLink: product.externalLink || "",
      description: product.description || "",
      sku: product.sku || product.variants?.[0]?.sku || "",
      hasVariants: product.hasVariants || false,
      options: product.options || [],
      variants: product.variants || [],
    } as ProductFormValues;
  }, [product]);

  const handleSaveGeneral = async (values: ProductFormValues) => {
    await updateProduct({
      variables: {
        id: product.id,
        input: {
          title: values.title,
          price: values.price,
          description: values.description,
          category: values.category,
          sku: values.sku || values.variants?.[0]?.sku || "",
          currency: values.currency,
          isOutOfStock: values.isOutOfStock,
          externalLink: values.externalLink,
          hasVariants: values.hasVariants,
        },
      },
    });
  };

  const handleSaveMedia = async (values: ProductFormValues) => {
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

    await updateMedia({
      variables: {
        productId: product.id,
        media: media,
      },
    });
  };

  const handleSaveVariants = async () => {
    if (!hasVariants) {
      toast.info("Variants are disabled.");
      return;
    }

    try {
      const promises = variants.map((v: any) => {
        return {
          id: v.id,
          title: v.title,
          sku: v.sku,
          price: v.price || "0",
          currency: product.currency || "USD",
          inventory: parseInt(v.inventory?.toString() || "0"),
          isOutOfStock: v.isOutOfStock,
          options: v.options,
          image: v.image,
          externalLink: v.externalLink,
        };
      });

      console.log({
        productId: product.id,
        input: promises,
      });

      updateVariant({
        variables: {
          productId: product.id,
          input: promises,
        },
      });

      setIsSavingVariants(true);
      await Promise.all(promises);
      toast.success("All variants saved successfully!");
      refetch();
    } catch (e: any) {
      toast.error("Error saving variants: " + e.message);
    } finally {
      setIsSavingVariants(false);
    }
  };

  const handleSaveOptions = async () => {
    try {
      const input = options.map((opt: any) => ({
        name: opt.name,
        values: opt.values.map((v: any) => v.value),
      }));

      await updateOptions({
        variables: {
          productId: product.id,
          input,
        },
      });
    } catch (e: any) {
      toast.error("Error saving options: " + e.message);
    }
  };

  const categories = [
    { id: "clothing", name: "Clothing" },
    { id: "electronics", name: "Electronics" },
    { id: "digital", name: "Digital Goods" },
    { id: "services", name: "Services" },
    { id: "merch", name: "Merchandise" },
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-xl font-bold">Product not found</h1>
        <Button onClick={() => router.push("/shop/all")}>Back to list</Button>
      </div>
    );
  }

  return (
    <Sheet open={true} onOpenChange={() => router.push("/shop/all")}>
      <SheetContent
        side="top"
        className="h-[100dvh] w-screen p-0 border-none outline-none dark:bg-zinc-950"
      >
        <div className="h-full bg-background overflow-hidden flex flex-col">
          <div className="px-6 pt-4 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => router.push("/shop/all")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Store
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
            <ProductCreationForm
              initialValues={initialValues}
              loading={
                updating || updatingMedia || updatingOptions || isSavingVariants
              }
              onFinish={handleSaveGeneral}
              onSaveMedia={handleSaveMedia}
              onSaveOptions={handleSaveOptions}
              onSaveVariants={handleSaveVariants}
              onCancel={() => router.push("/shop/all")}
              categories={categories}
              entityName={entityData?.getEntity?.name || "Store"}
              mode="edit"
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
