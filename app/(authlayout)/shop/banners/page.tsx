"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { ImageIcon } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
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
      />

      <EcosystemActionBar>
        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Item>
            <Button
              onClick={() => router.push("/shop/banners/create")}
              className="font-semibold text-xs px-4 h-9 rounded-lg shadow-sm gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Plus className="h-4 w-4" /> Add New Banner
            </Button>
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Status active={banners.length > 0}>
            {banners.length} Banners
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

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
