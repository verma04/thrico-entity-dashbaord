"use client";

import React from "react";
import { AutomationManage } from "@/components/members/automation/automation-manage";
import { withModulePermission } from "@/components/hoc/with-module-permission";

const AutomationPage = () => {
  return <AutomationManage />;
};

export default withModulePermission(AutomationPage, "NETWORK", "canRead");
