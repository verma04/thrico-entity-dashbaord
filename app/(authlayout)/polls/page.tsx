"use client";

import { Suspense } from "react";
import PollsDashboard from "@/components/polls/dashboard";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

/**
 * Polls & Sentiment Hub Dashboard Page
 * Route: /polls
 */
function PollsDashboardPage() {
  return (
    <Suspense fallback={null}>
      <PollsDashboard />
    </Suspense>
  );
}

export default withSubscriptionCheck(
  withModulePermission(PollsDashboardPage, "POLLS", "canRead"),
  "polls"
);
