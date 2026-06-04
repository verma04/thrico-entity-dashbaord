"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import React from "react";
import { useRouter } from "next/navigation";
import { useCreateShopProduct } from "@/graphql/actions/shop/shop-hooks";
import { ProductCreationForm } from "@/components/shop/product-creation-form";
import { useToast } from "@/components/ui/use-toast";

const CreateProductPage = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [create, { loading }] = useCreateShopProduct({
    onCompleted: (data: any) => {
      toast({
        title: "Success",
        description: "Product created successfully!",
      });
      router.push("/shop/all");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create product",
        variant: "destructive",
      });
    },
  });

  const onFinish = (values: any) => {
    // Determine images array
    const imageList =
      values.images && values.images.length > 0
        ? values.images
        : values.image
          ? [values.image]
          : [];

    // Construct media object for GraphQL
    const media = imageList.map((url: string, index: number) => ({
      url,
      sortOrder: index,
    }));

    create({
      variables: {
        input: {
          title: values.title,
          description: values.description,
          price: values.price,
          currency: values.currency,
          category: values.category,
          sku: values.variants?.[0]?.sku || "",
          media: media,
          isOutOfStock: values.isOutOfStock,
          externalLink: values.externalLink,
          hasVariants: values.hasVariants,
          options: values.options,
        },
      },
    });
  };

  const onCancel = () => {
    router.back();
  };

  const categories = [
    { id: "clothing", name: "Clothing" },
    { id: "electronics", name: "Electronics" },
    { id: "digital", name: "Digital" },
    { id: "merch", name: "Merchandise" },
    { id: "services", name: "Services" },
  ];

  return (
    <div className="h-full overflow-hidden">
      <ProductCreationForm
        loading={loading}
        onFinish={onFinish}
        onCancel={onCancel}
        categories={categories}
      />
    </div>
  );
};

export default withSubscriptionCheck(
  withModulePermission(CreateProductPage, "SHOP", "canCreate"),
  "shop",
);
