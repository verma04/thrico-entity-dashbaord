"use client";

import React from "react";
import Reports from "../../../../components/reports/Reports";
import { ReportModule } from "@/graphql/actions";

export default function CommunityReportsPage() {
  return (
    <Reports
      preselectedModule={ReportModule.FEED}
      breadcrumbs={[
        { label: "Feed", href: "/feed" },
        { label: "Reports" },
      ]}
    />
  );
}
