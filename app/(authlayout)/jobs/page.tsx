"use client";

import JobsAnalytics from "@/components/jobs/dashboard/analytics";
import { withModulePermission } from "@/components/hoc/with-module-permission";

function JobsPage() {
  return <JobsAnalytics />;
}

export default withModulePermission(JobsPage, "JOBS", "canRead");
