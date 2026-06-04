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
        actions={
          <Button
            onClick={() => router.push("/shop/banners/create")}
            className="font-semibold text-xs px-6 h-10 rounded-lg shadow-sm gap-2"
          >
            <Plus className="h-4 w-4" /> Add New Banner
          </Button>
        }
      />

      <EcosystemActionBar>
        <div className="flex items-center gap-2 relative z-10 ml-auto pr-4">
          <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 uppercase tracking-wide whitespace-nowrap">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {banners.length} Banners
          </div>
        </div>
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
