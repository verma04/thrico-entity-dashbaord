"use client";

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
    create({
      variables: {
        input: {
          title: values.title,
          description: values.description,
          price: values.price,
          currency: values.currency,
          category: values.category,
          image: values.image,
          images: values.images,
          isOutOfStock: values.isOutOfStock,
          externalLink: values.externalLink,
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

export default CreateProductPage;
