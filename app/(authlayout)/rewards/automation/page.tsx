"use client";

import React from "react";
import { RewardsAutomationManage } from "@/components/rewards/automation/rewards-automation-manage";
import { withModulePermission } from "@/components/hoc/with-module-permission";

const RewardsAutomationAliasPage = () => {
  return <RewardsAutomationManage />;
};

export default withModulePermission(
  RewardsAutomationAliasPage,
  "REWARDS",
  "canRead"
);
