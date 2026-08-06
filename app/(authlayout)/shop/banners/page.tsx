"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import React, { useState } from "react";
import { CtaButton } from "@/components/ui/cta-button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { ImageIcon } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { arrayMove } from "@dnd-kit/sortable";
import {
  useShopBanners,
  useCreateShopBanner,
  useDeleteShopBanner,
  useReorderShopBanners,
} from "@/graphql/actions/shop";
import { BannerList } from "@/components/shop/banners/banner-list";
import { useRouter } from "next/navigation";

function BannerManagerPage() {
  const router = useRouter();
  const { data, loading } = useShopBanners();
  const [deleteBanner] = useDeleteShopBanner();
  const [reorderBanners] = useReorderShopBanners();

  const banners = data?.getShopBanners || [];

  const handleRemoveBanner = async (id: string) => {
    try {
      await deleteBanner({
        variables: { id },
      });
      toast.success("Banner removed.");
    } catch (error: any) {
      toast.error("Failed to remove banner: " + error.message);
    }
  };

  const handleReorder = async (activeId: string, overId: string) => {
    const oldIndex = banners.findIndex((i: any) => i.id === activeId);
    const newIndex = banners.findIndex((i: any) => i.id === overId);

    const newBanners = arrayMove(banners, oldIndex, newIndex);

    try {
      await reorderBanners({
        variables: {
          bannerOrders: newBanners.map((b: any, idx: number) => ({
            id: b.id,
            sortOrder: idx,
          })),
        },
      });
    } catch (error: any) {
      toast.error("Failed to reorder banners: " + error.message);
    }
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Shop Banners"
        badgeText="Marketing Assets"
        description="Manage your store's featured images and marketing carousel."
        icon={ImageIcon}
        breadcrumbs={[
          { label: "Marketplace", href: "/shop/all" },
          { label: "Banners" }
        ]}
        actions={
          <CtaButton onClick={() => router.push("/shop/banners/create")}>
            <Plus className="h-3.5 w-3.5" />
            Add New Banner
          </CtaButton>
        }
      />

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <BannerList
          banners={banners}
          loading={loading}
          onRemove={handleRemoveBanner}
          onReorder={handleReorder}
          onEdit={(id) => router.push(`/shop/banners/${id}/edit`)}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default withSubscriptionCheck(
  withModulePermission(BannerManagerPage, "SHOP", "canRead"),
  "shop"
);
