"use client";

import React, { Suspense } from "react";
import { GamificationAutomationManage } from "@/components/gamification/automation/gamification-automation-manage";
import { withModulePermission } from "@/components/hoc/with-module-permission";

const GamificationAutomationPage = () => {
  return (
    <Suspense fallback={null}>
      <GamificationAutomationManage />
    </Suspense>
  );
};

export default withModulePermission(
  GamificationAutomationPage,
  "POINTS_BADGES",
  "canRead"
);
