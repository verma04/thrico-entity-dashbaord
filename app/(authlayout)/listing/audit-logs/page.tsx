"use client";

import React from "react";
import { ModuleAuditLog } from "@/components/shared/module-audit-log";
import { withModulePermission } from "@/components/hoc/with-module-permission";

function ListingAuditLogPage() {
  return (
    <ModuleAuditLog
      moduleKey="LISTING"
      title="Listing Audit Log"
      description="Track all administrative activity for the Listing module."
    />
  );
}

export default withModulePermission(
  ListingAuditLogPage,
  "LISTING",
  "canRead"
);
