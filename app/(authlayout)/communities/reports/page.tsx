"use client";

import React from "react";
import Reports from "../../../../components/reports/Reports";
import { ReportModule } from "@/graphql/actions";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useModulePermission } from "@/hooks/use-module-permission";

function CommunityReportsPage() {
  const canEdit = useModulePermission("COMMUNITIES", "canEdit");
  return <Reports preselectedModule={ReportModule.COMMUNITY} canEdit={canEdit} />;
}

export default withModulePermission(
  CommunityReportsPage,
  "COMMUNITIES",
  "canRead"
);

