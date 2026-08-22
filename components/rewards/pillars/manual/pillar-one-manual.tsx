"use client";

import React, { useState } from "react";
import { ManualBanner } from "./manual-banner";
import { ManualRewardsManage } from "./table";
import { InternalRewardDrawer } from "./drawer";
import { ManualHowItWorksDrawer } from "./help";

export const PillarOneManual: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  return (
    <div className="space-y-5 animate-in fade-in-50 duration-200">
      {/* Header Banner with Create & How It Works triggers */}
      <ManualBanner
        onCreateClick={() => setIsDrawerOpen(true)}
        onHowItWorksClick={() => setIsHowItWorksOpen(true)}
      />

      {/* Master Directory & Table View (List & Grid) */}
      <div className="space-y-3">
        <ManualRewardsManage onCreateClick={() => setIsDrawerOpen(true)} />
      </div>

      {/* Internal Reward Creation Drawer */}
      <InternalRewardDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSuccess={() => setIsDrawerOpen(false)}
      />

      {/* Step-by-Step "How Manual Works" Help Drawer */}
      <ManualHowItWorksDrawer
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onCreateClick={() => setIsDrawerOpen(true)}
      />
    </div>
  );
};
