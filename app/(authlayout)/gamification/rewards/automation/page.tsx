"use client";

import React from "react";
import { RewardsAutomationManage } from "@/components/rewards/automation/rewards-automation-manage";
import { withModulePermission } from "@/components/hoc/with-module-permission";

const RewardsAutomationPage = () => {
  return <RewardsAutomationManage />;
};

export default withModulePermission(
  RewardsAutomationPage,
  "REWARDS",
  "canRead"
);
