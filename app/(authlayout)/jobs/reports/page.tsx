"use client";

import React from "react";
import Reports from "../../../../components/reports/Reports";
import { ReportModule } from "@/graphql/actions";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useModulePermission } from "@/hooks/use-module-permission";

function JobReportsPage() {
  const canEdit = useModulePermission("JOBS", "canEdit");
  return <Reports preselectedModule={ReportModule.JOB} canEdit={canEdit} />;
}

export default withModulePermission(
  JobReportsPage,
  "JOBS",
  "canRead"
);
