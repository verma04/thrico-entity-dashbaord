"use client";

import React from "react";
import { ModuleAuditLog } from "@/components/shared/module-audit-log";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useModuleStore } from "@/store/useModuleStore";

function CommunitiesAuditLogPage() {
  const moduleName = useModuleStore((state) => state.communityModuleName);

  return (
    <ModuleAuditLog
      moduleKey="COMMUNITIES"
      title={`${moduleName} Audit Log`}
      description={`Track all administrative activity for the ${moduleName} module.`}
      breadcrumbs={[
        { label: moduleName, href: "/communities" },
        { label: "Audit Log" }
      ]}
    />
  );
}

export default withModulePermission(
  CommunitiesAuditLogPage,
  "COMMUNITIES",
  "canRead"
);
