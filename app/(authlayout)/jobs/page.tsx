"use client";

import { Suspense } from "react";
import JobsDashboard from "@/components/jobs/dashboard";
import { withModulePermission } from "@/components/hoc/with-module-permission";

/**
 * Jobs & Recruitment Dashboard Page
 * Route: /jobs
 */
function JobsPage() {
  return (
    <Suspense fallback={null}>
      <JobsDashboard />
    </Suspense>
  );
}

export default withModulePermission(JobsPage, "JOBS", "canRead");
