"use client";

import React from "react";
import { ModuleAuditLog } from "@/components/shared/module-audit-log";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useModuleStore } from "@/store/useModuleStore";

function ListingAuditLogPage() {
  const moduleName = useModuleStore((state) => state.listingModuleName);
  return (
    <ModuleAuditLog
      moduleKey="LISTING"
      title={`${moduleName} Audit Log`}
      description={`Track all administrative activity for the ${moduleName} module.`}
    />
  );
}

export default withModulePermission(
  ListingAuditLogPage,
  "LISTING",
  "canRead"
);
