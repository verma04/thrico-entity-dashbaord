"use client";

import React from "react";
import Reports from "../../../../components/reports/Reports";
import { ReportModule } from "@/graphql/actions";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useModulePermission } from "@/hooks/use-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import { useModuleStore } from "@/store/useModuleStore";

function MomentsReportsPage() {
  const canEdit = useModulePermission("MOMENTS", "canEdit");
  const moduleName = useModuleStore((state) => state.momentModuleName);
  return (
    <Reports 
      preselectedModule={ReportModule.MOMENT} 
      canEdit={canEdit}
      breadcrumbs={[
        { label: moduleName, href: "/moments" },
        { label: "Reports" }
      ]}
    />
  );
}

export default withSubscriptionCheck(
  withModulePermission(MomentsReportsPage, "MOMENTS", "canRead"),
  "moments"
);
