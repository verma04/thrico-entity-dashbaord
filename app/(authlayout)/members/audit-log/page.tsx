"use client";

import React from "react";
import { ModuleAuditLog } from "@/components/shared/module-audit-log";
import { withModulePermission } from "@/components/hoc/with-module-permission";

function MembersAuditLogPage() {
  return (
    <ModuleAuditLog
      moduleKey="USERS"
      title="Members Audit Log"
      description="Track all administrative activity for the Members module."
      tableSize="sm"
      breadcrumbs={[
        { label: "Members", href: "/members" },
        { label: "Audit Log" }
      ]}
    />
  );
}

export default withModulePermission(
  MembersAuditLogPage,
  "NETWORK",
  "canRead"
);
