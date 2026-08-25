"use client";

import { Suspense } from "react";
import FeedDashboard from "@/components/feed/dashboard";
import { withModulePermission } from "@/components/hoc/with-module-permission";

/**
 * Feed Ecosystem Dashboard & Analytics Page
 * Route: /feed
 */
const FeedDashboardPage = () => {
  return (
    <Suspense fallback={null}>
      <FeedDashboard />
    </Suspense>
  );
};

export default withModulePermission(FeedDashboardPage, "FEED", "canRead");
