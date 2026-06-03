"use client";

import React from "react";
import { ModuleAuditLog } from "@/components/shared/module-audit-log";
import { withModulePermission } from "@/components/hoc/with-module-permission";

function CommunitiesAuditLogPage() {
  return (
    <ModuleAuditLog
      moduleKey="COMMUNITIES"
      title="Communities Audit Log"
      description="Track all administrative activity for the Communities module."
    />
  );
}

export default withModulePermission(
  CommunitiesAuditLogPage,
  "COMMUNITIES",
  "canRead"
);
