"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import PollsManage from "@/components/polls/manage/polls-manage";

function PollsAllPage() {
  return <PollsManage status="ALL" />;
}

export default withSubscriptionCheck(
  withModulePermission(PollsAllPage, "POLLS", "canRead"),
  "polls",
);
