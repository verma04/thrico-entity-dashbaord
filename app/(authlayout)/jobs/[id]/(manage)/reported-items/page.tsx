"use client";

import React from "react";
import { useParams } from "next/navigation";
import ItemReports from "@/components/reports/item-reports";
import { ReportModule } from "@/graphql/actions";

export default function JobReportedItemsPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <ItemReports 
      targetId={id} 
      moduleName={ReportModule.JOB} 
      permissionModule="JOBS" 
    />
  );
}
