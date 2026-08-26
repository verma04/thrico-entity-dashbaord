"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { StoreBanner } from "./store-banner";
import { StoreRewardsManage } from "./table";
import { StoreRewardDrawer } from "./drawer";
import { StoreHowItWorksDrawer } from "./help";
import { StoreRewardItem } from "./types";

interface PillarTwoStoreProps {
  isExternalDrawerOpen?: boolean;
  setIsExternalDrawerOpen?: (open: boolean) => void;
  isExternalHowItWorksOpen?: boolean;
  setIsExternalHowItWorksOpen?: (open: boolean) => void;
  initialEditId?: string | null;
}

export const PillarTwoStore: React.FC<PillarTwoStoreProps> = ({
  isExternalDrawerOpen,
  setIsExternalDrawerOpen,
  isExternalHowItWorksOpen,
  setIsExternalHowItWorksOpen,
  initialEditId,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [internalDrawerOpen, setInternalDrawerOpen] = useState(false);
  const [internalHowItWorksOpen, setInternalHowItWorksOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StoreRewardItem | null>(null);

  const isDrawerOpen =
    isExternalDrawerOpen !== undefined ? isExternalDrawerOpen : internalDrawerOpen;
  const setIsDrawerOpen = (open: boolean) => {
    if (setIsExternalDrawerOpen) setIsExternalDrawerOpen(open);
    setInternalDrawerOpen(open);
  };

  const isHowItWorksOpen =
    isExternalHowItWorksOpen !== undefined
      ? isExternalHowItWorksOpen
      : internalHowItWorksOpen;
  const setIsHowItWorksOpen = (open: boolean) => {
    if (setIsExternalHowItWorksOpen) setIsExternalHowItWorksOpen(open);
    setInternalHowItWorksOpen(open);
  };

  const handleOpenCreate = () => {
    router.push("/gamification/rewards/pillars/store/add");
  };

  const handleOpenEdit = (item: StoreRewardItem) => {
    router.push(`/gamification/rewards/pillars/store/${item.id}/edit`);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingItem(null);
    if (searchParams.get("edit")) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("edit");
      router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`, {
        scroll: false,
      });
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in-50 duration-200">
      {/* Header Banner with Create & How It Works triggers */}
      <StoreBanner
        onCreateClick={handleOpenCreate}
        onHowItWorksClick={() => setIsHowItWorksOpen(true)}
      />

      {/* Master Directory & Table View (List & Grid) */}
      <div className="space-y-3">
        <StoreRewardsManage
          onCreateClick={handleOpenCreate}
          onEditClick={handleOpenEdit}
        />
      </div>

      {/* Store Reward Creation / Editing Drawer */}
      <StoreRewardDrawer
        isOpen={isDrawerOpen}
        initialItem={editingItem}
        id={initialEditId || undefined}
        onClose={handleCloseDrawer}
        onSuccess={() => {
          handleCloseDrawer();
        }}
      />

      {/* Step-by-Step "How Store Rewards Work" Help Drawer */}
      <StoreHowItWorksDrawer
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onCreateClick={handleOpenCreate}
      />
    </div>
  );
};

// Aliases for compatibility
export const PillarTwoEcommerce = PillarTwoStore;
export const PillarTwoShopify = PillarTwoStore;

