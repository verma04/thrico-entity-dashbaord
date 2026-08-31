"use client";

import React from "react";
import { ModuleAuditLog } from "@/components/shared/module-audit-log";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { useModuleStore } from "@/store/useModuleStore";

function SurveysAuditLogPage() {
  const moduleName = useModuleStore((state) => state.surveyModuleName);

  return (
    <ModuleAuditLog
      moduleKey="SURVEYS"
      title={`${moduleName} Audit Log`}
      description={`Track all administrative activity for the ${moduleName} module.`}
      tableSize="sm"
      breadcrumbs={[
        { label: moduleName, href: "/surveys" },
        { label: "Audit Log" },
      ]}
    />
  );
}

export default withSubscriptionCheck(
  withModulePermission(SurveysAuditLogPage, "SURVEYS", "canRead"),
  "surveys",
);
