"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import MentorsManage from "@/components/mentorship/manage/mentors-manage";

function AllMentorsPage() {
  return <MentorsManage status="ALL" />;
}

export default withSubscriptionCheck(
  withModulePermission(AllMentorsPage, "MENTORSHIP", "canRead"),
  "mentorship",
);
