"use client";

import React from "react";
import Reports from "../../../../components/reports/Reports";
import { ReportModule } from "@/graphql/actions";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useModulePermission } from "@/hooks/use-module-permission";

function ListingReportsPage() {
  const canEdit = useModulePermission("LISTING", "canEdit");
  return <Reports preselectedModule={ReportModule.LISTING} canEdit={canEdit} />;
}

export default withModulePermission(
  ListingReportsPage,
  "LISTING",
  "canRead"
);
