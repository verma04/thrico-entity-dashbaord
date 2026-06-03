"use client";

import React from "react";
import { ModuleAuditLog } from "@/components/shared/module-audit-log";
import { withModulePermission } from "@/components/hoc/with-module-permission";

function JobsAuditLogPage() {
  return (
    <ModuleAuditLog
      moduleKey="JOBS"
      title="Jobs Audit Log"
      description="Track all administrative activity for the Jobs module."
    />
  );
}

export default withModulePermission(
  JobsAuditLogPage,
  "JOBS",
  "canRead"
);
