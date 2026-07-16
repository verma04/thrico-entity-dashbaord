"use client";

import React from "react";
import Reports from "../../../../components/reports/Reports";
import { ReportModule } from "@/graphql/actions";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useModulePermission } from "@/hooks/use-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

function MomentsReportsPage() {
  const canEdit = useModulePermission("MOMENTS", "canEdit");
  return <Reports preselectedModule={ReportModule.MOMENT} canEdit={canEdit} />;
}

export default withSubscriptionCheck(
  withModulePermission(MomentsReportsPage, "MOMENTS", "canRead"),
  "moments"
);
