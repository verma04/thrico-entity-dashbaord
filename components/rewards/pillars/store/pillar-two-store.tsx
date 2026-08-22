"use client";

import React, { useState } from "react";
import { StoreBanner } from "./store-banner";
import { StoreRewardsManage } from "./table";
import { StoreRewardDrawer } from "./drawer";
import { StoreHowItWorksDrawer } from "./help";

export const PillarTwoStore: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  return (
    <div className="space-y-5 animate-in fade-in-50 duration-200">
      {/* Header Banner with Create & How It Works triggers */}
      <StoreBanner
        onCreateClick={() => setIsDrawerOpen(true)}
        onHowItWorksClick={() => setIsHowItWorksOpen(true)}
      />

      {/* Master Directory & Table View (List & Grid) */}
      <div className="space-y-3">
        <StoreRewardsManage onCreateClick={() => setIsDrawerOpen(true)} />
      </div>

      {/* Store Reward Creation Drawer */}
      <StoreRewardDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSuccess={() => setIsDrawerOpen(false)}
      />

      {/* Step-by-Step "How Store Rewards Work" Help Drawer */}
      <StoreHowItWorksDrawer
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onCreateClick={() => setIsDrawerOpen(true)}
      />
    </div>
  );
};

// Aliases for compatibility
export const PillarTwoEcommerce = PillarTwoStore;
export const PillarTwoShopify = PillarTwoStore;
