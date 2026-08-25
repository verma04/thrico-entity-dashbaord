"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ManualBanner } from "./manual-banner";
import { ManualRewardsManage } from "./table";
import { InternalRewardDrawer } from "./drawer";
import { ManualHowItWorksDrawer } from "./help";
import { ManualRewardItem } from "./table/manual-reward-card";

interface PillarOneManualProps {
  isExternalDrawerOpen?: boolean;
  setIsExternalDrawerOpen?: (open: boolean) => void;
  isExternalHowItWorksOpen?: boolean;
  setIsExternalHowItWorksOpen?: (open: boolean) => void;
  initialEditId?: string | null;
}

export const PillarOneManual: React.FC<PillarOneManualProps> = ({
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
  const [editingItem, setEditingItem] = useState<ManualRewardItem | null>(null);

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
    setEditingItem(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (item: ManualRewardItem) => {
    setEditingItem(item);
    setIsDrawerOpen(true);
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
      <ManualBanner
        onCreateClick={handleOpenCreate}
        onHowItWorksClick={() => setIsHowItWorksOpen(true)}
      />

      {/* Master Directory & Table View (List & Grid) */}
      <div className="space-y-3">
        <ManualRewardsManage
          onCreateClick={handleOpenCreate}
          onEditClick={handleOpenEdit}
        />
      </div>

      {/* Internal Reward Creation Drawer */}
      <InternalRewardDrawer
        isOpen={isDrawerOpen}
        initialItem={editingItem}
        id={initialEditId || undefined}
        onClose={handleCloseDrawer}
        onSuccess={handleCloseDrawer}
      />

      {/* Step-by-Step "How Manual Works" Help Drawer */}
      <ManualHowItWorksDrawer
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onCreateClick={handleOpenCreate}
      />
    </div>
  );
};

