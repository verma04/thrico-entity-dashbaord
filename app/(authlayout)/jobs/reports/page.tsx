"use client";

import React from "react";
import Reports from "../../../../components/reports/Reports";
import { ReportModule } from "@/graphql/actions";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useModulePermission } from "@/hooks/use-module-permission";

import { useModuleStore } from "@/store/useModuleStore";

function JobReportsPage() {
  const canEdit = useModulePermission("JOBS", "canEdit");
  const moduleName = useModuleStore((state) => state.jobModuleName);
  return (
    <Reports 
      preselectedModule={ReportModule.JOB} 
      canEdit={canEdit}
      breadcrumbs={[
        { label: moduleName, href: "/jobs" },
        { label: "Reports" }
      ]}
    />
  );
}

export default withModulePermission(
  JobReportsPage,
  "JOBS",
  "canRead"
);
