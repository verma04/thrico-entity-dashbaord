"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import React from "react";
import PollsAnalytics from "@/components/polls/dashboard/analytics";

function PollsAnalyticsPage() {
  return <PollsAnalytics />;
}

export default withSubscriptionCheck(
  withModulePermission(PollsAnalyticsPage, "POLLS", "canRead"),
  "polls"
);
