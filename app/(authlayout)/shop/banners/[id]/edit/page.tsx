"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useShopBanners, useUpdateShopBanner } from "@/graphql/actions/shop";
import { BannerCreationForm } from "@/components/shop/banners/banner-creation-form";
import { toast } from "sonner";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { Loader2 } from "lucide-react";

const EditBannerPage = () => {
  const router = useRouter();
  const params = useParams();
  const bannerId = params.id as string;

  const { data, loading: fetchLoading } = useShopBanners();
  const banners = data?.getShopBanners || [];
  const banner = banners.find((b: any) => b.id === bannerId);

  const [updateBanner, { loading }] = useUpdateShopBanner({
    onCompleted: () => {
      toast.success("Banner updated successfully!");
      router.push("/shop/banners");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update banner");
    },
  });

  const onFinish = (values: any) => {
    const input: any = {
      title: values.title,
      linkedProductId: values.linkedProductId || null,
    };

    // Only send image if user uploaded a new file
    if (values.image instanceof File) {
      input.image = values.image;
    }

    updateBanner({
      variables: {
        id: bannerId,
        input,
      },
    });
  };

  const onCancel = () => {
    router.back();
  };

  if (fetchLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-medium">
            Loading banner...
          </p>
        </div>
      </div>
    );
  }

  if (!banner) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Banner not found.</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden">
      <BannerCreationForm
        initialValues={{
          id: banner.id,
          title: banner.title,
          image: banner.image,
          linkedProductId: banner.linkedProductId,
        }}
        loading={loading}
        onFinish={onFinish}
        onCancel={onCancel}
      />
    </div>
  );
};

export default withSubscriptionCheck(
  withModulePermission(EditBannerPage, "SHOP", "canEdit"),
  "shop",
);
