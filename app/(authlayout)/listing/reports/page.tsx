"use client";

import React from "react";
import Reports from "../../../../components/reports/Reports";
import { ReportModule } from "@/graphql/actions";

export default function ListingReportsPage() {
  return <Reports preselectedModule={ReportModule.LISTING} />;
}
