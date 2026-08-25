"use client";

import { Suspense } from "react";
import EventsDashboard from "@/components/events/dashboard";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

/**
 * Events Ecosystem Dashboard & Analytics Page
 * Route: /events
 */
const EventsDashboardPage = () => {
  return (
    <Suspense fallback={null}>
      <EventsDashboard />
    </Suspense>
  );
};

export default withSubscriptionCheck(
  withModulePermission(EventsDashboardPage, "EVENTS", "canRead"),
  "events",
);
