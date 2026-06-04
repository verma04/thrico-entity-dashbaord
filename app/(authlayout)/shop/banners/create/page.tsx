"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCreateShopBanner, useShopBanners } from "@/graphql/actions/shop";
import { BannerCreationForm } from "@/components/shop/banners/banner-creation-form";
import { toast } from "sonner";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

const CreateBannerPage = () => {
  const router = useRouter();
  
  // We need to fetch the banners to know what sort order to set
  const { data } = useShopBanners();
  const banners = data?.getShopBanners || [];

  const [createBanner, { loading }] = useCreateShopBanner({
    onCompleted: () => {
      toast.success("Banner created successfully!");
      router.push("/shop/banners");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create banner");
    },
  });

  const onFinish = (values: any) => {
    createBanner({
      variables: {
        input: {
          ...values,
          sortOrder: banners.length,
          isActive: true,
        },
      },
    });
  };

  const onCancel = () => {
    router.back();
  };

  return (
    <div className="h-full overflow-hidden">
      <BannerCreationForm
        initialValues={{}}
        loading={loading}
        onFinish={onFinish}
        onCancel={onCancel}
      />
    </div>
  );
};

export default withSubscriptionCheck(
  withModulePermission(CreateBannerPage, "SHOP", "canCreate"),
  "shop"
);
