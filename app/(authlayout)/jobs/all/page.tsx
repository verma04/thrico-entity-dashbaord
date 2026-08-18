"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import JobsManage from "@/components/jobs/manage/jobs-manage";

function AllJobsPage() {
  return <JobsManage status="ALL" />;
}

export default withSubscriptionCheck(
  withModulePermission(AllJobsPage, "JOBS", "canRead"),
  "jobs",
);
