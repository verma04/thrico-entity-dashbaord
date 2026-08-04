"use client";

import React from "react";
import Reports from "../../../../components/reports/Reports";
import { ReportModule } from "@/graphql/actions";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useModulePermission } from "@/hooks/use-module-permission";

import { useModuleStore } from "@/store/useModuleStore";

function ListingReportsPage() {
  const canEdit = useModulePermission("LISTING", "canEdit");
  const moduleName = useModuleStore((state) => state.listingModuleName);
  return (
    <Reports 
      preselectedModule={ReportModule.LISTING} 
      canEdit={canEdit}
      breadcrumbs={[
        { label: moduleName, href: "/listing" },
        { label: "Reports" }
      ]}
    />
  );
}

export default withModulePermission(
  ListingReportsPage,
  "LISTING",
  "canRead"
);
