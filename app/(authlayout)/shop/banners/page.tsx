"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { arrayMove } from "@dnd-kit/sortable";
import {
  useShopBanners,
  useCreateShopBanner,
  useDeleteShopBanner,
  useReorderShopBanners,
} from "@/graphql/actions/shop";
import { BannerList } from "@/components/shop/banners/banner-list";
import { BannerDialog } from "@/components/shop/banners/banner-dialog";

export default function BannerManagerPage() {
  const { data, loading } = useShopBanners();
  const [createBanner, { loading: creating }] = useCreateShopBanner();
  const [deleteBanner] = useDeleteShopBanner();
  const [reorderBanners] = useReorderShopBanners();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const banners = data?.getShopBanners || [];

  const handleCreateBanner = async (input: {
    title: string;
    image: string;
    linkedProductId?: string | null;
  }) => {
    try {
      await createBanner({
        variables: {
          input: {
            ...input,
            sortOrder: banners.length,
            isActive: true,
          },
        },
      });
      toast.success("Banner added successfully!");
    } catch (error: any) {
      toast.error("Failed to add banner: " + error.message);
      throw error;
    }
  };

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
    <div className="p-6 space-y-8 max-w-6xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 border-border/50">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shop Banners</h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Manage your store's featured images and marketing carousel.
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => setIsDialogOpen(true)}
          className="shadow-md hover:shadow-lg transition-shadow"
        >
          <Plus className="mr-2 h-5 w-5" /> Add New Banner
        </Button>
      </div>

      <BannerList
        banners={banners}
        loading={loading}
        onRemove={handleRemoveBanner}
        onReorder={handleReorder}
      />

      <BannerDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleCreateBanner}
        isLoading={creating}
      />
    </div>
  );
}
