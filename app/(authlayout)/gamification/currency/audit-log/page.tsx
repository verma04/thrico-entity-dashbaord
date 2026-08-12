"use client";

import React from "react";
import { ModuleAuditLog } from "@/components/shared/module-audit-log";
import { useModuleStore } from "@/store/useModuleStore";

export default function CurrencyAuditLogPage() {
  const currencyModuleName = useModuleStore(
    (state) => state.currencyModuleName,
  );

  return (
    <ModuleAuditLog
      moduleKey="CURRENCY"
      title="Audit Log"
      description={`History of configuration changes made to ${currencyModuleName.toLowerCase()}.`}
      breadcrumbs={[
        { label: "Gamification", href: "/gamification" },
        { label: "Currency", href: "/gamification/currency" },
        { label: "Audit Log" },
      ]}
    />
  );
}
