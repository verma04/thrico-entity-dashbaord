"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import React from "react";
import { useRouter } from "next/navigation";
import { useCreateShopProduct } from "@/graphql/actions/shop/shop-hooks";
import { ProductCreationForm } from "@/components/shop/product-creation-form";
import { useToast } from "@/components/ui/use-toast";
import { useModuleStore } from "@/store/useModuleStore";

import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Store } from "lucide-react";

const CreateProductPage = () => {
  const singularName = useModuleStore((state) => state.shopSingularName);
  const router = useRouter();
  const { toast } = useToast();

  const [create, { loading }] = useCreateShopProduct({
    onCompleted: (data: any) => {
      toast({
        title: "Success",
        description: `${singularName} created successfully!`,
      });
      router.push("/shop/all");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.message || `Failed to create ${singularName.toLowerCase()}`,
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

  const moduleName = useModuleStore((state) => state.shopModuleName);

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={`Create ${singularName}`}
        badgeText="Storefront"
        description={`Publish a new ${singularName.toLowerCase()} to your community storefront.`}
        icon={Store}
        breadcrumbs={[
          { label: moduleName, href: "/shop/all" },
          { label: `Create ${singularName}` },
        ]}
      />
      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        <ProductCreationForm
          loading={loading}
          onFinish={onFinish}
          onCancel={onCancel}
          categories={categories}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
};

export default withSubscriptionCheck(
  withModulePermission(CreateProductPage, "SHOP", "canCreate"),
  "shop",
);
