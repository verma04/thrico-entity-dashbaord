"use client";

import React from "react";
import { CurrencyAutomationManage } from "@/components/gamification/currency/automation/currency-automation-manage";
import { withModulePermission } from "@/components/hoc/with-module-permission";

function CurrencyAutomationPage() {
  return <CurrencyAutomationManage />;
}

export default withModulePermission(
  CurrencyAutomationPage,
  "CURRENCY",
  "canRead"
);
