"use client";

import { Suspense } from "react";
import CommunitiesAnalytics from "@/components/communities/dashboard/analytics";
import { withModulePermission } from "@/components/hoc/with-module-permission";

/**
 * Communities Dashboard & Analytics Page
 * Route: /communities
 *
 * Displays high-level ecosystem metrics, community growth charts,
 * leaderboard rankings, top creators, and status distribution.
 */
const CommunitiesDashboardPage = () => {
  return (
    <Suspense fallback={null}>
      <CommunitiesAnalytics />
    </Suspense>
  );
};

export default withModulePermission(
  CommunitiesDashboardPage,
  "COMMUNITIES",
  "canRead",
);
